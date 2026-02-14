// hooks/useScrollTriggerAnimations.ts
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useAppStateStore } from '../store/appStateStore';

export const useCameraAnimate = () => {
    const { initialLoad, callToAction, setTweenProgress, setAnimationComplete } = useAppStateStore();

    useLayoutEffect(() => {
        if (initialLoad) return;

        const progressObj = { value: 0 };
        gsap.to(progressObj, {
            value: 100,
            duration: 3,
            ease: "power2.inOut",
            onUpdate: () => setTweenProgress(progressObj.value),
            onComplete: () => setAnimationComplete(true)
        });

        return () => gsap.killTweensOf(progressObj);
    }, [initialLoad, callToAction, setTweenProgress]);
};