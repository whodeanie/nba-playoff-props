export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="subtle text-xs">
        Educational analytics. Not financial advice.
      </p>
    );
  }
  return (
    <div className="card text-sm">
      <p className="font-medium">Educational analytics. Not financial advice.</p>
      <p className="muted mt-1">
        Past performance does not predict future results. Odds and lines change frequently. Verify everything at the sportsbook before placing a wager. If gambling is no longer fun, call 1 800 GAMBLER.
      </p>
    </div>
  );
}
