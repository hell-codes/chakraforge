import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AgentState } from '../../types/simulation';

export type CameraMode =
  | 'COMMAND'
  | 'TACTICAL'
  | 'CLOSE'
  | 'OVERVIEW'
  | 'FOLLOW_AGENT'
  | 'TOP_DOWN'
  | 'ISOMETRIC'
  | 'FOLLOW_ABHIMANYU'
  | 'FORMATION_VIEW'
  | 'ORBIT'
  | 'CINEMATIC'
  | 'FREE';

interface CameraControllerProps {
  mode: CameraMode;
  selectedAgent: AgentState | null;
}

export const CameraController: React.FC<CameraControllerProps> = ({ mode, selectedAgent }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const cinematicAngle = useRef(0);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (mode === 'COMMAND' || mode === 'FORMATION_VIEW') {
      camera.position.set(0, 34, 46);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.05;
      controlsRef.current.minPolarAngle = 0.1;
      controlsRef.current.update();
    } else if (mode === 'OVERVIEW' || mode === 'TOP_DOWN') {
      camera.position.set(0, 70, 0.01);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = 0.05;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.update();
    } else if (mode === 'ISOMETRIC') {
      camera.position.set(38, 38, 38);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.1;
      controlsRef.current.minPolarAngle = 0.2;
      controlsRef.current.update();
    } else if (mode === 'ORBIT') {
      camera.position.set(0, 30, 42);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.05;
      controlsRef.current.minPolarAngle = 0.1;
      controlsRef.current.update();
    } else if (mode === 'CINEMATIC') {
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.1;
      controlsRef.current.minPolarAngle = 0.2;
    } else if (mode === 'FREE') {
      camera.position.set(0, 40, 45);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = Math.PI;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.update();
    }
  }, [mode, camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (mode === 'TACTICAL' && selectedAgent) {
      // Tactical View: follows Abhimanyu, shows nearby engagements
      const targetPos = new THREE.Vector3(
        selectedAgent.position.x + Math.cos(selectedAgent.heading) * 2.5,
        0.8,
        selectedAgent.position.y + Math.sin(selectedAgent.heading) * 2.5
      );
      const camOffset = new THREE.Vector3(
        selectedAgent.position.x - Math.cos(selectedAgent.heading) * 11,
        7.5,
        selectedAgent.position.y - Math.sin(selectedAgent.heading) * 11
      );
      camera.position.lerp(camOffset, 0.07);
      controlsRef.current.target.lerp(targetPos, 0.09);
      controlsRef.current.update();
    } else if (mode === 'CLOSE' && selectedAgent) {
      // Close View: closer observation of combat and hero chariot
      const targetPos = new THREE.Vector3(
        selectedAgent.position.x + Math.cos(selectedAgent.heading) * 1.5,
        1.0,
        selectedAgent.position.y + Math.sin(selectedAgent.heading) * 1.5
      );
      const camOffset = new THREE.Vector3(
        selectedAgent.position.x - Math.cos(selectedAgent.heading) * 5.8,
        3.4,
        selectedAgent.position.y - Math.sin(selectedAgent.heading) * 5.8
      );
      camera.position.lerp(camOffset, 0.08);
      controlsRef.current.target.lerp(targetPos, 0.1);
      controlsRef.current.update();
    } else if (mode === 'CINEMATIC') {
      cinematicAngle.current += delta * 0.15; // slower, more epic revolution

      // Panoramic Epic Battlefield Sweep (Zoomed out and revolving around)
      const radius = 55; // zoomed in a bit
      const x = Math.cos(cinematicAngle.current * 0.5) * radius;
      const z = Math.sin(cinematicAngle.current * 0.5) * radius;
      const y = 32 + Math.sin(cinematicAngle.current * 0.3) * 8; // high angle sweeping

      camera.position.lerp(new THREE.Vector3(x, y, z), 0.04);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 1.5, 0), 0.04);
      controlsRef.current.update();
    } else if ((mode === 'FOLLOW_ABHIMANYU' || mode === 'FOLLOW_AGENT') && selectedAgent) {
      const targetPos = new THREE.Vector3(selectedAgent.position.x, 0.6, selectedAgent.position.y);
      const camOffset = new THREE.Vector3(
        selectedAgent.position.x - Math.cos(selectedAgent.heading) * 12,
        10,
        selectedAgent.position.y - Math.sin(selectedAgent.heading) * 12
      );
      camera.position.lerp(camOffset, 0.08);
      controlsRef.current.target.lerp(targetPos, 0.1);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={6}
      maxDistance={140}
      enablePan={mode === 'FREE' || mode === 'ORBIT' || mode === 'TOP_DOWN' || mode === 'ISOMETRIC'}
      enableRotate={mode === 'FREE' || mode === 'ORBIT' || mode === 'TOP_DOWN' || mode === 'ISOMETRIC' || mode === 'FORMATION_VIEW'}
      enableZoom={true}
    />
  );
};
