import { GameCard } from "@/components/game-card";
import { Disclaimer } from "@/components/disclaimer";
import { gamesOnAndAfter } from "@/lib/playoff-data";

export const revalidate = 1800; // ISR: refresh every 30 minutes

function todayISO(): string {
  // Use UTC date so server and edge agree.
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function HomePage() {
  const today = todayISO();
  const slate = gamesOnAndAfter(today).slice(0, 7);
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">
          NBA playoff player prop predictions.
        </h1>
        <p className="muted">
          Plain English explanations for every prop. Updated every 30 minutes. Free.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Tonight and the next 7 days</h2>
          <span className="subtle text-xs">{slate.length} games</span>
        </div>
        {slate.length === 0 ? (
          <div className="card subtle">No games on the slate. Check back during the next round.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {slate.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What makes this different</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          <li className="card text-sm">
            <span className="font-medium">Plain English reasoning.</span>{" "}
            <span className="muted">
              Every prop ships with a paragraph that tells you why we lean over or under, in human language.
            </span>
          </li>
          <li className="card text-sm">
            <span className="font-medium">Honest accuracy display.</span>{" "}
            <span className="muted">
              We publish our hit rate and calibration so you can decide how much to trust the output.
            </span>
          </li>
          <li className="card text-sm">
            <span className="font-medium">Line shopping built in.</span>{" "}
            <span className="muted">
              Every row highlights which book has the best price for the over and the under.
            </span>
          </li>
        </ul>
      </section>

      <Disclaimer />
    </div>
  );
}
