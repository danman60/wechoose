import type { Metadata } from "next";
import { EmbedAllocator } from "@/components/allocator/embed-allocator";

export const metadata: Metadata = {
  title: "WeChoose — Quick Budget Allocator",
  description: "Allocate Canada's federal budget in 6 key categories.",
};

export default function EmbedPage() {
  return (
    <div className="max-w-[600px] mx-auto p-4">
      <div className="text-center mb-4">
        <h1 className="text-xl font-heading font-bold text-gov-navy">
          How would YOU spend Canada&apos;s budget?
        </h1>
        <p className="text-sm text-gov-text/60 mt-1">
          Allocate 100% across 6 key categories.
        </p>
      </div>
      <EmbedAllocator />
      <div className="text-center mt-4 pt-3 border-t border-gov-separator">
        <p className="text-xs text-gov-text/50">
          Powered by{" "}
          <a
            href="https://wechoose-two.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gov-link hover:text-gov-link-hover"
          >
            WeChoose
          </a>{" "}
          — Full allocator with 14 categories available at wechoose-two.vercel.app
        </p>
        <div className="mt-3 p-3 bg-gov-well text-left">
          <p className="text-xs text-gov-text/60 mb-1 font-bold">Embed this on your site:</p>
          <code className="text-xs text-gov-text/70 break-all">
            &lt;iframe src=&quot;https://wechoose-two.vercel.app/embed&quot;
            width=&quot;100%&quot; height=&quot;600&quot; frameborder=&quot;0&quot;
            style=&quot;max-width:600px&quot;&gt;&lt;/iframe&gt;
          </code>
        </div>
      </div>
    </div>
  );
}
