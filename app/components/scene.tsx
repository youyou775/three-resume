import React, { useState, useEffect } from 'react';
import ThreeStage from './stages/Three';
import IntroStage from './stages/Intro';
import AboutStage from './stages/About';
import SidePane from './stages/SidePane';
import Header from './stages/Header';
import Footer from './Footer';
import { useGLTFAssets } from './SceneLoader';

export type HeaderFooterAlign = 'left' | 'center' | 'right';

const Scene: React.FC = () => {
  const { gltfs, ready } = useGLTFAssets();
  const [intro, setIntro] = useState(true);
  const [activeScene, setActiveScene] = useState(-1);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0); // new

  const [headerFooterTransparent, setHeaderFooterTransparent] = useState(true);
  const [headerFooterAlign, setHeaderFooterAlign] = useState<HeaderFooterAlign>('center');

  useEffect(() => {
    document.body.style.height = intro ? '100vh' : `${(gltfs.length + 1) * 100}vh`;
    return () => { document.body.style.height = ''; };
  }, [intro, gltfs.length]);

  useEffect(() => {
    if (intro) return;
    function onScroll() {
      const totalSegments = gltfs.length + 1;
      const totalScrollable = document.body.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const segment = totalScrollable / totalSegments;
      // raw fractional index, e.g. 0.0 .. N
      const raw = scrollY / segment;
      let index = Math.floor(raw);
      if (index < 0) index = 0;
      if (index > gltfs.length) index = gltfs.length;

      const progress = Math.min(1, Math.max(0, raw - index));
      // console.log('progress', progress);
      setScrollIndex(index);
      setScrollProgress(progress);
      setActiveScene(index - 1);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener('scroll', onScroll);
  }, [intro, gltfs.length]);

  const handleIntroContinue = () => {
    setIntro(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const getAlignStyle = () => {
    if (headerFooterAlign === 'left') return { justifyContent: 'flex-start', textAlign: 'left' as React.CSSProperties['textAlign'], paddingLeft: 32 };
    if (headerFooterAlign === 'right') return { justifyContent: 'flex-end', textAlign: 'right' as React.CSSProperties['textAlign'], paddingRight: 32 };
    return { justifyContent: 'center', textAlign: 'center' as React.CSSProperties['textAlign'] };
  };

  // camera configs
  const aboutCamera = {
    position: [5.350, 4.100, -0.871] as [number, number, number],
    lookAt: [0.069, 2.928, -1.892] as [number, number, number],
    fov: 35,
  };

  // derive modelCamera from active gltf camera when available, fallback to aboutCamera
  const modelCamera = (() => {
    const g = gltfs[Math.max(0, scrollIndex === 0 ? 0 : activeScene)];
    if (g?.cameras?.[0]?.position) {
      const p = g.cameras[0].position;
      // get target fallback — use About target or stored value
      return {
        position: [11.118, 2.794, 7.675] as [number, number, number],
        lookAt: [1.364, 2.331, -2.716] as [number, number, number],
        fov: aboutCamera.fov,
      };
    }
    return aboutCamera;
  })();

  // Determine width and zoom based on scrollIndex
  const threeWidth = scrollIndex === 0 ? '100vw' : '70vw';
  const zoom = scrollIndex === 0;

  return (
    <>
      {/* Loading screen */}
      {!ready && (
        <div style={{
          color: '#fff',
          background: '#111',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Loading 3D assets...
        </div>
      )}

      {/* Intro page */}
      {intro && (<IntroStage onClick={handleIntroContinue} />)}

      {/* Main scrollable area */}
      {!intro && (
        <>
          <Header
            headerFooterTransparent={headerFooterTransparent}
            setHeaderFooterTransparent={setHeaderFooterTransparent}
            headerFooterAlign={headerFooterAlign}
            setHeaderFooterAlign={setHeaderFooterAlign}
            getAlignStyle={getAlignStyle}
          />

          {/* Fixed ThreeStage container, transitions width and zoom */}
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 32,
              width: '100vw', // Always 100vw
              height: 'calc(100vh - 64px)',
              zIndex: 0,
              background: 'var(--background, #fff)',
              boxShadow: scrollIndex >= 1 ? '2px 0 8px rgba(0,0,0,0.04)' : undefined,
              transition: `
                box-shadow 0.7s cubic-bezier(.77,0,.18,1),
                background 0.7s cubic-bezier(.77,0,.18,1)
              `,
              pointerEvents: 'auto',
            }}
          >
            <ThreeStage
              gltf={gltfs[scrollIndex === 0 ? 0 : activeScene]}
              show={scrollIndex === 0 || activeScene >= 0}
              cameraA={aboutCamera}
              cameraB={modelCamera}
              progress={scrollProgress} // when index 0 -> interpolate to 1; otherwise fully at model
              scrollIndex={scrollIndex}
            />
          </div>

          {/* Overlay About text only on about page */}
          {scrollIndex === 0 && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: 32,
              width: '100vw',
              height: 'calc(100vh - 64px)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#222',
              pointerEvents: 'auto',
              background: 'rgba(255,255,255,0.0)',
            }}>
              <AboutStage />
            </div>
          )}

          {/* SidePane only on main content pages */}
          {scrollIndex >= 1 && (
            <div
              style={{
                position: 'fixed', // REMOVE or change to 'relative'
                // top: 32,          // REMOVE
                // right: 0,         // REMOVE
                width: '30vw',
                minHeight: 'calc(100vh - 64px)', // Use minHeight for scrollable content
                overflowY: 'auto',
                background: 'var(--color-background, #fafafa)',
                zIndex: 2, // Lower zIndex since it's not overlaying
                padding: 32,
                transform: activeScene >= 0 ? 'translateX(0)' : 'translateX(100%)',
                opacity: activeScene >= 0 ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(.77,0,.18,1), opacity 0.7s cubic-bezier(.77,0,.18,1)',
                pointerEvents: activeScene >= 0 ? 'auto' : 'none',
                boxShadow: '-2px 0 8px rgba(0,0,0,0.04)',
                marginLeft: '70vw',
              }}
            >
              <SidePane />
            </div>
          )}

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