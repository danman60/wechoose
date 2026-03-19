"use server";

import {
  FEDERAL_TAX_BRACKETS,
  BASIC_PERSONAL_AMOUNT,
  CPP_RATE,
  CPP_EXEMPTION,
  CPP_MAX_PENSIONABLE,
  CPP_MAX_CONTRIBUTION,
  EI_RATE,
  EI_MAX_INSURABLE,
  EI_MAX_CONTRIBUTION,
  PROVINCIAL_TAX_BRACKETS,
  GST_HST_RATES,
  ESTIMATED_TAXABLE_SPENDING_RATIO,
} from "@/lib/data/tax-brackets-federal";
import { BUDGET_CATEGORIES, TOTAL_SPENDING_BILLIONS } from "@/lib/data/budget-categories";
import type { TaxCalculationResult, CategoryDollarAllocation } from "@/types";

function calculateBracketTax(
  income: number,
  brackets: readonly { bracket_min: number; bracket_max: number | null; rate: number }[]
): number {
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.bracket_min) break;
    const upper = bracket.bracket_max ?? Infinity;
    const taxableInBracket = Math.min(income, upper) - bracket.bracket_min;
    tax += taxableInBracket * bracket.rate;
  }
  return tax;
}

export async function calculateTotalTax(
  grossIncome: number,
  province: string
): Promise<TaxCalculationResult> {
  console.log("[calculateTotalTax] called with:", { grossIncome, province });

  // Federal income tax
  const taxableIncome = Math.max(0, grossIncome - BASIC_PERSONAL_AMOUNT);
  const federalIncomeTax = calculateBracketTax(
    taxableIncome,
    FEDERAL_TAX_BRACKETS
  );

  // Provincial income tax
  const provBrackets = PROVINCIAL_TAX_BRACKETS[province];
  const provincialIncomeTax = provBrackets
    ? calculateBracketTax(grossIncome, provBrackets)
    : 0;

  // CPP
  const cppPensionable = Math.min(
    Math.max(0, grossIncome - CPP_EXEMPTION),
    CPP_MAX_PENSIONABLE - CPP_EXEMPTION
  );
  const cppContribution = Math.min(cppPensionable * CPP_RATE, CPP_MAX_CONTRIBUTION);

  // EI
  const eiInsurable = Math.min(grossIncome, EI_MAX_INSURABLE);
  const eiContribution = Math.min(eiInsurable * EI_RATE, EI_MAX_CONTRIBUTION);

  // Estimated GST/HST on spending
  const afterIncomeTax =
    grossIncome - federalIncomeTax - provincialIncomeTax - cppContribution - eiContribution;
  const gstHstRate = GST_HST_RATES[province] ?? 0.05;
  const estimatedGstHst =
    afterIncomeTax * ESTIMATED_TAXABLE_SPENDING_RATIO * gstHstRate;

  // Estimated carbon levy (rough per capita: ~$300/year for median earner)
  const estimatedCarbonLevy = Math.min(grossIncome * 0.003, 600);

  const totalTax =
    federalIncomeTax +
    provincialIncomeTax +
    cppContribution +
    eiContribution +
    estimatedGstHst +
    estimatedCarbonLevy;

  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  // Calculate per-category dollar allocation based on federal taxes only
  const federalTaxTotal = federalIncomeTax + cppContribution + eiContribution + estimatedGstHst + estimatedCarbonLevy;
  const perCategoryDollars: CategoryDollarAllocation[] = BUDGET_CATEGORIES.map(
    (cat) => ({
      category_id: cat.slug,
      category_name: cat.name,
      government_percentage: cat.actual_percentage,
      government_dollars:
        federalTaxTotal * (cat.actual_amount_billions / TOTAL_SPENDING_BILLIONS),
    })
  );

  const result: TaxCalculationResult = {
    gross_income: grossIncome,
    federal_income_tax: Math.round(federalIncomeTax),
    provincial_income_tax: Math.round(provincialIncomeTax),
    cpp_contribution: Math.round(cppContribution),
    ei_contribution: Math.round(eiContribution),
    estimated_gst_hst: Math.round(estimatedGstHst),
    estimated_carbon_levy: Math.round(estimatedCarbonLevy),
    total_tax: Math.round(totalTax),
    effective_rate: effectiveRate,
    per_category_dollars: perCategoryDollars,
  };

  console.log("[calculateTotalTax] result:", {
    totalTax: result.total_tax,
    effectiveRate: (effectiveRate * 100).toFixed(1) + "%",
  });

  return result;
}
