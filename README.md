# Twin Lanterns — Spot the Difference

[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/einsteincy/spot-the-difference-01-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=badge&utm_campaign=repo-badge)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/einsteincy/spot-the-difference-01-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=badge&utm_campaign=repo-badge)

A complete spot-the-difference game. Two near-identical pictures side by side —
find all 7 differences before the timer runs out. Four hand-painted (in code)
scenes, mouse and keyboard play, hints, sounds, and a victory screen.

Built by an AI agent for make.fun's "Make the best spot the difference game"
bounty, $50 in USDC.

## The four scenes

| Level | Scene | Hunt |
|-------|-------|------|
| 1 | **Lantern Street** — an evening street of paper lanterns, a shop awning, a cat on the windowsill, a bicycle and puddle reflections | 7 differences |
| 2 | **Garden Pond** — koi, lily pads, a dragonfly, a stone lantern and a cherry-blossom branch | 7 differences |
| 3 | **Bakery Window** — shelves of breads and cakes, jars, a sleeping cat, a teapot and a chalkboard menu | 7 differences |
| 4 | **Star Harbor** — boats, a lighthouse beam, gulls, crates, fishing nets and the moon | 7 differences |

## How to play

- **Click** either picture on a difference: a golden ring marks it on both
  panels, +100 points plus a time bonus. A wrong click costs 25 points.
- **Keyboard:** arrow keys move the crosshair, **Enter** / **Space** marks the
  spot under it. **H** = hint (−50 points, pulses one unfound difference),
  **N** = next level, **R** = restart level, **M** = mute, **Esc** = menu.
- Each level gives you **120 seconds**. Find all 7 to move on; find all 28
  across the four levels to win.

## How to run

No build step, no network, no dependencies — plain static files.

```sh
# any static server works, for example:
npx serve game
# or: python3 -m http.server -d game 8080
```

Then open <http://localhost:8080> in a desktop browser.

## How it is made

Every picture is drawn procedurally on a `<canvas>` from code (no image
files), so the two panels differ only at the seven planned points per level.
Sounds are synthesized with the WebAudio API — no audio files. Your best
score is kept in `localStorage`.

Files: `game/index.html` and `game/style.css` hold the page; `game/src/`
splits the game by job — `main.js` (bootstrap and screen state machine),
`scenes.js` (the four scene painters), `differences.js` (the difference data),
`engine.js` (clicks, hit-testing, scoring, timer, hints), `audio.js`
(WebAudio sounds), `ui.js` (HUD and screens), `shots.js` (staged
`?shot=` states for screenshots).

## Screenshots

The four screenshots in `screenshots/` are real renders of this game's own
code, taken in headless Chromium: the cover shows level 1 mid-hunt with 3
differences found and 4 remaining; then the garden pond, the victory screen,
and the menu.
