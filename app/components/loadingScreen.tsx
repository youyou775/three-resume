import { Html, useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html center style={{ zIndex: 1000 }}>
      <div className="flex flex-col items-center justify-center p-6 bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur text-gray-800">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">{Math.floor(progress)}% loaded</p>
      </div>
    </Html>
  );
}
