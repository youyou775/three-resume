"use client";
import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { experienceData, getExperienceByIndex } from "@/app/utils/experienceData";
import { ExperienceContent } from "@/app/components/ExperienceContent";
import { useAppStateStore } from "@/app/store/appStateStore";
import { Page } from "@/app/enums/Page";
import { ChevronDown } from "lucide-react";

export default function SidePaneMobile() {
  const { bulletIndex, setBulletIndex, setCallToAction } = useAppStateStore();
  const slideButtonRef = useRef<HTMLButtonElement>(null);

  const experience = getExperienceByIndex(bulletIndex);
  const carouselRef = useRef<HTMLDivElement>(null);
  const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
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
        if (diffX > 0 && bulletIndex < 2) setBulletIndex(bulletIndex + 1);
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

  const handleSlideChange = (slideIndex: number) => {
    isUserSwiping.current = true;
    setBulletIndex(slideIndex);
    setTimeout(() => { isUserSwiping.current = false; }, 700);
  };

  return (
    <>

      <div ref={containerRef} className="fixed bottom-0 w-screen h-122 bg-gradient-to-b from-current to-gray-300 border-t flex flex-col items-center">
        <button
          onClick={() => handleSlideChange(Math.max(0, bulletIndex - 1))}
          disabled={bulletIndex === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${bulletIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-black'} transition-colors`}
        >
          ←
        </button>

        <button
          onClick={() => handleSlideChange(Math.min(2, bulletIndex + 1))}
          disabled={bulletIndex === 2}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${bulletIndex === 2 ? 'text-gray-300' : 'text-gray-600 hover:text-black'} transition-colors`}
        >
          →
        </button>
        <div className="flex-grow mx-6 pt-4">
          <div ref={(el) => { carouselRef.current = el; }}>
            <ExperienceContent experience={experience} size="small" />
          </div>
        </div>

        <div className="flex gap-5 mb-16">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => handleSlideChange(i)}
              className={`w-6 h-0.75 rounded-8xl transition-all ${bulletIndex === i ? 'bg-black scale-125' : 'bg-gray-400'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      {bulletIndex == 2 && <button ref={slideButtonRef} className="fixed top-[96%] right-0 -translate-y-[30%] w-[100vw] text-gray-600 flex flex-col items-center cursor-pointer"
        onClick={() => setCallToAction(Page.ToContact)}>
        <span className="text-2xl">Get in Touch</span>
        <ChevronDown className="fill-current inline-block" />
      </button>}
    </>
  );
}