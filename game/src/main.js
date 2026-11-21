// Twin Lanterns — bootstrap and screen state machine. Wires the canvases,
// input (mouse + keyboard), the render loop, and the engine together.

import { LEVELS, PANEL_W, PANEL_H } from './differences.js';
import { paintScene } from './scenes.js';
import {
  accuracy,
  markSpot,
  newGameState,
  startLevel,
  tickTimer,
  useHint,
} from './engine.js';
import { sounds } from './audio.js';
import { buildLevelSelect, showScreen, updateHud } from './ui.js';
import { applyShot, readShotParams } from './shots.js';

const state = newGameState();
state.bestScore = Number(localStorage.getItem('twin-lanterns-best') || 0);

const leftCanvas = document.getElementById('panel-left');
const rightCanvas = document.getElementById('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');
leftCanvas.width = PANEL_W; leftCanvas.height = PANEL_H;
rightCanvas.width = PANEL_W; rightCanvas.height = PANEL_H;

// --- rendering ---------------------------------------------------------

function drawMarkers(ctx, levelIndex) {
  const now = Date.now();
  const diffs = LEVELS[levelIndex].diffs;
  for (const d of diffs) {
    if (!state.found.has(d.id)) continue;
    ctx.save();
    ctx.strokeStyle = '#ffd76a';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 215, 106, 0.35)';
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 3, 0, Math.PI * 2); ctx.stroke();
    // check mark
    ctx.strokeStyle = '#ffd76a'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x - 10, d.y + 1); ctx.lineTo(d.x - 2, d.y + 9); ctx.lineTo(d.x + 12, d.y - 9);
    ctx.stroke();
    ctx.restore();
  }
  // hint pulse on one unfound difference
  if (state.hintPulse && now < state.hintPulse.until && state.screen === 'play') {
    const d = diffs.find((x) => x.id === state.hintPulse.id);
    if (d) {
      const pulse = 1 + 0.25 * Math.sin(now / 130);
      ctx.save();
      ctx.strokeStyle = 'rgba(120, 220, 255, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }
}

function drawCrosshair(ctx) {
  if (!state.crosshair.visible || state.screen !== 'play') return;
  const { x, y } = state.crosshair;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 24, y); ctx.lineTo(x - 10, y);
  ctx.moveTo(x + 10, y); ctx.lineTo(x + 24, y);
  ctx.moveTo(x, y - 24); ctx.lineTo(x, y - 10);
  ctx.moveTo(x, y + 10); ctx.lineTo(x, y + 24);
  ctx.stroke();
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawFlash(ctx) {
  if (Date.now() < state.flash && state.screen === 'play') {
    ctx.save();
    ctx.fillStyle = 'rgba(220, 40, 40, 0.22)';
    ctx.fillRect(0, 0, PANEL_W, PANEL_H);
    ctx.restore();
  }
}

function render() {
  const allDiffIds = new Set(LEVELS[state.level].diffs.map((d) => d.id));
  paintScene(leftCtx, state.level, new Set());
  paintScene(rightCtx, state.level, allDiffIds);
  drawMarkers(leftCtx, state.level);
  drawMarkers(rightCtx, state.level);
  drawCrosshair(leftCtx);
  drawCrosshair(rightCtx);
  drawFlash(leftCtx);
  drawFlash(rightCtx);
  updateHud(state);
}

// --- flow --------------------------------------------------------------

function saveBest() {
  const total = state.screen === 'victory' ? state.totalScore : state.score;
  if (total > state.bestScore) {
    state.bestScore = total;
    localStorage.setItem('twin-lanterns-best', String(total));
  }
}

function enterLevel(levelIndex) {
  state.score = 0;
  startLevel(state, levelIndex);
  showScreen(state);
  sounds.click();
}

function nextLevel() {
  if (state.level + 1 < LEVELS.length) {
    enterLevel(state.level + 1);
  }
}

function backToMenu() {
  saveBest();
  state.screen = 'menu';
  showScreen(state);
  sounds.click();
}

function playAgain() {
  state.totalScore = 0;
  state.correct = 0;
  state.wrong = 0;
  state.hintsUsed = 0;
  enterLevel(0);
}

// --- input -------------------------------------------------------------

function panelCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
  };
}

function handleMark(x, y) {
  const result = markSpot(state, x, y);
  if (result === 'found') {
    sounds.found();
    if (state.screen === 'levelComplete') sounds.levelClear();
    if (state.screen === 'victory') { sounds.victory(); saveBest(); }
  } else if (result === 'wrong') {
    sounds.wrong();
  }
  showScreen(state);
}

for (const canvas of [leftCanvas, rightCanvas]) {
  canvas.addEventListener('click', (event) => {
    const { x, y } = panelCoords(canvas, event);
    state.crosshair = { x, y, visible: true };
    handleMark(x, y);
  });
  canvas.addEventListener('mousemove', (event) => {
    const { x, y } = panelCoords(canvas, event);
    state.crosshair = { x, y, visible: true };
  });
}

document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'Escape') {
    if (state.screen !== 'menu') backToMenu();
    return;
  }
  if (state.screen === 'menu' && (key === 'Enter' || key === ' ')) {
    event.preventDefault();
    playAgain();
    return;
  }
  if (state.screen === 'levelComplete' && (key === 'n' || key === 'N' || key === 'Enter')) {
    nextLevel();
    return;
  }
  if (state.screen === 'victory' && (key === 'Enter' || key === ' ')) {
    playAgain();
    return;
  }
  if (state.screen === 'timeUp' && (key === 'r' || key === 'R' || key === 'Enter')) {
    enterLevel(state.level);
    return;
  }
  if (state.screen !== 'play') return;
  const step = event.shiftKey ? 24 : 8;
  const c = state.crosshair;
  if (key === 'ArrowLeft') { c.x = Math.max(0, c.x - step); c.visible = true; event.preventDefault(); }
  else if (key === 'ArrowRight') { c.x = Math.min(PANEL_W, c.x + step); c.visible = true; event.preventDefault(); }
  else if (key === 'ArrowUp') { c.y = Math.max(0, c.y - step); c.visible = true; event.preventDefault(); }
  else if (key === 'ArrowDown') { c.y = Math.min(PANEL_H, c.y + step); c.visible = true; event.preventDefault(); }
  else if (key === 'Enter' || key === ' ') { event.preventDefault(); handleMark(c.x, c.y); }
  else if (key === 'h' || key === 'H') {
    const pick = useHint(state);
    if (pick) sounds.hint();
  } else if (key === 'r' || key === 'R') {
    enterLevel(state.level);
  } else if (key === 'm' || key === 'M') {
    sounds.toggleMute();
    document.getElementById('mute-btn').textContent = sounds.muted ? '🔇 Suara mati' : '🔊 Suara hidup';
  }
});

// --- buttons -----------------------------------------------------------

document.getElementById('play-btn').addEventListener('click', playAgain);
document.getElementById('next-btn').addEventListener('click', nextLevel);
document.getElementById('again-btn').addEventListener('click', playAgain);
document.getElementById('retry-btn').addEventListener('click', () => enterLevel(state.level));
document.getElementById('menu-btn').addEventListener('click', backToMenu);
document.getElementById('menu-btn-2').addEventListener('click', backToMenu);
document.getElementById('menu-btn-3').addEventListener('click', backToMenu);
document.getElementById('hint-btn').addEventListener('click', () => {
  const pick = useHint(state);
  if (pick) sounds.hint();
});
document.getElementById('mute-btn').addEventListener('click', () => {
  sounds.toggleMute();
  document.getElementById('mute-btn').textContent = sounds.muted ? '🔇 Suara mati' : '🔊 Suara hidup';
});
document.getElementById('restart-btn').addEventListener('click', () => enterLevel(state.level));

buildLevelSelect(state, (i) => enterLevel(i));

// --- boot --------------------------------------------------------------

const shot = readShotParams();
const staged = applyShot(state, shot);
if (!staged) {
  state.screen = 'menu';
}
showScreen(state);
render();

// Timer + animation loop: repaint every frame so the hint pulse, crosshair
// and timer stay live; the scenes are seeded, so repaints are identical.
function loop() {
  const before = state.screen;
  tickTimer(state);
  if (state.screen === 'timeUp' && before === 'play') {
    sounds.timeUp();
    showScreen(state);
  }
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Expose a tiny handle for automated play-testing (not part of the game UI).
window.__twinLanterns = { state, LEVELS, accuracy };
