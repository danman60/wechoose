"use client";

import { useEffect, useState } from "react";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";

interface NeedleAnimationProps {
  userAllocations: Record<string, number>;
  onComplete: () => void;
}

interface ShiftData {
  name: string;
  slug: string;
  before: number;
  after: number;
  shift: number;
}

export function NeedleAnimation({
  userAllocations,
  onComplete,
}: NeedleAnimationProps) {
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [animating, setAnimating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch pre and post aggregates
    async function fetchShifts() {
      try {
        const res = await fetch("/api/aggregate");
        const data = await res.json();
        const total = data.totalAllocations || 1;

        // Calculate what the average was before this vote and after
        // Since the vote is already submitted, current aggregates include it
        // We can estimate the pre-vote average: (current * total - user) / (total - 1)
        const shiftData: ShiftData[] = [];

        for (const cat of BUDGET_CATEGORIES) {
          const currentAvg =
            data.aggregates?.find(
              (a: { category_slug: string }) => a.category_slug === cat.slug
            )?.average_percentage ?? cat.actual_percentage;

          const userPct = userAllocations[cat.slug] ?? 0;

          // Estimate pre-vote average
          const preAvg =
            total > 1
              ? (currentAvg * total - userPct) / (total - 1)
              : cat.actual_percentage;

          const shift = currentAvg - preAvg;

          if (Math.abs(shift) > 0.01) {
            shiftData.push({
              name: cat.name,
              slug: cat.slug,
              before: preAvg,
              after: currentAvg,
              shift,
            });
          }
        }

        // Sort by absolute shift, take top 5
        shiftData.sort((a, b) => Math.abs(b.shift) - Math.abs(a.shift));
        setShifts(shiftData.slice(0, 5));
        setLoaded(true);

        // Start animation after a beat
        setTimeout(() => setAnimating(true), 300);

        // Auto-complete after animation
        setTimeout(() => onComplete(), 4000);
      } catch {
        // On error, just continue
        onComplete();
      }
    }

    fetchShifts();
  }, []);

  if (!loaded) {
    return (
      <div className="text-center py-16">
        <div className="text-3xl font-heading font-bold text-gov-navy mb-4">
          Your voice has been recorded.
        </div>
        <p className="text-lg text-gov-text/70 animate-pulse">
          Calculating your impact...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="text-3xl font-heading font-bold text-gov-navy mb-2">
        Your vote moved the needle.
      </div>
      <p className="text-base text-gov-text/60 mb-8">
        Here&apos;s how your voice shifted the national average.
      </p>

      <div className="max-w-[600px] mx-auto space-y-4 text-left">
        {shifts.map((s, i) => (
          <div
            key={s.slug}
            className="transition-all duration-700"
            style={{
              opacity: animating ? 1 : 0,
              transform: animating ? "translateX(0)" : "translateX(-20px)",
              transitionDelay: `${i * 150}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-gov-text">{s.name}</span>
              <span
                className={`text-sm font-bold ${
                  s.shift > 0 ? "text-diff-positive" : "text-diff-negative"
                }`}
              >
                {s.shift > 0 ? "+" : ""}
                {s.shift.toFixed(2)}%
              </span>
            </div>
            <div className="h-6 bg-gov-well-border/30 overflow-hidden relative">
              {/* Before bar */}
              <div
                className="h-full bg-gov-navy/30 absolute top-0 left-0 transition-all duration-1000"
                style={{ width: `${Math.min(s.before * 3, 100)}%` }}
              />
              {/* After bar */}
              <div
                className="h-full bg-people-blue absolute top-0 left-0 transition-all duration-1000 ease-out"
                style={{
                  width: animating
                    ? `${Math.min(s.after * 3, 100)}%`
                    : `${Math.min(s.before * 3, 100)}%`,
                  transitionDelay: `${i * 150 + 300}ms`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gov-text/50 mt-0.5">
              <span>{s.before.toFixed(1)}% before</span>
              <span>{s.after.toFixed(1)}% after</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gov-text/50 mt-8 animate-pulse">
        Redirecting to full results...
      </p>
    </div>
  );
}
