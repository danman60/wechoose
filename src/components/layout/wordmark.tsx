import Link from "next/link";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={`no-underline flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width="28"
        height="20"
        viewBox="0 0 28 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Maple leaf"
      >
        <path
          d="M14 0L15.5 5.5L18 4L17 8L22 7L19 10.5L24 12L19.5 13L21 17L16.5 14.5L14 20L11.5 14.5L7 17L8.5 13L4 12L9 10.5L6 7L11 8L10 4L12.5 5.5L14 0Z"
          fill="#AF3C43"
        />
      </svg>
      <span className="font-heading text-[22px] font-bold tracking-tight text-gov-navy">
        WeChoose
      </span>
    </Link>
  );
}
