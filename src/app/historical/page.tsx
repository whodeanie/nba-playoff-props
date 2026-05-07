import type { Metadata } from "next";
import { SEED_HISTORY, summarize } from "@/lib/historical";
import { Disclaimer } from "@/components/disclaimer";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Prediction accuracy",
  description: "Honest hit rate, average error, and calibration for our NBA playoff prop predictions."
};

export default function HistoricalPage() {
  const records = SEED_HISTORY;
  const summary = summarize(records);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Prediction accuracy</h1>
        <p className="muted">
          We publish every resolved prediction. Good calls and bad. Decide for yourself how much weight to put on the model.
        </p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Hit rate" value={`${(summary.hitRate * 100).toFixed(1)}%`} note={`${summary.hits} of ${summary.totalLeans}`} />
        <SummaryCard label="Avg error" value={summary.avgAbsError.toFixed(2)} note="across all props" />
        <SummaryCard label="No-lean rate" value={`${Math.round((summary.noLeans / Math.max(1, records.length)) * 100)}%`} note="we pass when small edge" />
        <SummaryCard label="Sample" value={String(records.length)} note="props resolved" />
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-3">By market</h2>
        <div className="overflow-x-auto">
          <table className="compact w-full">
            <thead>
              <tr>
                <th>Market</th>
                <th>Leans</th>
                <th>Hits</th>
                <th>Hit rate</th>
              </tr>
            </thead>
            <tbody>
              {summary.byMarket.map((m) => (
                <tr key={m.market}>
                  <td>{m.market}</td>
                  <td>{m.n}</td>
                  <td>{m.hits}</td>
                  <td>{m.n > 0 ? `${(m.hitRate * 100).toFixed(1)}%` : "n/a"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-3">Calibration</h2>
        <p className="subtle text-sm mb-3">
          When we say we have an edge, are we right at roughly the rate we expected. As more data lands we will break this out by confidence band.
        </p>
        <table className="compact w-full">
          <thead>
            <tr>
              <th>Bucket</th>
              <th>N</th>
              <th>Expected</th>
              <th>Actual</th>
            </tr>
          </thead>
          <tbody>
            {summary.calibration.map((c) => (
              <tr key={c.bucket}>
                <td>{c.bucket}</td>
                <td>{c.n}</td>
                <td>{(c.expected * 100).toFixed(0)}%</td>
                <td>{(c.actual * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-3">All resolved predictions</h2>
        <div className="overflow-x-auto">
          <table className="compact w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Game</th>
                <th>Player</th>
                <th>Market</th>
                <th>Predicted</th>
                <th>Line</th>
                <th>Lean</th>
                <th>Actual</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={`${r.date}-${r.player}-${r.market}-${i}`}>
                  <td>{r.date}</td>
                  <td>{r.game}</td>
                  <td>{r.player}</td>
                  <td>{r.market}</td>
                  <td>{r.predicted}</td>
                  <td>{r.line}</td>
                  <td>{r.lean}</td>
                  <td>{r.actual}</td>
                  <td>{r.hit === true ? "Hit" : r.hit === false ? "Miss" : "Push/Pass"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}

function SummaryCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="card">
      <div className="subtle text-xs">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="subtle text-xs mt-1">{note}</div>
    </div>
  );
}
