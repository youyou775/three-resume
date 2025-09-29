import * as THREE from 'three';

// Helper function to get the correct asset path
const getAssetPath = (path: string) => {
  const basePath = process.env.NODE_ENV === 'production' ? '/three-resume' : '';
  return `${basePath}${path}`;
};

export function extractTexturePaths(scene: THREE.Group<THREE.Object3DEventMap>): Record<string, string> {
  const textures: Record<string, string> = {};
  scene.traverse(obj => {
    if (obj instanceof THREE.Mesh && obj.userData.collection) {
      textures[obj.userData.collection] = getAssetPath(`/${obj.userData.collection}.webp`);
    }
  });
  return textures;
}

export function loadTextures(textures: Record<string, string>): Record<string, THREE.Texture> {
  const textureLoader = new THREE.TextureLoader();
  return Object.fromEntries(
    Object.entries(textures).map(([key, path]) => {
      const tex = textureLoader.load(path);
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      return [key, tex];
    })
  );
}

export function applyMats(
  scene: THREE.Group<THREE.Object3DEventMap>,
  loadedTextures: Record<string, THREE.Texture>
) {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.name.includes("Glass")) {
        obj.material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.10,
          depthWrite: false,
        });
      } else if (obj.name.includes("Screen")) {
        const video = document.createElement('video');
        video.src = getAssetPath('/video.mp4'); // Apply base path to video too
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
      } else if (loadedTextures[obj.userData.collection]) {
        obj.material = new THREE.MeshBasicMaterial({ map: loadedTextures[obj.userData.collection] });
        obj.material.map.minFilter = THREE.LinearFilter;
      }
    }
  });
}