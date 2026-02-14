import { useAppStateStore } from "../store/appStateStore";

export default function AppLoadingScreen() {
    const { assetsLoaded } = useAppStateStore();

    return (
        <>
            {(!assetsLoaded) && (
                <div className="fixed w-screen h-screen z-50">
                    <div className="text-white bg-gray-900 w-screen h-screen flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
                            <p className="text-lg">Loading 3D Experience...</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}