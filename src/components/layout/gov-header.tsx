"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./wordmark";

const NAV_ITEMS = [
  { href: "/allocate", label: "Allocate" },
  { href: "/results", label: "Results" },
  { href: "/provinces", label: "Provinces" },
  { href: "/trends", label: "Trends" },
  { href: "/tax-truth", label: "Tax Truth" },
  { href: "/about", label: "About" },
];

export function GovHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-gov-navy">
        <div className="max-w-[1200px] mx-auto px-4 py-1 flex justify-between items-center">
          <span className="text-white/70 text-sm">
            The People&apos;s Platform
          </span>
          <span className="text-white/70 text-sm">
            English
          </span>
        </div>
      </div>

      {/* Brand bar */}
      <div className="border-b border-gov-separator">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center">
          <Wordmark />
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="no-underline text-gov-link hover:text-gov-link-hover px-3 py-2 text-base transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button
            className="md:hidden cursor-pointer p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gov-text" />
            ) : (
              <Menu className="w-6 h-6 text-gov-text" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gov-separator bg-white">
          <div className="max-w-[1200px] mx-auto px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block no-underline text-gov-link hover:text-gov-link-hover py-3 text-base border-b border-gov-separator last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
