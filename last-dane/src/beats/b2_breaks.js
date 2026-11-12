// BEAT 2 · 1648 · THE COLONY BREAKS (lines 23-36)
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, rnd, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground, crowd } from './common.js';
const { P, cut, P_rr } = K;

export function b2(add, ev, snap) {
  // S30 · whip → Dansborg 'lonely' at dusk; cracks run across the walls on "apart"
  { const st = at(23), ap = Wd('apart', 23);
    add({ id: 'B2-S30', at: st, beat: 2, year: 1648, enter: 'whip', cam: K.cam.push(900, 560, 0.07), note: 'fort at dusk, cracks on "apart"',
      draw(lt, d, t) { K.daySky(41, 640, false); dim(0.35, '#7A4B3A'); K.sea(700, t); K.fortDansborg(900, 880, 1.25, t, { cracks: clamp((t - ap) / 0.6), lamps: 0.4 }); ground(880, '#B9A98C'); } });
    ev(ap, 'appear', { note: 'cracks run', type: 'snap' });
  }
  // S31 · mutiny night: soldiers with lanterns crowd the courtyard; they all turn on "mutinied"
  { const st = at(24), mu = Wd('mutinied', 24);
    add({ id: 'B2-S31', at: st, beat: 2, year: 1648, enter: 'whip', cam: K.cam.push(960, 600, 0.08), note: 'mutiny night: soldiers turn',
      draw(lt, d, t) { K.nightSky(42, t, 500); K.fortDansborg(960, 760, 1.6, t, { night: 1, lamps: 0.9, flag: true }); ground(760, '#4A3E33');
        const turn = t > mu; for (let i = 0; i < 7; i++) K.person({ who: 'soldier', x: 260 + i * 230, y: 1000 - (i % 2) * 30, h: 380, t, seed: i, dir: turn ? (i < 3 ? 1 : -1) : (i % 2 ? 1 : -1), mood: turn ? 'stern' : '', prop: i % 2 ? 'lantern' : 'pike' }); } });
    ev(st + 0.6, 'appear', { note: 'boots shuffle', type: 'tap' }); ev(mu, 'flag', { note: 'they turn', type: 'whip', gain: 0.5 });
  }
  // S32 · the governor led away by lantern light; a door shuts on "arrested"
  { const st = at(25), ar = Wd('arrested', 25);
    add({ id: 'B2-S32', at: st, beat: 2, year: 1648, cam: K.cam.push(1100, 560, 0.08), note: 'governor led away',
      draw(lt, d, t) { K.nightSky(43, t, 520); ground(800, '#4A3E33'); K.door(1500, 800, 1.1, clamp((t - ar - 0.4) / 0.3));
        const k = eio(clamp(lt / d)); K.person({ who: 'korsor', over: { hat: 'tricorn' }, x: lerp(800, 1330, k), y: 1000, h: 420, t, walk: t * 5, look: 'down' });
        K.person({ who: 'soldier', x: lerp(620, 1150, k), y: 1000, h: 420, t, walk: t * 5 + 1, prop: 'lantern', arm: 40 }); K.person({ who: 'soldier', x: lerp(1000, 1520, k), y: 1010, h: 420, t, walk: t * 5 + 2, prop: 'pike' }); } });
    ev(ar + 0.4, 'door', { note: 'door shuts' });
  }
  // S33 · COPENHAGEN, cold: the Baltic between Danish and Swedish flags; smoke of war
  { const st = at(26), sw = Wd('sweden', 26);
    add({ id: 'B2-S33', at: st, beat: 2, year: 1648, enter: 'whip', cam: K.cam.drift(100, 960, 520, 1.05), note: 'Copenhagen: wars with Sweden',
      draw(lt, d, t) { const pr = K.realMap('north', { view: [5.5, 54.0, 19.5, 59.6] }), G = K.GEO.data;
        const sh = (r) => () => { ctx.beginPath(); for (const ring of r) ring.forEach(([lo, la], i) => { const [px, py] = pr(lo, la); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); };
        ctx.save(); ctx.globalAlpha = 0.8; sh(G.countries.Denmark)(); ctx.fillStyle = P.crimson; ctx.fill('evenodd'); ctx.globalAlpha = 0.9; sh(G.countries.Sweden)(); ctx.fillStyle = '#6F86A6'; ctx.fill('evenodd'); ctx.restore();
        const [cx, cy] = K.place(pr, 'Copenhagen'); K.danishFlag(cx - 120, cy - 40, 120, t, { pole: 160 });
        ctx.save(); ctx.translate(1500, 340); ctx.scale(0.7, 0.7); ctx.fillStyle = '#F3E9D2'; ctx.fillRect(-90, -60, 180, 120); ctx.fillStyle = '#C8952F'; ctx.fillRect(-90, -14, 180, 28); ctx.fillRect(-40, -60, 28, 120); ctx.globalAlpha = 0.85; ctx.fillStyle = '#3D5A80'; ctx.fillRect(-90, -60, 50, 46); ctx.fillRect(-12, -60, 102, 46); ctx.fillRect(-90, 14, 50, 46); ctx.fillRect(-12, 14, 102, 46); ctx.restore();
        if (t > sw) for (let i = 0; i < 6; i++) { const k = clamp((t - sw - i * 0.12) / 0.6); ctx.save(); ctx.globalAlpha = 0.85 * k; ctx.translate(900 + (i % 3) * 120, 520 - k * 60 - Math.floor(i / 3) * 70); ctx.scale(0.6 + k * 0.4, 0.6 + k * 0.4); cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-40, 0, 38], [0, -24, 46], [40, 0, 36]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } }, '#8F8578', { shadow: 0.3, edge: 3 }); ctx.restore(); }
        K.coldWash(0.6); } });
    ev(sw, 'appear', { note: 'smoke of war', type: 'swell', dur: 1.2 });
  }
  // S34 · an empty Copenhagen dock; a ship turned back on "spared"
  { const st = at(27), sp = Wd('spared', 27);
    add({ id: 'B2-S34', at: st, beat: 2, year: 1649, cam: K.cam.push(900, 600, 0.07), note: 'empty dock, ship turned back',
      draw(lt, d, t) { K.daySky(44, 600, false); K.sea(640, t, 3, ['#8FA6A6', '#7D9494']); ground(840, '#8A6A48'); const k = eio(clamp((t - sp + 0.6) / 1.4)); K.ship(lerp(1300, 1700, k), 760 + K.idle.bob(t, 4, 5), lerp(0.7, 0.4, k), 0); K.stamp('NO SHIPS', 620, 360, pop(t, sp, 0.2), -0.1, 70); K.coldWash(1); } });
    ev(sp, 'stamp', { note: 'NO SHIPS' });
  }
  // S35 · 1650: the ledger slams shut; DISSOLVED; stat card; SNAP on "dissolved"
  { const st = at(28), ds = Wd('dissolved', 29), bk = Wd('bankrupt', 29);
    add({ id: 'B2-S35', at: st, beat: 2, year: 1650, cam: K.cam.push(960, 540, 0.07), snaps: [snap(ds, 960, 520, 1.2)], note: 'company dissolved 1650',
      draw(lt, d, t) { K.parchment(45); const shut = clamp((t - st - 0.3) / 0.25); ctx.save(); ctx.translate(960, 560); ctx.scale(1 - shut * 0.5, 1); ctx.translate(-960, -560); K.ledger(960, 560, 1.0, t, 1, { hand: false }); ctx.restore();
        if (t > bk) K.seal(1380, 380, pop(t, bk) * 0.7, 'C'); K.stamp('DISSOLVED', 960, 560, pop(t, ds, 0.18), -0.12, 110); K.coldWash(0.5); },
      overlay(lt, d, t) { K.statCard('1650', 'COMPANY DISSOLVED', 1560, 700, pop(t, Wd('sixteen', 28)), { date: 1, size: 88 }); } });
    ev(st + 0.3, 'seal', { note: 'ledger slams' }); ev(bk, 'stamp', { note: 'bankrupt seal', gain: 0.5 }); ev(Wd('sixteen', 28), 'stat', { note: 'stat 1650' });
  }
  // S36 · map: Tranquebar's crimson drains to an outline; ORPHAN
  { const st = at(30), or = Wd('orphan', 30);
    add({ id: 'B2-S36', at: st, beat: 2, year: 1650, enter: 'whip', cam: K.cam.push(1060, 520, 0.08), note: 'orphan colony',
      draw(lt, d, t) { const pr = K.realMap('south', { view: [75.8, 8.9, 83.2, 13.0] }); const [tx, ty] = K.place(pr, 'Tranquebar'); const fade = clamp((t - or) / 0.8);
        ctx.save(); ctx.globalAlpha = 1 - fade; K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 40, 0, TAU); }, P.crimson, 1, tx, ty, 48, 2); ctx.restore(); ctx.strokeStyle = P.crimson; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(tx, ty, 40, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        K.slip('TRANQUEBAR', tx + 190, ty - 90, 1, 0.02, 32); K.stamp('ORPHAN', tx - 330, ty - 150, pop(t, or, 0.2), -0.08, 80); } });
    ev(or, 'stamp', { note: 'ORPHAN' });
  }
  // S37 · lonely fort: a handful of soldiers pop up one by one
  { const st = at(31), so = Wd('soldiers', 31);
    add({ id: 'B2-S37', at: st, beat: 2, year: 1650, enter: 'whip', cam: K.cam.drift(90, 960, 560, 1.05), note: 'a fort, a few soldiers',
      draw(lt, d, t) { K.daySky(46, 640); K.sea(700, t); K.fortDansborg(960, 860, 1.2, t, {}); ground(860);
        for (let i = 0; i < 4; i++) { const k = pop(t, so - 0.2 + i * 0.15); if (k > 0) K.person({ who: 'soldier', x: 520 + i * 300, y: 1010, h: 300 * k, t, seed: i, prop: 'pike' }); } } });
    ev(st + 0.2, 'pop', { note: 'fort' }); ev(so, 'pop', { note: 'few soldiers' });
  }
  // S38 · the rent bill lands on a Copenhagen desk, swept into the bin
  { const st = at(32), cp = Wd('copenhagen', 32), pay = Wd('pay', 32);
    add({ id: 'B2-S38', at: st, beat: 2, year: 1650, enter: 'whip', cam: K.cam.push(900, 560, 0.07), note: 'rent bill into the bin',
      draw(lt, d, t) { K.parchment(47); ground(900, '#7A6650'); K.letterBin(960, 640, 1.3, t, clamp((t - cp) / 1.0)); K.person({ who: 'clerk', x: 420, y: 1000, h: 520, t, arm: t > cp && t < cp + 0.8 ? 60 : 10 }); if (t < cp) K.rentSlip(820, 380, 0.5, {}); K.stamp('UNPAID', 1500, 300, pop(t, pay, 0.2), 0.1, 64); K.coldWash(1); } });
    ev(cp, 'page', { note: 'bill swept off' }); ev(pay, 'stamp', { note: 'UNPAID' });
  }
  // S39 · Kongsbakke older, the quartermaster: keys + ledger
  { const st = at(33), qm = Wd('quartermaster', 33);
    add({ id: 'B2-S39', at: st, beat: 2, year: 1650, enter: 'whip', cam: K.cam.push(860, 480, 0.08), note: 'Kongsbakke, quartermaster',
      draw(lt, d, t) { K.daySky(48, 700); K.fortDansborg(1400, 800, 0.8, t, {}); ground(800, '#B9A98C'); K.person({ who: 'kongsOld', x: 860, y: 1040, h: 700, t, prop: 'ledger', arm: 30 }); K.slip('QUARTERMASTER', 860, 230, pop(t, qm), -0.02, 46); } });
    ev(qm, 'pop', { note: 'QUARTERMASTER' });
  }
  // S40 · SNAP on "one thing": he rings the fort bell
  { const st = at(34), on = Wd('one', 34);
    add({ id: 'B2-S40', at: st, beat: 2, year: 1650, cam: K.cam.push(960, 420, 0.06), snaps: [snap(on, 1100, 360, 1.25)], note: 'he rings the bell',
      draw(lt, d, t) { K.daySky(49, 760, false); cut(P_rr(980, 140, 240, 620, 4), P.stone, { shadow: 0.8, edge: 5 }); ctx.save(); ctx.translate(1100, 300); ctx.rotate(t > on ? Math.sin((t - on) * 10) * 0.35 * Math.exp(-(t - on) * 1.5) : 0); cut(() => { ctx.beginPath(); ctx.moveTo(-70, 120); ctx.quadraticCurveTo(-70, 0, 0, 0); ctx.quadraticCurveTo(70, 0, 70, 120); ctx.closePath(); }, P.gold, { shadow: 0.6, edge: 4 }); ctx.restore(); ground(760, '#B9A98C'); K.person({ who: 'kongsOld', x: 760, y: 1000, h: 560, t, arm: t > on ? 120 : 40, prop: null }); } });
    ev(on, 'bell', { note: 'bell' });
  }
  // S41 · soldiers drill on the rampart: march + turn on "drill"
  { const st = at(35), dr = Wd('drill', 35);
    add({ id: 'B2-S41', at: st, beat: 2, year: 1650, cam: K.cam.drift(-100, 960, 540, 1.05), note: 'guard and drill',
      draw(lt, d, t) { K.daySky(50, 560); for (let x = -100; x < W + 100; x += 140) cut(P_rr(x, 560, 90, 60, 4), P.stone, { shadow: 0.4, edge: 4 }); cut(P_rr(-300, 610, W + 600, 600, 0), P.stone, { shadow: 0.6, edge: 5 }); K.danishFlag(1650, 610, 200, t);
        const turn = t > dr; for (let i = 0; i < 5; i++) K.person({ who: 'soldier', x: 300 + i * 260 + (turn ? 0 : Math.sin(t * 3) * 10), y: 1000, h: 420, t, seed: i, dir: turn ? -1 : 1, walk: turn ? undefined : t * 6 + i, prop: 'pike' }); } });
    ev(st + 0.3, 'appear', { note: 'march', type: 'tap' }); ev(dr, 'flag', { note: 'about turn', type: 'snap', gain: 0.5 });
  }
  // S42 · he looks at the empty sea; slow push; sting
  { const st = at(36);
    add({ id: 'B2-S42', at: st, beat: 2, year: 1650, cam: K.cam.push(1300, 560, 0.10), note: 'empty horizon, sting',
      draw(lt, d, t) { K.daySky(51, 600); K.sea(640, t); ground(860); K.person({ who: 'kongsOld', x: 560, y: 1040, h: 620, t, dir: 1, prop: 'spyglass', arm: 70 }); } });
    ev(st + 0.4, 'appear', { note: 'empty horizon', sfx: false }); ev(Le(36) - 0.05, 'sting', { note: 'beat 2 sting' });
  }
}
