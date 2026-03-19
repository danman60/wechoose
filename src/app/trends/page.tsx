import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TrendsChart } from "@/components/results/trends-chart";

export const metadata: Metadata = {
  title: "Budget Trends — WeChoose",
  description:
    "Track how Canadian budget priorities shift over time. See which categories are gaining or losing support.",
};

export default async function TrendsPage() {
  const supabase = await createClient();

  // Fetch all snapshots
  const { data: snapshots } = await supabase
    .from("aggregate_snapshots")
    .select("*")
    .eq("country_code", "CA")
    .is("province", null)
    .order("snapshot_date", { ascending: true });

  // Fetch categories for name mapping
  const { data: categories } = await supabase
    .from("budget_categories")
    .select("id, name, slug, actual_percentage")
    .eq("country_code", "CA")
    .order("display_order", { ascending: true });

  const catMap: Record<string, { name: string; slug: string; actual: number }> = {};
  for (const cat of categories ?? []) {
    catMap[cat.id] = { name: cat.name, slug: cat.slug, actual: cat.actual_percentage };
  }

  // Group snapshots by date
  const dateMap: Record<string, Record<string, number>> = {};
  for (const snap of snapshots ?? []) {
    const date = snap.snapshot_date;
    if (!dateMap[date]) dateMap[date] = {};
    const cat = catMap[snap.category_id];
    if (cat) {
      dateMap[date][cat.slug] = snap.average_percentage;
    }
  }

  // Build chart data
  const chartData = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date,
      ...values,
    }));

  const categoryList = (categories ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    actual: c.actual_percentage,
  }));

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; Trends
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-2">
        Budget Priority Trends
      </h1>
      <p className="text-lg text-gov-text/70 mb-8">
        Track how Canadian priorities shift over time. Each data point is a
        daily snapshot of the aggregate people&apos;s budget.
      </p>

      {chartData.length > 0 ? (
        <TrendsChart data={chartData} categories={categoryList} />
      ) : (
        <div className="text-center py-16 bg-gov-well">
          <h2 className="text-2xl font-heading font-bold text-gov-navy mb-4">
            Trend data will appear as more snapshots are collected.
          </h2>
          <p className="text-lg text-gov-text/70 mb-4">
            Daily snapshots of the aggregate budget are recorded automatically.
            Check back soon to see how priorities shift.
          </p>
          {chartData.length === 1 && (
            <p className="text-sm text-gov-text/50">
              1 data point collected. Trends require at least 2 snapshots.
            </p>
          )}
        </div>
      )}

      {/* Current snapshot table */}
      {categoryList.length > 0 && chartData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Latest Snapshot
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gov-well-border">
              <thead>
                <tr className="bg-gov-well">
                  <th className="text-left p-3 font-bold">Category</th>
                  <th className="text-right p-3 font-bold">People&apos;s Avg</th>
                  <th className="text-right p-3 font-bold">Gov&apos;t Actual</th>
                  <th className="text-right p-3 font-bold">Gap</th>
                </tr>
              </thead>
              <tbody>
                {categoryList.map((cat) => {
                  const latest = chartData[chartData.length - 1];
                  const peoplePct = (latest as Record<string, unknown>)[cat.slug] as number ?? 0;
                  const gap = peoplePct - cat.actual;
                  return (
                    <tr key={cat.slug} className="border-t border-gov-well-border">
                      <td className="p-3">{cat.name}</td>
                      <td className="text-right p-3 text-people-blue font-semibold">
                        {peoplePct > 0 ? peoplePct.toFixed(1) + "%" : "\u2014"}
                      </td>
                      <td className="text-right p-3 text-gov-red font-semibold">
                        {cat.actual.toFixed(1)}%
                      </td>
                      <td
                        className={`text-right p-3 font-bold ${
                          gap > 0.5
                            ? "text-diff-positive"
                            : gap < -0.5
                            ? "text-diff-negative"
                            : "text-gov-text/50"
                        }`}
                      >
                        {peoplePct > 0
                          ? `${gap > 0 ? "+" : ""}${gap.toFixed(1)}%`
                          : "\u2014"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
