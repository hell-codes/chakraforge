import { NavNode, NavEdge, Vector2D } from '../../types/simulation';
import { ChakravyuhaFormation } from '../formation/Chakravyuha';
import { distance2D, normalizeAngle } from '../utils/math';

export class NavGraph {
  public nodes: Map<string, NavNode> = new Map();
  public adjacency: Map<string, NavEdge[]> = new Map();

  constructor(formation?: ChakravyuhaFormation) {
    if (formation) {
      this.buildGraph(formation);
    }
  }

  /**
   * Constructs the discrete mathematical navigation graph for the Chakravyūha.
   * Rings are indexed 1..N from innermost to outermost.
   * Corridors exist between adjacent rings, with gate nodes allowing inward/outward transition.
   */
  public buildGraph(formation: ChakravyuhaFormation): void {
    this.nodes.clear();
    this.adjacency.clear();

    const ringCount = formation.rings.length;
    const outerRing = formation.rings[ringCount - 1];
    const outerRadius = outerRing ? outerRing.radius : 25;
    const baseRadius = formation.config.baseRadius || 3.5;

    // 1. Outside Staging & Approach Nodes (North Approach corridor)
    const stagingNode: NavNode = {
      id: 'node-outside-staging',
      x: 0,
      y: outerRadius + 8.0,
      ringIndex: 0,
      angle: Math.PI / 2
    };
    const approachNode: NavNode = {
      id: 'node-outside-approach',
      x: 0,
      y: outerRadius + 4.0,
      ringIndex: 0,
      angle: Math.PI / 2
    };
    const outerBreachNode: NavNode = {
      id: 'node-outer-breach',
      x: 0,
      y: outerRadius,
      ringIndex: ringCount,
      angle: Math.PI / 2,
      isGateNode: true,
      gateId: `gate-r${ringCount}-g0`
    };

    this.addNode(stagingNode);
    this.addNode(approachNode);
    this.addNode(outerBreachNode);

    this.addEdge(stagingNode.id, approachNode.id, distance2D(stagingNode, approachNode));
    this.addEdge(approachNode.id, outerBreachNode.id, distance2D(approachNode, outerBreachNode), true, outerBreachNode.gateId);

    // 2. Build Annular Corridors and Gate Nodes for Each Tier
    const CORRIDOR_SEGMENTS = 72; // High resolution nodes for smooth rotating gate alignment
    const corridorRadii: number[] = [];

    // Calculate corridor radii between rings
    for (let r = 1; r <= ringCount; r++) {
      const innerR = r === 1 ? baseRadius : formation.rings[r - 2].radius;
      const outerR = formation.rings[r - 1].radius;
      const midR = (innerR + outerR) / 2;
      corridorRadii.push(midR);
    }

    for (let tier = 1; tier <= ringCount; tier++) {
      const radius = corridorRadii[tier - 1];
      const tierNodeIds: string[] = [];

      for (let s = 0; s < CORRIDOR_SEGMENTS; s++) {
        const angle = (s / CORRIDOR_SEGMENTS) * 2 * Math.PI;
        const nodeId = `node-t${tier}-s${s}`;
        // Apply the same Labyrinth Spiral offset to the navigation graph
        // so the agents pathfind perfectly along the spiral corridors.
        // normAngle relative to a 0 rotation (since NavGraph is static relative to the ring's 0-state)
        let normAngle = angle % (Math.PI * 2);
        if (normAngle < 0) normAngle += Math.PI * 2;
        const spiralOffset = (normAngle / (Math.PI * 2)) * 3.2; // 3.2 is ringSpacing
        const spiralRadius = radius - spiralOffset;

        const node: NavNode = {
          id: nodeId,
          x: Math.cos(angle) * spiralRadius,
          y: Math.sin(angle) * spiralRadius,
          ringIndex: tier,
          angle
        };

        this.addNode(node);
        tierNodeIds.push(nodeId);
      }

      // Connect nodes sequentially along circular corridor
      for (let s = 0; s < CORRIDOR_SEGMENTS; s++) {
        const fromId = tierNodeIds[s];
        const toId = tierNodeIds[(s + 1) % CORRIDOR_SEGMENTS];
        const dist = distance2D(this.nodes.get(fromId)!, this.nodes.get(toId)!);
        this.addEdge(fromId, toId, dist);
      }
    }

    // 3. Connect Outer Breach to Tier N Outer Corridor
    // Outer breach is at North (angle PI/2). Connect it to the closest corridor nodes in Tier N
    const tierNNode = this.getClosestNodeInTier(outerBreachNode, ringCount);
    if (tierNNode) {
      this.addEdge(outerBreachNode.id, tierNNode.id, distance2D(outerBreachNode, tierNNode));
    }

    // 4. Central Formation Zone (Command Position at (0, 0))
    const centerNode: NavNode = {
      id: 'node-center-command',
      x: 0,
      y: 0,
      ringIndex: 1,
      angle: 0
    };
    this.addNode(centerNode);

    // Connect Center to Tier 1 inner corridor
    for (let s = 0; s < CORRIDOR_SEGMENTS; s += 4) {
      const t1Node = this.nodes.get(`node-t1-s${s}`);
      if (t1Node) {
        this.addEdge(centerNode.id, t1Node.id, distance2D(centerNode, t1Node), true);
      }
    }

    // 5. Connect Adjacent Tiers via Dynamic Gates
    this.updateDynamicGateStates(formation);
  }

  /**
   * Updates radial gate transition edges between adjacent concentric rings.
   * Gates that are currently open have passable edges; closed gates have blocked/removed edges.
   */
  public updateDynamicGateStates(formation: ChakravyuhaFormation): void {
    const worldGates = formation.getWorldGates();

    for (const gate of worldGates) {
      const ringIndex = gate.ringIndex;
      if (ringIndex <= 1 || ringIndex > formation.rings.length) continue;

      // Gate connects outer corridor (ringIndex) to inner corridor (ringIndex - 1)
      let gateAngle = Math.atan2(gate.y, gate.x);
      if (gateAngle < 0) gateAngle += Math.PI * 2;
      const CORRIDOR_SEGMENTS = 72;
      let s = Math.round((gateAngle / (Math.PI * 2)) * CORRIDOR_SEGMENTS) % CORRIDOR_SEGMENTS;
      if (s < 0) s += CORRIDOR_SEGMENTS;

      const outerTierNode = this.nodes.get(`node-t${ringIndex}-s${s}`);
      const innerTierNode = this.nodes.get(`node-t${ringIndex - 1}-s${s}`);

      if (outerTierNode && innerTierNode) {
        const isSealed = formation.isJayadrathaSealed && gate.isBreachGate;
        const isPassable = gate.isOpen && !isSealed;
        const dist = distance2D(outerTierNode, innerTierNode);

        this.setEdgeState(outerTierNode.id, innerTierNode.id, isPassable, dist, gate.id);
      }
    }

    // Outer breach gate status (North entrance held/sealed by Jayadratha)
    const outerBreachGate = worldGates.find((g) => g.ringIndex === formation.rings.length && g.isBreachGate);
    const outerBreachPassable = outerBreachGate ? (outerBreachGate.isOpen && !formation.isJayadrathaSealed) : !formation.isJayadrathaSealed;
    this.setEdgeState(
      'node-outside-approach',
      'node-outer-breach',
      outerBreachPassable,
      4.0,
      outerBreachGate?.id || 'gate-outer-breach'
    );
  }

  private addNode(node: NavNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, []);
    }
  }

  private addEdge(from: string, to: string, weight: number, isGateTransition: boolean = false, gateId?: string): void {
    // Bi-directional edge
    this.adjacency.get(from)?.push({ from, to, weight, isGateTransition, gateId, isBlocked: false });
    this.adjacency.get(to)?.push({ from: to, to: from, weight, isGateTransition, gateId, isBlocked: false });
  }

  private setEdgeState(nodeA: string, nodeB: string, isOpen: boolean, weight: number, gateId: string): void {
    const updateEdges = (from: string, to: string) => {
      const edges = this.adjacency.get(from) || [];
      const existing = edges.find((e) => e.to === to);
      if (existing) {
        existing.isBlocked = !isOpen;
        existing.weight = isOpen ? weight : 999999;
      } else {
        edges.push({ from, to, weight: isOpen ? weight : 999999, isGateTransition: true, gateId, isBlocked: !isOpen });
      }
    };

    updateEdges(nodeA, nodeB);
    updateEdges(nodeB, nodeA);
  }

  private getClosestNodeInTier(pos: Vector2D, tier: number): NavNode | null {
    let closest: NavNode | null = null;
    let minDist = Infinity;

    for (const node of this.nodes.values()) {
      if (node.ringIndex === tier) {
        const d = distance2D(pos, node);
        if (d < minDist) {
          minDist = d;
          closest = node;
        }
      }
    }
    return closest;
  }

  public getNearestNode(pos: Vector2D): NavNode | null {
    let closest: NavNode | null = null;
    let minDist = Infinity;

    for (const node of this.nodes.values()) {
      const d = distance2D(pos, node);
      if (d < minDist) {
        minDist = d;
        closest = node;
      }
    }
    return closest;
  }

  /**
   * A* Shortest Path algorithm on the Chakravyūha Navigation Graph.
   * Strictly traverses navigable corridors and open gate transitions.
   */
  public findPath(
    startPos: Vector2D,
    targetPos: Vector2D,
    formation?: ChakravyuhaFormation
  ): Vector2D[] | null {
    if (formation) {
      this.updateDynamicGateStates(formation);
    }

    const startNode = this.getNearestNode(startPos);
    const targetNode = this.getNearestNode(targetPos);

    if (!startNode || !targetNode) return null;
    if (startNode.id === targetNode.id) return [{ x: targetPos.x, y: targetPos.y }];

    const openSet = new Set<string>([startNode.id]);
    const cameFrom = new Map<string, string>();

    const gScore = new Map<string, number>();
    gScore.set(startNode.id, 0);

    const fScore = new Map<string, number>();
    fScore.set(startNode.id, distance2D(startNode, targetNode));

    while (openSet.size > 0) {
      // Find node in openSet with lowest fScore
      let currentId: string | null = null;
      let lowestF = Infinity;

      for (const id of openSet) {
        const score = fScore.get(id) ?? Infinity;
        if (score < lowestF) {
          lowestF = score;
          currentId = id;
        }
      }

      if (!currentId) break;

      if (currentId === targetNode.id) {
        // Reconstruct path
        const path: Vector2D[] = [{ x: targetPos.x, y: targetPos.y }];
        let curr: string | undefined = currentId;

        while (curr && curr !== startNode.id) {
          const n = this.nodes.get(curr);
          if (n) path.unshift({ x: n.x, y: n.y });
          curr = cameFrom.get(curr);
        }
        return path;
      }

      openSet.delete(currentId);
      const neighbors = this.adjacency.get(currentId) || [];

      for (const edge of neighbors) {
        if (edge.isBlocked) continue; // Impassable wall or closed gate

        const tentativeG = (gScore.get(currentId) ?? Infinity) + edge.weight;
        const neighborNode = this.nodes.get(edge.to);
        if (!neighborNode) continue;

        if (tentativeG < (gScore.get(edge.to) ?? Infinity)) {
          cameFrom.set(edge.to, currentId);
          gScore.set(edge.to, tentativeG);
          fScore.set(edge.to, tentativeG + distance2D(neighborNode, targetNode));
          openSet.add(edge.to);
        }
      }
    }

    return null; // NO VALID PATH (formation wall or locked gate prevents movement)
  }

  public getNodes(): NavNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(): NavEdge[] {
    const result: NavEdge[] = [];
    const seen = new Set<string>();

    for (const edgeList of this.adjacency.values()) {
      for (const edge of edgeList) {
        const key = [edge.from, edge.to].sort().join('-');
        if (!seen.has(key)) {
          seen.add(key);
          result.push(edge);
        }
      }
    }
    return result;
  }
}
