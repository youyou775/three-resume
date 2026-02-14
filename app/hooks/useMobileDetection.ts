import { useLayoutEffect } from 'react';
import { useAppStateStore } from '../store/appStateStore';

export const useMobileDetection = (breakpoint: number = 768) => {
  const { setIsMobile } = useAppStateStore();

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

};