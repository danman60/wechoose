import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — WeChoose",
  description:
    "How WeChoose works, where the data comes from, and why we built it.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; About
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-8">
        About WeChoose
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-heading font-bold mb-3">What is this?</h2>
          <p className="text-gov-text/80 leading-relaxed">
            WeChoose is a direct democracy platform that asks a simple question
            the government never does: <strong>How would YOU spend the budget?</strong>
          </p>
          <p className="text-gov-text/80 leading-relaxed mt-3">
            Allocate Canada&apos;s $521.4 billion federal budget across 14
            spending categories. See how your priorities compare to the
            government&apos;s actual spending — and to the aggregate choices of
            all participants.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold mb-3">
            Where does the data come from?
          </h2>
          <p className="text-gov-text/80 leading-relaxed">
            All budget and revenue data comes from official Government of Canada
            sources:
          </p>
          <ul className="mt-3 space-y-2 text-gov-text/80">
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>Spending data:</strong> Department of Finance Canada,
              Fiscal Reference Tables December 2024, and the Annual Financial
              Report 2023-24 (audited actuals).
            </li>
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>Revenue data:</strong> Department of Finance Canada,
              Fiscal Reference Tables 2024, Revenue section.
            </li>
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>Tax brackets:</strong> Canada Revenue Agency, 2023 tax
              year rates.
            </li>
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>Departmental estimates:</strong> Treasury Board
              Secretariat, 2025-26 Main Estimates.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold mb-3">
            How are duplicates prevented?
          </h2>
          <p className="text-gov-text/80 leading-relaxed">
            Each response is tied to your internet connection using a one-way
            cryptographic hash. We never store your IP address — only a
            scrambled fingerprint that can&apos;t be traced back to you. One
            voice per connection. If you submit again, your previous allocation
            is updated.
          </p>
          <p className="text-gov-text/80 leading-relaxed mt-3">
            No account or login is required. We don&apos;t collect names,
            emails, or any personal information. See our{" "}
            <Link href="/privacy" className="text-gov-link">
              Privacy Policy
            </Link>{" "}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold mb-3">
            Why does it look like a government website?
          </h2>
          <p className="text-gov-text/80 leading-relaxed">
            That&apos;s the point. WeChoose is designed to feel like the
            official government experience — because this is what government
            SHOULD look like. A platform where citizens have a direct say in how
            their money is spent.
          </p>
          <p className="text-gov-text/80 leading-relaxed mt-3">
            <strong>This is NOT an official Government of Canada website.</strong>{" "}
            It is an independent civic engagement platform created to inspire
            curiosity and participation in democracy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold mb-3">Methodology</h2>
          <p className="text-gov-text/80 leading-relaxed">
            We simplified the federal budget into 14 citizen-friendly categories.
            The actual federal budget has hundreds of line items across dozens of
            departments — we grouped related spending to make meaningful choices
            possible. Percentages are normalized to 100% for the allocation
            exercise.
          </p>
          <p className="text-gov-text/80 leading-relaxed mt-3">
            The Tax Truth Calculator provides estimates based on standard tax
            brackets and average spending patterns. Actual taxes vary based on
            deductions, credits, and individual circumstances.
          </p>
        </section>

        <section className="gov-well">
          <h2 className="text-2xl font-heading font-bold mb-3">
            Ready to weigh in?
          </h2>
          <Link
            href="/allocate"
            className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-6 py-3 text-base font-bold cursor-pointer transition-colors duration-200"
          >
            Allocate My Budget
          </Link>
        </section>
      </div>
    </div>
  );
}
