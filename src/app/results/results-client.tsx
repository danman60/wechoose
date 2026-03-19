"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ComparisonChart } from "@/components/results/comparison-chart";
import { AggregateCounter } from "@/components/results/aggregate-counter";
import { GapCards } from "@/components/results/gap-card";
import { ConsequencePanel } from "@/components/results/consequence-panel";
import { DemographicComparison } from "@/components/results/demographic-comparison";
import { YourTaxDollars } from "@/components/results/your-tax-dollars";
import { ShareButtons } from "@/components/shared/share-buttons";
import { EmailMPButton } from "@/components/shared/email-mp-button";
import { PrivacyNote } from "@/components/shared/privacy-note";
import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";
import type { Riding } from "@/lib/data/ridings";
import type { AggregateCache, AgeBracket, IncomeBracket } from "@/types";

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
  const [allocationId, setAllocationId] = useState<string | null>(null);
  const [riding, setRiding] = useState<Riding | null>(null);
  const [ageBracket, setAgeBracket] = useState<AgeBracket | null>(null);
  const [incomeBracket, setIncomeBracket] = useState<IncomeBracket | null>(null);
  const [province, setProvince] = useState<string | null>(null);
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
    const storedId = sessionStorage.getItem("wechoose_allocation_id");
    if (storedId) setAllocationId(storedId);

    // Load riding from sessionStorage
    const storedRiding = sessionStorage.getItem("wechoose_riding");
    if (storedRiding) {
      try {
        setRiding(JSON.parse(storedRiding));
      } catch {
        // ignore
      }
    }

    // Load demographics from sessionStorage
    const storedAge = sessionStorage.getItem("wechoose_age_bracket") as AgeBracket | null;
    if (storedAge) setAgeBracket(storedAge);
    const storedIncome = sessionStorage.getItem("wechoose_income_bracket") as IncomeBracket | null;
    if (storedIncome) setIncomeBracket(storedIncome);
    const storedProvince = sessionStorage.getItem("wechoose_province");
    if (storedProvince) setProvince(storedProvince);

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

      <h1 className="gov-h1 text-3xl md:text-4xl mb-2">
        Here&apos;s what Canadians actually want — and what they actually get.
      </h1>
      <p className="text-lg text-gov-text/70 mb-4">
        The People&apos;s Budget vs. The Government&apos;s Budget
      </p>

      {/* Privacy info bar */}
      <PrivacyNote variant="inline" className="mb-6" />

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

          {/* Your Tax Dollars + Tax Freedom Day */}
          {incomeBracket && userAllocations && (
            <YourTaxDollars
              incomeBracket={incomeBracket}
              province={province}
              userAllocations={userAllocations}
            />
          )}

          {/* Demographic Comparison */}
          {(ageBracket || incomeBracket) && (
            <DemographicComparison
              ageBracket={ageBracket}
              incomeBracket={incomeBracket}
              nationalAggregates={peopleAggregates}
            />
          )}

          {/* Gap Cards */}
          {userAllocations && (
            <div className="mt-8">
              <GapCards userAllocations={userAllocations} />
            </div>
          )}

          {/* Consequence Simulator */}
          {userAllocations && (
            <ConsequencePanel userAllocations={userAllocations} />
          )}

          {/* Email Your MP */}
          {riding && userAllocations && (
            <div className="mt-8 p-6 bg-gov-well border-t-4 border-gov-red">
              <h2 className="text-xl font-heading font-bold mb-2">
                Tell your MP how you feel
              </h2>
              <p className="text-sm text-gov-text/70 mb-4">
                Your MP is{" "}
                <strong>
                  {riding.mp_name} ({riding.mp_party})
                </strong>{" "}
                representing {riding.name}.
              </p>
              <EmailMPButton
                riding={riding}
                topGaps={BUDGET_CATEGORIES.map((cat) => ({
                  name: cat.name,
                  userPct: userAllocations[cat.slug] ?? 0,
                  govPct: cat.actual_percentage,
                }))
                  .sort(
                    (a, b) =>
                      Math.abs(b.userPct - b.govPct) -
                      Math.abs(a.userPct - a.govPct)
                  )
                  .slice(0, 3)}
                totalVoices={data?.totalAllocations}
              />
            </div>
          )}

          {/* Share CTA */}
          <div className="text-center py-12 mt-8 border-t border-gov-separator">
            <h2 className="text-2xl font-heading font-bold text-gov-navy mb-4">
              Share the Results
            </h2>
            <p className="text-gov-text/70 mb-6">
              Show people the gap between what citizens want and what government
              does.
            </p>
            <ShareButtons
              url={
                allocationId
                  ? `${window.location.origin}/results/share/${allocationId}`
                  : window.location.origin + "/results"
              }
            />
            <div className="mt-6">
              <Link
                href="/allocate"
                className="bg-transparent border-2 border-gov-navy text-gov-navy no-underline px-6 py-3 font-bold cursor-pointer hover:bg-gov-navy/5 transition-colors duration-200 text-center inline-block"
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
