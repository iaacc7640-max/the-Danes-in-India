// BEAT 3 · 1655 · CHOSEN (lines 37-44)
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground, crowd, shapeOf } from './common.js';
const { P, cut, P_rr } = K;

export function b3(add, ev, snap) {
  // S50 · whip → the ledger page turns to 7 SEPT 1655; stat card "commander from 7 Sep 1655"
  { const st = at(37), sp = Wd('september', 37);
    add({ id: 'B3-S50', at: st, beat: 3, year: 1655, enter: 'whip', cam: K.cam.push(960, 520, 0.07), note: 'ledger page 7 Sept 1655',
      draw(lt, d, t) { K.parchment(52); dim(0.25, '#7A4B3A'); K.ledger(900, 540, 1.1, t, 0.5, { hand: false, cross: false }); const k = eio(clamp((t - st - 0.2) / 0.5)); ctx.save(); ctx.translate(900, 540); ctx.scale(1 - 2 * k, 1); cut(P_rr(0, -290, 460, 580, 6), '#F3E9D2', { shadow: 0.6, edge: 0 }); ctx.restore(); K.ribbon('7 SEPT', 1120, 520, pop(t, sp), 80); },
      overlay(lt, d, t) { K.statCard('7 SEP 1655', 'KONGSBAKKE TAKES COMMAND', 1520, 760, pop(t, Wd('sixteen', 37)), { date: 1, size: 70 }); } });
    ev(st + 0.2, 'page', { note: 'page turns' }); ev(sp, 'card', { note: '7 SEPT ribbon' }); ev(Wd('sixteen', 37), 'stat', { note: 'stat 7 Sep 1655' });
  }
  // S51 · Governor Korsør (brief) → a grave with a lantern on "died"
  { const st = at(38), dd = Wd('died', 38);
    add({ id: 'B3-S51', at: st, beat: 3, year: 1655, cam: K.cam.push(960, 560, 0.08), note: 'Korsør → grave',
      draw(lt, d, t) { K.daySky(53, 760, false); dim(0.3, K.NAVY); ground(760, '#7E6A50'); const g = clamp((t - dd + 0.1) / 0.4);
        if (g < 1) { ctx.save(); ctx.globalAlpha = 1 - g; K.person({ who: 'korsor', x: 960, y: 1000, h: 560, t, look: 'down' }); ctx.restore(); } if (g > 0) { ctx.save(); ctx.globalAlpha = g; K.grave(960, 980, 1.2, t); ctx.restore(); }
        K.slip('GOV. POUL HANSEN KORSØR', 960, 230, pop(t, st + 0.2), -0.02, 40); } });
    ev(st + 0.2, 'pop', { note: 'name slip' }); ev(dd, 'seal', { note: 'grave', gain: 0.5 });
  }
  // S52 · officers' pegs: hats vanish one by one; SNAP on "replace"
  { const st = at(39), rp = Wd('replace', 39), of = Wd('officer', 39);
    add({ id: 'B3-S52', at: st, beat: 3, year: 1655, cam: K.cam.push(960, 480, 0.07), snaps: [snap(rp, 960, 440, 1.2)], note: 'no officer left',
      draw(lt, d, t) { K.parchment(54); cut(P_rr(260, 300, 1400, 40, 6), '#6E5238', { shadow: 0.7, edge: 4 }); for (let i = 0; i < 5; i++) { const x = 400 + i * 280; cut(P_rr(x - 8, 330, 16, 50, 4), P.ink, { shadow: 0.3, edge: 2 }); const gone = t > of + i * 0.35; if (!gone) cut(K.P_poly([[x - 90, 420], [x, 350], [x + 90, 420], [x + 50, 405], [x, 418], [x - 50, 405]]), P.ink, { shadow: 0.5, edge: 3 }); } K.stamp('NONE LEFT', 960, 700, pop(t, rp, 0.2), -0.08, 90); } });
    ev(of, 'pop', { note: 'hats vanish' }); ev(of + 1.4, 'pop', { note: 'last hat', gain: 0.3 });
  }
  // S53 · soldiers and townspeople (Indian + European) gather in the courtyard
  { const st = at(40), tp = Wd('townspeople', 40);
    add({ id: 'B3-S53', at: st, beat: 3, year: 1655, enter: 'whip', cam: K.cam.drift(90, 960, 540, 1.05), note: 'soldiers and townspeople gather',
      draw(lt, d, t) { K.daySky(55, 620); K.fortDansborg(960, 760, 1.3, t, {}); ground(760, '#C9B48A');
        crowd([['soldier', 300, 1000], ['soldier', 470, 1020], ['portuguese', 640, 990]], t, 340);
        if (t > tp) crowd([['weaver', 1180, 1010, { a: pop(t, tp) }], ['trader', 1360, 990, { a: pop(t, tp + 0.15) }], ['defender', 1540, 1015, { a: pop(t, tp + 0.3) }], ['child', 1660, 1020, { a: pop(t, tp + 0.4) }]], t, 340); } });
    ev(st + 0.3, 'appear', { note: 'soldiers', type: 'tap' }); ev(tp, 'appear', { note: 'townspeople join', type: 'bed', name: 'crowd', dur: 2.0 });
  }
  // S54 · hands rise; SNAP on "chose": Kongsbakke stepped forward
  { const st = at(41), ch = Wd('chose', 41);
    add({ id: 'B3-S54', at: st, beat: 3, year: 1655, cam: K.cam.push(960, 520, 0.09), snaps: [snap(ch, 960, 470, 1.18)], note: 'chosen',
      draw(lt, d, t) { K.daySky(56, 620); ground(760, '#C9B48A'); const up = t > ch - 0.2; const k = eio(clamp((t - ch) / 0.5));
        crowd([['soldier', 320, 1020, { arm: up ? 150 : 0 }], ['weaver', 520, 1000, { arm: up ? 150 : 0 }], ['trader', 1400, 1000, { arm: up ? 150 : 0 }], ['portuguese', 1600, 1020, { arm: up ? 150 : 0 }]], t, 360);
        K.person({ who: 'kongsOld', x: 960, y: lerp(1000, 960, k), h: lerp(460, 560, k), t, prop: null, look: k > 0.5 ? 'up' : '' }); } });
    ev(ch - 0.2, 'appear', { note: 'hands rise', type: 'whip', gain: 0.4 });
  }
  // S55 · his ledger: crossed-out marks, an ink blot
  { const st = at(42), il = Wd('illiterate', 42);
    add({ id: 'B3-S55', at: st, beat: 3, year: 1655, cam: K.cam.push(900, 520, 0.07), note: 'almost illiterate',
      draw(lt, d, t) { K.parchment(57); K.ledger(900, 540, 1.2, t, 0.4 + 0.3 * clamp(lt / d), { blot: t > il }); } });
    ev(il, 'write', { note: 'crossed-out marks' });
  }
  // S56 · India map: the only crimson star; SNAP on "India"
  { const st = at(43), ch = Wd('charge', 43), ind = Wd('india', 43);
    add({ id: 'B3-S56', at: st, beat: 3, year: 1655, enter: 'whip', cam: K.cam.push(1120, 600, 0.07), snaps: [snap(ind, 1150, 640, 1.3)], note: "Denmark's only colony in India",
      draw(lt, d, t) { const pr = K.realMap('sea', { view: [66, 4, 96, 30] }); const [tx, ty] = K.place(pr, 'Tranquebar'); K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 40, 0, TAU); }, P.crimson, clamp((t - ch) / 0.6), tx, ty, 48, 2); circle(tx, ty, 9, P.ink); K.slip('THE ONLY DANISH COLONY', tx - 330, ty - 160, pop(t, ch + 0.3), -0.02, 36); } });
    ev(ch, 'ink', { note: 'the only colony' });
  }
  // S57 · the Nayak's green tide pulses at the map's inland edge on "enemy"; sting
  { const st = at(44), en = Wd('enemy', 44);
    add({ id: 'B3-S57', at: st, beat: 3, year: 1655, cam: K.cam.push(1060, 520, 0.08), note: 'an enemy appears, sting',
      draw(lt, d, t) { const pr = K.realMap('south', { view: [75.8, 8.9, 83.2, 13.0] }); const [tx, ty] = K.place(pr, 'Tranquebar'), [jx, jy] = K.place(pr, 'Tanjore'); const land = shapeOf(pr, K.GEO.data.south.land);
        K.greenTide(land, clamp((t - en + 0.2) / 0.8) * 0.7 + 0.08 * Math.sin(t * 5) * (t > en ? 1 : 0), jx, jy, 520, 3); K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 34, 0, TAU); }, P.crimson, 1, tx, ty, 40, 2); circle(jx, jy, 10, P.ink); K.slip('TANJORE', jx - 40, jy - 70, pop(t, en), -0.02, 38); } });
    ev(en, 'ink', { note: 'green tide' }); ev(Le(44) - 0.05, 'sting', { note: 'beat 3 sting' });
  }
}
