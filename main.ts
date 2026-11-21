// Twin Lanterns — entry hand-in program (Node 22+, standard library only).
//
// The game lives in this directory's game/ folder (plain static files: an
// HTML page and its ES modules, no build step, nothing fetched over the
// network) and its screenshots live in screenshots/. This program copies both
// into the output directory and writes output/dossier.json, the summary the
// judge reads, using the vendored make.fun library.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice and the two outputs are byte-identical: the dossier builder
// is deterministic and the copy preserves file bytes.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Directory this file lives in, and the output directory (grader: /output).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's caps, taken from the competition's gate: the text cap shapes
// the dossier's bytes; the others only refuse an entry the scorer would
// refuse anyway (more than 4 screenshots, one over 256 KiB, game/ over 993
// files or 48 MiB, a game path over 1000 bytes).
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function copyGameAndShots() {
  mkdirSync(outputDir, { recursive: true });
  cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
  const shotsDir = join(repoRoot, 'screenshots');
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  if (existsSync(shotsDir) && readdirSync(shotsDir).length > 0) {
    cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
  }
}

function writeDossier() {
  const dossier = buildDossier(outputDir, DOSSIER_CAPS);
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
}

copyGameAndShots();
writeDossier();
