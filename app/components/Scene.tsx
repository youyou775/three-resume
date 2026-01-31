import React, { useState, useEffect } from 'react';
import { useScrollStore } from '../store/scrollStore';
import Three from './stages/Three';
import WelcomeOverlay from './stages/WelcomeOverlay';
import SidePaneOverlay from './stages/SidePaneOverlay';
import Contact from './stages/Contact';
import { useScrollBehavior } from '../hooks/scrollBehavior';
import SidePaneMobile from './stages/SidePaneMobile';
import { useAppStateStore } from '../store/appStateStore';
import AppLoadingScreen from './AppLoadingScreen';
import { useMobileDetection } from '../hooks/useMobileDetection';

const Scene: React.FC = () => {
  const { initialLoad, setIsMobile } = useAppStateStore();
  const { scrollIndex, setSectionCount, setIntro } = useScrollStore();

  useScrollBehavior();
  const isMobile = useMobileDetection();

  useEffect(() => {
    setIsMobile(isMobile);

    setSectionCount(5);
    
    setIntro(initialLoad);
    document.body.style.height = initialLoad ? "100vh" : `${5 * 100}vh`; // sections + buffer
    
  }, [initialLoad]);

  return (
    <>
      <AppLoadingScreen />
      <Three />

      {scrollIndex === 0 && ( <WelcomeOverlay /> )}

      {scrollIndex > 0 && scrollIndex < 4 && (
        <>
          {window.innerWidth < 768 ? <SidePaneMobile /> : <SidePaneOverlay />}
        </>
      )}

      {scrollIndex === 4 && <Contact />}
    </>
  );
};

export default Scene;