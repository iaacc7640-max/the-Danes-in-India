// GATE-1 ENGINE TEST: two shots that exercise the 16:9 engine (night rampart + real South India map). Replaced at gate 4.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly } = K;

function nightPage(seed) { K.parchment(seed); ctx.save(); ctx.globalAlpha = 0.86; ctx.fillStyle = '#2F3550'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); for (let i = 0; i < 40; i++) circle(rnd(i + seed) * W, rnd(i + 40 + seed) * 520, 2 + rnd(i) * 3, '#E9DCBC'); }

export function buildShots() {
  const S = [], add = (o) => (S.push(o), o);
  add({ id: 'T0', at: 0, beat: 0, cam: K.cam.push(1180, 560, 0.08), note: 'night rampart, lantern, flag', draw(lt, d, t) {
    nightPage(1);
    cut(P_rr(-300, 640, W + 600, 700, 0), '#6E5A44', { shadow: 0.6, edge: 5 });
    for (let x = -100; x < W + 100; x += 120) cut(P_rr(x, 590, 70, 60, 4), '#6E5A44', { shadow: 0.4, edge: 4 });
    K.lantern(1180, 600, 1.1, t); K.danishFlag(1500, 640, 260, t);
  } });
  K.ev(1.2, 'appear', { note: 'test event' });
  const st = L(1) - 0.08;
  add({ id: 'T1', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.drift(90, 1100, 520, 1.04), note: 'South India real map',
    snaps: [], draw(lt, d, t) {
      const pr = K.realMap('south', { view: [75.8, 8.9, 83.2, 13.0] });
      const [tx, ty] = K.place(pr, 'Tranquebar');
      K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 70, 0, TAU); }, P.crimson, clamp(lt / 1.2), tx, ty, 90, 3);
      for (const [n, dx, dy, al] of [['Tanjore', 0, -34, 'center'], ['Karaikal', 30, 4, 'left'], ['Negapatam', 30, 10, 'left'], ['Gingee', 0, -32, 'center'], ['Madurai', 0, -32, 'center']]) { const [x, y] = K.place(pr, n); circle(x, y, 9, P.ink); K.label(n.toUpperCase(), x + dx, y + dy, 26, P.ink, al); }
      cut(P_poly([[tx, ty - 26], [tx + 8, ty - 8], [tx + 26, ty - 8], [tx + 12, ty + 4], [tx + 18, ty + 24], [tx, ty + 12], [tx - 18, ty + 24], [tx - 12, ty + 4], [tx - 26, ty - 8], [tx - 8, ty - 8]]), P.crimson, { shadow: 0.5, edge: 3 });
      K.slip('TRANQUEBAR', tx + 200, ty - 120, 1, -0.03, 34); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx + 20, ty - 20); ctx.lineTo(tx + 120, ty - 95); ctx.stroke();
    },
    overlay(lt) { K.statCard('1639–1643', 'THE VOYAGE TO INDIA', 1560, 680, eob(clamp((lt - 0.3) / 0.25)), { date: 1, size: 64 }); } });
  return { shots: S, cues: [] };
}
