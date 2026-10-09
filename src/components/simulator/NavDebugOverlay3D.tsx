import React, { useMemo } from 'react';
import * as THREE from 'three';
import { NavNode, NavEdge, Vector2D } from '../../types/simulation';
import { ChakravyuhaFormation } from '../../simulation/formation/Chakravyuha';

interface NavDebugOverlay3DProps {
  formation: ChakravyuhaFormation | null;
  activePath?: Vector2D[];
  visible?: boolean;
}

export const NavDebugOverlay3D: React.FC<NavDebugOverlay3DProps> = ({
  formation,
  activePath,
  visible = false
}) => {
  if (!visible || !formation || !formation.navGraph) return null;

  const navGraph = formation.navGraph;
  const nodes = useMemo(() => navGraph.getNodes(), [navGraph, formation]);
  const edges = useMemo(() => navGraph.getEdges(), [navGraph, formation]);

  // Build edge line segments
  const { openLineSegments, blockedLineSegments } = useMemo(() => {
    const openPoints: THREE.Vector3[] = [];
    const blockedPoints: THREE.Vector3[] = [];

    for (const edge of edges) {
      const fromNode = navGraph.nodes.get(edge.from);
      const toNode = navGraph.nodes.get(edge.to);
      if (!fromNode || !toNode) continue;

      const p1 = new THREE.Vector3(fromNode.x, 0.15, fromNode.y);
      const p2 = new THREE.Vector3(toNode.x, 0.15, toNode.y);

      if (edge.isBlocked) {
        blockedPoints.push(p1, p2);
      } else {
        openPoints.push(p1, p2);
      }
    }

    const openGeo = new THREE.BufferGeometry().setFromPoints(openPoints);
    const blockedGeo = new THREE.BufferGeometry().setFromPoints(blockedPoints);

    return {
      openLineSegments: openGeo,
      blockedLineSegments: blockedGeo
    };
  }, [edges, navGraph]);

  // Build active A* path ribbon
  const pathLineObject = useMemo(() => {
    if (!activePath || activePath.length < 2) return null;
    const points = activePath.map((p) => new THREE.Vector3(p.x, 0.35, p.y));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: '#06b6d4', linewidth: 3 });
    return new THREE.Line(geo, mat);
  }, [activePath]);

  return (
    <group name="NavDebugOverlay">
      {/* Open Edges (Corridors and open gates) */}
      <lineSegments geometry={openLineSegments}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} linewidth={1} />
      </lineSegments>

      {/* Blocked Edges (Sealed gates or walls) */}
      <lineSegments geometry={blockedLineSegments}>
        <lineBasicMaterial color="#ef4444" transparent opacity={0.8} linewidth={2} />
      </lineSegments>

      {/* Navigation Nodes */}
      {nodes.map((node) => {
        const isCommandCenter = node.id === 'node-center-command';
        const isBreach = node.id === 'node-outer-breach';
        const isApproach = node.id.includes('outside');
        const color = isCommandCenter
          ? '#eab308'
          : isBreach
          ? formation.isJayadrathaSealed
            ? '#ef4444'
            : '#10b981'
          : isApproach
          ? '#3b82f6'
          : node.isGateNode
          ? '#22c55e'
          : '#ca8a04';

        const radius = isCommandCenter ? 0.45 : isBreach ? 0.35 : 0.18;

        return (
          <mesh key={node.id} position={[node.x, 0.2, node.y]}>
            <sphereGeometry args={[radius, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.75} />
          </mesh>
        );
      })}

      {/* Active Agent Waypoint Path */}
      {pathLineObject && <primitive object={pathLineObject} />}
    </group>
  );
};
