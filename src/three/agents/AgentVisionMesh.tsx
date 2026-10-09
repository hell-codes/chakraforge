import React from 'react';
import { AgentState } from '../../types/simulation';

interface AgentVisionMeshProps {
  agent: AgentState;
}

export const AgentVisionMesh: React.FC<AgentVisionMeshProps> = ({ agent }) => {
  const radius = agent.informationLevel === 'FULL' ? 35 : agent.visionRadius;
  const opacity = agent.informationLevel === 'LIMITED' ? 0.18 : 0.12;

  return (
    <group position={[agent.position.x, 0.03, agent.position.y]}>
      {/* Vision Range Ground Disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial
          color={agent.informationLevel === 'LIMITED' ? '#e67e22' : '#3498db'}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </mesh>

      {/* Vision Boundary Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.06, radius + 0.06, 64]} />
        <meshBasicMaterial
          color={agent.informationLevel === 'LIMITED' ? '#d35400' : '#2980b9'}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};
