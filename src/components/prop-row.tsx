import Link from "next/link";
import type { PropRow } from "@/lib/types";
import { formatAmericanOdds, leanColor, leanLabel, marketShort, minutesAgo } from "@/lib/format";

export function PropRowItem({ row, gameId }: { row: PropRow; gameId: string }) {
  const detailHref = `/games/${gameId}#${row.player.id}-${row.market}`;
  return (
    <div id={`${row.player.id}-${row.market}`} className="card hover:bg-ink-700/30 transition">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <Link
            href={`/players/${row.player.id}`}
            className="font-medium no-underline hover:underline"
          >
            {row.player.name}
          </Link>{" "}
          <span className="subtle">({row.player.team})</span>
          <span className="ml-2 tag">{marketShort(row.market)}</span>
        </div>
        <div className={`text-sm font-medium ${leanColor(row.edge.lean)}`}>
          {leanLabel(row.edge.lean)}
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
        <div>
          <div className="subtle">Predict</div>
          <div className="font-semibold">{row.prediction.mean}</div>
        </div>
        <div>
          <div className="subtle">Range</div>
          <div>{row.prediction.ciLow} to {row.prediction.ciHigh}</div>
        </div>
        <div>
          <div className="subtle">Consensus</div>
          <div>{row.edge.consensusLine}</div>
        </div>
        <div>
          <div className="subtle">Diff</div>
          <div>{row.edge.diff > 0 ? "+" : ""}{row.edge.diff}</div>
        </div>
        <div>
          <div className="subtle">Best over</div>
          <div>
            {row.bestOver
              ? `${row.bestOver.book} ${formatAmericanOdds(row.bestOver.overPrice)} @ ${row.bestOver.line}`
              : "n/a"}
          </div>
        </div>
        <div>
          <div className="subtle">Best under</div>
          <div>
            {row.bestUnder
              ? `${row.bestUnder.book} ${formatAmericanOdds(row.bestUnder.underPrice)} @ ${row.bestUnder.line}`
              : "n/a"}
          </div>
        </div>
      </div>

      {row.reasoning ? (
        <p className="muted mt-3 text-sm leading-relaxed">{row.reasoning}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between subtle text-xs">
        <span>Updated {minutesAgo(row.updatedISO)}</span>
        <Link href={detailHref} className="no-underline hover:underline">
          Details
        </Link>
      </div>
    </div>
  );
}
