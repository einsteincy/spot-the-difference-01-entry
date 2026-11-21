// Twin Lanterns — staged states for screenshots (?shot= params).
// The game renders the staged state on load from the URL params alone, with
// no clicks needed. Deterministic: &seed= picks the RNG seed (default 1).
//
//   ?shot=menu                       menu screen
//   ?shot=play&level=N&found=K       playing level N with the first K
//                                    differences already marked
//   ?shot=win                        victory screen with sample totals

import { LEVELS } from './differences.js';
import { startLevel } from './engine.js';

export function readShotParams() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return null;
  const level = Math.min(Math.max(parseInt(q.get('level') || '1', 10), 1), LEVELS.length);
  const found = Math.min(Math.max(parseInt(q.get('found') || '0', 10), 0), 7);
  const seed = parseInt(q.get('seed') || '1', 10) || 1;
  return { shot, level, found, seed };
}

export function applyShot(state, params) {
  if (!params) return false;
  if (params.shot === 'menu') {
    state.screen = 'menu';
    return true;
  }
  if (params.shot === 'play') {
    startLevel(state, params.level - 1);
    const diffs = LEVELS[state.level].diffs;
    for (let i = 0; i < params.found; i++) state.found.add(diffs[i].id);
    state.score = params.found * 100 + 37;
    state.correct = params.found;
    state.timeLeft = 97;
    state.deadline = Date.now() + 97 * 1000;
    return true;
  }
  if (params.shot === 'win') {
    state.screen = 'victory';
    state.level = LEVELS.length - 1;
    state.found = new Set(LEVELS[LEVELS.length - 1].diffs.map((d) => d.id));
    state.totalScore = 2840;
    state.score = 760;
    state.correct = 26;
    state.wrong = 2;
    state.hintsUsed = 1;
    return true;
  }
  return false;
}
