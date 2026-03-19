# Current Work - WeChoose

## Active Task
Demographics feature deployed. All overnight milestones + demographics complete.

## Recent Changes
- **5a74b3a** feat: demographics, Your Tax Dollars, Tax Freedom Day, privacy layer
- **5894ec3** docs: update CURRENT_WORK.md — all overnight milestones complete
- **596fac5** feat: trends page, embed widget, nav updates, DB migration
- **b2106b5** feat: province comparison page + consequence simulator
- **efc78cb** feat: riding lookup, MP email, 126 ridings, postal code detection
- **780ec14** feat: needle animation after submission + gap cards on results
- **900b13f** feat: OG share images, share buttons, gap cards, live counter, protest copy

## Deployed
- **URL:** https://wechoose-two.vercel.app
- **GitHub:** https://github.com/danman60/wechoose
- **Supabase:** CCandSS (netbsyvxrhrqxyzqflmd)

## Demographics Feature (Just Built)
- Optional age bracket + income bracket inputs on allocator page
- "Your Tax Dollars" on results: per-category dollars + days worked + Tax Freedom Day
- "How People Like You Voted" demographic comparison (age/income tabs)
- PrivacyNote component threaded throughout (compact/inline/detailed variants)
- demographic_aggregate_cache table with Postgres trigger
- /api/aggregate/demographics endpoint with N>=3 anonymity threshold
- 16 existing allocations seeded with demographics

## What's Working
- Homepage with protest copy + live counter + banner
- Allocator with 14 categories, postal code → riding detection, demographics
- Results: comparison bars, gap cards, consequences, demographics, tax dollars, share, email MP
- 126 riding pages with MP info
- Province comparison page
- Trends page (1 snapshot, needs daily cron)
- Embed widget at /embed
- Tax Truth calculator
- DDD feedback widget

## Next Steps
1. Set up daily cron for aggregate snapshots
2. Register wechoose.io domain
3. Update privacy page with explicit demographics language
4. Seed more diverse allocations
