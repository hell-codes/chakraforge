import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BattlefieldScene } from './scene/BattlefieldScene';
import { SimulationEngine } from '../simulation/core/Engine';
import { AgentState } from '../types/simulation';
import { CameraMode } from './camera/CameraController';

interface CanvasContainerProps {
  engine: SimulationEngine;
  cameraMode: CameraMode;
  selectedAgent: AgentState | null;
  onSelectAgent: (agent: AgentState | null) => void;
  showPaths: boolean;
  showVision: boolean;
  showComm: boolean;
  showHeatmap: boolean;
  showDynamics: boolean;
  showNavDebug?: boolean;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  engine,
  cameraMode,
  selectedAgent,
  onSelectAgent,
  showPaths,
  showVision,
  showComm,
  showHeatmap,
  showDynamics,
  showNavDebug = false
}) => {
  return (
    <div className="w-full h-full relative select-none bg-[#100b08] overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 32, 42], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onPointerMissed={() => onSelectAgent(null)}
      >
        <Suspense fallback={null}>
          <BattlefieldScene
            engine={engine}
            cameraMode={cameraMode}
            selectedAgent={selectedAgent}
            onSelectAgent={onSelectAgent}
            showPaths={showPaths}
            showVision={showVision}
            showComm={showComm}
            showHeatmap={showHeatmap}
            showDynamics={showDynamics}
            showNavDebug={showNavDebug}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
