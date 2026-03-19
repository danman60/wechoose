import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Budget Allocation — WeChoose",
  description:
    "See how one Canadian would allocate the federal budget — and compare to the government's actual spending.",
};

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 text-center">
      <h1 className="gov-h1 text-3xl mb-4">A Canadian&apos;s Budget</h1>
      <p className="text-lg text-gov-text/70 mb-8">
        Allocation ID: {id}
      </p>
      <p className="text-gov-text/60 mb-8">
        Detailed shareable view coming soon. For now, see the full results.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/results"
          className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-6 py-3 font-bold cursor-pointer transition-colors duration-200"
        >
          See All Results
        </Link>
        <Link
          href="/allocate"
          className="inline-block border-2 border-gov-navy text-gov-navy no-underline hover:bg-gov-navy/5 px-6 py-3 font-bold cursor-pointer transition-colors duration-200"
        >
          Make Your Own
        </Link>
      </div>
    </div>
  );
}
