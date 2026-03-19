import { NextRequest, NextResponse } from "next/server";
import { getAggregates, getTotalAllocations } from "@/lib/actions/aggregates";

export async function GET(request: NextRequest) {
  console.log("[GET /api/aggregate] called");

  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "CA";
    const province = searchParams.get("province") || undefined;

    const [aggregatesResult, totalAllocations] = await Promise.all([
      getAggregates(country, province),
      getTotalAllocations(country),
    ]);

    return NextResponse.json({
      aggregates: aggregatesResult.data ?? [],
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
