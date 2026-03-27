// Palette de couleurs — chaque caractère = 1 pixel
export const PALETTE = {
  Y: '#FFD700', // or/jaune (bananes, étoiles)
  y: '#9A7000', // jaune foncé
  n: '#3A2000', // brun foncé (contour banane)
  G: '#33CC55', // vert vif
  g: '#117733', // vert foncé
  R: '#FF4444', // rouge
  r: '#AA1111', // rouge foncé
  B: '#4499FF', // bleu
  b: '#2244AA', // bleu foncé
  W: '#FFFFFF', // blanc
  w: '#888888', // gris
  X: '#333333', // gris foncé
  x: '#111111', // presque noir
  O: '#FF8800', // orange
  o: '#AA5500', // orange foncé
  P: '#BB44FF', // violet
  p: '#7700AA', // violet foncé
  C: '#44DDFF', // cyan
  M: '#FF66BB', // rose
  K: '#FFCC88', // peau
  k: '#CC8844', // peau foncée
  S: '#00AAFF', // bleu ciel
  T: '#00FFAA', // teal
}

// Grilles 8×8 — '.' = transparent
export const PIXEL_ARTS = {

  // ── Bananes ─────────────────────────────────────────────────

  banana: [
    '....nn..',
    '...nYYn.',
    '..nYYYYn',
    '.nYYYYYn',
    'nYYYYYn.',
    '.nYYYYn.',
    '..nYYn..',
    '...nn...',
  ],

  bowl: [
    '........',
    'XXXXXXXX',
    'XYYYYYYX',
    '.XXXXXX.',
    '..XXXX..',
    '...XX...',
    '..XXXX..',
    '........',
  ],

  box: [
    'XXXXXXXX',
    'XYYyYYYX',
    'XYYyYYYX',
    'XyyyyyYX',
    'XYYyYYYX',
    'XXXXXXXX',
    '........',
    '........',
  ],

  store: [
    'RRRRRRRR',
    'XXXXXXXX',
    'XW.WXW.X',
    'XW.WXW.X',
    'XXXXXXXX',
    'X.WWWW.X',
    'X.WWWW.X',
    'XXXXXXXX',
  ],

  briefcase: [
    '..XXXX..',
    '.X....X.',
    'XXXXXXXX',
    'X......X',
    'X..XX..X',
    'X......X',
    'XXXXXXXX',
    '........',
  ],

  money: [
    '...nn...',
    '..YYYY..',
    '.YYYYYY.',
    'YYYYYYYY',
    'YYYYYYYY',
    'YYYYYYYY',
    '.YYYYYY.',
    '..YYYY..',
  ],

  pray: [
    '.KK.KK..',
    'KKKKKK..',
    'KKKKKK..',
    '.KKKKKK.',
    '..KKKKKK',
    '..KKKKKK',
    '...KKKKK',
    '....KKK.',
  ],

  // ── Clics ────────────────────────────────────────────────────

  finger: [
    '...KK...',
    '..KKKK..',
    '..KKKK..',
    '..KKKK..',
    '.KKKKKK.',
    'KKKKKKKK',
    'KKKKKKKK',
    '.KKKKKK.',
  ],

  pointup: [
    '...KK...',
    '..KKKK..',
    '..KKKK..',
    '..KKKK..',
    '.KKKKKK.',
    'KKKKKKKK',
    'KKKKKKKK',
    '.KKKKKK.',
  ],

  mouse: [
    '.XXXXXX.',
    'X.WWWW.X',
    'XwXWWWWX',
    'X.WWWW.X',
    'X.WWWW.X',
    'X......X',
    '.XXXXXX.',
    '..XXXX..',
  ],

  muscle: [
    '...KKKK.',
    '..KKKKK.',
    '.KKKKKKK',
    'KKKKKKK.',
    '.KKKKKK.',
    '..KKKKK.',
    '...KKKK.',
    '........',
  ],

  pill: [
    '........',
    '.RRRWWW.',
    'RRRRWWWW',
    'RRRRWWWW',
    '.RRRWWW.',
    '........',
    '........',
    '........',
  ],

  hospital: [
    '.XXXXXX.',
    'X......X',
    'X..RR..X',
    '.RRRRRR.',
    'X..RR..X',
    'X......X',
    '.XXXXXX.',
    '........',
  ],

  lightning: [
    '..YYY...',
    '.YYYY...',
    'YYYYYYY.',
    '...YYYY.',
    '..YYYYY.',
    '..YYYY..',
    '..YYY...',
    '...Y....',
  ],

  // ── Améliorations ────────────────────────────────────────────

  cart: [
    'X.......',
    'X.......',
    '.XXXXXXX',
    '.X.....X',
    '.XXXXXXX',
    '........',
    '..w...w.',
    '........',
  ],

  bag: [
    '..ww.ww.',
    '.OOOOOO.',
    'OOOOOOOO',
    'OOOOOOOO',
    'OOOOOOOO',
    'OOOOOOOO',
    '.OOOOOO.',
    '........',
  ],

  dizzy: [
    '.KKKKKK.',
    'KK....KK',
    'KX.XX.XK',
    'K......K',
    'K.XXXX.K',
    'K......K',
    'KK....KK',
    '.KKKKKK.',
  ],

  trophy: [
    'YYYYYYYY',
    'YYYYYYYY',
    '.YYYYYY.',
    '..YYYY..',
    '...YY...',
    '..YYYY..',
    '.YYYYYY.',
    'YYYYYYYY',
  ],

  arrows: [
    '...Y.Y..',
    '..YY.YY.',
    '.YYYYYYY',
    '..YY.YY.',
    '...Y.Y..',
    '........',
    '........',
    '........',
  ],

  sleeping: [
    '.KKKKKK.',
    'KK....KK',
    'Kn....nK',
    'K......K',
    'K..nn..K',
    'K......K',
    '.KKKKKK.',
    '....nnn.',
  ],

  // ── Passif ───────────────────────────────────────────────────

  earth: [
    '.BBBBBB.',
    'BGGBBBBB',
    'BGGGGBBB',
    'BBGGGBBB',
    'BBBGGBBB',
    'BBBBGBBB',
    '.BBBBBB.',
    '........',
  ],

  factory: [
    '..X..X..',
    '..X..X..',
    'XXXXXXXX',
    'X......X',
    'X.XX.X.X',
    'X......X',
    'XXXXXXXX',
    '........',
  ],

  wave: [
    '........',
    '.BB.BB..',
    'BBBBBBB.',
    '.BBBBBBB',
    '..BBBBBB',
    '...BBBBB',
    '....BBB.',
    '........',
  ],

  // ── Prestige ─────────────────────────────────────────────────

  recycle: [
    '...YY...',
    '..YYYY..',
    '.YYYYYY.',
    'YY....YY',
    'YY....YY',
    '.YYYYYY.',
    '..YYYY..',
    '...YY...',
  ],

  cycle: [
    '.YYYYYY.',
    'YY....YY',
    'Y......Y',
    'Y...YYYY',
    'YYYY....',
    'Y......Y',
    'YY....YY',
    '.YYYYYY.',
  ],

  mountain: [
    '...WW...',
    '..WWWW..',
    '.WwXXWW.',
    '.XXXXXX.',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    '........',
  ],

  // ── Événements ───────────────────────────────────────────────

  dice: [
    'XXXXXXXX',
    'XW....WX',
    'X......X',
    'X...W..X',
    'X......X',
    'XW....WX',
    'X......X',
    'XXXXXXXX',
  ],

  target: [
    '..RRRR..',
    '.R....R.',
    'R.RRRR.R',
    'R.R..R.R',
    'R.R..R.R',
    'R.RRRR.R',
    '.R....R.',
    '..RRRR..',
  ],

  star: [
    '...Y....',
    '..YYY...',
    'YYYYYYY.',
    '.YYYYY..',
    'Y.YYY.Y.',
    '.Y...Y..',
    'Y.....Y.',
    '........',
  ],

  glowstar: [
    '...Y....',
    '..YYY...',
    '.YYYYY..',
    'YYYYYYY.',
    '.YYYYY..',
    '..YYY...',
    '...Y....',
    '........',
  ],

  // ── Skins ────────────────────────────────────────────────────

  palette: [
    '.XXXXXX.',
    'XR.G.B.X',
    'X.Y.O.PX',
    'XR.W.B.X',
    'X.Y...PX',
    'XR....BX',
    'XX....XX',
    '.XXXXXX.',
  ],

  crown: [
    'Y..Y..Y.',
    'YYYYYYYY',
    'YYYYYYYY',
    'YYYYYYYY',
    '.YYYYYY.',
    '........',
    '........',
    '........',
  ],

  // ── Secrets ──────────────────────────────────────────────────

  billiard: [
    '.XXXXXX.',
    'XX....XX',
    'X......X',
    'X.WWWW.X',
    'X.WXW..X',
    'X.WWWW.X',
    'XX....XX',
    '.XXXXXX.',
  ],

  smirk: [
    '.KKKKKK.',
    'KK....KK',
    'K.n..n.K',
    'K......K',
    'K...nnn.',
    'K...nnn.',
    'KK....KK',
    '.KKKKKK.',
  ],

  laptop: [
    'XXXXXXXX',
    'X.BBBB.X',
    'X.BBBB.X',
    'X.BBBB.X',
    'XXXXXXXX',
    '.XXXXXX.',
    'XXXXXXXX',
    '........',
  ],

  crystal: [
    '.PPPPPP.',
    'PPWWWPPP',
    'PPWWPPPP',
    'PPPPPPPP',
    '.PPPPPP.',
    '..PPPP..',
    '...PP...',
    '..PPPP..',
  ],

  moon: [
    '.YYYYY..',
    'YYYYYY..',
    'YYYY....',
    'YYY.....',
    'YYY.....',
    'YYYY....',
    'YYYYYY..',
    '.YYYYY..',
  ],

  wind: [
    '........',
    'BBBBBB..',
    '........',
    '.BBBBB..',
    '........',
    '..BBBB..',
    '........',
    '........',
  ],

  whale: [
    '........',
    '.BBBBBB.',
    'BBBBBBB.',
    'BWBBBBBB',
    'BBBBBBB.',
    '.BBBBB..',
    '..B.B...',
    '........',
  ],

  moneyflight: [
    '..YYYY..',
    '.YYYYYY.',
    'YYYYYYYY',
    'YYYYYYYY',
    'YYYYYYYY',
    '.YY.YYY.',
    'Y.....Y.',
    '........',
  ],

  castle: [
    '..X.X...',
    '.XXXXXX.',
    '..X.X...',
    '.XXXXXX.',
    'XXXXXXXX',
    'X......X',
    'X..XX..X',
    'XXXXXXXX',
  ],

  question: [
    '.RRRRR..',
    'R.....R.',
    '.....RR.',
    '....RR..',
    '...RR...',
    '........',
    '...RR...',
    '........',
  ],

  vortex: [
    '..PPPP..',
    '.Pp..pP.',
    'Pp.PP.pP',
    'P.P..P.P',
    'Pp.PP.pP',
    '.Pp..pP.',
    '..PPPP..',
    '........',
  ],

  // ── Nouveaux ─────────────────────────────────────────────────

  monkey: [
    '.oooooo.',
    'ooo..ooo',
    'o.X..X.o',
    'o......o',
    'o.oooo.o',
    'oo....oo',
    '.oooooo.',
    '........',
  ],

  tree: [
    'G.....G.',
    '.G...G..',
    'GG.G.GG.',
    '.GGGGG..',
    '..GnG...',
    '...nn...',
    '..nXXn..',
    '........',
  ],

  trash: [
    '..xxxx..',
    'xxxxxxxx',
    '.x.xx.x.',
    '.x.xx.x.',
    '.x.xx.x.',
    '.xxxxxx.',
    '........',
    '........',
  ],

  skull: [
    '.XXXXXX.',
    'XXXXXXXX',
    'XWWXXWWX',
    'XWWXXWWX',
    'XXXXXXXX',
    'X.X..X.X',
    '.XX..XX.',
    '........',
  ],

  book: [
    '.XXXXXXX',
    '.XYYYWWX',
    '.XYYYWWX',
    '.XXXXXXX',
    '.XYYYWWX',
    '.XYYYWWX',
    '.XXXXXXX',
    '........',
  ],

  rain: [
    '.WWWWWW.',
    'WWWWWWWW',
    '.WWWWWW.',
    'B..B..B.',
    '.B..B..B',
    'B..B..B.',
    '........',
    '........',
  ],

  // ── Stats ────────────────────────────────────────────────────

  timer: [
    '..XXXX..',
    '.XXXXXX.',
    'XX....XX',
    'X...X..X',
    'X...XX.X',
    'X......X',
    'XX....XX',
    '.XXXXXX.',
  ],

  chart: [
    '.......Y',
    '......YY',
    '....YYYY',
    '...YYY..',
    '..YY....',
    '.YY.....',
    'YY......',
    'XXXXXXXX',
  ],

  lock: [
    '..XXXX..',
    '.X....X.',
    '.X....X.',
    'XXXXXXXX',
    'XXXXXXXX',
    'XX.WW.XX',
    'XXXXXXXX',
    '........',
  ],
}
