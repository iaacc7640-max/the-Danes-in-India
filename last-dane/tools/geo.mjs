// Build data/geo.json: real coastlines (Natural Earth via world-atlas, public domain), clipped to each map's box
// and simplified, in [lon, lat]. Run once:  node tools/geo.mjs <path-to-world-atlas-package> [ne_10m_admin_1_states_provinces.geojson]
// Country borders (Denmark, Sweden, Norway, Germany) and the old Danish provinces now in Sweden (Skåne, Halland, Blekinge,
// Gotland: Danish in 1639) come from Natural Earth too (public domain).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const topo = require('./vendor/topojson-client.js');
const SRC = process.argv[2]; if (!SRC) throw new Error('usage: node tools/geo.mjs <world-atlas dir>');
const ADM = process.argv[3];
const load = (f) => { const t = JSON.parse(fs.readFileSync(path.join(SRC, f))); return topo.feature(t, t.objects.land); };

function clip(ring, [x0, y0, x1, y1]) {             // Sutherland-Hodgman against a rectangle
  const edges = [[(p) => p[0] >= x0, (a, b) => { const k = (x0 - a[0]) / (b[0] - a[0]); return [x0, a[1] + k * (b[1] - a[1])]; }],
    [(p) => p[0] <= x1, (a, b) => { const k = (x1 - a[0]) / (b[0] - a[0]); return [x1, a[1] + k * (b[1] - a[1])]; }],
    [(p) => p[1] >= y0, (a, b) => { const k = (y0 - a[1]) / (b[1] - a[1]); return [a[0] + k * (b[0] - a[0]), y0]; }],
    [(p) => p[1] <= y1, (a, b) => { const k = (y1 - a[1]) / (b[1] - a[1]); return [a[0] + k * (b[0] - a[0]), y1]; }]];
  let out = ring;
  for (const [inside, cross] of edges) {
    const inp = out; out = []; if (!inp.length) break;
    for (let i = 0; i < inp.length; i++) { const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
      if (inside(b)) { if (!inside(a)) out.push(cross(a, b)); out.push(b); } else if (inside(a)) out.push(cross(a, b)); }
  }
  return out;
}
function dp(pts, eps) {                              // Douglas-Peucker (closed rings: split at the far point first)
  if (pts.length < 4) return pts;
  const [fx, fy] = pts[0], [lx, ly] = pts[pts.length - 1];
  if (Math.hypot(fx - lx, fy - ly) < 1e-9) { let fi = 1, fd = 0; pts.forEach(([x, y], i) => { const d = Math.hypot(x - fx, y - fy); if (d > fd) { fd = d; fi = i; } }); return [...dp(pts.slice(0, fi + 1), eps).slice(0, -1), ...dp(pts.slice(fi), eps)]; }
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1; const st = [[0, pts.length - 1]];
  while (st.length) { const [a, b] = st.pop(); let md = 0, mi = -1; const [ax, ay] = pts[a], [bx, by] = pts[b], L = Math.hypot(bx - ax, by - ay) || 1e-9;
    for (let i = a + 1; i < b; i++) { const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / L; if (d > md) { md = d; mi = i; } }
    if (md > eps) { keep[mi] = 1; st.push([a, mi], [mi, b]); } }
  return pts.filter((_, i) => keep[i]);
}
const area = (r) => Math.abs(r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
function region(file, box, eps, minArea, feats) {
  const out = [];
  for (const f of (feats || load(file).features)) for (const poly of (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates)) {
    const un = []; let off = 0; poly[0].forEach(([x, y], i) => { if (i) { const d = x + off - un[i - 1][0]; if (d > 180) off -= 360; else if (d < -180) off += 360; } un.push([x + off, y]); });   // unwrap the antimeridian
    { const xs = un.map((q) => q[0]).sort((a, b) => a - b), med = xs[xs.length >> 1], sh = -360 * Math.round(med / 360); if (sh) un.forEach((q) => (q[0] += sh)); }
    const r = clip(un, box); if (r.length < 3 || area(r) < minArea) continue;
    out.push(dp(r, eps).map(([x, y]) => [+x.toFixed(3), +y.toFixed(3)]));
  }
  return out;
}
const geo = {
  source: 'Natural Earth (public domain) via world-atlas 2.0.2',
  world: { box: [-90, -60, 170, 78], land: region('land-110m.json', [-90, -60, 170, 78], 0.25, 2) },
  south: { box: [75.5, 7.5, 83.5, 14.2], land: region('land-10m.json', [75.5, 7.5, 83.5, 14.2], 0.01, 0.002) },
  sea: { box: [74, -12, 126, 26], land: region('land-50m.json', [74, -12, 126, 26], 0.06, 0.05) },
  north: { box: [2, 52.5, 24, 62], land: region('land-50m.json', [2, 52.5, 24, 62], 0.02, 0.002) },
  countries: (() => { const t = JSON.parse(fs.readFileSync(path.join(SRC, 'countries-50m.json'))), fc = topo.feature(t, t.objects.countries), o = {};
    for (const n of ['Denmark', 'Sweden', 'Norway', 'Germany']) o[n] = region(null, [2, 52.5, 24, 62], 0.02, 0.002, fc.features.filter((f) => f.properties.name === n)); return o; })(),
  provinces: (() => { if (!ADM) return {}; const g = JSON.parse(fs.readFileSync(ADM)), o = {};
    for (const n of ['Skåne', 'Halland', 'Blekinge', 'Gotland']) o[n] = region(null, [2, 52.5, 24, 62], 0.01, 0.0005, g.features.filter((f) => f.properties.iso_a2 === 'SE' && f.properties.name === n)); return o; })(),
  places: {
    Tranquebar: [79.855, 11.029], Tanjore: [79.137, 10.787], Karaikal: [79.838, 10.925], Negapatam: [79.843, 10.766],
    Gingee: [79.418, 12.253], Madurai: [78.120, 9.925], Copenhagen: [12.568, 55.676], Kungsbacka: [12.077, 57.487],
    'Cape of Good Hope': [18.474, -34.357], Bantam: [106.152, -6.034], Makassar: [119.423, -5.147], Bengal: [88.36, 22.57], Halland: [12.85, 56.75], Stockholm: [18.07, 59.33], Java: [110.0, -7.4],
  },
};
fs.writeFileSync(path.resolve(path.dirname(new URL(import.meta.url).pathname), '../data/geo.json'), JSON.stringify(geo));
for (const k of ['world', 'south', 'sea']) console.log(k, geo[k].land.length, 'rings', geo[k].land.reduce((s, r) => s + r.length, 0), 'pts');
