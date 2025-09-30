import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollTriggerAnimations = (scrollIndex: number) => {
  const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
  const bulletsRef = useRef<Array<HTMLButtonElement | null>>([null, null, null]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const animateIn = (nodes: (HTMLElement | null)[]) => {
    nodes.forEach((el, index) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: index * 0.15 }
      );
    });
  };

  const animateOut = (nodes: (HTMLElement | null)[], direction: "up" | "down") => {
    nodes.forEach((el, index) => {
      if (!el) return;
      gsap.to(el, {
        y: direction === "up" ? -20 : 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        delay: index * 0.1,
      });
    });
  };

  const highlightBullet = (index: number) => {
    bulletsRef.current.forEach((b, i) => {
      if (!b) return;
      gsap.to(b, {
        scale: i === index ? 1.4 : 1,
        backgroundColor: i === index ? "#111" : "#7a7a7aff",
        duration: 0.5,
      });
    });
  };

  useLayoutEffect(() => {
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    const nodes = elRefs.current;
    const slidesCount = nodes.length;
    const totalSegments = slidesCount + 1;
    const totalScrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const segment = totalScrollable / totalSegments;

    nodes.forEach((el) => el && gsap.set(el, { opacity: 0, y: 20 }));
    bulletsRef.current.forEach((b) => b && gsap.set(b, { scale: 1, backgroundColor: "#7a7a7aff" }));

    [1, 2, 3].forEach((pageIndex) => {
      const startPx = Math.round(segment * pageIndex);

      const t = ScrollTrigger.create({
        start: `${startPx - 20}px top`,
        end: pageIndex === 3 ? `${totalScrollable + 100}px top` : `${startPx + segment - 20}px top`,
        onEnter: () => animateIn(nodes),
        onEnterBack: () => animateIn(nodes),
        onLeave: () => pageIndex !== 3 && animateOut(nodes, "up"),
        onLeaveBack: () => animateOut(nodes, "down"),
      });
      triggersRef.current.push(t);

      const bulletIndex = pageIndex - 1;
      const b = bulletsRef.current[bulletIndex];
      if (b) {
        const bt = ScrollTrigger.create({
          start: `${startPx - 10}px top`,
          end: `${startPx + segment - 10}px top`,
          onEnter: () => highlightBullet(bulletIndex),
          onEnterBack: () => highlightBullet(bulletIndex),
        });
        triggersRef.current.push(bt);
      }
    });

    const firstBullet = bulletsRef.current[0];
    if (firstBullet) {
      const firstPageStart = Math.round(segment * 1);
      const transitionTrigger = ScrollTrigger.create({
        start: `${firstPageStart - 50}px top`,
        end: `${firstPageStart + 10}px top`,
        onEnter: () => highlightBullet(0),
        onLeaveBack: () => highlightBullet(-1),
      });
      triggersRef.current.push(transitionTrigger);
    }

    return () => {
      triggersRef.current.forEach((tr) => tr.kill());
      triggersRef.current = [];
    };
  }, []);

  useLayoutEffect(() => {
    highlightBullet(scrollIndex - 1);
  }, [scrollIndex]);

  return { elRefs, bulletsRef, highlightBullet };
};