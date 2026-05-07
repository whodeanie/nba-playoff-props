import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-ink-700">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm subtle space-y-2">
        <p>
          Educational analytics. Not financial advice. Past performance does not predict future results.
        </p>
        <p>
          If gambling is no longer fun, get help. Visit{" "}
          <a href="https://www.responsiblegambling.org" target="_blank" rel="noopener noreferrer">
            responsiblegambling.org
          </a>{" "}
          or call <a href="tel:18004262537">1 800 GAMBLER</a>.
        </p>
        <p>
          <Link href="/historical" className="no-underline hover:underline">
            See our prediction accuracy
          </Link>
          {" · "}
          <a
            href="https://github.com/whodeanie/nba-playoff-props"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
