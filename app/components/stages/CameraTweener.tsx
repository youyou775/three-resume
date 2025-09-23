// CameraTweener.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function CameraTweener({
  cameraA,
  cameraB,
  progress,
  controlsRef,
  scrollIndex,
}: {
  cameraA: { position: [number, number, number]; fov?: number; lookAt: [number, number, number] };
  cameraB: { position: [number, number, number]; fov?: number; lookAt: [number, number, number] };
  progress: number;
  controlsRef: React.RefObject<any>;
  scrollIndex: number;
}) {
  const { camera } = useThree();

  const vA = useMemo(() => new THREE.Vector3(), []);
  const vB = useMemo(() => new THREE.Vector3(), []);
  const vOut = useMemo(() => new THREE.Vector3(), []);
  const tA = useMemo(() => new THREE.Vector3(), []);
  const tB = useMemo(() => new THREE.Vector3(), []);
  const tOut = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!cameraA || !cameraB) return;

    if (scrollIndex !== 0) {
      camera.position.set(...cameraB.position);
      tOut.set(...cameraB.lookAt);
      controlsRef.current?.target.copy(tOut);
      controlsRef.current?.update();
      if (camera instanceof THREE.PerspectiveCamera && cameraB.fov) {
        camera.fov = cameraB.fov;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const p = THREE.MathUtils.clamp(progress, 0, 1);

    vA.fromArray(cameraA.position);
    vB.fromArray(cameraB.position);
    vOut.lerpVectors(vA, vB, p);
    camera.position.copy(vOut);

    tA.fromArray(cameraA.lookAt);
    tB.fromArray(cameraB.lookAt);
    tOut.lerpVectors(tA, tB, p);
    controlsRef.current?.target.copy(tOut);
    controlsRef.current?.update();

    if (camera instanceof THREE.PerspectiveCamera) {
      const fA = cameraA.fov ?? camera.fov;
      const fB = cameraB.fov ?? camera.fov;
      camera.fov = THREE.MathUtils.lerp(fA, fB, p);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
