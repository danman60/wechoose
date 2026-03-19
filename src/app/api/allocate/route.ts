import { NextRequest, NextResponse } from "next/server";
import { hashIP, getClientIP } from "@/lib/ip-hash";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AllocationInput } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

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

    // Map slugs to UUIDs — client sends slugs, DB expects UUIDs
    // Use admin client directly (NOT server action — cookies() fails in API routes)
    const { data: categories, error: catError } = await db
      .from("budget_categories")
      .select("id, slug")
      .eq("country_code", "CA");

    if (catError || !categories) {
      console.error("[POST /api/allocate] failed to fetch categories:", catError?.message);
      return NextResponse.json(
        { error: "Failed to load budget categories" },
        { status: 500 }
      );
    }

    const slugToId: Record<string, string> = {};
    for (const cat of categories) {
      slugToId[cat.slug] = cat.id;
    }

    const mappedItems = body.items.map((item) => ({
      category_id: slugToId[item.category_id] || item.category_id,
      percentage: item.percentage,
    }));

    // Check if this IP already has an allocation
    const { data: existing } = await db
      .from("allocations")
      .select("id")
      .eq("ip_hash", ipHash)
      .eq("country_code", "CA")
      .maybeSingle();

    if (existing) {
      console.log("[POST /api/allocate] updating existing:", existing.id);

      // Delete old items
      await db
        .from("allocation_items")
        .delete()
        .eq("allocation_id", existing.id);

      // Update allocation with demographics (FIX BUG-002: use ?? null, not || null)
      const { error: updateError } = await db
        .from("allocations")
        .update({
          postal_code: body.postal_code ?? null,
          province: body.province ?? null,
          income: body.income ?? null,
          age_bracket: body.age_bracket ?? null,
          income_bracket: body.income_bracket ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("[POST /api/allocate] update error:", updateError.message);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Insert new items
      const { error: itemsError } = await db
        .from("allocation_items")
        .insert(
          mappedItems.map((item) => ({
            allocation_id: existing.id,
            category_id: item.category_id,
            percentage: item.percentage,
          }))
        );

      if (itemsError) {
        console.error("[POST /api/allocate] items error:", itemsError.message);
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }

      console.log("[POST /api/allocate] updated successfully");
      return NextResponse.json({ data: { id: existing.id, updated: true } });
    }

    // Create new allocation
    const { data: allocation, error: allocError } = await db
      .from("allocations")
      .insert({
        ip_hash: ipHash,
        postal_code: body.postal_code ?? null,
        province: body.province ?? null,
        country_code: "CA",
        income: body.income ?? null,
        age_bracket: body.age_bracket ?? null,
        income_bracket: body.income_bracket ?? null,
      })
      .select()
      .single();

    if (allocError) {
      console.error("[POST /api/allocate] create error:", allocError.message);
      return NextResponse.json({ error: allocError.message }, { status: 500 });
    }

    // Insert items
    const { error: itemsError } = await db
      .from("allocation_items")
      .insert(
        mappedItems.map((item) => ({
          allocation_id: allocation.id,
          category_id: item.category_id,
          percentage: item.percentage,
        }))
      );

    if (itemsError) {
      console.error("[POST /api/allocate] items error:", itemsError.message);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    console.log("[POST /api/allocate] created:", allocation.id);
    return NextResponse.json({ data: { id: allocation.id, updated: false } });
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

    const { data, error } = await db
      .from("allocations")
      .select("*, allocation_items(*)")
      .eq("ip_hash", ipHash)
      .eq("country_code", "CA")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[GET /api/allocate] error:", error.message);
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/allocate] error:", error);
    return NextResponse.json({ data: null });
  }
}
