// Plain English reasoning generator. Calls Groq's free OpenAI compatible
// endpoint with structured factors as context and returns a 60 to 100 word
// paragraph in conversational tone. Cached per game/player/market/line combo
// so we only re-spend tokens when something actually changes.
//
// Without GROQ_API_KEY we return a deterministic templated paragraph
// built from the same factors. The UI labels both clearly.

import OpenAI from "openai";
import type { Factors, PropMarket, Player, BookLine, Edge } from "./types";
import { cacheWrap } from "./cache";
import { marketLabel, formatAmericanOdds, leanLabel } from "./format";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

interface ReasoningArgs {
  player: Player;
  oppCode: string;
  market: PropMarket;
  prediction: { mean: number; ciLow: number; ciHigh: number };
  factors: Factors;
  lines: BookLine[];
  bestOver: BookLine | null;
  bestUnder: BookLine | null;
  edge: Edge;
}

export async function generateReasoning(args: ReasoningArgs): Promise<string> {
  const cacheKey = buildKey(args);
  return cacheWrap(cacheKey, 25 * 60_000, async () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return templated(args);
    try {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
      const userPrompt = buildPrompt(args);
      const resp = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 220,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      });
      const text = (resp.choices[0]?.message?.content ?? "").trim();
      if (!text) return templated(args);
      return cleanDashes(text);
    } catch {
      return templated(args);
    }
  });
}

const SYSTEM_PROMPT = `You write short prop bet analysis for a free public NBA tool.
Tone: confident, plain English, conversational, never hyped, never "lock of the day" energy.
Never use em dashes, en dashes, or hyphens as sentence breaks. Use periods, commas, parentheses, or rephrase.
Length: one paragraph, 60 to 100 words.
Always include: the player, the market, the line, why we lean (or why we pass), and where the best price sits.
Never claim certainty. Use phrases like "we project" and "leans".
Never recommend bet sizing.`;

function buildPrompt(a: ReasoningArgs): string {
  const lines = a.lines
    .map((l) => `${l.book} line ${l.line} (over ${formatAmericanOdds(l.overPrice)}, under ${formatAmericanOdds(l.underPrice)})`)
    .join("; ");
  const bestOver = a.bestOver
    ? `${a.bestOver.book} ${formatAmericanOdds(a.bestOver.overPrice)}`
    : "no over price";
  const bestUnder = a.bestUnder
    ? `${a.bestUnder.book} ${formatAmericanOdds(a.bestUnder.underPrice)}`
    : "no under price";
  return `Player: ${a.player.name} (${a.player.team}) vs ${a.oppCode}
Market: ${marketLabel(a.market)}
Prediction: ${a.prediction.mean} (range ${a.prediction.ciLow} to ${a.prediction.ciHigh})
Lean: ${leanLabel(a.edge.lean)} (consensus line ${a.edge.consensusLine}, diff ${a.edge.diff})
Recent: last 5 averaging ${a.factors.last5Avg}, season averaging ${a.factors.seasonAvg}, vs this opponent ${a.factors.vsOpp}.
Defense: opponent ranks ${a.factors.oppDefRankVsPos} of 30 vs ${a.player.position}.
Pace multiplier: ${a.factors.paceAdjustment}.
Usage trend (last 5 / season): ${a.factors.usageTrend}.
Rest: ${a.factors.restDays} days, back to back ${a.factors.backToBack}.
Home or away: ${a.factors.homeAway}.
Lines: ${lines}.
Best over price: ${bestOver}. Best under price: ${bestUnder}.
Write the paragraph.`;
}

function templated(a: ReasoningArgs): string {
  const restPhrase = a.factors.backToBack
    ? "He is on the second night of a back to back, so we trim slightly."
    : a.factors.restDays >= 3
      ? "He is well rested coming in."
      : "Standard rest profile.";
  const dvpPhrase =
    a.factors.oppDefRankVsPos <= 8
      ? `${a.oppCode} is a top tier defense vs ${a.player.position} (rank ${a.factors.oppDefRankVsPos}), which pulls the projection down.`
      : a.factors.oppDefRankVsPos >= 22
        ? `${a.oppCode} struggles vs ${a.player.position} (rank ${a.factors.oppDefRankVsPos}), which lifts the projection.`
        : `${a.oppCode}'s defense vs ${a.player.position} grades out average.`;
  const usagePhrase =
    a.factors.usageTrend > 1.04
      ? "Usage is trending up over the last 5."
      : a.factors.usageTrend < 0.96
        ? "Usage has dipped lately."
        : "Usage is steady.";
  const leanPhrase =
    a.edge.lean === "OVER"
      ? `We project ${a.prediction.mean} (range ${a.prediction.ciLow} to ${a.prediction.ciHigh}), which clears the consensus line of ${a.edge.consensusLine} by ${a.edge.diff.toFixed(1)}. Lean over.`
      : a.edge.lean === "UNDER"
        ? `We project ${a.prediction.mean} (range ${a.prediction.ciLow} to ${a.prediction.ciHigh}), which sits below the consensus line of ${a.edge.consensusLine} by ${Math.abs(a.edge.diff).toFixed(1)}. Lean under.`
        : `We project ${a.prediction.mean}, essentially at the consensus line of ${a.edge.consensusLine}. No clear edge here.`;
  const pricePhrase =
    a.edge.lean === "OVER" && a.bestOver
      ? `Best over price is at ${a.bestOver.book} (${formatAmericanOdds(a.bestOver.overPrice)}).`
      : a.edge.lean === "UNDER" && a.bestUnder
        ? `Best under price is at ${a.bestUnder.book} (${formatAmericanOdds(a.bestUnder.underPrice)}).`
        : "Pricing is tight across all four books.";

  return cleanDashes(
    `${a.player.name} ${marketLabel(a.market).toLowerCase()} for ${a.oppCode}. Last 5 averaging ${a.factors.last5Avg} vs season ${a.factors.seasonAvg}. ${dvpPhrase} ${usagePhrase} ${restPhrase} ${leanPhrase} ${pricePhrase}`
  );
}

function buildKey(a: ReasoningArgs): string {
  const lineSig = a.lines
    .map((l) => `${l.book[0]}${l.line}`)
    .join("");
  return `reason_${a.player.id}_${a.market}_${a.prediction.mean.toFixed(1)}_${lineSig}`;
}

// Belt and suspenders. Even though the system prompt forbids em/en dashes
// and hyphen breaks, we sanitize on the way out.
function cleanDashes(s: string): string {
  return s
    .replace(/—/g, ", ")
    .replace(/–/g, ", ")
    .replace(/ - /g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}
