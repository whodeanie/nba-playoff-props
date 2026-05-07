import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { findPlayer, PLAYERS, SEASON_AVERAGES, STATIC_GAMELOGS, TEAMS } from "@/lib/playoff-data";
import { Disclaimer } from "@/components/disclaimer";

export const revalidate = 1800;

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ playerId: p.id }));
}

interface RouteParams {
  params: Promise<{ playerId: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { playerId } = await params;
  const player = findPlayer(playerId);
  if (!player) return { title: "Player not found" };
  return {
    title: `${player.name} props and trends`,
    description: `Recent form, season averages, and prop trends for ${player.name} (${player.team}).`
  };
}

export default async function PlayerPage({ params }: RouteParams) {
  const { playerId } = await params;
  const player = findPlayer(playerId);
  if (!player) notFound();

  const season = SEASON_AVERAGES[playerId];
  const logs = STATIC_GAMELOGS[playerId] ?? [];
  const team = TEAMS[player.team];

  const last10Pts = logs.slice(0, 10).map((g) => g.pts);
  const last10Reb = logs.slice(0, 10).map((g) => g.reb);
  const last10Ast = logs.slice(0, 10).map((g) => g.ast);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{player.name}</h1>
        <p className="muted">
          {team.fullName}. {player.position}.
        </p>
      </header>

      {season ? (
        <section className="card">
          <h2 className="text-lg font-semibold mb-3">Season averages</h2>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 text-sm">
            <Stat label="GP" value={season.gp} />
            <Stat label="MIN" value={season.min} />
            <Stat label="PTS" value={season.pts} />
            <Stat label="REB" value={season.reb} />
            <Stat label="AST" value={season.ast} />
            <Stat label="3PM" value={season.threes} />
            <Stat label="USG" value={`${(season.usage * 100).toFixed(1)}%`} />
          </div>
        </section>
      ) : null}

      <section className="card">
        <h2 className="text-lg font-semibold mb-3">Last 10 games</h2>
        <div className="overflow-x-auto">
          <table className="compact w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opp</th>
                <th>MIN</th>
                <th>PTS</th>
                <th>REB</th>
                <th>AST</th>
                <th>3PM</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map((g) => (
                <tr key={g.date}>
                  <td>{g.date}</td>
                  <td>{g.opp}</td>
                  <td>{g.min}</td>
                  <td>{g.pts}</td>
                  <td>{g.reb}</td>
                  <td>{g.ast}</td>
                  <td>{g.threes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-3">Recent trend</h2>
        <Sparkline series={last10Pts} label="PTS" />
        <Sparkline series={last10Reb} label="REB" />
        <Sparkline series={last10Ast} label="AST" />
      </section>

      <p className="subtle text-sm">
        <Link href="/" className="no-underline hover:underline">
          Back to tonight's slate
        </Link>
      </p>

      <Disclaimer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="subtle text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function Sparkline({ series, label }: { series: number[]; label: string }) {
  if (series.length === 0) return null;
  const w = 320;
  const h = 36;
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const span = Math.max(1, max - min);
  const stepX = w / Math.max(1, series.length - 1);
  const points = series
    .map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - min) / span) * h).toFixed(1)}`)
    .join(" ");
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="subtle text-xs w-10">{label}</span>
      <svg width={w} height={h} className="text-edge-over">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
      </svg>
      <span className="subtle text-xs">last {series.length}</span>
    </div>
  );
}
