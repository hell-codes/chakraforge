import {
  AgentState,
  Vector2D,
  StrategyType,
  CommMessageType,
  ExitCandidatePath
} from '../../types/simulation';
import { ChakravyuhaFormation } from '../formation/Chakravyuha';
import { distance2D, normalize2D, normalizeAngle, PRNG } from '../utils/math';
import { CommBus } from '../communication/CommBus';

export interface StrategyDecision {
  desiredVelocity: Vector2D;
  newAction: string;
  decisionReason: string;
  decisionExplanation: string;
  factors: { factor: string; weight: number; impact: string }[];
  plannedWaypoints: Vector2D[];
  broadcastMessage?: { type: CommMessageType; payload: any };
  exitCandidatePaths?: ExitCandidatePath[];
  bestPredictedExit?: ExitCandidatePath | null;
}

export class StrategyEngine {
  private prng: PRNG;

  constructor(seed: number = 1000) {
    this.prng = new PRNG(seed);
  }

  public computeDecision(
    agent: AgentState,
    allAgents: AgentState[],
    formation: ChakravyuhaFormation,
    commBus: CommBus,
    currentStep: number
  ): StrategyDecision {
    switch (agent.strategy) {
      case 'RANDOM':
        return this.computeRandom(agent, currentStep);
      case 'GREEDY':
        return this.computeGreedy(agent, formation, currentStep);
      case 'SHORTEST_PATH':
        return this.computeShortestPath(agent, formation, currentStep);
      case 'INFORMATION_AWARE':
        return this.computeInformationAware(agent, formation, currentStep);
      case 'COMMUNICATION_AWARE':
        return this.computeCommunicationAware(agent, formation, commBus, currentStep);
      case 'COORDINATED':
        return this.computeCoordinated(agent, allAgents, formation, commBus, currentStep);
      case 'ADAPTIVE':
        return this.computeAdaptive(agent, allAgents, formation, commBus, currentStep);
      default:
        return this.computeGreedy(agent, formation, currentStep);
    }
  }

  // 1. RANDOM BROWNIAN WALK (Baseline)
  private computeRandom(agent: AgentState, currentStep: number): StrategyDecision {
    let heading = agent.heading;
    if (currentStep % 8 === 0 || agent.stuckSteps > 2) {
      heading = this.prng.range(0, 2 * Math.PI);
    }

    const desiredVelocity: Vector2D = {
      x: Math.cos(heading) * agent.speed,
      y: Math.sin(heading) * agent.speed
    };

    return {
      desiredVelocity,
      newAction: 'Random Exploration',
      decisionReason: 'Stochastic heading sampled with zero terrain knowledge.',
      decisionExplanation: `Agent randomly sampled heading ${(heading * 57.3).toFixed(1)}°. Baseline policy without heuristic guidance.`,
      factors: [{ factor: 'Stochastic Drift', weight: 1.0, impact: 'Blind exploratory motion' }],
      plannedWaypoints: [
        { x: agent.position.x + desiredVelocity.x * 4, y: agent.position.y + desiredVelocity.y * 4 }
      ]
    };
  }

  // 2. GREEDY RADIAL DESCENT — with gate-orbiting when stuck
  private computeGreedy(agent: AgentState, formation: ChakravyuhaFormation, currentStep: number): StrategyDecision {
    const target = agent.knownTarget || formation.targetPos;
    const toTarget = { x: target.x - agent.position.x, y: target.y - agent.position.y };
    const dist = Math.sqrt(toTarget.x * toTarget.x + toTarget.y * toTarget.y);

    if (dist < 0.4) {
      return {
        desiredVelocity: { x: 0, y: 0 },
        newAction: 'Central Formation Reached',
        decisionReason: 'Reached target Central Formation.',
        decisionExplanation: 'Agent has reached within objective radius (0,0).',
        factors: [{ factor: 'Target Proximity', weight: 1.0, impact: 'Destination achieved' }],
        plannedWaypoints: []
      };
    }

    const dir = normalize2D(toTarget);
    let desiredVelocity: Vector2D = {
      x: dir.x * agent.speed,
      y: dir.y * agent.speed
    };

    let actionDesc = 'Advancing toward Central Division';
    let rationale = 'Steering directly toward center — Abhimanyu pierces inward.';

    // GATE-ORBIT FIX: When blocked, find nearest open gate on blocking ring and orbit toward it
    if (agent.stuckSteps > 2) {
      const currentRadius = Math.sqrt(agent.position.x * agent.position.x + agent.position.y * agent.position.y);
      const targetRadius = Math.sqrt(target.x * target.x + target.y * target.y);
      const isHeadingOutward = targetRadius > currentRadius + 0.5;

      const blockingRing = isHeadingOutward
        ? [...formation.rings].sort((a, b) => a.radius - b.radius).find((r) => r.radius > currentRadius + 0.3)
        : [...formation.rings].sort((a, b) => b.radius - a.radius).find((r) => r.radius < currentRadius - 0.3);
      
      if (blockingRing) {
        // Find nearest open gate on the blocking ring
        const worldGates = formation.getWorldGates().filter(
          (g) => g.ringIndex === blockingRing.index && (g.isOpen || !g.isBreachGate || isHeadingOutward)
        );
        
        if (worldGates.length > 0) {
          // Navigate directly to the nearest open gate
          const nearestGate = worldGates.reduce((best, g) => 
            distance2D(agent.position, g) < distance2D(agent.position, best) ? g : best
          );
          const toGate = { x: nearestGate.x - agent.position.x, y: nearestGate.y - agent.position.y };
          const gateDir = normalize2D(toGate);
          desiredVelocity = { x: gateDir.x * agent.speed, y: gateDir.y * agent.speed };
          actionDesc = `Piercing Gate on Tier ${blockingRing.index}`;
          rationale = `Gate detected on Tier ${blockingRing.index} at (${nearestGate.x.toFixed(1)}, ${nearestGate.y.toFixed(1)}) — steering through.`;
        } else {
          // Orbit tangentially along the blocking ring to find gate
          const angle = Math.atan2(agent.position.y, agent.position.x);
          const tangent: Vector2D = { x: -Math.sin(angle), y: Math.cos(angle) };
          const dir2 = currentStep % 20 < 10 ? 1 : -1;
          desiredVelocity = {
            x: (dir.x * 0.2 + tangent.x * dir2 * 0.8) * agent.speed,
            y: (dir.y * 0.2 + tangent.y * dir2 * 0.8) * agent.speed
          };
          actionDesc = 'Orbital Search (Gate Cycling)';
          rationale = `Awaiting gate aperture on Tier ${blockingRing.index} — orbiting ring.`;
        }
      } else {
        // Sliding along wall tangent
        const tangent: Vector2D = { x: -dir.y, y: dir.x };
        desiredVelocity = {
          x: (dir.x * 0.4 + tangent.x * 0.6) * agent.speed,
          y: (dir.y * 0.4 + tangent.y * 0.6) * agent.speed
        };
        actionDesc = 'Tangent Slide';
        rationale = 'Sliding along perimeter tangent toward aperture.';
      }
    }

    return {
      desiredVelocity,
      newAction: actionDesc,
      decisionReason: rationale,
      decisionExplanation: `Greedy descent with gate-orbit fallback: d=${dist.toFixed(1)}m to target. Stuck steps: ${agent.stuckSteps}.`,
      factors: [
        { factor: 'Target Gradient', weight: 0.7, impact: 'Direct pull toward target' },
        { factor: 'Gate Penetration', weight: 0.3, impact: 'Sequential tier breakthrough' }
      ],
      plannedWaypoints: [{ x: target.x, y: target.y }]
    };
  }

  // 3. SHORTEST PATH (NavGraph Corridor A*)
  private computeShortestPath(agent: AgentState, formation: ChakravyuhaFormation, currentStep: number): StrategyDecision {
    const target = agent.knownTarget || formation.targetPos;
    const distToTarget = distance2D(agent.position, target);

    if (distToTarget < 0.8) {
      return {
        desiredVelocity: { x: 0, y: 0 },
        newAction: 'Central Formation Reached',
        decisionReason: 'Reached target Central Formation (0,0).',
        decisionExplanation: 'Agent has reached the Central Formation of the Chakravyūha.',
        factors: [{ factor: 'Target Proximity', weight: 1.0, impact: 'Central Formation achieved' }],
        plannedWaypoints: []
      };
    }

    // Determine current waypoint path
    let waypoints = agent.plannedPath ? [...agent.plannedPath] : [];

    // Advance past reached waypoints (within 0.8m threshold)
    while (waypoints.length > 0 && distance2D(agent.position, waypoints[0]) < 0.8) {
      waypoints.shift();
    }

    // Recompute path if empty or periodically every 12 steps or when stuck
    if (waypoints.length === 0 || currentStep % 12 === 0 || agent.stuckSteps > 1) {
      if (formation.navGraph) {
        const computedPath = formation.navGraph.findPath(agent.position, target, formation);
        if (computedPath && computedPath.length > 0) {
          waypoints = computedPath.filter((wp) => distance2D(agent.position, wp) > 0.4);
          if (waypoints.length === 0 && computedPath.length > 0) {
            waypoints = [computedPath[computedPath.length - 1]];
          }
        }
      }
    }

    if (waypoints.length > 0) {
      const nextWp = waypoints[0];
      const toWp = { x: nextWp.x - agent.position.x, y: nextWp.y - agent.position.y };
      const dir = normalize2D(toWp);

      return {
        desiredVelocity: { x: dir.x * agent.speed, y: dir.y * agent.speed },
        newAction: `Navigating Corridor to (${nextWp.x.toFixed(1)}, ${nextWp.y.toFixed(1)})`,
        decisionReason: `Traversing tactical corridor towards Tier 1 Central Formation.`,
        decisionExplanation: `A* NavGraph planner active: navigating corridor with ${waypoints.length} waypoints remaining.`,
        factors: [
          { factor: 'Corridor Aperture', weight: 0.75, impact: 'Traversing open corridor' },
          { factor: 'Inner Descent', weight: 0.25, impact: `Distance to objective = ${distToTarget.toFixed(1)}m` }
        ],
        plannedWaypoints: waypoints
      };
    }

    // Fallback to greedy with gate-orbit when graph path is temporarily obstructed
    return this.computeGreedy(agent, formation, currentStep);
  }

  // 4. INFORMATION-AWARE — observes gates, orbits toward open apertures, penetrates sequentially
  private computeInformationAware(agent: AgentState, formation: ChakravyuhaFormation, currentStep: number): StrategyDecision {
    const target = agent.knownTarget || formation.targetPos;
    const currentRadius = Math.sqrt(agent.position.x * agent.position.x + agent.position.y * agent.position.y);
    const targetRadius = Math.sqrt(target.x * target.x + target.y * target.y);
    const isHeadingOutward = targetRadius > currentRadius + 0.8;
    const distToTarget = distance2D(agent.position, target);

    if (distToTarget < 0.6) {
      return {
        desiredVelocity: { x: 0, y: 0 },
        newAction: isHeadingOutward ? 'Exit Achieved' : 'Central Formation Reached',
        decisionReason: isHeadingOutward ? 'Safely reached external Pandava perimeter.' : 'Reached target Central Formation.',
        decisionExplanation: `Target objective (${target.x.toFixed(1)}, ${target.y.toFixed(1)}) successfully achieved.`,
        factors: [{ factor: 'Target Proximity', weight: 1.0, impact: 'Destination achieved' }],
        plannedWaypoints: []
      };
    }

    // Determine which ring we need to pass next (inward or outward)
    const blockingRing = isHeadingOutward
      ? [...formation.rings].sort((a, b) => a.radius - b.radius).find((r) => r.radius > currentRadius - 0.4)
      : [...formation.rings].sort((a, b) => b.radius - a.radius).find((r) => r.radius < currentRadius - 0.3);

    if (blockingRing) {
      // Get all gates on this ring accounting for current rotation
      const worldGates = formation.getWorldGates().filter((g) => g.ringIndex === blockingRing.index);
      // Filter genuinely open gates; if Jayadratha sealed the breach, the breach gate is impassable both ways
      const openGates = worldGates.filter(
        (g) => g.isOpen && (!formation.isJayadrathaSealed || !g.isBreachGate)
      );

      if (openGates.length > 0) {
        // Outermost ring picks the exit gate closest to exit objective; intermediate rings pick nearest open gate
        const isOuterRing = blockingRing.index === formation.rings[formation.rings.length - 1].index;
        const bestGate = (isHeadingOutward && isOuterRing)
          ? openGates.reduce((best, g) =>
              distance2D(g, target) < distance2D(best, target) ? g : best
            )
          : openGates.reduce((best, g) =>
              distance2D(agent.position, g) < distance2D(agent.position, best) ? g : best
            );
            
        const toGate = { x: bestGate.x - agent.position.x, y: bestGate.y - agent.position.y };
        let dir = normalize2D(toGate);

        // When heading outward, ensure velocity never cuts inward towards inner rings
        if (isHeadingOutward && currentRadius > 5.0) {
          const radNorm = normalize2D(agent.position);
          const radialComponent = dir.x * radNorm.x + dir.y * radNorm.y;
          // If the direct vector to the gate points inward or tangential, blend with outward spiral
          if (radialComponent < 0.25) {
            const agentAngle = Math.atan2(agent.position.y, agent.position.x);
            const gateAngle = Math.atan2(bestGate.y, bestGate.x);
            let angDiff = normalizeAngle(gateAngle - agentAngle);
            if (angDiff > Math.PI) angDiff -= 2 * Math.PI;
            if (angDiff < -Math.PI) angDiff += 2 * Math.PI;
            const orbitSign = angDiff >= 0 ? 1 : -1;
            const tangent = { x: -Math.sin(agentAngle) * orbitSign, y: Math.cos(agentAngle) * orbitSign };
            
            // Spiral outward along the corridor towards the gate
            dir = normalize2D({
              x: tangent.x * 0.65 + radNorm.x * 0.35,
              y: tangent.y * 0.65 + radNorm.y * 0.35
            });
          }
        }

        return {
          desiredVelocity: { x: dir.x * agent.speed, y: dir.y * agent.speed },
          newAction: isHeadingOutward
            ? `Breaking Out of Tier ${blockingRing.index} via Flank Gate`
            : `Piercing Tier ${blockingRing.index} via Open Gate`,
          decisionReason: `Aperture on Tier ${blockingRing.index} visible at angle ${(Math.atan2(bestGate.y, bestGate.x) * 57.3).toFixed(0)}°.`,
          decisionExplanation: `Information-Aware: driving chariot through verified open aperture on Tier ${blockingRing.index}.`,
          factors: [
            { factor: isHeadingOutward ? 'Breakout Alignment' : 'Direct Gate Visibility', weight: 0.85, impact: 'High epistemic certainty' },
            { factor: 'Penetration Momentum', weight: 0.15, impact: 'Unstoppable advance' }
          ],
          plannedWaypoints: [{ x: bestGate.x, y: bestGate.y }]
        };
      } else {
        // All gates on this ring closed — orbit tangentially to intercept opening gate
        const angle = Math.atan2(agent.position.y, agent.position.x);
        const closedGate = worldGates[0];
        const gateAngle = closedGate ? Math.atan2(closedGate.y, closedGate.x) : angle + 0.5;
        const angDiff = normalizeAngle(gateAngle - angle);
        const orbitDir = angDiff > 0 ? 1 : -1;

        const tangent: Vector2D = {
          x: -Math.sin(angle) * orbitDir,
          y:  Math.cos(angle) * orbitDir
        };
        const radialPull = isHeadingOutward
          ? normalize2D({ x: agent.position.x, y: agent.position.y })
          : normalize2D({ x: -agent.position.x, y: -agent.position.y });

        return {
          desiredVelocity: {
            x: (tangent.x * 0.75 + radialPull.x * 0.25) * agent.speed,
            y: (tangent.y * 0.75 + radialPull.y * 0.25) * agent.speed
          },
          newAction: `Orbiting Tier ${blockingRing.index} — Awaiting Aperture`,
          decisionReason: `All gates on Tier ${blockingRing.index} cycling. Orbiting at d=${currentRadius.toFixed(1)}m to intercept opening.`,
          decisionExplanation: `Information-Aware: executing orbit to intercept cyclic gate opening on Tier ${blockingRing.index}.`,
          factors: [
            { factor: 'Gate Phase Intercept', weight: 0.8, impact: 'Orbit toward next aperture' },
            { factor: 'Radial Pressure', weight: 0.2, impact: 'Maintain tier proximity' }
          ],
          plannedWaypoints: [{ x: agent.position.x + tangent.x * 2, y: agent.position.y + tangent.y * 2 }]
        };
      }
    }

    // No blocking ring — direct charge to target
    const toTarget = { x: target.x - agent.position.x, y: target.y - agent.position.y };
    const dir = normalize2D(toTarget);
    return {
      desiredVelocity: { x: dir.x * agent.speed, y: dir.y * agent.speed },
      newAction: isHeadingOutward ? 'Breakthrough to Safe Perimeter' : 'Charging into Central Command Position',
      decisionReason: isHeadingOutward ? 'Clear exit vector to external zone.' : 'Central formation clear — charging directly into core.',
      decisionExplanation: `Direct sprint to target (${target.x.toFixed(1)}, ${target.y.toFixed(1)}).`,
      factors: [{ factor: 'Direct Spearhead', weight: 1.0, impact: 'Full speed momentum' }],
      plannedWaypoints: [{ x: target.x, y: target.y }]
    };
  }

  // 5. COMMUNICATION-AWARE (Integrates radio packets & reports from allies)
  private computeCommunicationAware(
    agent: AgentState,
    formation: ChakravyuhaFormation,
    commBus: CommBus,
    currentStep: number
  ): StrategyDecision {
    // Check if any teammate reported a safe open breach or warned of a block
    const recentMessages = commBus.getPacketsForAgent(agent.id, currentStep);
    const gateReport = recentMessages.find((p: any) => p.type === 'GATE_OPENED' || p.type === 'ROUTE_SUGGESTION');

    if (gateReport && gateReport.payload?.gatePos) {
      const pos = gateReport.payload.gatePos;
      const dir = normalize2D({ x: pos.x - agent.position.x, y: pos.y - agent.position.y });

      return {
        desiredVelocity: { x: dir.x * agent.speed, y: dir.y * agent.speed },
        newAction: 'Routing to Ally-Reported Breach',
        decisionReason: `Acting on radio coordination from ${gateReport.senderId}.`,
        decisionExplanation: `Communication-Aware policy: agent received packet confirming safe transit through reported breach.`,
        factors: [
          { factor: 'Radio Packet Trust', weight: 0.75, impact: 'Ally shared gate discovery' },
          { factor: 'Penetration Vector', weight: 0.25, impact: 'Inward alignment' }
        ],
        plannedWaypoints: [{ x: pos.x, y: pos.y }]
      };
    }

    return this.computeInformationAware(agent, formation, currentStep);
  }

  // 6. COORDINATED SWARM (Belief synchronization + Reynolds flocking)
  private computeCoordinated(
    agent: AgentState,
    allAgents: AgentState[],
    formation: ChakravyuhaFormation,
    commBus: CommBus,
    currentStep: number
  ): StrategyDecision {
    const baseDecision = this.computeInformationAware(agent, formation, currentStep);

    // Flocking vectors: Goal attraction (v_goal), Separation (v_sep), Alignment (v_align)
    const vGoal = baseDecision.desiredVelocity;
    let vSep = { x: 0, y: 0 };
    let vAlign = { x: 0, y: 0 };
    let neighborCount = 0;

    const nearbyAgents = allAgents.filter(
      (other) => other.id !== agent.id && distance2D(agent.position, other.position) < 4.5 && other.team === agent.team
    );

    for (const other of nearbyAgents) {
      const d = distance2D(agent.position, other.position);
      if (d > 0.01) {
        const repulseWeight = (4.5 - d) / 4.5;
        vSep.x += ((agent.position.x - other.position.x) / d) * repulseWeight;
        vSep.y += ((agent.position.y - other.position.y) / d) * repulseWeight;
        vAlign.x += other.velocity.x;
        vAlign.y += other.velocity.y;
        neighborCount++;
      }
    }

    if (neighborCount > 0) {
      vAlign.x /= neighborCount;
      vAlign.y /= neighborCount;
    }

    const combined = {
      x: vGoal.x * 0.65 + vSep.x * 0.25 + vAlign.x * 0.1,
      y: vGoal.y * 0.65 + vSep.y * 0.25 + vAlign.y * 0.1
    };

    const speed = agent.speed;
    const finalDir = normalize2D(combined);
    const desiredVelocity: Vector2D = { x: finalDir.x * speed, y: finalDir.y * speed };

    let broadcastMessage: { type: CommMessageType; payload: any } | undefined = undefined;
    if (currentStep % 15 === 0 && agent.perception.visibleGates.some((g) => g.isOpen)) {
      const openGate = agent.perception.visibleGates.find((g) => g.isOpen);
      if (openGate) {
        broadcastMessage = {
          type: 'GATE_OPENED',
          payload: { ringIndex: openGate.ringIndex, angle: openGate.angle }
        };
      }
    }

    return {
      desiredVelocity,
      newAction: neighborCount > 0 ? 'Coordinated Advance' : baseDecision.newAction,
      decisionReason: 'Synchronizing with team: balancing penetration with anti-congestion.',
      decisionExplanation: `Coordinated: goal 0.65, separation 0.25 (${neighborCount} allies), alignment 0.10.`,
      factors: [
        { factor: 'Goal Vector', weight: 0.65, impact: 'Inward breach progress' },
        { factor: 'Anti-Congestion', weight: 0.25, impact: 'Corridor deconfliction' },
        { factor: 'Swarm Alignment', weight: 0.10, impact: 'Shared heading' }
      ],
      plannedWaypoints: baseDecision.plannedWaypoints,
      broadcastMessage
    };
  }

  // 7. ADAPTIVE STRATEGY (Reacts to rotating closures, dynamically detours)
  private computeAdaptive(
    agent: AgentState,
    allAgents: AgentState[],
    formation: ChakravyuhaFormation,
    commBus: CommBus,
    currentStep: number
  ): StrategyDecision {
    const currentRadius = Math.sqrt(agent.position.x * agent.position.x + agent.position.y * agent.position.y);
    const sortedRings = [...formation.rings].sort((a, b) => b.radius - a.radius);
    const nextRing = sortedRings.find((r) => r.radius < currentRadius - 0.4);

    if (!nextRing) {
      return this.computeGreedy(agent, formation, currentStep);
    }

    const worldGates = formation.getWorldGates().filter((g) => g.ringIndex === nextRing.index);
    const openGates = worldGates.filter((g) => g.isOpen);

    if (openGates.length === 0) {
      // All gates on this ring closed: orbit tangentially to wait for next aperture cycle
      const angle = Math.atan2(agent.position.y, agent.position.x);
      const tangent = { x: -Math.sin(angle), y: Math.cos(angle) };

      return {
        desiredVelocity: { x: tangent.x * agent.speed * 0.85, y: tangent.y * agent.speed * 0.85 },
        newAction: `Adaptive Hold — Tier ${nextRing.index} Sealed`,
        decisionReason: `All gates on Tier ${nextRing.index} sealed; orbiting to intercept next opening.`,
        decisionExplanation: `Adaptive policy: orbital holding pattern, awaiting cyclic gate opening on Tier ${nextRing.index}.`,
        factors: [
          { factor: 'Gate Closure Detection', weight: 0.8, impact: 'Avoid crushing against wall' },
          { factor: 'Phase Intercept', weight: 0.2, impact: 'Positioning for next aperture' }
        ],
        plannedWaypoints: [
          { x: agent.position.x + tangent.x * 3, y: agent.position.y + tangent.y * 3 }
        ]
      };
    }

    return this.computeCoordinated(agent, allAgents, formation, commBus, currentStep);
  }

  /**
   * Evaluates counterfactual exit candidate paths from agent's current position back to safety.
   */
  public evaluateExitCandidatePaths(
    agent: AgentState,
    formation: ChakravyuhaFormation
  ): { paths: ExitCandidatePath[]; bestExit: ExitCandidatePath | null } {
    const currentRadius = Math.sqrt(agent.position.x * agent.position.x + agent.position.y * agent.position.y);
    const outerRing = formation.rings[formation.rings.length - 1];
    if (!outerRing) return { paths: [], bestExit: null };

    const outerGates = formation.getWorldGates().filter((g) => g.ringIndex === outerRing.index);
    const paths: ExitCandidatePath[] = [];

    for (let i = 0; i < outerGates.length; i++) {
      const g = outerGates[i];
      const dist = distance2D(agent.position, { x: g.x, y: g.y });

      // Alternate flank gates (South, East, West) offer clear breakout corridors away from contested North entry vanguard
      const isBreachSector = g.isBreachGate;
      const isJayadrathaChoke = isBreachSector && formation.isJayadrathaSealed;
      const enemyThreatDensity = isJayadrathaChoke
        ? 0.95
        : isBreachSector
        ? 0.75 // Contested front vanguard entry sector
        : g.isOpen
        ? 0.12 // Clean, low-resistance alternate flank corridor (South/East/West)
        : 0.35;

      const successProbability = Math.max(
        5,
        Math.min(95, Math.round((1 - enemyThreatDensity) * 100 - dist * 1.2 + (agent.exitKnowledgePercent * 0.35)))
      );

      const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
        enemyThreatDensity > 0.6 ? 'HIGH' : enemyThreatDensity > 0.3 ? 'MEDIUM' : 'LOW';

      const estimatedSteps = Math.round(dist / 0.45) + (isJayadrathaChoke ? 50 : 0);

      paths.push({
        id: `exit-candidate-${i + 1}`,
        targetGateId: g.id,
        gateRingIndex: g.ringIndex,
        gateAngle: Math.atan2(g.y, g.x),
        waypoints: [
          { x: agent.position.x, y: agent.position.y },
          { x: (agent.position.x + g.x) / 2, y: (agent.position.y + g.y) / 2 },
          { x: g.x, y: g.y },
          { x: g.x * 1.25, y: g.y * 1.25 }
        ],
        distance: dist,
        enemyThreatDensity,
        gateState: g.isOpen ? 'OPEN' : 'CLOSED',
        successProbability,
        riskLevel,
        estimatedSteps
      });
    }

    paths.sort((a, b) => b.successProbability - a.successProbability);
    const bestExit = paths.length > 0 ? paths[0] : null;

    return { paths, bestExit };
  }
}
