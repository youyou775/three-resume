import { useFrame } from '@react-three/fiber';

export default function TargetAnimate() {
  useFrame(state => {
    state.scene.traverse(obj => {
      if (obj.name.includes('Fan')) {
        obj.rotation.z += 0.2;
      }
    });
  });
  return null;
}