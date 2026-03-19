"use client";

import { useEffect, useState } from "react";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";
import { PrivacyNote } from "@/components/shared/privacy-note";
import type { AgeBracket, IncomeBracket } from "@/types";

const AGE_LABELS: Record<string, string> = {
  "18-24": "18-24 year olds",
  "25-34": "25-34 year olds",
  "35-44": "35-44 year olds",
  "45-54": "45-54 year olds",
  "55-64": "55-64 year olds",
  "65+": "Seniors (65+)",
};

const INCOME_LABELS: Record<string, string> = {
  "under-30k": "Under $30K earners",
  "30-50k": "$30-50K earners",
  "50-75k": "$50-75K earners",
  "75-100k": "$75-100K earners",
  "100-150k": "$100-150K earners",
  "150k+": "$150K+ earners",
};

interface DemoAgg {
  category_slug: string;
  average_percentage: number;
}

interface DemoResponse {
  aggregates: DemoAgg[];
  totalAllocations: number;
  belowThreshold: boolean;
  message?: string;
}

interface DemographicComparisonProps {
  ageBracket: AgeBracket | null;
  incomeBracket: IncomeBracket | null;
  nationalAggregates: Record<string, number>;
}

export function DemographicComparison({
  ageBracket,
  incomeBracket,
  nationalAggregates,
}: DemographicComparisonProps) {
  const [activeTab, setActiveTab] = useState<"age" | "income">(
    ageBracket ? "age" : "income"
  );
  const [ageData, setAgeData] = useState<DemoResponse | null>(null);
  const [incomeData, setIncomeData] = useState<DemoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const promises: Promise<void>[] = [];

      if (ageBracket) {
        promises.push(
          fetch(
            `/api/aggregate/demographics?dimension=age_bracket&value=${encodeURIComponent(ageBracket)}`
          )
            .then((r) => r.json())
            .then((d) => setAgeData(d))
            .catch(() => {})
        );
      }

      if (incomeBracket) {
        promises.push(
          fetch(
            `/api/aggregate/demographics?dimension=income_bracket&value=${encodeURIComponent(incomeBracket)}`
          )
            .then((r) => r.json())
            .then((d) => setIncomeData(d))
            .catch(() => {})
        );
      }

      await Promise.all(promises);
      setLoading(false);
    }

    fetchData();
  }, [ageBracket, incomeBracket]);

  if (!ageBracket && !incomeBracket) return null;
  if (loading) {
    return (
      <div className="mt-8 text-center text-gov-text/50 text-sm animate-pulse">
        Loading demographic comparisons...
      </div>
    );
  }

  const tabs = [];
  if (ageBracket) tabs.push({ key: "age" as const, label: "By Age" });
  if (incomeBracket) tabs.push({ key: "income" as const, label: "By Income" });

  const currentData = activeTab === "age" ? ageData : incomeData;
  const groupLabel =
    activeTab === "age"
      ? AGE_LABELS[ageBracket ?? ""] ?? ageBracket
      : INCOME_LABELS[incomeBracket ?? ""] ?? incomeBracket;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-heading font-bold mb-1">
        How People Like You Voted
      </h2>
      <PrivacyNote variant="compact" className="mb-4" />

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-bold cursor-pointer border transition-all ${
                activeTab === tab.key
                  ? "bg-gov-navy text-white border-gov-navy"
                  : "bg-white text-gov-text/70 border-gov-well-border hover:border-gov-navy/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {currentData?.belowThreshold ? (
        <div className="bg-gov-well p-4 text-sm text-gov-text/60">
          <p>
            {currentData.message ||
              "Not enough responses in this group yet. We need at least 3 to protect anonymity."}
          </p>
          <p className="mt-1">
            {currentData.totalAllocations} response
            {currentData.totalAllocations !== 1 ? "s" : ""} so far in this
            group.
          </p>
        </div>
      ) : currentData && currentData.aggregates.length > 0 ? (
        <div>
          <p className="text-sm text-gov-text/60 mb-3">
            Based on{" "}
            <strong>{currentData.totalAllocations} anonymous responses</strong>{" "}
            from {groupLabel}.
          </p>

          {/* Show biggest divergences from national */}
          <DivergenceList
            demoAggregates={currentData.aggregates}
            nationalAggregates={nationalAggregates}
            groupLabel={groupLabel ?? "this group"}
          />
        </div>
      ) : (
        <div className="bg-gov-well p-4 text-sm text-gov-text/60">
          No data available for this demographic yet. Be one of the first to
          contribute.
        </div>
      )}
    </div>
  );
}

function DivergenceList({
  demoAggregates,
  nationalAggregates,
  groupLabel,
}: {
  demoAggregates: DemoAgg[];
  nationalAggregates: Record<string, number>;
  groupLabel: string;
}) {
  const demoMap: Record<string, number> = {};
  for (const agg of demoAggregates) {
    demoMap[agg.category_slug] = agg.average_percentage;
  }

  const divergences = BUDGET_CATEGORIES.map((cat) => {
    const demoPct = demoMap[cat.slug] ?? 0;
    const natPct = nationalAggregates[cat.slug] ?? 0;
    const govPct = cat.actual_percentage;
    return {
      name: cat.name,
      slug: cat.slug,
      demoPct,
      natPct,
      govPct,
      divergence: demoPct - natPct,
    };
  })
    .filter((d) => d.demoPct > 0)
    .sort((a, b) => Math.abs(b.divergence) - Math.abs(a.divergence));

  const maxPct = Math.max(
    ...divergences.map((d) => Math.max(d.demoPct, d.natPct, d.govPct)),
    1
  );
  const scale = 100 / maxPct;

  return (
    <div className="space-y-2">
      {divergences.slice(0, 7).map((d) => (
        <div key={d.slug} className="bg-white border border-gov-well-border p-3">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-bold text-gov-text">{d.name}</h4>
            {Math.abs(d.divergence) > 0.5 && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 ${
                  d.divergence > 0
                    ? "text-diff-positive bg-diff-positive/10"
                    : "text-diff-negative bg-diff-negative/10"
                }`}
              >
                {d.divergence > 0 ? "+" : ""}
                {d.divergence.toFixed(1)}% vs national
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gov-text/60 w-16 shrink-0">
                {groupLabel.split(" ")[0]}
              </span>
              <div className="flex-1 h-4 bg-gov-well-border/30 overflow-hidden">
                <div
                  className="h-full bg-people-blue"
                  style={{ width: `${d.demoPct * scale}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-people-blue w-10 text-right">
                {d.demoPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gov-text/60 w-16 shrink-0">
                National
              </span>
              <div className="flex-1 h-4 bg-gov-well-border/30 overflow-hidden">
                <div
                  className="h-full bg-[#8B5CF6]"
                  style={{ width: `${d.natPct * scale}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#8B5CF6] w-10 text-right">
                {d.natPct > 0 ? d.natPct.toFixed(1) + "%" : "\u2014"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gov-text/60 w-16 shrink-0">
                Gov&apos;t
              </span>
              <div className="flex-1 h-4 bg-gov-well-border/30 overflow-hidden">
                <div
                  className="h-full bg-gov-red"
                  style={{ width: `${d.govPct * scale}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gov-red w-10 text-right">
                {d.govPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
