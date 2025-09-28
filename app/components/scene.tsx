import React, { useState, useEffect } from 'react';
import Three from './stages/Three';
import Intro from './stages/Intro';
import About from './stages/About';
import SidePane from './stages/SidePane';
import { useScrollStore, useScrollBehavior } from '../store/scrollStore';

const Scene: React.FC = () => {
  const [intro, setIntro] = useState(true);

  // Get scroll state and actions from store
  const {
    scrollIndex,
    scrollProgress,
    setTotalSections,
    setIntro: setStoreIntro
  } = useScrollStore();

  // Set up scroll behavior
  useScrollBehavior();

  // Update store when intro state changes
  useEffect(() => {
    setStoreIntro(intro);
  }, [intro, setStoreIntro]);

  // Set the number of sections (hardcoded since we know we have 3 projects)
  // Or this could come from a config file, API, etc.
  useEffect(() => {
    setTotalSections(3); // Fiserv, Conix, Modern Academy
  }, [setTotalSections]);

  // Set body height based on intro state
  useEffect(() => {
    document.body.style.height = intro ? '100vh' : '400vh'; // 3 sections + about = 4 * 100vh
    return () => { document.body.style.height = ''; };
  }, [intro]);

  const handleIntroContinue = () => {
    setIntro(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  return (
    <>
      {intro ? <Intro onClick={handleIntroContinue} /> : (
        <>
          <Three
            progress={scrollProgress}
            scrollIndex={scrollIndex}
          />
          {scrollIndex === 0 ? <About /> : <SidePane />}
        </>
      )}
    </>
  );
};

export default Scene;