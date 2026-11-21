// Twin Lanterns — game engine: click hit-testing, scoring, timer, hints.
// Pure rules over a small state object; main.js owns the DOM and the loop.

import { LEVELS } from './differences.js';

export const POINTS_FOUND = 100;
export const POINTS_WRONG = -25;
export const POINTS_HINT = -50;
export const TIME_BONUS_PER_SECOND = 5;

export function newGameState() {
  return {
    screen: 'menu', // menu | play | levelComplete | victory | timeUp
    level: 0,
    found: new Set(),
    score: 0,
    totalScore: 0,
    timeLeft: 120,
    deadline: 0,
    correct: 0,
    wrong: 0,
    hintsUsed: 0,
    muted: false,
    crosshair: { x: 308, y: 250, visible: false },
    hintPulse: null, // { id, until }
    flash: 0, // timestamp until which a wrong-click red flash shows
    levelBonus: 0,
    bestScore: 0,
  };
}

export function startLevel(state, levelIndex) {
  state.level = levelIndex;
  state.found = new Set();
  state.timeLeft = LEVELS[levelIndex].timeLimit;
  state.deadline = Date.now() + LEVELS[levelIndex].timeLimit * 1000;
  state.screen = 'play';
  state.hintPulse = null;
  state.crosshair = { x: 308, y: 250, visible: false };
}

export function levelDiffs(state) {
  return LEVELS[state.level].diffs;
}

export function foundCount(state) {
  return state.found.size;
}

export function remainingCount(state) {
  return LEVELS[state.level].diffs.length - state.found.size;
}

export function isLevelComplete(state) {
  return state.found.size >= LEVELS[state.level].diffs.length;
}

// Mark the spot (x, y) in panel coordinates. Returns 'found' | 'wrong' |
// 'already' | 'ignored'. A found difference scores 100 plus a small time
// bonus; a wrong click costs 25.
export function markSpot(state, x, y) {
  if (state.screen !== 'play') return 'ignored';
  const diff = LEVELS[state.level].diffs.find((d) => {
    if (state.found.has(d.id)) return false;
    const dx = x - d.x, dy = y - d.y;
    return dx * dx + dy * dy <= (d.r + 6) * (d.r + 6);
  });
  if (diff) {
    state.found.add(diff.id);
    state.correct += 1;
    const bonus = Math.max(0, Math.floor(state.timeLeft / 10));
    state.score += POINTS_FOUND + bonus;
    if (isLevelComplete(state)) {
      state.levelBonus = Math.floor(state.timeLeft) * TIME_BONUS_PER_SECOND;
      state.score += state.levelBonus;
      state.totalScore += state.score;
      state.screen = state.level >= LEVELS.length - 1 ? 'victory' : 'levelComplete';
    }
    return 'found';
  }
  state.wrong += 1;
  state.score = Math.max(0, state.score + POINTS_WRONG);
  state.flash = Date.now() + 220;
  return 'wrong';
}

// Spend 50 points to pulse one random unfound difference for a moment.
export function useHint(state) {
  if (state.screen !== 'play') return null;
  const unfound = LEVELS[state.level].diffs.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return null;
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  state.score = Math.max(0, state.score + POINTS_HINT);
  state.hintsUsed += 1;
  state.hintPulse = { id: pick.id, until: Date.now() + 1600 };
  return pick;
}

export function tickTimer(state) {
  if (state.screen !== 'play') return;
  state.timeLeft = Math.max(0, (state.deadline - Date.now()) / 1000);
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = 'timeUp';
  }
}

export function accuracy(state) {
  const total = state.correct + state.wrong;
  return total === 0 ? 100 : Math.round((state.correct / total) * 100);
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
