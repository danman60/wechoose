"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  text?: string;
}

export function ShareButtons({
  url,
  text = "I used WeChoose to allocate Canada's $521B budget. The gap between what citizens want and what government spends is eye-opening.",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#1DA1F2] text-white no-underline hover:bg-[#1a8cd8] px-5 py-2.5 text-sm font-bold cursor-pointer transition-colors duration-200"
      >
        <Share2 className="w-4 h-4" />
        Share on X
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#1877F2] text-white no-underline hover:bg-[#166fe5] px-5 py-2.5 text-sm font-bold cursor-pointer transition-colors duration-200"
      >
        <Share2 className="w-4 h-4" />
        Share on Facebook
      </a>
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 bg-gov-navy text-white px-5 py-2.5 text-sm font-bold cursor-pointer hover:bg-gov-navy/90 transition-colors duration-200"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}
