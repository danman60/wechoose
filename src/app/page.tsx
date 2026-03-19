import Link from "next/link";
import { getTotalAllocations } from "@/lib/actions/aggregates";
import { TOTAL_SPENDING_BILLIONS, TOTAL_REVENUE_BILLIONS, DEFICIT_BILLIONS } from "@/lib/data/budget-categories";
import { formatCurrency } from "@/lib/utils";
import { LiveCounter } from "@/components/results/live-counter";

export default async function HomePage() {
  const totalAllocations = await getTotalAllocations();

  return (
    <div>
      {/* Hero — navy background like canada.ca */}
      <section className="bg-gov-navy text-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-white text-4xl md:text-5xl font-heading font-bold leading-tight max-w-[700px]">
            The government spends{" "}
            <span className="text-white/90">
              {formatCurrency(TOTAL_SPENDING_BILLIONS)}
            </span>{" "}
            of your money every year.{" "}
            <em>They never asked how.</em>
          </h1>
          <p className="text-white/80 text-xl mt-4 max-w-[600px] leading-relaxed">
            Allocate the federal budget by your priorities. See how your choices
            compare to the government&apos;s actual spending — and to other
            Canadians.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/allocate"
              className="inline-block bg-white text-gov-navy no-underline hover:bg-white/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200 text-center"
            >
              Allocate My Budget
            </Link>
            <Link
              href="/results"
              className="inline-block bg-transparent border-2 border-white text-white no-underline hover:bg-white/10 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200 text-center"
            >
              See Results
            </Link>
          </div>
          {/* Live counter */}
          <div className="mt-6">
            <LiveCounter initialCount={totalAllocations} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="gov-h1 text-3xl mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Allocate",
                desc: "Drag sliders to distribute 100% of the federal budget across 14 spending categories. Forced trade-offs mean real choices.",
              },
              {
                step: "2",
                title: "Compare",
                desc: "See your budget side-by-side with the government's actual spending and the aggregate choices of all Canadians.",
              },
              {
                step: "3",
                title: "Share",
                desc: "Generate a shareable result card showing the gap between what citizens want and what government does. Email your MP.",
              },
            ].map((item) => (
              <div key={item.step} className="gov-well">
                <div className="w-10 h-10 bg-gov-navy text-white flex items-center justify-center font-heading font-bold text-lg mb-3">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-base text-gov-text/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget snapshot */}
      <section className="py-16 bg-gov-well">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="gov-h1 text-3xl mb-10">
            Canada&apos;s Budget at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-t-4 border-gov-navy">
              <p className="text-sm text-gov-text/60 uppercase tracking-wide">
                Total Revenue
              </p>
              <p className="text-3xl font-heading font-bold text-gov-navy mt-1">
                {formatCurrency(TOTAL_REVENUE_BILLIONS)}
              </p>
              <p className="text-sm text-gov-text/60 mt-1">
                What Canadians pay in taxes
              </p>
            </div>
            <div className="bg-white p-6 border-t-4 border-gov-red">
              <p className="text-sm text-gov-text/60 uppercase tracking-wide">
                Total Spending
              </p>
              <p className="text-3xl font-heading font-bold text-gov-red mt-1">
                {formatCurrency(TOTAL_SPENDING_BILLIONS)}
              </p>
              <p className="text-sm text-gov-text/60 mt-1">
                What the government spends
              </p>
            </div>
            <div className="bg-white p-6 border-t-4 border-diff-negative">
              <p className="text-sm text-gov-text/60 uppercase tracking-wide">
                Deficit
              </p>
              <p className="text-3xl font-heading font-bold text-diff-negative mt-1">
                -{formatCurrency(DEFICIT_BILLIONS)}
              </p>
              <p className="text-sm text-gov-text/60 mt-1">
                Spending beyond revenue
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Truth teaser */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="gov-h1 text-3xl mb-6">
            How Much Do You Really Pay?
          </h2>
          <p className="text-lg text-gov-text/70 max-w-[700px] mb-6">
            Income tax is just the beginning. Add CPP, EI, GST/HST, carbon
            levies, and excise taxes — your total tax burden is likely higher
            than you think.
          </p>
          <Link
            href="/tax-truth"
            className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-6 py-3 text-base font-bold cursor-pointer transition-colors duration-200"
          >
            Calculate My Total Tax
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gov-navy text-white text-center">
        <div className="max-w-[700px] mx-auto px-4">
          <h2 className="text-white text-3xl font-heading font-bold mb-4">
            Your taxes. Your priorities. Your voice.
          </h2>
          <p className="text-white/80 text-lg mb-8">
            The government decides how to spend your money. WeChoose lets you
            show them what you&apos;d do differently.
          </p>
          <Link
            href="/allocate"
            className="inline-block bg-white text-gov-navy no-underline hover:bg-white/90 px-8 py-3 text-lg font-bold cursor-pointer transition-colors duration-200"
          >
            Make Your Voice Heard
          </Link>
        </div>
      </section>
    </div>
  );
}
