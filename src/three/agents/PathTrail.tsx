import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AgentState } from '../../types/simulation';

interface PathTrailProps {
  agent: AgentState;
  color: string;
}

export const PathTrail: React.FC<PathTrailProps> = ({ agent, color }) => {
  // 1. Historical Traversed Path Line
  const historyLine = useMemo(() => {
    if (agent.pathHistory.length < 2) return null;
    const pts = agent.pathHistory.map((p) => new THREE.Vector3(p.x, 0.08, p.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: agent.heroType === 'ABHIMANYU' ? '#d4af37' : color,
      transparent: true,
      opacity: agent.heroType === 'ABHIMANYU' ? 0.85 : 0.45,
      linewidth: 3
    });
    return new THREE.Line(geometry, material);
  }, [agent.pathHistory, color, agent.heroType]);

  // 2. Counterfactual Candidate Exit Paths (If available on Abhimanyu in Counterfactual Mode)
  const counterfactualLines = useMemo(() => {
    if (!agent.counterfactualPaths || agent.counterfactualPaths.length === 0) return null;

    return agent.counterfactualPaths.map((cPath, idx) => {
      if (cPath.waypoints.length < 2) return null;
      const pts = cPath.waypoints.map((p) => new THREE.Vector3(p.x, 0.12 + idx * 0.02, p.y));
      const geometry = new THREE.BufferGeometry().setFromPoints(pts);

      const pathColor =
        cPath.riskLevel === 'LOW'
          ? '#2ecc71'
          : cPath.riskLevel === 'MEDIUM'
          ? '#00f2ff'
          : '#e67e22';

      const material = new THREE.LineDashedMaterial({
        color: pathColor,
        dashSize: 0.6,
        gapSize: 0.3,
        linewidth: 2,
        transparent: true,
        opacity: 0.75
      });

      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      return <primitive key={cPath.id || idx} object={line} />;
    });
  }, [agent.counterfactualPaths]);

  return (
    <group>
      {historyLine && <primitive object={historyLine} />}
      {counterfactualLines}
    </group>
  );
};
