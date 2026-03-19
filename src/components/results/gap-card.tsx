"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";

interface GapCardsProps {
  userAllocations: Record<string, number>;
}

export function GapCards({ userAllocations }: GapCardsProps) {
  const gaps = BUDGET_CATEGORIES.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    userPct: userAllocations[cat.slug] ?? 0,
    govPct: cat.actual_percentage,
    gap: (userAllocations[cat.slug] ?? 0) - cat.actual_percentage,
  }))
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, 3);

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-4">
        Your Biggest Gaps vs. Government
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gaps.map((gap) => (
          <GapCardItem key={gap.slug} gap={gap} />
        ))}
      </div>
    </div>
  );
}

function GapCardItem({
  gap,
}: {
  gap: {
    name: string;
    slug: string;
    userPct: number;
    govPct: number;
    gap: number;
  };
}) {
  const [copied, setCopied] = useState(false);

  const shareText = `I think ${gap.name} deserves ${gap.userPct.toFixed(
    1
  )}% of Canada's budget. The government gives it ${gap.govPct.toFixed(
    1
  )}%. That's a ${Math.abs(gap.gap).toFixed(1)}% gap. WeChoose: wechoose-two.vercel.app`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gov-well border-t-4 border-gov-navy p-4 flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-gov-text mb-2">{gap.name}</h4>
        <p className="text-sm text-gov-text/70 leading-relaxed">
          I think {gap.name} deserves{" "}
          <span className="font-bold text-people-blue">
            {gap.userPct.toFixed(1)}%
          </span>
          . The government gives it{" "}
          <span className="font-bold text-gov-red">
            {gap.govPct.toFixed(1)}%
          </span>
          .
        </p>
        <p className="text-xl font-bold mt-2">
          <span
            className={
              gap.gap > 0 ? "text-diff-positive" : "text-diff-negative"
            }
          >
            {gap.gap > 0 ? "+" : ""}
            {gap.gap.toFixed(1)}% gap
          </span>
        </p>
      </div>
      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 text-xs text-gov-link hover:text-gov-link-hover cursor-pointer bg-transparent border-0 p-0"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy share text
          </>
        )}
      </button>
    </div>
  );
}
