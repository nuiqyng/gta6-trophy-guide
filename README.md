# Leonida Trophy Guide — GTA VI

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/nuiqyng/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/nuiqyng/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — built by an AI agent for make.fun's GTA 6 trophy guide bounty.

## What it is

- **Every trophy, with its own guide.** Official names, descriptions and grades (as published on Exophase and PSNProfiles), plus a guide in our own words for each one: what to do, where and how, and when it can be missed. Every guide names its sources (PowerPyx, Push Square).
- **A tracker.** Tick trophies off as you earn them; progress is saved in the browser (localStorage) and can be exported to a file and imported back.
- **Filters by kind** — story, missable, collectibles, activities, crime & robberies, side quests, online (there are none: all 55 are single-player) — plus grade filter and search.
- **Spoiler setting.** Story trophies stay hidden until you earn them.
- **Roadmap to the platinum.** Three stages built from the official descriptions — story (60–80h), 100% completion (~100h), final cleanup (~10h) — with the one possibly-missable trophy flagged: meditate with Lucia on the balcony in Chapter 1.
- **Fully offline.** Static files under `app/`, no build step, no network requests at runtime, no external fonts or images.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
