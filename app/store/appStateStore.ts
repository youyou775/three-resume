import { ObjectMap } from "@react-three/fiber";
import { GLTF } from 'three-stdlib';
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useMobileDetection } from "../hooks/useMobileDetection";


interface AppStateStore {
    //State
    initialLoad: boolean;
    assetsLoaded: boolean;
    animationComplete: boolean;
    isMobile: boolean | undefined;
    bulletIndex: number;
    callToAction:number;
    tweenProgress: number;
    //Actions
    setInitialLoad: (init: boolean) => void;
    setAssetsLoaded: (assets: boolean) => void;
    setIsMobile: (mobile: boolean) => void;
    setBulletIndex: (cta: number) => void;
    setCallToAction: (cta: number) => void;
    setAnimationComplete: (mobile: boolean) => void;
    setTweenProgress: (progress: number) => void;
}

export const useAppStateStore = create<AppStateStore>()(
    subscribeWithSelector((set, get) => ({
        // Initial state
        initialLoad: true,
        assetsLoaded: false,
        animationComplete: false,
        isMobile: undefined,
        bulletIndex: 0,
        callToAction: 0,
        tweenProgress: 0,
        // Actions
        setInitialLoad: (init) => set({ initialLoad: init }),
        setAssetsLoaded: (assets) => set({ assetsLoaded: assets }),
        setIsMobile: (mobile) => set({ isMobile: mobile }),
        setBulletIndex: (idx) => set({ bulletIndex: idx}),
        setCallToAction: (cta) => set({ callToAction: cta}),
        setAnimationComplete: (isAnimationComplete) => set({ animationComplete: isAnimationComplete }),
        setTweenProgress: (progress) => set({ tweenProgress: progress }),
    }))
);