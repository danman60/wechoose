import { NextRequest, NextResponse } from "next/server";
import { hashIP, getClientIP } from "@/lib/ip-hash";
import { submitAllocation, getAllocationByIpHash } from "@/lib/actions/allocations";
import type { AllocationInput } from "@/types";

export async function POST(request: NextRequest) {
  console.log("[POST /api/allocate] called");

  try {
    const ip = getClientIP(request);
    const ipHash = hashIP(ip);
    console.log("[POST /api/allocate] IP hashed");

    const body = (await request.json()) as AllocationInput;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "No allocation items provided" },
        { status: 400 }
      );
    }

    const total = body.items.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(total - 100) > 0.5) {
      return NextResponse.json(
        { error: `Allocations must sum to 100%. Got ${total.toFixed(1)}%` },
        { status: 400 }
      );
    }

    const result = await submitAllocation(body, ipHash);

    if (result.error) {
      console.error("[POST /api/allocate] error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log("[POST /api/allocate] success:", result.data);
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("[POST /api/allocate] unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log("[GET /api/allocate] checking existing allocation");

  try {
    const ip = getClientIP(request);
    const ipHash = hashIP(ip);

    const result = await getAllocationByIpHash(ipHash);
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("[GET /api/allocate] error:", error);
    return NextResponse.json({ data: null });
  }
}
