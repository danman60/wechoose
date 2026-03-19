import type { Metadata } from "next";
import { TaxCalculator } from "@/components/tax/tax-calculator";

export const metadata: Metadata = {
  title: "Tax Truth Calculator — WeChoose",
  description:
    "Find out how much you really pay in taxes — income tax, CPP, EI, GST/HST, carbon levy, and more. See where every dollar goes.",
};

export default function TaxTruthPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; Tax Truth
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-2">
        The Tax Truth Calculator
      </h1>
      <p className="text-lg text-gov-text/70 mb-8 max-w-[700px]">
        Income tax is just the beginning. Enter your income and province to see
        your <strong>total</strong> tax burden — including CPP, EI, GST/HST,
        carbon levies, and more.
      </p>

      <TaxCalculator />
    </div>
  );
}
