@AGENTS.md

# WeChoose — Direct Democracy Budget Platform

## What This Is
A civic engagement platform where Canadians allocate the federal budget by percentage, compare to actual government spending, and see aggregate results from all users. Designed to look like canada.ca as a form of protest.

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (CCandSS project) for database
- Vercel for deployment
- Anonymous-first (IP hash anti-spam, no auth required)

## Key Patterns
- **No auth** — all pages are public. Anti-spam via SHA-256 hashed IP.
- **API routes for IP access** — `/api/allocate` handles submissions because server actions can't read IP headers.
- **Supabase 3-file pattern** — `client.ts`, `server.ts`, `admin.ts` in `src/lib/supabase/`
- **Budget data hardcoded** — `src/lib/data/` contains actual 2023-24 federal budget data. Also seeded to Supabase.
- **Aggregate cache** — Pre-computed averages in `aggregate_cache` table, updated via Postgres trigger on new allocations.
- **canada.ca design** — Lato headings, Noto Sans body, navy `#26374A`, red accent `#AF3C43`, zero border-radius buttons.

## Entities
- `budget_categories` — 14 federal spending categories with actual data
- `revenue_sources` — 10 tax revenue categories
- `allocations` — User submissions (anonymous, IP-hashed)
- `allocation_items` — Individual category percentages within an allocation
- `tax_brackets` — Federal + provincial tax brackets
- `aggregate_cache` — Pre-computed aggregate results

## Deployment
- **URL:** TBD (wechoose.vercel.app or wechoose.io)
- **Supabase:** CCandSS

## Test Account
- No auth needed — anonymous platform

<!-- GitNexus rules: see master ~/projects/CLAUDE.md → "GitNexus Workflow" section. Per-project index name is the project folder name. -->
