import React, { useMemo } from 'react';
import { AgentState } from '../../types/simulation';

interface CongestionHeatmapProps {
  agents: AgentState[];
  showHeatmap: boolean;
}

export const CongestionHeatmap: React.FC<CongestionHeatmapProps> = ({ agents, showHeatmap }) => {
  if (!showHeatmap) return null;

  // Compute local density clusters
  const clusters = useMemo(() => {
    const list: { x: number; y: number; density: number }[] = [];
    const active = agents.filter((a) => a.status === 'ACTIVE');

    for (let i = 0; i < active.length; i++) {
      let count = 0;
      for (let j = 0; j < active.length; j++) {
        const dx = active[i].position.x - active[j].position.x;
        const dy = active[i].position.y - active[j].position.y;
        if (dx * dx + dy * dy < 16) count++;
      }
      list.push({
        x: active[i].position.x,
        y: active[i].position.y,
        density: Math.min(1.0, count / 5)
      });
    }

    return list;
  }, [agents]);

  return (
    <group position={[0, 0.02, 0]}>
      {clusters.map((c, i) => (
        <mesh key={`heat-${i}`} position={[c.x, 0, c.y]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.5, 16]} />
          <meshBasicMaterial
            color="#e74c3c"
            transparent
            opacity={0.15 + c.density * 0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};
