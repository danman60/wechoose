import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/actions/categories";

export async function GET(request: NextRequest) {
  console.log("[GET /api/aggregate/demographics] called");

  try {
    const { searchParams } = new URL(request.url);
    const dimension = searchParams.get("dimension");
    const value = searchParams.get("value");
    const country = searchParams.get("country") || "CA";

    if (!dimension || !value) {
      return NextResponse.json(
        { error: "dimension and value params required" },
        { status: 400 }
      );
    }

    const validDimensions = ["age_bracket", "income_bracket"];
    if (!validDimensions.includes(dimension)) {
      return NextResponse.json(
        { error: "Invalid dimension" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch from demographic_aggregate_cache
    const { data: aggregates, error } = await supabase
      .from("demographic_aggregate_cache")
      .select("*")
      .eq("country_code", country)
      .eq("dimension", dimension)
      .eq("dimension_value", value);

    if (error) {
      console.error("[demographics] error:", error.message);
      return NextResponse.json(
        { aggregates: [], totalAllocations: 0 },
        { status: 500 }
      );
    }

    // Get total allocations for this demographic
    const totalAllocations =
      aggregates && aggregates.length > 0
        ? aggregates[0].total_allocations
        : 0;

    // Minimum threshold — don't reveal data for tiny groups
    if (totalAllocations < 3) {
      return NextResponse.json({
        aggregates: [],
        totalAllocations,
        belowThreshold: true,
        message: "Not enough responses in this group yet. We need at least 3 to protect anonymity.",
      });
    }

    // Map category UUIDs to slugs
    const categoriesResult = await getCategories(country);
    const idToSlug: Record<string, string> = {};
    if (categoriesResult.data) {
      for (const cat of categoriesResult.data) {
        idToSlug[cat.id] = cat.slug;
      }
    }

    const enriched = (aggregates ?? []).map((agg) => ({
      ...agg,
      category_slug: idToSlug[agg.category_id] || agg.category_id,
    }));

    return NextResponse.json({
      aggregates: enriched,
      totalAllocations,
      belowThreshold: false,
    });
  } catch (error) {
    console.error("[demographics] unexpected error:", error);
    return NextResponse.json(
      { aggregates: [], totalAllocations: 0 },
      { status: 500 }
    );
  }
}
