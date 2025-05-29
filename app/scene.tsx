"use client";
import { Html, OrbitControls, Stats, useProgress, useGLTF } from '@react-three/drei';
import { CameraProps, Canvas, useFrame } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import dynamic from 'next/dynamic'

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html center>{progress} % loaded</Html>;
}

function MyCameraReactsToStateChanges() {
  useFrame(state => {
    //Animate fans
    state.scene.traverse(obj => {
      if (obj.name.includes('Fan')) {
        obj.rotation.z += 0.2;
      }
    });
  });

  return null;
}

const SceneContent: React.FC = () => {
  const gltf = useGLTF('/export2.glb', true);
  // Traverse the scene to extract unique "collection" names from gltf node extras
  const textures: { [key: string]: string } = {};
  gltf.scene.traverse(obj => {
    if (obj instanceof THREE.Mesh && obj.userData.collection) {
      textures[obj.userData.collection] = `/${obj.userData.collection}.webp`;
    }
  });

  const textureLoader = new THREE.TextureLoader();
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
  });

  return (
    <>
      <h1 className="text-4xl text-center">Resume</h1>
      <Suspense fallback={<Loader />}>
        <Canvas camera={gltf.cameras[0] as CameraProps} shadows>
          <primitive object={gltf.scene} />
          <OrbitControls
            target={[0, 1, 0]}
            onChange={e => {
              // Detect target change
              // const controls = e?.target;
              // console.log('OrbitControls target changed:', controls?.target);
            }}
          />
          {/* <axesHelper args={[5]} /> */}
          <Stats />
          <MyCameraReactsToStateChanges />
        </Canvas>
      </Suspense>
    </>
  );
};

const Scene = dynamic(() => Promise.resolve(SceneContent), {
  ssr: false
});

export default Scene;

