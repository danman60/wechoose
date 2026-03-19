# WeChoose Virality & Protest Features — Overnight Build

## Overview
Add all high-impact features to make WeChoose an effective viral protest tool. Build autonomously, commit after each feature, push and deploy after each major milestone.

## Deployed URL
https://wechoose-two.vercel.app

## Supabase
- Project: CCandSS (supabase-CCandSS MCP)
- URL: https://netbsyvxrhrqxyzqflmd.supabase.co

## Current State
- 7 pages working, 14 budget categories, 15 seed allocations
- Compact grid allocator, results with comparison bars, tax calculator
- canada.ca aesthetic applied throughout

---

## Features to Build (in order)

### Feature 1: OG Share Image Generation
**Why:** Without a visual share card, there's nothing to post on social media. This is the #1 virality lever.
**What:**
- `/results/share/[id]/opengraph-image.tsx` — Next.js OG image generation (ImageResponse)
- Shows: "I'd spend Canada's budget differently." + user's top 3 priorities vs government actual
- 1200x630 for social embeds
- Include WeChoose branding, counter ("X Canadians agree"), and URL
- Update `/results/share/[id]/page.tsx` to show a full detailed view of that allocation
- Add share buttons (Twitter/X, Facebook, copy link) to results page
**Files:** `src/app/results/share/[id]/opengraph-image.tsx`, `src/app/results/share/[id]/page.tsx`
**DB:** Need to fetch allocation by ID with items joined to categories

### Feature 2: "Your Vote Moved the Needle" Animation
**Why:** People need to FEEL their vote counted. This is the dopamine hit.
**What:**
- After submission, before redirecting to /results, show an animation
- Display the aggregate bars for top 5 categories
- Animate bars shifting by the fraction the user's vote contributed
- "Your voice shifted Healthcare from 16.2% → 16.4%"
- Then transition to full results page
**Files:** `src/components/results/needle-animation.tsx`, update `src/components/allocator/slider-group.tsx`

### Feature 3: Riding-Level Results + MP Email Links
**Why:** Makes it personal. "Your MP voted for 1.7% on housing. Your riding wants 20%." + ability to email them.
**What:**
- Create riding lookup data: postal code prefix → federal riding → MP name + email
- Data source: Elections Canada open data (simplified mapping)
- Store in `src/lib/data/ridings.ts` — hardcoded lookup table for all 338 ridings
- At minimum: riding name, MP name, MP party, MP email (parl.gc.ca addresses are public)
- New page: `/riding/[riding-slug]` — shows riding-specific aggregate vs national vs government
- On results page: if user entered postal code, show their riding's data
- **"Email Your MP" button** — opens mailto: link with pre-filled subject and body:
  - Subject: "How I'd allocate the federal budget — WeChoose"
  - Body: "Dear [MP Name], I used WeChoose to allocate the federal budget. Here's where I disagree with current spending: [top 3 gaps]. [X] Canadians in [riding name] agree. See the results: [URL]"
- Also add "Email Your MP" CTA on the results page and on each riding page
**Files:** `src/lib/data/ridings.ts`, `src/lib/data/mp-emails.ts`, `src/app/riding/[slug]/page.tsx`, `src/components/shared/email-mp-button.tsx`
**DB migration:** Add riding field population, maybe a `ridings` reference table or keep client-side

### Feature 4: "Share Your Gap" Cards
**Why:** Single-stat comparisons spread better than complex charts.
**What:**
- Component that highlights the user's BIGGEST gap vs government
- "I think Housing deserves 20%. The government gives it 1.7%. That's an 18.3% gap."
- Styled as a shareable card with copy-to-clipboard text
- Show top 3 gaps on the results page
- Each gap card has its own share text
**Files:** `src/components/results/gap-card.tsx`, update results page

### Feature 5: Live Counter with Polling
**Why:** Seeing the number climb creates urgency and social proof.
**What:**
- Homepage counter polls every 30 seconds
- Subtle tick-up animation when the number changes
- "X Canadians have weighed in" with smooth count animation
- Show "Y weighed in today" alongside total
**Files:** `src/components/results/live-counter.tsx`, update homepage

### Feature 6: Province Comparison Page
**Why:** Regional differences are politically charged content that media picks up.
**What:**
- `/provinces` page — grid of all provinces with their aggregate priorities
- "Alberta wants 15% on defence. Quebec wants 3%."
- Sortable by category — "Who wants the most healthcare?"
- Each province links to filtered results
- Requires enough data per province (seed more fake allocations with varied provinces)
**Files:** `src/app/provinces/page.tsx`, `src/components/results/province-grid.tsx`

### Feature 7: "What If?" Consequence Simulator
**Why:** Makes the exercise educational, not just emotional.
**What:**
- After allocation, show consequences for extreme choices
- "You put 0% on debt interest → Canada's credit rating drops, borrowing costs increase ~$X billion"
- "You doubled housing to 15% → That funds approximately X new affordable units per year"
- Hardcoded consequence data per category with interpolation
- Shows as expandable section on results page
**Files:** `src/lib/data/consequences.ts`, `src/components/results/consequence-panel.tsx`

### Feature 8: Time Series Tracking
**Why:** Gives media a reason to cite the platform repeatedly.
**What:**
- New table: `aggregate_snapshots` — daily snapshot of national averages
- Cron or on-demand snapshot function
- `/trends` page — line charts showing how priorities shift over time
- "In week 1, Canadians wanted 8% on defence. This week it's 14%."
- Use recharts (already installed) for visualization
**Files:** `src/app/trends/page.tsx`, DB migration for snapshots table

### Feature 9: Embed Widget
**Why:** Lowers barrier — interact where you already are.
**What:**
- `/embed` page — minimal iframe-friendly version with 3-4 key categories
- Compact slider UI, submits to same API
- Generates embed code: `<iframe src="https://wechoose-two.vercel.app/embed" ...>`
- Designed for news sites and blogs
**Files:** `src/app/embed/page.tsx`, `src/app/embed/layout.tsx` (no header/footer)

### Feature 10: Harder Protest Framing
**Why:** The canada.ca aesthetic only works as protest if the disconnect is explicit.
**What:**
- Homepage hero gets sharper copy: "The government spends $521 billion of your money every year. They never asked how."
- Add a banner/ribbon: "This is not a government website. It should be."
- Results page header: "Here's what Canadians actually want — and what they actually get."
- About page: stronger mission statement about democratic deficit
**Files:** Update `src/app/page.tsx`, `src/app/results/results-client.tsx`, `src/app/about/page.tsx`

---

## Ridings & MP Data Strategy

Getting all 338 ridings with MP names and emails is a significant data task. Strategy:
1. Use the public list from ourcommons.ca — MP name, riding, party, email
2. For postal code → riding mapping: use the first 3 characters (FSA) which maps to ~1-3 ridings
3. Where FSA maps to multiple ridings, show all possibilities and let user pick
4. MP emails follow the pattern: firstname.lastname@parl.gc.ca
5. Store as a static JSON/TS file — no DB needed, changes only at elections

**Minimum viable:** Use FSA (Forward Sortation Area = first 3 postal code chars) → province mapping (already have), plus a curated list of ~50 major ridings for the largest FSAs. Link to ourcommons.ca for the full lookup. Pre-fill email with riding-aware content.

**Better:** Full 338 riding list with FSA mapping from Elections Canada open data.

---

## Build Order & Milestones

**Milestone 1 (commit after):** Features 1 + 10 (OG images + sharper protest copy)
**Milestone 2 (commit after):** Features 2 + 4 + 5 (animations + gap cards + live counter)
**Milestone 3 (commit + deploy after):** Feature 3 (riding lookup + MP email — biggest feature)
**Milestone 4 (commit after):** Features 6 + 7 (province comparison + consequences)
**Milestone 5 (commit + deploy after):** Features 8 + 9 (trends + embed)

Push to GitHub and deploy to Vercel after milestones 3 and 5.

---

## Technical Notes
- OG image generation uses `next/og` ImageResponse — no external services
- Ridings data is static, no DB table needed
- All builds must run in subagents
- Use Supabase CCandSS MCP for any DB operations
- Commit format: `feat: [brief title]` with file list
- Push immediately after each commit
- BROWSER SESSION: Use `playwright-cli -s=wechoose-overnight` for ALL browser commands
