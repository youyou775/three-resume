import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { applyMats, extractTexturePaths, loadTextures } from '../utils/applyMats';

export function GLTFAssetLoader() {
    const SCENE_PATHS = ['/Scene.glb', '/Scene.001.glb', '/Scene.002.glb'];
    // Load all GLTFs
    const gltfs = SCENE_PATHS.map((path) => useGLTF(path, true));
    const [ready, setReady] = useState(false);

    useEffect(() => {
        gltfs.forEach((gltf) => {
            const textures = extractTexturePaths(gltf.scene);
            const loadedTextures = loadTextures(textures);
            applyMats(gltf.scene, loadedTextures);
        });
        setReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gltfs.length]);

    return { gltfs, ready };
}