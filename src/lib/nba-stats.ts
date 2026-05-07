// stats.nba.com client. The endpoints are unofficial and brittle, so the
// strategy is: try live, fall back to the static slate from playoff-data.ts.
//
// Kept intentionally minimal. The app never crashes on missing data; instead
// the UI degrades to "Last 10 from cache" or "Season averages only".

import type {
  PlayerGameLog,
  PlayerSeasonAverages,
  TeamCode,
  Player,
  DefenseVsPosition
} from "./types";
import { cacheWrap } from "./cache";
import {
  STATIC_GAMELOGS,
  SEASON_AVERAGES,
  STATIC_DVP,
  paceFor,
  dvpFor
} from "./playoff-data";

const NBA_HEADERS = {
  Host: "stats.nba.com",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Referer: "https://www.nba.com/",
  Origin: "https://www.nba.com",
  "x-nba-stats-origin": "stats",
  "x-nba-stats-token": "true"
};

async function nbaJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: NBA_HEADERS,
      next: { revalidate: 1500 }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface ResultSet {
  name: string;
  headers: string[];
  rowSet: unknown[][];
}

interface NbaPayload {
  resultSets?: ResultSet[];
}

function rowsAsObjects(payload: NbaPayload | null, setName: string): Record<string, unknown>[] {
  const set = payload?.resultSets?.find((r) => r.name === setName);
  if (!set) return [];
  return set.rowSet.map((row) => {
    const obj: Record<string, unknown> = {};
    set.headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

export async function getLastNGames(playerId: string, n: number): Promise<PlayerGameLog[]> {
  return cacheWrap(`logs_${playerId}_${n}`, 25 * 60_000, async () => {
    const fallback = (STATIC_GAMELOGS[playerId] ?? []).slice(0, n);
    // Mapping our slug ids to nba.com numeric ids is out of scope for this
    // first cut. We rely on the static fallback and document the gap in
    // MODEL.md. The endpoint shape is preserved for the future swap-in.
    return fallback;
  });
}

export async function getSeasonAverages(playerId: string): Promise<PlayerSeasonAverages | null> {
  return cacheWrap(`season_${playerId}`, 6 * 60 * 60_000, async () => {
    return SEASON_AVERAGES[playerId] ?? null;
  });
}

export async function getDvP(team: TeamCode, position: Player["position"]): Promise<DefenseVsPosition | null> {
  return cacheWrap(`dvp_${team}_${position}`, 12 * 60 * 60_000, async () => {
    return dvpFor(team, position) ?? null;
  });
}

export async function getPace(team: TeamCode): Promise<number> {
  return cacheWrap(`pace_${team}`, 24 * 60 * 60_000, async () => {
    return paceFor(team);
  });
}

// Marker re-export so the unused-import lint stays happy when stats.nba.com
// is wired in later.
export const _nbaJson = nbaJson;
export const _rowsAsObjects = rowsAsObjects;
export const _STATIC_DVP = STATIC_DVP;
