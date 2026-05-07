# NBA Playoff Props

Player prop predictions for the NBA playoffs. Plain English reasoning on every prop. Updated every 30 minutes. Free.

Live: https://nba-playoff-props.vercel.app

## What it does

Surfaces player prop projections (PTS, REB, AST, 3PM, PRA) for every starter on tonight's playoff slate, compares them to live lines from DraftKings, FanDuel, BetMGM, and Caesars, highlights the best price for the over and the under on every row, and explains every projection in one paragraph of conversational English.

The plain English explanation is the differentiator. Most prop tools dump numbers. This one tells you why.

## What it does not do

No "lock of the day" calls. No paid tier. No email capture. No popups. No promises about future results. The historical accuracy page publishes every resolved prediction, including the misses.

## Tech stack

Next.js 15 App Router, TypeScript strict, Tailwind, Groq via the OpenAI SDK, file based caching. Deploys to Vercel free tier with one cron job (30 minute refresh) and ISR on every page.

All data sources default to free. The Groq key is optional; without it the app falls back to a deterministic templated explanation. The OddsAPI key is optional; without it the app synthesizes plausible lines around the projection so the UI still renders during local development.

## Cost

The OddsAPI free tier gives 500 requests per month. We send roughly 4 requests per game per refresh (one per market) plus a small number of metadata calls, so a typical evening with 4 games costs about 80 requests. A full playoff month sits comfortably under the free cap.

Groq's free tier covers Llama 3.3 70B with generous daily token limits, plenty for a personal site refreshed every 30 minutes. Hit the cap and the app silently switches to the templated paragraph for the rest of the day.

Vercel free tier covers everything else: hosting, ISR, two cron jobs (we use one).

## Setup

```
git clone https://github.com/whodeanie/nba-playoff-props.git
cd nba-playoff-props
cp .env.example .env.local
# fill in ODDS_API_KEY (optional), GROQ_API_KEY (optional), CRON_SECRET (any string)
npm install
npm run dev
```

Open http://localhost:3000.

## Project layout

```
src/
  app/
    page.tsx                  home, slate of upcoming games
    games/[gameId]/page.tsx   per game prop table with reasoning
    players/[playerId]/page.tsx  player profile, last 10, trends
    historical/page.tsx       hit rate, calibration, every resolved pick
    api/cron/refresh/route.ts Vercel cron handler
    api/og/[gameId]/route.tsx per game OG image
  components/                 small presentational pieces
  lib/
    types.ts                  shared types
    playoff-data.ts           static fallback slate, rosters, DvP, pace
    nba-stats.ts              stats.nba.com client (with fallback)
    odds-api.ts               OddsAPI client (with synthesized fallback)
    cache.ts                  file based cache helpers
    model.ts                  prediction math, pure functions
    reasoning.ts              Groq call for plain English paragraph
    historical.ts             hit rate and calibration math
    build-rows.ts             glue code page routes call
tests/
  model.test.ts               vitest covering the math
research/
  PLAYOFF_STATE.md            captured May 2026 playoff state
```

## How a prediction is made

Documented in detail in [MODEL.md](./MODEL.md). Short version: weighted blend of last 5 games (60 percent), season average (30 percent), vs opponent history (10 percent), then multipliers for opponent defense vs position, pace, rest, home/away, and usage trend. Confidence interval is computed from historical variance for that stat type. We only flag a lean when the gap between projection and consensus line exceeds a stat specific threshold.

## Differentiators

1. Plain English paragraph on every prop. Not just a row of numbers.
2. Honest accuracy display. Hit rate, average error, calibration, every resolved pick listed.
3. Line shopping built in. Best price for the over and the under highlighted on every row.

## Disclaimers

Educational analytics. Not financial advice. Past performance does not predict future results. If gambling is no longer fun, call 1 800 GAMBLER.

## License

MIT.
