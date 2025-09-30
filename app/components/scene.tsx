import React, { useState, useEffect } from 'react';
import { useScrollStore } from '../store/scrollStore';
import Three from './stages/Three';
import About from './stages/About';
import SidePane from './stages/SidePane';
import Contact from './stages/Contact';
import { useScrollBehavior } from '../hooks/scrollBehavior';
import SidePaneMobile from './stages/SidePaneMobile';

const Scene: React.FC = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    scrollIndex,
    scrollProgress,
    setSectionCount,
    setIntro: setStoreIntro
  } = useScrollStore();

  useScrollBehavior();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setSectionCount(4); // Fiserv, Conix, Modern Academy, Contact
  }, [setSectionCount]);

  useEffect(() => {
    setStoreIntro(isInitialLoad);
    document.body.style.height = isInitialLoad ? '100vh' : '500vh';
  }, [isInitialLoad]);

  return (
    <>
      {/* Three.js Scene - Full screen on desktop, top half on mobile */}
      <div className={isMobile ? 'fixed top-0 w-screen h-1/2' : 'fixed w-screen h-screen'}>
        <Three progress={scrollProgress} scrollIndex={scrollIndex} />
      </div>

      {/* About Section */}
      {scrollIndex === 0 && (
        <About isInitialLoad={isInitialLoad} onContinue={() => setIsInitialLoad(false)} />
      )}

      {/* SidePane - Desktop: right side, Mobile: bottom half */}
      {scrollIndex > 0 && scrollIndex < 4 && (
        <>
          {isMobile ? (
            <SidePaneMobile />
          ) : (
            <SidePane />
          )}
        </>
      )}

      {/* Contact */}
      {scrollIndex === 4 && <Contact />}
    </>
  );
};

export default Scene;