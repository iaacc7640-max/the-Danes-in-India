// BEAT 5 · 1660 · NINE MONTHS (lines 56-65). The wall (credit disputed), the nine-month siege, the empty chest.
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, rnd, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground } from './common.js';
import { siegeNight } from './b0_cold.js';
const { P, cut, P_rr, P_poly } = K;

/** Tranquebar seen from above: sea on the east (right), the fort by the shore, house blocks; wall p 0..1, towers 0..4 */
function townPlan(t, o = {}) {
  K.parchment(71); cut(P_poly([[1500, -300], [W + 300, -300], [W + 300, H + 300], [1420, H + 300]]), P.sea, { shadow: 0.5, edge: 5 });
  for (let i = 0; i < 4; i++) { ctx.strokeStyle = 'rgba(243,233,210,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); for (let y = 0; y < H; y += 20) ctx.lineTo(1560 + i * 90 + Math.sin(y * 0.03 + t * 2 + i) * 10, y); ctx.stroke(); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const x = 420 + c * 140, y = 270 + r * 130; if (c >= 4 && r < 2) continue; cut(P_rr(x, y, 100, 100, 4), (r + c) % 3 ? '#C9B48A' : '#B68A5C', { shadow: 0.4, edge: 3 }); }
  cut(P_rr(1130, 220, 260, 260, 6), P.stone, { shadow: 0.8, edge: 5 }); for (const [x, y] of [[1130, 220], [1390, 220], [1130, 480], [1390, 480]]) cut(P_poly([[x, y - 46], [x + 46, y], [x, y + 46], [x - 46, y]]), P.stoneDark, { shadow: 0.5, edge: 4 });
  K.label('DANSBORG', 1260, 350, 30, P.ink);
  const wp = clamp(o.wall || 0); if (wp > 0) { const pts = [[1440, 200], [330, 200], [330, 820], [1440, 820]]; ctx.strokeStyle = P.stoneDark; ctx.lineWidth = 26; ctx.lineCap = 'square'; ctx.beginPath(); ctx.moveTo(...pts[0]); let left = wp * 3; for (let i = 1; i < 4 && left > 0; i++) { const f = Math.min(1, left); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); left -= 1; } ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = P.edge; ctx.stroke(); }
  [[330, 200], [330, 820], [880, 200], [880, 820]].forEach(([x, y], i) => { const k = eob(clamp((o.towers || 0) - i)); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); cut(P_circ2(0, 0, 56), P.stone, { shadow: 0.7, edge: 4 }); circle(0, 0, 18, P.ink); ctx.restore(); });
  if (o.people) for (let i = 0; i < 14; i++) { const k = clamp(o.people * 1.4 - i * 0.06), x = lerp(500 + (i % 7) * 100, 1180 + (i % 5) * 40, eio(k)), y = lerp(620 + Math.floor(i / 7) * 120, 300 + (i % 4) * 40, eio(k)); circle(x, y, 13, i % 3 ? P.ink : P.sepia); }
}
const P_circ2 = (x, y, r) => () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); };

export function b5(add, ev, snap) {
  // S80 · whip → plan view: only the fort is walled; BEAT CARD
  { const st = at(56), ft = Wd('fort', 56);
    add({ id: 'B5-S80', at: st, beat: 5, year: 1660, enter: 'whip', cam: K.cam.push(1100, 500, 0.07), note: 'only the fort was defended',
      draw(lt, d, t) { townPlan(t, {}); if (t > ft) { ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * Math.sin((t - ft) * 8); ctx.strokeStyle = P.crimson; ctx.lineWidth = 8; ctx.strokeRect(1070, 160, 380, 380); ctx.restore(); } } });
    ev(ft, 'pop', { note: 'only the fort' });
  }
  // S81 · townspeople stream into the fort on "inside"
  { const st = at(57), dg = Wd('danger', 57), ins = Wd('inside', 57);
    add({ id: 'B5-S81', at: st, beat: 5, year: 1660, cam: K.cam.push(1100, 420, 0.08), note: 'townspeople crowd inside',
      draw(lt, d, t) { townPlan(t, { people: clamp((t - dg) / 2.2) }); if (t > dg) K.banner(180, 700, 0.6, t, 1); } });
    ev(dg, 'appear', { note: 'danger: banner', type: 'flap' }); ev(ins, 'appear', { note: 'crowd inside', type: 'bed', name: 'crowd', dur: 1.2 });
  }
  // S82 · a wall draws itself round the whole town on "town"
  { const st = at(58), wl = Wd('wall', 58), tw = Wd('town', 58);
    add({ id: 'B5-S82', at: st, beat: 5, year: 1660, cam: K.cam.drift(-80, 900, 520, 1.04), note: 'the wall round the town',
      draw(lt, d, t) { townPlan(t, { wall: clamp((t - wl + 0.1) / (tw - wl + 0.6)) }); } });
    ev(wl - 0.1, 'route', { note: 'wall draws', dur: 1.8, type: 'brush' }); ev(tw, 'pop', { note: 'wall closes' });
  }
  // S83 · four towers pop up with cannon
  { const st = at(59), tw = Wd('towers', 59);
    add({ id: 'B5-S83', at: st, beat: 5, year: 1660, cam: K.cam.push(600, 520, 0.07), note: 'new towers for cannon',
      draw(lt, d, t) { townPlan(t, { wall: 1, towers: clamp((t - tw + 0.1) / 0.8) * 4 }); } });
    ev(tw - 0.1, 'seal', { note: 'towers thud', gain: 0.5 }); ev(tw + 0.4, 'seal', { note: 'towers thud', gain: 0.4 });
  }
  // S84 · historians argue: two notebooks, one ticks, one asks; DISPUTED
  { const st = at(60), ar = Wd('argue', 60), hs = Wd('really', 60) + 0.25;
    add({ id: 'B5-S84', at: st, beat: 5, year: 1660, enter: 'whip', cam: K.cam.push(960, 520, 0.06), note: 'credit for the wall is disputed',
      draw(lt, d, t) { K.parchment(72); for (const [x, r, ok] of [[600, -0.05, true], [1320, 0.05, false]]) { ctx.save(); ctx.translate(x, 500); ctx.rotate(r); cut(P_rr(-260, -320, 520, 640, 8), '#EFEFE6', { shadow: 1, edge: 0 }); ctx.strokeStyle = 'rgba(61,90,128,0.35)'; ctx.lineWidth = 2; for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(-220, -240 + i * 52); ctx.lineTo(220, -240 + i * 52); ctx.stroke(); } ctx.strokeStyle = '#2A1D14'; ctx.lineWidth = 4; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-200, -255 + i * 52); for (let xx = 0; xx < 300; xx += 7) ctx.lineTo(-200 + xx, -255 + i * 52 + Math.sin(xx * 0.25 + i) * 6); ctx.stroke(); }
          ctx.strokeStyle = ok ? P.forest : P.crimson; ctx.lineWidth = 14; ctx.lineCap = 'round'; const k = clamp((t - ar - (ok ? 0 : 0.5)) / 0.4); if (k > 0) { ctx.beginPath(); if (ok) { ctx.moveTo(-60, 150); ctx.lineTo(-10, 200 * Math.min(1, k * 2) + 0); ctx.lineTo(-10 + 100 * Math.max(0, k * 2 - 1), 200 - 140 * Math.max(0, k * 2 - 1)); } else { ctx.font = `700 200px Caladea`; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.globalAlpha = k; ctx.fillText('?', 0, 240); } ctx.stroke(); } ctx.restore(); }
        K.stamp('DISPUTED', 960, 190, pop(t, hs, 0.2), -0.04, 70); } });
    ev(ar, 'write', { note: 'one notebook ticks' }); ev(ar + 0.5, 'pop', { note: 'the other asks' }); ev(hs, 'stamp', { note: 'DISPUTED' });
  }
  // S85 · RETURN to the cold-open shot: night, siege banners ring the walled town
  { const st = at(61), rt = Wd('returned', 61);
    add({ id: 'B5-S85', at: st, beat: 5, year: 1660, enter: 'whip', cam: K.cam.push(960, 640, 0.08), note: 'the Nayak returns: cold-open shot',
      draw(lt, d, t) { siegeNight(t, { ring: 0.3 + 0.7 * eo(clamp((t - rt + 0.2) / 0.8)) }); } });
    ev(rt - 0.2, 'flag', { note: 'siege ring returns' });
  }
  // S86 · month counter 1→9; STAT CARD; SNAP on "nine"
  { const st = at(62), nn = Wd('nine', 62);
    add({ id: 'B5-S86', at: st, beat: 5, year: 1660, cam: K.cam.push(860, 560, 0.07), snaps: [snap(nn, 1230, 470, 1.15, 0.9)], note: 'nine months',
      draw(lt, d, t) { K.nightSky(2, t, 500); for (let x = -100; x < W + 100; x += 140) cut(P_rr(x, 600, 90, 70, 4), '#5E5040', { shadow: 0.4, edge: 4 }); cut(P_rr(-300, 660, W + 600, 600, 0), '#5E5040', { shadow: 0.6, edge: 5 }); for (let i = 0; i < 6; i++) K.banner(140 + i * 330, 600, 0.6, t, i); K.lantern(700, 610, 1.6, t, 1.3);
        const n = t < nn ? 1 : 1 + Math.min(8, Math.floor((t - nn) * 7)); K.monthCounter(1230, 470, 0.95, n, ((t - nn) * 7) % 1); },
      overlay(lt, d, t) { K.statCard('9 MONTHS', 'THE SIEGE OF 1660', 420, 420, pop(t, nn + 0.4), { size: 80 }); } });
    ev(nn, 'page', { note: 'months tear' }); ev(nn + 0.4, 'stat', { note: '9 months' });
  }
  // S87 · dawn: the banners withdraw; the flag still flies on "fall"
  { const st = at(63), fl = Wd('fall', 63);
    add({ id: 'B5-S87', at: st, beat: 5, year: 1660, cam: K.cam.push(1180, 420, 0.08), note: 'Tranquebar does not fall',
      draw(lt, d, t) { K.daySky(73, 640, false); ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#E9A86A'; ctx.fillRect(-300, -300, W + 600, 700); ctx.restore(); cut(P_circ2(300, 640, 90 + lt * 10), '#EFC66A', { shadow: 0.3, edge: 4 });
        K.sea(640, t, 2); K.fortDansborg(960, 800, 1.0, t, { wall: 1, towers: 4, houses: 1, wind: 1.3 }); ground(800, '#8A6A48'); for (let i = 0; i < 6; i++) { const k = eio(clamp((t - st - 0.2) / 2.0)); K.banner(200 + i * 300 + (i < 3 ? -k * 500 : k * 500), 1010, 0.6, t, i); }
        if (t > fl) K.stamp('NOT TAKEN', 960, 300, pop(t, fl, 0.2), -0.06, 80); } });
    ev(st + 0.3, 'whip', { note: 'banners withdraw', gain: 0.4 }); ev(fl, 'stamp', { note: 'NOT TAKEN' });
  }
  // S88 · coins drain from the chest; cracked stones need repair
  { const st = at(64), mo = Wd('money', 64);
    add({ id: 'B5-S88', at: st, beat: 5, year: 1660, cam: K.cam.push(960, 620, 0.07), note: 'a wall costs money',
      draw(lt, d, t) { K.parchment(74); dim(0.3, K.NAVY); ground(860, '#6E5238'); cut(P_rr(780, 700, 360, 170, 10), '#6E5238', { shadow: 0.8, edge: 4 });
        for (let i = 0; i < 8; i++) { const k = clamp((t - st - 0.3 - i * 0.18) / 0.7); if (k >= 1) continue; ctx.save(); ctx.globalAlpha = 1 - k; circle(960 + Math.sin(i * 2) * 60, lerp(690, 500, eo(k)) , 16, P.gold); ctx.restore(); }
        for (let i = 0; i < 3; i++) cut(P_rr(260 + i * 140, 760 - (i % 2) * 40, 120, 80, 4), P.stone, { shadow: 0.5, edge: 3 }); K.stamp('COSTS', 1450, 360, pop(t, mo, 0.2), 0.1, 70); } });
    ev(st + 0.3, 'coin', { note: 'coins leave' }); ev(mo, 'stamp', { note: 'COSTS' });
  }
  // S89 · SNAP on "none": the empty chest lid shuts; sting
  { const st = at(65), nn = Wd('none', 65);
    add({ id: 'B5-S89', at: st, beat: 5, year: 1660, cam: K.cam.push(960, 640, 0.06), snaps: [snap(nn, 960, 700, 1.3)], note: 'and he had none, sting',
      draw(lt, d, t) { K.parchment(74); dim(0.35, K.NAVY); ground(860, '#6E5238'); cut(P_rr(780, 700, 360, 170, 10), '#6E5238', { shadow: 0.8, edge: 4 }); const sh = clamp((t - nn) / 0.15); ctx.save(); ctx.translate(780, 700); ctx.scale(1, lerp(-1.6, 1, sh)); cut(P_rr(0, -70, 360, 70, 10), '#8A6A48', { shadow: 0.5, edge: 4 }); ctx.restore(); if (sh < 1) cut(P_rr(800, 720, 320, 20, 6), '#2A1D14', { shadow: 0, edge: 0 }); } });
    ev(nn, 'seal', { note: 'lid slams' }); ev(Le(65) - 0.05, 'sting', { note: 'beat 5 sting' });
  }
}
