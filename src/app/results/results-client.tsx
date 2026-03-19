"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ComparisonChart } from "@/components/results/comparison-chart";
import { AggregateCounter } from "@/components/results/aggregate-counter";
import type { AggregateCache } from "@/types";

interface EnrichedAggregate extends AggregateCache {
  category_slug: string;
}

interface AggregateResponse {
  aggregates: EnrichedAggregate[];
  totalAllocations: number;
}

export function ResultsClient() {
  const [data, setData] = useState<AggregateResponse | null>(null);
  const [userAllocations, setUserAllocations] = useState<Record<
    string,
    number
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user's allocation from sessionStorage
    const stored = sessionStorage.getItem("wechoose_allocation");
    if (stored) {
      try {
        setUserAllocations(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    // Fetch aggregates
    fetch("/api/aggregate")
      .then((res) => res.json())
      .then((result: AggregateResponse) => {
        setData(result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Build people aggregates map keyed by slug
  const peopleAggregates: Record<string, number> = {};
  if (data?.aggregates) {
    for (const agg of data.aggregates) {
      peopleAggregates[agg.category_slug] = agg.average_percentage;
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; Results
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-6">
        The People&apos;s Budget vs. The Government&apos;s Budget
      </h1>

      {loading ? (
        <div className="py-16 text-center">
          <div className="text-lg text-gov-text/60 animate-pulse">
            Loading results...
          </div>
        </div>
      ) : data && data.totalAllocations > 0 ? (
        <>
          {/* Counter */}
          <div className="py-8 mb-8 border-b border-gov-separator">
            <AggregateCounter target={data.totalAllocations} />
          </div>

          {/* Comparison chart */}
          <ComparisonChart
            userAllocations={userAllocations}
            peopleAggregates={peopleAggregates}
            totalAllocations={data.totalAllocations}
          />

          {/* Share CTA */}
          <div className="text-center py-12 mt-8 border-t border-gov-separator">
            <h2 className="text-2xl font-heading font-bold text-gov-navy mb-4">
              Share the Results
            </h2>
            <p className="text-gov-text/70 mb-6">
              Show people the gap between what citizens want and what government
              does.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const text = `I used WeChoose to allocate Canada's $521B budget. The gap between what citizens want and what government spends is eye-opening. Try it: ${window.location.origin}`;
                  navigator.clipboard.writeText(text);
                }}
                className="bg-gov-navy text-white px-6 py-3 font-bold cursor-pointer hover:bg-gov-navy/90 transition-colors duration-200"
              >
                Copy Share Text
              </button>
              <Link
                href="/allocate"
                className="bg-transparent border-2 border-gov-navy text-gov-navy no-underline px-6 py-3 font-bold cursor-pointer hover:bg-gov-navy/5 transition-colors duration-200 text-center"
              >
                Make Your Own Allocation
              </Link>
            </div>
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="py-16 text-center">
          <h2 className="text-2xl font-heading font-bold text-gov-navy mb-4">
            No allocations yet — be the first!
          </h2>
          <p className="text-lg text-gov-text/70 mb-8">
            Once Canadians start weighing in, you&apos;ll see the aggregate
            people&apos;s budget here.
          </p>
          <Link
            href="/allocate"
            className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200"
          >
            Allocate My Budget
          </Link>
        </div>
      )}
    </div>
  );
}
