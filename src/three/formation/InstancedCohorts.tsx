import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export interface WarriorUnitData {
  x: number;
  z: number;
  angle: number;
  hasBanner: boolean;
  rankOffset: number;
}

const tempObject = new THREE.Object3D();
const tempMatrix = new THREE.Matrix4();

// -------------------------------------------------------------
// 1. INSTANCED SWORDSMEN PHALANX (PADATI INFANTRY)
// -------------------------------------------------------------
export const InstancedSwordsmenRing: React.FC<{
  units: WarriorUnitData[];
  primaryColor: string;
  bannerColor: string;
}> = ({ units, primaryColor, bannerColor }) => {
  const count = units.length;
  const bannerUnits = useMemo(() => units.filter((u) => u.hasBanner), [units]);
  const bannerCount = bannerUnits.length;

  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const helmetRef = useRef<THREE.InstancedMesh>(null);
  const shieldRef = useRef<THREE.InstancedMesh>(null);
  const swordRef = useRef<THREE.InstancedMesh>(null);
  const bannerPoleRef = useRef<THREE.InstancedMesh>(null);
  const bannerClothRef = useRef<THREE.InstancedMesh>(null);

  // Shared Geometries
  const bodyGeom = useMemo(() => new THREE.CylinderGeometry(0.2, 0.24, 0.7, 8), []);
  const helmetGeom = useMemo(() => new THREE.SphereGeometry(0.16, 8, 8), []);
  const shieldGeom = useMemo(() => new THREE.CylinderGeometry(0.3, 0.3, 0.05, 12), []);
  const swordGeom = useMemo(() => new THREE.BoxGeometry(0.04, 0.65, 0.08), []);
  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 2.2, 5), []);
  const clothGeom = useMemo(() => new THREE.PlaneGeometry(0.45, 0.28), []);

  // Shared Materials
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: primaryColor, emissive: primaryColor, emissiveIntensity: 0.25, roughness: 0.6, metalness: 0.3 }), [primaryColor]);
  const helmetMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c09f58', roughness: 0.3, metalness: 0.7 }), []);
  const shieldMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8a5d2b', roughness: 0.5, metalness: 0.6 }), []);
  const swordMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c0c0c0', roughness: 0.2, metalness: 0.9 }), []);
  const poleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5c3c24', roughness: 0.8 }), []);
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({ color: bannerColor, side: THREE.DoubleSide }), [bannerColor]);

  useLayoutEffect(() => {
    if (!bodyRef.current || !helmetRef.current || !shieldRef.current || !swordRef.current) return;

    for (let i = 0; i < count; i++) {
      const u = units[i];
      const rotY = -u.angle + Math.PI / 2;
      const baseScale = 0.75;

      // 1. Torso
      tempObject.position.set(u.x, 0.55 * baseScale, u.z);
      tempObject.rotation.set(0, rotY, 0);
      tempObject.scale.set(baseScale, baseScale, baseScale);
      tempObject.updateMatrix();
      bodyRef.current.setMatrixAt(i, tempObject.matrix);

      // 2. Helmet
      tempObject.position.set(u.x, 0.98 * baseScale, u.z);
      tempObject.updateMatrix();
      helmetRef.current.setMatrixAt(i, tempObject.matrix);

      // 3. Shield (Left Forearm offset)
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);
      const shX = -0.26 * baseScale;
      const shZ = 0.1 * baseScale;
      tempObject.position.set(u.x + shX * cos - shZ * sin, 0.55 * baseScale, u.z + shX * sin + shZ * cos);
      tempObject.rotation.set(0, rotY + 0.2, 0);
      tempObject.updateMatrix();
      shieldRef.current.setMatrixAt(i, tempObject.matrix);

      // 4. Sword (Right Hand forward strike angle)
      const swX = 0.26 * baseScale;
      const swZ = 0.15 * baseScale;
      tempObject.position.set(u.x + swX * cos - swZ * sin, 0.65 * baseScale, u.z + swX * sin + swZ * cos);
      tempObject.rotation.set(0.4, rotY, -0.1);
      tempObject.updateMatrix();
      swordRef.current.setMatrixAt(i, tempObject.matrix);
    }

    bodyRef.current.instanceMatrix.needsUpdate = true;
    helmetRef.current.instanceMatrix.needsUpdate = true;
    shieldRef.current.instanceMatrix.needsUpdate = true;
    swordRef.current.instanceMatrix.needsUpdate = true;

    // Banners
    if (bannerPoleRef.current && bannerClothRef.current && bannerCount > 0) {
      for (let b = 0; b < bannerCount; b++) {
        const u = bannerUnits[b];
        const rotY = -u.angle + Math.PI / 2;
        const cos = Math.cos(rotY);
        const sin = Math.sin(rotY);
        const bX = 0.28 * 0.75;
        const bZ = -0.2 * 0.75;

        // Pole
        tempObject.position.set(u.x + bX * cos - bZ * sin, 1.1, u.z + bX * sin + bZ * cos);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        bannerPoleRef.current.setMatrixAt(b, tempObject.matrix);

        // Cloth
        tempObject.position.set(u.x + (bX + 0.22) * cos - bZ * sin, 1.85, u.z + (bX + 0.22) * sin + bZ * cos);
        tempObject.updateMatrix();
        bannerClothRef.current.setMatrixAt(b, tempObject.matrix);
      }
      bannerPoleRef.current.instanceMatrix.needsUpdate = true;
      bannerClothRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [units, count, bannerUnits, bannerCount]);

  if (count === 0) return null;

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[bodyGeom, bodyMat, count]} castShadow receiveShadow />
      <instancedMesh ref={helmetRef} args={[helmetGeom, helmetMat, count]} castShadow />
      <instancedMesh ref={shieldRef} args={[shieldGeom, shieldMat, count]} castShadow />
      <instancedMesh ref={swordRef} args={[swordGeom, swordMat, count]} castShadow />
      {bannerCount > 0 && (
        <>
          <instancedMesh ref={bannerPoleRef} args={[poleGeom, poleMat, bannerCount]} castShadow />
          <instancedMesh ref={bannerClothRef} args={[clothGeom, clothMat, bannerCount]} />
        </>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// 2. INSTANCED ARCHERY COHORTS (BOWMEN PHALANX)
// -------------------------------------------------------------
export const InstancedArchersRing: React.FC<{
  units: WarriorUnitData[];
  primaryColor: string;
  bannerColor: string;
}> = ({ units, primaryColor, bannerColor }) => {
  const count = units.length;
  const bannerUnits = useMemo(() => units.filter((u) => u.hasBanner), [units]);
  const bannerCount = bannerUnits.length;

  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const bowRef = useRef<THREE.InstancedMesh>(null);
  const quiverRef = useRef<THREE.InstancedMesh>(null);
  const bannerPoleRef = useRef<THREE.InstancedMesh>(null);
  const bannerClothRef = useRef<THREE.InstancedMesh>(null);

  const bodyGeom = useMemo(() => new THREE.CylinderGeometry(0.19, 0.22, 0.7, 7), []);
  const headGeom = useMemo(() => new THREE.SphereGeometry(0.15, 8, 8), []);
  const bowGeom = useMemo(() => new THREE.TorusGeometry(0.38, 0.022, 6, 12, Math.PI * 0.9), []);
  const quiverGeom = useMemo(() => new THREE.CylinderGeometry(0.07, 0.07, 0.55, 6), []);
  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 2.2, 5), []);
  const clothGeom = useMemo(() => new THREE.PlaneGeometry(0.45, 0.28), []);

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: primaryColor, emissive: primaryColor, emissiveIntensity: 0.25, roughness: 0.7 }), [primaryColor]);
  const headMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a2517', roughness: 0.7 }), []);
  const bowMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#4a2e18', roughness: 0.6 }), []);
  const quiverMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#6e4726', roughness: 0.8 }), []);
  const poleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5c3c24', roughness: 0.8 }), []);
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({ color: bannerColor, side: THREE.DoubleSide }), [bannerColor]);

  useLayoutEffect(() => {
    if (!bodyRef.current || !headRef.current || !bowRef.current || !quiverRef.current) return;

    for (let i = 0; i < count; i++) {
      const u = units[i];
      const rotY = -u.angle + Math.PI / 2;
      const baseScale = 0.75;
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);

      // Torso
      tempObject.position.set(u.x, 0.55 * baseScale, u.z);
      tempObject.rotation.set(0, rotY, 0);
      tempObject.scale.set(baseScale, baseScale, baseScale);
      tempObject.updateMatrix();
      bodyRef.current.setMatrixAt(i, tempObject.matrix);

      // Head
      tempObject.position.set(u.x, 0.98 * baseScale, u.z);
      tempObject.updateMatrix();
      headRef.current.setMatrixAt(i, tempObject.matrix);

      // Bow held forward
      const bX = 0.22 * baseScale;
      const bZ = 0.18 * baseScale;
      tempObject.position.set(u.x + bX * cos - bZ * sin, 0.68 * baseScale, u.z + bX * sin + bZ * cos);
      tempObject.rotation.set(0, rotY + 0.2, 0.3);
      tempObject.updateMatrix();
      bowRef.current.setMatrixAt(i, tempObject.matrix);

      // Quiver on back
      const qX = -0.14 * baseScale;
      const qZ = -0.15 * baseScale;
      tempObject.position.set(u.x + qX * cos - qZ * sin, 0.65 * baseScale, u.z + qX * sin + qZ * cos);
      tempObject.rotation.set(0.3, rotY, -0.3);
      tempObject.updateMatrix();
      quiverRef.current.setMatrixAt(i, tempObject.matrix);
    }

    bodyRef.current.instanceMatrix.needsUpdate = true;
    headRef.current.instanceMatrix.needsUpdate = true;
    bowRef.current.instanceMatrix.needsUpdate = true;
    quiverRef.current.instanceMatrix.needsUpdate = true;

    if (bannerPoleRef.current && bannerClothRef.current && bannerCount > 0) {
      for (let b = 0; b < bannerCount; b++) {
        const u = bannerUnits[b];
        const rotY = -u.angle + Math.PI / 2;
        const cos = Math.cos(rotY);
        const sin = Math.sin(rotY);
        const bX = 0.3 * 0.75;

        tempObject.position.set(u.x + bX * cos, 1.1, u.z + bX * sin);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        bannerPoleRef.current.setMatrixAt(b, tempObject.matrix);

        tempObject.position.set(u.x + (bX + 0.22) * cos, 1.85, u.z + (bX + 0.22) * sin);
        tempObject.updateMatrix();
        bannerClothRef.current.setMatrixAt(b, tempObject.matrix);
      }
      bannerPoleRef.current.instanceMatrix.needsUpdate = true;
      bannerClothRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [units, count, bannerUnits, bannerCount]);

  if (count === 0) return null;

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[bodyGeom, bodyMat, count]} castShadow receiveShadow />
      <instancedMesh ref={headRef} args={[headGeom, headMat, count]} castShadow />
      <instancedMesh ref={bowRef} args={[bowGeom, bowMat, count]} />
      <instancedMesh ref={quiverRef} args={[quiverGeom, quiverMat, count]} />
      {bannerCount > 0 && (
        <>
          <instancedMesh ref={bannerPoleRef} args={[poleGeom, poleMat, bannerCount]} castShadow />
          <instancedMesh ref={bannerClothRef} args={[clothGeom, clothMat, bannerCount]} />
        </>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// 3. INSTANCED WAR ELEPHANTS (GAJASENA SHOCK CORPS)
// Real proportions: 4 legs, torso, head, tusks, trunk, howdah & rider
// -------------------------------------------------------------
export const InstancedElephantsRing: React.FC<{
  units: WarriorUnitData[];
  bannerColor: string;
}> = ({ units, bannerColor }) => {
  const count = units.length;
  const bannerUnits = useMemo(() => units.filter((u) => u.hasBanner), [units]);
  const bannerCount = bannerUnits.length;

  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const caparisonRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const tuskLeftRef = useRef<THREE.InstancedMesh>(null);
  const tuskRightRef = useRef<THREE.InstancedMesh>(null);
  const legsRef = useRef<THREE.InstancedMesh>(null);
  const howdahRef = useRef<THREE.InstancedMesh>(null);
  const mahoutRef = useRef<THREE.InstancedMesh>(null);
  const bannerPoleRef = useRef<THREE.InstancedMesh>(null);
  const bannerClothRef = useRef<THREE.InstancedMesh>(null);

  // Geometries
  const bodyGeom = useMemo(() => new THREE.BoxGeometry(1.35, 1.2, 2.0), []);
  const caparisonGeom = useMemo(() => new THREE.BoxGeometry(1.4, 0.24, 1.6), []);
  const headGeom = useMemo(() => new THREE.SphereGeometry(0.55, 8, 8), []);
  const trunkGeom = useMemo(() => new THREE.CylinderGeometry(0.11, 0.17, 0.95, 6), []);
  const tuskGeom = useMemo(() => new THREE.CylinderGeometry(0.04, 0.08, 0.85, 6), []);
  const legGeom = useMemo(() => new THREE.CylinderGeometry(0.2, 0.24, 1.0, 8), []);
  const howdahGeom = useMemo(() => new THREE.BoxGeometry(1.0, 0.55, 1.0), []);
  const mahoutGeom = useMemo(() => new THREE.CylinderGeometry(0.16, 0.18, 0.5, 6), []);
  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 1.8, 5), []);
  const clothGeom = useMemo(() => new THREE.PlaneGeometry(0.55, 0.35), []);

  // Materials
  const elephantMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#38322e', roughness: 0.9 }), []);
  const caparisonMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#7a2838', roughness: 0.65 }), []);
  const tuskMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f5eedc', roughness: 0.3 }), []);
  const howdahMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5c3c24', roughness: 0.6 }), []);
  const mahoutMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8b261d', roughness: 0.7 }), []);
  const poleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c09f58', metalness: 0.7 }), []);
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({ color: bannerColor, side: THREE.DoubleSide }), [bannerColor]);

  useLayoutEffect(() => {
    if (
      !bodyRef.current ||
      !caparisonRef.current ||
      !headRef.current ||
      !trunkRef.current ||
      !tuskLeftRef.current ||
      !tuskRightRef.current ||
      !legsRef.current ||
      !howdahRef.current ||
      !mahoutRef.current
    )
      return;

    const scale = 0.95;

    for (let i = 0; i < count; i++) {
      const u = units[i];
      const rotY = -u.angle + Math.PI / 2;
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);

      // Body
      tempObject.position.set(u.x, 1.25 * scale, u.z);
      tempObject.rotation.set(0, rotY, 0);
      tempObject.scale.set(scale, scale, scale);
      tempObject.updateMatrix();
      bodyRef.current.setMatrixAt(i, tempObject.matrix);

      // Caparison
      tempObject.position.set(u.x, 1.68 * scale, u.z);
      tempObject.updateMatrix();
      caparisonRef.current.setMatrixAt(i, tempObject.matrix);

      // Head
      const hZ = 1.15 * scale;
      tempObject.position.set(u.x - hZ * sin, 1.45 * scale, u.z + hZ * cos);
      tempObject.updateMatrix();
      headRef.current.setMatrixAt(i, tempObject.matrix);

      // Trunk
      const trZ = 1.52 * scale;
      tempObject.position.set(u.x - trZ * sin, 0.9 * scale, u.z + trZ * cos);
      tempObject.rotation.set(-0.35, rotY, 0);
      tempObject.updateMatrix();
      trunkRef.current.setMatrixAt(i, tempObject.matrix);

      // Left Tusk
      const tlX = -0.28 * scale;
      const tlZ = 1.58 * scale;
      tempObject.position.set(u.x + tlX * cos - tlZ * sin, 1.18 * scale, u.z + tlX * sin + tlZ * cos);
      tempObject.rotation.set(0.4, rotY, -0.2);
      tempObject.updateMatrix();
      tuskLeftRef.current.setMatrixAt(i, tempObject.matrix);

      // Right Tusk
      const trX = 0.28 * scale;
      tempObject.position.set(u.x + trX * cos - tlZ * sin, 1.18 * scale, u.z + trX * sin + tlZ * cos);
      tempObject.rotation.set(0.4, rotY, 0.2);
      tempObject.updateMatrix();
      tuskRightRef.current.setMatrixAt(i, tempObject.matrix);

      // 4 Pillar Legs
      const legOffsets = [
        [-0.5, -0.65],
        [0.5, -0.65],
        [-0.5, 0.65],
        [0.5, 0.65]
      ];
      for (let l = 0; l < 4; l++) {
        const [lx, lz] = legOffsets[l];
        const worldLX = u.x + (lx * scale) * cos - (lz * scale) * sin;
        const worldLZ = u.z + (lx * scale) * sin + (lz * scale) * cos;
        tempObject.position.set(worldLX, 0.5 * scale, worldLZ);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.updateMatrix();
        legsRef.current.setMatrixAt(i * 4 + l, tempObject.matrix);
      }

      // Howdah & Mahout
      tempObject.position.set(u.x, 2.05 * scale, u.z);
      tempObject.rotation.set(0, rotY, 0);
      tempObject.updateMatrix();
      howdahRef.current.setMatrixAt(i, tempObject.matrix);

      tempObject.position.set(u.x, 2.45 * scale, u.z);
      tempObject.updateMatrix();
      mahoutRef.current.setMatrixAt(i, tempObject.matrix);
    }

    bodyRef.current.instanceMatrix.needsUpdate = true;
    caparisonRef.current.instanceMatrix.needsUpdate = true;
    headRef.current.instanceMatrix.needsUpdate = true;
    trunkRef.current.instanceMatrix.needsUpdate = true;
    tuskLeftRef.current.instanceMatrix.needsUpdate = true;
    tuskRightRef.current.instanceMatrix.needsUpdate = true;
    legsRef.current.instanceMatrix.needsUpdate = true;
    howdahRef.current.instanceMatrix.needsUpdate = true;
    mahoutRef.current.instanceMatrix.needsUpdate = true;

    if (bannerPoleRef.current && bannerClothRef.current && bannerCount > 0) {
      for (let b = 0; b < bannerCount; b++) {
        const u = bannerUnits[b];
        const rotY = -u.angle + Math.PI / 2;
        const cos = Math.cos(rotY);
        const sin = Math.sin(rotY);
        const bX = 0.4;

        tempObject.position.set(u.x + bX * cos, 2.5, u.z + bX * sin);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        bannerPoleRef.current.setMatrixAt(b, tempObject.matrix);

        tempObject.position.set(u.x + (bX + 0.22) * cos, 3.05, u.z + (bX + 0.22) * sin);
        tempObject.updateMatrix();
        bannerClothRef.current.setMatrixAt(b, tempObject.matrix);
      }
      bannerPoleRef.current.instanceMatrix.needsUpdate = true;
      bannerClothRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [units, count, bannerUnits, bannerCount]);

  if (count === 0) return null;

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[bodyGeom, elephantMat, count]} castShadow receiveShadow />
      <instancedMesh ref={caparisonRef} args={[caparisonGeom, caparisonMat, count]} castShadow />
      <instancedMesh ref={headRef} args={[headGeom, elephantMat, count]} castShadow />
      <instancedMesh ref={trunkRef} args={[trunkGeom, elephantMat, count]} castShadow />
      <instancedMesh ref={tuskLeftRef} args={[tuskGeom, tuskMat, count]} castShadow />
      <instancedMesh ref={tuskRightRef} args={[tuskGeom, tuskMat, count]} castShadow />
      <instancedMesh ref={legsRef} args={[legGeom, elephantMat, count * 4]} castShadow />
      <instancedMesh ref={howdahRef} args={[howdahGeom, howdahMat, count]} castShadow />
      <instancedMesh ref={mahoutRef} args={[mahoutGeom, mahoutMat, count]} castShadow />
      {bannerCount > 0 && (
        <>
          <instancedMesh ref={bannerPoleRef} args={[poleGeom, poleMat, bannerCount]} castShadow />
          <instancedMesh ref={bannerClothRef} args={[clothGeom, clothMat, bannerCount]} />
        </>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// 4. INSTANCED WAR CHARIOTS (RATHASENA)
// Wooden chassis, 2 rotating wheels, yoke, 2 warhorses, driver
// -------------------------------------------------------------
export const InstancedChariotsRing: React.FC<{
  units: WarriorUnitData[];
  primaryColor: string;
  bannerColor: string;
}> = ({ units, primaryColor, bannerColor }) => {
  const count = units.length;
  const bannerUnits = useMemo(() => units.filter((u) => u.hasBanner), [units]);
  const bannerCount = bannerUnits.length;

  const chassisRef = useRef<THREE.InstancedMesh>(null);
  const wheelsRef = useRef<THREE.InstancedMesh>(null);
  const horsesRef = useRef<THREE.InstancedMesh>(null);
  const warriorsRef = useRef<THREE.InstancedMesh>(null);
  const bannerPoleRef = useRef<THREE.InstancedMesh>(null);
  const bannerClothRef = useRef<THREE.InstancedMesh>(null);

  const chassisGeom = useMemo(() => new THREE.BoxGeometry(1.2, 0.22, 1.4), []);
  const wheelGeom = useMemo(() => new THREE.CylinderGeometry(0.5, 0.5, 0.12, 12), []);
  const horseGeom = useMemo(() => new THREE.BoxGeometry(0.45, 0.95, 1.4), []);
  const warriorGeom = useMemo(() => new THREE.CylinderGeometry(0.18, 0.22, 0.65, 8), []);
  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 2.2, 5), []);
  const clothGeom = useMemo(() => new THREE.PlaneGeometry(0.55, 0.35), []);

  const chassisMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5c3c24', roughness: 0.7 }), []);
  const wheelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8a5d2b', metalness: 0.6, roughness: 0.4 }), []);
  const horseMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#4a2f1b', roughness: 0.8 }), []);
  const warriorMat = useMemo(() => new THREE.MeshStandardMaterial({ color: primaryColor, emissive: primaryColor, emissiveIntensity: 0.25, roughness: 0.6 }), [primaryColor]);
  const poleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c09f58', metalness: 0.7 }), []);
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({ color: bannerColor, side: THREE.DoubleSide }), [bannerColor]);

  useLayoutEffect(() => {
    if (!chassisRef.current || !wheelsRef.current || !horsesRef.current || !warriorsRef.current) return;

    const scale = 0.85;

    for (let i = 0; i < count; i++) {
      const u = units[i];
      const rotY = -u.angle + Math.PI / 2;
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);

      // Chassis
      tempObject.position.set(u.x, 0.42 * scale, u.z);
      tempObject.rotation.set(0, rotY, 0);
      tempObject.scale.set(scale, scale, scale);
      tempObject.updateMatrix();
      chassisRef.current.setMatrixAt(i, tempObject.matrix);

      // 2 Spoked Wheels
      const wOffsets = [-0.68, 0.68];
      for (let w = 0; w < 2; w++) {
        const wx = wOffsets[w] * scale;
        tempObject.position.set(u.x + wx * cos, 0.45 * scale, u.z + wx * sin);
        tempObject.rotation.set(0, rotY, Math.PI / 2);
        tempObject.updateMatrix();
        wheelsRef.current.setMatrixAt(i * 2 + w, tempObject.matrix);
      }

      // 2 Harnessed War Horses in front
      const hOffsets = [-0.38, 0.38];
      const frontZ = 1.65 * scale;
      for (let h = 0; h < 2; h++) {
        const hx = hOffsets[h] * scale;
        tempObject.position.set(u.x + hx * cos - frontZ * sin, 0.55 * scale, u.z + hx * sin + frontZ * cos);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.updateMatrix();
        horsesRef.current.setMatrixAt(i * 2 + h, tempObject.matrix);
      }

      // 2 Warriors (Driver + Fighter)
      const warriorOffsets = [-0.25, 0.25];
      for (let wr = 0; wr < 2; wr++) {
        const wrx = warriorOffsets[wr] * scale;
        tempObject.position.set(u.x + wrx * cos, 0.85 * scale, u.z + wrx * sin);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.updateMatrix();
        warriorsRef.current.setMatrixAt(i * 2 + wr, tempObject.matrix);
      }
    }

    chassisRef.current.instanceMatrix.needsUpdate = true;
    wheelsRef.current.instanceMatrix.needsUpdate = true;
    horsesRef.current.instanceMatrix.needsUpdate = true;
    warriorsRef.current.instanceMatrix.needsUpdate = true;

    if (bannerPoleRef.current && bannerClothRef.current && bannerCount > 0) {
      for (let b = 0; b < bannerCount; b++) {
        const u = bannerUnits[b];
        const rotY = -u.angle + Math.PI / 2;
        const cos = Math.cos(rotY);
        const sin = Math.sin(rotY);
        const bX = 0.5;

        tempObject.position.set(u.x + bX * cos, 1.5, u.z + bX * sin);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        bannerPoleRef.current.setMatrixAt(b, tempObject.matrix);

        tempObject.position.set(u.x + (bX + 0.25) * cos, 2.3, u.z + (bX + 0.25) * sin);
        tempObject.updateMatrix();
        bannerClothRef.current.setMatrixAt(b, tempObject.matrix);
      }
      bannerPoleRef.current.instanceMatrix.needsUpdate = true;
      bannerClothRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [units, count, bannerUnits, bannerCount]);

  if (count === 0) return null;

  return (
    <group>
      <instancedMesh ref={chassisRef} args={[chassisGeom, chassisMat, count]} castShadow receiveShadow />
      <instancedMesh ref={wheelsRef} args={[wheelGeom, wheelMat, count * 2]} castShadow />
      <instancedMesh ref={horsesRef} args={[horseGeom, horseMat, count * 2]} castShadow />
      <instancedMesh ref={warriorsRef} args={[warriorGeom, warriorMat, count * 2]} castShadow />
      {bannerCount > 0 && (
        <>
          <instancedMesh ref={bannerPoleRef} args={[poleGeom, poleMat, bannerCount]} castShadow />
          <instancedMesh ref={bannerClothRef} args={[clothGeom, clothMat, bannerCount]} />
        </>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// 5. INSTANCED CAVALRY (ASHVASENA)
// Mounted riders with forward lances
// -------------------------------------------------------------
export const InstancedCavalryRing: React.FC<{
  units: WarriorUnitData[];
  primaryColor: string;
  bannerColor: string;
}> = ({ units, primaryColor, bannerColor }) => {
  const count = units.length;
  const bannerUnits = useMemo(() => units.filter((u) => u.hasBanner), [units]);
  const bannerCount = bannerUnits.length;

  const horsesRef = useRef<THREE.InstancedMesh>(null);
  const ridersRef = useRef<THREE.InstancedMesh>(null);
  const lancesRef = useRef<THREE.InstancedMesh>(null);
  const bannerPoleRef = useRef<THREE.InstancedMesh>(null);
  const bannerClothRef = useRef<THREE.InstancedMesh>(null);

  const horseGeom = useMemo(() => new THREE.BoxGeometry(0.5, 0.95, 1.45), []);
  const riderGeom = useMemo(() => new THREE.CylinderGeometry(0.18, 0.22, 0.68, 8), []);
  const lanceGeom = useMemo(() => new THREE.CylinderGeometry(0.02, 0.03, 2.4, 6), []);
  const poleGeom = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 2.2, 5), []);
  const clothGeom = useMemo(() => new THREE.PlaneGeometry(0.45, 0.28), []);

  const horseMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a2012', roughness: 0.8 }), []);
  const riderMat = useMemo(() => new THREE.MeshStandardMaterial({ color: primaryColor, emissive: primaryColor, emissiveIntensity: 0.25, roughness: 0.6 }), [primaryColor]);
  const lanceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c09f58', metalness: 0.8, roughness: 0.3 }), []);
  const poleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5c3c24', roughness: 0.8 }), []);
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({ color: bannerColor, side: THREE.DoubleSide }), [bannerColor]);

  useLayoutEffect(() => {
    if (!horsesRef.current || !ridersRef.current || !lancesRef.current) return;

    const scale = 0.85;

    for (let i = 0; i < count; i++) {
      const u = units[i];
      const rotY = -u.angle + Math.PI / 2;
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);

      // Horse
      tempObject.position.set(u.x, 0.55 * scale, u.z);
      tempObject.rotation.set(0, rotY, 0);
      tempObject.scale.set(scale, scale, scale);
      tempObject.updateMatrix();
      horsesRef.current.setMatrixAt(i, tempObject.matrix);

      // Rider on top
      tempObject.position.set(u.x, 1.25 * scale, u.z);
      tempObject.updateMatrix();
      ridersRef.current.setMatrixAt(i, tempObject.matrix);

      // Forward angled Lance
      const lX = 0.3 * scale;
      const lZ = 0.4 * scale;
      tempObject.position.set(u.x + lX * cos - lZ * sin, 1.2 * scale, u.z + lX * sin + lZ * cos);
      tempObject.rotation.set(0.35, rotY, -0.15);
      tempObject.updateMatrix();
      lancesRef.current.setMatrixAt(i, tempObject.matrix);
    }

    horsesRef.current.instanceMatrix.needsUpdate = true;
    ridersRef.current.instanceMatrix.needsUpdate = true;
    lancesRef.current.instanceMatrix.needsUpdate = true;

    if (bannerPoleRef.current && bannerClothRef.current && bannerCount > 0) {
      for (let b = 0; b < bannerCount; b++) {
        const u = bannerUnits[b];
        const rotY = -u.angle + Math.PI / 2;
        const cos = Math.cos(rotY);
        const sin = Math.sin(rotY);
        const bX = 0.35;

        tempObject.position.set(u.x + bX * cos, 1.4, u.z + bX * sin);
        tempObject.rotation.set(0, rotY, 0);
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        bannerPoleRef.current.setMatrixAt(b, tempObject.matrix);

        tempObject.position.set(u.x + (bX + 0.22) * cos, 2.1, u.z + (bX + 0.22) * sin);
        tempObject.updateMatrix();
        bannerClothRef.current.setMatrixAt(b, tempObject.matrix);
      }
      bannerPoleRef.current.instanceMatrix.needsUpdate = true;
      bannerClothRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [units, count, bannerUnits, bannerCount]);

  if (count === 0) return null;

  return (
    <group>
      <instancedMesh ref={horsesRef} args={[horseGeom, horseMat, count]} castShadow receiveShadow />
      <instancedMesh ref={ridersRef} args={[riderGeom, riderMat, count]} castShadow />
      <instancedMesh ref={lancesRef} args={[lanceGeom, lanceMat, count]} castShadow />
      {bannerCount > 0 && (
        <>
          <instancedMesh ref={bannerPoleRef} args={[poleGeom, poleMat, bannerCount]} castShadow />
          <instancedMesh ref={bannerClothRef} args={[clothGeom, clothMat, bannerCount]} />
        </>
      )}
    </group>
  );
};
