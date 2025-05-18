"use client";
import { Circle, Html, OrbitControls, Stats, useProgress, useGLTF } from '@react-three/drei';
import { CameraProps, Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html center>{progress} % loaded</Html>;
}

export default function Scene() {
  const gltf = useGLTF('/export-v1.glb', true);
  const textureLoader = new THREE.TextureLoader();
  const textures = {
    walls: "/BakeWalls.webp",
    furniture: "/BakeFurniture.webp",
    appliances: "/BakeAppliances.webp",
    props: "/BakeProps.webp",
  };

  const loadedTextures = Object.entries(textures).reduce((acc, [key, path]) => {
    const texture = textureLoader.load(path);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    acc[key] = texture;
    return acc;
  }, {} as Record<string, THREE.Texture>);

  gltf.scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      const textureKey = Object.keys(loadedTextures).find((key) => object.name.includes(key));
      if (textureKey) {
        object.material = new THREE.MeshBasicMaterial({ map: loadedTextures[textureKey] });
      }
    }
  });

  return (
    <>
      <h1 className="text-4xl text-center">Resume</h1>
      <Suspense fallback={<Loader />}>
        <Canvas camera={gltf.cameras[0] as CameraProps} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={5} castShadow />
          <primitive object={gltf.scene} />
          <OrbitControls target={[0, 1, 0]} />
          <axesHelper args={[5]} />
          <Stats />
        </Canvas>
      </Suspense>
    </>
  );
}
