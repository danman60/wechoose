import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { BUDGET_CATEGORIES, TOTAL_SPENDING_BILLIONS } from "@/lib/data/budget-categories";

export const runtime = "nodejs";
export const alt = "My Budget Allocation — WeChoose";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch allocation with items
  const supabase = await createClient();
  const { data: allocation } = await supabase
    .from("allocations")
    .select("*, allocation_items(*)")
    .eq("id", id)
    .single();

  if (!allocation) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#26374A",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700 }}>WeChoose</div>
          <div style={{ fontSize: 24, opacity: 0.8, marginTop: 16 }}>
            How would YOU spend Canada&apos;s budget?
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Get category UUIDs to names/percentages
  const { data: categories } = await supabase
    .from("budget_categories")
    .select("id, name, slug, actual_percentage")
    .eq("country_code", "CA");

  const catMap: Record<string, { name: string; actual: number }> = {};
  for (const cat of categories || []) {
    catMap[cat.id] = { name: cat.name, actual: cat.actual_percentage };
  }

  // Sort items by user percentage descending, get top 3
  const items = (allocation.allocation_items || [])
    .map((item: { category_id: string; percentage: number }) => ({
      categoryId: item.category_id,
      percentage: item.percentage,
      name: catMap[item.category_id]?.name || "Unknown",
      actual: catMap[item.category_id]?.actual || 0,
    }))
    .sort((a: { percentage: number }, b: { percentage: number }) => b.percentage - a.percentage)
    .slice(0, 3);

  // Get total allocations count
  const { count } = await supabase
    .from("allocations")
    .select("*", { count: "exact", head: true })
    .eq("country_code", "CA");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#26374A",
          color: "white",
          fontFamily: "sans-serif",
          padding: "48px 56px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 32 }}>
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2 }}>
            I&apos;d spend Canada&apos;s budget differently.
          </div>
          <div
            style={{
              width: 72,
              height: 6,
              backgroundColor: "#AF3C43",
              marginTop: 12,
            }}
          />
        </div>

        {/* Top 3 priorities */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          {items.map((item: { categoryId: string; name: string; percentage: number; actual: number }, i: number) => (
            <div
              key={item.categoryId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{item.name}</div>
                <div style={{ display: "flex", gap: 24, marginTop: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: Math.max(item.percentage * 4, 8),
                        height: 16,
                        backgroundColor: "#2E86DE",
                      }}
                    />
                    <span style={{ fontSize: 18, color: "#2E86DE", fontWeight: 600 }}>
                      Me: {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: Math.max(item.actual * 4, 8),
                        height: 16,
                        backgroundColor: "#AF3C43",
                      }}
                    />
                    <span style={{ fontSize: 18, color: "#AF3C43", fontWeight: 600 }}>
                      Gov: {item.actual.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>WeChoose</div>
            <div style={{ fontSize: 16, opacity: 0.7 }}>
              wechoose-two.vercel.app
            </div>
          </div>
          <div style={{ fontSize: 18, opacity: 0.7 }}>
            {(count || 0).toLocaleString()} Canadians have weighed in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
