# Current Work - WeChoose

## Active Task
ALL PHASES COMPLETE. App is live and deployed.

## Recent Changes (This Session)
- Phase 6: Design pass — fixed category-card comparison bar, added hover states, dynamic bar scaling in comparison chart, differential badges
- Phase 6: Critical bug fixes — slug-to-UUID mapping in /api/allocate, aggregate API returns slugs, results client keys by slug
- Phase 7: Supabase migration applied (CCandSS) — 6 tables, RLS, aggregate trigger
- Phase 7: Fixed aggregate_cache NULL province uniqueness (COALESCE index)
- Phase 7: Seeded 14 budget categories, 10 revenue sources, 15 fake allocations
- Phase 7: GitHub repo created (danman60/wechoose), Vercel deployed with all env vars
- Phase 8: Production Playwright CLI testing — all pages verified working

## Deployed
- **URL:** https://wechoose-two.vercel.app
- **GitHub:** https://github.com/danman60/wechoose
- **Supabase:** CCandSS (netbsyvxrhrqxyzqflmd)

## What's Working
- Homepage with hero, budget snapshot, 15 allocations counter
- Allocator with 14 category sliders, 100% constraint, postal code input
- Results page with People vs Government comparison bars, differentials
- Tax Truth calculator (all 13 provinces, federal+provincial brackets, CPP/EI/GST/carbon)
- About and Privacy pages
- DDD feedback widget
- Aggregate trigger recalculates on new submissions

## Known Issues
- Middleware deprecation warning (Next.js 16 wants "proxy" instead of "middleware")
- Share page (/results/share/[id]) is placeholder — no detailed allocation view yet
- Vercel URL is wechoose-two.vercel.app (not wechoose.vercel.app — likely taken)
- Domain wechoose.io not yet registered/pointed

## Next Steps
1. Register wechoose.io domain and point to Vercel
2. Build out the share page with actual allocation data + OG image
3. Consider migrating middleware.ts to proxy convention
4. Add province filter on results page
5. Module 3 (People's Referendum) — v2 expansion
