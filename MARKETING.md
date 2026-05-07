# Marketing prep

Drafts only. Nothing here has been posted. Tone is "I built this, sharing it for anyone who finds it useful". No promotional language, no urgency, no calls to action beyond the link.

## Reddit (r/sportsbook, r/sportsbetting)

Title: I built a free NBA playoff prop tool that explains every projection in plain English

Body:

I got tired of prop trackers that throw a wall of numbers at me and call it analysis. So I built one that adds one paragraph of plain English on every prop explaining why the model leans over or under.

It pulls last 10 game form, opponent defense vs position, pace, rest, and home or away, blends them with season averages, and compares the result to current lines from DraftKings, FanDuel, BetMGM, and Caesars. Best price for the over and the under is highlighted on every row.

Honest accuracy is published on a separate page. Hit rate, average error, every resolved pick. No hidden misses.

Free. No login. No popups. No paywall. Built it for myself and figured someone else might find it useful.

Link: https://nba-playoff-props.vercel.app
Source: https://github.com/whodeanie/nba-playoff-props

Feedback welcome, especially on the model.

## Twitter / X thread (5 tweets)

1. I built a free NBA playoff prop tool. The differentiator is plain English. Every projection ships with a paragraph that explains why we lean over or under. Like having a sharp friend texting you the read.

2. The model is a weighted blend of last 5 games, season averages, and head to head history, with multipliers for opponent defense vs position, pace, rest, and home or away. Documented in MODEL.md, no black box.

3. Line shopping is built in. Every row highlights which book has the best price for the over and the under across DraftKings, FanDuel, BetMGM, Caesars.

4. Accuracy page is honest. Hit rate, average error, every resolved pick. We publish the misses too. Decide for yourself how much weight to put on it.

5. Free. No login. No popups. No paywall. https://nba-playoff-props.vercel.app

## Show HN

Title: Show HN: NBA playoff prop predictions with plain English reasoning

Body:

I wrote a small Next.js 15 app that pulls free NBA stats and live odds from The OddsAPI, runs a transparent weighted blend model on each (player, market) pair on tonight's playoff slate, then asks Claude Haiku 4.5 to write a 60 to 100 word paragraph explaining the projection in conversational tone. The paragraph is the differentiator vs the existing prop trackers.

Stack: Next.js 15 App Router, TypeScript strict, Tailwind, Anthropic SDK, file based caching. Deploys to Vercel free tier. Costs are roughly $5 per month at modest traffic. The model and the data sources are documented in the repo (MODEL.md).

What I'd love feedback on:
1. The model. It is intentionally simple. Are there obvious factors I am missing.
2. The accuracy page. Is the calibration framing clear enough.
3. The plain English paragraph. Does it actually help, or is it noise on top of the numbers.

Live: https://nba-playoff-props.vercel.app
Source: https://github.com/whodeanie/nba-playoff-props

Educational analytics. Not financial advice.
