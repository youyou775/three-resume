"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !ctaRef.current) return;

    // Initial state - hidden
    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
      opacity: 0,
      y: 50
    });

    // Animate in sequence
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4")
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed  h-screen flex flex-col items-center justify-center bg-orange-200/55"
    >
      <div className=" w-screen h-screen flex flex-col items-center justify-center text-gray-800 pointer-events-auto">
        <div className="text-center  p-4">
          <h1 
            ref={titleRef}
            className="text-6xl font-bold mb-6"
          >
            Let's Work Together
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl text-gray-600 mb-12 max-w-[600px]"
          >
            Ready to bring your architecture or software project to life? 
            I'd love to hear about your ideas and discuss how we can collaborate.
          </p>
          
          <div ref={ctaRef} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:your.email@example.com"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Get In Touch
              </a>
              
              <a
                href="/Youssef_Abouelghar.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-black bg-white border-2 border-black rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                View Resume
              </a>
            </div>
            
            <div className="flex justify-center space-x-6 text-gray-500">
              <a 
                href="https://www.linkedin.com/in/youssef-abouelghar-a13066111/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/youyou775" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors duration-200"
              >
                GitHub
              </a>
              <a 
                href="/YA-Portfolio.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors duration-200"
              >
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}