"use client";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { experienceData, getExperienceByIndex } from "@/app/utils/experienceData";
import { ExperienceContent } from "@/app/components/ExperienceContent";
import { useContactButtonAnimation } from "@/app/hooks/useContactButtonAnimation";
import { useAppStateStore } from "@/app/store/appStateStore";
import { Page } from "@/app/enums/Page";
import { ChevronDown } from "lucide-react";

export default function SidePaneMobile() {
  const { bulletIndex, setBulletIndex, setCallToAction } = useAppStateStore();
  const slideButtonRef = useContactButtonAnimation(bulletIndex);

  const experience = getExperienceByIndex(bulletIndex);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserSwiping = useRef(false);

  useLayoutEffect(() => {
    if (!carouselRef.current) return;
    gsap.fromTo(carouselRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, [bulletIndex]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      isUserSwiping.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      if (Math.abs(startX - currentX) > 20) e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;

      // Don't process as swipe if target is a button
      if ((e.target as HTMLElement)?.closest('button')) {
        isDragging = false;
        return;
      }

      const diffX = startX - currentX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && bulletIndex < experienceData.length - 1) setBulletIndex(bulletIndex + 1);
        else if (diffX < 0 && bulletIndex > 0) setBulletIndex(bulletIndex - 1);
      }
      isDragging = false;
      setTimeout(() => { isUserSwiping.current = false; }, 700);
    };

    const container = containerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [bulletIndex]);

  const handleSlideChange = (slideIndex: number) => {
    isUserSwiping.current = true;
    setBulletIndex(slideIndex);
    setTimeout(() => { isUserSwiping.current = false; }, 700);
  };

  return (
    <>

      <div ref={containerRef} className="fixed bottom-0 w-screen h-[62%] bg-gradient-to-b from-current to-gray-300 border-t flex flex-col items-center">
        <button
          onClick={() => handleSlideChange(Math.max(0, bulletIndex - 1))}
          disabled={bulletIndex === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${bulletIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-black'} transition-colors`}
        >
          ←
        </button>

        <button
          onClick={() => handleSlideChange(Math.min(experienceData.length - 1, bulletIndex + 1))}
          disabled={bulletIndex === experienceData.length - 1}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${bulletIndex === experienceData.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-black'} transition-colors`}
        >
          →
        </button>
        <div className="flex-grow mx-5 pt-2 overflow-y-auto">
          <div ref={(el) => { carouselRef.current = el; }}>
            <ExperienceContent experience={experience} size="small" />
          </div>
        </div>

        <div className="flex gap-5 my-4">
          {experienceData.map((i) => (
            <button
              key={i.id}
              onClick={() => handleSlideChange(i.id)}
              className={`w-6 h-0.75 rounded-8xl transition-all ${bulletIndex === i.id ? 'bg-black scale-125' : 'bg-gray-400'}`}
              aria-label={`Go to slide ${i.id + 1}`}
            />
          ))}
        </div>
        <button
          ref={slideButtonRef}
          className={`text-gray-600 flex flex-col items-center cursor-pointer transition-opacity duration-300 ${bulletIndex === experienceData.length - 1
              ? 'opacity-100 visible'
              : 'opacity-0 invisible'
            }`}
          onClick={() => setCallToAction(Page.ToContact)}
        >
          <span className="text-2xl">Get in Touch</span>
          <ChevronDown className="fill-current inline-block" />
        </button>
      </div>
    </>
  );
}