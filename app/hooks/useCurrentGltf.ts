// import { GLTF } from 'three-stdlib';
// import { ObjectMap } from '@react-three/fiber';
// import { useMemo } from 'react';

// export const useCurrentGltf = (gltfs: (GLTF & ObjectMap)[], scrollIndex: number):(GLTF & ObjectMap) | null => {
//   return useMemo(() => {
//     if (!gltfs.length) return null;
//     if (scrollIndex === 0) return gltfs[0] || null;
//     return gltfs[Math.max(0, Math.min(scrollIndex - 1, gltfs.length - 1))];
//   }, [gltfs, scrollIndex]);
// };