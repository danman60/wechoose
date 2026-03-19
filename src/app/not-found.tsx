import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
      <h1 className="gov-h1 text-3xl mb-4">Page not found</h1>
      <p className="text-lg text-gov-text/70 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block bg-gov-navy text-white no-underline hover:bg-gov-navy/90 px-6 py-3 font-bold cursor-pointer transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}
