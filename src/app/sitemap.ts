import type { MetadataRoute } from "next";
import { STATIC_GAMES, PLAYERS } from "@/lib/playoff-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nba-playoff-props.vercel.app";
  const today = new Date();
  const root = [
    { url: `${base}/`, lastModified: today, changeFrequency: "hourly" as const, priority: 1.0 },
    { url: `${base}/historical`, lastModified: today, changeFrequency: "daily" as const, priority: 0.7 }
  ];
  const games = STATIC_GAMES.map((g) => ({
    url: `${base}/games/${g.id}`,
    lastModified: today,
    changeFrequency: "hourly" as const,
    priority: 0.9
  }));
  const players = PLAYERS.map((p) => ({
    url: `${base}/players/${p.id}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.5
  }));
  return [...root, ...games, ...players];
}
