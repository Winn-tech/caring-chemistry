import { useEffect, useState } from "react";

export function useCountUp(target: number, shouldStart: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const startTime = performance.now();
    let animationFrame = 0;

    const update = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, shouldStart, target]);

  return count;
}
