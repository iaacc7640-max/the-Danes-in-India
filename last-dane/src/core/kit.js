// Paper Atlas 16:9 (last-dane): the COMPONENT ZOO. History told with paper cut-outs on aged parchment: every shape is cut paper
// (light edge + soft drop shadow), maps are stylized, routes are crimson, dates ride on gold ribbons.
import { ctx, W, H, TAU, lerp, clamp, rnd, rr, circle, ell, line, eo } from './lib.js';

export * from './motion.js';
export const P = {
  parch: '#E9DCBC', parchDark: '#D6C39B', ink: '#3E2C1E', sepia: '#8A6A48', crimson: '#A8322D', gold: '#C8952F',
  sea: '#9DB4B0', seaDark: '#86A09B', land: '#DCC9A0', forest: '#7E8B5A', skin: '#E3B98F', edge: '#F7EFDC',
  royal: '#3D5A80', green: '#4F6D4A', wine: '#7A2E3A', stone: '#B9A98C', stoneDark: '#9C8C70', sky: '#E7D7AE',
};
const SERIF = 'Caladea';

// ═════════════════════════ CUT PAPER ═════════════════════════
/** draw a path as a piece of cut paper: soft shadow, light paper edge, then the fill. path() builds the path. */
export function cut(path, fill, { shadow = 1, edge = 6 } = {}) {
  ctx.save();
  if (shadow) { ctx.shadowColor = 'rgba(70,45,20,0.35)'; ctx.shadowBlur = 14 * shadow; ctx.shadowOffsetX = 6 * shadow; ctx.shadowOffsetY = 9 * shadow; path(); ctx.fillStyle = fill; ctx.fill(); }
  ctx.restore();
  if (edge) { path(); ctx.strokeStyle = P.edge; ctx.lineWidth = edge; ctx.lineJoin = 'round'; ctx.stroke(); }
  path(); ctx.fillStyle = fill; ctx.fill();
}
export const P_rr = (x, y, w, h, r) => () => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
export const P_circ = (x, y, r) => () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); };
export const P_poly = (pts) => () => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };

/** aged parchment page: base, blotches, fibres, darker edges */
export function parchment(seed = 0) {
  ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600);
  for (let i = 0; i < 14; i++) { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); ctx.save(); ctx.translate(rnd(i + seed) * W, rnd(i + 30 + seed) * H); ctx.scale(160 + rnd(i + 5) * 260, 120 + rnd(i + 9) * 200); g.addColorStop(0, 'rgba(160,120,70,0.13)'); g.addColorStop(1, 'rgba(160,120,70,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = 'rgba(120,90,50,0.08)'; ctx.lineWidth = 2; for (let i = 0; i < 160; i++) { const x = rnd(i * 2 + seed) * W, y = rnd(i * 3 + seed) * H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30 + rnd(i) * 60, y + (rnd(i + 1) - 0.5) * 10); ctx.stroke(); }
  const g = ctx.createRadialGradient(W / 2, H / 2, 560, W / 2, H / 2, 1150); g.addColorStop(0, 'rgba(90,60,30,0)'); g.addColorStop(1, 'rgba(90,60,30,0.38)'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
}

// ═════════════════════════ MAPS ═════════════════════════
/** an invented coastline polygon around (cx, cy) */
export function landPts(cx, cy, rx, ry, seed, n = 90) { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, k = 1 + 0.18 * Math.sin(3 * a + seed) + 0.1 * Math.sin(7 * a + seed * 2) + 0.05 * Math.sin(13 * a + seed * 3); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); } return pts; }
/** a sea-and-land map page. o = { highlight: index of land to fill crimson-edged gold (0..2), route: 0..1, labels } */
export function map(o = {}) {
  parchment(o.seed || 3);
  ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = P.sea; ctx.fillRect(60, 160, 960, 1300); ctx.restore();
  ctx.strokeStyle = 'rgba(62,44,30,0.18)'; ctx.lineWidth = 2; for (let x = 60; x <= 1020; x += 120) { ctx.beginPath(); ctx.moveTo(x, 160); ctx.lineTo(x, 1460); ctx.stroke(); } for (let y = 160; y <= 1460; y += 130) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(1020, y); ctx.stroke(); }
  const lands = [landPts(330, 520, 260, 300, 1.3), landPts(770, 1090, 230, 260, 4.1), landPts(820, 400, 120, 110, 2.2)];
  lands.forEach((pts, i) => cut(P_poly(pts), i === o.highlight ? P.gold : P.land, { shadow: 0.8, edge: 5 }));
  if (o.highlight != null) { P_poly(lands[o.highlight])(); ctx.strokeStyle = P.crimson; ctx.lineWidth = 8; ctx.stroke(); }
  ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.strokeRect(60, 160, 960, 1300);
  compass(900, 1340, 0.55);
  const route = [[420, 640], [560, 820], [640, 960], [720, 1040]];
  if (o.route) dashedRoute(route, o.route);
  const L = o.labels || [['OLD PORT', 420, 640], ['NEW HARBOR', 720, 1040]];
  L.forEach(([t, x, y]) => { circle(x, y, 12, P.ink); label(t, x, y - 40, 34); });
  return { route };
}
/** crimson dashed route through pts; p 0..1 draws it on; returns the head point [x, y, angle] */
export function dashedRoute(pts, p = 1) {
  const seglen = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seglen.push(l); tot += l; }
  let left = tot * clamp(p); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let head = [...pts[0], 0];
  for (let i = 1; i < pts.length && left > 0; i++) { const k = Math.min(1, left / seglen[i - 1]); const x = lerp(pts[i - 1][0], pts[i][0], k), y = lerp(pts[i - 1][1], pts[i][1], k); ctx.lineTo(x, y); head = [x, y, Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])]; left -= seglen[i - 1]; }
  ctx.setLineDash([22, 16]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke(); ctx.setLineDash([]);
  return head;
}
export function compass(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); circle(0, 0, 110, 'rgba(233,220,188,0.9)'); ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.stroke(); for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(i * Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -100); ctx.lineTo(18, 0); ctx.lineTo(-18, 0); ctx.closePath(); ctx.fillStyle = i ? P.ink : P.crimson; ctx.fill(); ctx.restore(); } ctx.font = `700 40px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText('N', 0, -120); ctx.restore(); }
/** ink map label (small caps serif) */
export function label(text, x, y, size = 36, color = P.ink, align = 'center') { ctx.font = `700 ${size}px ${SERIF}`; ctx.letterSpacing = '4px'; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(text, x, y); ctx.letterSpacing = '0px'; }

// ═════════════════════════ PEOPLE: paper cut-outs ═════════════════════════
/** a paper figure standing on (x, y). o = { h (default 640), dir, role: 'king'|'queen'|'sailor'|'scholar'|'guard'|'merchant'|'worker', walk, arm (deg raise of front arm) } */
export function figure(o) {
  const h = o.h || 640, d = o.dir || 1, s = h / 640, wk = o.walk != null ? Math.sin(o.walk) : 0;
  const R = { king: [P.wine, P.gold], queen: [P.royal, P.gold], sailor: [P.royal, P.ink], scholar: [P.green, P.ink], guard: [P.sepia, P.stoneDark], merchant: [P.wine, P.ink], worker: [P.sepia, P.ink] }[o.role || 'merchant'];
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s * d, s);
  const robe = o.role === 'king' || o.role === 'queen' || o.role === 'scholar';
  // legs
  if (!robe) for (const k of [-1, 1]) cut(P_poly([[k * 22 - 18, -250], [k * 22 + 18, -250], [k * 22 + 16 + k * wk * 30, 0], [k * 22 - 16 + k * wk * 30, 0]]), P.ink, { shadow: 0.6, edge: 4 });
  // back arm
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(-30, -440); ctx.rotate(rad(10 - wk * 18)); ctx.roundRect(-20, 0, 40, 220, 20); ctx.restore(); }, R[0], { shadow: 0.5, edge: 4 });
  // body
  if (robe) cut(P_poly([[-70, -470], [70, -470], [120, 0], [-120, 0]]), R[0]);
  else cut(P_rr(-75, -470, 150, 240, 40), R[0]);
  rr(-75, -260, 150, 22, 6); ctx.fillStyle = R[1]; ctx.fill();                               // belt / trim
  // head
  cut(P_circ(0, -540, 66), P.skin);
  hat(o.role || 'merchant');
  // front arm (raise with o.arm)
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(30, -440); ctx.rotate(rad(-(o.arm || 0) - 10 + wk * 18)); ctx.roundRect(-20, 0, 40, 220, 20); ctx.restore(); }, R[0], { shadow: 0.5, edge: 4 });
  ctx.restore();
}
const rad = (dd) => dd * Math.PI / 180;
function hat(role) {
  if (role === 'king' || role === 'queen') cut(P_poly([[-60, -585], [-70, -665], [-35, -620], [0, -680], [35, -620], [70, -665], [60, -585]]), P.gold, { shadow: 0.5, edge: 4 });
  if (role === 'sailor') cut(P_poly([[-95, -590], [0, -660], [95, -590], [0, -605]]), P.ink, { shadow: 0.5, edge: 4 });
  if (role === 'guard') cut(() => { ctx.beginPath(); ctx.arc(0, -560, 76, Math.PI, TAU); ctx.lineTo(90, -555); ctx.lineTo(-90, -555); ctx.closePath(); }, P.stoneDark, { shadow: 0.5, edge: 4 });
  if (role === 'merchant') { cut(P_rr(-48, -680, 96, 90, 8), P.ink, { shadow: 0.5, edge: 4 }); cut(P_rr(-82, -598, 164, 18, 9), P.ink, { shadow: 0, edge: 4 }); }
  if (role === 'scholar') cut(P_rr(-70, -625, 140, 40, 12), P.ink, { shadow: 0.5, edge: 4 });
  if (role === 'worker') cut(() => { ctx.beginPath(); ctx.arc(0, -575, 70, Math.PI, TAU); ctx.closePath(); }, P.sepia, { shadow: 0.5, edge: 4 });
}

// ═════════════════════════ PLACES ═════════════════════════
/** stone hall with arches, crimson banners and a throne */
export function hall() {
  parchment(7); const fl = 1380;
  cut(P_rr(-40, 200, 1160, fl - 160, 0), P.stone, { shadow: 0, edge: 0 });
  for (const x of [120, 540, 960]) cut(() => { ctx.beginPath(); ctx.moveTo(x - 150, fl); ctx.lineTo(x - 150, 620); ctx.arc(x, 620, 150, Math.PI, TAU); ctx.lineTo(x + 150, fl); ctx.closePath(); }, P.stoneDark, { shadow: 0, edge: 0 });
  for (const x of [330, 750]) cut(P_poly([[x - 70, 260], [x + 70, 260], [x + 70, 820], [x, 760], [x - 70, 820]]), P.crimson);
  cut(P_rr(-40, fl, 1160, 600, 0), P.sepia, { shadow: 0, edge: 0 }); cut(P_rr(330, fl, 420, 600, 0), P.wine, { shadow: 0, edge: 0 });
  cut(P_rr(440, 900, 200, 420, 20), P.wine); cut(P_rr(420, 1180, 240, 60, 14), P.gold); cut(P_poly([[470, 900], [540, 820], [610, 900]]), P.gold);
}
/** harbor: layered paper waves, a ship, a pier */
export function harbor(t = 0, shipX = 600) {
  parchment(11); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 1300);
  cut(P_circ(820, 420, 90), '#EFC66A', { shadow: 0.4, edge: 5 });
  for (let i = 0; i < 4; i++) { const y = 1000 + i * 150; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.012 + t * 1.5 + i) * 24); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.7, edge: 5 }); if (i === 1) ship(shipX, 1080 + Math.sin(t * 2) * 10, 1, Math.sin(t * 1.6) * 0.04); }
  cut(P_rr(-40, 1250, 300, 40, 6), P.sepia); for (const x of [0, 120, 230]) cut(P_rr(x, 1250, 26, 300, 4), P.sepia);
}
export function ship(x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  cut(P_poly([[-260, -60], [260, -60], [200, 50], [-200, 50]]), P.sepia);
  cut(P_rr(-10, -480, 20, 430, 6), P.ink, { shadow: 0.5, edge: 3 });
  cut(P_poly([[-200, -420], [180, -420], [150, -110], [-170, -110]]), P.edge);
  companyMini(10, -520, 150);                                                        // the company's swallow-tailed flag
  ctx.restore();
}

// ═════════════════════════ GRAPHICS ═════════════════════════
/** gold date ribbon. sc = pop scale */
export function ribbon(text, x, y, sc = 1, size = 110) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `700 ${size}px ${SERIF}`;
  const w = ctx.measureText(text).width + size * 1.2, h = size * 1.35;
  for (const s of [-1, 1]) cut(P_poly([[s * w / 2, -h / 2 + 30], [s * (w / 2 + 110), -h / 2 + 30], [s * (w / 2 + 70), 30], [s * (w / 2 + 110), h / 2 + 30], [s * w / 2, h / 2 + 30]]), '#A87A22', { shadow: 0.6, edge: 4 });
  cut(P_rr(-w / 2, -h / 2, w, h, 6), P.gold); ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6);
  ctx.restore();
}
/** red wax seal with an initial */
export function seal(x, y, s = 1, letter = 'R') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, r = 90 + Math.sin(a * 9) * 7; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); }, P.crimson, { shadow: 0.7, edge: 0 }); ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.strokeStyle = '#7E2420'; ctx.lineWidth = 6; ctx.stroke(); ctx.font = `700 80px ${SERIF}`; ctx.fillStyle = '#7E2420'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letter, 0, 6); ctx.restore(); }
/** horizontal timeline with years; p 0..1 moves the marker; active = index of the highlighted year */
export function timeline(years, x, y, w, p = 0, active = -1) {
  line([[x, y], [x + w, y]], P.ink, 8);
  years.forEach((yr, i) => { const tx = x + w * i / (years.length - 1); circle(tx, y, i === active ? 22 : 14, i === active ? P.crimson : P.ink); label(String(yr), tx, y + 60, 40, i === active ? P.crimson : P.ink); });
  const mx = x + w * clamp(p); cut(P_poly([[mx, y - 26], [mx - 26, y - 70], [mx + 26, y - 70]]), P.crimson, { shadow: 0.5, edge: 4 });
}
/** a pinned paper slip with a few words (for names, places, numbers) */
export function slip(text, x, y, sc = 1, rot = -0.03, size = 54) { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.font = `700 ${size}px ${SERIF}`; const w = ctx.measureText(text).width + 70; cut(P_rr(-w / 2, -size * 0.8, w, size * 1.6, 4), P.edge); ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); circle(0, -size * 0.8 + 6, 10, P.crimson); ctx.restore(); }

// ═════════════════════════ CAPTION LOOK ═════════════════════════
export const CAPLOOK = { font: `700 68px ${SERIF}`, y: 935, maxW: 1500, fg: P.ink, hi: P.crimson, half: 54 };
/** caption on a torn paper strip */
export function captionStrip(words, x, y, sc = 1, look = CAPLOOK) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = look.font; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const sp = 20, hh = look.half || 70, ws = words.map((w) => ctx.measureText(w.txt).width), tw = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1), hw = tw / 2 + 50;
  const fit = Math.min(1, (look.maxW || 960) / (tw + 100)); ctx.scale(fit, fit);
  cut(() => { ctx.beginPath(); ctx.moveTo(-hw, -hh); for (let x = -hw; x <= hw; x += 24) ctx.lineTo(x, -hh + (rnd(x) - 0.5) * 12); for (let x = hw; x >= -hw; x -= 24) ctx.lineTo(x, hh + (rnd(x + 7) - 0.5) * 12); ctx.closePath(); }, '#F3E9D2', { shadow: 0.8, edge: 0 });
  let cx = -tw / 2; words.forEach((w, i) => { ctx.fillStyle = w.hi ? look.hi : look.fg; ctx.fillText(w.txt, cx, 6); cx += ws[i] + sp; });
  ctx.restore();
}

// ═════════════════════════ 16:9 HISTORY MODULES (last-dane) ═════════════════════════
const W2 = W / 2;
const eobk = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

// ── real maps: data/geo.json (Natural Earth coastlines, public domain), loaded once by main.js ──
export const GEO = { data: null };
export function setGeo(g) { GEO.data = g; }
/** projection for a [lon0, lat0, lon1, lat1] view fitted (cover) into the rect [x, y, w, h]; equirectangular with cos(lat) */
export function projFor(view, rect = [0, 0, W, H]) {
  const [l0, b0, l1, b1] = view, [x, y, w, h] = rect, k = Math.cos(((b0 + b1) / 2) * Math.PI / 180);
  const vw = (l1 - l0) * k, vh = b1 - b0, s = Math.max(w / vw, h / vh), cx = (l0 + l1) / 2, cy = (b0 + b1) / 2;
  const f = (lon, lat) => [x + w / 2 + (lon - cx) * k * s, y + h / 2 - (lat - cy) * s];
  f.scale = s * k; f.k = k; return f;
}
/** a real map page: sea, graticule, cut-paper land. region = 'world' | 'south' | 'sea'; returns the projection.
 *  o = { view: [lon0, lat0, lon1, lat1], land: colour, sea: colour, grid: degrees, seed } */
export function realMap(region, o = {}) {
  const g = GEO.data[region], pr = projFor(o.view || g.box);
  parchment(o.seed || 3);
  ctx.save(); ctx.globalAlpha = o.seaAlpha ?? 0.85; ctx.fillStyle = o.sea || P.sea; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  const gs = o.grid || (region === 'world' ? 20 : region === 'sea' ? 10 : 1);
  ctx.strokeStyle = 'rgba(62,44,30,0.16)'; ctx.lineWidth = 2;
  for (let lon = Math.floor(g.box[0] / gs) * gs; lon <= g.box[2]; lon += gs) { const a = pr(lon, g.box[1]), b = pr(lon, g.box[3]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (let lat = Math.floor(g.box[1] / gs) * gs; lat <= g.box[3]; lat += gs) { const a = pr(g.box[0], lat), b = pr(g.box[2], lat); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (const ring of g.land) cut(() => { ctx.beginPath(); ring.forEach(([lo, la], i) => { const [px, py] = pr(lo, la); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); }, o.land || P.land, { shadow: 0.7, edge: 4 });
  return pr;
}
/** the projected position of a named place in geo.json */
export const place = (pr, name) => pr(...GEO.data.places[name]);
/** a route through [lon, lat] points (or named places), drawn on by p 0..1 with a slight hand wobble; returns the head */
export function geoRoute(pr, pts, p = 1, o = {}) {
  const xy = pts.map((q) => (typeof q === 'string' ? place(pr, q) : pr(q[0], q[1])));
  const dense = []; for (let i = 1; i < xy.length; i++) for (let k = 0; k < 24; k++) { const u = k / 24, [a, b] = [xy[i - 1], xy[i]], wob = Math.sin((i * 24 + k) * 0.7) * (o.wobble ?? 5); const nx = -(b[1] - a[1]), ny = b[0] - a[0], nl = Math.hypot(nx, ny) || 1; dense.push([lerp(a[0], b[0], u) + nx / nl * wob, lerp(a[1], b[1], u) + ny / nl * wob]); }
  dense.push(xy[xy.length - 1]);
  return dashedRoute(dense, p);
}

// ── ink bleed: a colour soaks into a shape from a point, in blotchy waves (p 0..1) ──
export function inkBleed(path, color, p, ox, oy, maxR = 600, seed = 1, alpha = 0.82) {
  if (p <= 0) return; ctx.save(); path(); ctx.clip();
  const R = maxR * eio2(clamp(p));
  ctx.fillStyle = color; ctx.beginPath();
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + rnd(seed + i) * 0.4, rr2 = R * (0.55 + 0.45 * rnd(seed + i * 3)); ctx.moveTo(ox + Math.cos(a) * rr2 * 0.6 + R * 0.3, oy + Math.sin(a) * rr2 * 0.6); ctx.arc(ox + Math.cos(a) * rr2 * 0.6, oy + Math.sin(a) * rr2 * 0.6, R * (0.35 + 0.25 * rnd(seed + i * 7)), 0, TAU); }
  ctx.arc(ox, oy, R * 0.75, 0, TAU); ctx.globalAlpha *= alpha; ctx.fill('nonzero');
  ctx.restore();
}
const eio2 = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// ── era bar (top, y 70): evenly spaced year ticks, a crimson marker at the current year ──
export function eraBar(ticks, year, a = 1, y = 70) {
  if (a <= 0) return; const x0 = 300, x1 = 1620, n = ticks.length, xs = (i) => x0 + (x1 - x0) * i / (n - 1);
  let mx = xs(0); for (let i = 1; i < n; i++) if (year <= ticks[i]) { mx = lerp(xs(i - 1), xs(i), clamp((year - ticks[i - 1]) / (ticks[i] - ticks[i - 1]))); break; } else mx = xs(n - 1);
  ctx.save(); ctx.globalAlpha = a;
  cut(() => { ctx.beginPath(); ctx.moveTo(x0 - 70, y - 30); for (let x = x0 - 70; x <= x1 + 70; x += 30) ctx.lineTo(x, y - 30 + (rnd(x) - 0.5) * 6); for (let x = x1 + 70; x >= x0 - 70; x -= 30) ctx.lineTo(x, y + 34 + (rnd(x + 3) - 0.5) * 6); ctx.closePath(); }, 'rgba(243,233,210,0.94)', { shadow: 0.5, edge: 0 });
  line([[x0, y - 6], [x1, y - 6]], P.ink, 4);
  ticks.forEach((yr, i) => { const on = Math.abs(xs(i) - mx) < 30; circle(xs(i), y - 6, on ? 9 : 6, on ? P.crimson : P.ink); ctx.font = `700 24px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = on ? P.crimson : P.ink; ctx.fillText(String(yr), xs(i), y + 18); });
  cut(P_poly([[mx, y - 10], [mx - 13, y - 34], [mx + 13, y - 34]]), P.crimson, { shadow: 0.4, edge: 3 });
  ctx.restore();
}

// ── beat card: gold year ribbon + a 2-4 word hook slip, 1.2 s over the moving scene (lt = time since the beat began) ──
export function beatCard(year, hook, lt, dur = 1.2, x = 350, y = 200) {
  if (lt < 0 || lt > dur) return;
  const pin = eobk(clamp(lt / 0.22)), out = clamp((lt - (dur - 0.2)) / 0.2), dy = -out * 60, a = 1 - out;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, dy);
  ribbon(year, x, y, pin * 0.52, 110);
  slip(hook, x, y + 98, eobk(clamp((lt - 0.08) / 0.22)), -0.02, 46);
  ctx.restore();
}

// ── stat card: a pinned paper card with a big figure and a small line (p = pop 0..1) ──
export function statCard(big, small, x, y, p = 1, o = {}) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.025); ctx.scale(p, p);
  ctx.font = `700 ${o.size || 84}px ${SERIF}`; const bw = ctx.measureText(big).width; ctx.font = `700 30px ${SERIF}`; const sw = ctx.measureText(small).width;
  const w = Math.max(bw, sw) + 90, h = (o.size || 84) + 110;
  cut(P_rr(-w / 2, -h / 2, w, h, 6), '#F3E9D2', { shadow: 1, edge: 0 });
  ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 3; ctx.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${o.size || 84}px ${SERIF}`; ctx.fillStyle = o.date ? '#9A6E1C' : P.ink; ctx.fillText(big, 0, -18);
  ctx.font = `700 30px ${SERIF}`; ctx.letterSpacing = '2px'; ctx.fillStyle = P.sepia; ctx.fillText(small, 0, h / 2 - 44); ctx.letterSpacing = '0px';
  circle(0, -h / 2 + 4, 11, P.crimson);
  ctx.restore();
}

// ── the Danish flag (Dannebrog): crimson with a bold white Nordic cross, always fluttering ──
/** pole foot at (x, y); cloth w wide; t = film time; wind 0..1.5 */
export const FLAG = { year: 1660 };              // main.js sets the film year each frame (picks the king's monogram)
/** the king's crowned cipher for a year: Christian IV to 1648, Frederick III to 1670, Christian V after */
export const cipherFor = (y) => (y < 1648 ? 'C4' : y < 1670 ? 'F3' : 'C5');
/** a simple rampant paper lion (gold), facing right; size ~ 1 unit = 100 px */
function lion(s, flip = 1) {
  ctx.save(); ctx.scale(s * flip, s); const G = '#E9C46A', D = '#B8892E';
  ctx.fillStyle = G; ctx.strokeStyle = D; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.ellipse(0, 10, 26, 46, -0.35, 0, TAU); ctx.fill(); ctx.stroke();                 // body
  ctx.beginPath(); ctx.arc(14, -42, 24, 0, TAU); ctx.fill(); ctx.stroke();                              // mane
  ctx.beginPath(); ctx.arc(26, -44, 12, 0, TAU); ctx.fill();                                            // muzzle
  for (const [x1, y1, x2, y2] of [[10, -10, 40, -30], [14, 6, 44, 0], [-6, 46, 6, 82], [-20, 40, -30, 80]]) { ctx.lineWidth = 12; ctx.strokeStyle = G; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  ctx.lineWidth = 6; ctx.strokeStyle = G; ctx.beginPath(); ctx.moveTo(-22, 30); ctx.bezierCurveTo(-60, 20, -40, -30, -62, -40); ctx.stroke();      // tail
  ctx.beginPath(); ctx.moveTo(4, -64); ctx.lineTo(10, -78); ctx.lineTo(16, -66); ctx.lineTo(22, -80); ctx.lineTo(28, -64); ctx.closePath(); ctx.fillStyle = G; ctx.fill();   // crown
  ctx.restore();
}
/** the crowned royal cipher between two lions, centred at 0,0, ~ 100 px tall per unit s */
export function royalCipher(s, year = FLAG.year) {
  ctx.save(); ctx.scale(s, s); const G = '#D9A93A';
  ctx.save(); ctx.translate(-40, 8); lion(0.42, 1); ctx.restore(); ctx.save(); ctx.translate(40, 8); lion(0.42, -1); ctx.restore();
  ctx.fillStyle = G; ctx.beginPath(); ctx.moveTo(-18, -24); ctx.lineTo(-22, -46); ctx.lineTo(-9, -35); ctx.lineTo(0, -52); ctx.lineTo(9, -35); ctx.lineTo(22, -46); ctx.lineTo(18, -24); ctx.closePath(); ctx.fill();
  ctx.fillStyle = P.crimson; ctx.fillRect(-16, -31, 32, 6);
  ctx.lineWidth = 3; ctx.strokeStyle = '#8A6420'; ctx.font = `700 34px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeText(cipherFor(year), 0, 6);
  ctx.font = `700 34px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = G; ctx.fillText(cipherFor(year), 0, 6);
  ctx.restore();
}
/** company flag, no pole: a static small version for ships (left edge at x, top at y, width w) */
export function companyMini(x, y, w) {
  const h = w * 0.5235, U = (u) => x + u * w, V = (v) => y + v * h;
  ctx.beginPath(); ctx.moveTo(U(0), V(0)); ctx.lineTo(U(1), V(0)); ctx.lineTo(U(0.579), V(0.428)); ctx.lineTo(U(0.579), V(0.571)); ctx.lineTo(U(1), V(1)); ctx.lineTo(U(0), V(1)); ctx.closePath(); ctx.fillStyle = P.crimson; ctx.fill();
  ctx.fillStyle = '#FBF6EA'; ctx.fillRect(U(0.224), V(0), 0.075 * w, h); ctx.fillRect(U(0), V(0.428), 0.579 * w, 0.143 * h); ctx.fillRect(U(0.112), V(0.214), 0.299 * w, 0.571 * h);
  circle(U(0.2615), V(0.5), 0.06 * w, '#D9A93A');
}
/** The flag on a pole, always fluttering. Default: the Danish East India Company's swallow-tailed flag (crimson, white
 *  cross, a white square with the crowned royal cipher between lions). o.national = the plain Dannebrog. */
export function danishFlag(x, y, w, t, o = {}) {
  const company = !o.national, h = company ? w * 0.5235 : w * 28 / 37, pole = o.pole ?? w * 1.6, top = y - pole, wind = o.wind ?? 1;
  ctx.save();
  cut(P_rr(x - 7, top - 8, 14, pole + 8, 4), P.ink, { shadow: 0.6, edge: 3 });
  circle(x, top - 10, 12, P.gold);
  const at = (u, v) => { const ph = u * 5.2 - t * 6.5 * wind, amp = h * 0.10 * wind * u; return [x + 7 + u * w * (1 - 0.04 * wind * Math.abs(Math.sin(ph))), top + v * h + Math.sin(ph) * amp + u * h * 0.06]; };
  const poly = (pts) => { ctx.beginPath(); let first = true; for (let i = 0; i < pts.length; i++) { const [u0, v0] = pts[i], [u1, v1] = pts[(i + 1) % pts.length]; for (let k = 0; k < 12; k++) { const q = at(lerp(u0, u1, k / 12), lerp(v0, v1, k / 12)); first ? ctx.moveTo(q[0], q[1]) : ctx.lineTo(q[0], q[1]); first = false; } } ctx.closePath(); };
  const rect = (u0, v0, u1, v1) => poly([[u0, v0], [u1, v0], [u1, v1], [u0, v1]]);
  const outline = company ? [[0, 0], [1, 0], [0.579, 0.428], [0.579, 0.571], [1, 1], [0, 1]] : [[0, 0], [1, 0], [1, 1], [0, 1]];
  ctx.shadowColor = 'rgba(40,25,10,0.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 8;
  poly(outline); ctx.fillStyle = P.crimson; ctx.fill(); ctx.shadowColor = 'transparent';
  const WH = '#FBF6EA'; ctx.fillStyle = WH;
  if (company) { rect(0.224, 0, 0.299, 1); ctx.fill(); rect(0, 0.428, 0.579, 0.571); ctx.fill(); rect(0.112, 0.214, 0.411, 0.785); ctx.fill();
    if (w > 90) { const c = at(0.2615, 0.5), c2 = at(0.30, 0.5); ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(Math.atan2(c2[1] - c[1], c2[0] - c[0]) * 0.8); royalCipher(w * 0.0021); ctx.restore(); } }
  else { rect(0, 12 / 28, 1, 16 / 28); ctx.fill(); rect(12 / 37, 0, 16 / 37, 1); ctx.fill(); }
  // folds: a horizontal gradient of light and shade following the wave
  const x0 = x + 7, gr = ctx.createLinearGradient(x0, 0, x0 + w, 0);
  for (let i = 0; i <= 16; i++) { const u = i / 16, sh = Math.cos(u * 5.2 - t * 6.5 * wind) * Math.min(1, u * 4); gr.addColorStop(u, sh > 0 ? `rgba(255,240,220,${0.14 * sh})` : `rgba(30,10,5,${-0.2 * sh})`); }
  poly(outline); ctx.fillStyle = gr; ctx.fill();
  ctx.restore();
}

// ── a lantern with a warm flickering glow ──
export function lantern(x, y, s, t, glow = 1) {
  const f = 0.88 + 0.07 * Math.sin(t * 13) + 0.05 * Math.sin(t * 31);
  if (glow > 0) { const g = ctx.createRadialGradient(x, y, 0, x, y, 260 * s * f); g.addColorStop(0, `rgba(255,205,110,${0.55 * glow * f})`); g.addColorStop(1, 'rgba(255,205,110,0)'); ctx.fillStyle = g; ctx.fillRect(x - 300 * s, y - 300 * s, 600 * s, 600 * s); }
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -78, 18, Math.PI, TAU); ctx.stroke();
  cut(P_rr(-34, -62, 68, 14, 4), P.ink, { shadow: 0.5, edge: 3 });
  cut(P_rr(-28, -48, 56, 84, 8), `rgba(250,${200 + 20 * f | 0},110,1)`, { shadow: 0.5, edge: 3 });
  ell(0, 0, 10 * f, 18 * f, '#FFF2C4');
  for (const dx of [-28, 28]) { ctx.fillStyle = P.ink; ctx.fillRect(dx - 3, -48, 6, 84); }
  cut(P_rr(-36, 36, 72, 14, 4), P.ink, { shadow: 0.5, edge: 3 });
  ctx.restore();
}

// ═════════════════════════ CAST (last-dane): original cut-paper people, caricature by costume + props ═════════════════════════
// person({ x, y (feet), h (default 520), dir (1 right / -1 left), who, t (idle clock), arm (front arm raise, deg), arm2 (back arm),
//          walk (phase, radians), look ('' | 'down' | 'up'), mood ('' | 'sneer' | 'worried' | 'stern'), prop override, a (alpha) })
const SK = { light: '#E3B98F', mid: '#C99467', deep: '#9C6B45', shade: 'rgba(60,35,15,0.18)' };
export const CAST = {
  kongsYoung: { coat: '#8A6A48', trim: '#6E5238', legs: P.ink, skin: SK.light, hat: 'cap', hair: '#6B4A2E', label: 'KONGSBAKKE 1639' },
  kongsOld: { coat: '#5E6B4E', trim: P.gold, legs: '#4A3A2E', skin: '#D8A577', hat: 'none', hair: '#4A3A2E', beard: 'stubble', rolled: 1, patch: 1, prop: 'lantern', label: 'KONGSBAKKE 1660s' },
  korsor: { coat: P.royal, trim: P.gold, legs: P.ink, skin: SK.light, hat: 'tricorn', hair: '#C9C2B5', label: 'GOV. KORSØR' },
  soldier: { coat: '#8E3A33', trim: '#E9DCBC', legs: '#4A3A2E', skin: SK.light, hat: 'morion', hair: '#6B4A2E', prop: 'pike', label: 'GARRISON' },
  nayak: { coat: P.forest, trim: P.gold, legs: '#F3E9D2', skin: SK.mid, hat: 'crown', robe: 1, sash: P.gold, beard: 'mustache', label: 'VIJAYA RAGHAVA' },
  parasol: { coat: '#F3E9D2', trim: P.forest, legs: '#F3E9D2', skin: SK.deep, hat: 'turban', turban: '#E9DCBC', robe: 1, prop: 'parasol', label: 'PARASOL BEARER' },
  portuguese: { coat: '#F3E9D2', trim: P.royal, legs: '#4A3A2E', skin: SK.light, hat: 'morion', sash: P.royal, prop: 'pike', label: 'PORTUGUESE MERC.' },
  defender: { coat: '#F3E9D2', trim: '#B9A98C', legs: '#F3E9D2', skin: SK.deep, hat: 'turban', turban: '#C9B48A', robe: 1, prop: 'spear', label: 'LOCAL DEFENDER' },
  clerk: { coat: '#5B6470', trim: '#E9DCBC', legs: '#3B3F47', skin: SK.light, hat: 'none', hair: '#C9C2B5', collar: 1, prop: 'quill', label: 'COPENHAGEN CLERK' },
  vanHagen: { coat: '#6E5238', trim: '#D9822B', legs: P.ink, skin: SK.light, hat: 'wide', hair: '#C7A26A', sash: '#D9822B', prop: 'bag', label: 'GEERT VAN HAGEN' },
  eggers: { coat: P.royal, trim: P.gold, legs: '#F3E9D2', skin: SK.light, hat: 'tricorn', hair: '#3E2C1E', boots: 1, mood: 'sneer', label: 'HENRIK EGGERS' },
  officer: { coat: '#4B6A8F', trim: P.gold, legs: '#F3E9D2', skin: SK.light, hat: 'tricorn', hair: '#6B4A2E', boots: 1, mood: 'sneer', label: 'OFFICER' },
  weaver: { coat: '#C8952F', trim: P.crimson, legs: '#E9DCBC', skin: SK.deep, hat: 'none', hair: '#2E2118', robe: 1, sari: 1, label: 'WEAVER' },
  trader: { coat: '#F3E9D2', trim: P.forest, legs: '#F3E9D2', skin: SK.mid, hat: 'turban', turban: P.crimson, robe: 1, prop: 'bale', label: 'TRADER' },
  child: { coat: '#B9A98C', trim: '#8A6A48', legs: '#E9DCBC', skin: SK.mid, hat: 'none', hair: '#2E2118', label: 'CHILD', small: 1 },
  silhouette: { coat: 'rgba(62,44,30,0.55)', trim: 'rgba(62,44,30,0)', legs: 'rgba(62,44,30,0.55)', skin: 'rgba(62,44,30,0.55)', hat: 'none', hair: 'rgba(62,44,30,0.55)', robe: 1, sari: 1, flat: 1, label: 'MAY HAVE (HEDGED)' },
  king: { coat: '#2B2D3A', trim: '#2B2D3A', legs: '#2B2D3A', skin: '#2B2D3A', hat: 'crown', robe: 1, flat: 1, label: 'THE KING (SILHOUETTE)' },
};
const rad2 = (d) => d * Math.PI / 180;
export function person(o) {
  const c = { ...CAST[o.who || 'kongsYoung'], ...(o.over || {}) }, h = o.h || 520, s = h / 640 * (c.small ? 0.72 : 1), d = o.dir || 1, t = o.t || 0, seed = o.seed || 0;
  const br = 1 + 0.013 * Math.sin(t * 2.1 + seed), wk = o.walk != null ? Math.sin(o.walk) : 0, flat = c.flat;
  const E = flat ? 0 : 4, SH = flat ? 0 : 0.6;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(o.x, o.y); ctx.scale(s * d, s);
  // legs / robe hem
  if (!c.robe) for (const k of [-1, 1]) { cut(P_poly([[k * 24 - 19, -255], [k * 24 + 19, -255], [k * 24 + 17 + k * wk * 30, -8], [k * 24 - 17 + k * wk * 30, -8]]), c.legs, { shadow: SH, edge: E }); cut(P_rr(k * 24 - 26 + k * wk * 30, -26, 52 + (c.boots ? 6 : 0), 26, 8), c.boots ? P.ink : '#3E2C1E', { shadow: SH * 0.6, edge: E }); }
  ctx.scale(1, br); ctx.translate(0, -(br - 1) * 0);
  // back arm
  const arm = (side, deg, col) => cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(side * 34, -452); ctx.rotate(rad2(deg)); ctx.roundRect(-21, 0, 42, 225, 21); ctx.restore(); }, col, { shadow: SH * 0.8, edge: E });
  arm(-1, 8 - wk * 16 + (o.arm2 || 0), c.coat);
  // body
  if (c.robe) cut(P_poly([[-72, -478], [72, -478], [c.sari ? 118 : 108, 0], [c.sari ? -118 : -108, 0]]), c.sari ? c.coat : c.legs === '#F3E9D2' ? c.coat : c.coat, { shadow: SH * 1.4, edge: E });
  else cut(P_poly([[-78, -478], [78, -478], [92, -215], [-92, -215]]), c.coat, { shadow: SH * 1.4, edge: E });
  if (!flat) {
    if (c.sari) { cut(P_poly([[-72, -478], [-20, -478], [96, -40], [60, 0]]), c.trim, { shadow: 0.3, edge: 3 }); }
    else { ctx.fillStyle = c.trim; ctx.fillRect(-6, -470, 12, c.robe ? 460 : 250); }                 // button line / placket
    if (c.sash) { ctx.save(); ctx.translate(0, -360); ctx.rotate(-0.5); ctx.fillStyle = c.sash; ctx.fillRect(-110, -14, 220, 28); ctx.restore(); }
    else { ctx.fillStyle = c.trim; ctx.fillRect(c.robe ? -96 : -84, -262, c.robe ? 192 : 168, 18); }    // belt
    if (c.patch) { cut(P_rr(22, -400, 36, 30, 3), '#7E8B5A', { shadow: 0, edge: 2 }); ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.strokeRect(22, -400, 36, 30); ctx.setLineDash([]); }
    if (c.collar) cut(P_poly([[-40, -478], [40, -478], [0, -440]]), '#F3E9D2', { shadow: 0, edge: 2 });
  }
  // head
  const hy = -548 + (o.look === 'down' ? 6 : o.look === 'up' ? -4 : 0);
  ctx.save(); ctx.translate(0, hy); ctx.rotate(o.look === 'down' ? 0.12 : o.look === 'up' ? -0.12 : 0);
  if (!flat) cut(P_rr(-20, 30, 40, 40, 8), c.skin, { shadow: 0, edge: 0 });                      // neck
  cut(P_circ(0, 0, 68), c.skin, { shadow: SH, edge: E });
  if (c.hair && c.hat !== 'turban' && !flat) cut(() => { ctx.beginPath(); ctx.arc(0, -4, 70, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(56, -12); ctx.quadraticCurveTo(0, -46, -56, -12); ctx.closePath(); }, c.hair, { shadow: 0, edge: 0 });
  if (c.beard === 'stubble') { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 66, 0, TAU); ctx.clip(); ctx.globalAlpha *= 0.45; ctx.fillStyle = '#4A3A2E'; ctx.beginPath(); ctx.moveTo(-70, 8); ctx.quadraticCurveTo(0, 30, 70, 8); ctx.lineTo(70, 80); ctx.lineTo(-70, 80); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if (c.beard === 'mustache') { ctx.strokeStyle = '#2E2118'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(34, 22); ctx.quadraticCurveTo(14, 18, 4, 30); ctx.moveTo(34, 22); ctx.quadraticCurveTo(54, 18, 62, 30); ctx.stroke(); }
  if (!flat) {                                                                                   // face: eyes + brows (blink every ~4 s)
    const blink = ((t + seed * 1.7) % 4.1) < 0.12 ? 0.15 : 1, mood = o.mood ?? c.mood ?? '';
    for (const k of [0, 1]) { const ex = 14 + k * 34; ell(ex, -6 + (o.look === 'down' ? 6 : 0), 6, 7 * blink, '#2A1D14');
      ctx.strokeStyle = '#2A1D14'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
      const tilt = mood === 'sneer' ? (k ? -7 : 5) : mood === 'worried' ? (k ? 6 : -6) : mood === 'stern' ? (k ? -6 : 6) : 0;
      ctx.moveTo(ex - 11, -26 - tilt); ctx.lineTo(ex + 11, -26 + tilt); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(62,35,20,0.7)'; ctx.lineWidth = 4; ctx.beginPath();                     // mouth
    if ((o.mood ?? c.mood) === 'sneer') { ctx.moveTo(20, 34); ctx.quadraticCurveTo(38, 28, 52, 22); } else if ((o.mood ?? c.mood) === 'worried') { ctx.moveTo(22, 36); ctx.quadraticCurveTo(34, 30, 48, 36); } else { ctx.moveTo(22, 32); ctx.lineTo(46, 32); }
    ctx.stroke();
  }
  hat2(c);
  ctx.restore();
  // front arm + hand + prop
  const fa = -(o.arm || 0) - 8 + wk * 16;
  ctx.save(); ctx.translate(34, -452); ctx.rotate(rad2(fa));
  cut(P_rr(-21, 0, 42, 225, 21), c.coat, { shadow: SH * 0.8, edge: E });
  if (c.rolled && !flat) { cut(P_rr(-22, 150, 44, 22, 6), '#F3E9D2', { shadow: 0, edge: 2 }); cut(P_rr(-17, 168, 34, 58, 14), c.skin, { shadow: 0, edge: 2 }); }
  cut(P_circ(0, 232, 22), c.skin, { shadow: SH * 0.5, edge: E });
  ctx.translate(0, 236); ctx.rotate(-rad2(fa));
  prop2(o.prop === undefined ? c.prop : o.prop, t, c);
  ctx.restore();
  ctx.restore();
}
function hat2(c) {
  const H2 = { shadow: c.flat ? 0 : 0.5, edge: c.flat ? 0 : 4 };
  if (c.hat === 'cap') cut(() => { ctx.beginPath(); ctx.arc(0, -16, 70, Math.PI, TAU); ctx.lineTo(84, -12); ctx.lineTo(-70, -12); ctx.closePath(); }, '#5E4A3A', H2);
  if (c.hat === 'tricorn') cut(P_poly([[-104, -38], [0, -112], [104, -38], [60, -54], [0, -40], [-60, -54]]), P.ink, H2);
  if (c.hat === 'morion') cut(() => { ctx.beginPath(); ctx.arc(0, -30, 62, Math.PI, TAU); ctx.lineTo(96, -26); ctx.quadraticCurveTo(0, -6, -96, -26); ctx.closePath(); ctx.moveTo(-8, -92); ctx.lineTo(0, -116); ctx.lineTo(8, -92); }, '#9C9A94', H2);
  if (c.hat === 'wide') cut(() => { ctx.beginPath(); ctx.ellipse(0, -40, 112, 22, 0, 0, TAU); ctx.moveTo(52, -50); ctx.roundRect(-52, -104, 104, 64, 14); }, '#3E2C1E', H2);
  if (c.hat === 'turban') cut(() => { ctx.beginPath(); ctx.ellipse(0, -36, 80, 52, 0, Math.PI, TAU); ctx.ellipse(0, -30, 74, 18, 0, 0, Math.PI); }, c.turban || '#E9DCBC', H2);
  if (c.hat === 'crown') cut(P_poly([[-62, -46], [-72, -132], [-36, -90], [0, -150], [36, -90], [72, -132], [62, -46]]), c.flat ? c.coat : P.gold, H2);
}
function prop2(kind, t, c) {
  if (!kind) return;
  if (kind === 'lantern') lantern(0, 70, 0.9, t, 0.7);
  if (kind === 'pike' || kind === 'spear') { cut(P_rr(-6, -520, 12, 700, 4), '#6E5238', { shadow: 0.4, edge: 3 }); cut(P_poly([[0, -600], [16, -520], [-16, -520]]), '#9C9A94', { shadow: 0.4, edge: 3 }); }
  if (kind === 'parasol') { ctx.save(); ctx.rotate(Math.sin(t * 1.3) * 0.04); cut(P_rr(-5, -560, 10, 600, 4), '#6E5238', { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.moveTo(-230, -470); ctx.quadraticCurveTo(0, -660, 230, -470); for (let i = 0; i <= 8; i++) ctx.lineTo(230 - i * 57.5, -470 + (i % 2) * 22); ctx.closePath(); }, P.crimson, { shadow: 0.7, edge: 4 }); for (let i = 0; i < 9; i++) circle(-230 + i * 57.5, -462, 9, P.gold); ctx.restore(); }
  if (kind === 'bag') cut(P_rr(-50, 10, 100, 80, 14), '#8A6A48', { shadow: 0.5, edge: 3 });
  if (kind === 'quill') { ctx.save(); ctx.rotate(-0.6); cut(P_poly([[0, 0], [10, -110], [26, -60]]), '#F3E9D2', { shadow: 0.3, edge: 2 }); ctx.restore(); }
  if (kind === 'ledger') { ctx.save(); ctx.rotate(-0.2); cut(P_rr(-60, -10, 120, 150, 6), P.wine, { shadow: 0.5, edge: 3 }); cut(P_rr(-52, -2, 104, 134, 4), '#F3E9D2', { shadow: 0, edge: 0 }); ctx.restore(); }
  if (kind === 'bale') cut(P_rr(-70, -110, 140, 110, 10), '#C9B48A', { shadow: 0.5, edge: 3 });
  if (kind === 'spyglass') { ctx.save(); ctx.rotate(-1.2); cut(P_rr(-12, -150, 24, 160, 6), '#6E5238', { shadow: 0.4, edge: 3 }); cut(P_rr(-15, -160, 30, 30, 6), P.gold, { shadow: 0, edge: 2 }); ctx.restore(); }
}

// ═════════════════════════ SET PIECES (last-dane) ═════════════════════════
export const NAVY = '#2F3550';
/** night page: parchment under a navy wash, twinkling stars in the top `skyH` px */
export function nightSky(seed = 1, t = 0, skyH = 600, a = 0.86) { parchment(seed); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = NAVY; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); for (let i = 0; i < 46; i++) circle(rnd(i + seed) * W, rnd(i + 40 + seed) * skyH, (2 + rnd(i) * 3) * (0.75 + 0.25 * Math.sin(t * 2 + i)), '#E9DCBC'); }
/** day page: parchment + pale sky above the horizon y */
export function daySky(seed = 1, y = 620, sun = true) { parchment(seed); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, y + 300); if (sun) cut(P_circ(1560, 200, 70), '#EFC66A', { shadow: 0.4, edge: 5 }); }
/** Copenhagen: royal blue at 40% over everything drawn so far = far away and cold */
export function coldWash(a = 1) { ctx.save(); ctx.globalAlpha = 0.4 * a; ctx.fillStyle = P.royal; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
/** layered paper sea from y down; t rolls the surf */
export function sea(y, t, n = 3, cols = [P.sea, P.seaDark]) { for (let i = 0; i < n; i++) { const yy = y + i * 70; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, yy); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, yy + Math.sin(x * 0.011 + t * 1.4 + i * 1.7) * 14); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, cols[i % cols.length], { shadow: 0.6, edge: 4 }); } }
/** a torch: pole + flickering flame + glow */
export function torch(x, y, s, t, seed = 0) {
  const f = 0.85 + 0.1 * Math.sin(t * 11 + seed) + 0.05 * Math.sin(t * 27 + seed * 2);
  const g = ctx.createRadialGradient(x, y - 120 * s, 0, x, y - 120 * s, 150 * s * f); g.addColorStop(0, `rgba(255,190,90,${0.45 * f})`); g.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = g; ctx.fillRect(x - 160 * s, y - 280 * s, 320 * s, 320 * s);
  cut(P_rr(x - 5 * s, y - 110 * s, 10 * s, 110 * s, 3), '#4A3A2E', { shadow: 0.4, edge: 2 });
  ctx.save(); ctx.translate(x, y - 108 * s); ctx.scale(s, s * f);
  cut(() => { ctx.beginPath(); ctx.moveTo(-16, 0); ctx.quadraticCurveTo(-18, -26, Math.sin(t * 7 + seed) * 6, -52); ctx.quadraticCurveTo(18, -26, 16, 0); ctx.closePath(); }, '#E0782E', { shadow: 0, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-8, 0); ctx.quadraticCurveTo(-9, -14, Math.sin(t * 9 + seed) * 3, -30); ctx.quadraticCurveTo(9, -14, 8, 0); ctx.closePath(); }, '#F2C14E', { shadow: 0, edge: 0 });
  ctx.restore();
}
/** a siege banner on a pole: forest green with a gold border (the Nayak), swaying */
export function banner(x, y, s, t, seed = 0, col = P.forest) {
  cut(P_rr(x - 5 * s, y - 260 * s, 10 * s, 260 * s, 3), '#4A3A2E', { shadow: 0.4, edge: 2 });
  ctx.save(); ctx.translate(x + 4 * s, y - 250 * s); ctx.rotate(Math.sin(t * 1.3 + seed) * 0.06); ctx.scale(s, s);
  const w = (k) => Math.sin(t * 2.4 + seed + k) * 6;
  cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(90, w(0)); ctx.lineTo(90, 110 + w(1)); ctx.lineTo(45, 90 + w(1)); ctx.lineTo(0, 110); ctx.closePath(); }, col, { shadow: 0.5, edge: 3 });
  ctx.strokeStyle = P.gold; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(6, 8); ctx.lineTo(84, 8 + w(0)); ctx.lineTo(84, 98 + w(1)); ctx.lineTo(45, 80 + w(1)); ctx.lineTo(6, 98); ctx.closePath(); ctx.stroke();
  circle(45, 46 + w(0) / 2, 13, P.gold);
  ctx.restore();
}
/** a ring of siege banners and torches around (cx, cy); p 0..1 = how much of the ring has appeared */
export function siegeRing(cx, cy, rx, ry, t, p = 1, s = 0.8) {
  const n = 18, list = [];
  for (let i = 0; i < n; i++) { const a = Math.PI * (0.05 + 0.9 * i / (n - 1)); list.push([cx - Math.cos(a) * rx, cy - Math.sin(a) * ry * 0.35, i]); }
  list.sort((a, b) => a[1] - b[1]);
  for (const [x, y, i] of list) { const k = clamp(p * n - i * 0.7); if (k <= 0) continue; const sc = s * (0.75 + 0.25 * (y - cy + ry) / ry) * eobk(k); if (i % 2) banner(x, y, sc, t, i); else torch(x, y, sc * 1.1, t, i); }
}
/** the Nayak's green tide over a map: inkBleed in forest with a darker edge ring */
export function greenTide(path, p, ox, oy, maxR, seed = 5) { inkBleed(path, P.forest, p, ox, oy, maxR, seed); }

/** Fort Dansborg, side view, centre bottom at (x, y). o = { wall: 0..1 (town wall drawn), towers: 0..4, houses: 0..1, flag, lamps: 0..1, cracks: 0..1, night } */
export function fortDansborg(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const stone = o.night ? '#7D6E5C' : P.stone, dark = o.night ? '#625646' : P.stoneDark;
  // town houses behind / around
  if (o.houses) for (let i = 0; i < 12; i++) { const k = clamp(o.houses * 12 - i), hx = -760 + i * 130 + (i > 5 ? 140 : -140), hh = 90 + (i * 37 % 60); if (k <= 0 || Math.abs(hx) < 330) continue; ctx.save(); ctx.translate(hx, 0); ctx.scale(1, eobk(k)); cut(P_rr(-48, -hh, 96, hh, 3), i % 3 ? '#C9B48A' : '#B68A5C', { shadow: 0.4, edge: 3 }); cut(P_poly([[-58, -hh + 2], [0, -hh - 46], [58, -hh + 2]]), i % 2 ? '#8C5A3C' : '#A8503E', { shadow: 0.3, edge: 3 }); ctx.fillStyle = o.night ? `rgba(242,190,90,${0.5 + 0.3 * Math.sin(t * 3 + i)})` : P.ink; ctx.fillRect(-12, -hh + 30, 24, 28); ctx.restore(); }
  // town wall with towers
  if (o.wall) { const ww = 900 * clamp(o.wall); cut(P_rr(-ww, -110, ww * 2, 110, 2), dark, { shadow: 0.7, edge: 4 }); for (let x2 = -ww; x2 < ww - 20; x2 += 60) cut(P_rr(x2 + 8, -138, 34, 30, 2), dark, { shadow: 0.3, edge: 3 }); }
  for (let i = 0; i < 4; i++) { const k = clamp((o.towers || 0) - i); if (k <= 0) continue; const tx = [-860, -560, 560, 860][i]; ctx.save(); ctx.translate(tx, 0); ctx.scale(1, eobk(k)); cut(P_rr(-55, -230, 110, 230, 4), stone, { shadow: 0.7, edge: 4 }); cut(P_poly([[-70, -230], [70, -230], [56, -262], [-56, -262]]), dark, { shadow: 0.4, edge: 3 }); cut(P_rr(-30, -170, 60, 16, 6), P.ink, { shadow: 0, edge: 2 }); ctx.restore(); }
  // the fort: low bastioned block with a gate and a corner bastion
  cut(P_poly([[-330, 0], [-330, -230], [330, -230], [330, 0]]), stone, { shadow: 0.9, edge: 5 });
  cut(P_poly([[-400, 0], [-400, -270], [-250, -270], [-250, 0]]), dark, { shadow: 0.7, edge: 5 });
  cut(P_poly([[250, 0], [250, -270], [400, -270], [400, 0]]), dark, { shadow: 0.7, edge: 5 });
  for (const bx of [-400, 250]) for (let k = 0; k < 3; k++) cut(P_rr(bx + 8 + k * 52, -300, 36, 34, 2), dark, { shadow: 0.3, edge: 3 });
  for (let k = 0; k < 9; k++) cut(P_rr(-240 + k * 56, -258, 34, 30, 2), stone, { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-60, -110); ctx.arc(0, -110, 60, Math.PI, TAU); ctx.lineTo(60, 0); ctx.closePath(); }, '#3E2C1E', { shadow: 0, edge: 4 });
  for (const wx of [-190, 170]) { rr(wx, -170, 30, 44, 12); ctx.fillStyle = o.night ? `rgba(242,190,90,${0.35 + 0.5 * (o.lamps ?? 0.6)})` : P.ink; ctx.fill(); }
  if (o.cracks) { ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.beginPath(); const cp = clamp(o.cracks); [[-300, -230, -120, -40], [120, -230, 290, -60], [-30, -200, 40, -140]].forEach(([a, b, c2, d2], j) => { let px = a, py = b; ctx.moveTo(px, py); const n = 8; for (let i = 1; i <= n * cp; i++) { px = lerp(a, c2, i / n) + (rnd(i + j * 9) - 0.5) * 30; py = lerp(b, d2, i / n); ctx.lineTo(px, py); } }); ctx.stroke(); }
  ctx.restore();
  if (o.flag !== false) danishFlag(x + 320 * s, y - 270 * s, 150 * s, t, { pole: 230 * s, wind: o.wind ?? 1 });
}

/** a ledger page with the writer's marks: p 0..1 how much is written; marks are scribbles and crossed-out words, never real text */
export function ledger(x, y, s, t, p = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot ?? -0.04);
  cut(P_rr(-430, -280, 860, 560, 10), P.wine, { shadow: 1, edge: 4 });
  cut(P_rr(-410, -265, 405, 530, 4), '#F3E9D2', { shadow: 0, edge: 0 }); cut(P_rr(5, -265, 405, 530, 4), '#F1E5CB', { shadow: 0, edge: 0 });
  ctx.strokeStyle = 'rgba(62,44,30,0.12)'; ctx.lineWidth = 2; for (let r = 0; r < 9; r++) for (const px of [-390, 25]) { ctx.beginPath(); ctx.moveTo(px, -200 + r * 52); ctx.lineTo(px + 365, -200 + r * 52); ctx.stroke(); }
  // scribble lines: slow, uneven; every few marks one is crossed out
  const rows = 14, total = rows * 1; let head = null;
  for (let r = 0; r < rows; r++) { const k = clamp(p * total - r); if (k <= 0) break; const px = r < 7 ? -390 : 25, py = -210 + (r % 7) * 52, len = (220 + rnd(r + 3) * 130) * k;
    ctx.strokeStyle = '#2A1D14'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px, py);
    for (let xx = 0; xx <= len; xx += 6) ctx.lineTo(px + xx, py + Math.sin(xx * 0.21 + r) * 7 * (0.6 + rnd(Math.floor(xx / 40) + r * 13)) - (rnd(Math.floor(xx / 25) + r) > 0.8 ? 8 : 0));
    ctx.stroke(); head = [px + len, py];
    if (o.cross !== false && r % 3 === 1 && k > 0.6) { ctx.strokeStyle = '#2A1D14'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(px + 30, py - 10); ctx.lineTo(px + 30 + 120 * clamp((k - 0.6) / 0.3), py + 8); ctx.stroke(); }
  }
  if (o.blot) ell(250, 120, 34, 26, '#2A1D14');
  if (o.hand !== false && head) { ctx.save(); ctx.translate(head[0], head[1]); ctx.rotate(-0.5 + Math.sin(t * 9) * 0.05); cut(P_poly([[0, 0], [14, -150], [34, -90]]), '#F3E9D2', { shadow: 0.4, edge: 2 }); cut(P_rr(-40, -10, 110, 70, 30), '#D8A577', { shadow: 0.6, edge: 3 }); cut(P_rr(60, -6, 220, 70, 20), '#5E6B4E', { shadow: 0.6, edge: 3 }); ctx.restore(); }
  ctx.restore();
}

/** the tribute slip: crown seal + coins; mult 2 stamps a crimson ×2 (no real amount ever shown) */
export function rentSlip(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot ?? 0.03);
  cut(P_rr(-260, -170, 520, 340, 6), '#F3E9D2', { shadow: 1, edge: 0 });
  ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 3; ctx.strokeRect(-240, -150, 480, 300);
  label('TRIBUTE', 0, -105, 44);
  for (let i = 0; i < 5; i++) { cut(P_rr(-200, 70 - i * 18, 110, 22, 11), P.gold, { shadow: 0.3, edge: 2 }); }
  for (let i = 0; i < (o.mult === 2 ? 5 : 0) * clamp(o.p ?? 1); i++) cut(P_rr(-70, 70 - i * 18, 110, 22, 11), P.gold, { shadow: 0.3, edge: 2 });
  ctx.strokeStyle = 'rgba(62,44,30,0.4)'; ctx.lineWidth = 4; for (let r = 0; r < 3; r++) { ctx.beginPath(); ctx.moveTo(40, -40 + r * 40); ctx.lineTo(200, -40 + r * 40); ctx.stroke(); }
  seal(150, 90, 0.5, '♛');
  if (o.mult === 2) stamp('×2', 120, -20, eobk(clamp(o.p ?? 1)), -0.2, 110);
  ctx.restore();
}
/** a crimson rubber stamp (one or two words), pop p */
export function stamp(text, x, y, p = 1, rot = -0.12, size = 72) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1 + (1 - p) * 0.8, 1 + (1 - p) * 0.8); ctx.globalAlpha *= clamp(p * 1.5);
  ctx.font = `700 ${size}px ${SERIF}`; ctx.letterSpacing = '6px'; const w = ctx.measureText(text).width + 50;
  ctx.strokeStyle = P.crimson; ctx.lineWidth = 7; ctx.strokeRect(-w / 2, -size * 0.72, w, size * 1.4);
  ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 4, 4); ctx.letterSpacing = '0px'; ctx.restore();
}
/** tear-off month block: shows month n (1..9); frac 0..1 = the previous page tearing away */
export function monthCounter(x, y, s, n, frac = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-130, -170, 260, 330, 10), '#6E5238', { shadow: 1, edge: 4 });
  const page = (num, dx, dy, rot, a) => { ctx.save(); ctx.translate(dx, dy); ctx.rotate(rot); ctx.globalAlpha *= a; cut(P_rr(-110, -120, 220, 260, 4), '#F3E9D2', { shadow: 0.4, edge: 0 }); ctx.fillStyle = P.crimson; ctx.fillRect(-110, -120, 220, 50); label('MONTH', 0, -95, 30, '#F3E9D2'); ctx.font = `700 150px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(num), 0, 40); ctx.restore(); };
  page(n, 0, 0, 0, 1);
  if (n > 1 && frac < 1) { const k = eo(frac); page(n - 1, k * 260, k * -160, k * 0.9, 1 - k); }
  for (let i = 0; i < 4; i++) cut(P_rr(-90 + i * 56, -184, 14, 34, 6), P.ink, { shadow: 0, edge: 2 });
  ctx.restore();
}
/** Copenhagen desk and a waste bin; p 0..1 = a letter drops into the bin. Draw coldWash() after. */
export function letterBin(x, y, s, t, p = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-520, -40, 760, 50, 6), '#6E5238', { shadow: 0.9, edge: 4 }); cut(P_rr(-490, 10, 40, 300, 4), '#5E4A3A', { shadow: 0.5, edge: 3 }); cut(P_rr(170, 10, 40, 300, 4), '#5E4A3A', { shadow: 0.5, edge: 3 });
  for (let i = 0; i < 4; i++) cut(P_rr(-440 + i * 10, -70 - i * 14, 260, 30, 3), '#F3E9D2', { shadow: 0.3, edge: 2 });
  cut(P_poly([[300, 120], [480, 120], [460, 310], [320, 310]]), '#A88B5E', { shadow: 0.8, edge: 4 });
  ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(305 + i * 30, 125); ctx.lineTo(322 + i * 26, 305); ctx.stroke(); }
  if (p > 0 && p < 1) { const k = eio2(p); ctx.save(); ctx.translate(lerp(-120, 390, k), lerp(-160, 160, k) - Math.sin(k * Math.PI) * 140); ctx.rotate(k * 2.4); cut(P_rr(-70, -48, 140, 96, 4), '#F3E9D2', { shadow: 0.5, edge: 2 }); seal(0, 0, 0.25, ''); ctx.restore(); }
  if (p >= 1) cut(P_rr(330, 96, 120, 40, 4), '#F3E9D2', { shadow: 0.3, edge: 2 });
  ctx.restore();
}
/** sealed orders: p 0..0.3 the seal cracks, 0.3..1 the sheet unfolds to "IF DEAD…" */
export function sealedOrders(x, y, s, p = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const u = eo(clamp((p - 0.3) / 0.5)), hgt = lerp(120, 480, u);
  cut(P_rr(-300, -hgt / 2, 600, hgt, 4), '#F3E9D2', { shadow: 1, edge: 0 });
  if (u > 0.05) { ctx.strokeStyle = 'rgba(62,44,30,0.2)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-300, -hgt / 6); ctx.lineTo(300, -hgt / 6); ctx.moveTo(-300, hgt / 6); ctx.lineTo(300, hgt / 6); ctx.stroke();
    ctx.save(); ctx.globalAlpha *= clamp((u - 0.5) * 3); ctx.font = `700 92px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('IF DEAD…', 0, -60);
      ctx.strokeStyle = 'rgba(42,29,20,0.6)'; ctx.lineWidth = 4; for (let r = 0; r < 3; r++) { ctx.beginPath(); ctx.moveTo(-220, 60 + r * 50); for (let xx = 0; xx < 440 - r * 90; xx += 8) ctx.lineTo(-220 + xx, 60 + r * 50 + Math.sin(xx * 0.2 + r) * 6); ctx.stroke(); } ctx.restore(); }
  const cr = clamp(p / 0.3); ctx.save(); ctx.translate(0, u > 0 ? -hgt / 2 + 10 : 0); ctx.globalAlpha *= 1 - u;
  if (cr < 1) seal(0, 0, 0.55, '♛'); else { ctx.save(); ctx.translate(-30, 0); ctx.rotate(-0.3); seal(0, 0, 0.5, ''); ctx.restore(); ctx.save(); ctx.translate(34, 6); ctx.rotate(0.4); seal(0, 0, 0.45, ''); ctx.restore(); }
  ctx.restore(); ctx.restore();
}
/** split frame: a 1907 hero book (left) vs a modern researcher's notebook (right); p 0..1 slides the notebook in */
export function bookVsNotebook(t, p = 1) {
  parchment(21);
  ctx.save(); ctx.translate(560, 540); ctx.rotate(-0.04);
  cut(P_rr(-300, -380, 600, 760, 12), P.wine, { shadow: 1.2, edge: 5 }); ctx.strokeStyle = P.gold; ctx.lineWidth = 6; ctx.strokeRect(-260, -340, 520, 680);
  cut(P_circ(0, -60, 170), '#E9DCBC', { shadow: 0.5, edge: 4 });
  ctx.save(); ctx.beginPath(); ctx.arc(0, -60, 165, 0, TAU); ctx.clip(); person({ x: 0, y: 260, h: 520, who: 'kongsOld', t, prop: null }); ctx.restore();
  for (let i = 0; i < 14; i++) { const a = Math.PI * (0.15 + 0.7 * i / 13), r = 195; ell(Math.cos(a) * r * (i < 7 ? -1 : 1) * 0 + (i < 7 ? -1 : 1) * Math.abs(Math.cos(a)) * r, -60 + Math.sin(a) * r, 16, 28, P.forest, a); }
  ribbon('1907', 0, 240, 0.55, 90);
  ctx.restore();
  const k = eo(clamp(p)); ctx.save(); ctx.translate(lerp(2400, 1370, k), 560); ctx.rotate(0.05);
  cut(P_rr(-280, -360, 560, 720, 8), '#EFEFE6', { shadow: 1.2, edge: 0 });
  for (let i = 0; i < 12; i++) { ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-280, -320 + i * 58, 14, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(61,90,128,0.35)'; ctx.lineWidth = 2; for (let r = 0; r < 12; r++) { ctx.beginPath(); ctx.moveTo(-240, -280 + r * 52); ctx.lineTo(250, -280 + r * 52); ctx.stroke(); }
  ctx.strokeStyle = '#2A1D14'; ctx.lineWidth = 4; for (let r = 0; r < 8; r++) { ctx.beginPath(); ctx.moveTo(-220, -295 + r * 52); for (let xx = 0; xx < 260 + rnd(r) * 160; xx += 7) ctx.lineTo(-220 + xx, -295 + r * 52 + Math.sin(xx * 0.25 + r) * 6); ctx.stroke(); }
  ctx.font = `700 120px ${SERIF}`; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 150 + Math.sin(t * 2) * 4, 180); ctx.font = `700 80px ${SERIF}`; ctx.fillText('?', -120, 220 + Math.sin(t * 2 + 1) * 4);
  ctx.restore();
}
/** empty-outline icons for the cold open: 'orders' (scroll) · 'coins' · 'ship'; p = stamp-in; struck = crimson strike */
export function emptyIcon(kind, x, y, s, p = 1) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + (1 - eobk(p)) * 0.6), s * (1 + (1 - eobk(p)) * 0.6)); ctx.globalAlpha *= clamp(p * 2);
  cut(P_circ(0, 0, 150), '#F3E9D2', { shadow: 1, edge: 0 });
  ctx.strokeStyle = P.ink; ctx.lineWidth = 9; ctx.setLineDash([18, 12]); ctx.lineJoin = 'round'; ctx.beginPath();
  if (kind === 'orders') { ctx.roundRect(-70, -80, 140, 160, 8); ctx.moveTo(-40, -30); ctx.lineTo(40, -30); ctx.moveTo(-40, 10); ctx.lineTo(40, 10); }
  if (kind === 'coins') { ctx.ellipse(0, 30, 80, 26, 0, 0, TAU); ctx.moveTo(80, -10); ctx.ellipse(0, -10, 80, 26, 0, 0, TAU); ctx.moveTo(80, -50); ctx.ellipse(0, -50, 80, 26, 0, 0, TAU); }
  if (kind === 'ship') { ctx.moveTo(-90, 40); ctx.lineTo(90, 40); ctx.lineTo(60, 80); ctx.lineTo(-60, 80); ctx.closePath(); ctx.moveTo(0, 40); ctx.lineTo(0, -90); ctx.moveTo(-60, -70); ctx.lineTo(60, -70); ctx.lineTo(50, 20); ctx.lineTo(-50, 20); ctx.closePath(); }
  ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = P.crimson; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 128, 0, TAU); ctx.moveTo(-90, 90); ctx.lineTo(90, -90); ctx.stroke();
  ctx.restore();
}
/** door closing (Copenhagen): p 0 open → 1 shut */
export function door(x, y, s, p) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-180, -520, 360, 520, 6), '#2B2D3A', { shadow: 0, edge: 0 }); const w = 340 * Math.max(0.04, Math.cos(eio2(1 - clamp(p)) * 0 + (1 - clamp(p)) * 1.3)); cut(P_rr(-170, -510, w, 510, 4), '#6E5238', { shadow: 0.8, edge: 4 }); ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 4; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-170 + w * i / 4, -500); ctx.lineTo(-170 + w * i / 4, -10); ctx.stroke(); } circle(-170 + w - 30, -260, 12, P.gold); ctx.restore(); }
/** cobweb spreading from a corner (x, y = corner), p 0..1 */
export function cobweb(x, y, r, p, flip = 1) { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(flip, 1); ctx.strokeStyle = 'rgba(250,245,232,0.95)'; ctx.lineWidth = 4.5; const R = r * eo(clamp(p)); for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI / 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke(); } for (let k = 1; k <= 5; k++) { const rr2 = R * k / 5; ctx.beginPath(); for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI / 2, x2 = Math.cos(a) * rr2, y2 = Math.sin(a) * rr2; i ? ctx.quadraticCurveTo(Math.cos(a - Math.PI / 12) * rr2 * 0.85, Math.sin(a - Math.PI / 12) * rr2 * 0.85, x2, y2) : ctx.moveTo(x2, y2); } ctx.stroke(); } ctx.restore(); }
/** the quote on a torn slip: lines reveal by p (0..1 over all lines); label under it */
export function quoteSlip(lines, labelText, x, y, p = 1, size = 54) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.015); ctx.font = `700 ${size}px ${SERIF}`;
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 120, h = lines.length * size * 1.35 + 120;
  cut(() => { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); for (let xx = -w / 2; xx <= w / 2; xx += 26) ctx.lineTo(xx, -h / 2 + (rnd(xx) - 0.5) * 12); for (let yy = -h / 2; yy <= h / 2; yy += 26) ctx.lineTo(w / 2 + (rnd(yy) - 0.5) * 10, yy); for (let xx = w / 2; xx >= -w / 2; xx -= 26) ctx.lineTo(xx, h / 2 + (rnd(xx + 5) - 0.5) * 12); ctx.closePath(); }, '#F3E9D2', { shadow: 1, edge: 0 });
  ctx.font = `700 ${size * 2}px ${SERIF}`; ctx.fillStyle = 'rgba(168,50,45,0.5)'; ctx.textAlign = 'left'; ctx.fillText('“', -w / 2 + 16, -h / 2 + size * 1.2);
  ctx.font = `700 ${size}px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.ink;
  lines.forEach((l, i) => { const k = clamp(p * lines.length - i); if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, 60 + (w - 60) * eo(k), h); ctx.clip(); ctx.fillText(l, 0, -h / 2 + 70 + i * size * 1.35 + size * 0.5); ctx.restore(); });
  ctx.font = `700 26px ${SERIF}`; ctx.fillStyle = P.sepia; ctx.letterSpacing = '2px'; ctx.fillText(labelText, 0, h / 2 + 34); ctx.letterSpacing = '0px';
  ctx.restore();
}
/** a grave with a lantern set on it */
export function grave(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 260, 50, 0, Math.PI, TAU); ctx.closePath(); }, '#7E6A50', { shadow: 0.6, edge: 4 }); cut(() => { ctx.beginPath(); ctx.moveTo(-110, -20); ctx.lineTo(-110, -260); ctx.arc(0, -260, 110, Math.PI, TAU); ctx.lineTo(110, -20); ctx.closePath(); }, P.stone, { shadow: 0.9, edge: 5 }); ctx.strokeStyle = 'rgba(62,44,30,0.45)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -300); ctx.lineTo(0, -140); ctx.moveTo(-50, -250); ctx.lineTo(50, -250); ctx.stroke(); ctx.restore(); lantern(x + 170 * s, y - 40 * s, 0.9 * s, t); }
/** a laurel wreath (for the hero welcome / the 1907 book); p = how whole it is */
export function wreath(x, y, r, p = 1) { for (let i = 0; i < 16 * p; i++) { const a = Math.PI * (0.62 + 1.76 * i / 15); ell(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.11, r * 0.2, i % 2 ? P.forest : '#93A06A', a); } }
/** end screen: two "watch next" placeholder frames (top-left) and the flag; bottom-right 420x260 left clear */
export function endScreen(t, p = 1) { const k = eobk(clamp(p)); for (const [x, y] of [[420, 360], [1040, 360]]) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); cut(P_rr(-270, -155, 540, 310, 8), 'rgba(243,233,210,0.92)', { shadow: 1, edge: 0 }); ctx.setLineDash([16, 10]); ctx.strokeStyle = P.sepia; ctx.lineWidth = 4; ctx.strokeRect(-240, -125, 480, 250); ctx.setLineDash([]); label('WATCH NEXT', 0, 0, 34, P.sepia); ctx.restore(); } }
