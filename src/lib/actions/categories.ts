"use server";

import { createClient } from "@/lib/supabase/server";
import type { BudgetCategory } from "@/types";

export async function getCategories(
  countryCode: string = "CA",
  fiscalYear: string = "2023-2024"
): Promise<{ data: BudgetCategory[] | null; error: string | null }> {
  console.log("[getCategories] called with:", { countryCode, fiscalYear });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .eq("country_code", countryCode)
    .eq("fiscal_year", fiscalYear)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[getCategories] Supabase error:", error.message);
    return { data: null, error: error.message };
  }

  console.log("[getCategories] success, count:", data?.length);
  return { data, error: null };
}
