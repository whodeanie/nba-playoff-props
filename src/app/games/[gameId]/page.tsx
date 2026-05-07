import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGame, TEAMS, STATIC_GAMES } from "@/lib/playoff-data";
import { buildRowsForGame } from "@/lib/build-rows";
import { PropRowItem } from "@/components/prop-row";
import { Disclaimer } from "@/components/disclaimer";
import { ShareButton } from "@/components/share-button";
import { tipoffLabel } from "@/lib/format";

export const revalidate = 1800;

export function generateStaticParams() {
  return STATIC_GAMES.map((g) => ({ gameId: g.id }));
}

interface RouteParams {
  params: Promise<{ gameId: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGame(gameId);
  if (!game) return { title: "Game not found" };
  const home = TEAMS[game.home];
  const away = TEAMS[game.away];
  const title = `${away.name} at ${home.name}. Player props.`;
  const description = `Predictions and best lines across DraftKings, FanDuel, BetMGM, Caesars for ${away.fullName} vs ${home.fullName}. ${game.series.summary}.`;
  const ogPath = `/api/og/${gameId}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogPath, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogPath] }
  };
}

export default async function GamePage({ params }: RouteParams) {
  const { gameId } = await params;
  const game = getGame(gameId);
  if (!game) notFound();

  const rows = await buildRowsForGame(game, { withReasoning: true });
  const home = TEAMS[game.home];
  const away = TEAMS[game.away];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const shareUrl = `${siteUrl}/games/${gameId}`;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">
            {away.name} at {home.name}
          </h1>
          <ShareButton url={shareUrl} label="Share game" />
        </div>
        <p className="muted text-sm">
          {tipoffLabel(game.tipoffISO)}. {game.venue ? `${game.venue}. ` : ""}
          {game.series.summary}.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Props sorted by edge</h2>
        <p className="subtle text-sm">
          Higher absolute diff means a wider gap between our projection and the consensus line. We only flag a lean past a stat specific threshold (see <a href="https://github.com/whodeanie/nba-playoff-props/blob/main/MODEL.md" target="_blank" rel="noopener noreferrer">MODEL.md</a>).
        </p>
        <div className="grid gap-3">
          {rows.map((row) => (
            <PropRowItem key={`${row.player.id}-${row.market}`} row={row} gameId={gameId} />
          ))}
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
