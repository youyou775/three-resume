import { useEffect, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { applyMats, extractTexturePaths, loadTextures } from '../utils/applyMats';
import { GLTF } from 'three-stdlib';
import { ObjectMap } from '@react-three/fiber';
import { useScrollStore } from '../store/scrollStore';
import { useAppStateStore } from '../store/appStateStore';

export function UseGLTFAssetLoader() {
  const basePath = process.env.NODE_ENV === 'production' ? '/three-resume' : '';

  const { scrollIndex } = useScrollStore();
  const { setAssetsLoaded } = useAppStateStore();


  // Load main scene immediately (hook-safe)
  const mainScene = useGLTF(`${basePath}/Scene.glb`, true);
  const [gltfs, setGltfs] = useState<(GLTF & ObjectMap)[]>([]);
  const [currentGltf, setcurrentGltf] = useState<(GLTF & ObjectMap) | null>(null);
  const [gltfsLoaded, setGltfsLoaded] = useState(false);

  // Process main scene once available
  useEffect(() => {
    if (mainScene?.scene) {
      const textures = extractTexturePaths(mainScene.scene);
      const loadedTextures = loadTextures(textures);
      applyMats(mainScene.scene, loadedTextures);

      setGltfs([mainScene]);
      setGltfsLoaded(true);
      setAssetsLoaded(true);

    }
  }, [mainScene]);

  const currentGltfHook = useMemo(() => {
    if (!gltfs.length) return null;
    if (scrollIndex === 0) return gltfs[0] || null;
    return gltfs[Math.max(0, Math.min(scrollIndex - 1, gltfs.length - 1))];
  }, [gltfs, scrollIndex])

  //load scene when scrollIndex changes 
  useEffect(() => {
    setcurrentGltf(currentGltfHook);
  }, [currentGltf, scrollIndex])

  // Background preload via Promise (no hooks inside Promise!)
  useEffect(() => {
    if (!gltfsLoaded) return;

    const extraPaths = [`${basePath}/Scene.001.glb`, `${basePath}/Scene.002.glb`];

    Promise.all(extraPaths.map((path) => useGLTF.preload(path))).then(() => {
      // now that they're cached, trigger a re-render
      setGltfs((prev) => {
        const loaded = extraPaths.map((path) => useGLTF(path, true)); // safe: hook calls are consistent across renders
        loaded.forEach((gltf) => {
          if (gltf?.scene) {
            const textures = extractTexturePaths(gltf.scene);
            const loadedTextures = loadTextures(textures);
            applyMats(gltf.scene, loadedTextures);
          }
        });
        return [...prev, ...loaded];
      });
    });
  }, [gltfsLoaded]);

  return { currentGltf };
}
