import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRidingBySlug, RIDINGS } from "@/lib/data/ridings";
import { getAggregates, getTotalAllocations } from "@/lib/actions/aggregates";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";
import { EmailMPButton } from "@/components/shared/email-mp-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const riding = getRidingBySlug(slug);
  if (!riding) return { title: "Riding Not Found — WeChoose" };

  return {
    title: `${riding.name} — WeChoose`,
    description: `See how ${riding.name} residents would allocate Canada's federal budget compared to the government and the national average.`,
  };
}

export async function generateStaticParams() {
  return RIDINGS.map((r) => ({ slug: r.slug }));
}

export default async function RidingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const riding = getRidingBySlug(slug);

  if (!riding) {
    notFound();
  }

  // Fetch national aggregates and province aggregates
  const [nationalAgg, provinceAgg, totalAllocations] = await Promise.all([
    getAggregates("CA"),
    getAggregates("CA", riding.province),
    getTotalAllocations("CA"),
  ]);

  // Build maps
  const nationalMap: Record<string, number> = {};
  for (const agg of nationalAgg.data ?? []) {
    nationalMap[agg.category_id] = agg.average_percentage;
  }

  const provinceMap: Record<string, number> = {};
  for (const agg of provinceAgg.data ?? []) {
    provinceMap[agg.category_id] = agg.average_percentage;
  }

  const partyColors: Record<string, string> = {
    LPC: "#D71920",
    CPC: "#1A4782",
    NDP: "#F58220",
    BQ: "#33B2CC",
    GPC: "#3D9B35",
    IND: "#888888",
  };

  const partyNames: Record<string, string> = {
    LPC: "Liberal",
    CPC: "Conservative",
    NDP: "NDP",
    BQ: "Bloc Québécois",
    GPC: "Green",
    IND: "Independent",
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt;{" "}
        <a href="/results" className="text-gov-link hover:text-gov-link-hover">
          Results
        </a>{" "}
        &gt; {riding.name}
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-2">{riding.name}</h1>
      <p className="text-lg text-gov-text/70 mb-2">{riding.province}</p>

      {/* MP info card */}
      <div className="bg-gov-well p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-gov-text/60 uppercase tracking-wide">
            Your Member of Parliament
          </p>
          <p className="text-xl font-heading font-bold mt-1">
            {riding.mp_name}
          </p>
          <p className="text-sm mt-0.5">
            <span
              className="inline-block px-2 py-0.5 text-white text-xs font-bold"
              style={{
                backgroundColor: partyColors[riding.mp_party] ?? "#888",
              }}
            >
              {partyNames[riding.mp_party] ?? riding.mp_party}
            </span>
          </p>
        </div>
        <EmailMPButton riding={riding} totalVoices={totalAllocations} />
      </div>

      {/* Comparison table */}
      <h2 className="text-2xl font-heading font-bold mb-4">
        Budget Priorities: National vs. Government
      </h2>
      <div className="space-y-3 mb-10">
        {BUDGET_CATEGORIES.map((cat) => {
          const govPct = cat.actual_percentage;
          const natPct = nationalMap[cat.slug] ?? 0;
          // We use slug-based lookup (national aggregates may use UUIDs internally)
          // For now show national vs government
          const diff = natPct - govPct;
          const maxPct = Math.max(govPct, natPct, 1);
          const scale = 100 / maxPct;

          return (
            <div
              key={cat.slug}
              className="bg-white border border-gov-well-border p-3"
            >
              <div className="flex items-start justify-between mb-1.5">
                <h4 className="text-sm font-bold text-gov-text">{cat.name}</h4>
                {natPct > 0 && (
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 ${
                      diff > 0.5
                        ? "text-diff-positive bg-diff-positive/10"
                        : diff < -0.5
                        ? "text-diff-negative bg-diff-negative/10"
                        : "text-gov-text/50"
                    }`}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff.toFixed(1)}%
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gov-text/60 w-14 shrink-0">
                    People
                  </span>
                  <div className="flex-1 h-4 bg-gov-well-border/30 overflow-hidden">
                    <div
                      className="h-full bg-[#8B5CF6]"
                      style={{ width: `${natPct * scale}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#8B5CF6] w-10 text-right">
                    {natPct > 0 ? natPct.toFixed(1) + "%" : "\u2014"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gov-text/60 w-14 shrink-0">
                    Gov&apos;t
                  </span>
                  <div className="flex-1 h-4 bg-gov-well-border/30 overflow-hidden">
                    <div
                      className="h-full bg-gov-red"
                      style={{ width: `${govPct * scale}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gov-red w-10 text-right">
                    {govPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center py-8 border-t border-gov-separator">
        <h2 className="text-2xl font-heading font-bold text-gov-navy mb-4">
          Make your voice heard in {riding.name}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/allocate"
            className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200 text-center"
          >
            Allocate My Budget
          </Link>
          <Link
            href="/results"
            className="inline-block border-2 border-gov-navy text-gov-navy no-underline hover:bg-gov-navy/5 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200 text-center"
          >
            See National Results
          </Link>
        </div>
      </div>
    </div>
  );
}
