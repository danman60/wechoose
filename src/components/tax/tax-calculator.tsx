"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateTotalTax } from "@/lib/actions/tax-calculator";
import { formatDollars, formatPercentage } from "@/lib/utils";
import type { TaxCalculationResult } from "@/types";

const PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

export function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [province, setProvince] = useState("");
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCalculate() {
    const incomeNum = parseInt(income.replace(/[^0-9]/g, ""), 10);
    if (!incomeNum || !province) return;

    setLoading(true);
    try {
      const calc = await calculateTotalTax(incomeNum, province);
      setResult(calc);
    } catch (err) {
      console.error("[TaxCalculator] error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Input form */}
      <div className="gov-well mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="income" className="text-base text-gov-text mb-1 block">
              Annual Gross Income
            </Label>
            <Input
              id="income"
              type="text"
              value={income}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setIncome(raw ? parseInt(raw).toLocaleString() : "");
              }}
              placeholder="85,000"
              className="text-lg border-gov-well-border"
            />
          </div>
          <div className="w-full md:w-64">
            <Label className="text-base text-gov-text mb-1 block">
              Province
            </Label>
            <Select value={province} onValueChange={(v) => { if (v) setProvince(v); }}>
              <SelectTrigger className="border-gov-well-border text-base">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p.code} value={p.code}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleCalculate}
            disabled={!income || !province || loading}
            className="bg-gov-navy text-white hover:bg-gov-navy/90 rounded-none px-6 py-2 text-base cursor-pointer disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate"}
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="text-center py-8 border-b border-gov-separator">
            <p className="text-lg text-gov-text/70">
              You earn{" "}
              <span className="font-bold text-gov-text">
                {formatDollars(result.gross_income)}
              </span>{" "}
              per year.
            </p>
            <p className="text-2xl md:text-3xl font-heading font-bold text-gov-navy mt-2">
              You pay approximately{" "}
              <span className="text-gov-red">
                {formatDollars(result.total_tax)}
              </span>{" "}
              in total taxes
            </p>
            <p className="text-lg text-gov-text/70 mt-1">
              That&apos;s an effective rate of{" "}
              <span className="font-bold text-gov-red">
                {formatPercentage(result.effective_rate * 100)}
              </span>
            </p>
          </div>

          {/* Tax breakdown */}
          <div>
            <h3 className="gov-h1 text-2xl mb-6">Where Your Taxes Come From</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Federal Income Tax", amount: result.federal_income_tax },
                { label: "Provincial Income Tax", amount: result.provincial_income_tax },
                { label: "CPP Contribution", amount: result.cpp_contribution },
                { label: "EI Contribution", amount: result.ei_contribution },
                { label: "Estimated GST/HST", amount: result.estimated_gst_hst },
                { label: "Estimated Carbon Levy", amount: result.estimated_carbon_levy },
              ].map((item) => (
                <div key={item.label} className="gov-well flex justify-between items-center">
                  <span className="text-base text-gov-text">{item.label}</span>
                  <span className="font-bold text-gov-navy text-lg">
                    {formatDollars(item.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="gov-well mt-3 flex justify-between items-center border-t-4 border-gov-navy">
              <span className="text-lg font-bold text-gov-text">Total</span>
              <span className="text-2xl font-bold text-gov-red">
                {formatDollars(result.total_tax)}
              </span>
            </div>
          </div>

          {/* Per-category breakdown */}
          <div>
            <h3 className="gov-h1 text-2xl mb-6">
              Where Your Federal Tax Dollars Go
            </h3>
            <div className="space-y-2">
              {result.per_category_dollars.map((cat) => (
                <div
                  key={cat.category_id}
                  className="gov-well flex justify-between items-center"
                >
                  <div>
                    <span className="text-base text-gov-text">
                      {cat.category_name}
                    </span>
                    <span className="text-xs text-gov-text/50 ml-2">
                      ({cat.government_percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <span className="font-bold text-gov-navy">
                    {formatDollars(cat.government_dollars)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <p className="text-lg text-gov-text/70 mb-4">
              Now that you know how much you pay — how would YOU spend it?
            </p>
            <a
              href="/allocate"
              className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200"
            >
              Allocate Your Budget
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
