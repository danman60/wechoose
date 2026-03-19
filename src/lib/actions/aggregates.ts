"use server";

import { createClient } from "@/lib/supabase/server";
import type { AggregateCache } from "@/types";

export async function getAggregates(
  countryCode: string = "CA",
  province?: string
): Promise<{ data: AggregateCache[] | null; error: string | null }> {
  console.log("[getAggregates] called with:", { countryCode, province });

  const supabase = await createClient();

  let query = supabase
    .from("aggregate_cache")
    .select("*")
    .eq("country_code", countryCode);

  if (province) {
    query = query.eq("province", province);
  } else {
    query = query.is("province", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getAggregates] Supabase error:", error.message);
    return { data: null, error: error.message };
  }

  console.log("[getAggregates] success, count:", data?.length);
  return { data, error: null };
}

export async function getTotalAllocations(
  countryCode: string = "CA"
): Promise<number> {
  console.log("[getTotalAllocations] called with:", { countryCode });

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("allocations")
    .select("*", { count: "exact", head: true })
    .eq("country_code", countryCode);

  if (error) {
    console.error("[getTotalAllocations] Supabase error:", error.message);
    return 0;
  }

  console.log("[getTotalAllocations] count:", count);
  return count ?? 0;
}
