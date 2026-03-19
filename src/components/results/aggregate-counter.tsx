"use client";

import { useEffect, useState } from "react";

export function AggregateCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setCount(current);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="text-center">
      <div className="text-5xl md:text-6xl font-heading font-bold text-gov-navy">
        {count.toLocaleString()}
      </div>
      <div className="text-lg text-gov-text/60 mt-1">
        Canadians have weighed in
      </div>
    </div>
  );
}
