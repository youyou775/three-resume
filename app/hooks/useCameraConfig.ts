import { useMemo } from 'react';

export const useCameraConfig = (isMobile: boolean, currentGltf: any) => {
  const aboutCamera = useMemo(() => ({
    position: isMobile
      ? [6.954, 4.456, 8.482] as [number, number, number]
      : [5.350, 4.100, -0.573] as [number, number, number],
    lookAt: isMobile
      ? [-1.451, 2.095, -1.892] as [number, number, number]
      : [0.069, 2.928, -1.892] as [number, number, number],
    fov: 35,
  }), [isMobile]);

  const modelCamera = useMemo(() => {
    if (currentGltf?.cameras?.[0]?.position) {
      return {
        position: isMobile
          ? [15.806, 8.405, 32.181] as [number, number, number]
          : [11.118, 2.794, 7.675] as [number, number, number],
        lookAt: isMobile
          ? [0.312, -1.861, 0.266] as [number, number, number]
          : [1.364, 2.331, -2.716] as [number, number, number],
        fov: aboutCamera.fov,
      };
    }
    return aboutCamera;
  }, [currentGltf, aboutCamera, isMobile]);

  const contactCamera = useMemo(() => ({
    position: [2.5, 6.0, 12.0] as [number, number, number],
    lookAt: [0.0, 3.0, 0.0] as [number, number, number],
    fov: 40,
  }), []);

  return { aboutCamera, modelCamera, contactCamera };
};