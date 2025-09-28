import React, { useState, useEffect } from 'react';
import { useScrollStore } from '../store/scrollStore';
import Three from './stages/three';
import About from './stages/about';
import SidePane from './stages/sidePane';
import { useScrollBehavior } from '../hooks/scrollBehavior';

const Scene: React.FC = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {
    scrollIndex,
    scrollProgress,
    setSectionCount: setSectionCount,
    setIntro: setStoreIntro
  } = useScrollStore();

  useScrollBehavior();

  useEffect(() => {
    setSectionCount(3); // Fiserv, Conix, Modern Academy
  }, [setSectionCount]);

  useEffect(() => {
    setStoreIntro(isInitialLoad);
    document.body.style.height = isInitialLoad ? '100vh' : '400vh'; // Lock height initially, then allow full scroll
  }, [isInitialLoad]);

  return (
    <>
      <Three progress={scrollProgress} scrollIndex={scrollIndex} />
      {scrollIndex === 0 ? <About isInitialLoad={isInitialLoad} onContinue={() => setIsInitialLoad(false)} /> : <SidePane />}
    </>
  );
};

export default Scene;