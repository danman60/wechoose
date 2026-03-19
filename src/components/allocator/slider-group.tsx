"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CategoryCard } from "./category-card";
import { PostalCodeInput } from "@/components/shared/postal-code-input";
import { Button } from "@/components/ui/button";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";

export function SliderGroup() {
  const router = useRouter();
  const [allocations, setAllocations] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      BUDGET_CATEGORIES.forEach((cat) => {
        initial[cat.slug] = 0;
      });
      return initial;
    }
  );
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalAllocated = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );
  const remaining = Math.max(0, 100 - totalAllocated);
  const isValid = Math.abs(totalAllocated - 100) < 0.5;

  const handlePercentageChange = useCallback(
    (slug: string, value: number) => {
      setAllocations((prev) => ({ ...prev, [slug]: value }));
    },
    []
  );

  const handlePostalCodeChange = useCallback(
    (pc: string, prov: string | null) => {
      setPostalCode(pc);
      setProvince(prov);
    },
    []
  );

  async function handleSubmit() {
    if (!isValid) return;

    setSubmitting(true);
    setError(null);

    try {
      // We need category IDs from the database, but since we're using slugs
      // in the client, the API route will need to map them.
      // For now, use slugs as identifiers — the API will handle mapping.
      const items = Object.entries(allocations)
        .filter(([, pct]) => pct > 0)
        .map(([slug, percentage]) => ({
          category_id: slug,
          percentage,
        }));

      const response = await fetch("/api/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postal_code: postalCode || undefined,
          province: province || undefined,
          items,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Failed to submit allocation");
        return;
      }

      setSuccess(true);
      // Store allocation in sessionStorage for results page
      sessionStorage.setItem(
        "wechoose_allocation",
        JSON.stringify(allocations)
      );

      // Redirect to results after a brief moment
      setTimeout(() => {
        router.push("/results");
      }, 1500);
    } catch (err) {
      console.error("[SliderGroup] submit error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="text-3xl font-heading font-bold text-gov-navy mb-4">
          Your voice has been recorded.
        </div>
        <p className="text-lg text-gov-text/70">
          Redirecting to see how Canada compares...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Remaining counter */}
      <div
        className={`sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gov-separator py-3 px-4 mb-6 ${
          isValid ? "border-b-diff-positive" : ""
        }`}
      >
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold font-heading text-gov-text">
              Allocated:{" "}
              <span className={isValid ? "text-diff-positive" : "text-people-blue"}>
                {totalAllocated.toFixed(1)}%
              </span>
            </span>
            {!isValid && (
              <span className="text-sm text-gov-text/60 ml-3">
                {remaining.toFixed(1)}% remaining
              </span>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="bg-gov-navy text-white hover:bg-gov-navy/90 rounded-none px-6 py-2 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit My Budget"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="max-w-[800px] mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Postal code */}
      <div className="max-w-[800px] mx-auto mb-6">
        <PostalCodeInput onPostalCodeChange={handlePostalCodeChange} />
        <p className="text-xs text-gov-text/50 mt-1">
          Used for provincial breakdown only. Not stored with your identity.
        </p>
      </div>

      {/* Category sliders */}
      <div className="max-w-[800px] mx-auto">
        {BUDGET_CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.slug}
            name={cat.name}
            description={cat.description}
            icon={cat.icon}
            actualPercentage={cat.actual_percentage}
            actualAmountBillions={cat.actual_amount_billions}
            funFact={cat.fun_fact}
            userPercentage={allocations[cat.slug] ?? 0}
            onPercentageChange={(value) =>
              handlePercentageChange(cat.slug, value)
            }
            remaining={remaining}
          />
        ))}
      </div>

      {/* Bottom submit */}
      <div className="max-w-[800px] mx-auto mt-8 text-center">
        <p className="text-sm text-gov-text/50 mb-4">
          One voice per person. Your response is tied to your connection to prevent duplicates.
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="bg-gov-navy text-white hover:bg-gov-navy/90 rounded-none px-8 py-3 text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit My Budget"}
        </Button>
        {!isValid && (
          <p className="text-sm text-gov-red mt-2">
            Your allocations must add up to exactly 100%.
            Currently at {totalAllocated.toFixed(1)}%.
          </p>
        )}
      </div>
    </div>
  );
}
