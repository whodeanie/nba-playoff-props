// Tiny formatting helpers used in the UI. Pulled out so server components
// can import them without dragging React in.

import type { BookLine, EdgeLean, PropMarket } from "./types";

export function formatAmericanOdds(price: number): string {
  if (price > 0) return `+${price}`;
  return `${price}`;
}

export function marketLabel(m: PropMarket): string {
  switch (m) {
    case "PTS":
      return "Points";
    case "REB":
      return "Rebounds";
    case "AST":
      return "Assists";
    case "3PM":
      return "3 Pointers Made";
    case "PRA":
      return "Pts + Reb + Ast";
  }
}

export function marketShort(m: PropMarket): string {
  return m;
}

export function leanColor(lean: EdgeLean): string {
  if (lean === "OVER") return "text-edge-over";
  if (lean === "UNDER") return "text-edge-under";
  return "text-edge-neutral";
}

export function leanLabel(lean: EdgeLean): string {
  if (lean === "OVER") return "Lean over";
  if (lean === "UNDER") return "Lean under";
  return "No edge";
}

export function bestOver(lines: BookLine[]): BookLine | null {
  if (lines.length === 0) return null;
  // For the over, the best price is the most positive (or least negative)
  // American odds. Highest price wins.
  return lines.reduce((best, l) => (l.overPrice > best.overPrice ? l : best), lines[0]!);
}

export function bestUnder(lines: BookLine[]): BookLine | null {
  if (lines.length === 0) return null;
  return lines.reduce((best, l) => (l.underPrice > best.underPrice ? l : best), lines[0]!);
}

export function consensusLine(lines: BookLine[]): number {
  if (lines.length === 0) return 0;
  const sum = lines.reduce((s, l) => s + l.line, 0);
  return Math.round((sum / lines.length) * 2) / 2;
}

export function minutesAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return "1 hr ago";
  return `${hours} hr ago`;
}

export function tipoffLabel(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });
  return `${day}, ${time}`;
}
