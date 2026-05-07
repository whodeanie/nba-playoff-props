// Per game Open Graph image. Uses Next's built-in ImageResponse so we don't
// need a separate image service.

import { ImageResponse } from "next/og";
import { getGame, TEAMS } from "@/lib/playoff-data";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

interface RouteParams {
  params: Promise<{ gameId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams): Promise<Response> {
  const { gameId } = await params;
  const game = getGame(gameId);
  const home = game ? TEAMS[game.home] : null;
  const away = game ? TEAMS[game.away] : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0c1018 0%, #171c28 100%)",
          color: "white",
          fontFamily: "system-ui"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 28, opacity: 0.7 }}>NBA Playoff Props</span>
          <span style={{ fontSize: 22, opacity: 0.5 }}>nba-playoff-props.vercel.app</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>
            {away ? away.name : "Game"} at {home ? home.name : ""}
          </div>
          <div style={{ fontSize: 32, opacity: 0.85 }}>
            {game?.series?.summary ?? "Player props with plain English reasoning."}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, opacity: 0.6 }}>
          <span>Predictions, line shopping, accuracy you can verify.</span>
          <span>Free</span>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
