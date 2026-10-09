import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AgentState, HeroType } from '../../types/simulation';
import { AgentVisionMesh } from './AgentVisionMesh';
import { PathTrail } from './PathTrail';

interface AgentMeshGroupProps {
  agents: AgentState[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentState | null) => void;
  showPaths: boolean;
  showVision: boolean;
}

const HERO_COLORS: Record<HeroType, string> = {
  ABHIMANYU: '#f39c12',
  BHIMA: '#e67e22',
  YUDHISHTHIRA: '#f1c40f',
  SATYAKI: '#e74c3c',
  DHRISHTADYUMNA: '#d35400',
  DRONA: '#c0392b',
  JAYADRATHA: '#8e44ad',
  KARNA: '#d4ac0d',
  KRIPA: '#7f8c8d',
  ASHWATTHAMAN: '#962d3e',
  DUHSHASANA: '#2c3e50'
};

export const AgentMeshGroup: React.FC<AgentMeshGroupProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  showPaths,
  showVision
}) => {
  return (
    <group>
      {agents.map((agent) => {
        const isSelected = agent.id === selectedAgentId;
        const color = agent.heroType ? HERO_COLORS[agent.heroType] : agent.team === 'PANDAVA' ? '#f39c12' : '#c0392b';

        return (
          <group key={agent.id}>
            {/* 3D Path Trail */}
            {showPaths && <PathTrail agent={agent} color={color} />}

            {/* Vision Cone / Field of view if selected or vision enabled */}
            {(showVision || isSelected) && <AgentVisionMesh agent={agent} />}

            {/* Distinctive Hero Model */}
            {agent.heroType === 'ABHIMANYU' ? (
              <AbhimanyuChariot
                agent={agent}
                isSelected={isSelected}
                onClick={() => onSelectAgent(isSelected ? null : agent)}
              />
            ) : agent.team === 'PANDAVA' ? (
              <PandavaSupportHero
                agent={agent}
                isSelected={isSelected}
                color={color}
                onClick={() => onSelectAgent(isSelected ? null : agent)}
              />
            ) : (
              <KauravaCommanderUnit
                agent={agent}
                isSelected={isSelected}
                color={color}
                onClick={() => onSelectAgent(isSelected ? null : agent)}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};

// -------------------------------------------------------------
// ABHIMANYU'S WAR CHARIOT (VANGUARD HERO)
// -------------------------------------------------------------
interface UnitProps {
  agent: AgentState;
  isSelected: boolean;
  color?: string;
  onClick: () => void;
}

const AbhimanyuChariot: React.FC<UnitProps> = ({ agent, isSelected, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelLeftRef = useRef<THREE.Mesh>(null);
  const wheelRightRef = useRef<THREE.Mesh>(null);
  const flagRef = useRef<THREE.Group>(null);
  const horsesGroupRef = useRef<THREE.Group>(null);
  const combatAuraRef = useRef<THREE.Mesh>(null);
  const gallopPhaseRef = useRef<number>(0);

  const isCompleted = agent.status === 'COMPLETED';
  const isIsolated = agent.supportStatus === 'ISOLATED';
  const isTrapped = agent.status === 'TRAPPED';
  const isEliminated = agent.status === 'ELIMINATED';

  // 60 FPS Decoupled Smooth Damping Loop
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const d = Math.min(0.1, delta);

    // Smooth position interpolation to eliminate stepping (lowered from 15 to 6 for buttery smooth movement)
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, agent.position.x, 6, d);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, agent.position.y, 6, d);

    // Heading angle damping
    const targetHeading = -agent.heading + Math.PI / 2;
    let diff = (targetHeading - groupRef.current.rotation.y) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    groupRef.current.rotation.y += diff * Math.min(1, d * 14);

    // Wheels spin based on agent velocity
    if (wheelLeftRef.current && wheelRightRef.current && !isEliminated) {
      if (agent.speed > 0.02) {
        const rot = d * agent.speed * 4.5;
        wheelLeftRef.current.rotation.x += rot;
        wheelRightRef.current.rotation.x += rot;
      }
    }

    // Dynamic Galloping Animation for the 4 War Horses
    if (horsesGroupRef.current && !isEliminated) {
      if (agent.speed > 0.05) {
        gallopPhaseRef.current += d * agent.speed * 14;
        const phase = gallopPhaseRef.current;

        // Animate each horse child
        horsesGroupRef.current.children.forEach((horseNode, idx) => {
          const horseGroup = horseNode as THREE.Group;
          // Torso bobbing
          horseGroup.position.y = Math.abs(Math.sin(phase * 1.5 + idx * 0.3)) * 0.09;
          horseGroup.rotation.x = Math.sin(phase + idx * 0.2) * 0.08;

          // Leg oscillations
          const legsGroup = horseGroup.getObjectByName(`horse-legs-${idx}`) as THREE.Group;
          if (legsGroup) {
            legsGroup.children.forEach((leg, legIdx) => {
              const isFront = legIdx >= 2;
              const legSwing = Math.sin(phase + (isFront ? 0 : Math.PI * 0.8)) * 0.55;
              leg.rotation.x = legSwing;
            });
          }
        });
      }
    }

    // War standard flag flutter
    if (flagRef.current) {
      flagRef.current.rotation.z = Math.sin(performance.now() * 0.005) * 0.12;
      flagRef.current.rotation.x = Math.cos(performance.now() * 0.004) * 0.06;
    }

    // Tilt chariot on defeat
    if (isEliminated) {
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, 0.22, 4, d);
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, 0, 8, d);
    }

    // Combat/Killing Effects when inside the Chakravyuh
    if (combatAuraRef.current && !isEliminated) {
      if (agent.currentLayer > 0) {
        combatAuraRef.current.visible = true;
        const combatIntensity = agent.stuckSteps > 0 ? 30 : 15;
        combatAuraRef.current.rotation.z -= d * combatIntensity;
        const scalePhase = Math.sin(performance.now() * (agent.stuckSteps > 0 ? 0.02 : 0.005));
        combatAuraRef.current.scale.setScalar(1 + scalePhase * 0.3);
        const mat = combatAuraRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = agent.stuckSteps > 0 ? 0.8 : 0.4;
      } else {
        combatAuraRef.current.visible = false;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[agent.position.x, 0, agent.position.y]}
      rotation={[0, -agent.heading + Math.PI / 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <group scale={0.65}>
        {/* Chariot Wooden Chassis Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.22, 1.7]} />
        <meshStandardMaterial color="#6e4726" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Front Curved Shield Armor Guard */}
      <mesh position={[0, 0.72, 0.75]} castShadow>
        <boxGeometry args={[1.2, 0.45, 0.12]} />
        <meshStandardMaterial color="#c09f58" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Side Railings */}
      <mesh position={[-0.6, 0.65, 0]} castShadow>
        <boxGeometry args={[0.08, 0.35, 1.4]} />
        <meshStandardMaterial color="#a67c4e" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.6, 0.65, 0]} castShadow>
        <boxGeometry args={[0.08, 0.35, 1.4]} />
        <meshStandardMaterial color="#a67c4e" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Axle connecting wheels */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
        <meshStandardMaterial color="#2c1e11" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Left Spoked Chariot Wheel */}
      <mesh ref={wheelLeftRef} position={[-0.9, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 16]} />
        <meshStandardMaterial color="#c88b39" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Right Spoked Chariot Wheel (Dislodged slightly if eliminated) */}
      <mesh
        ref={wheelRightRef}
        position={[0.9, isEliminated ? 0.15 : 0.4, isEliminated ? 0.3 : 0]}
        rotation={[isEliminated ? 0.4 : 0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.42, 0.42, 0.12, 16]} />
        <meshStandardMaterial color="#c88b39" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Forward Chariot Yoke Beam */}
      <mesh position={[0, 0.38, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
        <meshStandardMaterial color="#54381e" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* 4 Galloping War Horses in Front */}
      <group ref={horsesGroupRef} position={[0, 0, 2.1]}>
        {[-0.6, -0.2, 0.2, 0.6].map((hx, hIdx) => (
          <group key={`horse-${hIdx}`} position={[hx, 0, 0]}>
            {/* Horse Torso */}
            <mesh position={[0, 0.68, 0]} castShadow>
              <boxGeometry args={[0.34, 0.45, 0.95]} />
              <meshStandardMaterial color={hIdx % 2 === 0 ? '#452a17' : '#382012'} roughness={0.8} />
            </mesh>
            {/* Horse Neck & Head */}
            <mesh position={[0, 1.05, 0.42]} rotation={[0.48, 0, 0]} castShadow>
              <boxGeometry args={[0.22, 0.52, 0.3]} />
              <meshStandardMaterial color={hIdx % 2 === 0 ? '#452a17' : '#382012'} roughness={0.8} />
            </mesh>
            {/* Golden Chamfron / Bridle */}
            <mesh position={[0, 1.15, 0.55]}>
              <boxGeometry args={[0.18, 0.25, 0.08]} />
              <meshStandardMaterial color="#c09f58" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* 4 Animated Galloping Legs */}
            <group name={`horse-legs-${hIdx}`}>
              {/* Back Left Leg */}
              <mesh position={[-0.11, 0.32, -0.32]} castShadow>
                <cylinderGeometry args={[0.045, 0.055, 0.65, 6]} />
                <meshStandardMaterial color="#2b180d" roughness={0.9} />
              </mesh>
              {/* Back Right Leg */}
              <mesh position={[0.11, 0.32, -0.32]} castShadow>
                <cylinderGeometry args={[0.045, 0.055, 0.65, 6]} />
                <meshStandardMaterial color="#2b180d" roughness={0.9} />
              </mesh>
              {/* Front Left Leg */}
              <mesh position={[-0.11, 0.32, 0.32]} castShadow>
                <cylinderGeometry args={[0.045, 0.055, 0.65, 6]} />
                <meshStandardMaterial color="#2b180d" roughness={0.9} />
              </mesh>
              {/* Front Right Leg */}
              <mesh position={[0.11, 0.32, 0.32]} castShadow>
                <cylinderGeometry args={[0.045, 0.055, 0.65, 6]} />
                <meshStandardMaterial color="#2b180d" roughness={0.9} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* CHARIOTEER FIGURE (Sumitra holding reins) */}
      {!isEliminated && (
        <group position={[0, 0.55, 0.45]}>
          <mesh position={[0, 0.38, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.55, 6]} />
            <meshStandardMaterial color="#5c3c24" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color="#3a2517" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* ABHIMANYU HERO FIGURE */}
      <group position={[0, 0.55, 0]}>
        {/* Armored Torso */}
        <mesh position={[0, isEliminated ? 0.15 : 0.45, isEliminated ? -0.2 : 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 0.65, 8]} />
          <meshStandardMaterial
            color={isEliminated ? '#7f8c8d' : agent.stuckSteps > 0 ? '#ff0000' : '#d4af37'}
            roughness={0.3}
            metalness={0.8}
            emissive={isEliminated ? '#000' : agent.stuckSteps > 0 ? '#ff0000' : '#d4af37'}
            emissiveIntensity={isIsolated ? 0.8 : agent.stuckSteps > 0 ? 0.9 : 0.6}
          />
        </mesh>

        {/* Golden Helmet */}
        <mesh position={[0, isEliminated ? 0.45 : 0.9, isEliminated ? -0.2 : 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#f1c40f" roughness={0.25} metalness={0.9} />
        </mesh>

        {/* ═══ FAMOUS CHARIOT WHEEL LAST STAND WEAPON ═══ */}
        {/* When surrounded/trapped, Abhimanyu raises the chariot wheel aloft as weapon! */}
        {(isTrapped || isIsolated) && !isEliminated ? (
          <group position={[0, 1.4, 0.1]} rotation={[0.4, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.48, 0.48, 0.08, 16]} />
            <mesh castShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.08, 16]} />
              <meshStandardMaterial color="#c88b39" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Wheel Spokes */}
            {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((ang, i) => (
              <mesh key={`spoke-${i}`} rotation={[0, ang, 0]}>
                <boxGeometry args={[0.9, 0.04, 0.04]} />
                <meshStandardMaterial color="#8a5d2b" roughness={0.6} />
              </mesh>
            ))}
          </group>
        ) : (
          /* Normal Golden Bow */
          !isEliminated && (
            <mesh position={[0.3, 0.55, 0.2]} rotation={[0, 0.2, 0.4]}>
              <torusGeometry args={[0.32, 0.025, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#f39c12" metalness={0.8} roughness={0.3} />
            </mesh>
          )
        )}
      </group>

      {/* SUN BANNER STANDARD (DHVAJA) */}
      <group ref={flagRef} position={[-0.45, 0.55, -0.6]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.035, 2.4, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.45, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#ffeaa7" emissive="#ff9f43" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 2.0, -0.42]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.85, 0.5]} />
          <meshStandardMaterial
            color="#e67e22"
            emissive="#d35400"
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* SELECTION HALO */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.5, 1.75, 36]} />
          <meshBasicMaterial color="#00f2ff" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* ISOLATED / CUT OFF CRITICAL GLOW */}
      {isIsolated && !isTrapped && !isEliminated && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <ringGeometry args={[1.8, 2.0, 36]} />
          <meshBasicMaterial color="#e74c3c" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* COMPLETED / VICTORY GLOW */}
      {isCompleted && (
        <mesh position={[0, 2.8, 0]}>
          <torusGeometry args={[0.5, 0.05, 8, 24]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
      )}

      {/* HEROIC MEMORIAL AURA ON ELIMINATION */}
      {isEliminated && (
        <group position={[0, 0.8, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 2.4, 32]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* DYNAMIC COMBAT/KILLING EFFECTS WHEN IN CHAKRAVYUHA */}
      </group>
      <mesh ref={combatAuraRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 1.0]} visible={false}>
        <ringGeometry args={[1.5, 3.5, 8]} />
        <meshBasicMaterial 
          color={agent.stuckSteps > 0 ? '#ff3300' : '#ff9900'} 
          transparent 
          opacity={0.5} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending} 
          wireframe={true}
        />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// PANDAVA SUPPORT HEROES (BHIMA, YUDHISHTHIRA, SATYAKI, DHRISHTADYUMNA)
// -------------------------------------------------------------
const PandavaSupportHero: React.FC<UnitProps> = ({ agent, isSelected, color = '#e67e22', onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelLeftRef = useRef<THREE.Mesh>(null);
  const wheelRightRef = useRef<THREE.Mesh>(null);
  const isBlocked = agent.status === 'BLOCKED';
  const isEliminated = agent.status === 'ELIMINATED';

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const d = Math.min(0.1, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, agent.position.x, 6, d);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, agent.position.y, 6, d);
    
    // Death / elimination animation: sink into ground and tilt
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, isEliminated ? -0.8 : 0, 8, d);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, isEliminated ? Math.PI / 2.2 : 0, 6, d);

    const targetHeading = -agent.heading + Math.PI / 2;
    let diff = (targetHeading - groupRef.current.rotation.y) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    groupRef.current.rotation.y += diff * Math.min(1, d * 14);

    if (wheelLeftRef.current && wheelRightRef.current && agent.speed > 0.02 && !isEliminated) {
      const rot = d * agent.speed * 4;
      wheelLeftRef.current.rotation.x += rot;
      wheelRightRef.current.rotation.x += rot;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[agent.position.x, 0, agent.position.y]}
      rotation={[0, -agent.heading + Math.PI / 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Chariot Base */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.1, 0.2, 1.4]} />
        <meshStandardMaterial color="#4a3525" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Wheels */}
      <mesh ref={wheelLeftRef} position={[-0.7, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 12]} />
        <meshStandardMaterial color="#8c6239" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh ref={wheelRightRef} position={[0.7, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 12]} />
        <meshStandardMaterial color="#8c6239" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Hero Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.6, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Hero War Standard Flag */}
      <mesh position={[-0.35, 1.1, -0.4]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.8, 6]} />
        <meshStandardMaterial color="#c09f58" metalness={0.7} />
      </mesh>
      <mesh position={[-0.35, 1.7, -0.65]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      {/* Blocked by Jayadratha Red Repulsion Marker */}
      {isBlocked && (
        <mesh position={[0, 1.6, 0]}>
          <octahedronGeometry args={[0.24]} />
          <meshBasicMaterial color="#e74c3c" wireframe />
        </mesh>
      )}

      {/* Selection Halo */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.2, 1.4, 24]} />
          <meshBasicMaterial color="#00f2ff" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Death Aura */}
      {isEliminated && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.5, 0]}>
          <ringGeometry args={[1.5, 2.5, 32]} />
          <meshBasicMaterial color="#c0392b" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// KAURAVA COMMANDERS (DRONA, JAYADRATHA, KARNA, ETC.)
// -------------------------------------------------------------
const KauravaCommanderUnit: React.FC<UnitProps> = ({ agent, isSelected, color = '#c0392b', onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isJayadratha = agent.heroType === 'JAYADRATHA';
  const isDrona = agent.heroType === 'DRONA';
  const isEliminated = agent.status === 'ELIMINATED';

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const d = Math.min(0.1, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, agent.position.x, 6, d);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, agent.position.y, 6, d);

    // Death / elimination animation: sink into ground and tilt
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, isEliminated ? -0.8 : 0, 8, d);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, isEliminated ? Math.PI / 2.2 : 0, 6, d);

    const targetHeading = -agent.heading + Math.PI / 2;
    let diff = (targetHeading - groupRef.current.rotation.y) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    groupRef.current.rotation.y += diff * Math.min(1, d * 14);
  });

  return (
    <group
      ref={groupRef}
      position={[agent.position.x, 0, agent.position.y]}
      rotation={[0, -agent.heading + Math.PI / 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Heavy Command Chariot Base */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.3, 0.22, 1.5]} />
        <meshStandardMaterial color="#2d1d1b" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Heavy Wheels */}
      <mesh position={[-0.75, 0.38, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.12, 12]} />
        <meshStandardMaterial color="#4a2e2b" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0.75, 0.38, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.12, 12]} />
        <meshStandardMaterial color="#4a2e2b" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Commander Body */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.65, 8]} />
        <meshStandardMaterial
          color={isDrona ? '#ecf0f1' : isJayadratha ? '#8e44ad' : color}
          emissive={isDrona ? '#ecf0f1' : isJayadratha ? '#8e44ad' : color}
          emissiveIntensity={isJayadratha ? 0.8 : 0.4}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#a67c4e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Commander Flagstaff */}
      <mesh position={[-0.45, 1.2, -0.4]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 2.0, 6]} />
        <meshStandardMaterial color="#555" metalness={0.8} />
      </mesh>

      {/* Banner */}
      <mesh position={[-0.45, 1.8, -0.7]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial
          color={isJayadratha ? '#8e44ad' : isDrona ? '#ecf0f1' : '#c0392b'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Jayadratha Breach-Blocker Aura */}
      {isJayadratha && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[1.4, 1.8, 32]} />
          <meshBasicMaterial color="#8e44ad" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Selection Halo */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.4, 1.6, 24]} />
          <meshBasicMaterial color="#00f2ff" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Death Aura */}
      {isEliminated && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.5, 0]}>
          <ringGeometry args={[1.8, 3.0, 32]} />
          <meshBasicMaterial color="#962d3e" transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
};
