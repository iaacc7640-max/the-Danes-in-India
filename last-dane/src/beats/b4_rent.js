// BEAT 4 · 1655 · THE RENT GOES UP (lines 45-55). Tanjore court; the first siege is held (banners and torches, no fighting).
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground, crowd, shapeOf } from './common.js';
import { siegeNight } from './b0_cold.js';
const { P, cut, P_rr, P_poly } = K;

/** the Nayak's court at Thanjavur: warm stone arches, a gopuram-like tiered tower behind, a throne dais */
function court(t) {
  K.parchment(61); ctx.fillStyle = '#E7C98F'; ctx.fillRect(-300, -300, W + 600, H + 600);
  for (let i = 0; i < 5; i++) { const w = 520 - i * 90, y = 520 - i * 90; cut(P_rr(960 - w / 2, y, w, 95, 4), i % 2 ? '#C9A46A' : '#B98E52', { shadow: 0.5, edge: 4 }); }      // tiered tower
  cut(P_poly([[900, 160], [960, 90], [1020, 160]]), P.gold, { shadow: 0.4, edge: 3 });
  for (const x of [120, 470, 1450, 1800]) { cut(() => { ctx.beginPath(); ctx.moveTo(x - 140, 900); ctx.lineTo(x - 140, 420); ctx.quadraticCurveTo(x, 260, x + 140, 420); ctx.lineTo(x + 140, 900); ctx.closePath(); }, '#B98E52', { shadow: 0.7, edge: 5 }); cut(() => { ctx.beginPath(); ctx.moveTo(x - 90, 900); ctx.lineTo(x - 90, 460); ctx.quadraticCurveTo(x, 350, x + 90, 460); ctx.lineTo(x + 90, 900); ctx.closePath(); }, '#7A5A36', { shadow: 0, edge: 3 }); }
  cut(P_rr(-300, 900, W + 600, 400, 0), '#9C6B45', { shadow: 0.6, edge: 4 }); cut(P_rr(700, 860, 520, 60, 6), P.forest, { shadow: 0.6, edge: 4 });
  for (let i = 0; i < 3; i++) { const g = ctx.createRadialGradient(330 + i * 630, 640, 0, 330 + i * 630, 640, 160); g.addColorStop(0, `rgba(255,205,110,${0.18 + 0.05 * Math.sin(t * 9 + i)})`); g.addColorStop(1, 'rgba(255,205,110,0)'); ctx.fillStyle = g; ctx.fillRect(130 + i * 630, 440, 400, 400); }
}
function nayakOnThrone(t, o = {}) { K.person({ who: 'parasol', x: 1130, y: 900, h: 470, t, dir: -1, seed: 3 }); K.person({ who: 'nayak', x: 960, y: 900, h: 520, t, arm: o.arm ?? 10, mood: o.mood ?? 'stern' }); }

export function b4(add, ev, snap) {
  // S60 · whip → Thanjavur court; Vijaya Raghava, crown, parasol bearer; name slip
  { const st = at(45), vj = Wd('vijaya', 45);
    add({ id: 'B4-S60', at: st, beat: 4, year: 1655, enter: 'whip', cam: K.cam.push(960, 560, 0.08), note: 'Tanjore court: Vijaya Raghava',
      draw(lt, d, t) { court(t); nayakOnThrone(t); K.slip('VIJAYA RAGHAVA NAYAK', 960, 250, pop(t, vj), -0.02, 44); } });
    ev(st + 0.2, 'bell', { note: 'temple bell', gain: 0.5 }); ev(vj, 'pop', { note: 'name slip' });
  }
  // S61 · his war maps: green arrows draw to Gingee (north) and Madurai (south-west); coins drain
  { const st = at(46), gi = Wd('gingee', 46), md = Wd('madurai', 46), mo = Wd('money', 46);
    add({ id: 'B4-S61', at: st, beat: 4, year: 1655, enter: 'whip', cam: K.cam.push(900, 540, 0.07), note: 'wars vs Gingee and Madurai',
      draw(lt, d, t) { const pr = K.realMap('south', { view: [75.8, 8.9, 83.2, 13.0] }); const [jx, jy] = K.place(pr, 'Tanjore'), [gx, gy] = K.place(pr, 'Gingee'), [mx, my] = K.place(pr, 'Madurai');
        const arrow = (x1, y1, p) => { if (p <= 0) return; const x = lerp(jx, x1, eo(p)), y = lerp(jy, y1, eo(p)); ctx.strokeStyle = P.forest; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(x, y); ctx.stroke(); const a = Math.atan2(y1 - jy, x1 - jx); cut(P_poly([[x + Math.cos(a) * 30, y + Math.sin(a) * 30], [x + Math.cos(a + 2.4) * 30, y + Math.sin(a + 2.4) * 30], [x + Math.cos(a - 2.4) * 30, y + Math.sin(a - 2.4) * 30]]), P.forest, { shadow: 0.4, edge: 3 }); };
        arrow(gx, gy + 30, clamp((t - gi + 0.3) / 0.6)); arrow(mx + 20, my - 20, clamp((t - md + 0.2) / 0.6));
        circle(jx, jy, 12, P.gold); K.slip('TANJORE', jx - 30, jy + 70, 1, 0.02, 34); circle(gx, gy, 10, P.ink); K.slip('GINGEE', gx + 130, gy, pop(t, gi), -0.02, 34); circle(mx, my, 10, P.ink); K.slip('MADURAI', mx - 20, my - 70, pop(t, md), 0.02, 34);
        for (let i = 0; i < 4; i++) { const k = clamp((t - mo - i * 0.15) / 0.8); if (k > 0 && k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; circle(jx + 60 + i * 26, lerp(jy + 30, jy + 220, k), 14, P.gold); ctx.restore(); } } } });
    ev(mo, 'coin', { note: 'coins drain' }); ev(gi - 0.3, 'route', { note: 'arrow to Gingee', dur: 0.6 }); ev(md - 0.2, 'route', { note: 'arrow to Madurai', dur: 0.6 });
  }
  // S62 · he eyes a tiny paper Tranquebar on the table
  { const st = at(47), wk = Wd('weak', 47);
    add({ id: 'B4-S62', at: st, beat: 4, year: 1655, enter: 'whip', cam: K.cam.push(1160, 700, 0.10), note: 'a weak colony',
      draw(lt, d, t) { court(t); cut(P_rr(900, 760, 620, 40, 6), '#6E5238', { shadow: 0.7, edge: 4 }); K.fortDansborg(1210, 760, 0.22, t, {}); K.person({ who: 'nayak', x: 620, y: 1060, h: 640, t, look: 'down', mood: 'sneer', arm: 40 }); K.stamp('WEAK', 1240, 520, pop(t, wk, 0.2), 0.1, 70); } });
    ev(wk, 'stamp', { note: 'WEAK' });
  }
  // S63 · the tribute slip doubles ×2; SNAP on "raised"
  { const st = at(48), rs = Wd('raised', 48);
    add({ id: 'B4-S63', at: st, beat: 4, year: 1655, cam: K.cam.push(960, 520, 0.06), snaps: [snap(rs, 1000, 500, 1.2)], note: 'the rent doubles',
      draw(lt, d, t) { court(t); dim(0.25, '#7A4B3A'); K.rentSlip(960, 520, 1.5, { mult: t > rs ? 2 : 1, p: clamp((t - rs) / 0.4) }); } });
  }
  // S64 · Kongsbakke opens an empty coin chest on "pay"
  { const st = at(49), py = Wd('pay', 49);
    add({ id: 'B4-S64', at: st, beat: 4, year: 1655, enter: 'whip', cam: K.cam.push(960, 600, 0.08), note: 'empty chest',
      draw(lt, d, t) { K.parchment(62); dim(0.35, K.NAVY); ground(860, '#6E5238'); const op = clamp((t - py + 0.3) / 0.3);
        cut(P_rr(860, 700, 340, 170, 10), '#6E5238', { shadow: 0.8, edge: 4 }); ctx.save(); ctx.translate(860, 700); ctx.scale(1, 1 - op * 1.6); cut(P_rr(0, -70, 340, 70, 10), '#8A6A48', { shadow: 0.5, edge: 4 }); ctx.restore(); if (op > 0.5) cut(P_rr(880, 720, 300, 20, 6), '#2A1D14', { shadow: 0, edge: 0 });
        K.person({ who: 'kongsOld', x: 600, y: 1000, h: 560, t, mood: 'worried', look: 'down', arm: 50 }); K.lantern(1400, 640, 1.0, t, 1); } });
    ev(py - 0.3, 'door', { note: 'chest lid', gain: 0.4 });
  }
  // S65 · the green tide bleeds toward Tranquebar; banners march on "army"
  { const st = at(50), ar = Wd('army', 50);
    add({ id: 'B4-S65', at: st, beat: 4, year: 1655, enter: 'whip', cam: K.cam.push(1060, 520, 0.08), note: 'the army marches',
      draw(lt, d, t) { const pr = K.realMap('south', { view: [75.8, 8.9, 83.2, 13.0] }); const [tx, ty] = K.place(pr, 'Tranquebar'), [jx, jy] = K.place(pr, 'Tanjore'); const land = shapeOf(pr, K.GEO.data.south.land);
        K.greenTide(land, 0.45 + 0.4 * clamp((t - ar + 0.2) / 1.0), jx, jy, 520, 3); K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 34, 0, TAU); }, P.crimson, 1, tx, ty, 40, 2);
        for (let i = 0; i < 4; i++) { const k = eio(clamp((t - ar + 0.3 - i * 0.12) / 1.3)); K.banner(lerp(jx, tx - 70, k) - i * 40, lerp(jy, ty, k) + (i % 2) * 40 + 60, 0.35, t, i); } K.slip('TRANQUEBAR', tx + 190, ty - 90, 1, 0.02, 32); } });
    ev(ar, 'flag', { note: 'army marches' });
  }
  // S66 · Kongsbakke slaps a fort plan on the table on "planned"
  { const st = at(51), pl = Wd('planned', 51);
    add({ id: 'B4-S66', at: st, beat: 4, year: 1655, cam: K.cam.push(960, 560, 0.09), note: 'he had planned for this',
      draw(lt, d, t) { K.parchment(63); dim(0.3, K.NAVY); cut(P_rr(300, 700, 1320, 50, 6), '#6E5238', { shadow: 0.8, edge: 4 }); const k = eob(clamp((t - pl + 0.15) / 0.25));
        if (k > 0) { ctx.save(); ctx.translate(1100, 640); ctx.rotate(-0.04); ctx.scale(k, k); cut(P_rr(-260, -150, 520, 300, 4), '#E9DCBC', { shadow: 1, edge: 0 }); ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.strokeRect(-120, -70, 240, 140); for (const [x, y] of [[-120, -70], [120, -70], [-120, 70], [120, 70]]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sign(x) * 40, y + Math.sign(y) * 40); ctx.stroke(); } ctx.strokeStyle = P.crimson; ctx.setLineDash([12, 8]); ctx.strokeRect(-200, -120, 400, 240); ctx.setLineDash([]); ctx.restore(); }
        K.person({ who: 'kongsOld', x: 640, y: 1040, h: 640, t, arm: t > pl - 0.1 ? 70 : 20, mood: 'stern', prop: null }); K.lantern(1600, 380, 1, t, 1); } });
    ev(pl - 0.1, 'seal', { note: 'plan slapped down', gain: 0.6 });
  }
  // S67 · on the wall: Portuguese mercenaries and local Indian defenders stand guard (no fighting)
  { const st = at(52), pt = Wd('portuguese', 52), ia = Wd('indian', 52);
    add({ id: 'B4-S67', at: st, beat: 4, year: 1655, enter: 'whip', cam: K.cam.drift(110, 960, 560, 1.05), note: 'defenders on the wall',
      draw(lt, d, t) { K.nightSky(64, t, 520); for (let x = -100; x < W + 100; x += 140) cut(P_rr(x, 560, 90, 64, 4), '#7D6E5C', { shadow: 0.4, edge: 4 }); cut(P_rr(-300, 620, W + 600, 600, 0), '#7D6E5C', { shadow: 0.6, edge: 5 });
        for (let i = 0; i < 6; i++) K.torch(140 + i * 330, 640, 0.9, t, i);
        [['portuguese', 380, pt], ['portuguese', 640, pt + 0.15], ['defender', 1220, ia], ['defender', 1480, ia + 0.15]].forEach(([w, x, tt], i) => { const k = pop(t, tt - 0.1); if (k > 0) K.person({ who: w, x, y: 1000, h: 440 * k, t, seed: i }); });
        K.person({ who: 'kongsOld', x: 930, y: 1000, h: 470, t, prop: 'lantern', arm: 25 }); } });
    ev(pt - 0.1, 'pop', { note: 'Portuguese mercenaries' }); ev(ia - 0.1, 'pop', { note: 'local defenders' });
  }
  // S68 · night: banners ring the walls; the ring withdraws on "lifted"
  { const st = at(53), hd = Wd('held', 53), lf = Wd('lifted', 53);
    add({ id: 'B4-S68', at: st, beat: 4, year: 1655, cam: K.cam.push(960, 640, 0.06), note: 'siege lifted',
      draw(lt, d, t) { const back = eio(clamp((t - lf + 0.2) / 1.0)); ctx.save(); siegeNight(t, { ring: 1 - back * 0.95 }); ctx.restore(); if (t > hd) K.stamp('HELD', 420, 300, pop(t, hd, 0.2), -0.1, 80); } });
    ev(hd, 'stamp', { note: 'HELD' }); ev(lf, 'whip', { note: 'ring withdraws', gain: 0.5 });
  }
  // S69 · Kongsbakke watches the banners go; push on "back"
  { const st = at(54), bk = Wd('back', 54);
    add({ id: 'B4-S69', at: st, beat: 4, year: 1655, cam: K.cam.push(700, 460, 0.10), note: 'he knew they would be back',
      draw(lt, d, t) { K.nightSky(65, t, 560); K.sea(620, t, 2, ['#55677A', '#4B5B6C']); ground(800, '#4A3E33'); for (let i = 0; i < 4; i++) K.banner(1200 + i * 150 + lt * 40, 820, 0.4, t, i); K.person({ who: 'kongsOld', x: 640, y: 1060, h: 640, t, dir: 1, prop: 'lantern', arm: 25, mood: t > bk ? 'stern' : '' }); } });
    ev(st + 0.4, 'appear', { note: 'banners recede', sfx: false }); ev(bk, 'swell', { note: 'push in', type: 'swell', dur: 1.0 });
  }
  // S70 · he unrolls a plan: a wall line starts to draw round the town; sting
  { const st = at(55), bd = Wd('building', 55);
    add({ id: 'B4-S70', at: st, beat: 4, year: 1655, cam: K.cam.push(960, 520, 0.08), note: 'he starts building, sting',
      draw(lt, d, t) { K.parchment(66); const k = clamp((t - st) / d); ctx.save(); ctx.translate(960, 520); ctx.scale(lerp(0.2, 1, eo(clamp(k * 3))), 1); cut(P_rr(-620, -330, 1240, 660, 6), '#E9DCBC', { shadow: 1, edge: 0 }); ctx.restore();
        cut(P_rr(860, 470, 200, 110, 4), P.stone, { shadow: 0.5, edge: 3 }); for (let i = 0; i < 14; i++) cut(P_rr(560 + (i % 7) * 110, i < 7 ? 340 : 660, 70, 50, 3), '#C9B48A', { shadow: 0.3, edge: 2 });
        ctx.strokeStyle = P.crimson; ctx.lineWidth = 9; ctx.setLineDash([22, 14]); ctx.beginPath(); const p = clamp((t - bd + 0.2) / 1.2), pts = [[500, 300], [1420, 300], [1420, 760], [500, 760], [500, 300]]; let left = p * 4; ctx.moveTo(500, 300); for (let i = 1; i < 5 && left > 0; i++) { const f = Math.min(1, left); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); left -= 1; } ctx.stroke(); ctx.setLineDash([]); } });
    ev(bd - 0.2, 'route', { note: 'wall line draws', dur: 1.2 }); ev(Le(55) - 0.05, 'sting', { note: 'beat 4 sting' });
  }
}
