"use client";
import React from "react";
import { useScrollStore } from "@/app/store/scrollStore";
import { getExperienceByScrollIndex } from "@/app/data/experienceData";
import { ExperienceContent } from "@/app/components/ExperienceContent";
import { useScrollTriggerAnimations } from "@/app/hooks/useScrollTriggerAnimations";

export default function SidePane() {
  const { scrollIndex, goToSection } = useScrollStore();
  const experience = getExperienceByScrollIndex(scrollIndex);
  const { elRefs, bulletsRef } = useScrollTriggerAnimations(scrollIndex);

  const handleBulletClick = (index: number) => goToSection(index + 1);

  return (
    <div className="fixed top-[30%] right-0 -translate-y-[30%] flex items-center w-[30vw]">
      <div className="flex-grow pr-8">
        <div ref={(el) => { elRefs.current[2] = el; }}>
          <ExperienceContent experience={experience} size="large" />
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center w-3 mr-6">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            ref={(b) => { bulletsRef.current[i] = b; }}
            onClick={() => handleBulletClick(i)}
            aria-label={`Go to item ${i + 1}`}
            className="w-2.5 h-2.5 rounded-full border-0 p-0 cursor-pointer transition-all duration-500 bg-gray-400"
          />
        ))}
      </div>
    </div>
  );
}