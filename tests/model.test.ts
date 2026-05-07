import { describe, it, expect } from "vitest";
import { predict, classifyEdge, __internal } from "../src/lib/model";
import type { ModelInput } from "../src/lib/model";
import type { BookLine } from "../src/lib/types";

const basePlayer = {
  id: "test-player",
  name: "Test Player",
  team: "OKC" as const,
  position: "PG" as const
};

const baseSeason = { gp: 70, min: 35, pts: 28, reb: 5, ast: 7, threes: 2.5, usage: 0.3 };

const baseRecent = Array.from({ length: 10 }, (_, i) => ({
  date: `2026-04-${String(15 + i).padStart(2, "0")}`,
  opp: "BOS" as const,
  min: 35,
  pts: 28 + (i % 3 === 0 ? 2 : -1),
  reb: 5,
  ast: 7,
  threes: 2.5,
  usage: 0.3,
  home: i % 2 === 0
}));

describe("model.predict", () => {
  it("blends recent, season, and matchup with the right weights", () => {
    const input: ModelInput = {
      player: basePlayer,
      market: "PTS",
      season: baseSeason,
      recent: baseRecent,
      oppDvp: null,
      oppPace: 99,
      ownPace: 99,
      restDays: 2,
      backToBack: false,
      home: true
    };
    const { prediction } = predict(input, "MIN");
    // Mean should land near 28 (slight home bump).
    expect(prediction.mean).toBeGreaterThan(27);
    expect(prediction.mean).toBeLessThan(31);
    // CI should bracket the mean and be wider than zero.
    expect(prediction.ciLow).toBeLessThan(prediction.mean);
    expect(prediction.ciHigh).toBeGreaterThan(prediction.mean);
  });

  it("dvp multiplier is bounded between 0.88 and 1.12", () => {
    const tough = __internal.dvpMultiplier("PTS", {
      team: "OKC",
      position: "PG",
      ptsAllowed: 5, // absurdly tough
      rebAllowed: 0,
      astAllowed: 0,
      threesAllowed: 0,
      rank: 1
    });
    const soft = __internal.dvpMultiplier("PTS", {
      team: "OKC",
      position: "PG",
      ptsAllowed: 100,
      rebAllowed: 0,
      astAllowed: 0,
      threesAllowed: 0,
      rank: 30
    });
    expect(tough).toBe(0.88);
    expect(soft).toBe(1.12);
  });

  it("home/away adjustment is symmetric", () => {
    expect(__internal.homeAwayAdjustment(true)).toBe(1.02);
    expect(__internal.homeAwayAdjustment(false)).toBe(0.98);
  });
});

describe("model.classifyEdge", () => {
  const lines: BookLine[] = [
    { book: "DraftKings", line: 26.5, overPrice: -110, underPrice: -110 },
    { book: "FanDuel", line: 26.5, overPrice: -115, underPrice: -105 }
  ];

  it("flags an over when prediction clearly exceeds line", () => {
    const e = classifyEdge("PTS", 30, lines);
    expect(e.lean).toBe("OVER");
    expect(e.diff).toBeCloseTo(3.5, 1);
  });

  it("flags an under when prediction clearly trails line", () => {
    const e = classifyEdge("PTS", 23, lines);
    expect(e.lean).toBe("UNDER");
  });

  it("returns NONE when within threshold", () => {
    const e = classifyEdge("PTS", 27.0, lines);
    expect(e.lean).toBe("NONE");
  });
});
