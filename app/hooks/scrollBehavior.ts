import React from "react";
import { useScrollStore } from "../store/scrollStore";

// Custom hook for scroll behavior setup
export const useScrollBehavior = () => {
  const { isIntro, totalSections, setScrollData } = useScrollStore();

  React.useEffect(() => {
    if (isIntro) return;

    const handleScroll = () => {
      const totalSegments = totalSections + 1;
      const totalScrollable = document.body.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const segment = totalScrollable / totalSegments;
      const raw = scrollY / segment;
      
      let index = Math.floor(raw);
      if (index < 0) index = 0;
      if (index > totalSections) index = totalSections;

      const progress = Math.min(1, Math.max(0, raw - index));
      
      setScrollData({
        scrollIndex: index,
        scrollProgress: progress,
        activeScene: index - 1,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isIntro, totalSections, setScrollData]);
};