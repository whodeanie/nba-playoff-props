// The prediction model. Documented end to end in MODEL.md.
//
// Per player prop:
//   1. Pull last 10 games + season averages.
//   2. Adjust for opponent defense vs position.
//   3. Adjust for pace differential.
//   4. Adjust for usage trend (last 5 vs season).
//   5. Adjust for rest days, back-to-back, home/away.
//   6. Predict mean using weighted blend (60 percent recent form,
//      30 percent season avg, 10 percent vs opponent matchup).
//   7. Compute confidence interval using historical variance for that stat.
//   8. Compare to current line to flag a lean or no-edge.
//
// Pure functions. No I/O. Tested in tests/model.test.ts.

import type {
  PropMarket,
  Player,
  PlayerSeasonAverages,
  PlayerGameLog,
  DefenseVsPosition,
  Factors,
  PropPrediction,
  Edge,
  EdgeLean,
  BookLine,
  TeamCode
} from "./types";
import { consensusLine } from "./format";

// Standard deviation per market, calibrated against historical playoff
// variance. Used to size the 80 percent confidence interval.
const STDEV: Record<PropMarket, number> = {
  PTS: 6.0,
  REB: 2.6,
  AST: 2.0,
  "3PM": 1.4,
  PRA: 7.6
};

// Edge thresholds. Below 1.0 is noise; we never lean either way for a
// half-point gap.
const EDGE_THRESHOLD: Record<PropMarket, number> = {
  PTS: 1.5,
  REB: 0.8,
  AST: 0.7,
  "3PM": 0.5,
  PRA: 2.0
};

// League average DVP per stat per position. Used to convert a team's DVP
// number into a multiplier vs league average.
const LEAGUE_AVG_DVP_PTS = 20.5;
const LEAGUE_AVG_DVP_REB = 5.0;
const LEAGUE_AVG_DVP_AST = 3.6;
const LEAGUE_AVG_DVP_3PM = 1.9;

const LEAGUE_AVG_PACE = 99.0;

export interface ModelInput {
  player: Player;
  market: PropMarket;
  season: PlayerSeasonAverages;
  recent: PlayerGameLog[]; // ideally 10 entries
  oppDvp: DefenseVsPosition | null;
  oppPace: number;
  ownPace: number;
  restDays: number;
  backToBack: boolean;
  home: boolean;
}

function statFromLog(market: PropMarket, log: PlayerGameLog): number {
  switch (market) {
    case "PTS":
      return log.pts;
    case "REB":
      return log.reb;
    case "AST":
      return log.ast;
    case "3PM":
      return log.threes;
    case "PRA":
      return log.pts + log.reb + log.ast;
  }
}

function statFromSeason(market: PropMarket, s: PlayerSeasonAverages): number {
  switch (market) {
    case "PTS":
      return s.pts;
    case "REB":
      return s.reb;
    case "AST":
      return s.ast;
    case "3PM":
      return s.threes;
    case "PRA":
      return s.pts + s.reb + s.ast;
  }
}

function dvpMultiplier(market: PropMarket, dvp: DefenseVsPosition | null): number {
  if (!dvp) return 1.0;
  let allowed: number;
  let leagueAvg: number;
  switch (market) {
    case "PTS":
      allowed = dvp.ptsAllowed;
      leagueAvg = LEAGUE_AVG_DVP_PTS;
      break;
    case "REB":
      allowed = dvp.rebAllowed;
      leagueAvg = LEAGUE_AVG_DVP_REB;
      break;
    case "AST":
      allowed = dvp.astAllowed;
      leagueAvg = LEAGUE_AVG_DVP_AST;
      break;
    case "3PM":
      allowed = dvp.threesAllowed;
      leagueAvg = LEAGUE_AVG_DVP_3PM;
      break;
    case "PRA":
      allowed = dvp.ptsAllowed + dvp.rebAllowed + dvp.astAllowed;
      leagueAvg = LEAGUE_AVG_DVP_PTS + LEAGUE_AVG_DVP_REB + LEAGUE_AVG_DVP_AST;
      break;
  }
  // Cap influence at +/- 12 percent.
  const raw = allowed / leagueAvg;
  return Math.max(0.88, Math.min(1.12, raw));
}

function paceMultiplier(oppPace: number, ownPace: number): number {
  // Combined pace estimate: average of the two team paces, normalized to
  // league average. Capped at +/- 6 percent.
  const combined = (oppPace + ownPace) / 2;
  const raw = combined / LEAGUE_AVG_PACE;
  return Math.max(0.94, Math.min(1.06, raw));
}

function restAdjustment(restDays: number, backToBack: boolean): number {
  if (backToBack) return 0.97;
  if (restDays >= 3) return 1.02;
  return 1.0;
}

function homeAwayAdjustment(home: boolean): number {
  return home ? 1.02 : 0.98;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function vsOppHistorical(market: PropMarket, recent: PlayerGameLog[], opp: TeamCode): number {
  const matches = recent.filter((g) => g.opp === opp);
  if (matches.length === 0) return avg(recent.map((g) => statFromLog(market, g)));
  return avg(matches.map((g) => statFromLog(market, g)));
}

export function predict(
  input: ModelInput,
  opp: TeamCode
): { prediction: PropPrediction; factors: Factors } {
  const { market, season, recent, oppDvp, oppPace, ownPace, restDays, backToBack, home } = input;

  const last5 = recent.slice(0, 5).map((g) => statFromLog(market, g));
  const last5Avg = avg(last5);
  const seasonAvg = statFromSeason(market, season);
  const vsOpp = vsOppHistorical(market, recent, opp);

  const blended = 0.6 * last5Avg + 0.3 * seasonAvg + 0.1 * vsOpp;
  const dvpMult = dvpMultiplier(market, oppDvp);
  const paceMult = paceMultiplier(oppPace, ownPace);
  const restMult = restAdjustment(restDays, backToBack);
  const haMult = homeAwayAdjustment(home);

  const usageTrendRatio = season.usage > 0
    ? avg(recent.slice(0, 5).map((g) => g.usage)) / season.usage
    : 1;
  // Cap usage influence at +/- 8 percent.
  const usageMult = Math.max(0.92, Math.min(1.08, usageTrendRatio));

  const mean = blended * dvpMult * paceMult * restMult * haMult * usageMult;

  const sd = STDEV[market];
  // 80 percent CI ~ +/- 1.28 sigma. Tightened slightly because the multipliers
  // are bounded.
  const halfWidth = 1.28 * sd * 0.85;
  const ciLow = Math.max(0, mean - halfWidth);
  const ciHigh = mean + halfWidth;

  const factors: Factors = {
    last5Avg: round1(last5Avg),
    seasonAvg: round1(seasonAvg),
    vsOpp: round1(vsOpp),
    oppDefRankVsPos: oppDvp?.rank ?? 15,
    paceAdjustment: round3(paceMult),
    restDays,
    backToBack,
    homeAway: home ? "H" : "A",
    usageTrend: round3(usageMult)
  };

  return {
    prediction: {
      market,
      mean: round1(mean),
      ciLow: round1(ciLow),
      ciHigh: round1(ciHigh),
      factors
    },
    factors
  };
}

export function classifyEdge(market: PropMarket, mean: number, lines: BookLine[]): Edge {
  if (lines.length === 0) {
    return { lean: "NONE", consensusLine: 0, diff: 0, confidencePct: 0 };
  }
  const consensus = consensusLine(lines);
  const diff = mean - consensus;
  const threshold = EDGE_THRESHOLD[market];

  let lean: EdgeLean;
  if (diff >= threshold) lean = "OVER";
  else if (diff <= -threshold) lean = "UNDER";
  else lean = "NONE";

  // Confidence as a function of how far past the threshold we are. Cap at
  // 80 percent so we never claim near-certainty.
  const overage = Math.max(0, Math.abs(diff) - threshold);
  const confidencePct = Math.min(80, 50 + Math.round(overage * 8));

  return {
    lean,
    consensusLine: consensus,
    diff: round1(diff),
    confidencePct: lean === "NONE" ? 0 : confidencePct
  };
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
function round3(n: number): number { return Math.round(n * 1000) / 1000; }

// Convenience export for tests.
export const __internal = {
  dvpMultiplier,
  paceMultiplier,
  restAdjustment,
  homeAwayAdjustment,
  STDEV,
  EDGE_THRESHOLD
};
