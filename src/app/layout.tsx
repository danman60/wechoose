import type { Metadata } from "next";
import { Lato, Noto_Sans } from "next/font/google";
import { GovHeader } from "@/components/layout/gov-header";
import { GovFooter } from "@/components/layout/gov-footer";
import "./globals.css";

const lato = Lato({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WeChoose — How Would YOU Spend Canada's Budget?",
  description:
    "A direct democracy platform where Canadians allocate the federal budget, see aggregate results, and compare to government spending. Your voice. Your taxes. Your choice.",
  openGraph: {
    title: "WeChoose — How Would YOU Spend Canada's Budget?",
    description:
      "Allocate Canada's $521 billion federal budget. See how your priorities compare to the government's actual spending — and to other Canadians.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GovHeader />
        <main className="flex-1">{children}</main>
        <GovFooter />
        <script
          src="https://ddd-one-tawny.vercel.app/feedback-widget.js"
          data-project="WeChoose"
          data-color="#26374A"
          defer
        />
      </body>
    </html>
  );
}
