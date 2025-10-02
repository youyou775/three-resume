// scrollBehavior.ts
import { useEffect } from "react";
import { useScrollStore } from "../store/scrollStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const useScrollBehavior = () => {
  const { isIntro, totalSections, setScrollData } = useScrollStore();

  useEffect(() => {
    if (isIntro) return;

    const lastIndex = totalSections - 1;
    const forwardThreshold = 0.15; // Lower threshold to start transition earlier
    const backThreshold = 0.85;    // Higher threshold to start transition earlier

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 2, // Increased from 1 to 2 for smoother scrubbing
      onUpdate: (self) => {
        const raw = self.progress * lastIndex;
        let index = Math.round(raw);
        const progress = raw - index;

        setScrollData({
          scrollIndex: index,
          scrollProgress: progress,
          activeScene: index - 1,
        });
      },
      snap: {
        snapTo: (value, self) => {
          const raw = value * lastIndex;
          const index = Math.floor(raw);
          const progressInSection = raw - index;

          let targetIndex = index;

          if (self?.direction === 1) {
            if (progressInSection >= forwardThreshold) {
              targetIndex = Math.min(index + 1, lastIndex);
            }
          } else if (self?.direction === -1) {
            if (progressInSection <= backThreshold) {
              targetIndex = Math.max(index, 0);
            } else {
              targetIndex = Math.min(index + 1, lastIndex);
            }
          } else {
            targetIndex = progressInSection >= 0.5 ? Math.min(index + 1, lastIndex) : index;
          }

          return targetIndex / lastIndex;
        },
        duration: { min: 2.4, max: 3.6 }, // Significantly increased duration for slower snapping
        ease: "power2.inOut",             // Changed to power2 for smoother acceleration/deceleration
      },
    });

    return () => st.kill();
  }, [isIntro, totalSections, setScrollData]);
};
