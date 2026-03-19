"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postalCodeToProvince } from "@/lib/utils";
import { getRidingsByFSA, type Riding } from "@/lib/data/ridings";

interface PostalCodeInputProps {
  onPostalCodeChange: (postalCode: string, province: string | null) => void;
}

export function PostalCodeInput({ onPostalCodeChange }: PostalCodeInputProps) {
  const [value, setValue] = useState("");
  const [province, setProvince] = useState<string | null>(null);
  const [ridings, setRidings] = useState<Riding[]>([]);

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

    // Look up ridings when we have at least 3 chars (FSA)
    if (raw.length >= 3) {
      const fsa = raw.slice(0, 3);
      const found = getRidingsByFSA(fsa);
      setRidings(found);
      // Store riding info in sessionStorage for results page
      if (found.length === 1) {
        sessionStorage.setItem("wechoose_riding", JSON.stringify(found[0]));
      } else if (found.length > 1) {
        sessionStorage.setItem("wechoose_ridings", JSON.stringify(found));
      }
    } else {
      setRidings([]);
    }
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
      {ridings.length === 1 && (
        <p className="text-xs text-gov-text/60 mt-0.5">
          Riding:{" "}
          <Link
            href={`/riding/${ridings[0].slug}`}
            className="text-gov-link hover:text-gov-link-hover"
          >
            {ridings[0].name}
          </Link>{" "}
          — MP: {ridings[0].mp_name} ({ridings[0].mp_party})
        </p>
      )}
      {ridings.length > 1 && ridings.length <= 5 && (
        <div className="text-xs text-gov-text/60 mt-0.5">
          <span>Possible ridings:</span>
          <div className="flex flex-col gap-0.5 mt-0.5">
            {ridings.map((r) => (
              <Link
                key={r.slug}
                href={`/riding/${r.slug}`}
                className="text-gov-link hover:text-gov-link-hover"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {ridings.length > 5 && (
        <p className="text-xs text-gov-text/60 mt-0.5">
          {ridings.length} ridings found.{" "}
          <a
            href="https://www.ourcommons.ca/members/en/search"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gov-link hover:text-gov-link-hover"
          >
            Find your exact riding
          </a>
        </p>
      )}
    </div>
  );
}
