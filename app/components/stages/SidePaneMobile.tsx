"use client";
import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/app/store/scrollStore";

gsap.registerPlugin(ScrollTrigger);

export default function SidePaneMobile() {
  const { scrollIndex, goToSection } = useScrollStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserSwiping = useRef(false);

  const slides = useMemo(() => [
    {
      title: "FISERV",
      subtitle: "Senior Full Stack Developer | Jan 2024 - Present",
      bullets: [
        "Maintained 2 front-end projects from beginning to end. Relying on angular to serve more than a hundred banks",
        "Contributed in change of legacy WinForms .Net 4.8 stack to a new C# .Net 8.0 and Angular stack",
        "On the back-end used GraphQl connections in a mega project, along with Postgres on the smaller one",
        "Mentored and co-managed 6 junior developers",
        "Worked in an Agile environment with 2 week sprints, daily standups, and bi-weekly retrospectives",
      ],
      tech: ['C#', '.Net 8.0', 'Angular', 'GraphQL', 'Postgres', 'Azure DevOps', 'Bitbucket', 'Jira', 'Postgres', 'MSSQL']
    },
    {
      title: "CONIX",
      subtitle: "Senior Full Stack Developer / Computational Designer | Jul 2021 – Jan 2024",
      bullets: [
        "Switched to Angular/React and Node.js to improve scalability. Increased deployment efficiency by 50%",
        "Managed DevOps through GoDaddy then Cloudflare, reducing costs by 33%",
        "Wrote database using MYSQL migrating from MSSQL",
        "Secured $1.2 million in funding. While reduced design time by over 90% through AI development",
        "Deployed stacks on AWS, serving over 1000 users",
        "Managed a team of 3 computational designers/developers"
      ],
      tech: ['Node.js', 'React', 'Angular', 'Three.js', 'AWS', 'MYSQL', 'MSSQL', 'GoDaddy', 'Cloudflare', 'Docker', 'Rhino', 'Grasshopper', 'Python', 'C++']
    },
    {
      title: "MODERN ACADEMY",
      subtitle: "Bachelor's Degree in Architecture | Sep 2012 – Jun 2017",
      bullets: [
        "Graduated with a B+ average (above 80%). Demonstrated creative computational design skills",
        "Conducted innovative research and implemented new systems. Developed concepts using beginner C++"
      ],
      tech: ['AutoCAD', '3ds Max', 'Vray', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'Grasshopper', 'C++']
    }
  ], []);

  // Update current slide based on scroll index - only if not user swiping
  useEffect(() => {
    if (!isUserSwiping.current && scrollIndex >= 1 && scrollIndex <= 3) {
      setCurrentSlide(scrollIndex - 1);
    }
  }, [scrollIndex]);

  // Horizontal scroll animation
  useLayoutEffect(() => {
    if (!carouselRef.current) return;

    gsap.to(carouselRef.current, {
      x: -(currentSlide * (100 / 3)) + "%",
      duration: 0.6,
      ease: "power2.out"
    });
  }, [currentSlide]);

  // Touch/Swipe handling - just update local state, don't trigger global scroll
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
      const diffX = startX - currentX;

      // Prevent default scroll if horizontal swipe detected
      if (Math.abs(diffX) > 20) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      const diffX = startX - currentX;
      const threshold = 50;

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0 && currentSlide < 2) {
          // Swipe left - next slide
          setCurrentSlide(prev => prev + 1);
        } else if (diffX < 0 && currentSlide > 0) {
          // Swipe right - previous slide
          setCurrentSlide(prev => prev - 1);
        }
      }

      isDragging = false;
      // Allow scroll updates after swipe animation completes
      setTimeout(() => {
        isUserSwiping.current = false;
      }, 700);
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

  // Handle button clicks
  const handleSlideChange = (slideIndex: number) => {
    isUserSwiping.current = true;
    setCurrentSlide(slideIndex);
    setTimeout(() => {
      isUserSwiping.current = false;
    }, 700);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 w-screen h-1/2 bg-white border-t border-gray-200 overflow-hidden"
    >
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex h-full"
        style={{ width: '300%' }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-1/3 h-full p-6 flex flex-col justify-start overflow-y-auto"
          >
            <h1 className="text-3xl font-bold text-black mb-2">
              {slide.title}
            </h1>

            <p className="text-xs text-gray-600 mb-4 font-medium">
              {slide.subtitle}
            </p>

            <div className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {slide.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start text-xs">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <span className="flex-1 text-gray-700 leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-6">
                {slide.tech && slide.tech.map((tech, index) => (
                  <div key={index} className="bg-gray-400 rounded-xl p-0.5 px-1.5">
                    <p className="italic text-gray-900 text-xs">
                      {tech}
                    </p>

                  </div>
                ))}

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => handleSlideChange(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-black scale-125' : 'bg-gray-400'
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
        disabled={currentSlide === 0}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${currentSlide === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-black'
          } transition-colors`}
        aria-label="Previous slide"
      >
        ←
      </button>

      <button
        onClick={() => handleSlideChange(Math.min(2, currentSlide + 1))}
        disabled={currentSlide === 2}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 ${currentSlide === 2 ? 'text-gray-300' : 'text-gray-600 hover:text-black'
          } transition-colors`}
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
}