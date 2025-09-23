import { useMemo } from "react";

export type CameraConfig = {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
};

export function useCameraConfig(
  gltfs: any[],
  scrollIndex: number,
  activeScene: number,
  aboutCamera: CameraConfig
) {
  return useMemo(() => {
    const g = gltfs[Math.max(0, scrollIndex === 0 ? 0 : activeScene)];
    if (g?.cameras?.[0]?.position) {
      return {
        position: [11.118, 2.794, 7.675] as [number, number, number],
        lookAt: [1.364, 2.331, -2.716] as [number, number, number],
        fov: aboutCamera.fov,
      };
    }
    return aboutCamera;
  }, [gltfs, scrollIndex, activeScene, aboutCamera]);
}
