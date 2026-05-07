# NBA Playoff State, May 2026

Captured Wednesday, May 6, 2026. Used to seed the static fallback slate in `src/lib/playoff-data.ts` so the site has real matchups even when live API access is throttled or unavailable.

## Round in progress

Conference Semifinals (second round). All four series are underway, having tipped off May 4 through May 6.

## Eastern Conference Semifinals

Detroit Pistons vs Cleveland Cavaliers. Pistons earned the East 1 seed. Game 1 went to Detroit on Tuesday May 5.

New York Knicks vs Philadelphia 76ers. Knicks took Game 1 in a 137 to 98 blowout behind Jalen Brunson. Series 1 to 0 Knicks. The 76ers reached this round after eliminating the Boston Celtics in a seven game first round.

## Western Conference Semifinals

Oklahoma City Thunder vs Los Angeles Lakers. OKC, the reigning champion, took Game 1 by 108 to 90. Series 1 to 0 Thunder. Game 2 Thursday May 7, Game 3 Saturday May 9, Game 4 Monday May 11.

San Antonio Spurs vs Minnesota Timberwolves. Wolves won Game 1 104 to 102 despite a record performance from Victor Wembanyama. Series 1 to 0 Wolves. Game 2 Wednesday May 6.

## First round eliminations (context)

Eliminated in round one: Boston Celtics, Phoenix Suns, Portland Trail Blazers, Atlanta Hawks, Denver Nuggets, Houston Rockets, Orlando Magic, Toronto Raptors.

## Conference Finals milestones

Eastern Conference Finals scheduled to begin May 19. Western Conference Finals scheduled to begin May 20. Exact matchups TBD.

## Sources

ESPN, CBS Sports, NBC Sports, NBA.com, Bleacher Report, Yahoo Sports. See README for live data sources used by the deployed app.

## How this file is used

`src/lib/playoff-data.ts` exports `STATIC_SLATE` keyed by date. When the OddsAPI or stats.nba.com fail or rate limit, the UI falls back to this list so the site still renders matchups, tip-off times, and series state. The file is updated manually as series progress.
