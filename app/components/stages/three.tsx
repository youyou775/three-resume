// ThreeStage.tsx
import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, CameraProps } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import LoadingScreen from "../LoadingScreen";
import TargetAnimate from "../../utils/targetAnimate";
import { raycast, raycastClick, raycastHover } from "../../utils/raycast";
import { CameraTweener } from "./CameraTweener";

export default function ThreeStage({
  gltf,
  show,
  cameraA,
  cameraB,
  progress = 0,
  scrollIndex,
}: {
  gltf: any;
  show: boolean;
  cameraA: { position: [number, number, number]; fov: number; lookAt: [number, number, number] };
  cameraB: { position: [number, number, number]; fov: number; lookAt: [number, number, number] };
  progress?: number;
  scrollIndex: number;
}) {
  const camera = useMemo(
    () => new THREE.PerspectiveCamera(cameraA.fov, 1, 0.1, 1000),
    []
  );
  camera.position.set(...cameraA.position);
  camera.lookAt(...cameraA.lookAt);

  const controlsRef = useRef<any>(null);

  if (!gltf) return null;

  return (
    <Canvas
      camera={camera as CameraProps}
      shadows
      onPointerMove={(event: any) => raycast(event, gltf, raycastHover)}
      onPointerDown={(event: any) => raycast(event, gltf, raycastClick)}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity 0.7s cubic-bezier(.77,0,.18,1)",
        background: "var(--background, #fff)",
      }}
    >
      <Suspense fallback={<LoadingScreen />}>
        {show && (
          <>
            <primitive object={gltf.scene} />
            <OrbitControls ref={controlsRef} />
            <CameraTweener
              cameraA={cameraA}
              cameraB={cameraB}
              progress={progress}
              controlsRef={controlsRef}
              scrollIndex={scrollIndex}
            />
            <Stats />
            <TargetAnimate />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}