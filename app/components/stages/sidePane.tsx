"use client";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/app/store/scrollStore";

gsap.registerPlugin(ScrollTrigger);

export default function SidePane() {
  const { scrollIndex, goToSection } = useScrollStore();

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

  const elRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
  const bulletsRef = useRef<Array<HTMLButtonElement | null>>([null, null, null]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  /** ---------- Animation helpers ---------- */
  const animateIn = (nodes: (HTMLElement | null)[]) => {
    nodes.forEach((el, index) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.15,
        }
      );
    });
  };

  const animateOut = (nodes: (HTMLElement | null)[], direction: "up" | "down") => {
    nodes.forEach((el, index) => {
      if (!el) return;
      gsap.to(el, {
        y: direction === "up" ? -20 : 20,
        opacity: 0,
        duration: 0.5, // disappear in 0.5s
        ease: "power2.in",
        delay: index * 0.1,
      });
    });
  };

  const highlightBullet = (index: number) => {
    bulletsRef.current.forEach((b, i) => {
      if (!b) return;
      gsap.to(b, {
        scale: i === index ? 1.4 : 1,
        backgroundColor: i === index ? "#111" : "#7a7a7aff",
        duration: 0.5,
      });
    });
  };

  /** ---------- Main effect ---------- */
  useLayoutEffect(() => {
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    const nodes = elRefs.current;
    const slidesCount = nodes.length;
    const totalSegments = slidesCount + 1;
    const totalScrollable = Math.max(
      1,
      document.body.scrollHeight - window.innerHeight
    );
    const segment = totalScrollable / totalSegments;

    // Initial state
    nodes.forEach((el) => el && gsap.set(el, { opacity: 0, y: 20 }));
    bulletsRef.current.forEach((b) =>
      b && gsap.set(b, { scale: 1, backgroundColor: "#7a7a7aff" })
    );

    [1, 2, 3].forEach((pageIndex) => {
      const startPx = Math.round(segment * pageIndex);

      const t = ScrollTrigger.create({
        start: `${startPx - 20}px top`,
        end:
          pageIndex === 3
            ? `${totalScrollable + 100}px top`
            : `${startPx + segment - 20}px top`,
        onEnter: () => animateIn(nodes),
        onEnterBack: () => animateIn(nodes),
        onLeave: () => pageIndex !== 3 && animateOut(nodes, "up"),
        onLeaveBack: () => animateOut(nodes, "down"),
      });
      triggersRef.current.push(t);

      // Bullet highlight
      const bulletIndex = pageIndex - 1;
      const b = bulletsRef.current[bulletIndex];
      if (b) {
        const bt = ScrollTrigger.create({
          start: `${startPx - 10}px top`,
          end: `${startPx + segment - 10}px top`,
          onEnter: () => highlightBullet(bulletIndex),
          onEnterBack: () => highlightBullet(bulletIndex),
        });
        triggersRef.current.push(bt);
      }
    });

    // First bullet special case
    const firstBullet = bulletsRef.current[0];
    if (firstBullet) {
      const firstPageStart = Math.round(segment * 1);
      const transitionTrigger = ScrollTrigger.create({
        start: `${firstPageStart - 50}px top`,
        end: `${firstPageStart + 10}px top`,
        onEnter: () => highlightBullet(0),
        onLeaveBack: () => highlightBullet(-1), // none active
      });
      triggersRef.current.push(transitionTrigger);
    }

    return () => {
      triggersRef.current.forEach((tr) => tr.kill());
      triggersRef.current = [];
    };
  }, []);

  /** ---------- Keep bullets synced with store ---------- */
  useLayoutEffect(() => {
    highlightBullet(scrollIndex - 1);
  }, [scrollIndex]);

  /** ---------- Bullet click handler ---------- */
  const handleBulletClick = (index: number) => {
    goToSection(index + 1);
  };

  return (
    <div className="fixed top-[30%] right-0 -translate-y-[30%] flex items-center w-[30vw]">
      <div className="flex-grow">
        <h1
          ref={(el) => {
            elRefs.current[0] = el;
          }}
          className="text-5xl text-black font-semibold"
        >
          {texts[0]}
        </h1>
        <strong
          ref={(el) => {
            elRefs.current[1] = el;
          }}
          className="text-xs block text-gray-700 mb-8"
        >
          {texts[1]}
        </strong>
        <div
          ref={(el) => {
            elRefs.current[2] = el;
          }}
          className="text-md text-gray-500 font-medium"
        >
          <span>{texts[2]}</span>
          <br />
          <br />
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center w-3 mr-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            ref={(b) => {
              bulletsRef.current[i] = b;
            }}
            onClick={() => handleBulletClick(i)}
            aria-label={`Go to item ${i + 1}`}
            className="w-2.5 h-2.5 rounded-full border-0 p-0 cursor-pointer transition-all duration-500"
          />
        ))}
      </div>
    </div>
  );
}
