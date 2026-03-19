"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postalCodeToProvince } from "@/lib/utils";

interface PostalCodeInputProps {
  onPostalCodeChange: (postalCode: string, province: string | null) => void;
}

export function PostalCodeInput({ onPostalCodeChange }: PostalCodeInputProps) {
  const [value, setValue] = useState("");
  const [province, setProvince] = useState<string | null>(null);

  const PROVINCE_NAMES: Record<string, string> = {
    AB: "Alberta",
    BC: "British Columbia",
    MB: "Manitoba",
    NB: "New Brunswick",
    NL: "Newfoundland and Labrador",
    NS: "Nova Scotia",
    NT: "Northwest Territories",
    NU: "Nunavut",
    ON: "Ontario",
    PE: "Prince Edward Island",
    QC: "Quebec",
    SK: "Saskatchewan",
    YT: "Yukon",
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    // Format: A1A 1A1
    let formatted = raw;
    if (raw.length > 3) {
      formatted = raw.slice(0, 3) + " " + raw.slice(3, 6);
    }
    setValue(formatted);

    const prov = raw.length >= 1 ? postalCodeToProvince(raw) : null;
    setProvince(prov);
    onPostalCodeChange(formatted, prov);
  }

  return (
    <div>
      <Label htmlFor="postal-code" className="text-base text-gov-text mb-1 block">
        Postal Code <span className="text-gov-text/50">(optional)</span>
      </Label>
      <Input
        id="postal-code"
        value={value}
        onChange={handleChange}
        placeholder="K1A 0A6"
        maxLength={7}
        className="w-40 text-base border-gov-well-border"
      />
      {province && (
        <p className="text-sm text-gov-text/60 mt-1">
          {PROVINCE_NAMES[province] ?? province}
        </p>
      )}
    </div>
  );
}
