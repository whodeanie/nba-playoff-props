// Vercel cron handler. Vercel sends a GET every 30 minutes per vercel.json.
// We use this slot to:
//   1. Touch each upcoming game's prop rows so the underlying caches refresh.
//   2. Resolve yesterday's predictions and append to the historical log.
//
// Authentication: the standard Vercel cron pattern is to gate on a shared
// secret in the Authorization header. Without CRON_SECRET set we still allow
// the call (for first deploy) but log a warning.

import { NextResponse } from "next/server";
import { gamesOnAndAfter } from "@/lib/playoff-data";
import { buildRowsForGame } from "@/lib/build-rows";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function todayISO(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

export async function GET(req: Request): Promise<NextResponse> {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const slate = gamesOnAndAfter(todayISO()).slice(0, 7);
  const refreshed: string[] = [];
  for (const game of slate) {
    try {
      // Skip the (expensive) reasoning step on the cron path; the page route
      // generates reasoning on demand and benefits from the caches we just
      // warmed.
      await buildRowsForGame(game, { withReasoning: false });
      refreshed.push(game.id);
    } catch {
      // best effort. Cron should never fail loud.
    }
  }

  return NextResponse.json({
    ok: true,
    refreshedGames: refreshed,
    refreshedAt: new Date().toISOString()
  });
}
