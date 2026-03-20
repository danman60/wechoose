# Current Work - WeChoose

## Last Session Summary
Added educational info popovers with real government budget data to each category card, and fixed mobile slider usability issues (tiny thumb, scroll conflicts, sticky bar overflow). Also drafted social media posts for a popup traffic test.

## What Changed
- `d644c21` feat: animated info popovers with real government budget data (category-details.ts, category-info-popover.tsx, category-card.tsx, slider-group.tsx, package.json)
- `76c1b92` fix: mobile slider usability — larger thumb, touch-action, sticky bar (globals.css, category-card.tsx, slider-group.tsx)

## Build Status
PASSING — Next.js 16.2.0 (Turbopack), all 139 pages building clean. One deprecation warning (middleware → proxy convention).

## Known Bugs & Issues
- `supabaseAdmin` cast to `any` in src/app/api/allocate/route.ts:7 — needs proper generated types via `supabase gen types`
- Middleware deprecation warning — Next.js 16 wants "proxy" convention instead of "middleware"
- Only 1 trend snapshot (needs daily cron to accumulate time-series data)
- Embed widget submits only 6 categories (by design)
- Ridings data from 44th Parliament — may need update post-election
- 126 ridings covered out of 338 total — remainder link to ourcommons.ca
- Post-fix deploy from previous session (BUG-001/002/003) still not retested
- Budget data discrepancies noted by research agent: some category $B figures differ between Annual Financial Report (type-based) and Public Accounts (ministry-based) classifications. See category-details.ts source notes.

## Tests
- Last test run: 2026-03-19 14:01 ET, 38/42 passed, report at tests/reports/run-20260319-140112/report.md
- Untested this session: info popovers, mobile slider fixes

## Next Steps (priority order)
1. Run popup traffic test — post social media content and monitor engagement
2. Retest after bugfixes — verify BUG-001/002/003 fixed in production
3. Register wechoose.io domain and point to Vercel (URL is wechoose-two.vercel.app currently)
4. Set up daily cron to snapshot aggregate_cache → aggregate_snapshots for trends
5. Seed more diverse fake allocations with varied provinces/demographics
6. Generate Supabase types (`supabase gen types`) to replace `any` cast
7. Expand ridings data to all 338 federal ridings
8. Migrate middleware.ts to proxy convention (Next.js 16)

## Gotchas for Next Session
- Supabase is CCandSS project (shared with other apps)
- API route uses `supabaseAdmin` (service role) directly — NOT server actions
- aggregate_cache has COALESCE-based unique index for NULL province handling
- framer-motion was added this session for info popovers
- Slider CSS uses `touch-action: none` — prevents page scroll while dragging slider
- Slider fill track uses CSS custom property `--fill-percent` set inline via React
- Info popover data in src/lib/data/category-details.ts sourced from Annual Financial Report 2023-24 and Public Accounts 2024 Vol II Table 2

## Files Touched This Session
- src/lib/data/category-details.ts (NEW — detailed category descriptions with real govt data)
- src/components/allocator/category-info-popover.tsx (NEW — framer-motion animated popover)
- src/components/allocator/category-card.tsx (modified — added slug prop, info popover, budget-slider class)
- src/components/allocator/slider-group.tsx (modified — passes slug, mobile sticky bar layout)
- src/app/globals.css (modified — budget-slider CSS with custom thumb/track/touch-action)
- package.json / package-lock.json (modified — added framer-motion)

## Deployed
- **URL:** https://wechoose-two.vercel.app
- **GitHub:** https://github.com/danman60/wechoose
- **Supabase:** CCandSS (netbsyvxrhrqxyzqflmd)
