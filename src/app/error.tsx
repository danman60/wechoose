"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
      <h1 className="gov-h1 text-3xl mb-4">Something went wrong</h1>
      <p className="text-lg text-gov-text/70 mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-gov-navy text-white px-6 py-3 font-bold cursor-pointer hover:bg-gov-navy/90 transition-colors duration-200"
      >
        Try Again
      </button>
      {error.digest && (
        <p className="text-sm text-gov-text/40 mt-4">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
