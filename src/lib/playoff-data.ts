// Static fallback slate for May 2026 conference semifinals. Sourced from
// research/PLAYOFF_STATE.md. The live deployment overlays real odds and stats
// on top of this skeleton when API keys are present.

import type {
  Game,
  Player,
  Team,
  TeamCode,
  PlayerSeasonAverages,
  PlayerGameLog,
  DefenseVsPosition,
  PaceContext
} from "./types";

export const TEAMS: Record<TeamCode, Team> = {
  ATL: { code: "ATL", name: "Hawks", fullName: "Atlanta Hawks", city: "Atlanta", conference: "East" },
  BOS: { code: "BOS", name: "Celtics", fullName: "Boston Celtics", city: "Boston", conference: "East" },
  BKN: { code: "BKN", name: "Nets", fullName: "Brooklyn Nets", city: "Brooklyn", conference: "East" },
  CHA: { code: "CHA", name: "Hornets", fullName: "Charlotte Hornets", city: "Charlotte", conference: "East" },
  CHI: { code: "CHI", name: "Bulls", fullName: "Chicago Bulls", city: "Chicago", conference: "East" },
  CLE: { code: "CLE", name: "Cavaliers", fullName: "Cleveland Cavaliers", city: "Cleveland", conference: "East" },
  DAL: { code: "DAL", name: "Mavericks", fullName: "Dallas Mavericks", city: "Dallas", conference: "West" },
  DEN: { code: "DEN", name: "Nuggets", fullName: "Denver Nuggets", city: "Denver", conference: "West" },
  DET: { code: "DET", name: "Pistons", fullName: "Detroit Pistons", city: "Detroit", conference: "East" },
  GSW: { code: "GSW", name: "Warriors", fullName: "Golden State Warriors", city: "Golden State", conference: "West" },
  HOU: { code: "HOU", name: "Rockets", fullName: "Houston Rockets", city: "Houston", conference: "West" },
  IND: { code: "IND", name: "Pacers", fullName: "Indiana Pacers", city: "Indiana", conference: "East" },
  LAC: { code: "LAC", name: "Clippers", fullName: "Los Angeles Clippers", city: "Los Angeles", conference: "West" },
  LAL: { code: "LAL", name: "Lakers", fullName: "Los Angeles Lakers", city: "Los Angeles", conference: "West" },
  MEM: { code: "MEM", name: "Grizzlies", fullName: "Memphis Grizzlies", city: "Memphis", conference: "West" },
  MIA: { code: "MIA", name: "Heat", fullName: "Miami Heat", city: "Miami", conference: "East" },
  MIL: { code: "MIL", name: "Bucks", fullName: "Milwaukee Bucks", city: "Milwaukee", conference: "East" },
  MIN: { code: "MIN", name: "Timberwolves", fullName: "Minnesota Timberwolves", city: "Minnesota", conference: "West" },
  NOP: { code: "NOP", name: "Pelicans", fullName: "New Orleans Pelicans", city: "New Orleans", conference: "West" },
  NYK: { code: "NYK", name: "Knicks", fullName: "New York Knicks", city: "New York", conference: "East" },
  OKC: { code: "OKC", name: "Thunder", fullName: "Oklahoma City Thunder", city: "Oklahoma City", conference: "West" },
  ORL: { code: "ORL", name: "Magic", fullName: "Orlando Magic", city: "Orlando", conference: "East" },
  PHI: { code: "PHI", name: "76ers", fullName: "Philadelphia 76ers", city: "Philadelphia", conference: "East" },
  PHX: { code: "PHX", name: "Suns", fullName: "Phoenix Suns", city: "Phoenix", conference: "West" },
  POR: { code: "POR", name: "Trail Blazers", fullName: "Portland Trail Blazers", city: "Portland", conference: "West" },
  SAC: { code: "SAC", name: "Kings", fullName: "Sacramento Kings", city: "Sacramento", conference: "West" },
  SAS: { code: "SAS", name: "Spurs", fullName: "San Antonio Spurs", city: "San Antonio", conference: "West" },
  TOR: { code: "TOR", name: "Raptors", fullName: "Toronto Raptors", city: "Toronto", conference: "East" },
  UTA: { code: "UTA", name: "Jazz", fullName: "Utah Jazz", city: "Utah", conference: "West" },
  WAS: { code: "WAS", name: "Wizards", fullName: "Washington Wizards", city: "Washington", conference: "East" }
};

// Active playoff rosters. Limited to the starters we surface in the UI.
// Position values are simplified to a single primary position.
export const PLAYERS: Player[] = [
  // OKC
  { id: "shai-gilgeous-alexander", name: "Shai Gilgeous-Alexander", team: "OKC", position: "PG" },
  { id: "jalen-williams", name: "Jalen Williams", team: "OKC", position: "SF" },
  { id: "chet-holmgren", name: "Chet Holmgren", team: "OKC", position: "C" },
  { id: "lu-dort", name: "Lu Dort", team: "OKC", position: "SG" },
  { id: "isaiah-hartenstein", name: "Isaiah Hartenstein", team: "OKC", position: "C" },
  // LAL
  { id: "luka-doncic", name: "Luka Doncic", team: "LAL", position: "PG" },
  { id: "lebron-james", name: "LeBron James", team: "LAL", position: "SF" },
  { id: "austin-reaves", name: "Austin Reaves", team: "LAL", position: "SG" },
  { id: "rui-hachimura", name: "Rui Hachimura", team: "LAL", position: "PF" },
  { id: "jaxson-hayes", name: "Jaxson Hayes", team: "LAL", position: "C" },
  // MIN
  { id: "anthony-edwards", name: "Anthony Edwards", team: "MIN", position: "SG" },
  { id: "julius-randle", name: "Julius Randle", team: "MIN", position: "PF" },
  { id: "rudy-gobert", name: "Rudy Gobert", team: "MIN", position: "C" },
  { id: "jaden-mcdaniels", name: "Jaden McDaniels", team: "MIN", position: "SF" },
  { id: "mike-conley", name: "Mike Conley", team: "MIN", position: "PG" },
  // SAS
  { id: "victor-wembanyama", name: "Victor Wembanyama", team: "SAS", position: "C" },
  { id: "devin-vassell", name: "Devin Vassell", team: "SAS", position: "SG" },
  { id: "stephon-castle", name: "Stephon Castle", team: "SAS", position: "PG" },
  { id: "harrison-barnes", name: "Harrison Barnes", team: "SAS", position: "SF" },
  { id: "jeremy-sochan", name: "Jeremy Sochan", team: "SAS", position: "PF" },
  // NYK
  { id: "jalen-brunson", name: "Jalen Brunson", team: "NYK", position: "PG" },
  { id: "karl-anthony-towns", name: "Karl-Anthony Towns", team: "NYK", position: "C" },
  { id: "og-anunoby", name: "OG Anunoby", team: "NYK", position: "SF" },
  { id: "mikal-bridges", name: "Mikal Bridges", team: "NYK", position: "SF" },
  { id: "josh-hart", name: "Josh Hart", team: "NYK", position: "SG" },
  // PHI
  { id: "tyrese-maxey", name: "Tyrese Maxey", team: "PHI", position: "PG" },
  { id: "joel-embiid", name: "Joel Embiid", team: "PHI", position: "C" },
  { id: "paul-george", name: "Paul George", team: "PHI", position: "SF" },
  { id: "kelly-oubre-jr", name: "Kelly Oubre Jr.", team: "PHI", position: "SG" },
  { id: "kj-martin", name: "KJ Martin", team: "PHI", position: "PF" },
  // DET
  { id: "cade-cunningham", name: "Cade Cunningham", team: "DET", position: "PG" },
  { id: "jaden-ivey", name: "Jaden Ivey", team: "DET", position: "SG" },
  { id: "jalen-duren", name: "Jalen Duren", team: "DET", position: "C" },
  { id: "ausar-thompson", name: "Ausar Thompson", team: "DET", position: "SF" },
  { id: "tobias-harris", name: "Tobias Harris", team: "DET", position: "PF" },
  // CLE
  { id: "donovan-mitchell", name: "Donovan Mitchell", team: "CLE", position: "SG" },
  { id: "darius-garland", name: "Darius Garland", team: "CLE", position: "PG" },
  { id: "evan-mobley", name: "Evan Mobley", team: "CLE", position: "PF" },
  { id: "jarrett-allen", name: "Jarrett Allen", team: "CLE", position: "C" },
  { id: "max-strus", name: "Max Strus", team: "CLE", position: "SF" }
];

export function findPlayer(id: string): Player | undefined {
  return PLAYERS.find((p) => p.id === id);
}

// May 2026 conference semifinals slate. Tip-off times in ISO with timezone.
export const STATIC_GAMES: Game[] = [
  {
    id: "2026-05-06-min-sas",
    date: "2026-05-06",
    tipoffISO: "2026-05-07T01:30:00Z",
    home: "SAS",
    away: "MIN",
    venue: "Frost Bank Center",
    series: { round: "R2", homeWins: 0, awayWins: 1, summary: "Timberwolves lead 1 to 0" },
    starters: {
      home: ["victor-wembanyama", "devin-vassell", "stephon-castle", "harrison-barnes", "jeremy-sochan"],
      away: ["anthony-edwards", "julius-randle", "rudy-gobert", "jaden-mcdaniels", "mike-conley"]
    }
  },
  {
    id: "2026-05-07-lal-okc",
    date: "2026-05-07",
    tipoffISO: "2026-05-08T01:30:00Z",
    home: "OKC",
    away: "LAL",
    venue: "Paycom Center",
    series: { round: "R2", homeWins: 1, awayWins: 0, summary: "Thunder lead 1 to 0" },
    starters: {
      home: ["shai-gilgeous-alexander", "jalen-williams", "chet-holmgren", "lu-dort", "isaiah-hartenstein"],
      away: ["luka-doncic", "lebron-james", "austin-reaves", "rui-hachimura", "jaxson-hayes"]
    }
  },
  {
    id: "2026-05-08-phi-nyk",
    date: "2026-05-08",
    tipoffISO: "2026-05-08T23:30:00Z",
    home: "NYK",
    away: "PHI",
    venue: "Madison Square Garden",
    series: { round: "R2", homeWins: 1, awayWins: 0, summary: "Knicks lead 1 to 0" },
    starters: {
      home: ["jalen-brunson", "karl-anthony-towns", "og-anunoby", "mikal-bridges", "josh-hart"],
      away: ["tyrese-maxey", "joel-embiid", "paul-george", "kelly-oubre-jr", "kj-martin"]
    }
  },
  {
    id: "2026-05-08-cle-det",
    date: "2026-05-08",
    tipoffISO: "2026-05-09T00:00:00Z",
    home: "DET",
    away: "CLE",
    venue: "Little Caesars Arena",
    series: { round: "R2", homeWins: 1, awayWins: 0, summary: "Pistons lead 1 to 0" },
    starters: {
      home: ["cade-cunningham", "jaden-ivey", "jalen-duren", "ausar-thompson", "tobias-harris"],
      away: ["donovan-mitchell", "darius-garland", "evan-mobley", "jarrett-allen", "max-strus"]
    }
  },
  {
    id: "2026-05-09-okc-lal",
    date: "2026-05-09",
    tipoffISO: "2026-05-10T00:30:00Z",
    home: "LAL",
    away: "OKC",
    venue: "Crypto.com Arena",
    series: { round: "R2", homeWins: 0, awayWins: 0, summary: "Series tied (Game 3)" },
    starters: {
      home: ["luka-doncic", "lebron-james", "austin-reaves", "rui-hachimura", "jaxson-hayes"],
      away: ["shai-gilgeous-alexander", "jalen-williams", "chet-holmgren", "lu-dort", "isaiah-hartenstein"]
    }
  }
];

// Season averages for the players above. Rough but realistic for May 2026.
// Used by the model when stats.nba.com is unreachable.
export const SEASON_AVERAGES: Record<string, PlayerSeasonAverages> = {
  "shai-gilgeous-alexander": { gp: 78, min: 35.1, pts: 31.2, reb: 5.4, ast: 6.8, threes: 2.4, usage: 0.33 },
  "jalen-williams": { gp: 76, min: 33.4, pts: 21.0, reb: 5.6, ast: 4.3, threes: 1.8, usage: 0.23 },
  "chet-holmgren": { gp: 71, min: 31.2, pts: 17.5, reb: 8.7, ast: 2.4, threes: 1.7, usage: 0.20 },
  "lu-dort": { gp: 80, min: 30.8, pts: 11.0, reb: 4.0, ast: 1.8, threes: 2.1, usage: 0.13 },
  "isaiah-hartenstein": { gp: 70, min: 27.6, pts: 11.2, reb: 11.4, ast: 3.7, threes: 0.1, usage: 0.14 },
  "luka-doncic": { gp: 70, min: 36.2, pts: 30.4, reb: 8.2, ast: 8.6, threes: 3.5, usage: 0.34 },
  "lebron-james": { gp: 71, min: 34.5, pts: 24.8, reb: 7.6, ast: 8.3, threes: 2.1, usage: 0.27 },
  "austin-reaves": { gp: 78, min: 33.0, pts: 16.4, reb: 4.4, ast: 5.6, threes: 2.2, usage: 0.20 },
  "rui-hachimura": { gp: 72, min: 30.1, pts: 13.6, reb: 5.2, ast: 1.5, threes: 1.4, usage: 0.16 },
  "jaxson-hayes": { gp: 65, min: 19.0, pts: 7.4, reb: 5.6, ast: 0.9, threes: 0.0, usage: 0.13 },
  "anthony-edwards": { gp: 78, min: 35.6, pts: 27.6, reb: 5.7, ast: 4.5, threes: 3.4, usage: 0.30 },
  "julius-randle": { gp: 72, min: 32.8, pts: 19.0, reb: 7.4, ast: 4.6, threes: 1.7, usage: 0.24 },
  "rudy-gobert": { gp: 76, min: 30.5, pts: 12.0, reb: 11.8, ast: 1.7, threes: 0.0, usage: 0.13 },
  "jaden-mcdaniels": { gp: 80, min: 31.7, pts: 12.6, reb: 5.8, ast: 1.8, threes: 1.6, usage: 0.15 },
  "mike-conley": { gp: 70, min: 27.4, pts: 9.0, reb: 2.5, ast: 5.3, threes: 1.6, usage: 0.13 },
  "victor-wembanyama": { gp: 70, min: 33.5, pts: 25.4, reb: 11.6, ast: 4.0, threes: 2.5, usage: 0.30 },
  "devin-vassell": { gp: 73, min: 31.4, pts: 17.2, reb: 4.2, ast: 3.0, threes: 2.4, usage: 0.21 },
  "stephon-castle": { gp: 78, min: 31.0, pts: 14.8, reb: 4.0, ast: 4.6, threes: 1.0, usage: 0.21 },
  "harrison-barnes": { gp: 74, min: 30.0, pts: 12.0, reb: 4.4, ast: 1.5, threes: 1.8, usage: 0.16 },
  "jeremy-sochan": { gp: 70, min: 27.0, pts: 11.2, reb: 6.4, ast: 2.4, threes: 0.6, usage: 0.18 },
  "jalen-brunson": { gp: 76, min: 35.6, pts: 28.4, reb: 3.7, ast: 7.8, threes: 2.6, usage: 0.32 },
  "karl-anthony-towns": { gp: 73, min: 33.4, pts: 24.2, reb: 12.4, ast: 3.3, threes: 2.7, usage: 0.27 },
  "og-anunoby": { gp: 70, min: 33.7, pts: 17.8, reb: 4.6, ast: 2.4, threes: 2.2, usage: 0.18 },
  "mikal-bridges": { gp: 78, min: 35.0, pts: 17.4, reb: 3.7, ast: 3.4, threes: 1.9, usage: 0.19 },
  "josh-hart": { gp: 75, min: 35.5, pts: 13.6, reb: 9.4, ast: 5.4, threes: 1.4, usage: 0.15 },
  "tyrese-maxey": { gp: 76, min: 37.6, pts: 26.4, reb: 3.6, ast: 6.4, threes: 3.1, usage: 0.29 },
  "joel-embiid": { gp: 60, min: 33.4, pts: 28.6, reb: 11.0, ast: 5.0, threes: 1.1, usage: 0.34 },
  "paul-george": { gp: 70, min: 34.4, pts: 22.4, reb: 5.6, ast: 4.4, threes: 2.9, usage: 0.26 },
  "kelly-oubre-jr": { gp: 74, min: 26.6, pts: 13.4, reb: 5.0, ast: 1.7, threes: 1.5, usage: 0.20 },
  "kj-martin": { gp: 60, min: 17.0, pts: 6.4, reb: 3.4, ast: 0.6, threes: 0.4, usage: 0.16 },
  "cade-cunningham": { gp: 78, min: 35.4, pts: 25.6, reb: 6.4, ast: 9.0, threes: 2.4, usage: 0.30 },
  "jaden-ivey": { gp: 76, min: 28.0, pts: 17.4, reb: 4.0, ast: 4.4, threes: 1.7, usage: 0.22 },
  "jalen-duren": { gp: 75, min: 28.4, pts: 13.0, reb: 11.6, ast: 2.6, threes: 0.0, usage: 0.16 },
  "ausar-thompson": { gp: 78, min: 29.8, pts: 13.6, reb: 7.0, ast: 3.6, threes: 0.4, usage: 0.18 },
  "tobias-harris": { gp: 75, min: 30.0, pts: 14.4, reb: 6.0, ast: 2.4, threes: 1.4, usage: 0.18 },
  "donovan-mitchell": { gp: 74, min: 35.6, pts: 27.0, reb: 4.5, ast: 5.0, threes: 3.4, usage: 0.30 },
  "darius-garland": { gp: 70, min: 32.4, pts: 19.6, reb: 2.7, ast: 6.6, threes: 2.4, usage: 0.24 },
  "evan-mobley": { gp: 76, min: 31.6, pts: 16.4, reb: 9.6, ast: 3.4, threes: 0.6, usage: 0.20 },
  "jarrett-allen": { gp: 72, min: 30.5, pts: 14.0, reb: 10.4, ast: 2.4, threes: 0.0, usage: 0.15 },
  "max-strus": { gp: 76, min: 31.0, pts: 12.0, reb: 4.6, ast: 4.0, threes: 2.4, usage: 0.16 }
};

// Last-5 game logs (regular season + playoffs blended, simplified). Used to
// compute recent form when the live API is unreachable. The model treats this
// as the primary signal (60 percent weight).
function buildLogs(playerId: string): PlayerGameLog[] {
  const avg = SEASON_AVERAGES[playerId];
  if (!avg) return [];
  // Generate 10 plausible recent lines around the season avg with slight noise.
  const seed = [...playerId].reduce((s, c) => s + c.charCodeAt(0), 0);
  const out: PlayerGameLog[] = [];
  for (let i = 0; i < 10; i++) {
    const noise = (Math.sin(seed + i * 1.7) + Math.cos(seed * 0.3 + i)) * 0.08;
    out.push({
      date: `2026-04-${String(15 + i).padStart(2, "0")}`,
      opp: "BOS",
      min: round1(avg.min + noise * 2),
      pts: round1(avg.pts * (1 + noise)),
      reb: round1(avg.reb * (1 + noise * 0.6)),
      ast: round1(avg.ast * (1 + noise * 0.4)),
      threes: round1(avg.threes * (1 + noise)),
      usage: round3(avg.usage * (1 + noise * 0.2)),
      home: i % 2 === 0
    });
  }
  return out;
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
function round3(n: number): number { return Math.round(n * 1000) / 1000; }

export const STATIC_GAMELOGS: Record<string, PlayerGameLog[]> = Object.fromEntries(
  Object.keys(SEASON_AVERAGES).map((id) => [id, buildLogs(id)])
);

// Defense vs position. Hand calibrated rough numbers for the eight active
// playoff teams. Lower allowed = better defense vs that position.
export const STATIC_DVP: DefenseVsPosition[] = [
  { team: "OKC", position: "PG", ptsAllowed: 19.4, rebAllowed: 4.0, astAllowed: 5.8, threesAllowed: 1.9, rank: 2 },
  { team: "OKC", position: "SF", ptsAllowed: 16.8, rebAllowed: 4.6, astAllowed: 3.0, threesAllowed: 1.6, rank: 3 },
  { team: "OKC", position: "C", ptsAllowed: 17.5, rebAllowed: 9.0, astAllowed: 2.7, threesAllowed: 0.7, rank: 6 },
  { team: "OKC", position: "SG", ptsAllowed: 18.0, rebAllowed: 4.0, astAllowed: 3.4, threesAllowed: 2.0, rank: 5 },
  { team: "OKC", position: "PF", ptsAllowed: 16.0, rebAllowed: 7.0, astAllowed: 2.6, threesAllowed: 1.3, rank: 4 },

  { team: "LAL", position: "PG", ptsAllowed: 23.0, rebAllowed: 4.6, astAllowed: 7.0, threesAllowed: 2.7, rank: 22 },
  { team: "LAL", position: "SF", ptsAllowed: 20.4, rebAllowed: 5.4, astAllowed: 3.8, threesAllowed: 2.3, rank: 18 },
  { team: "LAL", position: "C", ptsAllowed: 19.6, rebAllowed: 11.0, astAllowed: 3.3, threesAllowed: 1.0, rank: 17 },
  { team: "LAL", position: "SG", ptsAllowed: 21.4, rebAllowed: 4.4, astAllowed: 4.0, threesAllowed: 2.6, rank: 21 },
  { team: "LAL", position: "PF", ptsAllowed: 18.6, rebAllowed: 7.6, astAllowed: 3.0, threesAllowed: 1.6, rank: 16 },

  { team: "MIN", position: "PG", ptsAllowed: 19.8, rebAllowed: 4.2, astAllowed: 6.0, threesAllowed: 2.0, rank: 4 },
  { team: "MIN", position: "SF", ptsAllowed: 17.0, rebAllowed: 4.8, astAllowed: 3.0, threesAllowed: 1.8, rank: 6 },
  { team: "MIN", position: "C", ptsAllowed: 17.0, rebAllowed: 9.5, astAllowed: 2.6, threesAllowed: 0.7, rank: 3 },
  { team: "MIN", position: "SG", ptsAllowed: 18.6, rebAllowed: 4.0, astAllowed: 3.6, threesAllowed: 2.1, rank: 7 },
  { team: "MIN", position: "PF", ptsAllowed: 16.6, rebAllowed: 7.4, astAllowed: 2.8, threesAllowed: 1.4, rank: 5 },

  { team: "SAS", position: "PG", ptsAllowed: 22.0, rebAllowed: 4.4, astAllowed: 6.6, threesAllowed: 2.5, rank: 18 },
  { team: "SAS", position: "SF", ptsAllowed: 19.0, rebAllowed: 5.0, astAllowed: 3.4, threesAllowed: 2.0, rank: 14 },
  { team: "SAS", position: "C", ptsAllowed: 16.0, rebAllowed: 9.0, astAllowed: 2.4, threesAllowed: 0.6, rank: 1 },
  { team: "SAS", position: "SG", ptsAllowed: 20.6, rebAllowed: 4.2, astAllowed: 3.6, threesAllowed: 2.4, rank: 16 },
  { team: "SAS", position: "PF", ptsAllowed: 17.4, rebAllowed: 7.4, astAllowed: 2.8, threesAllowed: 1.5, rank: 9 },

  { team: "NYK", position: "PG", ptsAllowed: 20.6, rebAllowed: 4.4, astAllowed: 6.4, threesAllowed: 2.2, rank: 9 },
  { team: "NYK", position: "SF", ptsAllowed: 17.4, rebAllowed: 5.0, astAllowed: 3.2, threesAllowed: 1.7, rank: 5 },
  { team: "NYK", position: "C", ptsAllowed: 18.4, rebAllowed: 10.0, astAllowed: 2.7, threesAllowed: 0.8, rank: 11 },
  { team: "NYK", position: "SG", ptsAllowed: 19.4, rebAllowed: 4.2, astAllowed: 3.7, threesAllowed: 2.2, rank: 10 },
  { team: "NYK", position: "PF", ptsAllowed: 17.6, rebAllowed: 7.4, astAllowed: 2.9, threesAllowed: 1.5, rank: 12 },

  { team: "PHI", position: "PG", ptsAllowed: 22.4, rebAllowed: 4.4, astAllowed: 6.8, threesAllowed: 2.6, rank: 20 },
  { team: "PHI", position: "SF", ptsAllowed: 19.4, rebAllowed: 5.2, astAllowed: 3.4, threesAllowed: 2.0, rank: 17 },
  { team: "PHI", position: "C", ptsAllowed: 18.0, rebAllowed: 10.4, astAllowed: 2.8, threesAllowed: 0.8, rank: 8 },
  { team: "PHI", position: "SG", ptsAllowed: 20.4, rebAllowed: 4.4, astAllowed: 3.8, threesAllowed: 2.4, rank: 14 },
  { team: "PHI", position: "PF", ptsAllowed: 18.4, rebAllowed: 7.6, astAllowed: 3.0, threesAllowed: 1.5, rank: 14 },

  { team: "DET", position: "PG", ptsAllowed: 21.4, rebAllowed: 4.4, astAllowed: 6.6, threesAllowed: 2.4, rank: 14 },
  { team: "DET", position: "SF", ptsAllowed: 18.4, rebAllowed: 5.0, astAllowed: 3.4, threesAllowed: 1.9, rank: 10 },
  { team: "DET", position: "C", ptsAllowed: 18.6, rebAllowed: 10.4, astAllowed: 2.8, threesAllowed: 0.7, rank: 13 },
  { team: "DET", position: "SG", ptsAllowed: 19.6, rebAllowed: 4.2, astAllowed: 3.6, threesAllowed: 2.2, rank: 12 },
  { team: "DET", position: "PF", ptsAllowed: 17.8, rebAllowed: 7.4, astAllowed: 2.8, threesAllowed: 1.5, rank: 11 },

  { team: "CLE", position: "PG", ptsAllowed: 19.6, rebAllowed: 4.0, astAllowed: 6.0, threesAllowed: 2.0, rank: 5 },
  { team: "CLE", position: "SF", ptsAllowed: 17.0, rebAllowed: 4.8, astAllowed: 3.0, threesAllowed: 1.7, rank: 4 },
  { team: "CLE", position: "C", ptsAllowed: 17.4, rebAllowed: 9.6, astAllowed: 2.6, threesAllowed: 0.7, rank: 4 },
  { team: "CLE", position: "SG", ptsAllowed: 18.6, rebAllowed: 4.0, astAllowed: 3.4, threesAllowed: 2.0, rank: 6 },
  { team: "CLE", position: "PF", ptsAllowed: 17.0, rebAllowed: 7.2, astAllowed: 2.7, threesAllowed: 1.4, rank: 7 }
];

export const STATIC_PACE: PaceContext[] = [
  { team: "OKC", pace: 100.4 },
  { team: "LAL", pace: 100.0 },
  { team: "MIN", pace: 96.6 },
  { team: "SAS", pace: 99.6 },
  { team: "NYK", pace: 96.4 },
  { team: "PHI", pace: 97.6 },
  { team: "DET", pace: 99.4 },
  { team: "CLE", pace: 98.0 }
];

export function dvpFor(team: TeamCode, position: Player["position"]): DefenseVsPosition | undefined {
  return STATIC_DVP.find((d) => d.team === team && d.position === position);
}

export function paceFor(team: TeamCode): number {
  return STATIC_PACE.find((p) => p.team === team)?.pace ?? 99.0;
}

export function getGame(id: string): Game | undefined {
  return STATIC_GAMES.find((g) => g.id === id);
}

export function gamesOnAndAfter(dateISO: string): Game[] {
  return STATIC_GAMES.filter((g) => g.date >= dateISO).sort((a, b) =>
    a.tipoffISO.localeCompare(b.tipoffISO)
  );
}
