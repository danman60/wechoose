import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";

export const metadata: Metadata = {
  title: "Provincial Priorities — WeChoose",
  description:
    "See how different provinces would allocate the federal budget. Compare regional priorities across Canada.",
};

const PROVINCES = [
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" },
  { code: "MB", name: "Manitoba" },
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "NB", name: "New Brunswick" },
  { code: "NS", name: "Nova Scotia" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NL", name: "Newfoundland & Labrador" },
  { code: "YT", name: "Yukon" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
];

interface ProvinceData {
  code: string;
  name: string;
  totalAllocations: number;
  topPriority: { name: string; avg: number } | null;
  biggestGap: { name: string; avg: number; gov: number; gap: number } | null;
}

export default async function ProvincesPage() {
  const supabase = await createClient();

  // Fetch all aggregate_cache entries
  const { data: allAggregates } = await supabase
    .from("aggregate_cache")
    .select("*")
    .eq("country_code", "CA");

  // Fetch categories for UUID-to-slug mapping
  const { data: categories } = await supabase
    .from("budget_categories")
    .select("id, slug, name, actual_percentage")
    .eq("country_code", "CA");

  const catMap: Record<
    string,
    { slug: string; name: string; actual: number }
  > = {};
  for (const cat of categories ?? []) {
    catMap[cat.id] = {
      slug: cat.slug,
      name: cat.name,
      actual: cat.actual_percentage,
    };
  }

  // Build province data
  const provinceData: ProvinceData[] = PROVINCES.map((prov) => {
    const provAggs = (allAggregates ?? []).filter(
      (a) => a.province === prov.code
    );

    if (provAggs.length === 0) {
      return {
        code: prov.code,
        name: prov.name,
        totalAllocations: 0,
        topPriority: null,
        biggestGap: null,
      };
    }

    const totalAllocations = provAggs[0]?.total_allocations ?? 0;

    // Find top priority (highest average)
    let topPriority: { name: string; avg: number } | null = null;
    let biggestGap: {
      name: string;
      avg: number;
      gov: number;
      gap: number;
    } | null = null;
    let maxAvg = 0;
    let maxGap = 0;

    for (const agg of provAggs) {
      const cat = catMap[agg.category_id];
      if (!cat) continue;

      if (agg.average_percentage > maxAvg) {
        maxAvg = agg.average_percentage;
        topPriority = { name: cat.name, avg: agg.average_percentage };
      }

      const gap = Math.abs(agg.average_percentage - cat.actual);
      if (gap > maxGap) {
        maxGap = gap;
        biggestGap = {
          name: cat.name,
          avg: agg.average_percentage,
          gov: cat.actual,
          gap: agg.average_percentage - cat.actual,
        };
      }
    }

    return {
      code: prov.code,
      name: prov.name,
      totalAllocations,
      topPriority,
      biggestGap,
    };
  });

  const hasData = provinceData.some((p) => p.totalAllocations > 0);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; Provinces
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-2">
        Provincial Priorities
      </h1>
      <p className="text-lg text-gov-text/70 mb-8">
        See how different regions of Canada would allocate the federal budget.
      </p>

      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {provinceData.map((prov) => (
            <div
              key={prov.code}
              className="bg-white border border-gov-well-border p-5 hover:border-gov-navy/30 transition-all"
            >
              <h3 className="text-lg font-heading font-bold text-gov-navy mb-1">
                {prov.name}
              </h3>
              {prov.totalAllocations > 0 ? (
                <>
                  <p className="text-xs text-gov-text/50 mb-3">
                    {prov.totalAllocations} voice
                    {prov.totalAllocations !== 1 ? "s" : ""}
                  </p>
                  {prov.topPriority && (
                    <div className="mb-2">
                      <p className="text-xs text-gov-text/60 uppercase tracking-wide">
                        Top Priority
                      </p>
                      <p className="text-sm font-bold">
                        {prov.topPriority.name}{" "}
                        <span className="text-people-blue">
                          ({prov.topPriority.avg.toFixed(1)}%)
                        </span>
                      </p>
                    </div>
                  )}
                  {prov.biggestGap && (
                    <div>
                      <p className="text-xs text-gov-text/60 uppercase tracking-wide">
                        Biggest Gap vs. Government
                      </p>
                      <p className="text-sm">
                        {prov.biggestGap.name}:{" "}
                        <span
                          className={
                            prov.biggestGap.gap > 0
                              ? "text-diff-positive font-bold"
                              : "text-diff-negative font-bold"
                          }
                        >
                          {prov.biggestGap.gap > 0 ? "+" : ""}
                          {prov.biggestGap.gap.toFixed(1)}%
                        </span>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gov-text/50 mt-2">
                  No allocations yet.{" "}
                  <Link
                    href="/allocate"
                    className="text-gov-link hover:text-gov-link-hover"
                  >
                    Be the first.
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-heading font-bold text-gov-navy mb-4">
            Provincial data will appear as Canadians weigh in.
          </h2>
          <p className="text-lg text-gov-text/70 mb-8">
            Enter your postal code when allocating to contribute to your
            province&apos;s data.
          </p>
          <Link
            href="/allocate"
            className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200"
          >
            Allocate My Budget
          </Link>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-12 mt-8 border-t border-gov-separator">
        <Link
          href="/allocate"
          className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200"
        >
          Add Your Voice
        </Link>
      </div>
    </div>
  );
}
