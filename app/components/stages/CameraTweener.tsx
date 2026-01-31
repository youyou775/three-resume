// CameraTweener.tsx
import { useScrollStore } from "@/app/store/scrollStore";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function CameraTweener({
  cameraA,
  cameraB,
  cameraC, // Contact camera
  controlsRef,
}: {
  cameraA: { position: [number, number, number]; fov?: number; lookAt: [number, number, number] };
  cameraB: { position: [number, number, number]; fov?: number; lookAt: [number, number, number] };
  cameraC: { position: [number, number, number]; fov?: number; lookAt: [number, number, number] };
  controlsRef: React.RefObject<any>;
}) {
  const {
    scrollIndex,
    scrollProgress,
  } = useScrollStore();

  const { camera } = useThree();

  const vA = useMemo(() => new THREE.Vector3(), []);
  const vB = useMemo(() => new THREE.Vector3(), []);
  const vC = useMemo(() => new THREE.Vector3(), []);
  const vOut = useMemo(() => new THREE.Vector3(), []);
  const tA = useMemo(() => new THREE.Vector3(), []);
  const tB = useMemo(() => new THREE.Vector3(), []);
  const tC = useMemo(() => new THREE.Vector3(), []);
  const tOut = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!cameraA || !cameraB || !cameraC) return;

    // Handle different scroll index scenarios
    if (scrollIndex === 0) {
      // scrollIndex 0: About page - animate from A to B
      const p = THREE.MathUtils.clamp(scrollProgress * 4, 0, 1);//multiply by number of ScrollIndices

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
    } else if (scrollIndex >= 1 && scrollIndex < 3) {
      // scrollIndex 1-2: SidePane sections - stay at cameraB
      camera.position.set(...cameraB.position);
      tOut.set(...cameraB.lookAt);
      controlsRef.current?.target.copy(tOut);
      controlsRef.current?.update();
      if (camera instanceof THREE.PerspectiveCamera && cameraB.fov) {
        camera.fov = cameraB.fov;
        camera.updateProjectionMatrix();
      }
    } else if (scrollIndex === 3) {
      // scrollIndex 3: Last SidePane section - start transition to contact
      const p = THREE.MathUtils.clamp(scrollProgress * 4, 0, 1);//multiply by number of ScrollIndices

      vB.fromArray(cameraB.position);
      vC.fromArray(cameraC.position);
      vOut.lerpVectors(vB, vC, p);
      camera.position.copy(vOut);

      tB.fromArray(cameraB.lookAt);
      tC.fromArray(cameraC.lookAt);
      tOut.lerpVectors(tB, tC, p);
      controlsRef.current?.target.copy(tOut);
      controlsRef.current?.update();

      if (camera instanceof THREE.PerspectiveCamera) {
        const fB = cameraB.fov ?? camera.fov;
        const fC = cameraC.fov ?? camera.fov;
        camera.fov = THREE.MathUtils.lerp(fB, fC, p);
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}