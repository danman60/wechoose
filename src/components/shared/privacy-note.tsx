"use client";

import { useState } from "react";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface PrivacyNoteProps {
  variant: "compact" | "inline" | "detailed";
  className?: string;
}

export function PrivacyNote({ variant, className = "" }: PrivacyNoteProps) {
  const [expanded, setExpanded] = useState(false);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-gov-text/50 ${className}`}>
        <Shield className="w-3 h-3 shrink-0" />
        <span>
          Anonymous &amp; private.{" "}
          <Link
            href="/privacy"
            className="text-gov-link hover:text-gov-link-hover"
          >
            Learn more
          </Link>
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex items-start gap-2 text-sm text-gov-text/60 bg-gov-well/50 px-3 py-2 ${className}`}
      >
        <Shield className="w-4 h-4 shrink-0 mt-0.5 text-gov-navy/40" />
        <p className="leading-relaxed m-0">
          This data is aggregated from anonymous responses. No individual
          allocations are ever shown. We never collect names, emails, or
          identifying information.{" "}
          <Link
            href="/privacy"
            className="text-gov-link hover:text-gov-link-hover"
          >
            Privacy policy
          </Link>
        </p>
      </div>
    );
  }

  // detailed
  return (
    <div className={`border border-gov-well-border bg-white ${className}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 cursor-pointer bg-transparent border-0 text-left"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gov-navy/60" />
          <span className="text-sm font-bold text-gov-text">
            Your privacy is protected
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gov-text/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gov-text/40" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 text-sm text-gov-text/70 space-y-2">
          <p className="font-bold text-gov-text/80">
            Can someone find out I did this? No.
          </p>
          <p>WeChoose <strong>never</strong> collects:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>Your name or email</li>
            <li>Your Social Insurance Number</li>
            <li>Your IP address (it&apos;s hashed one-way and discarded)</li>
            <li>Cookies or device fingerprints</li>
            <li>Your exact income (only the bracket you choose)</li>
          </ul>
          <p>
            All demographic questions are optional. Your responses are mixed
            into aggregate totals and can never be separated out or traced
            back to you. Demographic breakdowns are only shown when at least
            3 people share a group, to prevent anyone from being identified.
          </p>
          <Link
            href="/privacy"
            className="text-gov-link hover:text-gov-link-hover"
          >
            Read full privacy policy
          </Link>
        </div>
      )}
    </div>
  );
}
