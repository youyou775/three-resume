import React, { useState, useEffect } from 'react';
import ThreeStage from './stages/three';
import IntroStage from './stages/intro';
import AboutStage from './stages/about';
import SidePane from './stages/sidePane';
import Header from './stages/header';
import Footer from './footer';
import { useGLTFAssets } from './sceneLoader';

export type HeaderFooterAlign = 'left' | 'center' | 'right';


const Scene: React.FC = () => {
  // Use the hook for loading models and textures
  const { gltfs, ready } = useGLTFAssets();
  // Stage 1: Intro
  const [intro, setIntro] = useState(true);
  // Main layout state
  const [activeScene, setActiveScene] = useState(-1);

  const [headerFooterTransparent, setHeaderFooterTransparent] = useState(true);
  const [headerFooterAlign, setHeaderFooterAlign] = useState<HeaderFooterAlign>('center');

  // Set scrollable height: 1 segment for text, N for models
  useEffect(() => {
      document.body.style.height = intro ? '100vh': `${(gltfs.length + 1) * 100}vh`;
    return () => { document.body.style.height = ''; };
  }, [intro]);

  // Handle scroll: segment 0 = text, segment 1+ = models
  useEffect(() => {
    if (intro) return;
    function onScroll() {
      const totalSegments = gltfs.length + 1;
      const totalScrollable = document.body.scrollHeight - window.innerHeight;
      const segment = totalScrollable / totalSegments;
      let index = Math.floor( window.scrollY / segment);

      // Clamp index
      // if (index < 0) index = 0;
      if (index > gltfs.length) index = gltfs.length;
      // Stage 2&3: Show 3D canvas and right panel
        setActiveScene(index - 1);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [intro, gltfs.length]);

  // Smooth transition from intro to scroll area
  const handleIntroContinue = () => {
    setIntro(false);
    // setTimeout(() => setShowScrollArea(true), 10); // allow fade out
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  // Header/Footer alignment style
  const getAlignStyle = () => {
    if (headerFooterAlign === 'left') return { justifyContent: 'flex-start', textAlign: 'left' as React.CSSProperties['textAlign'], paddingLeft: 32 };
    if (headerFooterAlign === 'right') return { justifyContent: 'flex-end', textAlign: 'right' as React.CSSProperties['textAlign'], paddingRight: 32 };
    return { justifyContent: 'center', textAlign: 'center' as React.CSSProperties['textAlign'] };
  };

  return (
    <>
      {/* Optionally, show a loading screen until ready */}
      {!ready && (<div style={{ color: '#fff', background: '#111', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading 3D assets...</div>)}

      {/* --- Stage 1: Intro Page --- */}
      {intro && (<IntroStage onClick={handleIntroContinue} />)}

      {/* --- Stage 2 & 3: Scrollable Area --- */}
      {!intro && (
        <>
          {/* Header */}
          < Header
            headerFooterTransparent={headerFooterTransparent}
            setHeaderFooterTransparent={setHeaderFooterTransparent}
            headerFooterAlign={headerFooterAlign}
            setHeaderFooterAlign={setHeaderFooterAlign}
            getAlignStyle={getAlignStyle}
          />
          {/* Text Page (Stage 2) */}
          <AboutStage />
          {/* Three.js Canvas (Left Stage 3) */}
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 32,
              width: '70vw',
              height: 'calc(100vh - 64px)',
              zIndex: 0,
              background: 'var(--background, #fff)',
              boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
              transition: 'opacity 0.7s cubic-bezier(.77,0,.18,1)',
              opacity: activeScene >= 0 ? 1 : 0,
              pointerEvents: activeScene >= 0 ? 'auto' : 'none',
            }}
          >
            <ThreeStage gltf={gltfs[activeScene]} show={activeScene >= 0} />
          </div>
          {/* HTML Content (Right Stage 3) */}
          <div
            style={{
              marginLeft: '70vw',
              width: '30vw',
              height: 'calc(100vh - 64px)',
              overflowY: 'auto',
              background: 'var(--color-background, #fafafa)',
              zIndex: 2,
              position: 'relative',
              padding: 32,
              // Slide-in animation
              transform: activeScene >= 0 ? 'translateX(0)' : 'translateX(100%)',
              opacity: activeScene >= 0 ? 1 : 0,
              transition: 'transform 0.7s cubic-bezier(.77,0,.18,1), opacity 0.7s cubic-bezier(.77,0,.18,1)',
              pointerEvents: activeScene >= 0 ? 'auto' : 'none',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.04)',
            }}
          >
            <SidePane />
          </div>
          {/* Footer */}
          <Footer
            headerFooterTransparent={headerFooterTransparent}
            getAlignStyle={getAlignStyle}
          />
        </>
      )}
    </>
  );
};

export default Scene;