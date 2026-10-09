import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SimulationEngine } from '../../simulation/core/Engine';

interface CombatEffects3DProps {
  engine: SimulationEngine;
}

/**
 * 3D Tactical Combat Effects — Kurukshetra Battlefield
 * 
 * Features:
 * 1. Incoming Bronze Arrow Volleys from Kaurava outer rings (parabolic trajectories)
 * 2. Outgoing Celestial Golden Arrow Bursts fired by Abhimanyu (radiant counter-fire)
 * 3. Weapon Clash Sparks & Shield Impact Flashes
 * 4. Ground Dust Trails kicking up behind moving chariots
 * 5. Fallen Arrows & Battlefield Debris permanently marking clash sites
 * 6. Heroic Last Stand Memorial Aura upon Abhimanyu's heroic fall
 */
export const CombatEffects3D: React.FC<CombatEffects3DProps> = ({ engine }) => {
  const arrowsMeshRef = useRef<THREE.InstancedMesh>(null);
  const abhiArrowsMeshRef = useRef<THREE.InstancedMesh>(null);
  const sparksPointsRef = useRef<THREE.Points>(null);
  const wheelDustPointsRef = useRef<THREE.Points>(null);
  const fallenArrowsMeshRef = useRef<THREE.InstancedMesh>(null);

  const HOSTILE_ARROW_COUNT = 32;
  const ABHI_ARROW_COUNT = 16;
  const FALLEN_ARROW_COUNT = 48;
  const SPARK_COUNT = 40;
  const DUST_PARTICLE_COUNT = 60;

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  // 1. Hostile Arrow Trajectories
  const hostileArrowsData = useMemo(() => {
    return Array.from({ length: HOSTILE_ARROW_COUNT }, (_, i) => ({
      angle: (i / HOSTILE_ARROW_COUNT) * Math.PI * 2 + (i % 3) * 0.2,
      distance: 8 + (i % 6) * 2.8,
      heightArc: 2.2 + (i % 4) * 0.7,
      speed: 0.9 + (i % 5) * 0.25,
      progress: (i / HOSTILE_ARROW_COUNT),
      targetOffsetX: (Math.random() - 0.5) * 0.8,
      targetOffsetZ: (Math.random() - 0.5) * 0.8
    }));
  }, []);

  // 2. Abhimanyu's Celestial Counter-Arrows (radiating outwards)
  const abhiArrowsData = useMemo(() => {
    return Array.from({ length: ABHI_ARROW_COUNT }, (_, i) => ({
      angle: (i / ABHI_ARROW_COUNT) * Math.PI * 2,
      maxDistance: 7 + (i % 4) * 3,
      heightArc: 1.5 + (i % 3) * 0.6,
      speed: 1.3 + (i % 3) * 0.4,
      progress: (i / ABHI_ARROW_COUNT)
    }));
  }, []);

  // 3. Fallen Arrows permanently embedded in ground near combat epicenter
  const fallenArrowsData = useMemo(() => {
    const list = [];
    for (let i = 0; i < FALLEN_ARROW_COUNT; i++) {
      const angle = (i / FALLEN_ARROW_COUNT) * Math.PI * 2 + (i % 5) * 0.4;
      const radius = 1.2 + (i % 8) * 1.1;
      list.push({
        x: Math.cos(angle) * radius + (Math.random() - 0.5) * 0.6,
        z: Math.sin(angle) * radius + (Math.random() - 0.5) * 0.6,
        tiltX: (Math.random() - 0.5) * 0.6,
        tiltZ: (Math.random() - 0.5) * 0.6,
        rotY: Math.random() * Math.PI * 2
      });
    }
    return list;
  }, []);

  // Shared Geometries & Materials
  const arrowGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.02, 0.025, 0.95, 4);
    geom.rotateX(Math.PI / 2);
    return geom;
  }, []);

  const hostileArrowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8b6938',
      metalness: 0.7,
      roughness: 0.3
    });
  }, []);

  const abhiArrowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffe599',
      emissive: '#d4af37',
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
  }, []);

  const fallenArrowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#69512c',
      roughness: 0.8
    });
  }, []);

  // Clashing Sparks Buffer
  const sparksGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -999;
      positions[i * 3 + 2] = 0;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  const sparksMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#ffd56b',
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Chariot Wheel Dust Particles Buffer
  const wheelDustGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(DUST_PARTICLE_COUNT * 3);
    for (let i = 0; i < DUST_PARTICLE_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -999;
      positions[i * 3 + 2] = 0;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  const wheelDustMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#bfa075',
      size: 0.35,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending
    });
  }, []);

  useFrame((_, delta) => {
    const abhimanyu = engine.agents.find((a) => a.heroType === 'ABHIMANYU' || a.index === 0);
    if (!abhimanyu) return;

    const isCombatActive =
      engine.phase === 'ENTERING' ||
      engine.phase === 'PENETRATING' ||
      engine.phase === 'SUPPORT_BLOCKED' ||
      engine.phase === 'ISOLATED' ||
      engine.phase === 'SURROUNDED' ||
      engine.phase === 'ESCAPE_ATTEMPT';

    const isEliminated = abhimanyu.status === 'ELIMINATED' || engine.phase === 'HISTORICAL_END';

    const targetX = abhimanyu.position.x;
    const targetZ = abhimanyu.position.y;
    const isMoving = abhimanyu.speed > 0.05;

    // A. Animate Hostile Arrow Flights
    if (arrowsMeshRef.current) {
      for (let i = 0; i < HOSTILE_ARROW_COUNT; i++) {
        const arrow = hostileArrowsData[i];

        if (!isCombatActive || isEliminated) {
          tempObject.position.set(0, -999, 0);
          tempObject.updateMatrix();
          arrowsMeshRef.current.setMatrixAt(i, tempObject.matrix);
          continue;
        }

        arrow.progress += delta * arrow.speed;
        if (arrow.progress >= 1.0) {
          arrow.progress = 0;
          arrow.angle = Math.random() * Math.PI * 2;
          arrow.distance = 6 + Math.random() * 8;
        }

        const startX = targetX + Math.cos(arrow.angle) * arrow.distance;
        const startZ = targetZ + Math.sin(arrow.angle) * arrow.distance;
        const destX = targetX + arrow.targetOffsetX;
        const destZ = targetZ + arrow.targetOffsetZ;

        const currentX = THREE.MathUtils.lerp(startX, destX, arrow.progress);
        const currentZ = THREE.MathUtils.lerp(startZ, destZ, arrow.progress);
        const currentY = 0.5 + 4 * arrow.heightArc * arrow.progress * (1 - arrow.progress);

        tempObject.position.set(currentX, currentY, currentZ);

        const nextP = Math.min(1.0, arrow.progress + 0.04);
        const nextX = THREE.MathUtils.lerp(startX, destX, nextP);
        const nextZ = THREE.MathUtils.lerp(startZ, destZ, nextP);
        const nextY = 0.5 + 4 * arrow.heightArc * nextP * (1 - nextP);

        tempObject.lookAt(nextX, nextY, nextZ);
        tempObject.updateMatrix();
        arrowsMeshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      arrowsMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // B. Animate Abhimanyu's Celestial Counter-Arrows
    if (abhiArrowsMeshRef.current) {
      for (let i = 0; i < ABHI_ARROW_COUNT; i++) {
        const arrow = abhiArrowsData[i];

        // Abhimanyu only counters while still active with bow intact
        if (!isCombatActive || engine.phase === 'SURROUNDED' || isEliminated) {
          tempObject.position.set(0, -999, 0);
          tempObject.updateMatrix();
          abhiArrowsMeshRef.current.setMatrixAt(i, tempObject.matrix);
          continue;
        }

        arrow.progress += delta * arrow.speed;
        if (arrow.progress >= 1.0) {
          arrow.progress = 0;
          arrow.angle = Math.random() * Math.PI * 2;
        }

        const endX = targetX + Math.cos(arrow.angle) * arrow.maxDistance;
        const endZ = targetZ + Math.sin(arrow.angle) * arrow.maxDistance;

        const currentX = THREE.MathUtils.lerp(targetX, endX, arrow.progress);
        const currentZ = THREE.MathUtils.lerp(targetZ, endZ, arrow.progress);
        const currentY = 0.7 + 4 * arrow.heightArc * arrow.progress * (1 - arrow.progress);

        tempObject.position.set(currentX, currentY, currentZ);

        const nextP = Math.min(1.0, arrow.progress + 0.04);
        const nextX = THREE.MathUtils.lerp(targetX, endX, nextP);
        const nextZ = THREE.MathUtils.lerp(targetZ, endZ, nextP);
        const nextY = 0.7 + 4 * arrow.heightArc * nextP * (1 - nextP);

        tempObject.lookAt(nextX, nextY, nextZ);
        tempObject.updateMatrix();
        abhiArrowsMeshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      abhiArrowsMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // C. Fallen Arrows Embedded in Earth Around Combat Site
    if (fallenArrowsMeshRef.current) {
      const showFallen = isCombatActive || isEliminated;
      for (let i = 0; i < FALLEN_ARROW_COUNT; i++) {
        const fa = fallenArrowsData[i];
        if (!showFallen) {
          tempObject.position.set(0, -999, 0);
        } else {
          // Arrows stick in earth at varying angles
          tempObject.position.set(targetX + fa.x, 0.25, targetZ + fa.z);
          tempObject.rotation.set(fa.tiltX, fa.rotY, fa.tiltZ);
        }
        tempObject.updateMatrix();
        fallenArrowsMeshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      fallenArrowsMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // D. Animate Weapon Clash Sparks & Shield Hits
    if (sparksPointsRef.current) {
      const posAttr = sparksGeometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      const time = performance.now() * 0.0035;

      for (let s = 0; s < SPARK_COUNT; s++) {
        if (!isCombatActive && !isEliminated) {
          positions[s * 3 + 1] = -999;
          continue;
        }
        const offsetAngle = (s / SPARK_COUNT) * Math.PI * 2 + time;
        const radius = 0.7 + (Math.sin(time * 3 + s) * 0.5 + 0.5) * 1.5;
        positions[s * 3] = targetX + Math.cos(offsetAngle) * radius;
        positions[s * 3 + 1] = 0.35 + (Math.sin(time * 5 + s) * 0.5 + 0.5) * 0.9;
        positions[s * 3 + 2] = targetZ + Math.sin(offsetAngle) * radius;
      }
      posAttr.needsUpdate = true;
    }

    // E. Dynamic Chariot Wheel Dust Puffs
    if (wheelDustPointsRef.current) {
      const posAttr = wheelDustGeometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      const time = performance.now() * 0.004;

      for (let d = 0; d < DUST_PARTICLE_COUNT; d++) {
        if (!isMoving || isEliminated) {
          positions[d * 3 + 1] = -999;
          continue;
        }
        // Trail behind chariot heading
        const heading = abhimanyu.heading;
        const trailDist = 1.0 + (d % 8) * 0.45;
        const trailX = targetX - Math.cos(heading) * trailDist;
        const trailZ = targetZ - Math.sin(heading) * trailDist;
        const jitter = Math.sin(time * 2 + d) * 0.4;

        positions[d * 3] = trailX + (d % 2 === 0 ? 0.6 : -0.6) + jitter;
        positions[d * 3 + 1] = 0.15 + ((d % 5) / 5) * 0.5;
        positions[d * 3 + 2] = trailZ + jitter;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Hostile Dark Bronze Inbound Arrow Volleys */}
      <instancedMesh
        ref={arrowsMeshRef}
        args={[arrowGeometry, hostileArrowMaterial, HOSTILE_ARROW_COUNT]}
        castShadow
      />

      {/* 2. Celestial Radiant Golden Counter-Arrow Bursts */}
      <instancedMesh
        ref={abhiArrowsMeshRef}
        args={[arrowGeometry, abhiArrowMaterial, ABHI_ARROW_COUNT]}
      />

      {/* 3. Fallen Arrows Sticking in Kurukshetra Battlefield Ground */}
      <instancedMesh
        ref={fallenArrowsMeshRef}
        args={[arrowGeometry, fallenArrowMaterial, FALLEN_ARROW_COUNT]}
        castShadow
      />

      {/* 4. Clashing Weapon Sparks & Deflection Glints */}
      <points
        ref={sparksPointsRef}
        geometry={sparksGeometry}
        material={sparksMaterial}
      />

      {/* 5. Chariot Ground Dust Puffs Trailing Running Wheels */}
      <points
        ref={wheelDustPointsRef}
        geometry={wheelDustGeometry}
        material={wheelDustMaterial}
      />
    </group>
  );
};
