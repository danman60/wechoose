"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendsChartProps {
  data: Record<string, unknown>[];
  categories: { slug: string; name: string; actual: number }[];
}

const COLORS = [
  "#2E86DE",
  "#AF3C43",
  "#27AE60",
  "#E74C3C",
  "#8B5CF6",
  "#F59E0B",
  "#EC4899",
  "#10B981",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#EF4444",
  "#3B82F6",
];

export function TrendsChart({ data, categories }: TrendsChartProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(categories.slice(0, 5).map((c) => c.slug))
  );

  function toggleCategory(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  if (data.length < 2) {
    return (
      <div className="text-center py-8 bg-gov-well">
        <p className="text-gov-text/60">
          Trends require at least 2 daily snapshots. Currently have {data.length}.
          Check back tomorrow.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat, i) => (
          <button
            key={cat.slug}
            onClick={() => toggleCategory(cat.slug)}
            className={`text-xs px-3 py-1.5 border cursor-pointer transition-all ${
              selected.has(cat.slug)
                ? "text-white border-transparent"
                : "text-gov-text/60 border-gov-well-border bg-white hover:bg-gov-well"
            }`}
            style={
              selected.has(cat.slug)
                ? { backgroundColor: COLORS[i % COLORS.length] }
                : undefined
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E3E3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#666" }}
              tickFormatter={(v: string) => {
                const d = new Date(v + "T12:00:00");
                return d.toLocaleDateString("en-CA", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#666" }}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              formatter={(value, name) => {
                const cat = categories.find((c) => c.slug === name);
                return [`${Number(value).toFixed(1)}%`, cat?.name ?? String(name)];
              }}
            />
            <Legend
              formatter={(value: string) => {
                const cat = categories.find((c) => c.slug === value);
                return cat?.name ?? value;
              }}
            />
            {categories.map(
              (cat, i) =>
                selected.has(cat.slug) && (
                  <Line
                    key={cat.slug}
                    type="monotone"
                    dataKey={cat.slug}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
