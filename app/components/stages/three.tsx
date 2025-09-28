import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, CameraProps } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import TargetAnimate from "../../utils/targetAnimate";
import { raycast, raycastClick, raycastHover } from "../../utils/raycast";
import { CameraTweener } from "./CameraTweener";
import { GLTFAssetLoader } from '../GLTFAssetLoader';
import LoadingScreen from "../loadingScreen";

export default function Three({
  progress = 0,
  scrollIndex,
}: {
  progress?: number;
  scrollIndex: number;
}) {
  // Load GLTFs internally
  const { gltfs, ready } = GLTFAssetLoader();

  // Get current GLTF based on scrollIndex
  const currentGltf = useMemo(() => {
    if (!gltfs.length) return null;
    return gltfs[scrollIndex === 0 ? 0 : Math.max(0, scrollIndex - 1)];
  }, [gltfs, scrollIndex]);

  // Camera configurations
  const aboutCamera = useMemo(() => ({
    position: [5.350, 4.100, -0.871] as [number, number, number],
    lookAt: [0.069, 2.928, -1.892] as [number, number, number],
    fov: 35,
  }), []);

  const modelCamera = useMemo(() => {
    if (currentGltf?.cameras?.[0]?.position) {
      return {
        position: [11.118, 2.794, 7.675] as [number, number, number],
        lookAt: [1.364, 2.331, -2.716] as [number, number, number],
        // position: [10.317, 5.071, 21.083] as [number, number, number],
        // lookAt: [9.977, 4.985, 20.147] as [number, number, number],
        fov: aboutCamera.fov,
      };
    }
    return aboutCamera;
  }, [currentGltf, aboutCamera]);

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(aboutCamera.fov, 1, 0.1, 1000),
    [aboutCamera.fov]
  );

  useMemo(() => {
    camera.position.set(...aboutCamera.position);
    camera.lookAt(...aboutCamera.lookAt);
  }, [camera, aboutCamera]);

  const controlsRef = useRef<any>(null);

  // Show loading screen when assets aren't ready
  if (!ready || !currentGltf) {
    return (
      <div className="fixed w-screen h-screen">
        <div className="text-white bg-gray-900 w-screen h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* Loading spinner */}
            <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
            <p>Loading 3D assets...</p>
          </div>
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
        className="w-full h-full transition-opacity duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
        style={{
          pointerEvents: scrollIndex > 0 ? "auto" : "none",
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