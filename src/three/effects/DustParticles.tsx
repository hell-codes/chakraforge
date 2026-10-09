import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DustParticles: React.FC = () => {
  const count = 150;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 8 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#d4af37"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
