"use client";

import { Mail } from "lucide-react";
import type { Riding } from "@/lib/data/ridings";

interface EmailMPButtonProps {
  riding: Riding;
  topGaps?: { name: string; userPct: number; govPct: number }[];
  totalVoices?: number;
}

export function EmailMPButton({
  riding,
  topGaps,
  totalVoices,
}: EmailMPButtonProps) {
  const subject = encodeURIComponent(
    `How ${riding.name} residents would allocate the federal budget`
  );

  let bodyText = `Dear ${riding.mp_name},\n\n`;
  bodyText += `I used WeChoose (wechoose-two.vercel.app) to allocate the federal budget based on my priorities as a resident of ${riding.name}.\n\n`;

  if (topGaps && topGaps.length > 0) {
    bodyText += `Here's where I disagree with current spending:\n`;
    for (const gap of topGaps) {
      const diff = gap.userPct - gap.govPct;
      bodyText += `- ${gap.name}: I chose ${gap.userPct.toFixed(1)}%, the government spends ${gap.govPct.toFixed(1)}% (${diff > 0 ? "+" : ""}${diff.toFixed(1)}%)\n`;
    }
    bodyText += "\n";
  }

  if (totalVoices && totalVoices > 0) {
    bodyText += `${totalVoices.toLocaleString()} Canadians have already weighed in on WeChoose.\n\n`;
  }

  bodyText += `I encourage you to look at the aggregate results and consider whether the federal budget reflects the priorities of your constituents.\n\n`;
  bodyText += `See the results: https://wechoose-two.vercel.app/results\n\n`;
  bodyText += `Sincerely,\nA concerned constituent of ${riding.name}`;

  const body = encodeURIComponent(bodyText);
  const mailto = `mailto:${riding.mp_email}?subject=${subject}&body=${body}`;

  return (
    <a
      href={mailto}
      className="inline-flex items-center gap-2 bg-gov-red text-white no-underline hover:bg-gov-red/90 px-5 py-2.5 text-sm font-bold cursor-pointer transition-colors duration-200"
    >
      <Mail className="w-4 h-4" />
      Email Your MP: {riding.mp_name} ({riding.mp_party})
    </a>
  );
}
