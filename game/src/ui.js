// Twin Lanterns — HUD and screens. The HUD is always visible while playing
// (level name, score, timer, and the "N tersisa" counter of differences left);
// the menu, level-complete, victory and time-up screens are overlays.

import { LEVELS } from './differences.js';
import { accuracy, formatTime, foundCount, remainingCount } from './engine.js';

const $ = (id) => document.getElementById(id);

export function updateHud(state) {
  const level = LEVELS[state.level];
  $('hud-level').textContent = `Level ${state.level + 1} · ${level.name}`;
  $('hud-score').textContent = `Skor ${state.score}`;
  $('hud-timer').textContent = formatTime(state.timeLeft);
  $('hud-timer').classList.toggle('low', state.timeLeft <= 20 && state.screen === 'play');
  const found = foundCount(state);
  const total = level.diffs.length;
  const left = remainingCount(state);
  $('hud-found').textContent = `${found}/${total} — ${left} tersisa`;
  $('hud-found').classList.toggle('done', left === 0);
}

export function showScreen(state) {
  for (const id of ['screen-menu', 'screen-level', 'screen-victory', 'screen-timeup']) {
    $(id).classList.add('hidden');
  }
  document.body.dataset.screen = state.screen;
  if (state.screen === 'menu') {
    $('menu-best').textContent = state.bestScore > 0 ? `Skor terbaik: ${state.bestScore}` : 'Belum ada skor — mainkan level pertamamu!';
    $('screen-menu').classList.remove('hidden');
  } else if (state.screen === 'levelComplete') {
    const level = LEVELS[state.level];
    $('level-title').textContent = `${level.name} selesai!`;
    $('level-detail').textContent =
      `7/7 ditemukan · Bonus waktu +${state.levelBonus} · Skor level ${state.score}`;
    $('screen-level').classList.remove('hidden');
  } else if (state.screen === 'victory') {
    $('victory-score').textContent = `${state.totalScore}`;
    $('victory-detail').textContent =
      `28/28 perbedaan ditemukan · Akurasi ${accuracy(state)}% · ${state.hintsUsed} petunjuk dipakai`;
    $('screen-victory').classList.remove('hidden');
  } else if (state.screen === 'timeUp') {
    $('timeup-detail').textContent =
      `${foundCount(state)}/7 ditemukan di ${LEVELS[state.level].name} — waktunya habis!`;
    $('screen-timeup').classList.remove('hidden');
  }
}

export function buildLevelSelect(state, onPick) {
  const box = $('level-select');
  box.innerHTML = '';
  LEVELS.forEach((level, i) => {
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    btn.type = 'button';
    btn.innerHTML = `<b>${i + 1}. ${level.name}</b><span>${level.tagline} · 7 perbedaan</span>`;
    btn.addEventListener('click', () => onPick(i));
    box.appendChild(btn);
  });
}
