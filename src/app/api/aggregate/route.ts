import { NextRequest, NextResponse } from "next/server";
import { getAggregates, getTotalAllocations } from "@/lib/actions/aggregates";
import { getCategories } from "@/lib/actions/categories";

export async function GET(request: NextRequest) {
  console.log("[GET /api/aggregate] called");

  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "CA";
    const province = searchParams.get("province") || undefined;

    const [aggregatesResult, totalAllocations, categoriesResult] =
      await Promise.all([
        getAggregates(country, province),
        getTotalAllocations(country),
        getCategories(country),
      ]);

    // Build UUID-to-slug map for the client
    const idToSlug: Record<string, string> = {};
    if (categoriesResult.data) {
      for (const cat of categoriesResult.data) {
        idToSlug[cat.id] = cat.slug;
      }
    }

    // Enrich aggregates with slug for client-side matching
    const aggregates = (aggregatesResult.data ?? []).map((agg) => ({
      ...agg,
      category_slug: idToSlug[agg.category_id] || agg.category_id,
    }));

    return NextResponse.json({
      aggregates,
      totalAllocations,
    });
  } catch (error) {
    console.error("[GET /api/aggregate] error:", error);
    return NextResponse.json(
      { aggregates: [], totalAllocations: 0 },
      { status: 500 }
    );
  }
}
