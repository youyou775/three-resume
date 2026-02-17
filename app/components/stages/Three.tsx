import React, { Suspense, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import TargetAnimate from "../../utils/targetAnimate";
import { raycast, raycastClick, raycastHover } from "../../utils/raycast";
import { CameraTweener } from "./CameraTweener";
import { UseGLTFAssetLoader } from '../GLTFAssetLoader';
import ThreeLoadingScreen from "../ThreeLoadingScreen";
import { CameraDebug } from "@/app/utils/cameraDebug";
import { useCameraConfig } from '@/app/hooks/useCameraConfig';


export default function Three() {
  const debug = false;
  const { currentGltf } = UseGLTFAssetLoader();
  const { aboutCamera, modelCamera, contactCamera } = useCameraConfig(currentGltf);

  const camera = useMemo(
    () => {
      const camera = new THREE.PerspectiveCamera(aboutCamera.fov, 1, 0.1, 1000)
      camera.position.set(...aboutCamera.position);
      camera.lookAt(...aboutCamera.lookAt);
      return camera;
    },
    [aboutCamera]
  );

  const controlsRef = useRef<any>(null);

  // Show nothing while loading - parent will show loading screen
  if (!currentGltf) {
    return null;
  }

  return (
    <div className={'fixed w-screen h-screen'}>
      <Canvas camera={camera} shadows
        onPointerMove={(event: any) => raycast(event, currentGltf, raycastHover)}
        onPointerDown={(event: any) => raycast(event, currentGltf, raycastClick)}
        className="w-full h-full transition-opacity duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
      >
        <Suspense fallback={<ThreeLoadingScreen />}>
          <primitive object={currentGltf!.scene} />
          {!debug ? (
            <>
              <OrbitControls ref={controlsRef} />
              <CameraTweener
                cameraA={aboutCamera}
                cameraB={modelCamera}
                cameraC={contactCamera}
                controlsRef={controlsRef}
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