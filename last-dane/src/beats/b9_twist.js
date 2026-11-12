// BEAT 9 · TODAY · HERO? (lines 105-118 + end screen). The myth questioned (hedged), the takeaway, the flag to 1845.
import { ctx, W, H, TAU, clamp, lerp, eo, eio, eob, circle } from '../core/lib.js';
import { L, Le, Wd, T } from '../core/timing.js';
import * as K from '../core/kit.js';
import { at, pop, dim, ground, crowd } from './common.js';
import { siegeNight } from './b0_cold.js';
const { P, cut, P_rr, P_poly } = K;

function market(t, n = 1) {
  K.daySky(111, 640); K.fortDansborg(960, 760, 1.0, t, { wall: 1, towers: 4, houses: 1 }); ground(760, '#C9B48A');
  for (let i = 0; i < 4; i++) { cut(P_rr(180 + i * 430, 840, 220, 90, 8), ['#C8952F', '#A8503E', '#7E8B5A', '#C9B48A'][i], { shadow: 0.6, edge: 3 }); for (let k = 0; k < 3; k++) cut(P_rr(195 + i * 430 + k * 66, 815, 54, 30, 6), ['#E9DCBC', '#A8322D', '#3D5A80'][(i + k) % 3], { shadow: 0.3, edge: 2 }); }
  const people = [['weaver', 260], ['trader', 470], ['child', 640], ['defender', 820], ['weaver', 1080], ['trader', 1290], ['portuguese', 1470], ['soldier', 1660], ['child', 1780]];
  people.slice(0, Math.ceil(people.length * n)).forEach(([w, x], i) => K.person({ who: w, x: x + Math.sin(t * 0.6 + i) * 20, y: 1040 - (i % 2) * 20, h: 300, t, seed: i, walk: i % 3 === 0 ? t * 4 + i : undefined }));
}

export function b9(add, ev, snap) {
  // S150 · whip → the 1907 hero book; BEAT CARD
  { const st = at(105), hs = Wd('historians', 105);
    add({ id: 'B9-S150', at: st, beat: 9, enter: 'whip', cam: K.cam.push(560, 520, 0.06), note: 'the 1907 hero book',
      draw(lt, d, t) { ctx.save(); K.bookVsNotebook(t, 0); ctx.restore(); K.slip('HISTORIANS, 1907', 1300, 300, pop(t, hs), 0.02, 44); } });
    ev(hs, 'pop', { note: 'historians' });
  }
  // S151 · LOYAL slip; the wreath glows
  { const st = at(106), ly = Wd('loyal', 106);
    add({ id: 'B9-S151', at: st, beat: 9, cam: K.cam.push(560, 460, 0.08), note: 'the loyal man who saved the colony',
      draw(lt, d, t) { K.bookVsNotebook(t, 0); K.stamp('LOYAL HERO', 1250, 420, pop(t, ly, 0.2), -0.06, 80); } });
    ev(ly, 'stamp', { note: 'LOYAL HERO' });
  }
  // S152 · the modern notebook slides in with question marks
  { const st = at(107), ar = Wd('argue', 107);
    add({ id: 'B9-S152', at: st, beat: 9, cam: K.cam.push(960, 540, 0.05), note: 'today: less simple',
      draw(lt, d, t) { K.bookVsNotebook(t, clamp((t - ar + 0.2) / 0.6)); K.slip('TODAY', 1370, 150, pop(t, ar + 0.4), 0.02, 40); } });
    ev(ar - 0.2, 'page', { note: 'notebook slides in' });
  }
  // S153 · Tranquebar market: weavers, traders, families
  { const st = at(108), mc = Wd('multicultural', 108);
    add({ id: 'B9-S153', at: st, beat: 9, enter: 'whip', cam: K.cam.drift(120, 960, 560, 1.05), note: 'a multicultural town',
      draw(lt, d, t) { market(t, 0.4 + 0.6 * clamp((t - st) / 1.5)); K.slip('MULTICULTURAL', 960, 250, pop(t, mc), -0.02, 44); } });
    ev(st + 0.3, 'appear', { note: 'market', type: 'bed', name: 'crowd', dur: 2.4 }); ev(mc, 'pop', { note: 'MULTICULTURAL' });
  }
  // S154 · a hedged silhouette beside him ("may have")
  { const st = at(109), mh = Wd('may', 109);
    add({ id: 'B9-S154', at: st, beat: 9, cam: K.cam.push(960, 520, 0.07), note: 'he may have married an Indian woman (hedged)',
      draw(lt, d, t) { K.parchment(112); dim(0.15, '#7A4B3A'); ground(880, '#C9B48A'); K.person({ who: 'kongsOld', x: 780, y: 1040, h: 620, t, prop: null }); K.person({ who: 'silhouette', x: 1140, y: 1040, h: 580, t, dir: -1, a: 0.55 * pop(t, mh) }); if (t > mh) { ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = P.sepia; ctx.lineWidth = 4; ctx.strokeRect(960, 380, 360, 680); ctx.restore(); } K.slip('MAY HAVE', 1140, 330, pop(t, mh + 0.2), 0.03, 40); } });
    ev(mh, 'appear', { note: 'hedged silhouette', type: 'brush' });
  }
  // S155-156 · sea map: routes inside Asia glow; the dashed route to Copenhagen fades
  { const st = at(110), as = Wd('asia', 110), wt = Wd('waiting', 111);
    add({ id: 'B9-S155', at: st, beat: 9, enter: 'whip', cam: K.cam.push(1000, 520, 0.06), note: 'trade inside Asia vs waiting',
      draw(lt, d, t) { const pr = K.realMap('sea', { view: [64, -16, 128, 28] }); const g = clamp((t - as) / 1.0); [['Tranquebar', [90, 2], [100, -4], 'Bantam'], ['Bantam', [112, -6.5], 'Makassar'], ['Tranquebar', [83, 14], [87.5, 19.5]]].forEach((r, i) => K.geoRoute(pr, r, clamp(g * 1.3 - i * 0.15), { wobble: 3 }));
        const [tx, ty] = K.place(pr, 'Tranquebar'); circle(tx, ty, 12, P.crimson); const fade = 1 - clamp((t - wt) / 1.2); ctx.save(); ctx.globalAlpha = fade; ctx.strokeStyle = P.royal; ctx.lineWidth = 7; ctx.setLineDash([14, 14]); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(300, 500, -100, 300); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); if (fade > 0.05) K.slip('TO COPENHAGEN', 260, 420, fade, -0.04, 30); K.slip('TRADE IN ASIA', 1380, 330, pop(t, as), 0.02, 40); } });
    add({ id: 'B9-S156', at: at(111), beat: 9, cam: K.cam.push(700, 480, 0.06), note: 'waiting for ships',
      draw(lt, d, t) { const pr = K.realMap('sea', { view: [64, -16, 128, 28] }); [['Tranquebar', [90, 2], [100, -4], 'Bantam'], ['Bantam', [112, -6.5], 'Makassar'], ['Tranquebar', [83, 14], [87.5, 19.5]]].forEach((r) => K.geoRoute(pr, r, 1, { wobble: 3 })); const [tx, ty] = K.place(pr, 'Tranquebar'); circle(tx, ty, 12, P.crimson);
        const fade = 1 - clamp((t - wt) / 1.2); ctx.save(); ctx.globalAlpha = fade; ctx.strokeStyle = P.royal; ctx.lineWidth = 7; ctx.setLineDash([14, 14]); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(300, 500, -100, 300); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); if (fade > 0.05) K.slip('TO COPENHAGEN', 260, 420, fade, -0.04, 30); K.slip('TRADE IN ASIA', 1380, 330, 1, 0.02, 40); } });
    ev(as, 'route', { note: 'Asian routes glow', dur: 1.0 }); ev(wt, 'appear', { note: 'Copenhagen route fades', type: 'brush' });
  }
  // S157 · Kongsbakke with the lantern; the real lesson
  { const st = at(112), ls = Wd('lesson', 112);
    add({ id: 'B9-S157', at: st, beat: 9, enter: 'whip', cam: K.cam.push(900, 420, 0.10), note: 'the real lesson',
      draw(lt, d, t) { K.daySky(113, 700); ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#E9A86A'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); ground(820, '#C9B48A'); K.person({ who: 'kongsOld', x: 900, y: 1100, h: 900, t, prop: 'lantern', arm: 25 }); K.slip('THE REAL LESSON?', 1450, 300, pop(t, ls), 0.03, 44); } });
    ev(ls, 'pop', { note: 'lesson' }); ev(st + 0.3, 'swell', { note: 'push', type: 'swell', dur: 1.2 });
  }
  // S158 · Copenhagen's cold wash slides away from him
  { const st = at(113), dk = Wd('denmark', 113);
    add({ id: 'B9-S158', at: st, beat: 9, cam: K.cam.drift(-100, 960, 540, 1.05), note: 'not because Denmark helped him',
      draw(lt, d, t) { K.daySky(114, 700); K.sea(720, t); ground(860, '#C9B48A'); K.fortDansborg(1300, 860, 0.9, t, {}); K.person({ who: 'kongsOld', x: 600, y: 1060, h: 600, t, prop: null }); const k = eio(clamp((t - dk) / 1.2)); ctx.save(); ctx.translate(-k * W, 0); K.coldWash(1); ctx.restore(); K.stamp('NO HELP', 600, 230, pop(t, dk, 0.2), -0.06, 64); } });
    ev(dk, 'whip', { note: 'cold slides away', gain: 0.5 }); ev(dk, 'stamp', { note: 'NO HELP', gain: 0.6 });
  }
  // S159 · he lowers his spyglass and turns to the town
  { const st = at(114), wt = Wd('waiting', 114);
    add({ id: 'B9-S159', at: st, beat: 9, cam: K.cam.push(900, 520, 0.07), note: 'he stopped waiting',
      draw(lt, d, t) { K.daySky(115, 620); K.sea(640, t); ground(860); const turned = t > wt; K.person({ who: 'kongsOld', x: 900, y: 1060, h: 640, t, dir: turned ? -1 : 1, prop: turned ? null : 'spyglass', arm: turned ? 10 : 70 }); if (turned) market(t, 0); } });
    ev(wt, 'appear', { note: 'he turns', type: 'whip', gain: 0.4 }); ev(st + 2.6, 'appear', { note: 'town ahead', sfx: false });
  }
  // S160 · colours weave together; SNAP on "India"
  { const st = at(115), ind = Wd('india', 115);
    add({ id: 'B9-S160', at: st, beat: 9, enter: 'whip', cam: K.cam.push(960, 520, 0.06), snaps: [snap(ind, 960, 500, 1.2)], note: 'became part of India',
      draw(lt, d, t) { market(t, 1); ctx.save(); ctx.globalAlpha = 0.18; for (let i = 0; i < 12; i++) { ctx.fillStyle = [P.crimson, P.forest, P.gold][i % 3]; ctx.fillRect(-300 + i * 200 + Math.sin(t + i) * 30, -300, 90, H + 600); } ctx.restore(); } });
    ev(ind, 'snap', { note: 'part of India' });
  }
  // S161 · the cold-open lantern again, now at dawn
  { const st = at(116);
    add({ id: 'B9-S161', at: st, beat: 9, year: 1674, cam: K.cam.push(800, 600, 0.10), note: 'the lantern at dawn',
      draw(lt, d, t) { siegeNight(t, { ring: 0 }); ctx.save(); ctx.globalAlpha = 0.55 * clamp(lt / 1.0); ctx.fillStyle = '#F2C98A'; ctx.fillRect(-300, -300, W + 600, 700); ctx.restore(); } });
    ev(st + 0.2, 'appear', { note: 'dawn', type: 'swell', dur: 1.0 });
  }
  // S162 · the walled town fills with life; the flag flies over Tranquebar
  { const st = at(117);
    add({ id: 'B9-S162', at: st, beat: 9, year: 1674, cam: K.cam.drift(100, 960, 540, 1.05), note: 'the flag flew over Tranquebar',
      draw(lt, d, t) { market(t, clamp(lt / 1.5)); K.danishFlag(1500, 560, 260, t, { pole: 300 }); } });
    ev(st + 0.4, 'flag', { note: 'flag' });
  }
  // S163 · the whole of Danish India (posts pop in) as the era bar races 1674 → 1845; stat card; music resolves on "years"
  { const st = at(118), yr = Wd('years', 118), an = Wd('another', 118), dur = Le(118) + 0.3 - st;
    const POSTS = [['Tranquebar', 'R'], ['Serampore', 'R'], ['Balasore', 'L'], ['Pipli', ''], ['Patna', 'B'], ['Ganjam', ''], ['Bandar', ''], ['Madras', ''], ['Pundichery', ''], ['Tegnapatnam', ''], ['Porto Novo', ''], ['Calicut', 'L'], ['Oddeway Torre', ''], ['Cochin', ''], ['Colachel', 'L'], ['Trincomalee', ''], ['Nicobar Islands', 'R']];
    add({ id: 'B9-S163', at: st, beat: 9, year: 1674, yearAt: (lt) => lerp(1674, 1845, eio(clamp((lt - 0.2) / (dur - 0.4)))), enter: 'whip', cam: K.cam.push(980, 560, 0.05), note: 'Danish India, to 1845',
      draw(lt, d, t) { const pr = K.realMap('sea', { view: [60, 2.5, 108, 28.5] }); const [tx, ty] = K.place(pr, 'Tranquebar');
        K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 22, 0, TAU); }, P.crimson, 1, tx, ty, 26, 2);
        POSTS.forEach(([n, lab], i) => { const k = pop(t, st + 0.15 + i * 0.1, 0.2); if (k <= 0) return; const [x, y] = K.place(pr, n); circle(x, y, 11 * k, P.crimson); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 11 * k, 0, TAU); ctx.stroke();
          if (lab === 'R') K.label(n.toUpperCase(), x + 22, y, 22, P.ink, 'left'); else if (lab === 'L') K.label(n.toUpperCase(), x - 22, y, 22, P.ink, 'right'); else if (lab === 'B') K.label(n.toUpperCase(), x, y + 30, 22, P.ink); });
        K.slip('DANISH INDIA', 1560, 620, pop(t, st + 0.1), 0.02, 46); },
      overlay(lt, d, t) { K.statCard('UNTIL 1845', 'DANISH RULE AT TRANQUEBAR', 420, 330, pop(t, an), { date: 1, size: 76 }); } });
    ev(st + 0.15, 'pop', { note: 'posts pop in' }); ev(an, 'stat', { note: 'until 1845' }); ev(yr, 'sting', { note: 'resolve', type: 'bell', gain: 0.5 });
  }
  // S164 · end screen: "watch next" placeholders, the flag; bottom-right 420x260 left clear
  { const st = Le(118) + 0.3;
    add({ id: 'B9-S164', at: st, beat: 9, year: 1845, cam: K.cam.still(960, 540), note: 'end screen',
      draw(lt, d, t) { K.parchment(116); K.endScreen(t, clamp(lt / 0.4)); K.danishFlag(1460, 760, 200, t, { pole: 260 }); } });
    ev(st, 'card', { note: 'end screen' }); ev(st + 1.8, 'appear', { note: 'flag', sfx: false });
  }
}
