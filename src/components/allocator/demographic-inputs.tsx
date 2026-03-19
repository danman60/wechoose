"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PrivacyNote } from "@/components/shared/privacy-note";
import type { AgeBracket, IncomeBracket } from "@/types";

const AGE_BRACKETS: { value: AgeBracket; label: string }[] = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55-64", label: "55-64" },
  { value: "65+", label: "65+" },
];

const INCOME_BRACKETS: { value: IncomeBracket; label: string }[] = [
  { value: "under-30k", label: "Under $30K" },
  { value: "30-50k", label: "$30-50K" },
  { value: "50-75k", label: "$50-75K" },
  { value: "75-100k", label: "$75-100K" },
  { value: "100-150k", label: "$100-150K" },
  { value: "150k+", label: "$150K+" },
];

interface DemographicInputsProps {
  ageBracket: AgeBracket | null;
  incomeBracket: IncomeBracket | null;
  onAgeBracketChange: (bracket: AgeBracket | null) => void;
  onIncomeBracketChange: (bracket: IncomeBracket | null) => void;
}

export function DemographicInputs({
  ageBracket,
  incomeBracket,
  onAgeBracketChange,
  onIncomeBracketChange,
}: DemographicInputsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gov-well-border bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer bg-transparent border-0 text-left"
      >
        <div>
          <span className="text-sm font-bold text-gov-text">
            Tell us about yourself
          </span>
          <span className="text-xs text-gov-text/50 ml-2">(optional)</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gov-text/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gov-text/40" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Privacy note first — before any inputs */}
          <PrivacyNote variant="detailed" />

          {/* Age bracket */}
          <div>
            <p className="text-sm text-gov-text/70 mb-2">
              Age range <span className="text-gov-text/40">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {AGE_BRACKETS.map((b) => (
                <button
                  key={b.value}
                  onClick={() =>
                    onAgeBracketChange(ageBracket === b.value ? null : b.value)
                  }
                  className={`px-3 py-1.5 text-sm border cursor-pointer transition-all ${
                    ageBracket === b.value
                      ? "bg-gov-navy text-white border-gov-navy"
                      : "bg-white text-gov-text/70 border-gov-well-border hover:border-gov-navy/30"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Income bracket */}
          <div>
            <p className="text-sm text-gov-text/70 mb-2">
              Approximate household income{" "}
              <span className="text-gov-text/40">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {INCOME_BRACKETS.map((b) => (
                <button
                  key={b.value}
                  onClick={() =>
                    onIncomeBracketChange(
                      incomeBracket === b.value ? null : b.value
                    )
                  }
                  className={`px-3 py-1.5 text-sm border cursor-pointer transition-all ${
                    incomeBracket === b.value
                      ? "bg-gov-navy text-white border-gov-navy"
                      : "bg-white text-gov-text/70 border-gov-well-border hover:border-gov-navy/30"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gov-text/40 mt-1.5">
              We never store your exact income — only the bracket you choose.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
