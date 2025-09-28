import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ScrollStore {
  // State
  scrollIndex: number;
  scrollProgress: number;
  activeScene: number;
  totalSections: number;
  isIntro: boolean;
  
  // Actions
  setScrollData: (data: { scrollIndex: number; scrollProgress: number; activeScene: number }) => void;
  setTotalSections: (total: number) => void;
  setIntro: (intro: boolean) => void;
  goToSection: (index: number) => void;
  
  // Internal state
  _isScrolling: boolean;
  _setScrolling: (scrolling: boolean) => void;
}

export const useScrollStore = create<ScrollStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    scrollIndex: 0,
    scrollProgress: 0,
    activeScene: -1,
    totalSections: 0,
    isIntro: true,
    _isScrolling: false,

    // Actions
    setScrollData: (data) => set(data),
    
    setTotalSections: (total) => set({ totalSections: total }),
    
    setIntro: (intro) => set({ isIntro: intro }),
    
    goToSection: (index) => {
      const { totalSections, _isScrolling } = get();
      
      // Prevent multiple rapid calls
      if (_isScrolling) return;
      
      set({ _isScrolling: true });
      
      const totalSegments = totalSections + 1;
      const totalScrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const segment = totalScrollable / totalSegments;
      const targetY = Math.round(segment * index);
      
      window.scrollTo({ 
        top: targetY, 
        behavior: 'smooth' 
      });
      
      // Reset scrolling flag after animation
      setTimeout(() => set({ _isScrolling: false }), 1000);
    },
    
    _setScrolling: (scrolling) => set({ _isScrolling: scrolling }),
  }))
);

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