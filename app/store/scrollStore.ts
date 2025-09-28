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
  setSectionCount: (total: number) => void;
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
    
    setSectionCount: (total) => set({ totalSections: total }),
    
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