"use client";

import { useState } from "react";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";

// Key categories for the embed widget
const EMBED_SLUGS = [
  "healthcare-transfers",
  "national-defence",
  "housing-infrastructure",
  "environment-climate",
  "seniors-oas-gis",
  "debt-interest",
];

const EMBED_CATEGORIES = BUDGET_CATEGORIES.filter((c) =>
  EMBED_SLUGS.includes(c.slug)
);

export function EmbedAllocator() {
  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    EMBED_CATEGORIES.forEach((cat) => {
      initial[cat.slug] = 0;
    });
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = Object.values(allocations).reduce((s, v) => s + v, 0);
  const remaining = Math.max(0, 100 - total);
  const isValid = Math.abs(total - 100) < 0.5;

  function handleSlider(slug: string, val: number) {
    setAllocations((prev) => ({ ...prev, [slug]: val }));
  }

  async function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      // Distribute any rounding remainder to biggest category
      const items = Object.entries(allocations)
        .filter(([, pct]) => pct > 0)
        .map(([slug, percentage]) => ({
          category_id: slug,
          percentage,
        }));

      // Add unallocated categories from the full 14 at 0%
      // (API expects items for the categories that have allocation)
      const res = await fetch("/api/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        setError(result.error || "Submission failed");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-2xl font-heading font-bold text-gov-navy mb-2">
          Your voice has been recorded.
        </div>
        <p className="text-sm text-gov-text/70 mb-4">
          See the full results with all 14 categories.
        </p>
        <a
          href="https://wechoose-two.vercel.app/results"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-6 py-2 text-sm font-bold cursor-pointer transition-colors"
        >
          See Full Results
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className={isValid ? "text-diff-positive font-bold" : "text-gov-text/70"}>
            {total.toFixed(0)}% allocated
          </span>
          {!isValid && (
            <span className="text-gov-text/50">{remaining.toFixed(0)}% remaining</span>
          )}
        </div>
        <div className="h-2 bg-gov-well-border/30 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isValid ? "bg-diff-positive" : "bg-people-blue"
            }`}
            style={{ width: `${Math.min(total, 100)}%` }}
          />
        </div>
      </div>

      {/* Category sliders */}
      <div className="space-y-3">
        {EMBED_CATEGORIES.map((cat) => (
          <div key={cat.slug}>
            <div className="flex justify-between text-sm mb-0.5">
              <span className="font-bold text-gov-text">{cat.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gov-text/50">
                  Gov: {cat.actual_percentage.toFixed(1)}%
                </span>
                <span className="text-sm font-bold text-people-blue w-10 text-right">
                  {allocations[cat.slug]}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={allocations[cat.slug]}
              onChange={(e) => handleSlider(cat.slug, Number(e.target.value))}
              className="w-full h-2 accent-people-blue cursor-pointer"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-gov-red mt-3">{error}</p>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="bg-gov-navy text-white px-8 py-2.5 font-bold cursor-pointer hover:bg-gov-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit My Budget"}
        </button>
        {!isValid && total > 0 && (
          <p className="text-xs text-gov-red mt-2">
            Must add up to exactly 100%. Currently at {total.toFixed(0)}%.
          </p>
        )}
      </div>
    </div>
  );
}
