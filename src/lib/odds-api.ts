// Thin wrapper around The OddsAPI (https://the-odds-api.com).
// Free tier allows 500 requests per month, plenty for a 30 minute refresh
// cycle on a handful of games per night. We cache responses for 25 minutes
// (slightly under the cron interval) so a render never re-fetches.
//
// When `ODDS_API_KEY` is missing we synthesize plausible lines around the
// model's prediction so the UI still has something to render. Synthesized
// lines are clearly tagged so we never surface them as if they were live.

import type { BookLine, Sportsbook, PropMarket, Player } from "./types";
import { ALL_BOOKS } from "./types";
import { cacheWrap } from "./cache";

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";

const MARKET_KEY: Record<PropMarket, string> = {
  PTS: "player_points",
  REB: "player_rebounds",
  AST: "player_assists",
  "3PM": "player_threes",
  PRA: "player_points_rebounds_assists"
};

interface OddsApiOutcome {
  name: string; // "Over" | "Under"
  description?: string; // player name
  price: number; // American odds
  point: number; // line
}

interface OddsApiMarket {
  key: string;
  outcomes: OddsApiOutcome[];
}

interface OddsApiBookmaker {
  key: string;
  title: string;
  markets: OddsApiMarket[];
}

interface OddsApiEvent {
  id: string;
  bookmakers: OddsApiBookmaker[];
}

const BOOK_KEY_TO_NAME: Record<string, Sportsbook> = {
  draftkings: "DraftKings",
  fanduel: "FanDuel",
  betmgm: "BetMGM",
  williamhill_us: "Caesars"
};

export interface FetchedPropLines {
  player: Player;
  market: PropMarket;
  lines: BookLine[];
  synthetic: boolean;
}

async function fetchEventOdds(eventId: string, market: PropMarket): Promise<OddsApiEvent | null> {
  const key = process.env.ODDS_API_KEY;
  if (!key) return null;
  const url =
    `${ODDS_API_BASE}/sports/basketball_nba/events/${eventId}/odds` +
    `?apiKey=${key}` +
    `&regions=us` +
    `&markets=${MARKET_KEY[market]}` +
    `&oddsFormat=american`;
  try {
    const res = await fetch(url, { next: { revalidate: 1500 } });
    if (!res.ok) return null;
    return (await res.json()) as OddsApiEvent;
  } catch {
    return null;
  }
}

export async function fetchPropLinesForPlayer(
  eventId: string,
  player: Player,
  market: PropMarket,
  fallbackMean: number
): Promise<FetchedPropLines> {
  return cacheWrap(`odds_${eventId}_${player.id}_${market}`, 25 * 60_000, async () => {
    const data = await fetchEventOdds(eventId, market);
    if (!data) {
      return synthesize(player, market, fallbackMean);
    }
    const lines: BookLine[] = [];
    for (const bm of data.bookmakers) {
      const bookName = BOOK_KEY_TO_NAME[bm.key];
      if (!bookName) continue;
      const m = bm.markets.find((mm) => mm.key === MARKET_KEY[market]);
      if (!m) continue;
      const playerOver = m.outcomes.find(
        (o) => o.name === "Over" && o.description?.toLowerCase() === player.name.toLowerCase()
      );
      const playerUnder = m.outcomes.find(
        (o) => o.name === "Under" && o.description?.toLowerCase() === player.name.toLowerCase()
      );
      if (!playerOver || !playerUnder) continue;
      lines.push({
        book: bookName,
        line: playerOver.point,
        overPrice: playerOver.price,
        underPrice: playerUnder.price
      });
    }
    if (lines.length === 0) return synthesize(player, market, fallbackMean);
    return { player, market, lines, synthetic: false };
  });
}

function synthesize(player: Player, market: PropMarket, mean: number): FetchedPropLines {
  // Round to nearest 0.5 then scatter slightly across the four major books.
  const base = Math.round(mean * 2) / 2;
  const scatter = [-0.5, 0, 0.5, 0];
  const prices = [-110, -115, -110, -120];
  const lines: BookLine[] = ALL_BOOKS.map((book, i) => ({
    book,
    line: base + (scatter[i] ?? 0),
    overPrice: prices[i] ?? -110,
    underPrice: -110
  }));
  return { player, market, lines, synthetic: true };
}
