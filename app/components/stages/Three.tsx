// Three.tsx
import React, { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, CameraProps } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import TargetAnimate from "../../utils/targetAnimate";
import { raycast, raycastClick, raycastHover } from "../../utils/raycast";
import { CameraTweener } from "./CameraTweener";
import { GLTFAssetLoader } from '../GLTFAssetLoader';
import LoadingScreen from "../loadingScreen";
import { CameraDebug } from "@/app/utils/cameraDebug";
import { useMobileDetection } from '@/app/hooks/useMobileDetection';
import { useCameraConfig } from '@/app/hooks/useCameraConfig';
import { useCurrentGltf } from '@/app/hooks/useCurrentGltf';

interface ThreeProps {
  progress?: number;
  scrollIndex: number;
  onAssetsReady?: () => void; // New callback prop
}

export default function Three({ progress = 0, scrollIndex, onAssetsReady }: ThreeProps) {
  const debug = false;
  const isMobile = useMobileDetection();
  const { gltfs, ready } = GLTFAssetLoader();
  const currentGltf = useCurrentGltf(gltfs, scrollIndex);
  const { aboutCamera, modelCamera, contactCamera } = useCameraConfig(isMobile, currentGltf);

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(aboutCamera.fov, 1, 0.1, 1000),
    [aboutCamera.fov]
  );

  useMemo(() => {
    camera.position.set(...aboutCamera.position);
    camera.lookAt(...aboutCamera.lookAt);
  }, [camera, aboutCamera]);

  const controlsRef = useRef<any>(null);

  // Notify parent when assets are ready
  useEffect(() => {
    if (ready && currentGltf && onAssetsReady) {
      onAssetsReady();
    }
  }, [ready, currentGltf, onAssetsReady]);

  // Show nothing while loading - parent will show loading screen
  if (!ready || !currentGltf) {
    return null;
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
          {!debug ? (
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
            </>
          ) : (
            <CameraDebug />
          )}
          <TargetAnimate />
        </Suspense>
      </Canvas>
    </div>
  );
}