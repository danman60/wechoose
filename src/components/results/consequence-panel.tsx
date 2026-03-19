"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";
import { getConsequenceForAllocation } from "@/lib/data/consequences";

interface ConsequencePanelProps {
  userAllocations: Record<string, number>;
}

export function ConsequencePanel({ userAllocations }: ConsequencePanelProps) {
  const [expanded, setExpanded] = useState(false);

  // Get consequences for significant deviations
  const consequences = BUDGET_CATEGORIES.map((cat) => {
    const userPct = userAllocations[cat.slug] ?? 0;
    const govPct = cat.actual_percentage;
    const text = getConsequenceForAllocation(cat.slug, userPct, govPct);
    return {
      name: cat.name,
      slug: cat.slug,
      userPct,
      govPct,
      text,
      isZero: userPct === 0,
      isDouble: userPct >= govPct * 1.8,
    };
  }).filter((c) => c.text !== null);

  if (consequences.length === 0) return null;

  return (
    <div className="mt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-lg font-heading font-bold text-gov-navy cursor-pointer bg-transparent border-0 p-0 hover:text-gov-link-hover transition-colors"
      >
        What would actually happen?
        {expanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      <p className="text-sm text-gov-text/60 mt-1 mb-4">
        Real-world consequences of your budget choices.
      </p>

      {expanded && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {consequences.map((c) => (
            <div
              key={c.slug}
              className={`p-4 border-l-4 ${
                c.isZero
                  ? "border-diff-negative bg-diff-negative/5"
                  : c.isDouble
                  ? "border-diff-positive bg-diff-positive/5"
                  : c.userPct > c.govPct
                  ? "border-people-blue bg-people-blue/5"
                  : "border-gov-red bg-gov-red/5"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-bold text-gov-text">{c.name}</h4>
                <span className="text-xs text-gov-text/60">
                  You: {c.userPct.toFixed(1)}% | Gov: {c.govPct.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gov-text/80 leading-relaxed">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
