import React from 'react';
import { SimulationEngine } from '../../simulation/core/Engine';
import { AgentState } from '../../types/simulation';
import { Terrain } from './Terrain';
import { Chakravyuha3D } from '../formation/Chakravyuha3D';
import { AgentMeshGroup } from '../agents/AgentMeshGroup';
import { CommBeams } from '../effects/CommBeams';
import { CongestionHeatmap } from '../effects/CongestionHeatmap';
import { DustParticles } from '../effects/DustParticles';
import { KurukshetraBattlefield3D } from '../effects/KurukshetraBattlefield3D';
import { CombatEffects3D } from '../effects/CombatEffects3D';
import { CameraController, CameraMode } from '../camera/CameraController';
import { NavDebugOverlay3D } from '../../components/simulator/NavDebugOverlay3D';

interface BattlefieldSceneProps {
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

export const BattlefieldScene: React.FC<BattlefieldSceneProps> = ({
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
  const maxRadius = engine.formation.rings.length * 3.2 + 6;

  return (
    <>
      {/* Deep, Premium Kurukshetra Atmosphere (High Contrast) */}
      <color attach="background" args={['#080605']} />
      <fogExp2 attach="fog" args={['#080605', 0.007]} />

      {/* Subtle Moody Ambient Illumination */}
      <ambientLight color="#e6cfb3" intensity={0.4} />

      {/* Central Highlight: Divine Core Illumination */}
      <pointLight position={[0, 25, 0]} color="#ffd699" intensity={2500} distance={150} />
      
      {/* Harsh, Low-Angle Sunset Directional Sunlight (Golden Hour) */}
      <directionalLight
        position={[45, 30, 35]}
        color="#ffa666"
        intensity={4.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={180}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
      />

      {/* Dramatic Edge Rim Light */}
      <directionalLight position={[-40, 15, -40]} color="#8a3011" intensity={1.2} />

      {/* Soft Blue Moonlight/Fill for Contrast */}
      <directionalLight position={[0, 45, -50]} color="#2a3a5a" intensity={0.8} />

      {/* Camera Controller */}
      <CameraController mode={cameraMode} selectedAgent={selectedAgent || engine.agents[0] || null} />

      {/* Battlefield Environment & Live Kurukshetra War Atmosphere */}
      <Terrain radius={maxRadius} showGrid={showNavDebug} />
      <KurukshetraBattlefield3D radius={maxRadius} />
      <Chakravyuha3D formation={engine.formation} showFormationDynamics={showDynamics} />
      
      {/* 3D Navigation Graph & Corridor Debug Overlay */}
      <NavDebugOverlay3D
        formation={engine.formation}
        activePath={engine.agents[0]?.plannedPath}
        visible={showNavDebug}
      />

      {/* 3D Hero Units & Tactical Commanders */}
      <AgentMeshGroup
        agents={[...engine.agents, ...engine.kauravaCommanders]}
        selectedAgentId={selectedAgent?.id || null}
        onSelectAgent={onSelectAgent}
        showPaths={showPaths}
        showVision={showVision}
      />

      {/* Interactive Communication Beams & Dynamic Heatmaps */}
      <CommBeams commBus={engine.commBus} showComm={showComm} />
      <CongestionHeatmap agents={engine.agents} showHeatmap={showHeatmap} />
      <DustParticles />
      <CombatEffects3D engine={engine} />
    </>
  );
};
