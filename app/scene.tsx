"use client";
import { Circle, Html, OrbitControls, Stats, useProgress, useGLTF, VideoTexture } from '@react-three/drei';
import { CameraProps, Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html center>{progress} % loaded</Html>;
}


export default function Scene() {
  const gltf = useGLTF('/export1.glb', true);
  const textureLoader = new THREE.TextureLoader();
  // Traverse the scene to extract unique "collection" names from gltf node extras
  const textures: { [key: string]: string } = {};
  gltf.scene.traverse(obj => {
    if (obj instanceof THREE.Mesh && obj.userData.collection) {
      textures[obj.userData.collection] = `/${obj.userData.collection}.webp`;
    }
  });


  const loadedTextures = Object.fromEntries(
    Object.entries(textures).map(([key, path]) => {
      const tex = textureLoader.load(path);
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      return [key, tex];
    })
  );

  gltf.scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.name.includes("Glass")) {
        obj.material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.10,
          depthWrite: false,
        });
      }
      else if (obj.name.includes("Screen")) {
        // Create a video element and use THREE.VideoTexture
        const video = document.createElement('video');
        video.src = '/video.mp4';
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.play();
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.format = THREE.RGBAFormat;
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.flipY = false;
        obj.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
        });
      }

      else if (loadedTextures[obj.userData.collection]) {
        obj.material = new THREE.MeshBasicMaterial({ map: loadedTextures[obj.userData.collection] });
        obj.material.map.minFilter = THREE.LinearFilter;
      }
    }
    React.useEffect(() => {
      let controls: any;
      const handleControls = () => {
        // Find OrbitControls in the scene
        controls = gltf.scene.parent?.children
          ?.find((child: any) => child.type === "OrbitControls");
        if (controls) {
          controls.addEventListener('change', () => {
            console.log('Orbit target:', controls.target);
          });
        }
      };

      // Wait for next tick to ensure controls are mounted
      setTimeout(handleControls, 0);

      return () => {
        if (controls) {
          controls.removeEventListener('change', () => { });
        }
      };
    }, [gltf.scene]);
  }

  );


  return (
    <>
      <h1 className="text-4xl text-center">Resume</h1>
      <Suspense fallback={<Loader />}>
        <Canvas camera={gltf.cameras[0] as CameraProps} shadows>
          {/* <ambientLight intensity={0.5} /> */}
          {/* <directionalLight position={[5, 10, 5]} intensity={0.001} castShadow /> */}
          <primitive object={gltf.scene} />
          <OrbitControls target={[0, 1, 0]} />
          <axesHelper args={[5]} />
          <Stats />
        </Canvas>
      </Suspense>
    </>
  );
}
