// Glue code that ties data sources, model, and reasoning together to
// produce the PropRow array a page renders.

import type {
  Game,
  PropRow,
  PropMarket,
  Player,
  TeamCode
} from "./types";
import { ALL_MARKETS } from "./types";
import { findPlayer } from "./playoff-data";
import { getLastNGames, getSeasonAverages, getDvP, getPace } from "./nba-stats";
import { fetchPropLinesForPlayer } from "./odds-api";
import { predict, classifyEdge } from "./model";
import { generateReasoning } from "./reasoning";
import { bestOver, bestUnder } from "./format";

interface BuildOptions {
  withReasoning?: boolean; // expensive, only on detail views
  marketsOverride?: PropMarket[];
}

export async function buildRowsForGame(game: Game, opts: BuildOptions = {}): Promise<PropRow[]> {
  const markets = opts.marketsOverride ?? ALL_MARKETS;
  const allStarterIds = [...game.starters.home, ...game.starters.away];
  const rows: PropRow[] = [];

  await Promise.all(
    allStarterIds.flatMap((pid) => {
      const player = findPlayer(pid);
      if (!player) return [];
      return markets.map(async (market) => {
        const row = await buildOneRow(game, player, market, opts.withReasoning ?? false);
        if (row) rows.push(row);
      });
    })
  );

  // Sort by absolute edge so the most interesting rows surface first.
  rows.sort((a, b) => Math.abs(b.edge.diff) - Math.abs(a.edge.diff));
  return rows;
}

export async function buildOneRow(
  game: Game,
  player: Player,
  market: PropMarket,
  withReasoning: boolean
): Promise<PropRow | null> {
  const opp = oppOf(game, player.team);
  if (!opp) return null;

  const [season, recent, oppDvp, oppPace, ownPace] = await Promise.all([
    getSeasonAverages(player.id),
    getLastNGames(player.id, 10),
    getDvP(opp, player.position),
    getPace(opp),
    getPace(player.team)
  ]);
  if (!season || recent.length === 0) return null;

  const home = game.home === player.team;
  const restDays = 2;
  const backToBack = false;

  const { prediction } = predict(
    {
      player,
      market,
      season,
      recent,
      oppDvp,
      oppPace,
      ownPace,
      restDays,
      backToBack,
      home
    },
    opp
  );

  const fetched = await fetchPropLinesForPlayer(game.id, player, market, prediction.mean);
  const lines = fetched.lines;
  const edge = classifyEdge(market, prediction.mean, lines);
  const bo = bestOver(lines);
  const bu = bestUnder(lines);

  let reasoning: string | undefined;
  if (withReasoning) {
    reasoning = await generateReasoning({
      player,
      oppCode: opp,
      market,
      prediction,
      factors: prediction.factors,
      lines,
      bestOver: bo,
      bestUnder: bu,
      edge
    });
  }

  return {
    player,
    market,
    prediction,
    lines,
    bestOver: bo,
    bestUnder: bu,
    edge,
    ...(reasoning ? { reasoning } : {}),
    updatedISO: new Date().toISOString()
  };
}

function oppOf(game: Game, team: TeamCode): TeamCode | null {
  if (game.home === team) return game.away;
  if (game.away === team) return game.home;
  return null;
}
