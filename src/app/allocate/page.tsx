import type { Metadata } from "next";
import { SliderGroup } from "@/components/allocator/slider-group";
import { TOTAL_SPENDING_BILLIONS, FISCAL_YEAR } from "@/lib/data/budget-categories";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Allocate Your Budget — WeChoose",
  description: `Distribute Canada's ${formatCurrency(TOTAL_SPENDING_BILLIONS)} federal budget (${FISCAL_YEAR}) across 14 spending categories.`,
};

export default function AllocatePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gov-text/60 mb-3">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; Allocate Your Budget
      </nav>

      <h1 className="gov-h1 text-2xl md:text-3xl mb-1">
        Allocate Canada&apos;s Federal Budget
      </h1>
      <p className="text-base text-gov-text/70 mb-1 max-w-[700px]">
        Distribute {formatCurrency(TOTAL_SPENDING_BILLIONS)} across
        14 categories. Must add up to 100%.
      </p>
      <p className="text-xs text-gov-text/50 mb-4">
        Source: Department of Finance Canada, {FISCAL_YEAR} (audited actuals).
      </p>

      <SliderGroup />
    </div>
  );
}
