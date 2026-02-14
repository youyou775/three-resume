import { useEffect, useRef } from "react";
import gsap from "gsap";
import { experienceData } from "../utils/experienceData";

export const useContactButtonAnimation = (bulletIndex: number) => {
  const slideButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (bulletIndex !== experienceData.length - 1) return;

    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(
      slideButtonRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.out",
        delay: 1.5,
      },
      "-=1.5"
    );
  }, [bulletIndex]);

  return slideButtonRef;
};
