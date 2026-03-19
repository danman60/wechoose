"use client";

import { useEffect, useState, useRef } from "react";

interface LiveCounterProps {
  initialCount: number;
}

export function LiveCounter({ initialCount }: LiveCounterProps) {
  const [count, setCount] = useState(initialCount);
  const [displayCount, setDisplayCount] = useState(initialCount);
  const animationRef = useRef<number | null>(null);

  // Poll every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/aggregate");
        const data = await res.json();
        if (data.totalAllocations && data.totalAllocations !== count) {
          setCount(data.totalAllocations);
        }
      } catch {
        // ignore
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [count]);

  // Animate count changes
  useEffect(() => {
    if (displayCount === count) return;

    const start = displayCount;
    const end = count;
    const duration = 800;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayCount(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [count]);

  return (
    <p className="text-white/60 text-base">
      <span className="text-white/90 font-bold tabular-nums">
        {displayCount.toLocaleString()}
      </span>{" "}
      Canadians have weighed in so far.
    </p>
  );
}
