# Current Work - WeChoose

## Active Task
ALL OVERNIGHT BUILD MILESTONES COMPLETE. Deployed to production.

## Milestone Progress
- [x] Milestone 1: OG Share Images + Protest Copy (900b13f)
- [x] Milestone 2: Needle Animation + Gap Cards + Live Counter (780ec14)
- [x] Milestone 3: Riding Lookup + MP Email Links — 126 ridings (efc78cb)
- [x] Milestone 4: Province Comparison + Consequence Simulator (b2106b5)
- [x] Milestone 5: Trends + Embed Widget + Nav Updates (596fac5)

## Deployed
- **URL:** https://wechoose-two.vercel.app
- **GitHub:** https://github.com/danman60/wechoose
- **Supabase:** CCandSS (netbsyvxrhrqxyzqflmd)

## What Was Built (Overnight Session 2026-03-19)

### New Pages
- `/provinces` — Provincial priority grid with top priorities and biggest gaps per province
- `/trends` — Budget priority trends over time with recharts line charts
- `/embed` — Standalone embed widget (no header/footer), 6 key categories, generates embed code
- `/riding/[slug]` — 126 riding pages with MP info, national vs government comparison, Email MP button

### New Components
- `opengraph-image.tsx` — OG image generation for share cards (next/og ImageResponse)
- `ShareButtons` — Twitter/X, Facebook, Copy Link sharing
- `GapCards` — Top 3 user vs government gaps with copy-to-clipboard
- `LiveCounter` — 30s polling counter with smooth count-up animation
- `NeedleAnimation` — "Your vote moved the needle" post-submission animation
- `ConsequencePanel` — "What would actually happen?" expandable section
- `EmailMPButton` — mailto: link with pre-filled subject/body for user's MP
- `EmbedAllocator` — Compact 6-category allocator for iframe embedding
- `TrendsChart` — Interactive recharts line chart with category toggles

### Data Files
- `ridings.ts` — 126 federal ridings with MP name/party/email, FSA-to-riding mapping
- `consequences.ts` — Real-world consequences for all 14 budget categories

### DB Changes
- `aggregate_snapshots` table (Supabase migration) for time-series tracking
- Initial snapshot seeded from current aggregate_cache

### Copy Updates
- Homepage hero: "The government spends $521.4B of your money every year. They never asked how."
- Protest banner on all pages: "This is not a government website. It should be."
- Results header: "Here's what Canadians actually want — and what they actually get."
- About page: Stronger mission statement

### Navigation
- Added Provinces and Trends to nav bar
- "Allocate Your Budget" shortened to "Allocate" for cleaner nav

## Smoke Test Results (All Pass)
- Homepage loads with counter + protest banner
- Allocator grid works
- Results page loads with comparison bars
- Provinces page loads with grid
- Riding page (Ottawa Centre) loads with MP info
- Trends page loads
- Embed page loads standalone
- Tax calculator works

## Known Issues
- Middleware deprecation warning (Next.js 16 wants "proxy" convention)
- Only 1 trend snapshot (need daily cron to accumulate time-series data)
- Embed widget submits only 6 categories (not all 14) — by design for simplicity
- Ridings data from 44th Parliament (may need update post-2025 election)

## Next Steps
1. Set up daily cron to snapshot aggregate_cache → aggregate_snapshots
2. Register wechoose.io domain and point to Vercel
3. Seed more diverse fake allocations with varied provinces
4. Consider migrating middleware.ts to proxy convention
5. Module 3 (People's Referendum) — v2 expansion
