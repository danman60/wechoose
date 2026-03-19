# Current Work - WeChoose

## Last Session Summary
Built WeChoose from scaffold through full deployment with 10 virality features. Started with Phase 6 (design pass), deployed to Vercel, seeded data, then ran an overnight session that added OG images, share buttons, gap cards, needle animation, 126 riding pages with MP email links, province comparison, consequence simulator, trends, embed widget, and protest copy. Ran automated test suite (38/42 pass), found 3 bugs, fixed all 3.

## What Changed
- `8f3ae84` fix: design pass + slug-to-UUID mapping + aggregate fixes
- `3b1addf` docs: update CURRENT_WORK.md
- `67c4f1c` feat: compact grid layout for budget allocator cards
- `900b13f` feat: OG share images, share buttons, gap cards, live counter, protest copy
- `780ec14` feat: needle animation after submission + gap cards on results
- `efc78cb` feat: riding lookup, MP email, 126 ridings, postal code detection
- `b2106b5` feat: province comparison page + consequence simulator
- `596fac5` feat: trends page, embed widget, nav updates, DB migration
- `5a74b3a` feat: demographics, Your Tax Dollars, Tax Freedom Day, privacy layer
- `60e78a1` fix: 3 bugs from test report + mobile grid + type fixes

## Build Status
PASSING — Next.js 16.2.0 (Turbopack), all pages building clean. One deprecation warning (middleware → proxy convention).

## Known Bugs & Issues
- `supabaseAdmin` cast to `any` in src/app/api/allocate/route.ts:7 — needs proper generated types via `supabase gen types`
- Middleware deprecation warning — Next.js 16 wants "proxy" convention instead of "middleware"
- Only 1 trend snapshot (needs daily cron to accumulate time-series data)
- Embed widget submits only 6 categories (by design)
- Ridings data from 44th Parliament — may need update post-election
- 126 ridings covered out of 338 total — remainder link to ourcommons.ca

## Tests
- Last test run: 2026-03-19 14:01 ET, 38/42 passed, report at tests/reports/run-20260319-140112/report.md
- 3 bugs found and fixed (BUG-001: UI submit 500, BUG-002: demographics not saved, BUG-003: email MP 0%)
- Post-fix deploy NOT yet retested

## Next Steps (priority order)
1. Retest after bugfixes — run /test-webapp to verify BUG-001/002/003 are fixed in production
2. Generate Supabase types (`supabase gen types`) to replace `any` cast
3. Set up daily cron to snapshot aggregate_cache → aggregate_snapshots for trends
4. Register wechoose.io domain and point to Vercel
5. Seed more diverse fake allocations with varied provinces/demographics
6. Expand ridings data to all 338 federal ridings
7. Migrate middleware.ts to proxy convention (Next.js 16)
8. Module 3 (People's Referendum) — v2 expansion

## Gotchas for Next Session
- Supabase is CCandSS project (shared with other apps — use wechoose table prefixes implicitly via table names)
- API route uses `supabaseAdmin` (service role) directly — NOT server actions (cookies() fails in API routes in Next.js 16)
- aggregate_cache has COALESCE-based unique index for NULL province handling
- Seed data: 15 fake allocations + 1 test allocation from test run
- Embed page has its own layout.tsx (no header/footer) — Next.js route group
- PostalCodeInput stores riding to sessionStorage for results page Email MP button

## Deployed
- **URL:** https://wechoose-two.vercel.app
- **GitHub:** https://github.com/danman60/wechoose
- **Supabase:** CCandSS (netbsyvxrhrqxyzqflmd)
