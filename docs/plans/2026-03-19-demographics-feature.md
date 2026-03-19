# WeChoose Demographics & Income Comparison Feature

## Overview
Let users optionally provide demographic information (age bracket, income range) during allocation, then see how people with similar demographics voted. Also show a personalized "Your Tax Dollars" breakdown showing exactly how much of their income goes to each category under both the government's actual budget and their personal allocation.

## Current State

### What Exists
- **`allocations` table** has `income` (integer, nullable) column — currently unused in UI
- **`postal_code`/`province`/`riding`** — already collected and used for geographic comparisons
- **Tax Truth Calculator** — separate page at `/tax-truth` that computes total tax burden (federal + provincial + CPP/EI/GST/carbon) and shows per-category dollar breakdown. Uses `calculateTotalTax()` server action.
- **`aggregate_cache` table** — stores pre-computed averages by (category, country, province). Trigger `recalculate_aggregates` runs on every `allocation_items` insert, recalculating national + provincial aggregates.
- **Results page** — shows People vs Government bars, gap cards, consequence panel, share buttons

### What Doesn't Exist
- No age data captured
- Income is in the schema but never written from the UI
- No demographic-filtered aggregates (only national and provincial)
- No "Your Tax Dollars" view tied to the user's allocation (Tax Truth shows government's allocation only)
- No demographic aggregate cache (would need live queries or new cache dimensions)

---

## Design

### Demographics Collected (All Optional)
1. **Age bracket** — Radio/select: `18-24`, `25-34`, `35-44`, `45-54`, `55-64`, `65+`
2. **Income bracket** — Radio/select: `Under $30K`, `$30-50K`, `$50-75K`, `$75-100K`, `$100-150K`, `$150K+`
3. **Postal code** — Already exists, drives province + riding detection

Brackets, not exact values. Reduces friction and privacy concern. Brackets are also easier to aggregate.

We do NOT ask for gender, ethnicity, or other sensitive demographics — this is about fiscal priorities by life stage, income level, and geography.

### Income Bracket Midpoints (for tax calculation)
| Bracket | Midpoint | Rationale |
|---------|----------|-----------|
| Under $30K | $22,000 | Median of $0-30K working income |
| $30-50K | $40,000 | Midpoint |
| $50-75K | $62,500 | Midpoint |
| $75-100K | $87,500 | Midpoint |
| $100-150K | $125,000 | Midpoint |
| $150K+ | $200,000 | Conservative estimate for high earners |

---

## Feature Breakdown

### Phase 1: DB + Schema Changes
**Files:** Migration via Supabase MCP, `src/types/index.ts`

1. Add `age_bracket` text column to `allocations` table (nullable)
2. Add `income_bracket` text column to `allocations` table (nullable)
   - Keep existing `income` column for exact values if ever needed
3. Create `demographic_aggregate_cache` table:
   ```sql
   CREATE TABLE demographic_aggregate_cache (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     category_id uuid REFERENCES budget_categories(id),
     country_code text NOT NULL DEFAULT 'CA',
     dimension text NOT NULL,        -- 'age_bracket', 'income_bracket', 'province'
     dimension_value text NOT NULL,   -- '25-34', '$50-75K', 'ON'
     total_allocations integer NOT NULL DEFAULT 0,
     average_percentage numeric(5,2) NOT NULL DEFAULT 0,
     updated_at timestamptz DEFAULT now(),
     UNIQUE(category_id, country_code, dimension, dimension_value)
   );
   ```
4. Create or update the aggregate trigger to also populate `demographic_aggregate_cache` when age/income brackets are present
5. Update TypeScript types: `Allocation`, `AllocationInput`

### Phase 2: Allocator UI — Demographic Inputs
**Files:** `src/components/allocator/slider-group.tsx`, `src/components/allocator/demographic-inputs.tsx`

1. Create `DemographicInputs` component:
   - Collapsible section below the postal code input: "Tell us about yourself (optional)"
   - Age bracket selector (pill buttons or radio group)
   - Income bracket selector (pill buttons or radio group)
   - Brief privacy note: "This data is anonymous and used only for aggregate comparisons."
2. Wire into `SliderGroup`:
   - State for `ageBracket` and `incomeBracket`
   - Pass to `/api/allocate` on submission
   - Store in sessionStorage for results page use

### Phase 3: API Updates
**Files:** `src/app/api/allocate/route.ts`, `src/lib/actions/allocations.ts`, `src/types/index.ts`

1. Update `AllocationInput` type to include `age_bracket?` and `income_bracket?`
2. Update `submitAllocation` to write `age_bracket` and `income_bracket` to `allocations`
3. Create new API endpoint `GET /api/aggregate/demographics`:
   ```
   ?dimension=age_bracket&value=25-34
   ?dimension=income_bracket&value=$50-75K
   ```
   - Returns category averages for that demographic slice
   - Reads from `demographic_aggregate_cache` table
   - Falls back to live query if cache is empty

### Phase 4: Demographic Comparison Component
**Files:** `src/components/results/demographic-comparison.tsx`, `src/app/results/results-client.tsx`

1. Create `DemographicComparison` component:
   - Shows on results page when user has demographic data in sessionStorage
   - Tabs or toggle: "By Age" / "By Income" / "By Province"
   - For the user's bracket: shows "People aged 25-34" average vs national average vs government
   - Highlights biggest divergences: "25-34 year olds want 18% on Housing vs the national average of 9%"
   - If multiple brackets have data, show a mini heatmap or small multiples
2. Wire into results page below the comparison chart

### Phase 5: "Your Tax Dollars" Personalized Breakdown + Tax Freedom Day
**Files:** `src/components/results/your-tax-dollars.tsx`, `src/components/shared/privacy-note.tsx`, integrate with results page

This is the "killer feature" — showing exact dollar amounts AND days worked:

1. When user has income bracket + their allocation:
   - Use the bracket midpoint to compute approximate total tax burden (reuse `calculateTotalTax` logic)
   - **Dollar breakdown per category:**
     - **Government's budget:** "Healthcare: $X,XXX of your taxes" (based on actual percentage)
     - **Your budget:** "Healthcare: $Y,YYY if you decided" (based on user's allocation percentage)
     - **Difference:** "+$Z,ZZZ more" or "-$Z,ZZZ less"
   - Total at bottom confirms both sum to the same total tax amount
2. **"Tax Freedom Day" / Days Worked section** (inspired by viral framing):
   - Calculate total working days spent on taxes: `effective_rate × 260 working days`
   - Show: "You work X days a year — Y months — just to cover your taxes."
   - Show "Tax Freedom Day": the calendar date when you've earned enough to pay your annual tax
   - **Per-category days worked** (the viral shareable piece):
     - "You work 12 days paying debt interest, but only 1.5 days on Housing."
     - "Under YOUR budget: 8 days on Housing, 6 days on debt interest."
     - Each line is copy-to-clipboard shareable
   - Use government percentages × total tax days for "Government's plan" days
   - Use user's percentages × total tax days for "Your plan" days
3. Visual: Side-by-side bars or a two-column table
4. Shareable insight: "I work 12 days a year paying debt interest but only 1.5 days on housing. WeChoose lets you fix that."

### Phase 5b: Privacy Note Component + Trust Layer
**Files:** `src/components/shared/privacy-note.tsx`, woven into all new components

Reusable `PrivacyNote` component with variants:
- `compact` — lock icon + single line + link to /privacy (for inline use)
- `inline` — 2-3 sentences within a section
- `detailed` — expandable panel with full methodology

Place throughout:
- Demographic inputs: detailed variant explaining what we collect and don't
- Results page top: compact bar
- Demographic comparison: inline explaining sample size + anonymity
- Your Tax Dollars: inline noting calculation is local, income not stored exactly
- Share cards/OG images: "Anonymous data from WeChoose"
- Email MP body: "This data represents anonymous, aggregated responses"

Trust copy principles:
- Lead with what we DON'T collect (name, email, SIN, IP address, cookies)
- Plain language, not technical jargon
- Answer "can someone find out I did this?" directly: No.
- Shield icon as visual trust signal

### Phase 6: Seed Demographic Data for Existing Allocations
**Files:** Migration script

- Backfill some of the 15+ existing seed allocations with random but plausible demographics
- Ensures the demographic comparison has data to show from day one
- Run `recalculate_aggregates` equivalent for the new demographic cache

---

## File Change Summary

| File | Change Type | Description |
|------|-------------|-------------|
| Supabase migration | New | Add columns + `demographic_aggregate_cache` table + trigger update |
| `src/types/index.ts` | Edit | Add `age_bracket`, `income_bracket` to types |
| `src/components/allocator/demographic-inputs.tsx` | New | Age/income bracket selectors |
| `src/components/allocator/slider-group.tsx` | Edit | Wire demographic inputs, pass to API |
| `src/app/api/allocate/route.ts` | Edit | Accept + forward demographic fields |
| `src/lib/actions/allocations.ts` | Edit | Write demographics to DB |
| `src/app/api/aggregate/demographics/route.ts` | New | Demographic-filtered aggregate endpoint |
| `src/components/results/demographic-comparison.tsx` | New | "How people like you voted" component |
| `src/components/results/your-tax-dollars.tsx` | New | Personalized dollar breakdown |
| `src/app/results/results-client.tsx` | Edit | Wire in new components |
| Seed migration | New | Backfill demographics on existing allocations |

---

## UX Flow

```
Allocator Page
├── Category sliders (existing)
├── Postal code input (existing) → detects province + riding
├── [NEW] "Tell us about yourself" (collapsible)
│   ├── Age bracket (pill buttons)
│   ├── Income bracket (pill buttons)
│   └── Privacy note
└── Submit

Results Page
├── Comparison chart (existing)
├── Gap cards (existing)
├── [NEW] "Your Tax Dollars" (if income bracket provided)
│   ├── Per-category: Government $ vs Your $ with difference
│   ├── Total tax burden summary
│   └── Shareable insight text
├── [NEW] "How People Like You Voted" (if demographics provided)
│   ├── Age bracket comparison
│   ├── Income bracket comparison
│   └── Biggest divergences highlighted
├── Consequence panel (existing)
├── Email MP button (existing)
└── Share buttons (existing)
```

---

## Privacy & Trust Considerations

- All demographic data is **optional** — zero fields required
- No exact income stored (brackets only via `income_bracket` column)
- Existing `income` integer column remains for potential future use but we don't ask for exact income here
- Demographics are tied to the same anonymous IP hash — no PII linkage
- Clear labeling: "This data is anonymous and used only for aggregate comparisons"
- Demographic aggregates only shown when N >= 3 for that bracket (prevents de-anonymization of small groups)

---

## Technical Notes

### Aggregate Strategy
The existing `aggregate_cache` uses a Postgres trigger on `allocation_items` insert. For demographics, we have two options:

**Option A: Extend the trigger** — Add demographic dimensions to the existing trigger. Pros: real-time, same pattern. Cons: trigger becomes complex, more writes per insert.

**Option B: New table + separate trigger** — `demographic_aggregate_cache` with its own trigger that fires on `allocation_items` insert and also checks the parent `allocations` row for demographic data. Pros: clean separation. Cons: two triggers firing.

**Recommended: Option B** — Keep demographic aggregation separate. The trigger joins to `allocations` to get the bracket, then upserts into `demographic_aggregate_cache`. Cleaner, and demographic data is optional so many inserts will be no-ops.

### Tax Calculation Reuse
The `calculateTotalTax(income, province)` server action already computes the full tax picture. For "Your Tax Dollars", we:
1. Use the bracket midpoint as income
2. Use the user's province (from postal code)
3. Call `calculateTotalTax` to get total tax amount
4. Multiply total tax by each category percentage (user's vs government's) to get per-category dollars

No new tax logic needed — just reusing existing computation with new presentation.

---

## Build Order

1. Phase 1 (DB) — migrations and types
2. Phase 2 (UI inputs) — demographic inputs component
3. Phase 3 (API) — allocate + demographics aggregate endpoint
4. Phase 4 (Demographic comparison) — results component
5. Phase 5 (Your Tax Dollars) — personalized breakdown
6. Phase 6 (Seed data) — backfill demographics
7. Build + test + commit + push + deploy
