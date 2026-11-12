// BEAT 6 · 1660s · TRADER, PRIVATEER (lines 66-77). Trade east, prizes from Mughal Bengal (a flag swap, cargo carried off).
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground, crowd } from './common.js';
const { P, cut, P_rr, P_poly } = K;
const MUGHAL = '#2F5D3A';
/** a ship whose flag is col (Danish = draw the Dannebrog) */
function flagShip(x, y, s, rot, t, flag) {
  K.ship(x, y, s, rot); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (flag === 'dk') K.companyMini(10, -520, 150);
  else { ctx.fillStyle = flag; ctx.fillRect(10, -520, 120, 80); circle(70, -480, 18, P.gold); }
  ctx.restore();
}
const seaRoute = (pr, a, pts, p) => K.geoRoute(pr, [a, ...pts], p, { wobble: 3 });

export function b6(add, ev, snap) {
  // S90 · whip → harbour trading desk: scales, bales; BEAT CARD
  { const st = at(66), tr = Wd('trader', 66);
    add({ id: 'B6-S90', at: st, beat: 6, year: 1662, enter: 'whip', cam: K.cam.push(900, 560, 0.08), note: 'the commander turns trader',
      draw(lt, d, t) { K.daySky(81, 600); K.sea(640, t); ground(820, '#C9B48A'); cut(P_rr(500, 700, 800, 40, 6), '#6E5238', { shadow: 0.7, edge: 4 }); for (let i = 0; i < 3; i++) cut(P_rr(1350 + i * 130, 700 - (i % 2) * 60, 120, 100, 10), '#C9B48A', { shadow: 0.6, edge: 3 });
        const tilt = Math.sin(t * 2) * 0.08; ctx.save(); ctx.translate(900, 560); ctx.rotate(tilt); ctx.fillStyle = P.ink; ctx.fillRect(-160, -6, 320, 12); ctx.restore(); circle(900, 560, 10, P.gold); cut(P_rr(728, 590 - tilt * 160, 64, 40, 8), P.gold, { shadow: 0.4, edge: 2 }); cut(P_rr(1008, 590 + tilt * 160, 64, 40, 8), '#C9B48A', { shadow: 0.4, edge: 2 }); ctx.fillStyle = P.ink; ctx.fillRect(894, 560, 12, 140);
        K.person({ who: 'kongsOld', x: 420, y: 1040, h: 620, t, arm: 60, prop: null }); K.stamp('TRADER', 1420, 300, pop(t, tr, 0.2), 0.1, 70); } });
    ev(tr, 'stamp', { note: 'TRADER' }); ev(st + 0.4, 'coin', { note: 'scales', gain: 0.35 });
  }
  // S91 · a Danish ship runs up the flag; PRIVATEER
  { const st = at(67), pv = Wd('privateer', 67);
    add({ id: 'B6-S91', at: st, beat: 6, year: 1662, cam: K.cam.push(960, 480, 0.08), note: 'and sometimes a privateer',
      draw(lt, d, t) { K.daySky(82, 620); K.sea(660, t); flagShip(960, 760 + K.idle.bob(t, 2, 8), 1.0, Math.sin(t * 1.4) * 0.03, t, 'dk'); K.stamp('PRIVATEER', 960, 240, pop(t, pv, 0.2), -0.06, 80); } });
    ev(st + 0.3, 'flag', { note: 'flag up' }); ev(pv, 'stamp', { note: 'PRIVATEER' });
  }
  // S92-93 · sea map: routes to Bantam (Java) and Makassar
  { const st = at(68), bt = Wd('bantam', 68), mk = Wd('makassar', 69), view = [72, -16, 128, 20];
    add({ id: 'B6-S92', at: st, beat: 6, year: 1663, enter: 'whip', cam: K.cam.drift(-90, 960, 520, 1.04), note: 'cargoes east to Bantam and Makassar',
      draw(lt, d, t) { const pr = K.realMap('sea', { view }); const T0 = K.place(pr, 'Tranquebar'), B = K.place(pr, 'Bantam'), M = K.place(pr, 'Makassar');
        seaRoute(pr, 'Tranquebar', [[90, 2], [100, -4], 'Bantam'], clamp((t - bt + 0.8) / 1.2)); if (t > mk - 0.6) seaRoute(pr, 'Bantam', [[112, -6.5], 'Makassar'], clamp((t - mk + 0.6) / 0.9));
        circle(T0[0], T0[1], 12, P.crimson); K.slip('TRANQUEBAR', T0[0] + 30, T0[1] - 60, 1, 0.02, 30); circle(B[0], B[1], 10, P.ink); K.slip('BANTAM (JAVA)', B[0] - 60, B[1] - 70, pop(t, bt), -0.02, 30); circle(M[0], M[1], 10, P.ink); K.slip('MAKASSAR', M[0], M[1] - 70, pop(t, mk), 0.02, 30); } });
    add({ id: 'B6-S93', at: at(69), beat: 6, year: 1663, cam: K.cam.push(1200, 640, 0.05), note: 'Makassar',
      draw(lt, d, t) { const pr = K.realMap('sea', { view }); const T0 = K.place(pr, 'Tranquebar'), B = K.place(pr, 'Bantam'), M = K.place(pr, 'Makassar'); seaRoute(pr, 'Tranquebar', [[90, 2], [100, -4], 'Bantam'], 1); seaRoute(pr, 'Bantam', [[112, -6.5], 'Makassar'], clamp((t - mk + 0.6) / 0.9));
        circle(T0[0], T0[1], 12, P.crimson); K.slip('TRANQUEBAR', T0[0] + 30, T0[1] - 60, 1, 0.02, 30); circle(B[0], B[1], 10, P.ink); K.slip('BANTAM (JAVA)', B[0] - 60, B[1] - 70, 1, -0.02, 30); circle(M[0], M[1], 10, P.ink); K.slip('MAKASSAR', M[0], M[1] - 70, pop(t, mk), 0.02, 30); } });
    ev(bt - 0.8, 'route', { note: 'route to Bantam', dur: 1.2 }); ev(mk - 0.6, 'route', { note: 'route to Makassar', dur: 0.9 });
  }
  // S94-95 · north: the Bengal coast, Mughal deep green; the governor's seal stamps
  { const st = at(70), sea = Wd('sea', 70), mg = Wd('mughal', 71), view = [66, 4, 110, 26];
    const map = (t, sealP) => { const pr = K.realMap('sea', { view: [66, 6, 110, 28] }); const T0 = K.place(pr, 'Tranquebar'), Bg = K.place(pr, 'Bengal'); ctx.save(); ctx.globalAlpha = 0.55; K.inkBleed(() => { ctx.beginPath(); ctx.arc(Bg[0], Bg[1] - 20, 170, 0, TAU); }, MUGHAL, 1, Bg[0], Bg[1] - 20, 180, 6); ctx.restore();
      seaRoute(pr, 'Tranquebar', [[83, 14], [87.5, 19.5]], clamp((t - sea + 0.6) / 1.0)); circle(T0[0], T0[1], 12, P.crimson); K.slip('TRANQUEBAR', T0[0] - 160, T0[1] + 10, 1, 0.02, 30); K.slip('MUGHAL BENGAL', Bg[0] + 290, Bg[1] + 40, 1, -0.02, 34); if (sealP > 0) K.seal(Bg[0], Bg[1] - 40, sealP * 0.6, ''); };
    add({ id: 'B6-S94', at: st, beat: 6, year: 1664, enter: 'whip', cam: K.cam.push(800, 460, 0.06), note: 'a private war at sea', draw(lt, d, t) { map(t, 0); } });
    add({ id: 'B6-S95', at: at(71), beat: 6, year: 1664, cam: K.cam.push(980, 520, 0.05), note: "the Mughal governor's seal", draw(lt, d, t) { map(t, pop(t, mg, 0.2)); } });
    ev(sea - 0.6, 'route', { note: 'route north', dur: 1.0 }); ev(mg, 'seal', { note: 'Mughal seal' });
  }
  // S96 · a captured ship: the flag swaps green → Danish on "seized"; bales carried off on "cargo"
  { const st = at(72), sz = Wd('ships', 72), cg = Wd('cargo', 72);
    add({ id: 'B6-S96', at: st, beat: 6, year: 1665, enter: 'whip', cam: K.cam.push(960, 560, 0.07), note: 'prize: flag swap, cargo off',
      draw(lt, d, t) { K.daySky(83, 620); K.sea(660, t); ground(880, '#C9B48A'); flagShip(1150, 780 + K.idle.bob(t, 1, 6), 0.9, 0, t, t > sz + 0.1 ? 'dk' : MUGHAL);
        for (let i = 0; i < 3; i++) { const k = eio(clamp((t - cg + 0.2 - i * 0.25) / 1.4)); if (k > 0) K.person({ who: 'trader', x: lerp(900, 360 + i * 60, k), y: 1020, h: 330, t, walk: t * 5 + i, prop: 'bale', arm: 120, seed: i }); } } });
    ev(sz + 0.1, 'flag', { note: 'flag swap' }); ev(cg, 'appear', { note: 'cargo carried off', type: 'tap' });
  }
  // S97 · coins into the chest; soldiers paid; stones mend Dansborg
  { const st = at(73), pr = Wd('profits', 73), rp = Wd('repairs', 73);
    add({ id: 'B6-S97', at: st, beat: 6, year: 1665, enter: 'whip', cam: K.cam.drift(90, 960, 540, 1.05), note: 'profits pay soldiers and repairs',
      draw(lt, d, t) { K.daySky(84, 640); K.fortDansborg(1300, 860, 0.95, t, { cracks: 1 - clamp((t - rp) / 0.8) }); ground(860, '#C9B48A'); cut(P_rr(420, 760, 260, 120, 10), '#6E5238', { shadow: 0.7, edge: 4 });
        for (let i = 0; i < 7; i++) { const k = clamp((t - pr - i * 0.15) / 0.5); if (k > 0 && k < 1) circle(550 + Math.sin(i * 3) * 50, lerp(520, 760, eo(k)), 15, P.gold); } if (t > pr + 1) for (let i = 0; i < 3; i++) K.person({ who: 'soldier', x: 780 + i * 110, y: 1020, h: 300, t, seed: i, arm: 30 }); } });
    ev(pr, 'coin', { note: 'coins in' }); ev(pr + 1, 'pop', { note: 'soldiers paid' }); ev(rp, 'seal', { note: 'repairs', gain: 0.4 });
  }
  // S98 · hopeful letters sail home to cold Copenhagen
  { const st = at(74), hp = Wd('hopeful', 74);
    add({ id: 'B6-S98', at: st, beat: 6, year: 1666, enter: 'whip', cam: K.cam.push(960, 520, 0.07), note: 'hopeful reports home',
      draw(lt, d, t) { K.parchment(85); for (let i = 0; i < 3; i++) { const k = clamp((t - hp + 0.3 - i * 0.25) / 1.6); if (k <= 0) continue; ctx.save(); ctx.translate(lerp(300, 1600, eio(k)), 520 - Math.sin(k * Math.PI) * 180 + i * 60); ctx.rotate(Math.sin(t * 4 + i) * 0.2); cut(P_rr(-80, -55, 160, 110, 4), '#F3E9D2', { shadow: 0.6, edge: 0 }); K.seal(0, 0, 0.22, ''); ctx.restore(); } K.slip('COPENHAGEN', 1600, 820, 1, 0.02, 36); K.coldWash(clamp(lt / d)); } });
    ev(hp - 0.3, 'page', { note: 'letters fly' });
  }
  // S99 · a clerk drops the reports in the bin, shakes his head on "believe"
  { const st = at(75), bl = Wd('believe', 75);
    add({ id: 'B6-S99', at: st, beat: 6, year: 1667, cam: K.cam.push(900, 560, 0.07), note: 'Copenhagen did not believe them',
      draw(lt, d, t) { K.parchment(86); ground(900, '#7A6650'); K.letterBin(960, 640, 1.3, t, clamp((t - bl + 0.2) / 0.9)); K.person({ who: 'clerk', x: 420, y: 1000, h: 520, t, dir: Math.sin((t - bl) * 9) > 0 || t < bl ? 1 : -1, arm: 20 }); K.stamp('DOUBTED', 1500, 300, pop(t, bl + 0.2, 0.2), 0.1, 64); K.coldWash(1); } });
    ev(bl - 0.2, 'page', { note: 'into the bin' }); ev(bl + 0.2, 'stamp', { note: 'DOUBTED' });
  }
  // S100-101 · night: Kongsbakke alone, writing by the lantern; the lantern flickers low on "alone"; sting
  { const st = at(76), al = Wd('alone', 77);
    add({ id: 'B6-S100', at: st, beat: 6, year: 1668, enter: 'whip', cam: K.cam.push(860, 520, 0.10), note: 'alone, 1668; sting',
      draw(lt, d, t) { K.parchment(87); dim(0.7, K.NAVY); cut(P_rr(300, 760, 1320, 50, 6), '#4A3A2E', { shadow: 0.6, edge: 4 }); const low = t > al ? clamp(1 - (t - al) * 0.8, 0.35, 1) : 1; K.lantern(1260, 690, 1.3, t, 1.3 * low); { const pg = clamp((t - st - 2.6) / 0.4); K.ledger(900, 640, 0.45, t, pg > 0 ? 0.2 : 0.6, { hand: false }); if (pg > 0 && pg < 1) { ctx.save(); ctx.translate(900, 640); ctx.scale(1 - 2 * pg, 1); cut(P_rr(0, -120, 180, 240, 4), '#F3E9D2', { shadow: 0.4, edge: 0 }); ctx.restore(); } }
        K.person({ who: 'kongsOld', x: 560, y: 1060, h: 640, t, look: 'down', mood: 'worried', prop: 'quill', arm: 40 }); } });
    ev(st + 0.5, 'write', { note: 'he writes' }); ev(st + 2.6, 'page', { note: 'he turns the page' }); ev(al, 'appear', { note: 'lantern dims', type: 'swell', dur: 1.0 }); ev(Le(77) - 0.05, 'sting', { note: 'beat 6 sting' });
  }
}
