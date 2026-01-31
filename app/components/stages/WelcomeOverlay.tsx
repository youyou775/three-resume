"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppStateStore } from "@/app/store/appStateStore";


export default function WelcomeOverlay() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [clickEnabled, setClickEnabled] = useState(false);

  const { initialLoad, assetsLoaded, setInitialLoad } = useAppStateStore();

  useEffect(() => {
    // Only animate when both initialLoad is true AND assets are ready
    if (initialLoad && assetsLoaded && textRef.current && spanRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setClickEnabled(true);

          gsap.to(spanRef.current, {
            opacity: 0.3,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        },
      });

      tl.fromTo(
        textRef.current,
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
        }
      ).fromTo(
        spanRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 1.5,
        },
        "-=1.5"
      );
    }
  }, [initialLoad, assetsLoaded]); // Add isReady dependency

  const handleClick = () => {
    // Only allow click if ready and click is enabled
    if (!clickEnabled || !assetsLoaded) return;

    const tl = gsap.timeline({ onComplete: () => setInitialLoad(false), });

    tl.to(textRef.current, {
      y: 300,
      opacity: 0,
      duration: 1,
      ease: "power2.in",
    }).to(divRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.in",
    });
  };

  return (
    <>
      {initialLoad && (
        <div
          ref={divRef}
          className={`fixed w-screen h-screen flex flex-col items-center justify-center backdrop-blur-sm ${clickEnabled && assetsLoaded ? "cursor-pointer" : "cursor-default"
            }`}
          onClick={handleClick}
        >
          <p
            ref={textRef}
            className="max-w-[700px] text-center mx-0 text-[64px] leading-tight text-gray-800 font-semibold"
          >
            I create Architecture design & Software
          </p>
          <span
            ref={spanRef}
            className="w-full text-center text-gray-700 text-lg"
          >
            {assetsLoaded ? "Click anywhere to continue" : "Loading..."}
          </span>
        </div>
      )}
    </>
  );
}