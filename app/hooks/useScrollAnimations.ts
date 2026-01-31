// import { useLayoutEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// export const useScrollAnimations = (scrollIndex: number) => {
//   const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
//   const triggersRef = useRef<ScrollTrigger[]>([]);

//   const animateIn = (nodes: (HTMLElement | null)[]) => {
//     nodes.forEach((el, index) => {
//       if (!el) return;
//       gsap.fromTo(
//         el,
//         { y: 100, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: index * 0.15 }
//       );
//     });
//   };

//   const animateOut = (nodes: (HTMLElement | null)[], direction: "up" | "down") => {
//     nodes.forEach((el, index) => {
//       if (!el) return;
//       gsap.to(el, {
//         y: direction === "up" ? -20 : 20,
//         opacity: 0,
//         duration: 0.5,
//         ease: "power2.in",
//         delay: index * 0.1,
//       });
//     });
//   };

//   useLayoutEffect(() => {
//     // Setup scroll triggers logic here
//     return () => {
//       triggersRef.current.forEach((tr) => tr.kill());
//       triggersRef.current = [];
//     };
//   }, []);

//   return { elRefs, animateIn, animateOut };
// };