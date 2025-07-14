import React, { Suspense } from 'react';
import { Canvas, CameraProps, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import LoadingScreen from '../loadingScreen';
import TargetAnimate from '../../utils/targetAnimate';
import { raycast, raycastClick, raycastHover } from '../../utils/raycast';
import * as THREE from 'three';

function CameraUpdater({ camera }: { camera: THREE.PerspectiveCamera }) {
  const { size } = useThree();
  React.useEffect(() => {
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function ThreeStage({
  gltf,
  show,
}: {
  gltf: any;
  show: boolean;
}) {
  if (!gltf) return null;
  return (
    <Canvas
      camera={gltf.cameras?.[0] as CameraProps}
      shadows
      onPointerMove={(event: any) => raycast(event, gltf, raycastHover)}
      onPointerDown={(event: any) => raycast(event, gltf, raycastClick)}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: show ? 'auto' : 'none',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.7s cubic-bezier(.77,0,.18,1)',
        background: 'var(--background, #fff)',
      }}
    >
      {gltf.cameras?.[0] &&
        (gltf.cameras?.[0] as THREE.Camera).type === 'PerspectiveCamera' && (
          <CameraUpdater camera={gltf.cameras?.[0] as THREE.PerspectiveCamera} />
        )}
      <Suspense fallback={<LoadingScreen />}>
        {show && (
          <>
            <primitive object={gltf.scene} />
            <OrbitControls
              target={[0, 1, 0]}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
              minAzimuthAngle={0}
              maxAzimuthAngle={Math.PI / 2}
              minDistance={5}
              maxDistance={50}
              enablePan={false}
              enableZoom={false}
            />
            <Stats />
            <TargetAnimate />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}