// Build data/geo.json: real coastlines (Natural Earth via world-atlas, public domain), clipped to each map's box
// and simplified, in [lon, lat]. Run once:  node tools/geo.mjs <path-to-world-atlas-package>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const topo = require('./vendor/topojson-client.js');
const SRC = process.argv[2]; if (!SRC) throw new Error('usage: node tools/geo.mjs <world-atlas dir>');
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
function dp(pts, eps) {                              // Douglas-Peucker
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1; const st = [[0, pts.length - 1]];
  while (st.length) { const [a, b] = st.pop(); let md = 0, mi = -1; const [ax, ay] = pts[a], [bx, by] = pts[b], L = Math.hypot(bx - ax, by - ay) || 1e-9;
    for (let i = a + 1; i < b; i++) { const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / L; if (d > md) { md = d; mi = i; } }
    if (md > eps) { keep[mi] = 1; st.push([a, mi], [mi, b]); } }
  return pts.filter((_, i) => keep[i]);
}
const area = (r) => Math.abs(r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
function region(file, box, eps, minArea) {
  const out = [];
  for (const f of load(file).features) for (const poly of (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates)) {
    const r = clip(poly[0], box); if (r.length < 3 || area(r) < minArea) continue;
    out.push(dp(r, eps).map(([x, y]) => [+x.toFixed(3), +y.toFixed(3)]));
  }
  return out;
}
const geo = {
  source: 'Natural Earth (public domain) via world-atlas 2.0.2',
  world: { box: [-40, -50, 140, 70], land: region('land-110m.json', [-40, -50, 140, 70], 0.25, 2) },
  south: { box: [75.5, 7.5, 83.5, 14.2], land: region('land-10m.json', [75.5, 7.5, 83.5, 14.2], 0.01, 0.002) },
  sea: { box: [74, -12, 126, 26], land: region('land-50m.json', [74, -12, 126, 26], 0.06, 0.05) },
  places: {
    Tranquebar: [79.855, 11.029], Tanjore: [79.137, 10.787], Karaikal: [79.838, 10.925], Negapatam: [79.843, 10.766],
    Gingee: [79.418, 12.253], Madurai: [78.120, 9.925], Copenhagen: [12.568, 55.676], Kungsbacka: [12.077, 57.487],
    'Cape of Good Hope': [18.474, -34.357], Bantam: [106.152, -6.034], Makassar: [119.423, -5.147], Bengal: [88.36, 22.57],
  },
};
fs.writeFileSync(path.resolve(path.dirname(new URL(import.meta.url).pathname), '../data/geo.json'), JSON.stringify(geo));
for (const k of ['world', 'south', 'sea']) console.log(k, geo[k].land.length, 'rings', geo[k].land.reduce((s, r) => s + r.length, 0), 'pts');
