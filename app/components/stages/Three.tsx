import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, CameraProps } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import TargetAnimate from "../../utils/targetAnimate";
import { raycast, raycastClick, raycastHover } from "../../utils/raycast";
import { CameraTweener } from "./CameraTweener";
import { GLTFAssetLoader } from '../GLTFAssetLoader';
import LoadingScreen from "../loadingScreen";
import { CameraDebug } from "@/app/utils/cameraDebug";

export default function Three({
  progress = 0,
  scrollIndex,
}: {
  progress?: number;
  scrollIndex: number;
}) {
  const debug = false; // Set to true to enable debug mode
  const [isMobile, setIsMobile] = useState(false);

  // Load GLTFs internally
  const { gltfs, ready } = GLTFAssetLoader();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current GLTF based on scrollIndex
  const currentGltf = useMemo(() => {
    if (!gltfs.length) return null;
    // For scrollIndex 0 (about) and 4 (contact), use the first GLTF
    if (scrollIndex === 0) return gltfs[0] || null;
    // For other sections, use the appropriate GLTF
    return gltfs[Math.max(0, Math.min(scrollIndex - 1, gltfs.length - 1))];
  }, [gltfs, scrollIndex]);

  // Camera configurations
  const aboutCamera = useMemo(() => ({
    position: isMobile
      ? [6.954, 4.456, 8.482] as [number, number, number]
      : [5.350, 4.100, -0.573] as [number, number, number],
    lookAt: isMobile
      ? [-1.451, 2.095, -1.892] as [number, number, number]
      : [0.069, 2.928, -1.892] as [number, number, number],
    fov: 35,
  }), [isMobile]);

  const modelCamera = useMemo(() => {
    if (currentGltf?.cameras?.[0]?.position) {
      return {
        // Use commented position/lookAt for mobile, normal for desktop
        position: isMobile
          ? [15.806, 8.405, 32.181] as [number, number, number]
          : [11.118, 2.794, 7.675] as [number, number, number],
        lookAt: isMobile
          ? [0.312, -1.861, 0.266] as [number, number, number]
          : [1.364, 2.331, -2.716] as [number, number, number],
        fov: aboutCamera.fov,
      };
    }
    return aboutCamera;
  }, [currentGltf, aboutCamera, isMobile]);

  // Contact camera - different angle for contact page
  const contactCamera = useMemo(() => ({
    position: [2.5, 6.0, 12.0] as [number, number, number],
    lookAt: [0.0, 3.0, 0.0] as [number, number, number],
    fov: 40,
  }), []);

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
          pointerEvents: (scrollIndex > 0 && scrollIndex < 4 && !isMobile) ? "auto" : "none",
          background: "var(--background, #fff)",
        }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <primitive object={currentGltf.scene} />
          {!debug ?
            <>
              <OrbitControls ref={controlsRef} />
              <CameraTweener
                cameraA={aboutCamera}
                cameraB={modelCamera}
                cameraC={contactCamera}
                progress={progress}
                controlsRef={controlsRef}
                scrollIndex={scrollIndex}
              />
            </> : <CameraDebug />
          }
          <TargetAnimate />
        </Suspense>
      </Canvas>
    </div>
  );
}