"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AllocationInput } from "@/types";

export async function getAllocationByIpHash(
  ipHash: string,
  countryCode: string = "CA"
) {
  console.log("[getAllocationByIpHash] called");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("allocations")
    .select("*, allocation_items(*)")
    .eq("ip_hash", ipHash)
    .eq("country_code", countryCode)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getAllocationByIpHash] error:", error.message);
    return { data: null, error: error.message };
  }

  console.log("[getAllocationByIpHash] found:", !!data);
  return { data, error: null };
}

export async function submitAllocation(
  input: AllocationInput,
  ipHash: string,
  countryCode: string = "CA"
) {
  console.log("[submitAllocation] called with:", {
    itemCount: input.items.length,
    postalCode: input.postal_code,
    hasIncome: !!input.income,
  });

  const supabase = await createClient();

  // Validate items sum to 100%
  const total = input.items.reduce((sum, item) => sum + item.percentage, 0);
  if (Math.abs(total - 100) > 0.5) {
    console.error("[submitAllocation] invalid total:", total);
    return { data: null, error: `Allocations must sum to 100%. Got ${total.toFixed(1)}%` };
  }

  // Check if this IP already has an allocation
  const { data: existing } = await supabase
    .from("allocations")
    .select("id")
    .eq("ip_hash", ipHash)
    .eq("country_code", countryCode)
    .maybeSingle();

  if (existing) {
    console.log("[submitAllocation] updating existing allocation:", existing.id);

    // Delete old items
    await supabase
      .from("allocation_items")
      .delete()
      .eq("allocation_id", existing.id);

    // Update allocation
    const { error: updateError } = await supabase
      .from("allocations")
      .update({
        postal_code: input.postal_code || null,
        province: input.province || null,
        income: input.income || null,
        age_bracket: input.age_bracket || null,
        income_bracket: input.income_bracket || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("[submitAllocation] update error:", updateError.message);
      return { data: null, error: updateError.message };
    }

    // Insert new items
    const items = input.items.map((item) => ({
      allocation_id: existing.id,
      category_id: item.category_id,
      percentage: item.percentage,
    }));

    const { error: itemsError } = await supabase
      .from("allocation_items")
      .insert(items);

    if (itemsError) {
      console.error("[submitAllocation] items insert error:", itemsError.message);
      return { data: null, error: itemsError.message };
    }

    console.log("[submitAllocation] updated successfully");
    revalidatePath("/results");
    return { data: { id: existing.id, updated: true }, error: null };
  }

  // Create new allocation
  const { data: allocation, error: allocError } = await supabase
    .from("allocations")
    .insert({
      ip_hash: ipHash,
      postal_code: input.postal_code || null,
      province: input.province || null,
      country_code: countryCode,
      income: input.income || null,
      age_bracket: input.age_bracket || null,
      income_bracket: input.income_bracket || null,
    })
    .select()
    .single();

  if (allocError) {
    console.error("[submitAllocation] create error:", allocError.message);
    return { data: null, error: allocError.message };
  }

  console.log("[submitAllocation] created allocation:", allocation.id);

  // Insert items
  const items = input.items.map((item) => ({
    allocation_id: allocation.id,
    category_id: item.category_id,
    percentage: item.percentage,
  }));

  const { error: itemsError } = await supabase
    .from("allocation_items")
    .insert(items);

  if (itemsError) {
    console.error("[submitAllocation] items error:", itemsError.message);
    return { data: null, error: itemsError.message };
  }

  console.log("[submitAllocation] success, new allocation:", allocation.id);
  revalidatePath("/results");
  return { data: { id: allocation.id, updated: false }, error: null };
}
