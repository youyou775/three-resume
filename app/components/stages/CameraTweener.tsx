import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CameraTween } from "@/app/types/CameraTween";
import { useAppStateStore } from "@/app/store/appStateStore";

export function CameraTweener({
  cameraA,
  cameraB,
  cameraC,
  controlsRef,
}: {
  cameraA: CameraTween;
  cameraB: CameraTween;
  cameraC: CameraTween;
  controlsRef: React.RefObject<any>;
}) {
  const { tweenProgress, callToAction } = useAppStateStore();
  const { camera } = useThree();

  // Reuse vectors
  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const vC = new THREE.Vector3();
  const vOut = new THREE.Vector3();
  const tA = new THREE.Vector3();
  const tB = new THREE.Vector3();
  const tC = new THREE.Vector3();
  const tOut = new THREE.Vector3();

  // Define transitions
  const transitionMap: Record<number, [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3, CameraTween, CameraTween]> = {
    0: [vA, vB, tA, tB, cameraA, cameraB],
    1: [vB, vC, tB, tC, cameraB, cameraC],
    2: [vC, vB, tC, tB, cameraC, cameraB],
  };

  const tweenCameras = (vA: THREE.Vector3, vB: THREE.Vector3, tA: THREE.Vector3,
    tB: THREE.Vector3, cameraA: CameraTween, cameraB: CameraTween) => {
    const p = THREE.MathUtils.clamp(tweenProgress*0.1, 0, 1);

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
  };

  useFrame(() => {
    if (!cameraA || !cameraB || !cameraC) return;
    const config = transitionMap[Number(callToAction)];
    if (!config) return;
    tweenCameras(...config);
  });

  return null;
}   