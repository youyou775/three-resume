"use client";
import React from "react";
import { experienceData, getExperienceByIndex } from "@/app/utils/experienceData";
import { ExperienceContent } from "@/app/components/ExperienceContent";
import { carouselAnimation } from "@/app/hooks/useScrollTriggerAnimations";
import { useContactButtonAnimation } from "@/app/hooks/useContactButtonAnimation";
import { useAppStateStore } from "@/app/store/appStateStore";
import { ChevronDown } from "lucide-react";
import { Page } from "@/app/enums/Page";

export default function SidePaneOverlay() {
  const { setCallToAction, bulletIndex, setBulletIndex } = useAppStateStore();
  const slideButtonRef = useContactButtonAnimation(bulletIndex);

  const experience = getExperienceByIndex(bulletIndex);
  const { elRefs, bulletsRef } = carouselAnimation(bulletIndex);

  return (
    <>
      <div className="fixed top-[30%] right-0 -translate-y-[30%] flex items-center w-[30vw]">
        <div className="flex-grow pr-6">
          <div ref={(el) => { elRefs.current[2] = el; }}>
            <ExperienceContent experience={experience} size="large" />
          </div>
        </div>

        <div className="flex flex-col gap-5 items-center w-0 mr-3">
          {experienceData.map((i) => (
            <button
              key={i.id}
              ref={(b) => { bulletsRef.current[i.id] = b; }}
              onClick={() => setBulletIndex(i.id)} // Update state
              aria-label={`Go to item ${i.id + 1}`}
              className="w-0.75 h-6 rounded-8xl border-0 p-0 cursor-pointer transition-all duration-500 bg-gray-400"
            />
          ))}
        </div>
      </div>

      {bulletIndex == experienceData.length - 1 && <button ref={slideButtonRef} className="fixed top-[96%] right-0 -translate-y-[30%] w-[35vw] text-gray-600 flex flex-col items-center cursor-pointer"
        onClick={() => setCallToAction(Page.ToContact)}>
        <span className="text-2xl">Get in Touch</span>
        <ChevronDown className="fill-current inline-block" />
      </button>}
    </>
  );
}   