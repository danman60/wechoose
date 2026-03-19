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
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; Allocate Your Budget
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-2">
        Allocate Canada&apos;s Federal Budget
      </h1>
      <p className="text-lg text-gov-text/70 mb-2 max-w-[700px]">
        You have {formatCurrency(TOTAL_SPENDING_BILLIONS)} to distribute across
        14 spending categories. Your allocations must add up to exactly 100%.
      </p>
      <p className="text-sm text-gov-text/50 mb-8">
        Data source: Department of Finance Canada, Fiscal Year {FISCAL_YEAR}
        (audited actuals).
      </p>

      <SliderGroup />
    </div>
  );
}
