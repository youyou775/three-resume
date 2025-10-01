import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { applyMats, extractTexturePaths, loadTextures } from '../utils/applyMats';

export function GLTFAssetLoader() {
  const basePath = process.env.NODE_ENV === 'production' ? '/three-resume' : '';

  // Load main scene immediately (hook-safe)
  const mainScene = useGLTF(`${basePath}/Scene.glb`, true);
  const [gltfs, setGltfs] = useState<any[]>([]);
  const [ready, setReady] = useState(false);

  // Process main scene once available
  useEffect(() => {
    if (mainScene?.scene) {
      const textures = extractTexturePaths(mainScene.scene);
      const loadedTextures = loadTextures(textures);
      applyMats(mainScene.scene, loadedTextures);

      setGltfs([mainScene]);
      setReady(true);
    }
  }, [mainScene]);

  // Background preload via Promise (no hooks inside Promise!)
  useEffect(() => {
    if (!ready) return;

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
  }, [ready]);

  return { gltfs, ready };
}
