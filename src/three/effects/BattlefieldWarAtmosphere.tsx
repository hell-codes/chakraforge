import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BattlefieldWarAtmosphereProps {
  radius: number;
}

export const BattlefieldWarAtmosphere: React.FC<BattlefieldWarAtmosphereProps> = ({ radius }) => {
  const torchCount = 12;
  const emberCount = 300;
  const embersRef = useRef<THREE.Points>(null);
  const lightsRef = useRef<THREE.PointLight[]>([]);

  // 1. Distant War Torches around perimeter
  const torches = useMemo(() => {
    const list = [];
    const r = radius + 8;
    for (let i = 0; i < torchCount; i++) {
      const angle = (i * Math.PI * 2) / torchCount;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      list.push({ x, z, angle, id: `torch-${i}` });
    }
    return list;
  }, [radius]);

  // 2. Rising Fire Embers & Sparks
  const [emberPositions, emberSpeeds] = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const speeds = new Float32Array(emberCount);
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, speeds];
  }, []);

  // 3. Distant War Banners / Battle Standards Silhouettes
  const banners = useMemo(() => {
    const list = [];
    const r = radius + 14;
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16 + (Math.random() * 0.1);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      list.push({ x, z, angle, height: 3.5 + Math.random() * 2 });
    }
    return list;
  }, [radius]);

  useFrame(({ clock }, delta) => {
    // Animate Fire Embers rising into the night sky
    if (embersRef.current) {
      const geom = embersRef.current.geometry;
      const posAttr = geom.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < emberCount; i++) {
        array[i * 3 + 1] += delta * emberSpeeds[i] * 2.2;
        array[i * 3] += Math.sin(clock.elapsedTime * 2 + i) * 0.03;
        array[i * 3 + 2] += Math.cos(clock.elapsedTime * 1.5 + i) * 0.03;

        // Reset if reached ceiling
        if (array[i * 3 + 1] > 18) {
          array[i * 3 + 1] = 0.2;
          array[i * 3] = (Math.random() - 0.5) * 100;
          array[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Flicker Torch Lights
    lightsRef.current.forEach((light, idx) => {
      if (light) {
        light.intensity = 2.0 + Math.sin(clock.elapsedTime * 8 + idx * 3) * 0.8;
      }
    });
  });

  return (
    <group>
      {/* Distant Battlefield War Banners & Standards */}
      {banners.map((b, idx) => (
        <group key={`banner-${idx}`} position={[b.x, 0, b.z]} rotation={[0, -b.angle + Math.PI / 2, 0]}>
          {/* Flagpole */}
          <mesh position={[0, b.height / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.1, b.height, 6]} />
            <meshStandardMaterial color="#4a3525" roughness={0.8} />
          </mesh>
          {/* Ancient Crimson / Saffron War Flag */}
          <mesh position={[0.6, b.height - 0.6, 0]}>
            <boxGeometry args={[1.2, 0.7, 0.04]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#b83227' : '#d4af37'}
              roughness={0.7}
              metalness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* War Torches & Bonfires */}
      {torches.map((t, idx) => (
        <group key={t.id} position={[t.x, 0, t.z]}>
          {/* Brazier Stone Base */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 1.2, 8]} />
            <meshStandardMaterial color="#2d1f14" roughness={0.9} />
          </mesh>

          {/* Flame Core */}
          <mesh position={[0, 1.35, 0]}>
            <coneGeometry args={[0.3, 0.7, 8]} />
            <meshBasicMaterial color="#ff7700" />
          </mesh>

          {/* Torch Flickering Light */}
          <pointLight
            ref={(el) => {
              if (el) lightsRef.current[idx] = el;
            }}
            position={[0, 1.6, 0]}
            color="#ff5500"
            intensity={2.2}
            distance={16}
            decay={2}
          />
        </group>
      ))}

      {/* Rising Embers & Spark Particles */}
      <points ref={embersRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[emberPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#ffaa22"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
