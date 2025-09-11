import React, { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, CameraProps, useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { OrbitControls, Stats } from '@react-three/drei';
import LoadingScreen from '../loadingScreen';
import TargetAnimate from '../../utils/targetAnimate';
import { raycast, raycastClick, raycastHover } from '../../utils/raycast';
import * as THREE from 'three';

function CameraTweener({
  cameraA,
  cameraB,
  progress,
  controlsRef,
  scrollIndex,
}: {
  cameraA?: { position: [number, number, number]; fov?: number; lookAt: [number, number, number] };
  cameraB?: { position: [number, number, number]; fov?: number; lookAt: [number, number, number] };
  progress: number;
  controlsRef: React.RefObject<any>;
  scrollIndex: number;
}) {
  const { camera } = useThree();

  // reusable vectors to avoid allocations
  const vA = useMemo(() => new THREE.Vector3(), []);
  const vB = useMemo(() => new THREE.Vector3(), []);
  const vOut = useMemo(() => new THREE.Vector3(), []);
  const tA = useMemo(() => new THREE.Vector3(), []);
  const tB = useMemo(() => new THREE.Vector3(), []);
  const tOut = useMemo(() => new THREE.Vector3(), []);

  // Drive camera directly from progress each r3f frame
  useFrame(() => {
    if (!cameraA || !cameraB) return;

    // clamp incoming progress 0..1
    const p = Math.min(1, Math.max(0, progress));

    // positions
    vA.set(cameraA.position[0], cameraA.position[1], cameraA.position[2]);
    vB.set(cameraB.position[0], cameraB.position[1], cameraB.position[2]);
    vOut.lerpVectors(vA, vB, p);
    camera.position.copy(vOut);

    // target / lookAt
    tA.set(cameraA.lookAt[0], cameraA.lookAt[1], cameraA.lookAt[2]);
    tB.set(cameraB.lookAt[0], cameraB.lookAt[1], cameraB.lookAt[2]);
    tOut.lerpVectors(tA, tB, p);

    if (controlsRef.current) {
      controlsRef.current.target.copy(tOut);
      controlsRef.current.update();
    } else {
      camera.lookAt(tOut);
    }

    // fov interpolation if needed
    if (camera instanceof THREE.PerspectiveCamera) {
      const fA = (typeof cameraA.fov === 'number') ? cameraA.fov : camera.fov;
      const fB = (typeof cameraB.fov === 'number') ? cameraB.fov : camera.fov;
      camera.fov = THREE.MathUtils.lerp(fA, fB, p);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function ThreeStage({
  gltf,
  show,
  cameraA, // { position, fov, lookAt }
  cameraB,
  progress = 0,
  useCameraA = true,
  scrollIndex
}: {
  gltf: any;
  show: boolean;
  cameraA?: { position: [number, number, number]; fov: number; lookAt: [number, number, number] };
  cameraB?: { position: [number, number, number]; fov: number; lookAt: [number, number, number] };
  progress?: number;
  useCameraA?: boolean;
  scrollIndex: number;
}) {

  var camera = useMemo(() => new THREE.PerspectiveCamera(cameraA!.fov, 1, 0.1, 1000), []);
  camera.position.set(...cameraA!.position);
  camera.lookAt(...cameraA!.lookAt);
  // useEffect(() => {
  //   // console.log('scrollIndex', scrollIndex);
  //   if (scrollIndex > 0) {
  //     const { size } = useThree();
  //     (gltf.cameras?.[0] as THREE.PerspectiveCamera).aspect = size.width / size.height;
  //     (gltf.cameras?.[0] as THREE.PerspectiveCamera).updateProjectionMatrix();
  //   }
  // }, [scrollIndex]);

  // const gsapProgress = {value: 0};
  // useEffect(() => {
  //   console.log('scrollIndex', scrollIndex, 'progress', progress);
  //   if (scrollIndex > 0) {
  //     gsap.to(gsapProgress, {
  //       value: progress,
  //       duration: 0.6,
  //       ease: 'power2.out',
  //       onUpdate: () => {
  //         console.log('gsapProgress', gsapProgress.value);
  //         // Interpolate manually
  //         camera.position.x = gsap.utils.interpolate(cameraA!.position[0], cameraB!.position[0], gsapProgress.value);
  //         camera.position.y = gsap.utils.interpolate(cameraA!.position[1], cameraB!.position[1], gsapProgress.value);
  //         camera.position.z = gsap.utils.interpolate(cameraA!.position[2], cameraB!.position[2], gsapProgress.value);
  //       }
  //     }

  //     )
  //   }
  // }, [progress, scrollIndex]);

  if (!gltf) return null;

  const controlsRef = useRef<any>(null);

  // choose which camera config we want to tween to; here we tween to cameraB when provided
  // const targetCamera = useCameraA ? cameraA ?? cameraB : cameraB ?? cameraA;

  return (
    <Canvas
      camera={camera as CameraProps}
      shadows
      onPointerMove={(event: any) => raycast(event, gltf, raycastHover)}
      onPointerDown={(event: any) => raycast(event, gltf, raycastClick)}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 0.7s cubic-bezier(.77,0,.18,1)',
        background: 'var(--background, #fff)',
      }}
    >
      {/* <CameraUpdater camera={gltf.cameras?.[0] as THREE.PerspectiveCamera} /> */}

      <Suspense fallback={<LoadingScreen />}>
        {show && (
          <>
            <primitive object={gltf.scene} />
            <OrbitControls
              ref={controlsRef}
              target={[1.543, 1.833, -2.930]}
              enablePan={false}
            />
            {/* new: drive the live camera inside Canvas */}
            <CameraTweener cameraA={cameraA} cameraB={cameraB} progress={progress} controlsRef={controlsRef} scrollIndex={scrollIndex} />
            <Stats />
            <TargetAnimate />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}