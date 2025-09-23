import { useEffect, useState } from "react";

export function useScrollScene(totalScenes: number, intro: boolean) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(-1);

  useEffect(() => {
    if (intro) return;

    function onScroll() {
      const totalSegments = totalScenes + 1;
      const totalScrollable = document.body.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const segment = totalScrollable / totalSegments;

      const raw = scrollY / segment;
      let index = Math.max(0, Math.min(totalScenes, Math.floor(raw)));
      const progress = Math.min(1, Math.max(0, raw - index));

      setScrollIndex(index);
      setScrollProgress(progress);
      setActiveScene(index - 1);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [intro, totalScenes]);

  return { scrollIndex, scrollProgress, activeScene };
}
