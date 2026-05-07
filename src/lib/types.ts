// Shared types used across the data layer, model, and UI. Kept narrow on
// purpose. Strict TS, no `any`.

export type PropMarket = "PTS" | "REB" | "AST" | "3PM" | "PRA";

export const ALL_MARKETS: PropMarket[] = ["PTS", "REB", "AST", "3PM", "PRA"];

export type Sportsbook =
  | "DraftKings"
  | "FanDuel"
  | "BetMGM"
  | "Caesars";

export const ALL_BOOKS: Sportsbook[] = [
  "DraftKings",
  "FanDuel",
  "BetMGM",
  "Caesars"
];

export interface BookLine {
  book: Sportsbook;
  line: number;
  overPrice: number; // American odds, e.g. -110, +120
  underPrice: number;
}

export interface Player {
  id: string;
  name: string;
  team: TeamCode;
  position: "PG" | "SG" | "SF" | "PF" | "C";
  jersey?: string;
}

export interface PlayerGameLog {
  date: string; // ISO yyyy-mm-dd
  opp: TeamCode;
  min: number;
  pts: number;
  reb: number;
  ast: number;
  threes: number;
  usage: number; // 0..1
  home: boolean;
}

export interface PlayerSeasonAverages {
  gp: number;
  min: number;
  pts: number;
  reb: number;
  ast: number;
  threes: number;
  usage: number;
}

export type TeamCode =
  | "ATL" | "BOS" | "BKN" | "CHA" | "CHI" | "CLE" | "DAL" | "DEN"
  | "DET" | "GSW" | "HOU" | "IND" | "LAC" | "LAL" | "MEM" | "MIA"
  | "MIL" | "MIN" | "NOP" | "NYK" | "OKC" | "ORL" | "PHI" | "PHX"
  | "POR" | "SAC" | "SAS" | "TOR" | "UTA" | "WAS";

export interface Team {
  code: TeamCode;
  name: string;
  fullName: string;
  city: string;
  conference: "East" | "West";
}

export interface DefenseVsPosition {
  team: TeamCode;
  position: Player["position"];
  ptsAllowed: number;
  rebAllowed: number;
  astAllowed: number;
  threesAllowed: number;
  rank: number; // 1 best, 30 worst
}

export interface PaceContext {
  team: TeamCode;
  pace: number; // possessions per 48
}

export interface Game {
  id: string;
  date: string; // ISO yyyy-mm-dd
  tipoffISO: string; // ISO timestamp
  home: TeamCode;
  away: TeamCode;
  venue?: string;
  series: SeriesState;
  starters: { home: string[]; away: string[] }; // player ids
}

export interface SeriesState {
  round: "R1" | "R2" | "CF" | "Finals";
  homeWins: number;
  awayWins: number;
  // human readable, e.g. "Knicks lead 2-1"
  summary: string;
}

export interface PropPrediction {
  market: PropMarket;
  mean: number;
  ciLow: number;
  ciHigh: number;
  factors: Factors;
}

export interface Factors {
  last5Avg: number;
  seasonAvg: number;
  vsOpp: number; // historical avg vs this opponent
  oppDefRankVsPos: number;
  paceAdjustment: number; // expressed as multiplier vs season avg, e.g. 1.03
  restDays: number;
  backToBack: boolean;
  homeAway: "H" | "A";
  usageTrend: number; // last 5 / season ratio
}

export interface PropRow {
  player: Player;
  market: PropMarket;
  prediction: PropPrediction;
  lines: BookLine[];
  bestOver: BookLine | null;
  bestUnder: BookLine | null;
  edge: Edge;
  reasoning?: string; // plain English paragraph from Claude, optional
  updatedISO: string;
}

export type EdgeLean = "OVER" | "UNDER" | "NONE";

export interface Edge {
  lean: EdgeLean;
  consensusLine: number;
  diff: number; // prediction.mean - consensusLine
  confidencePct: number; // 0..100
}

export interface HistoricalRecord {
  date: string;
  game: string; // human readable matchup
  player: string;
  market: PropMarket;
  predicted: number;
  line: number;
  lean: EdgeLean;
  actual: number;
  hit: boolean | null; // null when no clear lean
  errorAbs: number;
}
