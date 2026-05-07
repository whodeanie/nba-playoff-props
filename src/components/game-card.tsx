import Link from "next/link";
import type { Game } from "@/lib/types";
import { TEAMS } from "@/lib/playoff-data";
import { tipoffLabel } from "@/lib/format";

export function GameCard({ game }: { game: Game }) {
  const home = TEAMS[game.home];
  const away = TEAMS[game.away];
  return (
    <article className="card">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">
          {away.name} at {home.name}
        </h3>
        <span className="tag">{game.series.round === "R2" ? "Semis" : game.series.round}</span>
      </div>
      <p className="subtle mt-1">{tipoffLabel(game.tipoffISO)}</p>
      <p className="muted mt-1 text-sm">
        {game.series.summary}
        {game.venue ? `. ${game.venue}.` : ""}
      </p>
      <div className="mt-3">
        <Link href={`/games/${game.id}`} className="btn no-underline">
          View props
        </Link>
      </div>
    </article>
  );
}
