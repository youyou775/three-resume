import { ObjectMap } from "@react-three/fiber";
import { GLTF } from 'three-stdlib';
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useMobileDetection } from "../hooks/useMobileDetection";


interface AppStateStore {
    //State
    // currentGltf: (GLTF & ObjectMap) | null;
    initialLoad: boolean;
    // sceneLoaded: boolean;
    assetsLoaded: boolean;
    isMobile: boolean;
    //Actions
    // setGltf: (gltf: GLTF & ObjectMap | null) => void;
    setInitialLoad: (init: boolean) => void;
    // setSceneLoaded: (scene: boolean) => void;
    setAssetsLoaded: (assets: boolean) => void;
    setIsMobile: (mobile: boolean) => void;
    //Internal state
    // _sceneLoading: boolean
    // _setSceneLoading: (sceneLoading: boolean) => void;
}

export const useAppStateStore = create<AppStateStore>()(
    subscribeWithSelector((set, get) => ({
        // Initial state
        // currentGltf: null,
        initialLoad: true,
        // sceneLoaded: false,
        assetsLoaded: false,
        isMobile: false,
        // Actions
        // setGltf: (gltf) => set({ currentGltf: gltf }),
        setInitialLoad: (init) => set({ initialLoad: init }),
        // setSceneLoaded: (scene) => set({ sceneLoaded: scene }),
        setAssetsLoaded: (assets) => set({ assetsLoaded: assets }),
        setIsMobile: (mobile) => set({ isMobile: mobile }),
        //Internal state
        // _sceneLoading: false,
        // _setSceneLoading: (sceneLoading) => set({ _sceneLoading: sceneLoading }),
    }))
);