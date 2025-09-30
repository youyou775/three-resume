import { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CameraDebugProps {
  enabled?: boolean;
}

export function CameraDebug() {
  const debugControlsRef = useRef<any>(null);

  useEffect(() => {
    if (!debugControlsRef.current) return;

    const handleChange = () => {
      const camera = debugControlsRef.current.object;
      const target = debugControlsRef.current.target;
      console.log('Camera Position:', [
        camera.position.x.toFixed(3),
        camera.position.y.toFixed(3),
        camera.position.z.toFixed(3)
      ]);
      console.log('Look At Target:', [
        target.x.toFixed(3),
        target.y.toFixed(3),
        target.z.toFixed(3)
      ]);
    };

    const controls = debugControlsRef.current;
    controls.addEventListener('change', handleChange);
    return () => controls.removeEventListener('change', handleChange);
  }, []);


  return (
    <OrbitControls
      ref={debugControlsRef}
      enableZoom={true}
      enablePan={true}
    />
  );
}