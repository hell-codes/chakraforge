import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KurukshetraBattlefield3DProps {
  radius: number;
}

export const KurukshetraBattlefield3D: React.FC<KurukshetraBattlefield3DProps> = ({ radius }) => {
  const embersRef = useRef<THREE.Points>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const bannerGroupRef = useRef<THREE.Group>(null);

  // 1. Generate Campfires & War Braziers with realistic positions around perimeter
  const braziers = useMemo(() => {
    const list = [];
    const count = 16;
    const r = radius + 10;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + (i % 2 === 0 ? 0.05 : -0.05);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      list.push({ id: `brazier-${i}`, x, z, angle, size: 0.6 + (i % 3) * 0.2 });
    }
    return list;
  }, [radius]);

  // 2. Generate Ancient War Standards / Chariot Silhouettes on Horizon
  const perimeterWarriors = useMemo(() => {
    const list = [];
    const count = 24;
    const r = radius + 20;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const height = 4.0 + (i % 4) * 0.8;
      const isChariot = i % 3 === 0;
      list.push({ id: `warrior-${i}`, x, z, angle, height, isChariot });
    }
    return list;
  }, [radius]);

  // 3. Fire Sparks & Rising Embers Buffer
  const emberCount = 450;
  const [emberPositions, emberSpeeds] = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const speeds = new Float32Array(emberCount);
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
      speeds[i] = 0.8 + Math.random() * 2.0;
    }
    return [pos, speeds];
  }, []);

  // 4. Battlefield Dust Storm / Smoke Particle System
  const smokeCount = 250;
  const [smokePositions, smokeDrift] = useMemo(() => {
    const pos = new Float32Array(smokeCount * 3);
    const drift = new Float32Array(smokeCount);
    for (let i = 0; i < smokeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = 0.5 + Math.random() * 8.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 140;
      drift[i] = 0.2 + Math.random() * 0.6;
    }
    return [pos, drift];
  }, []);

  useFrame(({ clock }, delta) => {
    // Animate Fire Embers
    if (embersRef.current) {
      const posAttr = embersRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < emberCount; i++) {
        array[i * 3 + 1] += delta * emberSpeeds[i] * 2.5;
        array[i * 3] += Math.sin(clock.elapsedTime * 2 + i) * 0.04;
        array[i * 3 + 2] += Math.cos(clock.elapsedTime * 1.5 + i) * 0.04;

        if (array[i * 3 + 1] > 22) {
          array[i * 3 + 1] = 0.2;
          array[i * 3] = (Math.random() - 0.5) * 120;
          array[i * 3 + 2] = (Math.random() - 0.5) * 120;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Animate Battlefield Smoke & Dust Storm drift
    if (smokeRef.current) {
      const posAttr = smokeRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < smokeCount; i++) {
        array[i * 3] += delta * smokeDrift[i] * 1.5;
        if (array[i * 3] > 70) array[i * 3] = -70;
      }
      posAttr.needsUpdate = true;
    }

    // Subtle banner wave
    if (bannerGroupRef.current) {
      bannerGroupRef.current.children.forEach((child, idx) => {
        child.rotation.z = Math.sin(clock.elapsedTime * 3 + idx) * 0.05;
      });
    }
  });

  return (
    <group>
      {/* Distant Kurukshetra War Horizon Silhouettes (Chariots & Infantry Standards) */}
      <group ref={bannerGroupRef}>
        {perimeterWarriors.map((w, idx) => (
          <group key={w.id} position={[w.x, 0, w.z]} rotation={[0, -w.angle + Math.PI / 2, 0]}>
            {/* Standard Mast */}
            <mesh position={[0, w.height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, w.height, 6]} />
              <meshStandardMaterial color="#3a2719" roughness={0.9} />
            </mesh>

            {/* Saffron & Crimson Silk War Pennant */}
            <mesh position={[0.7, w.height - 0.7, 0]}>
              <boxGeometry args={[1.4, 0.85, 0.03]} />
              <meshStandardMaterial
                color={idx % 3 === 0 ? '#d4af37' : idx % 3 === 1 ? '#b83227' : '#8e44ad'}
                roughness={0.6}
                metalness={0.3}
              />
            </mesh>

            {/* Chariot Silhouette Block if chariot unit */}
            {w.isChariot && (
              <group position={[0, 0.6, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[1.6, 1.2, 2.4]} />
                  <meshStandardMaterial color="#24170e" roughness={0.8} />
                </mesh>
                {/* Chariot Wheels */}
                <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.7, 0.7, 0.2, 12]} />
                  <meshStandardMaterial color="#8c6d46" metalness={0.7} />
                </mesh>
                <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.7, 0.7, 0.2, 12]} />
                  <meshStandardMaterial color="#8c6d46" metalness={0.7} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>

      {/* Burning War Braziers & Flaming Altars */}
      {braziers.map((b, idx) => (
        <group key={b.id} position={[b.x, 0, b.z]}>
          {/* Stone Brazier Altar Base */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.45 * b.size, 0.6 * b.size, 1.3, 8]} />
            <meshStandardMaterial color="#302015" roughness={0.9} metalness={0.2} />
          </mesh>

          {/* Bronze Fire Bowl */}
          <mesh position={[0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.65 * b.size, 0.45 * b.size, 0.4, 8]} />
            <meshStandardMaterial color="#734d26" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Animated Glowing Fire Core with Emissive Radiance */}
          <mesh position={[0, 1.75, 0]}>
            <coneGeometry args={[0.35 * b.size, 0.9 * b.size, 8]} />
            <meshStandardMaterial
              color="#ff6600"
              emissive="#ff4400"
              emissiveIntensity={1.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Rising Fire Embers Particle Cloud */}
      <points ref={embersRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#ffaa11"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dust & Smoke Particulate Cloud */}
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[smokePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          color="#664d33"
          transparent
          opacity={0.25}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
};
