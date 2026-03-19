# Bootstrap Plan: WeChoose

## Project Spec
- **Name:** wechoose (display: WeChoose)
- **Domain:** wechoose.io (available)
- **One-liner:** A direct democracy platform disguised as a government website — allocate your tax dollars, see the gap between what citizens want and what government spends, and vote on the issues that matter.
- **Platform:** Next.js 15 (App Router)
- **Stack:** TypeScript, Tailwind CSS, shadcn/ui, Supabase (CCandSS), Vercel
- **Supabase project:** CCandSS (supabase-CCandSS MCP)

---

## Design System (FINALIZED)

### The Protest Aesthetic
The design IS the protest. WeChoose mimics the official Government of Canada website (canada.ca) as closely as legally permissible — the red accent bar, the navy headers, the Lato/Noto Sans typography, the clean government card layouts. Users should do a double-take: "Wait, is this actually a government site?" The disconnect between the official aesthetic and the people's voice is the entire point.

### Colour Palette (from canada.ca)

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#FFFFFF` | Page background, majority white |
| Body text | `#333333` | All body copy |
| Link (default) | `#284162` | Dark navy blue links |
| Link (hover) | `#0535D2` | Bright blue on hover |
| Link (visited) | `#7834BC` | Purple visited links |
| Main accent / nav / footer | `#26374A` | Dark navy — header bar, footer, primary buttons |
| Red accent bar | `#AF3C43` | H1 underline bar (72px wide, 6px thick). Slightly adjusted from canada.ca `#A62A1E` to avoid exact government replication while maintaining the look |
| Well/panel background | `#F5F5F5` | Card backgrounds, content sections |
| Well border | `#E3E3E3` | Subtle borders on panels |
| Sub-footer background | `#F8F8F8` | Light grey footer strip |
| Error / required | `#D3080C` | Form errors, required indicators |
| Separator / HR | `#DDDDDD` | Divider lines |
| **People's choice accent** | `#2E86DE` | Blue used for user allocation bars/sliders — visually distinct from government red |
| **Government actual accent** | `#AF3C43` | Red used for actual government spending bars |
| **Differential positive** | `#27AE60` | Green — user wants MORE than government spends |
| **Differential negative** | `#E74C3C` | Red — user wants LESS than government spends |

### Typography

| Element | Font | Size (desktop) | Size (mobile) | Weight |
|---------|------|----------------|---------------|--------|
| H1 | Lato | 41px | 37px | 700 |
| H2 | Lato | 39px | 35px | 700 |
| H3 | Lato | 29px | 26px | 700 |
| H4 | Lato | 27px | 22px | 700 |
| H5 | Lato | 24px | 20px | 700 |
| H6 | Lato | 22px | 18px | 700 |
| Body | Noto Sans | 20px | 18px | 400 |

Google Fonts to load: `Lato:wght@400;700` and `Noto+Sans:wght@400;500;600;700`

### Layout Patterns (canada.ca style)
- **Header:** Language toggle (EN/FR placeholder), site wordmark ("WeChoose" styled like the Canada wordmark), search bar (optional v2), nav menu
- **H1 red bar:** 72px wide, 6px thick, positioned below H1 with 4px padding
- **Content cards:** No visible borders, `#F5F5F5` background wells, generous whitespace
- **Buttons:** Navy `#26374A` background, white text, zero border-radius, 10px 14px padding
- **Footer:** Navy `#26374A` background, white text/links, site wordmark bottom-right
- **Grid:** Responsive, mobile-first. Similar to Bootstrap 3 column patterns but using Tailwind
- **Max line length:** 65 characters for readability

### Effects
- Smooth slider interactions (150ms transitions)
- Bar chart animations on results reveal (staggered, 300ms per bar)
- Counter animations for dollar amounts (count up from 0)
- Subtle hover states on cards (`transition-colors duration-200`)
- Progressive disclosure — each section reveals with a gentle fade

---

## Core Concept & Modules

### Module 1: The People's Budget (v1 — launch module, viral hook)

**Flow:**
1. Land on homepage that looks like canada.ca
2. See a clear CTA: "How would YOU spend Canada's budget?"
3. Enter postal code (for riding/province mapping) — optional but encouraged
4. See the budget categories with sliders — each starts at 0%
5. Drag sliders to allocate 100% of the budget (forced trade-offs — must sum to 100%)
6. "Surprise me" facts pop up as you adjust ("Did you know debt interest costs more than defence?")
7. Submit (one per IP, hashed, transparent disclosure)
8. **Results page (the money shot):** Three-column comparison:
   - YOUR allocation
   - THE PEOPLE'S allocation (aggregate of all users)
   - THE GOVERNMENT'S actual allocation
9. Differentials calculated and highlighted (green = you want more, red = you want less)
10. Shareable result card generated for social media

### Module 2: The Tax Truth (v1, paired with budget)

**Flow:**
1. User enters annual income + province
2. App calculates TOTAL tax burden across ALL taxes:
   - Federal income tax (by bracket)
   - Provincial income tax (by bracket)
   - CPP/EI premiums
   - GST/HST (estimated based on spending patterns)
   - Carbon levy (estimated)
   - Fuel excise, alcohol/tobacco excise (averaged)
   - Property tax (optional input or provincial average)
3. Shows: "You earn $85,000. You pay approximately $37,200 in total taxes (43.8%)"
4. Breakdown pie chart of where each tax dollar comes from
5. Then connects to Module 1: "Now that you know how much you pay — how would YOU spend it?"
6. Dollar amounts shown alongside percentages: "You'd put $11,160 toward healthcare (30%)"

### Module 3: People's Referendum (v2 expansion)

- Admin-curated yes/no or ranked-choice questions on current issues
- Same anti-spam (IP hash), same aggregate results
- Same canada.ca aesthetic
- Examples: "Should Canada increase military spending to 2% GDP?", "Should dental care cover all incomes?"
- Results page shows aggregate with geographic breakdown

### Module 4: Riding Heatmap (v2)

- Postal code → federal riding mapping (Elections Canada data)
- See how your riding's aggregate compares to national
- Interactive map of Canada coloured by priorities
- "Your riding of Ottawa Centre wants 25% on housing. National average is 18%."

---

## Data Model

### Entities

| Entity | Fields | Type | Required | Notes |
|--------|--------|------|----------|-------|
| **budget_categories** | | | | Hardcoded federal budget categories |
| | id | uuid (PK) | YES | |
| | name | text | YES | e.g., "Healthcare Transfers" |
| | slug | text (unique) | YES | e.g., "healthcare-transfers" |
| | description | text | YES | Short explanation of what this covers |
| | actual_amount_billions | numeric(10,2) | YES | Actual gov spending in $B |
| | actual_percentage | numeric(5,2) | YES | % of total budget |
| | display_order | integer | YES | Sort order on slider page |
| | icon | text | NO | Lucide icon name |
| | fun_fact | text | NO | "Surprise me" fact shown during allocation |
| | country_code | text | YES | 'CA' for Canada (future: other countries) |
| | fiscal_year | text | YES | '2023-2024' |
| | created_at | timestamptz | YES | |

| Entity | Fields | Type | Required | Notes |
|--------|--------|------|----------|-------|
| **allocations** | | | | One user's budget allocation |
| | id | uuid (PK) | YES | |
| | ip_hash | text | YES | SHA-256 of IP + salt. Unique constraint per country_code |
| | postal_code | text | NO | For riding/province mapping |
| | province | text | NO | Derived from postal code |
| | riding | text | NO | Derived from postal code (v2) |
| | country_code | text | YES | 'CA' |
| | income | integer | NO | Annual income (for tax truth module) |
| | created_at | timestamptz | YES | |
| | updated_at | timestamptz | YES | |

| Entity | Fields | Type | Required | Notes |
|--------|--------|------|----------|-------|
| **allocation_items** | | | | Individual category allocation within a submission |
| | id | uuid (PK) | YES | |
| | allocation_id | uuid (FK → allocations) | YES | |
| | category_id | uuid (FK → budget_categories) | YES | |
| | percentage | numeric(5,2) | YES | User's chosen % (0-100) |
| | created_at | timestamptz | YES | |

| Entity | Fields | Type | Required | Notes |
|--------|--------|------|----------|-------|
| **tax_brackets** | | | | Federal + provincial tax brackets for calculator |
| | id | uuid (PK) | YES | |
| | country_code | text | YES | 'CA' |
| | province | text | NO | NULL = federal, 'ON'/'BC'/etc = provincial |
| | bracket_min | integer | YES | Income floor |
| | bracket_max | integer | NO | NULL = no cap |
| | rate | numeric(5,4) | YES | Tax rate as decimal (0.15 = 15%) |
| | tax_type | text | YES | 'income', 'cpp', 'ei', 'gst', 'carbon' |
| | fiscal_year | text | YES | '2023-2024' |
| | created_at | timestamptz | YES | |

| Entity | Fields | Type | Required | Notes |
|--------|--------|------|----------|-------|
| **revenue_sources** | | | | Government revenue breakdown data |
| | id | uuid (PK) | YES | |
| | name | text | YES | e.g., "Personal Income Tax" |
| | slug | text (unique) | YES | |
| | amount_billions | numeric(10,2) | YES | |
| | percentage_of_total | numeric(5,2) | YES | |
| | description | text | YES | |
| | country_code | text | YES | |
| | fiscal_year | text | YES | |
| | display_order | integer | YES | |
| | created_at | timestamptz | YES | |

| Entity | Fields | Type | Required | Notes |
|--------|--------|------|----------|-------|
| **aggregate_cache** | | | | Pre-computed aggregate results (updated on new allocation) |
| | id | uuid (PK) | YES | |
| | category_id | uuid (FK → budget_categories) | YES | |
| | country_code | text | YES | |
| | province | text | NO | NULL = national aggregate |
| | total_allocations | integer | YES | Number of people who allocated |
| | average_percentage | numeric(5,2) | YES | People's average for this category |
| | updated_at | timestamptz | YES | |

### Relationships
- `allocations` has_many `allocation_items`
- `allocation_items` belongs_to `allocations` and `budget_categories`
- `aggregate_cache` belongs_to `budget_categories`

### Anti-Spam
- `allocations.ip_hash` has a UNIQUE constraint per `country_code`
- IP is hashed with SHA-256 + server-side salt (stored in env var, never exposed)
- Transparent disclosure on the page: "One voice per person. Your response is tied to your connection to prevent duplicates."
- If a user submits again from the same IP, their allocation is UPDATED (not rejected) — they can change their mind
- No login required. Optional email capture after submission for updates

---

## Budget Categories (Actual 2023-24 Data)

These will be seeded into `budget_categories`. Simplified from the full estimates into ~14 citizen-friendly categories:

| # | Category | Actual $B | Actual % | Icon | Fun Fact |
|---|----------|-----------|----------|------|----------|
| 1 | Healthcare | $65.8B | 12.6% | heart-pulse | "The federal government doesn't run hospitals — this money is transferred to provinces who do." |
| 2 | Seniors (OAS/GIS) | $76.0B | 14.6% | users | "Old Age Security is the single largest line item in the federal budget — bigger than defence and healthcare combined." |
| 3 | Children & Families (CCB) | $26.3B | 5.0% | baby | "The Canada Child Benefit gives up to $7,437 per child under 6, tax-free." |
| 4 | National Defence | $35.7B | 6.8% | shield | "Canada spends 1.3% of GDP on defence — NATO's target is 2%." |
| 5 | Indigenous Services | $38.4B | 7.4% | landmark | "This covers both Indigenous Services Canada and Crown-Indigenous Relations — two separate departments." |
| 6 | Employment Insurance | $23.1B | 4.4% | briefcase | "EI is funded by premiums from workers and employers, but administered by the federal government." |
| 7 | Debt Interest | $47.3B | 9.1% | trending-up | "10 cents of every tax dollar goes to interest on past borrowing. That's $47.3 billion — more than National Defence." |
| 8 | Housing & Infrastructure | $9.1B | 1.7% | home | "Despite a housing crisis, federal housing spending is less than 2% of the total budget." |
| 9 | Environment & Climate | $3.1B | 0.6% | leaf | "Environment spending is 0.6% of the budget. The carbon levy collects $10.5B — most returned as rebates." |
| 10 | Carbon Rebates | $9.9B | 1.9% | recycle | "The government collects the carbon tax, then returns most of it directly to households." |
| 11 | Immigration | $5.2B | 1.0% | plane | "Immigration spending is about 1% of the federal budget — less than debt interest alone." |
| 12 | Public Safety & Justice | $8.3B | 1.6% | scale | "Covers the RCMP ($6.1B), Correctional Services ($3.9B), courts, and border services." |
| 13 | Foreign Affairs & Aid | $8.4B | 1.6% | globe | "International development, embassies, trade negotiations, and peacekeeping." |
| 14 | Government Operations | $140.0B | 26.9% | building-2 | "The cost of running the federal government itself — salaries, buildings, IT systems, and transfers to other programs." |

**Total: $521.4B (2023-24 actual spending)**

Note: Percentages sum to ~93.2% — the remaining ~6.8% is in smaller categories, actuarial adjustments, and COVID recovery clawbacks. We'll normalize to 100% for the slider view but show actual amounts.

---

## Revenue Sources (Actual 2023-24 Data)

Seeded into `revenue_sources` for the Tax Truth module:

| # | Source | Amount $B | % of Total |
|---|--------|-----------|------------|
| 1 | Personal Income Tax | $217.7B | 47.4% |
| 2 | Corporate Income Tax | $82.5B | 17.9% |
| 3 | GST | $51.4B | 11.2% |
| 4 | EI Premiums | $29.6B | 6.4% |
| 5 | Non-Resident Income Tax | $12.5B | 2.7% |
| 6 | Carbon Levy | $10.5B | 2.3% |
| 7 | Energy Taxes | $6.8B | 1.5% |
| 8 | Excise & Sales Taxes | $5.6B | 1.2% |
| 9 | Customs Import Duties | $5.6B | 1.2% |
| 10 | Other Revenue | $37.4B | 8.1% |

**Total Revenue: $459.5B**
**Deficit: -$61.9B** (spending exceeds revenue by 13.5%)

---

## Auth & Roles
- **Auth provider:** None (anonymous-first). No login required to allocate or view results.
- **Optional account:** Email capture AFTER allocation submission. "Save your allocation and get notified when results update."
- **Admin role:** Supabase dashboard only (no admin UI in v1). Used for managing categories, viewing raw data, adding referendum questions (v2).
- **Anti-spam:** SHA-256 hashed IP with server-side salt. One allocation per IP per country.

---

## Pages (COMPLETE SPEC)

| # | Route | Page | Auth | Data Displayed | User Actions | Empty State |
|---|-------|------|------|----------------|--------------|-------------|
| 1 | `/` | Landing / Home | No | Hero section ("How would YOU spend Canada's $521B budget?"), feature cards for each module, aggregate counter ("X Canadians have weighed in"), how-it-works steps | Click CTA to start allocating | Shows "Be the first to weigh in" if 0 allocations |
| 2 | `/allocate` | Budget Allocator | No | 14 budget categories with sliders, each showing category name, description, actual gov %, fun fact tooltip. Running total showing % allocated and % remaining. Forced 100% constraint. | Drag sliders, click "Surprise me" for random facts, enter postal code (optional), submit allocation | N/A — categories are hardcoded |
| 3 | `/results` | Results Dashboard | No | Three-column comparison: Your allocation vs People's aggregate vs Government actual. Bar charts for each category. Differential highlights (green/red). Total allocations counter. Top 3 biggest gaps. Province breakdown (if enough data). | Toggle between $ and % view, filter by province, generate shareable card, share to social media | "No results yet — be the first to allocate!" |
| 4 | `/results/share/[id]` | Shareable Result Card | No | OG-image-optimized view of one user's allocation vs government. Designed for social media embeds (Twitter cards, Facebook OG). | View, share URL | N/A |
| 5 | `/tax-truth` | Tax Calculator | No | Income input + province selector. Calculates total tax burden. Breakdown pie chart. Per-tax-type amounts. Effective rate. "Your money" section showing dollar amounts per budget category based on YOUR taxes. | Enter income, select province, see breakdown, click through to allocator with dollar context | N/A — calculator is always available |
| 6 | `/about` | About / How It Works | No | Mission statement, methodology, data sources, privacy (IP hashing explained), FAQ. Links to actual government budget documents. | Read, click through to allocator | N/A |
| 7 | `/privacy` | Privacy Policy | No | How IP hashing works, what data is stored, what isn't. Transparency is the brand. | Read | N/A |

---

## Shareable Result Card Design

The viral piece. Generated server-side or via canvas:

```
┌─────────────────────────────────────┐
│ [WeChoose wordmark]     wechoose.io │
│─────────────────────────────────────│
│                                     │
│  "I'd spend Canada's budget         │
│   differently."                     │
│                                     │
│  MY BIGGEST PRIORITIES:             │
│  ████████████ Healthcare    30%     │
│  █████████    Education     22%     │
│  ██████       Housing       15%     │
│                                     │
│  GOVERNMENT'S ACTUAL:               │
│  █████        Healthcare    12.6%   │
│  ██           Education     3.2%    │
│  █            Housing       1.7%    │
│                                     │
│  68,432 Canadians agree with me.    │
│                                     │
│  What would YOU choose?             │
│  wechoose.io                        │
└─────────────────────────────────────┘
```

- Generated as OG image (1200x630) for social embeds
- Also downloadable as PNG for Instagram stories (1080x1920)
- User's top 3 priority gaps highlighted
- Counter of total allocations adds social proof

---

## Key Features & Efficiencies

### Forced Trade-offs (CRITICAL UX)
Sliders must sum to 100%. When one goes up, the system must handle the redistribution:
- **Option A (recommended):** Free adjustment — user manually balances. Show a prominent "remaining %" counter. Disable submit until exactly 100%.
- **Option B:** Auto-redistribute — moving one slider proportionally adjusts others. Can feel frustrating.
- Go with Option A. The friction IS the point — it forces citizens to actually think about priorities, not just "more of everything."

### Progressive Disclosure
Don't overwhelm. The experience unfolds:
1. **Homepage** — Clean hero, one CTA
2. **Allocator** — Just the sliders, nothing else
3. **Results** — Your allocation appears first, THEN people's aggregate slides in, THEN government actual slides in
4. **Tax Truth** — Optional deep-dive for the curious
Each reveal is a dopamine hit. Each comparison is an "aha" moment.

### "Surprise Me" Facts
While adjusting sliders, fun facts pop up contextually:
- Adjust Defence slider → "Canada spends 1.3% of GDP on defence. NATO target is 2%."
- Adjust Debt Interest → "This money doesn't build anything. It pays interest on past borrowing."
- Adjust Environment → "Environment spending (0.6%) is less than what the government spends on its own buildings."

### Real-Time Aggregate Animation
After submitting, the people's aggregate bars animate. Your submission tilts the national average. You SEE your vote count. Satisfying.

### Income-Based Dollar Scaling
After Tax Truth calculation, the allocator can show dollar amounts:
- "You pay ~$37,200 in total taxes"
- "You'd put $11,160 toward healthcare (30%)"
- "The government puts $4,687 of your taxes toward healthcare (12.6%)"
- Makes it visceral — percentages are abstract, dollars are real

### Mobile-First
This will spread via social sharing on phones. Every page must work perfectly at 375px. Desktop is a nice-to-have.

---

## File Tree (Planned)

```
wechoose/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout: Lato + Noto Sans, gov header/footer
│   │   ├── page.tsx                      # Landing page: hero, feature cards, counter
│   │   ├── error.tsx                     # Error boundary
│   │   ├── not-found.tsx                 # 404
│   │   ├── globals.css                   # canada.ca CSS variables + custom
│   │   ├── allocate/
│   │   │   └── page.tsx                  # Budget slider allocator
│   │   ├── results/
│   │   │   ├── page.tsx                  # Aggregate results dashboard
│   │   │   └── share/
│   │   │       └── [id]/
│   │   │           ├── page.tsx          # Shareable result view
│   │   │           └── opengraph-image.tsx  # OG image generation
│   │   ├── tax-truth/
│   │   │   └── page.tsx                  # Tax calculator
│   │   ├── about/
│   │   │   └── page.tsx                  # About / methodology
│   │   ├── privacy/
│   │   │   └── page.tsx                  # Privacy policy
│   │   └── api/
│   │       ├── allocate/
│   │       │   └── route.ts              # POST allocation (with IP hashing)
│   │       └── aggregate/
│   │           └── route.ts              # GET aggregate results
│   ├── components/
│   │   ├── ui/                           # shadcn components
│   │   ├── layout/
│   │   │   ├── gov-header.tsx            # canada.ca-style header
│   │   │   ├── gov-footer.tsx            # canada.ca-style footer
│   │   │   └── wordmark.tsx              # WeChoose wordmark (styled like Canada wordmark)
│   │   ├── allocator/
│   │   │   ├── budget-slider.tsx         # Individual category slider
│   │   │   ├── slider-group.tsx          # All sliders + 100% constraint logic
│   │   │   ├── category-card.tsx         # Category info card with icon + description
│   │   │   └── fun-fact-popup.tsx        # Contextual fact tooltip
│   │   ├── results/
│   │   │   ├── comparison-chart.tsx      # Three-column bar chart (user vs people vs gov)
│   │   │   ├── differential-badge.tsx    # Green/red differential indicator
│   │   │   ├── share-card.tsx            # Shareable result card component
│   │   │   └── aggregate-counter.tsx     # "X Canadians have weighed in" counter
│   │   ├── tax/
│   │   │   ├── tax-calculator.tsx        # Income + province inputs
│   │   │   ├── tax-breakdown-chart.tsx   # Pie chart of tax types
│   │   │   └── dollar-context.tsx        # "Your $X goes to..." display
│   │   └── shared/
│   │       ├── postal-code-input.tsx     # Postal code with province auto-detect
│   │       └── percentage-bar.tsx        # Reusable horizontal bar
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser client
│   │   │   ├── server.ts                 # SSR cookie-based client
│   │   │   ├── admin.ts                  # Service role (lazy Proxy)
│   │   │   └── middleware.ts             # Session handler (minimal — no auth)
│   │   ├── actions/
│   │   │   ├── allocations.ts            # submitAllocation, updateAllocation, getAllocation
│   │   │   ├── aggregates.ts             # getAggregates, getAggregatesByProvince, recalcAggregate
│   │   │   ├── categories.ts             # getCategories
│   │   │   ├── revenue.ts                # getRevenueSources
│   │   │   └── tax-calculator.ts         # calculateTotalTax, getTaxBrackets
│   │   ├── data/
│   │   │   ├── budget-categories.ts      # Hardcoded seed data for categories
│   │   │   ├── revenue-sources.ts        # Hardcoded seed data for revenue
│   │   │   ├── tax-brackets-federal.ts   # 2023-24 federal brackets
│   │   │   └── tax-brackets-provincial.ts # Provincial brackets (all 13 provinces/territories)
│   │   ├── ip-hash.ts                    # SHA-256 IP hashing with salt
│   │   └── utils.ts                      # cn(), formatCurrency(), formatPercentage()
│   └── types/
│       └── index.ts                      # All TypeScript types matching DB schema
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Full schema with RLS
├── public/
│   ├── wechoose-wordmark.svg             # Site wordmark
│   └── maple-leaf.svg                    # Maple leaf accent (if needed)
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── CLAUDE.md
├── CURRENT_WORK.md
└── CODEBASE_MAP.md
```

---

## Server Actions

| Entity | Actions | File |
|--------|---------|------|
| Allocations | `submitAllocation(data, ip)`, `getAllocationByIpHash(hash)`, `updateAllocation(id, data)` | src/lib/actions/allocations.ts |
| Aggregates | `getAggregates(countryCode)`, `getAggregatesByProvince(countryCode, province)`, `recalcAggregate(categoryId)` | src/lib/actions/aggregates.ts |
| Categories | `getCategories(countryCode, fiscalYear)` | src/lib/actions/categories.ts |
| Revenue | `getRevenueSources(countryCode, fiscalYear)` | src/lib/actions/revenue.ts |
| Tax Calculator | `calculateTotalTax(income, province)`, `getTaxBrackets(province)` | src/lib/actions/tax-calculator.ts |

### API Routes (needed for IP access)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/allocate` | POST | Submit allocation. Extracts IP from request headers, hashes it, stores allocation. Returns allocation ID. |
| `/api/aggregate` | GET | Returns cached aggregates. Query params: `country`, `province` (optional). |

Note: Server actions can't access raw IP addresses. The allocation submission MUST go through an API route to get the IP from `request.headers.get('x-forwarded-for')`.

---

## Tax Calculator Logic

### Federal Income Tax Brackets (2023)

| Bracket | Rate |
|---------|------|
| $0 - $53,359 | 15.0% |
| $53,359 - $106,717 | 20.5% |
| $106,717 - $165,430 | 26.0% |
| $165,430 - $235,675 | 29.0% |
| $235,675+ | 33.0% |

### Other Federal Deductions
- CPP: 5.95% on earnings $3,500 - $66,600 (max $3,754)
- EI: 1.63% on earnings up to $61,500 (max $1,002)
- Basic personal amount: $15,000 (non-taxable)

### Provincial brackets: All 13 provinces/territories stored in `tax_brackets` table.

### Estimated Indirect Taxes (applied as % of after-tax income)
- GST/HST: estimated 5-15% depending on province (applied to ~60% of spending)
- Carbon levy: ~$0.1722/L gasoline, estimated per capita
- Property tax: user input or provincial average (% of avg home value)

The calculator shows:
1. Federal income tax
2. Provincial income tax
3. CPP/EI premiums
4. Estimated GST/HST paid
5. Estimated carbon levy
6. **Total effective tax rate**
7. **Dollar amount per budget category** (your taxes × category %)

---

## Reused Patterns (from existing projects)

- **Supabase client setup:** 3-file pattern (client.ts, server.ts, admin.ts) — proven across CompPortal, StudioSync
- **Middleware:** Minimal — no auth protection needed, but structure in place for v2 accounts
- **Layout:** Root layout with header/footer — adapted from canada.ca spec
- **Server actions:** Standard CRUD pattern with `revalidatePath` — from all existing projects
- **shadcn components:** Slider, Card, Button, Input, Select, Tooltip, Dialog

---

## Deployment
- **Target:** Vercel
- **Domain:** wechoose.io (to be registered and pointed to Vercel)
- **Environment variables needed:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `IP_HASH_SALT` (random string for hashing IPs)
  - `NEXT_PUBLIC_APP_URL`

---

## Seed Data

On first deploy, seed:
1. All 14 budget categories with actual 2023-24 data
2. All 10 revenue sources with actual data
3. Federal tax brackets (2023)
4. Provincial tax brackets for all 13 provinces/territories
5. 10-20 fake allocations with realistic distributions to pre-populate the aggregate view (so the first real user doesn't see empty charts)

---

## Test Plan

| Test | What It Verifies |
|------|------------------|
| Landing page loads | Hero, CTA, counter visible. canada.ca aesthetic applied. |
| Allocator sliders work | All 14 categories visible. Sliders sum to 100%. Can't submit at 99% or 101%. |
| Submit allocation | POST to /api/allocate succeeds. Allocation appears in DB. |
| Duplicate IP blocked | Second submission from same IP updates (not duplicates). |
| Results page | Three columns render. Bars animate. Differentials show green/red correctly. |
| Share card | /results/share/[id] renders. OG image generates. |
| Tax calculator | Income + province → correct total. All bracket math verified against CRA examples. |
| Mobile responsive | All pages work at 375px. Sliders are touch-friendly. |
| Empty state | Results page with 0 allocations shows appropriate message. |
| Province filter | Results filterable by province when postal codes are provided. |

---

## Status
- [ ] Phase 5: Scaffold
- [ ] Phase 6: Design Pass
- [ ] Phase 7: Build & Deploy to Vercel
- [ ] Phase 8: Seed Data & Production Testing (Playwright CLI)
