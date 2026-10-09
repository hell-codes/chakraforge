import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ChakravyuhaFormation } from '../../simulation/formation/Chakravyuha';
import { FORMATION_CONFIG, LayerConfig } from '../../simulation/formation/formationConfig';
import {
  InstancedSwordsmenRing,
  InstancedArchersRing,
  InstancedElephantsRing,
  InstancedChariotsRing,
  InstancedCavalryRing,
  WarriorUnitData
} from './InstancedCohorts';

interface Chakravyuha3DProps {
  formation: ChakravyuhaFormation;
  showFormationDynamics: boolean;
  showLabels?: boolean;
}

export const Chakravyuha3D: React.FC<Chakravyuha3DProps> = ({
  formation,
  showFormationDynamics: _showFormationDynamics,
  showLabels = true
}) => {
  const outerRadius = formation.rings.length > 0 ? formation.rings[formation.rings.length - 1].radius : 25;

  return (
    <group>
      {/* 1. Droṇa & Duryodhana's Central Command Pavilion (Tier 1 Core) */}
      <CentralCommandCenter />

      {/* 2. Living Military Formations: High-Performance GPU-Instanced Military Cohorts */}
      {formation.rings.map((ring) => (
        <AncientWarriorRing3D
          key={`ring-${ring.index}`}
          ring={ring}
        />
      ))}

      {/* 3. Short Tactical Division Markers (Restrained Historical Design) */}
      {showLabels && <BattlefieldTacticalLabels outerRadius={outerRadius} isJayadrathaSealed={formation.isJayadrathaSealed} />}

      {/* 4. Perimeter War Braziers */}
      <PerimeterBraziers outerRadius={outerRadius + 3.5} />
    </group>
  );
};

// -------------------------------------------------------------
// CENTRAL COMMAND POSITION (PADMAVYŪHA LOTUS HUB)
// -------------------------------------------------------------
const CentralCommandCenter: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Stepped Dark Earthen & Iron Council Platform */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.6, 0.28, 16]} />
        <meshStandardMaterial color="#4a2e22" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.8, 0.18, 16]} />
        <meshStandardMaterial color="#3d2419" roughness={0.8} metalness={0.6} />
      </mesh>

      {/* Carved Teak & Brass Pavilion Pillars */}
      {[
        [-1.4, -1.4],
        [1.4, -1.4],
        [-1.4, 1.4],
        [1.4, 1.4]
      ].map(([px, pz], idx) => (
        <group key={`pillar-${idx}`} position={[px, 0.4, pz]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 2.4, 8]} />
            <meshStandardMaterial color="#2d2d2d" roughness={0.5} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.2, 8]} />
            <meshStandardMaterial color="#1a110b" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Deep Blood-Red Silk Canopy */}
      <mesh position={[0, 2.85, 0]} castShadow>
        <coneGeometry args={[2.3, 1.0, 6]} />
        <meshStandardMaterial color="#7a1f11" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Golden Royal Kalasha Finial */}
      <mesh position={[0, 3.45, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Droṇa's War Council Dais & Command Banners */}
      <group position={[0, 0.42, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.2, 0.3, 0.8]} />
          <meshStandardMaterial color="#5c3c24" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.8, 0.04, 0.5]} />
          <meshStandardMaterial color="#e8d8b8" roughness={0.9} />
        </mesh>
        <mesh position={[0.7, 1.1, -0.4]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 2.2, 6]} />
          <meshStandardMaterial color="#c09f58" metalness={0.8} />
        </mesh>
        <mesh position={[0.95, 1.9, -0.4]}>
          <planeGeometry args={[0.6, 0.4]} />
          <meshStandardMaterial color="#8b261d" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// ANCIENT WARRIOR RING: GPU-INSTANCED MILITARY UNITS
// (NO SOLID WALLS — ORGANIZED RANKS OF LIVING TROOPS)
// -------------------------------------------------------------
interface AncientWarriorRing3DProps {
  ring: {
    index: number;
    radius: number;
    thickness: number;
    currentRotation: number;
    gates: Array<{
      id: string;
      ringIndex: number;
      angle: number;
      width: number;
      state: 'OPEN' | 'CLOSING' | 'CLOSED' | 'OPENING';
      transitionProgress: number;
      isBreachGate?: boolean;
    }>;
  };
}

const AncientWarriorRing3D: React.FC<AncientWarriorRing3DProps> = ({ ring }) => {
  const layerConfig: LayerConfig = FORMATION_CONFIG.layers[ring.index] || FORMATION_CONFIG.layers[7];

  // Calculate open corridor segments vs defensive block arcs
  const formationSegments = useMemo(() => {
    const segments: { startAngle: number; endAngle: number }[] = [];
    const gates = [...ring.gates].sort((a, b) => a.angle - b.angle);

    if (gates.length === 0) {
      segments.push({ startAngle: 0, endAngle: Math.PI * 2 });
      return segments;
    }

    for (let i = 0; i < gates.length; i++) {
      const gCurrent = gates[i];
      const gNext = gates[(i + 1) % gates.length];

      const halfWCurrent = (gCurrent.width * gCurrent.transitionProgress) / 2;
      const halfWNext = (gNext.width * gNext.transitionProgress) / 2;

      const segStart = gCurrent.angle + halfWCurrent;
      let segEnd = gNext.angle - halfWNext;
      if (segEnd < segStart) segEnd += Math.PI * 2;

      segments.push({ startAngle: segStart, endAngle: segEnd });
    }

    return segments;
  }, [ring.gates]);

  // Generate warrior cohort unit coordinates along the ring arcs
  // Arranged as clustered tactical cohorts (pattis/gulmas) rather than sterile geometric dots
  const warriorUnits = useMemo<WarriorUnitData[]>(() => {
    const units: WarriorUnitData[] = [];
    const spacing = layerConfig.cohortSpacing;

    for (const seg of formationSegments) {
      const arcLen = (seg.endAngle - seg.startAngle) * ring.radius;
      const count = Math.max(2, Math.floor(arcLen / spacing));
      const step = (seg.endAngle - seg.startAngle) / count;

      for (let i = 0; i < count; i++) {
        // Group into tactical cohorts of 5-7 units with small tactical spacing between cohorts
        const cohortIndex = Math.floor(i / 6);
        const cohortGap = (cohortIndex % 2 === 0 ? 0.015 : -0.015);
        const organicJitter = Math.sin(i * 4.3 + ring.index * 2.1) * 0.018;
        const a = seg.startAngle + (i + 0.5) * step + cohortGap + organicJitter;

        // Realistic staggered depth deployment: front skirmishers, middle battle line, rear reserves
        const rankStagger = (i % 3 - 1) * 0.32;
        const radialNudge = (Math.cos(i * 2.7) * 0.12);
        
        // --- LABYRINTH SPIRAL LAYOUT MODIFICATION ---
        // Converts independent concentric rings into a visually continuous spiral maze 
        // to exactly match the historical Wikipedia rock carving and labyrinth diagrams.
        // Converts independent concentric rings into a visually continuous spiral maze 
        // to exactly match the historical Wikipedia rock carving and labyrinth diagrams.
        let normAngle = (a + ring.currentRotation) % (Math.PI * 2);
        if (normAngle < 0) normAngle += Math.PI * 2;
        const spiralOffset = (normAngle / (Math.PI * 2)) * 3.2; // 3.2 is ringSpacing

        const r = ring.radius - spiralOffset + rankStagger + radialNudge;

        units.push({
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          angle: a,
          hasBanner: i % 5 === 0,
          rankOffset: rankStagger
        });
      }
    }
    return units;
  }, [formationSegments, ring.radius, ring.index, layerConfig]);

  const ringGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ringGroupRef.current) return;
    const d = Math.min(0.1, delta);
    const targetRot = -ring.currentRotation;
    let diff = (targetRot - ringGroupRef.current.rotation.y) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    ringGroupRef.current.rotation.y += diff * Math.min(1, d * 16);
  });

  return (
    <group ref={ringGroupRef} rotation={[0, -ring.currentRotation, 0]}>
      {/* 1. GPU-Instanced Troop Cohorts (Zero-Lag Batching) */}
      {layerConfig.unitType === 'ELEPHANT' ? (
        <InstancedElephantsRing units={warriorUnits} bannerColor={layerConfig.bannerColor} />
      ) : layerConfig.unitType === 'CHARIOT' ? (
        <InstancedChariotsRing units={warriorUnits} primaryColor={layerConfig.primaryColor} bannerColor={layerConfig.bannerColor} />
      ) : layerConfig.unitType === 'CAVALRY' ? (
        <InstancedCavalryRing units={warriorUnits} primaryColor={layerConfig.primaryColor} bannerColor={layerConfig.bannerColor} />
      ) : layerConfig.unitType === 'ARCHER' ? (
        <InstancedArchersRing units={warriorUnits} primaryColor={layerConfig.primaryColor} bannerColor={layerConfig.bannerColor} />
      ) : (
        <InstancedSwordsmenRing units={warriorUnits} primaryColor={layerConfig.primaryColor} bannerColor={layerConfig.bannerColor} />
      )}

      {/* 2. Controlled Timber Gate Posts & Tactical Apertures */}
      {ring.gates.map((gate) => {
        const gateAngle = gate.angle;
        
        // Match the gate radius to the new continuous spiral layout
        let normAngle = (gateAngle + ring.currentRotation) % (Math.PI * 2);
        if (normAngle < 0) normAngle += Math.PI * 2;
        const spiralOffset = (normAngle / (Math.PI * 2)) * 3.2;
        const spiralGateRadius = ring.radius - spiralOffset;

        const gx = Math.cos(gateAngle) * spiralGateRadius;
        const gz = Math.sin(gateAngle) * spiralGateRadius;
        const isOpen = gate.state === 'OPEN' || gate.transitionProgress > 0.4;
        const pillarHeight = 2.2;
        const halfWidthWorld = gate.width * spiralGateRadius * 0.4;

        return (
          <group key={gate.id} position={[gx, 0, gz]}>
            {/* Left Sentry Post */}
            <mesh
              position={[-Math.sin(gateAngle) * halfWidthWorld, pillarHeight / 2, Math.cos(gateAngle) * halfWidthWorld]}
              castShadow
            >
              <boxGeometry args={[0.4, pillarHeight, 0.4]} />
              <meshStandardMaterial color="#4a301d" roughness={0.8} />
            </mesh>

            {/* Right Sentry Post */}
            <mesh
              position={[Math.sin(gateAngle) * halfWidthWorld, pillarHeight / 2, -Math.cos(gateAngle) * halfWidthWorld]}
              castShadow
            >
              <boxGeometry args={[0.4, pillarHeight, 0.4]} />
              <meshStandardMaterial color="#4a301d" roughness={0.8} />
            </mesh>

            {/* Gate Crossbeam */}
            <mesh position={[0, pillarHeight - 0.15, 0]} rotation={[0, -gateAngle + Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[halfWidthWorld * 2.1, 0.25, 0.25]} />
              <meshStandardMaterial color="#3d2514" roughness={0.7} />
            </mesh>

            {/* Banner atop gate */}
            <mesh position={[0, pillarHeight + 0.45, 0]} rotation={[0, -gateAngle + Math.PI / 2, 0]}>
              <planeGeometry args={[0.7, 0.4]} />
              <meshStandardMaterial color={gate.isBreachGate ? '#8b261d' : layerConfig.bannerColor} side={THREE.DoubleSide} />
            </mesh>

            {/* Dynamic Spiked Barricade when Gate is Closed */}
            {!isOpen && (
              <group position={[0, (pillarHeight * (1 - gate.transitionProgress)) / 2.2, 0]}>
                <mesh rotation={[0, -gateAngle + Math.PI / 2, 0]} castShadow>
                  <boxGeometry args={[halfWidthWorld * 1.85, 1.5, 0.2]} />
                  <meshStandardMaterial
                    color={gate.isBreachGate ? '#662211' : '#4a2f1b'}
                    roughness={0.85}
                    metalness={0.2}
                  />
                </mesh>
              </group>
            )}

            {/* Jayadratha's Boar Standard at North Breach Gate */}
            {gate.isBreachGate && (
              <group position={[Math.sin(gateAngle) * (halfWidthWorld + 0.8), 0, -Math.cos(gateAngle) * (halfWidthWorld + 0.8)]}>
                <mesh position={[0, 1.8, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.035, 3.6, 6]} />
                  <meshStandardMaterial color="#c09f58" metalness={0.7} />
                </mesh>
                <mesh position={[0.35, 3.1, 0]}>
                  <planeGeometry args={[0.85, 0.55]} />
                  <meshStandardMaterial color="#8b261d" side={THREE.DoubleSide} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

// -------------------------------------------------------------
// 3D TACTICAL DIVISION LABELS (Removed to avoid clutter in center)
// -------------------------------------------------------------
const BattlefieldTacticalLabels: React.FC<{ outerRadius: number; isJayadrathaSealed: boolean }> = () => {
  return null;
};

// -------------------------------------------------------------
// PERIMETER WAR BRAZIERS
// -------------------------------------------------------------
const PerimeterBraziers: React.FC<{ outerRadius: number }> = ({ outerRadius }) => {
  const brazierCount = 18;
  const braziers = useMemo(() => {
    const list = [];
    for (let b = 0; b < brazierCount; b++) {
      const angle = (b / brazierCount) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const z = Math.sin(angle) * outerRadius;
      list.push({ x, z, angle });
    }
    return list;
  }, [outerRadius]);

  return (
    <group>
      {braziers.map((b, idx) => (
        <group key={`brazier-${idx}`} position={[b.x, 0, b.z]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.2, 0.3, 8]} />
            <meshStandardMaterial color="#1a110b" metalness={0.8} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.25, 0.3, 6]} />
            <meshStandardMaterial color="#160e0a" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshStandardMaterial
              color="#ff6600"
              emissive="#ff3300"
              emissiveIntensity={1.5}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
