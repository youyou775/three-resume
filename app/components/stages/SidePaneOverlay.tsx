"use client";
import React, { useEffect, useRef, useState } from "react";
import { getExperienceByIndex } from "@/app/utils/experienceData";
import { ExperienceContent } from "@/app/components/ExperienceContent";
import { useScrollTriggerAnimations } from "@/app/hooks/useScrollTriggerAnimations";
import { useAppStateStore } from "@/app/store/appStateStore";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { Page } from "@/app/enums/Page";

export default function SidePaneOverlay() {
  const { setCallToAction, bulletIndex, setBulletIndex } = useAppStateStore();
  const slideButtonRef = useRef<HTMLButtonElement>(null);

  const experience = getExperienceByIndex(bulletIndex);
  const { elRefs, bulletsRef } = useScrollTriggerAnimations(bulletIndex);

  useEffect(() => {
    if (bulletIndex !== 2) return;

    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(slideButtonRef.current,
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
    )

  }, [bulletIndex])

  return (
    <>
      <div className="fixed top-[30%] right-0 -translate-y-[30%] flex items-center w-[30vw]">
        <div className="flex-grow pr-8">
          <div ref={(el) => { elRefs.current[2] = el; }}>
            <ExperienceContent experience={experience} size="large" />
          </div>
        </div>

        <div className="flex flex-col gap-5 items-center w-0 mr-3">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              ref={(b) => { bulletsRef.current[i] = b; }}
              onClick={() => setBulletIndex(i)} // Update state
              aria-label={`Go to item ${i}`}
              className="w-0.75 h-6 rounded-8xl border-0 p-0 cursor-pointer transition-all duration-500 bg-gray-400"
            />
          ))}
        </div>
      </div>

      {bulletIndex == 2 && <button ref={slideButtonRef} className="fixed top-[96%] right-0 -translate-y-[30%] w-[35vw] text-gray-600 flex flex-col items-center cursor-pointer"
        onClick={() => setCallToAction(Page.ToContact)}>
        <span className="text-2xl">Get in Touch</span>
        <ChevronDown className="fill-current inline-block" />
      </button>}
    </>
  );
}   