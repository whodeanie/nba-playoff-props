# Model

This document describes the prediction model end to end. No black box. The implementation lives in `src/lib/model.ts` as pure functions.

## Inputs per prop

For each (player, market) pair on tonight's slate we collect:

1. Last 10 game logs (regular season + playoffs blended). Source: stats.nba.com when reachable, otherwise the static fallback in `playoff-data.ts`.
2. Season averages for the same stat.
3. Historical performance vs the opponent in question.
4. Opponent defense vs position (PTS, REB, AST, 3PM allowed by position, league rank).
5. Pace context. Both teams' season pace, expressed as possessions per 48.
6. Rest days since last game and a back-to-back flag.
7. Home or away.
8. Usage trend (last 5 game usage rate divided by season usage rate).

## Step 1: weighted blend

```
blended = 0.60 * last5_avg + 0.30 * season_avg + 0.10 * vs_opp_avg
```

When the player has not faced this opponent recently we substitute the season average for the vs_opp term so the prediction does not collapse to a small sample.

## Step 2: defense vs position multiplier

For the relevant stat we compute `allowed_per_game / league_avg_for_that_stat`. The result is capped at 0.88 to 1.12 so a single matchup can never swing a projection by more than 12 percent.

League averages used:

| Stat | League average allowed per game per position |
| --- | --- |
| PTS | 20.5 |
| REB | 5.0 |
| AST | 3.6 |
| 3PM | 1.9 |

## Step 3: pace multiplier

```
combined_pace = (own_pace + opp_pace) / 2
pace_mult = combined_pace / 99.0   (capped between 0.94 and 1.06)
```

Pace influences possession count, which in turn lifts or trims counting stats. The cap prevents a slow vs slow game from collapsing a projection to nothing.

## Step 4: rest adjustment

```
back_to_back -> 0.97
3+ days rest -> 1.02
otherwise -> 1.00
```

## Step 5: home/away adjustment

```
home -> 1.02
away -> 0.98
```

A small but persistent edge in the box score for home players over a long sample.

## Step 6: usage trend

```
ratio = last5_usage / season_usage
usage_mult = clamp(ratio, 0.92, 1.08)
```

Catches role changes (injury return, lineup shift). Capped tightly because raw usage swings can be noisy.

## Step 7: assembly

```
mean = blended
       * dvp_mult
       * pace_mult
       * rest_mult
       * home_away_mult
       * usage_mult
```

## Step 8: confidence interval

We use a per market standard deviation calibrated to historical playoff variance, then quote an 80 percent confidence interval as roughly 1.28 sigma either side of the mean. The CI is shrunk slightly because the multipliers above are bounded.

| Stat | Sigma |
| --- | --- |
| PTS | 6.0 |
| REB | 2.6 |
| AST | 2.0 |
| 3PM | 1.4 |
| PRA | 7.6 |

## Step 9: edge classification

Compare the model's mean to the consensus line across all books that quote the prop. We flag a lean only when the gap exceeds a stat specific threshold. Below the threshold we publish "no edge". This is the right call most of the time and keeps us honest.

| Stat | Threshold |
| --- | --- |
| PTS | 1.5 |
| REB | 0.8 |
| AST | 0.7 |
| 3PM | 0.5 |
| PRA | 2.0 |

A confidence percentage is published per leaning row. It scales with how far past the threshold the gap is, capped at 80 percent so we never claim near-certainty.

## Plain English paragraph

For each row on the detail view we send the structured factors above to Claude Haiku 4.5 with a tight system prompt. The model returns one paragraph, 60 to 100 words, conversational. We strip any em or en dashes on the way out as a hard rule.

The paragraph is cached per (player, market, projection mean, line signature). It only re-runs when the math materially changes, so token spend per refresh is tiny.

## Known limitations

1. The unofficial stats.nba.com endpoints are brittle. The static fallback is updated by hand for the current playoff round; live integration is best effort.
2. No injury pull. A late scratch will show stale projections until the next refresh. We label every row with the freshness timestamp so the user can decide.
3. Confidence intervals assume roughly normal residuals; tails are thicker in playoff basketball so very large overshoots are slightly underweighted.
4. Calibration on the historical page is a single bucket today; once we have a few hundred resolved leans we will break it out by confidence band.

## How to verify

```
npm test
```

The test suite (vitest) covers the multiplier bounds, the blend math, and the edge classifier.
