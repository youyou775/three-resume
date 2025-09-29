import React, { useState, useEffect } from 'react';
import { useScrollStore } from '../store/scrollStore';
import Three from './stages/Three';
import About from './stages/About';
import SidePane from './stages/SidePane';
import Contact from './stages/Contact';
import { useScrollBehavior } from '../hooks/scrollBehavior';

const Scene: React.FC = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const {
    scrollIndex,
    scrollProgress,
    setSectionCount,
    setIntro: setStoreIntro
  } = useScrollStore();

  useScrollBehavior();

  useEffect(() => {
    setSectionCount(4); // Fiserv, Conix, Modern Academy, Contact
  }, [setSectionCount]);

  useEffect(() => {
    setStoreIntro(isInitialLoad);
    document.body.style.height = isInitialLoad ? '100vh' : '500vh'; // 4 sections + about = 5 * 100vh
  }, [isInitialLoad]);

  return (
    <>
      <Three progress={scrollProgress} scrollIndex={scrollIndex} />
      {scrollIndex === 0 && (
        <About isInitialLoad={isInitialLoad} onContinue={() => setIsInitialLoad(false)} />
      )}
      {scrollIndex > 0 && scrollIndex < 4 && <SidePane />}
      {scrollIndex === 4 && <Contact />}
    </>
  );
};

export default Scene;