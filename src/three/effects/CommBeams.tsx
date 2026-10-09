import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CommBus } from '../../simulation/communication/CommBus';

interface CommBeamsProps {
  commBus: CommBus;
  showComm: boolean;
}

export const CommBeams: React.FC<CommBeamsProps> = ({ commBus, showComm }) => {
  if (!showComm || commBus.activeBeams.length === 0) return null;

  return (
    <group>
      {commBus.activeBeams.map((beam) => {
        return <SingleBeam key={beam.id} beam={beam} />;
      })}
    </group>
  );
};

const SingleBeam: React.FC<{
  beam: {
    id: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    progress: number;
  };
}> = ({ beam }) => {
  const { lineObject, packetPos } = useMemo(() => {
    const fromV = new THREE.Vector3(beam.from.x, 0.8, beam.from.y);
    const toV = new THREE.Vector3(beam.to.x, 0.8, beam.to.y);
    const midV = new THREE.Vector3().addVectors(fromV, toV).multiplyScalar(0.5);
    midV.y += 2.0;

    const curve = new THREE.QuadraticBezierCurve3(fromV, midV, toV);
    const points = curve.getPoints(16);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: '#d4af37',
      transparent: true,
      opacity: 0.7,
      linewidth: 2
    });
    const line = new THREE.Line(geom, mat);
    const pos = curve.getPoint(beam.progress);

    return { lineObject: line, packetPos: pos };
  }, [beam.from.x, beam.from.y, beam.to.x, beam.to.y, beam.progress]);

  return (
    <group>
      <primitive object={lineObject} />
      <mesh position={packetPos}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#d4af37"
          emissiveIntensity={2.0}
        />
      </mesh>
    </group>
  );
};
