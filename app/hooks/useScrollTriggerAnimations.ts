// hooks/useScrollTriggerAnimations.ts
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export const useScrollTriggerAnimations = (bulletIndex: number) => {
  const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
  const bulletsRef = useRef<Array<HTMLButtonElement | null>>([null, null, null]);
  const previousIndexRef = useRef<number>(0);

  // Animate content based on bulletIndex changes
  useLayoutEffect(() => {
    const el = elRefs.current[2]; // Content element
    if (!el) return;

      gsap.fromTo(el,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );

    previousIndexRef.current = bulletIndex;
  }, [bulletIndex]);

  // Highlight active bullet based on bulletIndex
  useLayoutEffect(() => {
    bulletsRef.current.forEach((b, i) => {
      if (!b) return;
      const isActive = bulletIndex === i ;
      gsap.to(b, {
        scale: isActive ? 1.4 : 1,
        backgroundColor: isActive ? "#111" : "#7a7a7aff",
        duration: 0.2,
      });
    });
  }, [bulletIndex]);

  return { elRefs, bulletsRef };
};