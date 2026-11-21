// Twin Lanterns — difference data: the seven planned differences of each level.
// Coordinates are in panel space (PANEL_W x PANEL_H from scenes.js); r is the
// hit-test radius in pixels. The right panel is painted with every difference
// applied, the left panel with none, so the two pictures differ only here.

export const PANEL_W = 616;
export const PANEL_H = 500;

export const LEVELS = [
  {
    name: 'Lantern Street',
    tagline: 'An evening street of paper lanterns',
    timeLimit: 120,
    diffs: [
      { id: 'lantern-count', x: 308, y: 92, r: 30, label: 'A lantern is missing' },
      { id: 'sign-colour', x: 118, y: 152, r: 30, label: 'The hanging sign changed colour' },
      { id: 'awning-stripe', x: 300, y: 208, r: 30, label: 'An awning stripe changed colour' },
      { id: 'cat-missing', x: 520, y: 234, r: 30, label: 'The cat on the windowsill is gone' },
      { id: 'basket-added', x: 198, y: 402, r: 30, label: 'A basket appeared on the bicycle' },
      { id: 'plant-flowers', x: 88, y: 420, r: 30, label: 'Flowers bloomed on the potted plant' },
      { id: 'puddle-moon', x: 420, y: 442, r: 30, label: 'The moon reflection vanished from the puddle' },
    ],
  },
  {
    name: 'Garden Pond',
    tagline: 'Koi, lilies and a stone lantern',
    timeLimit: 120,
    diffs: [
      { id: 'blossom-petals', x: 498, y: 72, r: 30, label: 'Blossom petals fell from the branch' },
      { id: 'dragonfly-gone', x: 478, y: 122, r: 28, label: 'The dragonfly flew away' },
      { id: 'lantern-top', x: 92, y: 178, r: 30, label: 'The stone lantern lost its top stone' },
      { id: 'koi-count', x: 300, y: 302, r: 30, label: 'A koi fish is missing' },
      { id: 'lily-flower', x: 178, y: 352, r: 30, label: 'The lily flower changed colour' },
      { id: 'frog-gone', x: 522, y: 382, r: 30, label: 'The frog hopped off its rock' },
      { id: 'stepping-stone', x: 382, y: 432, r: 30, label: 'An extra stepping stone appeared' },
    ],
  },
  {
    name: 'Bakery Window',
    tagline: 'Fresh bread, cakes and a sleeping cat',
    timeLimit: 120,
    diffs: [
      { id: 'menu-price', x: 522, y: 148, r: 30, label: 'The chalkboard price changed' },
      { id: 'cake-cherry', x: 300, y: 178, r: 28, label: 'The cherry on the cake is gone' },
      { id: 'jar-cookies', x: 122, y: 252, r: 30, label: 'Cookies vanished from the jar' },
      { id: 'extra-loaf', x: 382, y: 262, r: 30, label: 'An extra loaf appeared on the shelf' },
      { id: 'teapot-handle', x: 198, y: 332, r: 30, label: 'The teapot handle changed colour' },
      { id: 'plant-pot', x: 90, y: 382, r: 30, label: 'The window plant pot changed colour' },
      { id: 'cat-gone', x: 480, y: 402, r: 30, label: 'The sleeping cat is gone' },
    ],
  },
  {
    name: 'Star Harbor',
    tagline: 'Boats, a lighthouse beam and the moon',
    timeLimit: 120,
    diffs: [
      { id: 'moon-crater', x: 522, y: 82, r: 30, label: 'A crater appeared on the moon' },
      { id: 'gull-count', x: 300, y: 92, r: 30, label: 'A gull flew away' },
      { id: 'beam-width', x: 92, y: 152, r: 30, label: 'The lighthouse beam grew wider' },
      { id: 'boat-flag', x: 382, y: 202, r: 30, label: 'A flag appeared on the boat' },
      { id: 'buoy-colour', x: 150, y: 402, r: 30, label: 'The buoy changed colour' },
      { id: 'crate-gone', x: 422, y: 422, r: 30, label: 'A crate disappeared from the dock' },
      { id: 'net-added', x: 200, y: 432, r: 30, label: 'A fishing net appeared on the dock' },
    ],
  },
];

export function levelDiff(levelIndex) {
  return LEVELS[levelIndex].diffs;
}
