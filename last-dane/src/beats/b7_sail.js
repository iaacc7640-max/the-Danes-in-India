// BEAT 7 · 1669 · A SAIL! (lines 78-91). Van Hagen to Copenhagen; the Færø; "IF DEAD…"; alive; peace and new villages.
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground, crowd, shapeOf } from './common.js';
const { P, cut, P_rr, P_poly } = K;
const VOY = ['Tranquebar', [74, 6], [62, 0], [55, -20], [35, -36], 'Cape of Good Hope', [10, -36], [-8, -20], [-22, 10], [-12, 35], [4, 51], 'Copenhagen'];

export function b7(add, ev, snap) {
  // S110 · whip → Geert van Hagen (Dutch coat, orange accent) takes the sealed letter; BEAT CARD
  { const st = at(78), ms = Wd('messenger', 78);
    add({ id: 'B7-S110', at: st, beat: 7, year: 1668, enter: 'whip', cam: K.cam.push(960, 560, 0.08), note: 'one last messenger',
      draw(lt, d, t) { K.daySky(91, 640); K.sea(700, t); ground(860, '#C9B48A'); K.person({ who: 'kongsOld', x: 640, y: 1040, h: 600, t, arm: 55, prop: null }); K.person({ who: 'vanHagen', x: 1240, y: 1040, h: 600, t, dir: -1, arm: 40 });
        const k = eio(clamp((t - ms + 0.2) / 0.8)); ctx.save(); ctx.translate(lerp(820, 1080, k), 650); ctx.rotate(-0.1); cut(P_rr(-70, -45, 140, 90, 4), '#F3E9D2', { shadow: 0.6, edge: 0 }); K.seal(0, 0, 0.22, ''); ctx.restore(); } });
    ev(ms - 0.2, 'page', { note: 'letter handed over' });
  }
  // S111 · name slip GEERT VAN HAGEN
  { const st = at(79), dt = Wd('dutchman', 79);
    add({ id: 'B7-S111', at: st, beat: 7, year: 1668, cam: K.cam.push(1100, 420, 0.10), note: 'Geert van Hagen',
      draw(lt, d, t) { K.daySky(92, 640); K.sea(700, t); ground(860, '#C9B48A'); K.person({ who: 'vanHagen', x: 1100, y: 1100, h: 820, t, dir: -1, arm: 30 }); K.slip('GEERT VAN HAGEN', 620, 330, pop(t, dt + 0.5), -0.03, 52); K.slip('A DUTCH SERGEANT', 640, 460, pop(t, dt + 0.8), 0.02, 32); } });
    ev(dt + 0.5, 'pop', { note: 'name slip' });
  }
  // S112 · world map: the route races Tranquebar → Copenhagen
  { const st = at(80);
    add({ id: 'B7-S112', at: st, beat: 7, year: 1668, enter: 'whip', cam: K.cam.push(700, 400, 0.08), note: 'all the way to Copenhagen',
      draw(lt, d, t) { const pr = K.realMap('world', { view: [-62, -44, 158, 78] }); const p = eio(clamp(lt / (d - 0.2))); const h = K.geoRoute(pr, VOY, p, { wobble: 4 }); if (p < 1) { ctx.save(); ctx.translate(h[0], h[1]); K.ship(0, 0, 0.12, 0); ctx.restore(); }
        const [cx, cy] = K.place(pr, 'Copenhagen'), [tx, ty] = K.place(pr, 'Tranquebar'); circle(tx, ty, 10, P.crimson); circle(cx, cy, 10, P.ink); K.slip('COPENHAGEN', cx + 150, cy + 10, pop(t, st + d - 0.5), 0.02, 30); } });
    ev(st + 0.1, 'route', { note: 'route races', dur: 1.6 });
  }
  // S113 · COPENHAGEN: the king's seal thuds on "worked"
  { const st = at(81), wk = Wd('worked', 81);
    add({ id: 'B7-S113', at: st, beat: 7, year: 1668, enter: 'whip', cam: K.cam.push(960, 540, 0.06), snaps: [snap(wk, 960, 520, 1.15, 0.6)], note: 'this time it worked',
      draw(lt, d, t) { K.parchment(93); cut(P_rr(560, 300, 800, 520, 6), '#F3E9D2', { shadow: 1, edge: 0 }); ctx.strokeStyle = 'rgba(62,44,30,0.4)'; ctx.lineWidth = 4; for (let r = 0; r < 6; r++) { ctx.beginPath(); ctx.moveTo(640, 380 + r * 52); ctx.lineTo(1280 - r * 40, 380 + r * 52); ctx.stroke(); }
        K.person({ who: 'king', x: 1650, y: 1000, h: 640, t, a: 0.85 }); if (t > wk) K.seal(1160, 700, pop(t, wk, 0.18) * 0.9, '♛'); K.coldWash(0.5); } });
    ev(wk, 'seal', { note: "the king's seal" });
  }
  // S114 · STAT CARD FÆRØ · MAY 1669; a sail on the horizon
  { const st = at(82), my = Wd('may', 82);
    add({ id: 'B7-S114', at: st, beat: 7, year: 1669, enter: 'whip', cam: K.cam.push(1300, 560, 0.08), note: 'May 1669: a sail',
      draw(lt, d, t) { K.daySky(94, 620); K.sea(640, t); const k = eio(clamp(lt / d)); K.ship(lerp(1700, 1450, k), 640, lerp(0.12, 0.22, k), 0); },
      overlay(lt, d, t) { K.statCard('MAY 1669', 'THE FÆRØ ARRIVES', 560, 420, pop(t, my), { date: 1, size: 84 }); } });
    ev(my, 'stat', { note: 'May 1669' }); ev(st + 1.0, 'bell', { note: 'distant bell', gain: 0.4 });
  }
  // S115 · the frigate Færø sails in; FÆRØ slip
  { const st = at(83), fr = Wd('frigate', 83);
    add({ id: 'B7-S115', at: st, beat: 7, year: 1669, cam: K.cam.drift(-110, 960, 520, 1.05), note: 'the frigate Færø',
      draw(lt, d, t) { K.daySky(95, 620); K.sea(640, t, 3); const k = eio(clamp(lt / d)); K.ship(lerp(1500, 1100, k), 760 + K.idle.bob(t, 2, 8), 1.05, Math.sin(t * 1.3) * 0.03); ctx.save(); ctx.translate(lerp(1500, 1100, k), 760 + K.idle.bob(t, 2, 8)); ctx.scale(1.05, 1.05); ctx.fillStyle = P.crimson; ctx.fillRect(10, -520, 120, 80); ctx.fillStyle = '#FBF6EA'; ctx.fillRect(48, -520, 14, 80); ctx.fillRect(10, -486, 120, 14); ctx.restore(); K.slip('FÆRØ', 560, 320, pop(t, fr + 0.5), -0.03, 64); } });
    ev(fr + 0.5, 'pop', { note: 'FÆRØ' }); ev(st + 0.2, 'appear', { note: 'sails breathe', type: 'flap' });
  }
  // S116 · the anchor drops off Tranquebar; bell + cheer on "anchor"
  { const st = at(84), an = Wd('anchor', 84);
    add({ id: 'B7-S116', at: st, beat: 7, year: 1669, cam: K.cam.push(960, 600, 0.07), note: 'anchor dropped; cheer',
      draw(lt, d, t) { K.daySky(96, 600); K.sea(620, t); K.fortDansborg(420, 860, 0.7, t, { wall: 1, towers: 4, houses: 1 }); K.ship(1350, 760 + K.idle.bob(t, 2, 6), 0.8, 0); const k = clamp((t - an) / 0.5); ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1180, 770); ctx.lineTo(1150, 770 + 160 * k); ctx.stroke(); if (k > 0) cut(P_poly([[1130, 760 + 160 * k], [1170, 760 + 160 * k], [1150, 790 + 160 * k]]), P.ink, { shadow: 0.3, edge: 2 });
        ground(880, '#DCC9A0'); for (let i = 0; i < 6; i++) K.person({ who: ['weaver', 'trader', 'soldier', 'defender', 'child', 'portuguese'][i], x: 260 + i * 140, y: 1020, h: 260, t, seed: i, arm: t > an ? 150 + Math.sin(t * 8 + i) * 20 : 0 }); } });
    ev(an, 'bell', { note: 'ship bell' }); ev(an + 0.3, 'appear', { note: 'cheer', type: 'bed', name: 'crowd', dur: 1.5 });
  }
  // S117 · Henrik Eggers steps ashore: sharp uniform, sneer; name slip
  { const st = at(85), eg = Wd('eggers', 85);
    add({ id: 'B7-S117', at: st, beat: 7, year: 1669, enter: 'whip', cam: K.cam.push(1100, 460, 0.08), note: 'Henrik Eggers',
      draw(lt, d, t) { K.daySky(97, 620); K.sea(660, t); ground(860, '#DCC9A0'); K.person({ who: 'officer', x: 1450, y: 1040, h: 560, t, dir: -1, seed: 2 }); K.person({ who: 'eggers', x: lerp(1300, 1080, eio(clamp(lt / 1.2))), y: 1060, h: 680, t, dir: -1, walk: lt < 1.2 ? t * 5 : undefined }); K.slip('HENRIK EGGERS', 560, 320, pop(t, eg), -0.03, 52); } });
    ev(eg, 'pop', { note: 'name slip' });
  }
  // S118-119 · sealed orders: the seal cracks, the sheet unfolds to "IF DEAD…"; the town greys on "lost"
  { const st = at(86), ins = Wd('instructions', 86), dd = Wd('dead', 87), ls = Wd('lost', 87);
    add({ id: 'B7-S118', at: st, beat: 7, year: 1669, cam: K.cam.push(960, 520, 0.06), note: 'sealed instructions', draw(lt, d, t) { K.parchment(98); dim(0.25, '#7A4B3A'); K.sealedOrders(960, 540, 1.3, clamp((t - ins) / 1.6) * 0.45); } });
    add({ id: 'B7-S119', at: at(87), beat: 7, year: 1669, cam: K.cam.push(960, 500, 0.08), snaps: [snap(dd, 960, 460, 1.15)], note: 'IF DEAD…',
      draw(lt, d, t) { K.parchment(98); dim(0.25, '#7A4B3A'); K.sealedOrders(820, 540, 1.3, 0.45 + 0.55 * clamp((t - at(87)) / 0.8)); const g = clamp((t - ls) / 0.5); ctx.save(); ctx.filter = `grayscale(${g})`; K.fortDansborg(1530, 760, 0.42, t, { houses: 1 }); ctx.restore(); if (g > 0) { ctx.save(); ctx.globalAlpha = 0.5 * g; ctx.fillStyle = '#5B5B5B'; ctx.fillRect(1300, 560, 460, 220); ctx.restore(); } } });
    ev(ins, 'seal', { note: 'seal cracks', gain: 0.6 }); ev(at(87) + 0.3, 'page', { note: 'orders unfold' }); ev(ls, 'appear', { note: 'town greys', type: 'swell', dur: 0.8 });
  }
  // S120 · SNAP on "alive": Kongsbakke at the gate with his lantern
  { const st = at(88), av = Wd('alive', 88);
    add({ id: 'B7-S120', at: st, beat: 7, year: 1669, enter: 'whip', cam: K.cam.push(900, 480, 0.06), snaps: [snap(av, 820, 420, 1.25)], note: 'found alive',
      draw(lt, d, t) { K.daySky(99, 760); K.fortDansborg(960, 880, 1.7, t, { flag: true }); ground(880, '#C9B48A'); K.person({ who: 'kongsOld', x: 820, y: 1060, h: 660, t, prop: 'lantern', arm: 25 }); K.person({ who: 'eggers', x: 1500, y: 1060, h: 620, t, dir: -1, mood: 'worried' }); if (t > av) K.stamp('ALIVE', 1320, 330, pop(t, av, 0.18), 0.08, 90); } });
    ev(av, 'stamp', { note: 'ALIVE' });
  }
  // S121 · the town in good order: market, flag, drilled guards
  { const st = at(89), od = Wd('order', 89);
    add({ id: 'B7-S121', at: st, beat: 7, year: 1669, cam: K.cam.drift(110, 960, 560, 1.05), note: 'the colony in good order',
      draw(lt, d, t) { K.daySky(100, 620); K.fortDansborg(960, 760, 1.0, t, { wall: 1, towers: 4, houses: 1 }); ground(760, '#C9B48A'); for (let i = 0; i < 4; i++) cut(P_rr(200 + i * 420, 860, 200, 90, 8), ['#C8952F', '#A8503E', '#7E8B5A', '#C9B48A'][i], { shadow: 0.6, edge: 3 });
        crowd([['weaver', 300, 1040], ['trader', 520, 1030], ['soldier', 760, 1040, { prop: 'pike' }], ['child', 980, 1040], ['defender', 1240, 1030], ['weaver', 1480, 1040], ['trader', 1700, 1030]], t, 300); K.stamp('IN GOOD ORDER', 960, 230, pop(t, od, 0.2), -0.05, 60); } });
    ev(st + 0.3, 'appear', { note: 'market life', type: 'bed', name: 'crowd', dur: 1.8 }); ev(od, 'stamp', { note: 'IN GOOD ORDER' });
  }
  // S122 · map: crimson and green meet; PEACE
  { const st = at(90), pc = Wd('peace', 90);
    add({ id: 'B7-S122', at: st, beat: 7, year: 1669, enter: 'whip', cam: K.cam.push(1060, 520, 0.07), note: 'peace with the Nayak',
      draw(lt, d, t) { const pr = K.realMap('south', { view: [77.6, 9.9, 81.6, 12.1] }); const [tx, ty] = K.place(pr, 'Tranquebar'), [jx, jy] = K.place(pr, 'Tanjore'); const land = shapeOf(pr, K.GEO.data.south.land);
        ctx.save(); ctx.globalAlpha = 0.55; K.greenTide(land, 1, jx, jy, 900, 3); ctx.restore(); K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 50, 0, TAU); }, P.crimson, 1, tx, ty, 60, 2);
        K.seal(jx + 140, jy - 60, pop(t, pc) * 0.55, '♛'); K.seal(tx - 120, ty - 70, pop(t, pc + 0.2) * 0.55, 'D'); K.slip('PEACE', (tx + jx) / 2, Math.min(ty, jy) - 200, pop(t, pc + 0.35), -0.02, 56); circle(jx, jy, 10, P.ink); K.slip('TANJORE', jx - 60, jy + 80, 1, 0.02, 34); K.slip('TRANQUEBAR', tx + 190, ty - 90, 1, 0.02, 32); } });
    ev(pc, 'seal', { note: 'seals meet' }); ev(pc + 0.35, 'pop', { note: 'PEACE' });
  }
  // S123 · new villages ink-bleed crimson round Tranquebar on "villages"; sting
  { const st = at(91), vl = Wd('villages', 91);
    add({ id: 'B7-S123', at: st, beat: 7, year: 1669, cam: K.cam.push(1160, 520, 0.08), note: 'new villages, sting',
      draw(lt, d, t) { const pr = K.realMap('south', { view: [77.6, 9.9, 81.6, 12.1] }); const [tx, ty] = K.place(pr, 'Tranquebar'), [jx, jy] = K.place(pr, 'Tanjore'); const land = shapeOf(pr, K.GEO.data.south.land);
        ctx.save(); ctx.globalAlpha = 0.55; K.greenTide(land, 1, jx, jy, 900, 3); ctx.restore(); K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 50, 0, TAU); }, P.crimson, 1, tx, ty, 60, 2);
        [[-110, -40], [-160, 70], [-60, 120]].forEach(([dx, dy], i) => { const k = clamp((t - vl - i * 0.2) / 0.6); K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx + dx, ty + dy, 34, 0, TAU); }, P.crimson, k, tx + dx, ty + dy, 40, 5 + i); if (k > 0.5) circle(tx + dx, ty + dy, 7, P.ink); });
        K.slip('NEW VILLAGES', tx - 330, ty + 40, pop(t, vl + 0.3), 0.02, 40); K.slip('TRANQUEBAR', tx + 190, ty - 90, 1, 0.02, 32); circle(jx, jy, 10, P.ink); K.slip('TANJORE', jx - 60, jy + 80, 1, 0.02, 34); } });
    ev(vl, 'ink', { note: 'villages bleed in' }); ev(Le(91) - 0.05, 'sting', { note: 'beat 7 sting' });
  }
}
