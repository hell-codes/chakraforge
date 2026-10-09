import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TerrainProps {
  radius: number;
  showGrid?: boolean;
}

export const Terrain: React.FC<TerrainProps> = ({ radius, showGrid = false }) => {
  // Generate tactical distance rings (only active when showGrid = true)
  const gridCircles = useMemo(() => {
    if (!showGrid) return [];
    const circles = [];
    for (let r = 3.5; r <= radius + 18; r += 3.2) {
      circles.push(r);
    }
    return circles;
  }, [radius, showGrid]);

  // Generate radial lines (only active when showGrid = true)
  const radialLinesObj = useMemo(() => {
    if (!showGrid) return null;
    const points: THREE.Vector3[] = [];
    const maxR = radius + 18;
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      points.push(new THREE.Vector3(0, 0.02, 0));
      points.push(new THREE.Vector3(Math.cos(angle) * maxR, 0.02, Math.sin(angle) * maxR));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: '#8c6d46', transparent: true, opacity: 0.35 });
    return new THREE.LineSegments(geometry, material);
  }, [radius, showGrid]);

  // Small battlefield rocks & terrain debris
  const terrainDebris = useMemo(() => {
    const list: { x: number; z: number; scale: number }[] = [];
    // Seeded pseudo-random stones
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < 60; i++) {
      const angle = pseudoRandom() * Math.PI * 2;
      const dist = 5.0 + pseudoRandom() * (radius + 15);
      list.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        scale: 0.2 + pseudoRandom() * 0.35
      });
    }
    return list;
  }, [radius]);

  return (
    <group position={[0, -0.05, 0]}>
      {/* 1. Primary Kurukshetra Dusty Earth Battlefield Plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[260, 260, 64, 64]} />
        <meshStandardMaterial
          color="#2a1208"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Battlefield Wheel Tracks & Disturbed Sandy Earth Layer */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.0, radius + 14, 64]} />
        <meshStandardMaterial
          color="#241006"
          roughness={0.98}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Central Command Position Earthwork Dais */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[3.8, 32]} />
        <meshStandardMaterial
          color="#180a04"
          roughness={0.9}
          metalness={0.15}
        />
      </mesh>

      {/* 4. Natural Battlefield Dust & Soil Texture Variations */}
      <group position={[0, 0.02, 0]}>
        {/* Subtle trampled ground patches along main movement corridors */}
        {[-8, -4, 0, 4, 8].map((offset, idx) => (
          <mesh key={`soil-patch-${idx}`} rotation={[-Math.PI / 2, 0, (idx * Math.PI) / 3]} position={[offset * 1.5, 0, (offset % 3) * 2]}>
            <circleGeometry args={[2.5 + (idx % 2), 16]} />
            <meshStandardMaterial
              color="#6b4625"
              roughness={0.98}
              transparent
              opacity={0.35}
            />
          </mesh>
        ))}
      </group>

      {/* 5. Natural Battlefield Rocks & Stones */}
      {terrainDebris.map((stone, idx) => (
        <mesh
          key={`stone-${idx}`}
          position={[stone.x, 0.05, stone.z]}
          scale={[stone.scale, stone.scale * 0.6, stone.scale]}
          castShadow
        >
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#4a3f36" roughness={0.9} />
        </mesh>
      ))}

      {/* 6. Tactical Compass & Grid Lines (ONLY visible when Debug Nav is ON) */}
      {showGrid && (
        <group>
          {gridCircles.map((r, i) => (
            <mesh key={`grid-ring-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
              <ringGeometry args={[r - 0.04, r + 0.04, 64]} />
              <meshBasicMaterial
                color="#c09f58"
                transparent
                opacity={i % 2 === 0 ? 0.35 : 0.15}
              />
            </mesh>
          ))}
          {radialLinesObj && <primitive object={radialLinesObj} />}
        </group>
      )}
    </group>
  );
};
