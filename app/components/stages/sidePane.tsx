"use client";
import React, { useLayoutEffect, useMemo, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SidePane({
  scrollIndex,
  onSelect,
}: {
  scrollIndex: number;
  onSelect?: (index: number) => void;
}) {
  const texts = useMemo(() => {
    switch (scrollIndex) {
      case 1:
        return ["FISERV", "Financial Services", "Worked on project DNA"];
      case 2:
        return ["CONIX", "Computational Design & development", "Worked on project DNA"];
      case 3:
        return ["MODERN ACADEMY", "Architecture school", "Worked on project DNA"];
      default:
        return ["", "", ""];
    }
  }, [scrollIndex]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
  const bulletsRef = useRef<Array<HTMLButtonElement | null>>([null, null, null]);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  // const [bulletPositions, setBulletPositions] = useState<number[]>([0, 0, 0]);

  // create ScrollTriggers for element animations and bullet highlight
  useLayoutEffect(() => {
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    const nodes = elRefs.current;
    const slidesCount = nodes.length;
    const totalSegments = slidesCount + 1;
    const totalScrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const segment = totalScrollable / totalSegments;

    // Create triggers for all elements at once for each page segment
    [1, 2, 3].forEach((pageIndex) => {
      const startPx = Math.round(segment * pageIndex);

      // Set initial state for all elements
      nodes.forEach((el) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 20 });
      });

      // Create trigger that shows/hides all elements
      const t = ScrollTrigger.create({
        start: `${startPx}px top`,
        end: `${startPx + 2}px top`,
        onEnter: () => {
          nodes.forEach((el) => {
            if (!el) return;
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          });
        },
        onEnterBack: () => {
          nodes.forEach((el) => {
            if (!el) return;
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          });
        },
        onLeave: () => {
          nodes.forEach((el) => {
            if (!el) return;
            gsap.to(el, { opacity: 0, y: -10, duration: 0.35, ease: "power2.in" });
          });
        },
        onLeaveBack: () => {
          nodes.forEach((el) => {
            if (!el) return;
            gsap.to(el, { opacity: 0, y: 20, duration: 0.35, ease: "power2.in" });
          });
        },
      });
      triggersRef.current.push(t);

      // Create bullet highlight trigger
      const b = bulletsRef.current[pageIndex - 1];
      if (b) {
        gsap.set(b, { scale: 1, backgroundColor: "#7a7a7aff" });
        const bt = ScrollTrigger.create({
          start: `${startPx - 10}px top`,
          end: `${startPx + 10}px top`,
          onEnter: () => gsap.to(b, { scale: 1.4, backgroundColor: "#111", duration: 0.5 }),
          onEnterBack: () => gsap.to(b, { scale: 1.4, backgroundColor: "#111", duration: 0.5 }),
          onLeave: () => gsap.to(b, { scale: 1, backgroundColor: "#7a7a7aff", duration: 0.5 }),
          onLeaveBack: () => gsap.to(b, { scale: 1, backgroundColor: "#7a7a7aff", duration: 0.5 }),
        });
        triggersRef.current.push(bt);
      }
    });

    return () => {
      triggersRef.current.forEach((tr) => tr.kill());
      triggersRef.current = [];
    };
  }, []); // run once on mount

  // recompute bullet vertical positions so each bullet is vertically centered on its element
  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      const container = containerRef.current;
      // compute positions: center Y in viewport coordinates for each elRef
      const positions = elRefs.current.map((el) => {
        if (!el) return -9999;
        const r = el.getBoundingClientRect();
        // center Y in viewport coordinates
        return Math.round(r.top + r.height / 2);
      });
      // setBulletPositions(positions);
    };

    // initial measure + update on scroll/resize
    raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [scrollIndex]); // re-measure when scrollIndex (content) changes

  // ensure bullets visually reflect current scrollIndex immediately when prop changes
  useLayoutEffect(() => {
    bulletsRef.current.forEach((b, i) => {
      if (!b) return;
      const active = scrollIndex === i + 1;
      gsap.to(b, { scale: active ? 1.4 : 1, backgroundColor: active ? "#111" : "#7a7a7aff", duration: 0.5 });
    });
  }, [scrollIndex]);

  // scroll to segment when clicking a bullet
  const handleBulletClick = (index: number) => {
    const slidesCount = elRefs.current.length;
    const totalSegments = slidesCount + 1;
    const totalScrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const segment = totalScrollable / totalSegments;
    const pageIndex = index + 1;
    const targetY = Math.round(segment * pageIndex);
    window.scrollTo({ top: targetY, behavior: "smooth" });
    if (onSelect) onSelect(pageIndex);
  };

  return (
    <>
      {/* Content blocks without buttons */}
      <div className="flex-grow">
        <h1 ref={(el) => { (elRefs.current[0] = el) }} className="text-5xl text-black font-semibold ">
          {texts[0]}
        </h1>

        <strong ref={(el) => { (elRefs.current[1] = el) }} className="text-xs block text-gray-700 mb-8">
          {texts[1]}
        </strong>

        <div ref={(el) => { (elRefs.current[2] = el) }} className="text-md text-gray-500 font-medium">
          <span>{texts[2]}</span>
          <br />
          <br />
          <a href="https://www.google.com" target="_blank" rel="noreferrer">
            Learn more
          </a>
        </div>
      </div>
      {/* Separate buttons container */}
      <div className="flex flex-col gap-3 items-center w-3 mr-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            ref={(b) => { (bulletsRef.current[i] = b) }}
            onClick={() => handleBulletClick(i)}
            aria-label={`Go to item ${i + 1}`}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              cursor: "pointer",
              background: scrollIndex === i + 1 ? "#111" : "#7a7a7aff",
              transform: scrollIndex === i + 1 ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </>
  );
}