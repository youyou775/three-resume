"use client";
import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useScrollStore } from "@/app/store/scrollStore";
import { experienceData } from "@/app/utils/experienceData";
import { ExperienceContent } from "@/app/components/ExperienceContent";

export default function SidePaneMobile() {
  const { scrollIndex } = useScrollStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserSwiping = useRef(false);

  useEffect(() => {
    if (!isUserSwiping.current && scrollIndex >= 1 && scrollIndex <= 3) {
      setCurrentSlide(scrollIndex - 1);
    }
  }, [scrollIndex]);

  useLayoutEffect(() => {
    if (!carouselRef.current) return;
    gsap.to(carouselRef.current, {
      x: -(currentSlide * (100 / 3)) + "%",
      duration: 0.6,
      ease: "power2.out"
    });
  }, [currentSlide]);

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

    const handleTouchEnd = () => {
      if (!isDragging) return;
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentSlide < 2) setCurrentSlide(prev => prev + 1);
        else if (diffX < 0 && currentSlide > 0) setCurrentSlide(prev => prev - 1);
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
  }, [currentSlide]);

  const handleSlideChange = (slideIndex: number) => {
    isUserSwiping.current = true;
    setCurrentSlide(slideIndex);
    setTimeout(() => { isUserSwiping.current = false; }, 700);
  };

  return (
    <div ref={containerRef} className="fixed bottom-0 w-screen h-1/2 bg-white border-t border-gray-200 overflow-hidden">
      <div ref={carouselRef} className="flex h-full" style={{ width: '300%' }}>
        {experienceData.map((experience, index) => (
          <div key={experience.id} className="w-1/3 h-full p-6 flex flex-col justify-start overflow-y-auto">
            <ExperienceContent experience={experience} size="small" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => handleSlideChange(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-black scale-125' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
        disabled={currentSlide === 0}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${currentSlide === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-black'} transition-colors`}
      >
        ←
      </button>

      <button
        onClick={() => handleSlideChange(Math.min(2, currentSlide + 1))}
        disabled={currentSlide === 2}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${currentSlide === 2 ? 'text-gray-300' : 'text-gray-600 hover:text-black'} transition-colors`}
      >
        →
      </button>
    </div>
  );
}