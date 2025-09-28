// Three.tsx
import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, CameraProps } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import LoadingScreen from "../LoadingScreen";
import TargetAnimate from "../../utils/targetAnimate";
import { raycast, raycastClick, raycastHover } from "../../utils/raycast";
import { CameraTweener } from "./CameraTweener";
import { useGLTFAssets } from '../SceneLoader';

export default function Three({
  progress = 0,
  scrollIndex,
}: {
  progress?: number;
  scrollIndex: number;
}) {
  // Load GLTFs internally - Scene.tsx no longer needs to know about them
  const { gltfs, ready } = useGLTFAssets();
  
  // Get current GLTF based on scrollIndex
  const currentGltf = useMemo(() => {
    if (!gltfs.length) return null;
    return gltfs[scrollIndex === 0 ? 0 : Math.max(0, scrollIndex - 1)];
  }, [gltfs, scrollIndex]);

  // Camera configurations - managed internally
  const aboutCamera = useMemo(() => ({
    position: [5.350, 4.100, -0.871] as [number, number, number],
    lookAt: [0.069, 2.928, -1.892] as [number, number, number],
    fov: 35,
  }), []);

  const modelCamera = useMemo(() => {
    // Use gltf camera if available, otherwise fallback to aboutCamera
    if (currentGltf?.cameras?.[0]?.position) {
      return {
        position: [11.118, 2.794, 7.675] as [number, number, number],
        lookAt: [1.364, 2.331, -2.716] as [number, number, number],
        fov: aboutCamera.fov,
      };
    }
    return aboutCamera;
  }, [currentGltf, aboutCamera]);

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(aboutCamera.fov, 1, 0.1, 1000),
    [aboutCamera.fov]
  );

  // Initialize camera position and target
  useMemo(() => {
    camera.position.set(...aboutCamera.position);
    camera.lookAt(...aboutCamera.lookAt);
  }, [camera, aboutCamera]);

  const controlsRef = useRef<any>(null);

  // Don't render if assets aren't ready or no GLTF available
  if (!ready || !currentGltf) {
    return (
      <div className="fixed w-screen h-screen">
        <div className="text-white bg-gray-900 w-screen h-screen flex items-center justify-center">
          Loading 3D assets...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed w-screen h-screen">
      <Canvas
        camera={camera as CameraProps}
        shadows
        onPointerMove={(event: any) => raycast(event, currentGltf, raycastHover)}
        onPointerDown={(event: any) => raycast(event, currentGltf, raycastClick)}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: scrollIndex > 0 ? "auto" : "none",
          transition: "opacity 0.7s cubic-bezier(.77,0,.18,1)",
          background: "var(--background, #fff)",
        }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <primitive object={currentGltf.scene} />
          <OrbitControls ref={controlsRef} />
          <CameraTweener
            cameraA={aboutCamera}
            cameraB={modelCamera}
            progress={progress}
            controlsRef={controlsRef}
            scrollIndex={scrollIndex}
          />
          <Stats />
          <TargetAnimate />
        </Suspense>
      </Canvas>
    </div>
  );
}