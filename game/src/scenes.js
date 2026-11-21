// Twin Lanterns — scene painters. Every picture is drawn procedurally on a
// canvas from code (no image files), so the left and right panels differ ONLY
// at the seven planned points: paintScene draws the same scene twice, once
// with no difference applied (left panel) and once with every difference
// applied (right panel). A seeded RNG keeps every decorative detail identical
// between the two panels and across runs.

export const PANEL_W = 616;
export const PANEL_H = 500;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
}

function rrect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}

function paperLantern(ctx, x, y, r, colour, glow) {
  if (glow) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.2);
    g.addColorStop(0, 'rgba(255, 190, 90, 0.45)');
    g.addColorStop(1, 'rgba(255, 190, 90, 0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, Math.PI * 2); ctx.fill();
  }
  ellipse(ctx, x, y, r, r * 1.18, colour);
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.55, r * 1.18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
  rect(ctx, x - r * 0.28, y - r * 1.32, r * 0.56, 5, '#7a4a21');
  rect(ctx, x - r * 0.28, y + r * 1.28, r * 0.56, 5, '#7a4a21');
  line(ctx, x, y - r * 1.32, x, y - r * 1.9, '#3a2a18', 2);
}

function drawCat(ctx, x, y, s, colour) {
  // Sitting cat, side view, facing left.
  ctx.fillStyle = colour;
  ctx.beginPath(); ctx.ellipse(x, y, 26 * s, 15 * s, 0, 0, Math.PI * 2); ctx.fill(); // body
  circle(ctx, x - 20 * s, y - 16 * s, 11 * s, colour); // head
  ctx.beginPath(); // ears
  ctx.moveTo(x - 30 * s, y - 22 * s); ctx.lineTo(x - 28 * s, y - 32 * s); ctx.lineTo(x - 22 * s, y - 24 * s);
  ctx.moveTo(x - 16 * s, y - 24 * s); ctx.lineTo(x - 14 * s, y - 34 * s); ctx.lineTo(x - 10 * s, y - 23 * s);
  ctx.fill();
  ctx.beginPath(); // tail curl
  ctx.arc(x + 24 * s, y - 6 * s, 10 * s, Math.PI * 0.9, Math.PI * 2.1);
  ctx.strokeStyle = colour; ctx.lineWidth = 5 * s; ctx.stroke();
  circle(ctx, x - 24 * s, y - 17 * s, 1.6 * s, '#ffd76a'); // eye
}

function drawKoi(ctx, x, y, angle, colour, belly) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.beginPath(); ctx.ellipse(0, 0, 26, 9, 0, 0, Math.PI * 2); ctx.fillStyle = colour; ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 3, 20, 5, 0, 0, Math.PI); ctx.fillStyle = belly; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-36, -9); ctx.lineTo(-36, 9); ctx.closePath();
  ctx.fillStyle = colour; ctx.fill();
  circle(ctx, 16, -3, 1.8, '#1a1a1a');
  ctx.restore();
}

function drawGull(ctx, x, y, s, colour) {
  ctx.beginPath();
  ctx.moveTo(x - 14 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 9 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 9 * s, x + 14 * s, y);
  ctx.strokeStyle = colour; ctx.lineWidth = 2.4 * s; ctx.stroke();
}

// ---------------------------------------------------------------- level 1
function paintLanternStreet(ctx, mods, rng) {
  const W = PANEL_W, H = PANEL_H;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#2b2350'); sky.addColorStop(0.55, '#6b3a6e'); sky.addColorStop(1, '#c96f4a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  // stars + moon
  for (let i = 0; i < 40; i++) {
    circle(ctx, rng() * W, rng() * 170, rng() * 1.6 + 0.6, 'rgba(255,255,220,0.85)');
  }
  circle(ctx, 540, 58, 30, '#f7e8b0');
  circle(ctx, 530, 50, 26, '#efe0a0');
  // distant rooftops
  ctx.fillStyle = '#3a2f55';
  for (let i = 0; i < 6; i++) {
    const x = i * 108 + 8;
    ctx.beginPath(); ctx.moveTo(x, 210); ctx.lineTo(x + 50, 160); ctx.lineTo(x + 100, 210); ctx.closePath(); ctx.fill();
    rect(ctx, x + 6, 210, 88, 40, '#3a2f55');
  }
  // street + cobbles
  const street = ctx.createLinearGradient(0, 250, 0, H);
  street.addColorStop(0, '#5c4a6b'); street.addColorStop(1, '#3c3247');
  ctx.fillStyle = street; ctx.fillRect(0, 250, W, H - 250);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
  for (let y = 268; y < H; y += 22) { line(ctx, 0, y, W, y, 'rgba(255,255,255,0.07)', 1); }
  for (let x = 20; x < W; x += 34) { line(ctx, x, 250, x - 30, H, 'rgba(255,255,255,0.05)', 1); }
  // left shop building with windows
  rect(ctx, 30, 150, 190, 210, '#8a4f3d');
  rect(ctx, 30, 150, 190, 14, '#6e3d2f');
  for (let i = 0; i < 3; i++) {
    rrect(ctx, 48 + i * 58, 190, 44, 62, 4, '#ffd98a');
    line(ctx, 70 + i * 58, 190, 70 + i * 58, 252, '#6e3d2f', 3);
    line(ctx, 48 + i * 58, 221, 92 + i * 58, 221, '#6e3d2f', 3);
  }
  rect(ctx, 44, 268, 162, 92, '#5a3328');
  rrect(ctx, 96, 290, 58, 70, 4, '#2e1c16');
  circle(ctx, 142, 325, 4, '#ffd76a');
  // hanging sign (diff: sign-colour)
  line(ctx, 118, 150, 118, 128, '#3a2a18', 3);
  const signColour = mods.has('sign-colour') ? '#2e8f86' : '#c0392b';
  rrect(ctx, 92, 128, 52, 40, 6, signColour);
  ctx.fillStyle = '#fff3d0'; ctx.font = 'bold 15px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('TEA', 118, 153);
  // right building with windowsill cat
  rect(ctx, 420, 130, 166, 230, '#74455e');
  rect(ctx, 420, 130, 166, 14, '#5a3547');
  rrect(ctx, 438, 168, 56, 66, 4, '#ffd98a');
  rrect(ctx, 512, 168, 56, 66, 4, '#ffd98a');
  rect(ctx, 430, 244, 146, 10, '#d8c9a3'); // windowsill
  if (!mods.has('cat-missing')) drawCat(ctx, 520, 234, 1.0, '#f0e6d2');
  rrect(ctx, 438, 268, 130, 92, 4, '#4a2c40');
  // awning over the shop door (diff: awning-stripe)
  for (let i = 0; i < 6; i++) {
    const stripe = (i % 2 === 0) ? '#e8b64c' : (mods.has('awning-stripe') ? '#3f7fb5' : '#c0392b');
    ctx.beginPath();
    ctx.moveTo(240 + i * 30, 196); ctx.lineTo(240 + i * 30, 232);
    ctx.lineTo(270 + i * 30, 232); ctx.lineTo(270 + i * 30, 196);
    ctx.closePath(); ctx.fillStyle = stripe; ctx.fill();
  }
  rect(ctx, 240, 190, 180, 8, '#7a4a21');
  // lantern strings (diff: lantern-count — middle lantern missing on right)
  line(ctx, 60, 60, 556, 60, '#3a2a18', 2);
  const lanternXs = [110, 210, 308, 408, 505];
  lanternXs.forEach((x, i) => {
    if (mods.has('lantern-count') && i === 2) return;
    paperLantern(ctx, x, 92, 17, i % 2 ? '#e74c3c' : '#f39c12', true);
  });
  // bicycle (diff: basket-added)
  ctx.strokeStyle = '#dfe6ea'; ctx.lineWidth = 3;
  circle(ctx, 170, 420, 20, 'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(170, 420, 20, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(245, 420, 20, 0, Math.PI * 2); ctx.stroke();
  line(ctx, 170, 420, 205, 385, '#dfe6ea', 3);
  line(ctx, 205, 385, 245, 420, '#dfe6ea', 3);
  line(ctx, 205, 385, 200, 360, '#dfe6ea', 3);
  line(ctx, 200, 360, 225, 360, '#dfe6ea', 3);
  line(ctx, 245, 420, 228, 382, '#dfe6ea', 3);
  line(ctx, 228, 382, 205, 385, '#dfe6ea', 3);
  if (mods.has('basket-added')) {
    rect(ctx, 228, 366, 30, 20, '#a67c52');
    line(ctx, 228, 372, 258, 372, '#7a5a38', 1);
    line(ctx, 228, 379, 258, 379, '#7a5a38', 1);
  }
  // potted plant (diff: plant-flowers)
  rect(ctx, 66, 424, 44, 30, '#b5651d');
  ctx.fillStyle = '#3f7d3a';
  for (let i = 0; i < 7; i++) {
    ctx.beginPath(); ctx.ellipse(74 + i * 6, 420 - (i % 3) * 8, 7, 14, (i - 3) * 0.22, 0, Math.PI * 2); ctx.fill();
  }
  if (mods.has('plant-flowers')) {
    circle(ctx, 76, 398, 6, '#ff6b9d'); circle(ctx, 96, 392, 6, '#ff6b9d'); circle(ctx, 106, 404, 5, '#ffd76a');
  }
  // puddle with moon reflection (diff: puddle-moon)
  ellipse(ctx, 420, 448, 92, 16, 'rgba(120, 150, 200, 0.5)');
  ellipse(ctx, 420, 448, 70, 11, 'rgba(180, 200, 240, 0.35)');
  if (!mods.has('puddle-moon')) ellipse(ctx, 420, 446, 16, 7, 'rgba(247, 232, 176, 0.85)');
  ellipse(ctx, 150, 470, 60, 10, 'rgba(120, 150, 200, 0.35)');
}

// ---------------------------------------------------------------- level 2
function paintGardenPond(ctx, mods, rng) {
  const W = PANEL_W, H = PANEL_H;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#aee3f5'); sky.addColorStop(0.5, '#d9f2e3'); sky.addColorStop(1, '#bfe8c8');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  circle(ctx, 548, 60, 26, '#fff3b0');
  for (let i = 0; i < 8; i++) {
    const cx = rng() * W, cy = 30 + rng() * 70;
    ellipse(ctx, cx, cy, 26 + rng() * 18, 10, 'rgba(255,255,255,0.85)');
  }
  // back hedge + cherry branch (diff: blossom-petals)
  ctx.fillStyle = '#5d8a4a';
  ctx.beginPath(); ctx.ellipse(300, 210, 340, 60, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7fae62';
  ctx.beginPath(); ctx.ellipse(300, 195, 300, 42, 0, 0, Math.PI * 2); ctx.fill();
  line(ctx, 616, 20, 430, 96, '#5a3a28', 7);
  line(ctx, 560, 44, 480, 110, '#5a3a28', 4);
  const petalCount = mods.has('blossom-petals') ? 5 : 11;
  for (let i = 0; i < petalCount; i++) {
    const px = 470 + rng() * 130, py = 40 + rng() * 70;
    circle(ctx, px, py, 7, '#ffb7d5');
    circle(ctx, px + 4, py + 3, 4, '#ffd0e2');
  }
  // stone lantern (diff: lantern-top)
  rect(ctx, 76, 300, 34, 14, '#9aa0a3');
  rect(ctx, 84, 240, 18, 62, '#b9bdc0');
  rect(ctx, 70, 224, 46, 18, '#c7cbce');
  if (!mods.has('lantern-top')) {
    ctx.beginPath(); ctx.moveTo(66, 224); ctx.lineTo(93, 198); ctx.lineTo(120, 224); ctx.closePath();
    ctx.fillStyle = '#8f9598'; ctx.fill();
  }
  rect(ctx, 66, 196, 6, 10, '#8f9598');
  // pond
  const pond = ctx.createRadialGradient(308, 350, 40, 308, 350, 300);
  pond.addColorStop(0, '#3f9db5'); pond.addColorStop(1, '#1f6f8b');
  ctx.fillStyle = pond;
  ctx.beginPath(); ctx.ellipse(308, 350, 300, 140, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.ellipse(180 + i * 55, 300 + (i % 3) * 45, 46, 9, 0, 0, Math.PI * 2); ctx.stroke();
  }
  // lily pads + flower (diff: lily-flower)
  const pads = [[150, 320, 34], [240, 380, 28], [400, 330, 36], [470, 390, 26], [300, 430, 30]];
  pads.forEach(([x, y, r]) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0.3, Math.PI * 2 - 0.3); ctx.lineTo(x, y); ctx.closePath();
    ctx.fillStyle = '#3e8f4f'; ctx.fill();
  });
  const flowerColour = mods.has('lily-flower') ? '#ffd76a' : '#ff8fb5';
  for (let p = 0; p < 6; p++) {
    const a = (p / 6) * Math.PI * 2;
    ellipse(ctx, 178 + Math.cos(a) * 9, 352 + Math.sin(a) * 9, 7, 4, flowerColour);
  }
  circle(ctx, 178, 352, 5, '#fff3b0');
  // koi (diff: koi-count — the orange one in the middle is missing on right)
  drawKoi(ctx, 250, 290, -0.25, '#ff8c42', '#ffe0b3');
  if (!mods.has('koi-count')) drawKoi(ctx, 300, 302, 0.35, '#ff6b35', '#ffe0b3');
  drawKoi(ctx, 360, 360, 2.6, '#f5f0e6', '#ffb199');
  drawKoi(ctx, 200, 400, 0.9, '#ff8c42', '#ffe0b3');
  // dragonfly (diff: dragonfly-gone)
  if (!mods.has('dragonfly-gone')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(466, 114, 18, 5, -0.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(490, 114, 18, 5, 0.5, 0, Math.PI * 2); ctx.stroke();
    line(ctx, 478, 106, 478, 140, '#2b3a55', 3);
    circle(ctx, 478, 104, 3, '#2b3a55');
  }
  // frog on a rock (diff: frog-gone)
  ellipse(ctx, 522, 392, 44, 18, '#8d8d94');
  ellipse(ctx, 522, 382, 38, 14, '#a5a5ab');
  if (!mods.has('frog-gone')) {
    circle(ctx, 512, 372, 11, '#4caf50');
    circle(ctx, 532, 372, 11, '#4caf50');
    circle(ctx, 510, 368, 3.5, '#1a1a1a'); circle(ctx, 530, 368, 3.5, '#1a1a1a');
    ellipse(ctx, 522, 380, 13, 7, '#81c784');
  }
  // stepping stones (diff: stepping-stone)
  const stones = [[120, 452], [200, 466], [290, 452], [382, 432], [470, 458], [550, 446]];
  stones.forEach(([x, y], i) => {
    if (mods.has('stepping-stone') && i === 3) { ellipse(ctx, x, y, 30, 12, '#b9b3a8'); return; }
    ellipse(ctx, x, y, 30, 12, i === 3 && !mods.has('stepping-stone') ? 'rgba(0,0,0,0)' : '#b9b3a8');
    if (i !== 3 || mods.has('stepping-stone')) ellipse(ctx, x, y - 3, 26, 9, '#cfc9bc');
  });
  // grass tufts at the pond edge
  ctx.strokeStyle = '#4a7d3a'; ctx.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const x = rng() * W, y = 215 + rng() * 14;
    line(ctx, x, y, x - 3, y - 10, '#4a7d3a', 2);
    line(ctx, x + 4, y, x + 7, y - 11, '#4a7d3a', 2);
  }
}

// ---------------------------------------------------------------- level 3
function paintBakeryWindow(ctx, mods, rng) {
  const W = PANEL_W, H = PANEL_H;
  rect(ctx, 0, 0, W, H, '#f3e3c8');
  // window frame + sky outside
  rect(ctx, 0, 0, W, 120, '#7fb3d5');
  circle(ctx, 90, 52, 22, '#fff3b0');
  for (let i = 0; i < 5; i++) ellipse(ctx, 200 + i * 90, 40 + (i % 2) * 18, 30, 10, 'rgba(255,255,255,0.9)');
  rect(ctx, 0, 112, W, 12, '#8a5a33');
  // wall + shelves
  rect(ctx, 0, 124, W, H - 124, '#e8cfa8');
  const shelfYs = [210, 300, 390];
  shelfYs.forEach((y) => { rect(ctx, 24, y, W - 48, 10, '#8a5a33'); });
  // chalkboard menu (diff: menu-price)
  rrect(ctx, 470, 140, 120, 62, 6, '#2e4038');
  ctx.fillStyle = '#f5f0e6'; ctx.font = 'bold 13px Georgia, serif'; ctx.textAlign = 'left';
  ctx.fillText('MENU', 484, 162);
  ctx.font = '12px Georgia, serif';
  ctx.fillText('Croissant', 484, 182);
  ctx.fillText(mods.has('menu-price') ? '$4.50' : '$3.50', 552, 182);
  ctx.fillText('Sourdough', 484, 198);
  ctx.fillText('$5.00', 552, 198);
  // top shelf: cakes (diff: cake-cherry)
  rrect(ctx, 60, 150, 90, 60, 8, '#fff0f5');
  rrect(ctx, 60, 150, 90, 18, 8, '#ff9ebb');
  if (!mods.has('cake-cherry')) circle(ctx, 105, 142, 7, '#d63031');
  rrect(ctx, 170, 160, 70, 50, 8, '#ffe8b3');
  rrect(ctx, 170, 160, 70, 14, 8, '#c98f2e');
  rrect(ctx, 260, 146, 110, 64, 8, '#e8d5b0');
  for (let i = 0; i < 4; i++) circle(ctx, 282 + i * 24, 168, 9, '#a0522d');
  ctx.fillStyle = '#fff'; ctx.font = '11px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('CAKE', 105, 196);
  // middle shelf: jars (diff: jar-cookies) + loaves (diff: extra-loaf)
  const jarXs = [60, 130, 200];
  jarXs.forEach((x, i) => {
    rrect(ctx, x, 232, 52, 68, 8, 'rgba(200, 220, 235, 0.55)');
    rect(ctx, x + 4, 228, 44, 8, '#b5651d');
    if (!(mods.has('jar-cookies') && i === 0)) {
      for (let c = 0; c < 5; c++) circle(ctx, x + 12 + (c % 3) * 14, 268 + Math.floor(c / 3) * 16, 6, '#a0522d');
    }
  });
  for (let i = 0; i < 3 + (mods.has('extra-loaf') ? 1 : 0); i++) {
    ellipse(ctx, 320 + i * 52, 282, 26, 16, '#c98f2e');
    line(ctx, 306 + i * 52, 276, 334 + i * 52, 276, '#8a5a33', 2);
  }
  // teapot (diff: teapot-handle)
  ellipse(ctx, 198, 340, 34, 24, '#5b8dd9');
  circle(ctx, 198, 312, 10, '#3f6fb5');
  ctx.beginPath(); ctx.moveTo(164, 330); ctx.quadraticCurveTo(140, 336, 146, 352); ctx.strokeStyle = '#3f6fb5'; ctx.lineWidth = 6; ctx.stroke();
  ctx.beginPath(); ctx.arc(232, 332, 14, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = mods.has('teapot-handle') ? '#e74c3c' : '#3f6fb5'; ctx.lineWidth = 6; ctx.stroke();
  // bottom shelf: bread baskets + sleeping cat (diff: cat-gone)
  for (let i = 0; i < 3; i++) {
    rrect(ctx, 52 + i * 96, 400, 78, 34, 6, '#a67c52');
    ellipse(ctx, 91 + i * 96, 398, 34, 12, '#e8c98a');
  }
  if (!mods.has('cat-gone')) {
    ctx.fillStyle = '#e8a33d';
    ctx.beginPath(); ctx.ellipse(480, 412, 42, 16, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 446, 404, 13, '#e8a33d');
    ctx.beginPath(); ctx.moveTo(438, 396); ctx.lineTo(436, 384); ctx.lineTo(444, 394); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(452, 394); ctx.lineTo(454, 382); ctx.lineTo(458, 394); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(516, 406, 14, Math.PI * 0.7, Math.PI * 1.9); ctx.strokeStyle = '#e8a33d'; ctx.lineWidth = 6; ctx.stroke();
    line(ctx, 442, 406, 450, 406, '#5a3a1a', 1.5);
  }
  // window plants (diff: plant-pot)
  const potColour = mods.has('plant-pot') ? '#e74c3c' : '#3f7d3a';
  [60, 540].forEach((x) => {
    ctx.fillStyle = '#3f7d3a';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.ellipse(x + 10 + i * 5, 96 - (i % 2) * 8, 6, 13, (i - 2) * 0.25, 0, Math.PI * 2); ctx.fill();
    }
    rect(ctx, x, 98, 40, 18, potColour);
  });
  // floor
  rect(ctx, 0, 452, W, 48, '#b08a5a');
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  for (let x = 0; x < W; x += 52) line(ctx, x, 452, x, H, 'rgba(0,0,0,0.12)', 1);
  // hanging sign
  line(ctx, 420, 124, 420, 138, '#3a2a18', 2);
  rrect(ctx, 396, 138, 48, 26, 5, '#c0392b');
  ctx.fillStyle = '#fff3d0'; ctx.font = 'bold 12px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('OPEN', 420, 156);
  void rng;
}

// ---------------------------------------------------------------- level 4
function paintStarHarbor(ctx, mods, rng) {
  const W = PANEL_W, H = PANEL_H;
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#0e1a3a'); sky.addColorStop(0.6, '#274b7a'); sky.addColorStop(1, '#e8915a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 320);
  for (let i = 0; i < 60; i++) circle(ctx, rng() * W, rng() * 220, rng() * 1.7 + 0.6, 'rgba(255,255,230,0.9)');
  // moon (diff: moon-crater)
  circle(ctx, 522, 82, 34, '#f7eec8');
  circle(ctx, 512, 74, 30, '#efe3b0');
  if (mods.has('moon-crater')) {
    circle(ctx, 534, 92, 7, '#cbbd8a'); circle(ctx, 512, 96, 5, '#cbbd8a'); circle(ctx, 524, 70, 4, '#d8cba0');
  }
  // gulls (diff: gull-count)
  drawGull(ctx, 250, 84, 1.0, '#f5f0e6');
  if (!mods.has('gull-count')) drawGull(ctx, 300, 92, 1.0, '#f5f0e6');
  drawGull(ctx, 350, 76, 0.9, '#f5f0e6');
  drawGull(ctx, 180, 110, 0.8, '#f5f0e6');
  // lighthouse (diff: beam-width)
  rect(ctx, 66, 150, 52, 170, '#f5f0e6');
  for (let i = 0; i < 3; i++) rect(ctx, 66, 186 + i * 52, 52, 22, '#c0392b');
  rrect(ctx, 60, 128, 64, 26, 4, '#2e2e3a');
  circle(ctx, 92, 141, 9, '#ffe9a3');
  const beamW = mods.has('beam-width') ? 66 : 34;
  const beam = ctx.createLinearGradient(124, 141, 500, 141);
  beam.addColorStop(0, 'rgba(255, 233, 163, 0.55)'); beam.addColorStop(1, 'rgba(255, 233, 163, 0)');
  ctx.fillStyle = beam;
  ctx.beginPath(); ctx.moveTo(124, 141); ctx.lineTo(500, 141 - beamW / 2); ctx.lineTo(500, 141 + beamW / 2); ctx.closePath(); ctx.fill();
  // sea
  const sea = ctx.createLinearGradient(0, 320, 0, H);
  sea.addColorStop(0, '#1f5f7a'); sea.addColorStop(1, '#0e2f45');
  ctx.fillStyle = sea; ctx.fillRect(0, 320, W, H - 320);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const y = 336 + i * 20;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 24) ctx.lineTo(x, y + Math.sin((x + i * 40) * 0.03) * 3);
    ctx.stroke();
  }
  ellipse(ctx, 522, 340, 60, 8, 'rgba(247, 238, 200, 0.35)');
  // boats
  function boat(bx, by, s, hull, sail) {
    ctx.fillStyle = hull;
    ctx.beginPath(); ctx.moveTo(bx - 52 * s, by); ctx.lineTo(bx + 52 * s, by); ctx.lineTo(bx + 38 * s, by + 20 * s); ctx.lineTo(bx - 38 * s, by + 20 * s); ctx.closePath(); ctx.fill();
    line(ctx, bx, by, bx, by - 62 * s, '#5a3a28', 4 * s);
    ctx.fillStyle = sail;
    ctx.beginPath(); ctx.moveTo(bx, by - 60 * s); ctx.lineTo(bx, by - 6 * s); ctx.lineTo(bx + 38 * s, by - 6 * s); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx - 4 * s, by - 54 * s); ctx.lineTo(bx - 4 * s, by - 6 * s); ctx.lineTo(bx - 30 * s, by - 6 * s); ctx.closePath(); ctx.fill();
  }
  boat(382, 210, 1.0, '#7a4a21', '#f5f0e6');
  // flag on the boat (diff: boat-flag)
  if (mods.has('boat-flag')) {
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath(); ctx.moveTo(382, 148); ctx.lineTo(408, 155); ctx.lineTo(382, 164); ctx.closePath(); ctx.fill();
  }
  boat(180, 260, 0.7, '#4a6b8a', '#ffe8b3');
  boat(520, 300, 0.55, '#8a4f3d', '#d5f5e3');
  // dock
  rect(ctx, 0, 400, W, 100, '#6b4a2f');
  rect(ctx, 0, 400, W, 10, '#8a5a33');
  for (let x = 10; x < W; x += 46) line(ctx, x, 410, x, H, 'rgba(0,0,0,0.18)', 2);
  // buoy (diff: buoy-colour)
  const buoyColour = mods.has('buoy-colour') ? '#2e8f86' : '#e74c3c';
  ellipse(ctx, 150, 402, 20, 10, buoyColour);
  ctx.beginPath(); ctx.arc(150, 392, 14, Math.PI, 0); ctx.fillStyle = buoyColour; ctx.fill();
  rect(ctx, 147, 372, 6, 10, '#f5f0e6');
  // crates (diff: crate-gone)
  if (!mods.has('crate-gone')) {
    rect(ctx, 400, 380, 44, 44, '#a67c52');
    line(ctx, 400, 402, 444, 402, '#7a5a38', 2); line(ctx, 422, 380, 422, 424, '#7a5a38', 2);
  }
  rect(ctx, 452, 396, 36, 28, '#8a5a33');
  line(ctx, 452, 410, 488, 410, '#5a3a1a', 2);
  // fishing net (diff: net-added)
  if (mods.has('net-added')) {
    ctx.strokeStyle = 'rgba(230, 230, 220, 0.8)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) line(ctx, 170 + i * 16, 410, 170 + i * 16, 452, 'rgba(230,230,220,0.8)', 1.5);
    for (let j = 0; j < 4; j++) line(ctx, 170, 414 + j * 12, 234, 414 + j * 12, 'rgba(230,230,220,0.8)', 1.5);
    ellipse(ctx, 202, 452, 34, 6, 'rgba(230,230,220,0.25)');
  }
  // barrels + rope coils on the dock
  ellipse(ctx, 90, 440, 18, 22, '#7a5a38');
  ellipse(ctx, 90, 424, 18, 8, '#a67c52');
  ctx.strokeStyle = '#d8c9a3'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(320, 448, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(320, 448, 9, 0, Math.PI * 2); ctx.stroke();
}

const PAINTERS = [paintLanternStreet, paintGardenPond, paintBakeryWindow, paintStarHarbor];

// Paint one panel of a level. `applied` is the set of difference ids that are
// visible in this panel (empty for the left panel, all seven for the right).
export function paintScene(ctx, levelIndex, applied) {
  const rng = mulberry32(1000 + levelIndex * 77);
  ctx.save();
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  PAINTERS[levelIndex](ctx, applied, rng);
  ctx.restore();
}
