"use server";

import { createClient } from "@/lib/supabase/server";
import type { RevenueSource } from "@/types";

export async function getRevenueSources(
  countryCode: string = "CA",
  fiscalYear: string = "2023-2024"
): Promise<{ data: RevenueSource[] | null; error: string | null }> {
  console.log("[getRevenueSources] called with:", { countryCode, fiscalYear });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("revenue_sources")
    .select("*")
    .eq("country_code", countryCode)
    .eq("fiscal_year", fiscalYear)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[getRevenueSources] Supabase error:", error.message);
    return { data: null, error: error.message };
  }

  console.log("[getRevenueSources] success, count:", data?.length);
  return { data, error: null };
}
