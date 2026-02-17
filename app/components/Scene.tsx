import React from 'react';
import Three from './stages/Three';
import WelcomeOverlay from './stages/WelcomeOverlay';
import SidePaneOverlay from './stages/SidePaneOverlay';
import Contact from './stages/Contact';
import SidePaneMobile from './stages/SidePaneMobile';
import { useAppStateStore } from '../store/appStateStore';
import AppLoadingScreen from './AppLoadingScreen';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { useCameraAnimate } from '../hooks/useCameraAnimate';

const Scene: React.FC = () => {
  const { initialLoad, animationComplete, callToAction} = useAppStateStore();

  useMobileDetection();
  useCameraAnimate();

  return (
    <>
      <AppLoadingScreen />
      <Three />

      {initialLoad && (<WelcomeOverlay />)}

      {animationComplete && callToAction !== 1 && (
        <>
          {window.innerWidth < 768 ? <SidePaneMobile /> : <SidePaneOverlay />}
        </>
      )}

      {callToAction == 1 && <Contact />}
    </>
  );
};

export default Scene;