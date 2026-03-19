import Link from "next/link";
import { Wordmark } from "./wordmark";

export function GovFooter() {
  return (
    <footer className="mt-auto">
      {/* Main footer */}
      <div className="bg-gov-navy text-white">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-[22px] mb-4">WeChoose</h3>
              <p className="text-white/80 text-base leading-relaxed">
                A direct democracy platform. See how Canadians would actually
                spend the federal budget — and how it compares to reality.
              </p>
            </div>
            <div>
              <h3 className="text-white text-[22px] mb-4">Navigate</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/allocate"
                    className="text-white/80 hover:text-white no-underline text-base transition-colors duration-200"
                  >
                    Allocate Your Budget
                  </Link>
                </li>
                <li>
                  <Link
                    href="/results"
                    className="text-white/80 hover:text-white no-underline text-base transition-colors duration-200"
                  >
                    See Results
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tax-truth"
                    className="text-white/80 hover:text-white no-underline text-base transition-colors duration-200"
                  >
                    Tax Truth Calculator
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-[22px] mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-white/80 hover:text-white no-underline text-base transition-colors duration-200"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-white/80 hover:text-white no-underline text-base transition-colors duration-200"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="bg-gov-subfooter border-t border-gov-separator">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gov-text/60">
            Data source: Department of Finance Canada, Fiscal Year 2023-2024.
            This is not an official government website.
          </p>
          <Wordmark className="opacity-60" />
        </div>
      </div>
    </footer>
  );
}
