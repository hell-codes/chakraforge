import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Majestic 3D Chakravyūha Background — Optimized for 60 FPS
 * 
 * Features:
 * - GPU-instanced troop cohorts (single draw call per ring)
 * - 7 concentric rotating defense tiers with alternating rotation
 * - Radiant mandala geometry with golden spoke lines
 * - Northern ingress breach corridor
 * - Rising ember particles for war atmosphere
 * - Zero per-frame allocations (all vectors pre-allocated)
 */
export const ChakravyuhaBackground3D: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 28, 34], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        frameloop="always"
      >
        <ambientLight color="#ffe8cc" intensity={0.8} />
        <directionalLight position={[25, 45, 20]} color="#fff5e0" intensity={2.0} />
        <directionalLight position={[-20, 25, -20]} color="#d97724" intensity={0.7} />
        <pointLight position={[0, 8, 0]} color="#ffaa33" intensity={1.5} distance={35} />

        <AnimatedChakraFormation />
        <RisingEmbers count={50} />
      </Canvas>

      {/* Cinematic Atmosphere Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0805]/50 via-transparent to-[#0c0805]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,8,5,0.15)_0%,rgba(12,8,5,0.70)_60%,rgba(12,8,5,0.95)_100%)] pointer-events-none" />
    </div>
  );
};

// Pre-allocate reusable math objects outside components
const _tempObj = new THREE.Object3D();

const AnimatedChakraFormation: React.FC = () => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const ringGroupRefs = useRef<(THREE.Group | null)[]>([]);

  // 7 Concentric Defense Tiers — Pre-computed
  const rings = useMemo(() => {
    const radii = [4.2, 7.4, 10.6, 13.8, 17.0, 20.2, 23.4];
    const colors = [
      '#e5a93b', '#d48828', '#b85d19', '#994d1c',
      '#7a3e18', '#5e3013', '#48240f'
    ];

    return radii.map((radius, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      const speed = dir * (0.0015 + (radii.length - i) * 0.0006);
      const cohortCount = Math.floor(radius * 3.2);

      const units: { x: number; z: number; angle: number }[] = [];
      for (let u = 0; u < cohortCount; u++) {
        const angle = (u / cohortCount) * Math.PI * 2;

        // Northern breach gaps
        const isNorthBreach = i === 6 && Math.abs(angle - Math.PI / 2) < 0.28;
        const isInternalAperture = i % 2 === 1 && Math.abs(angle - (Math.PI / 2 - i * 0.42)) < 0.22;

        if (!isNorthBreach && !isInternalAperture) {
          units.push({
            x: Math.cos(angle) * radius,
            z: Math.sin(angle) * radius,
            angle
          });
        }
      }

      return { index: i, radius, color: colors[i], speed, units };
    });
  }, []);

  useFrame((_, delta) => {
    // Clamp delta to prevent jumps after tab switch
    const dt = Math.min(delta, 0.05);

    if (masterGroupRef.current) {
      masterGroupRef.current.rotation.y += dt * 0.02;
    }

    for (let idx = 0; idx < rings.length; idx++) {
      const ref = ringGroupRefs.current[idx];
      if (ref) {
        ref.rotation.y += dt * rings[idx].speed * 7;
      }
    }
  });

  return (
    <group ref={masterGroupRef} rotation={[0.35, 0, 0]}>
      {/* Central Command Dais */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 0.3, 32]} />
        <meshStandardMaterial color="#c68a2c" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Saffron Pavilion */}
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[2.0, 1.4, 8]} />
        <meshStandardMaterial color="#e57e25" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Golden Finial */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#ffd875" roughness={0.2} metalness={0.9} emissive="#d4af37" emissiveIntensity={0.4} />
      </mesh>

      {/* Mandala Ring Tracks */}
      {rings.map((r, idx) => (
        <group key={`mandala-${idx}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[r.radius - 0.2, r.radius + 0.2, 96]} />
            <meshStandardMaterial
              color="#e5a93b"
              roughness={0.3}
              metalness={0.7}
              emissive="#b87b1c"
              emissiveIntensity={idx === 0 ? 0.5 : 0.25}
              transparent
              opacity={0.55}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[r.radius - 0.04, r.radius + 0.04, 96]} />
            <meshStandardMaterial
              color="#fff0b8"
              emissive="#ffd700"
              emissiveIntensity={0.7}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* 8 Mandala Spokes */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`spoke-${i}`}
            position={[Math.cos(angle) * 13, 0.03, Math.sin(angle) * 13]}
            rotation={[-Math.PI / 2, 0, -angle]}
          >
            <planeGeometry args={[18, 0.07]} />
            <meshBasicMaterial color="#c99538" transparent opacity={0.25} />
          </mesh>
        );
      })}

      {/* North Breach Corridor */}
      <mesh position={[0, 0.06, 18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 12]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#d4af37"
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Rotating Cohort Rings */}
      {rings.map((r, idx) => (
        <group
          key={`ring-${idx}`}
          ref={(el) => { ringGroupRefs.current[idx] = el; }}
        >
          <InstancedCohort
            units={r.units}
            color={r.color}
            isLarge={idx === 2 || idx === 3}
          />
        </group>
      ))}
    </group>
  );
};

/**
 * GPU Instanced cohort — single draw call per ring
 */
const InstancedCohort: React.FC<{
  units: { x: number; z: number; angle: number }[];
  color: string;
  isLarge?: boolean;
}> = ({ units, color, isLarge = false }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = units.length;

  const geom = useMemo(() => {
    return isLarge
      ? new THREE.BoxGeometry(0.8, 0.65, 1.15)
      : new THREE.CylinderGeometry(0.22, 0.3, 0.8, 6);
  }, [isLarge]);

  const mat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.45,
      metalness: 0.55,
      emissive: isLarge ? '#6e2d0f' : '#8a5214',
      emissiveIntensity: 0.2
    });
  }, [color, isLarge]);

  React.useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const u = units[i];
      _tempObj.position.set(u.x, isLarge ? 0.42 : 0.45, u.z);
      _tempObj.rotation.set(0, -u.angle + Math.PI / 2, 0);
      _tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, _tempObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [units, count, isLarge]);

  return <instancedMesh ref={meshRef} args={[geom, mat, count]} castShadow={false} receiveShadow={false} />;
};

/**
 * Atmospheric Rising Embers — GPU Instanced
 */
const RisingEmbers: React.FC<{ count: number }> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 42,
      y: Math.random() * 14,
      z: (Math.random() - 0.5) * 42,
      speed: 0.35 + Math.random() * 0.7,
      drift: (Math.random() - 0.5) * 0.25,
      scale: 0.07 + Math.random() * 0.1
    }));
  }, [count]);

  const geom = useMemo(() => new THREE.SphereGeometry(0.1, 5, 5), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#ffb347',
    transparent: true,
    opacity: 0.7
  }), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.y += dt * p.speed;
      p.x += dt * p.drift;
      if (p.y > 16) {
        p.y = 0.2;
        p.x = (Math.random() - 0.5) * 42;
        p.z = (Math.random() - 0.5) * 42;
      }
      _tempObj.position.set(p.x, p.y, p.z);
      _tempObj.scale.setScalar(p.scale);
      _tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, _tempObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geom, mat, count]} />;
};
