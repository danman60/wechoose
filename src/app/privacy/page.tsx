import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — WeChoose",
  description: "How WeChoose protects your privacy while enabling civic participation.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <nav className="text-sm text-gov-text/60 mb-4">
        <a href="/" className="text-gov-link hover:text-gov-link-hover">
          Home
        </a>{" "}
        &gt; Privacy
      </nav>

      <h1 className="gov-h1 text-3xl md:text-4xl mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-gov-text/80 leading-relaxed">
        <section>
          <h2 className="text-2xl font-heading font-bold text-gov-text mb-3">
            What we collect
          </h2>
          <ul className="space-y-2">
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>Your budget allocation</strong> — the percentage you assign
              to each category.
            </li>
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>A hashed connection identifier</strong> — a one-way
              cryptographic hash of your IP address, combined with a secret salt.
              This cannot be reversed to reveal your IP address.
            </li>
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>Postal code</strong> (if you provide it) — used to
              determine your province for geographic breakdowns. Stored as-is.
            </li>
            <li className="pl-4 border-l-2 border-gov-navy/30">
              <strong>Income</strong> (if you use the Tax Truth calculator) —
              used only for calculation, stored with your allocation for aggregate
              analysis.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold text-gov-text mb-3">
            What we DO NOT collect
          </h2>
          <ul className="space-y-2">
            <li className="pl-4 border-l-2 border-diff-positive/50">
              Your name
            </li>
            <li className="pl-4 border-l-2 border-diff-positive/50">
              Your email address
            </li>
            <li className="pl-4 border-l-2 border-diff-positive/50">
              Your raw IP address (only the hash)
            </li>
            <li className="pl-4 border-l-2 border-diff-positive/50">
              Cookies for tracking or advertising
            </li>
            <li className="pl-4 border-l-2 border-diff-positive/50">
              Any analytics or third-party trackers
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold text-gov-text mb-3">
            How IP hashing works
          </h2>
          <p>
            When you submit an allocation, we take your IP address and combine
            it with a secret key stored on our server. This combination is then
            run through SHA-256, a one-way cryptographic function. The result is
            a fixed-length string of characters that uniquely identifies your
            connection but <strong>cannot be reversed</strong> to reveal your IP
            address.
          </p>
          <p className="mt-3">
            We use this hash solely to prevent duplicate submissions. If you
            submit again from the same connection, your previous allocation is
            updated rather than creating a duplicate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold text-gov-text mb-3">
            Data storage
          </h2>
          <p>
            All data is stored in a Supabase database with row-level security
            policies. Aggregate results (averages across all users) are
            displayed publicly. Individual allocations are not publicly
            accessible — only the aggregate is shown.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold text-gov-text mb-3">
            Your rights
          </h2>
          <p>
            Since we don&apos;t collect personal identifiers, we cannot look up
            your specific allocation. If you wish to change your allocation,
            simply submit again from the same connection — your previous entry
            will be overwritten.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-bold text-gov-text mb-3">
            Contact
          </h2>
          <p>
            Questions about privacy? Use the feedback widget in the bottom-right
            corner of any page.
          </p>
        </section>
      </div>
    </div>
  );
}
