"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { BUDGET_CATEGORIES, TOTAL_SPENDING_BILLIONS } from "@/lib/data/budget-categories";
import { calculateTotalTax } from "@/lib/actions/tax-calculator";
import { formatDollars } from "@/lib/utils";
import { PrivacyNote } from "@/components/shared/privacy-note";
import type { IncomeBracket, TaxCalculationResult } from "@/types";

const INCOME_MIDPOINTS: Record<IncomeBracket, number> = {
  "under-30k": 22000,
  "30-50k": 40000,
  "50-75k": 62500,
  "75-100k": 87500,
  "100-150k": 125000,
  "150k+": 200000,
};

const INCOME_LABELS: Record<IncomeBracket, string> = {
  "under-30k": "Under $30K",
  "30-50k": "$30-50K",
  "50-75k": "$50-75K",
  "75-100k": "$75-100K",
  "100-150k": "$100-150K",
  "150k+": "$150K+",
};

const WORKING_DAYS_PER_YEAR = 260;

interface YourTaxDollarsProps {
  incomeBracket: IncomeBracket;
  province: string | null;
  userAllocations: Record<string, number>;
}

export function YourTaxDollars({
  incomeBracket,
  province,
  userAllocations,
}: YourTaxDollarsProps) {
  const [taxResult, setTaxResult] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function compute() {
      const income = INCOME_MIDPOINTS[incomeBracket];
      const prov = province || "ON"; // default to Ontario
      try {
        const result = await calculateTotalTax(income, prov);
        setTaxResult(result);
      } catch (err) {
        console.error("[YourTaxDollars] error:", err);
      } finally {
        setLoading(false);
      }
    }
    compute();
  }, [incomeBracket, province]);

  if (loading) {
    return (
      <div className="mt-8 text-center text-gov-text/50 text-sm animate-pulse">
        Calculating your tax breakdown...
      </div>
    );
  }

  if (!taxResult) return null;

  const totalTax = taxResult.total_tax;
  const effectiveRate = taxResult.effective_rate;
  const totalTaxDays = Math.round(effectiveRate * WORKING_DAYS_PER_YEAR);
  const taxFreedomDayNum = Math.round(effectiveRate * 365);

  // Calculate Tax Freedom Day as a calendar date
  const jan1 = new Date(new Date().getFullYear(), 0, 1);
  const taxFreedomDate = new Date(
    jan1.getTime() + taxFreedomDayNum * 24 * 60 * 60 * 1000
  );
  const taxFreedomFormatted = taxFreedomDate.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
  });

  // Per-category breakdown
  const categories = BUDGET_CATEGORIES.map((cat) => {
    const govPct = cat.actual_percentage / 100;
    const userPct = (userAllocations[cat.slug] ?? 0) / 100;
    const govDollars = totalTax * govPct;
    const userDollars = totalTax * userPct;
    const govDays = totalTaxDays * govPct;
    const userDays = totalTaxDays * userPct;
    return {
      name: cat.name,
      slug: cat.slug,
      govDollars,
      userDollars,
      diff: userDollars - govDollars,
      govDays,
      userDays,
      daysDiff: userDays - govDays,
    };
  }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  // Find the most dramatic stat for sharing
  const biggest = categories[0];
  const shareText = biggest
    ? `I work ${biggest.govDays.toFixed(1)} days a year paying for ${biggest.name}. Under my budget, it'd be ${biggest.userDays.toFixed(1)} days. WeChoose: wechoose-two.vercel.app`
    : "";

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-heading font-bold mb-1">
        Your Tax Dollars
      </h2>
      <PrivacyNote variant="compact" className="mb-4" />

      {/* Tax Freedom Day hero */}
      <div className="bg-gov-navy text-white p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-white/60 uppercase tracking-wide">
              Your Total Tax
            </p>
            <p className="text-3xl font-heading font-bold mt-1">
              {formatDollars(totalTax)}
            </p>
            <p className="text-xs text-white/50 mt-1">
              ~{INCOME_LABELS[incomeBracket]} income
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/60 uppercase tracking-wide">
              Working Days on Taxes
            </p>
            <p className="text-3xl font-heading font-bold mt-1">
              {totalTaxDays} days
            </p>
            <p className="text-xs text-white/50 mt-1">
              {(effectiveRate * 100).toFixed(1)}% of the year
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/60 uppercase tracking-wide">
              Tax Freedom Day
            </p>
            <p className="text-3xl font-heading font-bold mt-1">
              {taxFreedomFormatted}
            </p>
            <p className="text-xs text-white/50 mt-1">
              Every dollar after this is yours
            </p>
          </div>
        </div>
        <p className="text-xs text-white/40 text-center mt-4">
          Estimate based on your income bracket. We never store your exact income.
        </p>
      </div>

      {/* Per-category breakdown */}
      <h3 className="text-lg font-heading font-bold mb-3">
        Where each working day goes
      </h3>
      <div className="space-y-2 mb-4">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="bg-white border border-gov-well-border p-3"
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-sm font-bold text-gov-text">{cat.name}</h4>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 ${
                  cat.diff > 10
                    ? "text-diff-positive bg-diff-positive/10"
                    : cat.diff < -10
                    ? "text-diff-negative bg-diff-negative/10"
                    : "text-gov-text/50"
                }`}
              >
                {cat.diff > 0 ? "+" : ""}
                {formatDollars(cat.diff)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-gov-text/50">Government</span>
                <p className="font-semibold text-gov-red">
                  {formatDollars(cat.govDollars)}{" "}
                  <span className="text-xs font-normal text-gov-text/40">
                    ({cat.govDays.toFixed(1)} days)
                  </span>
                </p>
              </div>
              <div>
                <span className="text-xs text-gov-text/50">Your budget</span>
                <p className="font-semibold text-people-blue">
                  {formatDollars(cat.userDollars)}{" "}
                  <span className="text-xs font-normal text-gov-text/40">
                    ({cat.userDays.toFixed(1)} days)
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shareable stat */}
      {biggest && <ShareableStat text={shareText} />}
    </div>
  );
}

function ShareableStat({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gov-well p-4 flex items-center justify-between gap-3">
      <p className="text-sm text-gov-text/70 italic flex-1">&ldquo;{text}&rdquo;</p>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-xs text-gov-link hover:text-gov-link-hover cursor-pointer bg-transparent border-0 p-0 shrink-0"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
