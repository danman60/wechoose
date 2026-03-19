import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BUDGET_CATEGORIES, TOTAL_SPENDING_BILLIONS } from "@/lib/data/budget-categories";
import { ShareButtons } from "@/components/shared/share-buttons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "A Canadian's Budget — WeChoose",
    description:
      "See how one Canadian would allocate the federal budget — and compare to the government's actual spending.",
    openGraph: {
      title: "I'd spend Canada's budget differently — WeChoose",
      description:
        "See my top priorities for Canada's $521B budget and how they compare to what the government actually spends.",
      type: "website",
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch allocation with items
  const { data: allocation, error } = await supabase
    .from("allocations")
    .select("*, allocation_items(*)")
    .eq("id", id)
    .single();

  if (error || !allocation) {
    notFound();
  }

  // Build category UUID to info map
  const { data: categories } = await supabase
    .from("budget_categories")
    .select("id, name, slug, actual_percentage, actual_amount_billions, display_order")
    .eq("country_code", "CA")
    .order("display_order", { ascending: true });

  const catMap: Record<
    string,
    { name: string; slug: string; actual: number; amount: number; order: number }
  > = {};
  for (const cat of categories || []) {
    catMap[cat.id] = {
      name: cat.name,
      slug: cat.slug,
      actual: cat.actual_percentage,
      amount: cat.actual_amount_billions,
      order: cat.display_order,
    };
  }

  // Map allocation items with category info
  const items = (allocation.allocation_items || [])
    .map((item: { category_id: string; percentage: number }) => {
      const cat = catMap[item.category_id];
      return {
        categoryId: item.category_id,
        name: cat?.name || "Unknown",
        slug: cat?.slug || "",
        percentage: item.percentage,
        actual: cat?.actual || 0,
        amount: cat?.amount || 0,
        order: cat?.order || 99,
        gap: item.percentage - (cat?.actual || 0),
      };
    })
    .sort((a: { order: number }, b: { order: number }) => a.order - b.order);

  // Find max for bar scaling
  const maxPct = Math.max(
    ...items.map((i: { percentage: number; actual: number }) => Math.max(i.percentage, i.actual)),
    1
  );
  const scale = 100 / maxPct;

  // Top gaps (biggest positive differences)
  const topGaps = [...items]
    .sort((a: { gap: number }, b: { gap: number }) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, 3);

  const shareUrl = `https://wechoose-two.vercel.app/results/share/${id}`;

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt;{" "}
        <a href="/results" className="text-gov-link hover:text-gov-link-hover">
          Results
        </a>{" "}
        &gt; Shared Budget
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-2">
        A Canadian&apos;s Budget
      </h1>
      <p className="text-lg text-gov-text/70 mb-8">
        Here&apos;s how this person would allocate Canada&apos;s ${TOTAL_SPENDING_BILLIONS}B
        federal budget — compared to what the government actually spends.
      </p>

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-people-blue" />
          <span className="text-sm text-gov-text">Their Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gov-red" />
          <span className="text-sm text-gov-text">Government Actual</span>
        </div>
      </div>

      {/* All categories */}
      <div className="space-y-3 mb-10">
        {items.map(
          (item: {
            categoryId: string;
            name: string;
            percentage: number;
            actual: number;
            gap: number;
          }) => (
            <div
              key={item.categoryId}
              className="bg-white border border-gov-well-border p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base font-bold text-gov-text">{item.name}</h4>
                <div
                  className={`text-sm font-bold px-2 py-0.5 ${
                    item.gap > 0.5
                      ? "text-diff-positive bg-diff-positive/10"
                      : item.gap < -0.5
                      ? "text-diff-negative bg-diff-negative/10"
                      : "text-gov-text/50"
                  }`}
                >
                  {item.gap > 0 ? "+" : ""}
                  {item.gap.toFixed(1)}%
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gov-text/60 w-14 shrink-0">
                    Theirs
                  </span>
                  <div className="flex-1 h-5 bg-gov-well-border/30 overflow-hidden">
                    <div
                      className="h-full bg-people-blue"
                      style={{ width: `${item.percentage * scale}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-people-blue w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gov-text/60 w-14 shrink-0">
                    Gov&apos;t
                  </span>
                  <div className="flex-1 h-5 bg-gov-well-border/30 overflow-hidden">
                    <div
                      className="h-full bg-gov-red"
                      style={{ width: `${item.actual * scale}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gov-red w-12 text-right">
                    {item.actual.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Biggest gaps */}
      <div className="mb-10">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Biggest Gaps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topGaps.map(
            (item: {
              categoryId: string;
              name: string;
              percentage: number;
              actual: number;
              gap: number;
            }) => (
              <div
                key={item.categoryId}
                className="bg-gov-well border-t-4 border-gov-navy p-4"
              >
                <h4 className="font-bold text-gov-text mb-1">{item.name}</h4>
                <p className="text-sm text-gov-text/70">
                  They chose{" "}
                  <span className="font-bold text-people-blue">
                    {item.percentage.toFixed(1)}%
                  </span>
                  . The government spends{" "}
                  <span className="font-bold text-gov-red">
                    {item.actual.toFixed(1)}%
                  </span>
                  .
                </p>
                <p className="text-lg font-bold mt-1">
                  <span
                    className={
                      item.gap > 0 ? "text-diff-positive" : "text-diff-negative"
                    }
                  >
                    {item.gap > 0 ? "+" : ""}
                    {item.gap.toFixed(1)}% gap
                  </span>
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Share & CTA */}
      <div className="text-center py-8 border-t border-gov-separator">
        <h2 className="text-2xl font-heading font-bold text-gov-navy mb-4">
          Think you&apos;d do it differently?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href="/allocate"
            className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200 text-center"
          >
            Make Your Own Allocation
          </Link>
          <Link
            href="/results"
            className="inline-block border-2 border-gov-navy text-gov-navy no-underline hover:bg-gov-navy/5 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200 text-center"
          >
            See All Results
          </Link>
        </div>
        <ShareButtons url={shareUrl} />
      </div>
    </div>
  );
}
