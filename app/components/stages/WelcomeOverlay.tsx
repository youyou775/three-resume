"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppStateStore } from "@/app/store/appStateStore";


export default function WelcomeOverlay() {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickEnabled, setClickEnabled] = useState(false);

  const { initialLoad, assetsLoaded, setInitialLoad } = useAppStateStore();

  useEffect(() => {
    // Only animate when both initialLoad is true AND assets are ready
    if (!(initialLoad && assetsLoaded && nameRef.current && titleRef.current && summaryRef.current && buttonRef.current)) return;

    gsap.set([nameRef.current, titleRef.current, summaryRef.current, buttonRef.current], {
      opacity: 0,
      y: 50
    });
    const tl = gsap.timeline({ ease: "power2.out"});

    tl.to(
      nameRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 1,
      }
    ).to(
      titleRef.current,
      {
        y: 0,
        opacity: 1,
        delay: 0.5,
        duration: 1,
      }
    ).to(
      summaryRef.current,
      {
        y: 0,
        opacity: 1,
        delay: 0.5,
        duration: 2,
      },

    ).to(
      buttonRef.current,
      {
        opacity: 1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        onStart: () => setClickEnabled(true),
      },
    );

    return () => {
      tl.kill();
    };
  }, [initialLoad, assetsLoaded]); // Add isReady dependency

  const handleClick = () => {
    // Only allow click if ready and click is enabled
    if (!clickEnabled || !assetsLoaded) return;

    const tl = gsap.timeline({ onComplete: () => setInitialLoad(false), });

    tl.to(divRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.in",
    });
  };

  return (
    <>
      {initialLoad && (
        <div ref={divRef}
          className={`fixed w-screen h-screen flex flex-col items-center justify-center backdrop-blur-sm ${clickEnabled && assetsLoaded ? "cursor-pointer" : "cursor-default"
            }`}
          onClick={handleClick}
        >
          <p ref={nameRef}
            className="max-w-[1000px] text-center text-[42px] leading-tight text-gray-700 font-semibold">
            Hello, I'm <br /> YOUSSEF ABOUELGHAR
          </p>
          <p ref={titleRef}
            className="max-w-[1000px] text-center text-[48px] leading-tight text-gray-700 font-bold">
            Senior Full Stack Developer / 3D Computational Designer
          </p>
          <p ref={summaryRef}
            className="max-w-[1000px] text-center text-[32px] text-gray-700 mt-8 mx-2">
            A full stack developer with 7+ years of experience in front-end and back-end. Combined with 3D and
            graphic design.
          </p>
          <button ref={buttonRef}
            className="w-full text-center text-gray-700 text-lg cursor-pointer" >
            Click anywhere to explore my experience
          </button>
        </div>
      )}
    </>
  );
}