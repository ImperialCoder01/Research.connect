import { useState, useEffect } from 'react';

/**
 * Animate a number counting up from 0 to a target value.
 * Supports both target/duration parameters and returning the raw count.
 */
export function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === undefined || target === null) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) {
      setCount(0);
      return;
    }
    if (start === end) {
      setCount(end);
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration]);

  return count;
}
