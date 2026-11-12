// BEAT 8 · 1669 · NO THANKS (lines 92-104). Eggers sidelines him; the quote (translated); the king backs him; death c. 1674.
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground } from './common.js';
const { P, cut, P_rr, P_poly } = K;
/** a cold stone hall inside Dansborg */
function hall(t, cold = 1) { K.parchment(101); cut(P_rr(-300, -300, W + 600, 1200, 0), P.stone, { shadow: 0, edge: 0 }); for (const x of [260, 960, 1660]) cut(() => { ctx.beginPath(); ctx.moveTo(x - 160, 900); ctx.lineTo(x - 160, 420); ctx.arc(x, 420, 160, Math.PI, TAU); ctx.lineTo(x + 160, 900); ctx.closePath(); }, P.stoneDark, { shadow: 0, edge: 0 });
  cut(P_rr(-300, 900, W + 600, 400, 0), '#7E6A50', { shadow: 0.5, edge: 4 }); ctx.save(); ctx.globalAlpha = 0.28 * cold; ctx.fillStyle = P.royal; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }

export function b8(add, ev, snap) {
  // S130 · whip → the hall, a laurel wreath hangs; BEAT CARD
  { const st = at(92), hr = Wd('hero', 92);
    add({ id: 'B8-S130', at: st, beat: 8, year: 1669, enter: 'whip', cam: K.cam.push(960, 420, 0.07), note: "a hero's welcome?",
      draw(lt, d, t) { hall(t, 0.3); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(960, 120); ctx.lineTo(960, 300); ctx.stroke(); ctx.save(); ctx.translate(960, 380); ctx.rotate(K.idle.sway(t, 1, 0.05)); K.wreath(0, 0, 90, 1); ctx.restore(); K.person({ who: 'kongsOld', x: 960, y: 1040, h: 560, t, look: 'up', prop: null }); if (t > hr) { ctx.save(); ctx.globalAlpha = 0.3 * pop(t, hr); ctx.fillStyle = '#FFE7A0'; ctx.beginPath(); ctx.arc(960, 380, 200, 0, TAU); ctx.fill(); ctx.restore(); } } });
    ev(hr, 'appear', { note: 'wreath glows', type: 'swell', dur: 0.8 });
  }
  // S131 · SNAP on "opposite": the wreath drops; cold silence + one footstep
  { const st = at(93), op = Wd('opposite', 93);
    add({ id: 'B8-S131', at: st, beat: 8, year: 1669, cam: K.cam.push(960, 600, 0.05), snaps: [snap(op, 960, 640, 1.25)], note: 'he got the opposite',
      draw(lt, d, t) { hall(t, 1); const f = eio(clamp((t - op) / 0.5)); ctx.save(); ctx.translate(960, lerp(380, 880, f)); ctx.rotate(f * 0.6); K.wreath(0, 0, 90, 1 - f * 0.4); ctx.restore(); K.person({ who: 'kongsOld', x: 1160, y: 1040, h: 560, t, look: 'down', prop: null }); } });
    ev(op, 'snap', { note: 'wreath falls' }); ev(op + 0.5, 'tap', { note: 'one footstep', type: 'tap', gain: 0.8 });
  }
  // S132 · Eggers and his officers loom tall, looking down at him
  { const st = at(94), dn = Wd('down', 94);
    add({ id: 'B8-S132', at: st, beat: 8, year: 1669, enter: 'whip', cam: K.cam.push(700, 560, 0.08), note: 'they look down on him',
      draw(lt, d, t) { hall(t, 1); K.person({ who: 'kongsOld', x: 520, y: 1040, h: 440, t, mood: 'worried', prop: null }); K.person({ who: 'officer', x: 1500, y: 1060, h: 700, t, dir: -1, seed: 4 }); K.person({ who: 'officer', x: 1260, y: 1060, h: 720, t, dir: -1, seed: 6 }); K.person({ who: 'eggers', x: 1000, y: 1070, h: 780, t, dir: -1, look: t > dn ? 'down' : '' }); } });
    ev(st + 0.3, 'appear', { note: 'officers loom', type: 'tap' }); ev(dn, 'appear', { note: 'they look down', type: 'swell', dur: 0.8 });
  }
  // S133 · his ledger with crossed-out letters; a smirk
  { const st = at(95), cm = Wd('commoner', 95);
    add({ id: 'B8-S133', at: st, beat: 8, year: 1669, cam: K.cam.push(900, 520, 0.07), note: 'the commoner who could barely write',
      draw(lt, d, t) { K.parchment(102); K.ledger(860, 560, 1.0, t, 0.6, { blot: 1, hand: false }); K.person({ who: 'eggers', x: 1600, y: 1180, h: 900, t, dir: -1, mood: 'sneer', look: 'down' }); K.stamp('COMMONER', 820, 200, pop(t, cm, 0.2), -0.06, 64); } });
    ev(cm, 'stamp', { note: 'COMMONER' });
  }
  // S134 · Eggers slides Kongsbakke's chair and keys aside on "pushed"
  { const st = at(96), ps = Wd('pushed', 96);
    add({ id: 'B8-S134', at: st, beat: 8, year: 1669, cam: K.cam.push(960, 600, 0.06), note: 'pushed aside',
      draw(lt, d, t) { hall(t, 1); const k = eio(clamp((t - ps) / 0.6)); cut(P_rr(lerp(820, 300, k), 700, 220, 40, 6), '#6E5238', { shadow: 0.6, edge: 3 }); cut(P_rr(lerp(820, 300, k) + 20, 500, 40, 220, 6), '#6E5238', { shadow: 0.6, edge: 3 }); ctx.strokeStyle = P.gold; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lerp(1040, 1480, k), 690, 20, 0, TAU); ctx.stroke();
        K.person({ who: 'eggers', x: 1200, y: 1060, h: 700, t, dir: -1, arm: t > ps ? 70 : 10 }); K.person({ who: 'kongsOld', x: lerp(620, 260, k), y: 1060, h: 520, t, mood: 'worried', prop: null }); } });
    ev(ps, 'whip', { note: 'chair slides', gain: 0.5 });
  }
  // S135-137 · he writes, hard; the QUOTE on a torn slip, labelled as a translation
  { const st = at(97), q0 = L(98), q2 = Le(100);
    add({ id: 'B8-S135', at: st, beat: 8, year: 1669, cam: K.cam.push(860, 520, 0.08), note: 'he complains bitterly',
      draw(lt, d, t) { K.parchment(103); dim(0.5, K.NAVY); cut(P_rr(300, 760, 1320, 50, 6), '#4A3A2E', { shadow: 0.6, edge: 4 }); K.lantern(1260, 690, 1.3, t, 1.3); K.person({ who: 'kongsOld', x: 640, y: 1060, h: 640, t, mood: 'stern', look: 'down', prop: 'quill', arm: 40 + Math.sin(t * 14) * 6 }); } });
    add({ id: 'B8-S136', at: q0 - 0.08, beat: 8, year: 1670, cam: K.cam.push(960, 480, 0.05), note: 'the quote (translated)',
      draw(lt, d, t) { K.parchment(104); dim(0.2, '#7A4B3A'); K.quoteSlip(['That is the honour one gets', 'for five years of service in Europe,', 'and thirty years in India.'], 'KONGSBAKKE, COMPLAINT ABOUT EGGERS (TRANSLATED)', 960, 440, clamp((t - q0 + 0.1) / (q2 - q0)), 60); } });
    ev(st + 0.3, 'write', { note: 'hard quill' }); ev(q0, 'card', { note: 'quote slip' }); ev(L(99), 'write', { note: 'line 2', dur: 0.6 }); ev(L(100), 'write', { note: 'line 3', dur: 0.6 });
  }
  // S138 · the King: a seal + a distant silhouette; seal on "backed"; Eggers' ship leaves on "home"
  { const st = at(101), bk = Wd('backed', 101), hm = Wd('home', 101);
    add({ id: 'B8-S138', at: st, beat: 8, year: 1670, enter: 'whip', cam: K.cam.push(960, 520, 0.06), note: 'the king backs him; Eggers called home',
      draw(lt, d, t) { K.daySky(105, 620, false); K.sea(660, t, 3, ['#8FA6A6', '#7D9494']); K.person({ who: 'king', x: 300, y: 1000, h: 640, t, a: 0.8 }); if (t > bk) K.seal(760, 340, pop(t, bk, 0.18) * 0.8, '♛'); const k = eio(clamp((t - hm + 0.2) / 1.6)); K.ship(lerp(1300, 1800, k), lerp(820, 690, k), lerp(0.8, 0.3, k), 0); K.slip('EGGERS: SENT TO COPENHAGEN', 1250, 300, pop(t, hm), 0.02, 34); K.coldWash(0.35); } });
    ev(bk, 'seal', { note: "king's seal" }); ev(hm, 'pop', { note: 'Eggers sails' });
  }
  // S139 · Kongsbakke in command at Dansborg; era bar 1669 → 1674
  { const st = at(102), cm = Wd('command', 102);
    add({ id: 'B8-S139', at: st, beat: 8, year: 1670, yearAt: (lt) => lerp(1670, 1674, clamp(lt / 3)), cam: K.cam.drift(90, 960, 540, 1.05), note: 'in command at Dansborg',
      draw(lt, d, t) { K.daySky(106, 640); K.sea(700, t); K.fortDansborg(1100, 860, 1.2, t, { wall: 1, towers: 4, houses: 1 }); ground(860); K.person({ who: 'kongsOld', x: 520, y: 1040, h: 560, t, prop: 'lantern', arm: 25 }); K.slip('COMMANDER', 520, 300, pop(t, cm), -0.03, 44); } });
    ev(cm, 'pop', { note: 'COMMANDER' });
  }
  // S140 · a grave with a lantern; STAT CARD DIED C. 1674; push
  { const st = at(103), dd = Wd('died', 103);
    add({ id: 'B8-S140', at: st, beat: 8, year: 1674, cam: K.cam.push(960, 640, 0.10), note: 'grave with a lantern',
      draw(lt, d, t) { K.daySky(107, 760, false); dim(0.35, K.NAVY); ground(800, '#7E6A50'); K.grave(960, 900, 1.3, t); },
      overlay(lt, d, t) { K.statCard('c. 1674', 'KONGSBAKKE DIES AT DANSBORG', 1450, 380, pop(t, dd), { date: 1, size: 80 }); } });
    ev(dd, 'stat', { note: 'died c. 1674' });
  }
  // S141 · world map: a dotted route home that never finishes; sting
  { const st = at(104), hm = Wd('home', 104);
    add({ id: 'B8-S141', at: st, beat: 8, year: 1674, enter: 'whip', cam: K.cam.push(900, 420, 0.07), note: 'never saw home again, sting',
      draw(lt, d, t) { const pr = K.realMap('world', { view: [-62, -44, 158, 78] }); K.geoRoute(pr, ['Tranquebar', [74, 6], [62, 0], [55, -20], [35, -36], 'Cape of Good Hope', [10, -36], [-8, -20], [-22, 10], [-12, 35], [4, 51], 'Copenhagen'], 0.55 * eo(clamp(lt / 1.4)), { wobble: 4 }); const [cx, cy] = K.place(pr, 'Copenhagen'); circle(cx, cy, 10, P.ink); K.slip('COPENHAGEN', cx + 150, cy + 10, 1, 0.02, 30); if (t > hm) { ctx.save(); ctx.globalAlpha = clamp((t - hm) * 2) * 0.6; ctx.fillStyle = '#2B2D3A'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); } } });
    ev(st + 0.2, 'route', { note: 'route stops halfway', dur: 1.2 }); ev(Le(104) - 0.05, 'sting', { note: 'beat 8 sting' });
  }
}
