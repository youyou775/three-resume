// hooks/useScrollTriggerAnimations.ts
import { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';

export const useScrollTriggerAnimations = (scrollIndex: number) => {
  const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
  const bulletsRef = useRef<Array<HTMLButtonElement | null>>([null, null, null]);
  const previousIndexRef = useRef<number>(0);

  // Animate content based on scrollIndex changes
  useLayoutEffect(() => {
    const el = elRefs.current[2]; // Content element
    if (!el) return;

    const isEntering = scrollIndex > 0 && scrollIndex <= 3;
    const wasVisible = previousIndexRef.current > 0 && previousIndexRef.current <= 3;

    if (isEntering && !wasVisible) {
      // Entering from outside (scrollIndex 0 or 4)
      gsap.fromTo(el,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    } else if (!isEntering && wasVisible) {
      // Exiting
      gsap.to(el, { 
        y: scrollIndex > 3 ? -20 : 20, 
        opacity: 0, 
        duration: 0.5, 
        ease: "power2.in" 
      });
    }

    previousIndexRef.current = scrollIndex;
  }, [scrollIndex]);

  // Highlight active bullet based on scrollIndex
  useLayoutEffect(() => {
    bulletsRef.current.forEach((b, i) => {
      if (!b) return;
      const isActive = scrollIndex === i + 1;
      gsap.to(b, {
        scale: isActive ? 1.4 : 1,
        backgroundColor: isActive ? "#111" : "#7a7a7aff",
        duration: 0.5,
      });
    });
  }, [scrollIndex]);

  return { elRefs, bulletsRef };
};