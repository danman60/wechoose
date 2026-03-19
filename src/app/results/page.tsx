import type { Metadata } from "next";
import { ResultsClient } from "./results-client";

export const metadata: Metadata = {
  title: "Results — WeChoose",
  description:
    "See how Canadians would actually spend the federal budget — compared to the government's actual allocations.",
};

export default function ResultsPage() {
  return <ResultsClient />;
}
