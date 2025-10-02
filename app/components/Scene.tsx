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
  const [assetsReady, setAssetsReady] = useState(false); // New state

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
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setSectionCount(5);
  }, [setSectionCount]);

  useEffect(() => {
    setStoreIntro(isInitialLoad);
    document.body.style.height = isInitialLoad
      ? "100vh"
      : `${5 * 100}vh`; // sections + buffer
  }, [isInitialLoad, setStoreIntro]);

  return (
    <>
      {/* Loading Screen - show until assets are ready */}
      {!assetsReady && (
        <div className="fixed w-screen h-screen z-50">
          <div className="text-white bg-gray-900 w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Loading 3D Experience...</p>
            </div>
          </div>
        </div>
      )}

      {/* Three.js Scene */}
      <div className={isMobile ? 'fixed top-0 w-screen h-1/2' : 'fixed w-screen h-screen'}>
        <Three
          progress={scrollProgress}
          scrollIndex={scrollIndex}
          onAssetsReady={() => setAssetsReady(true)}
        />
      </div>

      {/* About Section - only clickable when assets are ready */}
      {scrollIndex === 0 && (
        <About
          isInitialLoad={isInitialLoad}
          onContinue={() => setIsInitialLoad(false)}
          isReady={assetsReady} // Pass ready state to About
        />
      )}

      {/* SidePane */}
      {scrollIndex > 0 && scrollIndex < 4 && (
        <>
          {isMobile ? <SidePaneMobile /> : <SidePane />}
        </>
      )}

      {/* Contact */}
      {scrollIndex === 4 && <Contact />}
    </>
  );
};

export default Scene;