import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { applyMats, extractTexturePaths, loadTextures } from '../utils/applyMats';

export function GLTFAssetLoader() {
    // Simple base path handling for GitHub Pages
    const basePath = process.env.NODE_ENV === 'production' ? '/three-resume' : '';
    
    const SCENE_PATHS = [
        `${basePath}/Scene.glb`,
        `${basePath}/Scene.001.glb`, 
        `${basePath}/Scene.002.glb`
    ];

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
    }, [gltfs.length]);

    return { gltfs, ready };
}