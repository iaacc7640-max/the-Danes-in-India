// BEAT 1 · 1639 · A NOBODY SAILS (0:17.4-1:02). Whip in; title slip at 18.0-19.2 inside the first shot.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
const { P, cut, P_rr, P_poly } = K;
const at = (i) => L(i) - 0.08;
const pop = (t, w, d = 0.25) => eob(clamp((t - w) / d));

/** a small Nordic harbour (Kungsbacka): cold light, timber houses, a quay, gulls */
function nordicHarbour(t, o = {}) {
  K.daySky(31, 560, false); ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = P.royal; ctx.fillRect(-300, -300, W + 600, 900); ctx.restore();
  for (let i = 0; i < 9; i++) { const x = 120 + i * 210, h = 150 + (i * 53 % 70); cut(P_rr(x - 70, 560 - h, 140, h, 3), i % 2 ? '#A8503E' : '#C9B48A', { shadow: 0.5, edge: 4 }); cut(P_poly([[x - 84, 562 - h], [x, 562 - h - 80], [x + 84, 562 - h]]), i % 3 ? '#5E3B28' : '#3E2C1E', { shadow: 0.4, edge: 4 }); ctx.fillStyle = P.ink; ctx.fillRect(x - 14, 560 - h + 40, 28, 34); }
  K.sea(600, t, 3, ['#8FA6A6', '#7D9494']);
  cut(P_rr(-300, 760, W + 600, 400, 0), '#8A6A48', { shadow: 0.8, edge: 5 });
  for (let x = -60; x < W; x += 160) cut(P_rr(x, 760, 26, 330, 4), '#6E5238', { shadow: 0.4, edge: 3 });
  K.ship(1500, 700 + K.idle.bob(t, 1, 5), 0.5, Math.sin(t * 1.4) * 0.03);
  for (let i = 0; i < 4; i++) { const gx = ((t * 60 + i * 470) % (W + 200)) - 100, gy = 180 + i * 50 + Math.sin(t * 3 + i) * 12, f = Math.sin(t * 9 + i) * 14; ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx - 26, gy - f); ctx.quadraticCurveTo(gx - 12, gy - 10, gx, gy); ctx.quadraticCurveTo(gx + 12, gy - 10, gx + 26, gy - f); ctx.stroke(); }
}
/** world map with the voyage: p 0..1 draws Copenhagen → round Africa → Tranquebar */
const VOYAGE = ['Copenhagen', [4, 51], [-12, 35], [-22, 10], [-8, -20], [10, -36], 'Cape of Good Hope', [35, -36], [55, -20], [62, 0], [74, 6], 'Tranquebar'];
function worldVoyage(t, p, o = {}) {
  const pr = K.realMap('world', { view: o.view || [-62, -44, 158, 78] });
  const [cx, cy] = K.place(pr, 'Copenhagen'), [tx, ty] = K.place(pr, 'Tranquebar');
  if (p > 0) { const h = K.geoRoute(pr, VOYAGE, p, { wobble: 4 }); if (p < 1 && o.ship !== false) { ctx.save(); ctx.translate(h[0], h[1]); K.ship(0, 0, 0.12, Math.sin(t * 2) * 0.08); ctx.restore(); } }
  circle(cx, cy, 10, P.ink); K.label('COPENHAGEN', cx + 16, cy - 26, 26, P.ink, 'left');
  if (o.star) K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 40, 0, TAU); }, P.crimson, o.star, tx, ty, 48, 2);
  circle(tx, ty, 10, P.crimson); K.label('TRANQUEBAR', tx + 18, ty + 30, 26, P.ink, 'left');
  return pr;
}

export function b1(add, ev, snap) {
  // S10 · whip → Kungsbacka harbour; young Kongsbakke on the quay; THE LAST DANE slip 18.0-19.2; name slips; snap on his town
  { const st = at(7), nm = Wd('name', 7), cl = Wd('called', 8), home = Wd('hometown', 8);
    add({ id: 'B1-S10', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.drift(110, 760, 560, 1.04), snaps: [snap(cl + 0.3, 760, 520, 1.18)], note: 'Kungsbacka quay, young Kongsbakke',
      draw(lt, d, t) { nordicHarbour(t); K.person({ x: 760, y: 900, h: 470, who: 'kongsYoung', t, look: '' });
        K.slip('ESKILD ANDERSEN', 1060, 520, t > cl + 0.3 ? 0 : pop(t, nm + 0.45), -0.03, 46); K.slip('KONGSBAKKE', 1040, 520, pop(t, cl + 0.3), 0.02, 52);
        if (t > home) { ctx.save(); ctx.globalAlpha = clamp((t - home) / 0.3); ctx.strokeStyle = P.crimson; ctx.lineWidth = 7; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(1180, 470); ctx.quadraticCurveTo(1300, 380, 1330, 300); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); circle(1330, 290, 12, P.crimson); } },
      overlay(lt, d, t) { const k = t - 18.0; if (k >= 0 && k <= 1.2) { ctx.save(); ctx.globalAlpha = clamp(Math.min(k / 0.15, (1.2 - k) / 0.2)); K.slip('THE LAST DANE', 1490, 200, eob(clamp(k / 0.25)), 0.02, 44); ctx.restore(); } } });
    ev(18.0, 'card', { note: 'THE LAST DANE title slip' }); ev(nm + 0.45, 'pop', { note: 'name slip' }); ev(home, 'route', { note: 'hometown arrow', dur: 0.6 });
  }
  // S11 · Scandinavia, real borders: 1639 Denmark (crimson) holds Skåne, Halland, Blekinge, Gotland; on "Sweden" they turn Swedish blue
  { const st = at(9), dk = Wd('denmark', 9), sw = Wd('sweden', 9);
    add({ id: 'B1-S11', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.push(1010, 560, 0.06), note: 'map: Kungsbacka in Halland, Danish in 1639, Swedish today',
      draw(lt, d, t) { const pr = K.realMap('north', { view: [5.5, 54.0, 19.5, 59.6] }), G = K.GEO.data;
        const shape = (rings) => () => { ctx.beginPath(); for (const ring of rings) ring.forEach(([lo, la], i) => { const [px, py] = pr(lo, la); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); };
        const fill = (rings, col, a) => { ctx.save(); ctx.globalAlpha = a; shape(rings)(); ctx.fillStyle = col; ctx.fill('evenodd'); ctx.restore(); };
        const border = (rings) => { shape(rings)(); ctx.strokeStyle = 'rgba(62,44,30,0.75)'; ctx.lineWidth = 3; ctx.setLineDash([10, 6]); ctx.stroke(); ctx.setLineDash([]); };
        fill(G.countries.Sweden, '#6F86A6', 0.9); fill(G.countries.Denmark, P.crimson, 0.8);
        const prov = ['Skåne', 'Halland', 'Blekinge', 'Gotland'].flatMap((n) => G.provinces[n]);
        const [hx, hy] = K.place(pr, 'Halland'), [kx, ky] = K.place(pr, 'Kungsbacka'), [cx, cy] = K.place(pr, 'Copenhagen');
        K.inkBleed(shape(prov), '#B04A3E', 0.35 + 0.65 * clamp((t - dk + 0.3) / 0.6), hx, hy + 120, 900, 4, 1);
        K.inkBleed(shape(prov), '#6F86A6', clamp((t - sw) / 0.45), hx, hy, 900, 9, 0.9 / 0.8);
        for (const n of ['Denmark', 'Sweden', 'Norway', 'Germany']) border(G.countries[n]);
        shape(G.provinces.Halland)(); ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.stroke();
        const lab = (txt, lo, la, sz = 34) => { const [x, y] = pr(lo, la); K.label(txt, x, y, sz, P.ink); };
        lab('SWEDEN', 15.3, 57.6, 44); lab('NORWAY', 8.3, 58.3, 30); lab('DENMARK', 9.1, 56.1, 36); lab('GERMANY', 10.5, 54.25, 30);
        circle(kx, ky, 11, P.ink); K.slip('KUNGSBACKA', kx - 190, ky - 40, 1, -0.02, 32); circle(cx, cy, 11, P.ink); K.slip('COPENHAGEN', cx - 210, cy - 50, 1, 0.02, 28);
        const [lx, ly] = pr(13.9, 56.85); K.slip('HALLAND', lx + 40, ly, 1, 0.02, 30);
        K.slip(t > sw ? 'TODAY: SWEDEN' : '1639: DENMARK', 1600, 790, t > sw ? pop(t, sw) : pop(t, dk), 0.03, 40); } });
    ev(dk, 'ink', { note: 'old Danish provinces glow crimson' }); ev(sw, 'ink', { note: 'provinces turn Swedish blue' });
  }
  // S12 · the crowd: hats and gold; he is plain; COMMONER; they turn away on "nobody"
  { const st = at(10), cm = Wd('commoner', 10), nb = Wd('nobody', 10);
    add({ id: 'B1-S12', at: st, beat: 1, year: 1639, cam: K.cam.drift(-90, 960, 560, 1.04), note: 'commoner among grandees',
      draw(lt, d, t) { K.parchment(33); cut(P_rr(-300, 880, W + 600, 400, 0), '#B9A98C', { shadow: 0.4, edge: 0 }); ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = P.royal; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
        const turned = t > nb + 0.1; [['korsor', 300], ['officer', 520], ['clerk', 1380], ['korsor', 1600]].forEach(([w, x], i) => K.person({ x, y: 900, h: 470, who: w, t, seed: i * 2, dir: turned ? (x < 960 ? -1 : 1) : (x < 960 ? 1 : -1), mood: 'stern' }));
        K.person({ x: 960, y: 900, h: 440, who: 'kongsYoung', t, look: turned ? 'down' : '' });
        K.stamp('COMMONER', 960, 260, pop(t, cm, 0.18), -0.08, 70); } });
    ev(cm, 'stamp', { note: 'COMMONER' }); ev(nb + 0.1, 'appear', { note: 'they turn away' });
  }
  // S13 · close: he plants his feet; STUBBORN; his brows set on "matter"
  { const st = at(11), sb = Wd('stubborn', 11), mt = Wd('matter', 11);
    add({ id: 'B1-S13', at: st, beat: 1, year: 1639, cam: K.cam.push(1000, 480, 0.09), note: 'stubborn close-up',
      draw(lt, d, t) { nordicHarbour(t); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = P.parch; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); K.person({ x: 1000, y: 1420, h: 1000, who: 'kongsYoung', t, mood: t > mt ? 'stern' : '', arm: 0 }); K.stamp('STUBBORN', 470, 420, pop(t, sb, 0.18), 0.1, 74); } });
    ev(sb, 'stamp', { note: 'STUBBORN' }); ev(mt, 'appear', { note: 'brows set', sfx: false });
  }
  // S14 · Copenhagen company office: he makes his slow mark; the company seal thuds on "Company"
  { const st = at(12), jn = Wd('joined', 12), co = Wd('company', 12);
    add({ id: 'B1-S14', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.push(980, 560, 0.07), note: 'company office: signs, seal',
      draw(lt, d, t) { K.parchment(34); cut(P_rr(-300, 700, W + 600, 500, 0), '#6E5238', { shadow: 0.6, edge: 4 }); K.person({ x: 1500, y: 980, h: 520, who: 'clerk', t, dir: -1, prop: 'quill' }); K.person({ x: 420, y: 980, h: 520, who: 'kongsYoung', t, arm: 30 + 10 * Math.sin(t * 6) * (t > jn && t < jn + 1.2 ? 1 : 0) });
        ctx.save(); ctx.translate(960, 640); ctx.rotate(-0.03); cut(P_rr(-260, -170, 520, 340, 4), '#F3E9D2', { shadow: 1, edge: 0 }); ctx.strokeStyle = 'rgba(62,44,30,0.4)'; ctx.lineWidth = 4; for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.moveTo(-210, -110 + r * 44); ctx.lineTo(210 - r * 30, -110 + r * 44); ctx.stroke(); }
        const mk = clamp((t - jn) / 1.0); if (mk > 0) { ctx.strokeStyle = '#2A1D14'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-160, 110); ctx.lineTo(-160 + 60 * mk, 110 - 40 * mk); if (mk > 0.5) { ctx.moveTo(-160, 70); ctx.lineTo(-160 + 60 * (mk - 0.5) * 2, 70 + 40 * (mk - 0.5) * 2); } ctx.stroke(); }
        ctx.restore(); if (t > co) K.seal(1110, 740, pop(t, co, 0.18) * 0.8, 'C'); K.coldWash(1); } });
    ev(jn, 'write', { note: 'his slow mark' }); ev(co, 'seal', { note: 'company seal' });
  }
  // S15 · world map: India lights up, the crimson star bleeds in at Tranquebar on "fort"
  { const st = at(13), ft = Wd('fort', 13);
    add({ id: 'B1-S15', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.push(1300, 640, 0.10), note: 'world: the only fort in India',
      draw(lt, d, t) { worldVoyage(t, 0, { star: clamp((t - ft) / 0.7) }); } });
    ev(ft, 'ink', { note: 'Tranquebar star' });
  }
  // S16 · Fort Dansborg, busy 1643: flag, surf, ships; DANSBORG slip
  { const st = at(14);
    add({ id: 'B1-S16', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.drift(120, 960, 540, 1.05), note: 'Dansborg busy, day',
      draw(lt, d, t) { K.daySky(35, 640); K.sea(720, t); K.fortDansborg(900, 760, 1.15, t, { houses: 1 }); K.ship(1580, 830 + K.idle.bob(t, 2, 6), 0.55, Math.sin(t * 1.3) * 0.03); for (let i = 0; i < 3; i++) K.person({ x: 260 + i * 120, y: 980, h: 260, who: i === 1 ? 'trader' : 'defender', t, seed: i, walk: t * 4 + i }); cut(P_rr(-300, 960, W + 600, 300, 0), '#DCC9A0', { shadow: 0.5, edge: 4 });
        K.slip('DANSBORG', 900, 260, pop(t, st + 0.15), -0.03, 52); K.slip('TRANQUEBAR', 1400, 380, pop(t, Wd('at', 14)), 0.03, 36); } });
    ev(st + 0.15, 'pop', { note: 'DANSBORG' }); ev(Wd('at', 14), 'pop', { note: 'TRANQUEBAR' });
  }
  // S17 · south India: the Nayak's green land around the rented village; TANJORE inland
  { const st = at(15), rt = Wd('rented', 15), vl = Wd('village', 15), fr = Wd('from', 15);
    add({ id: 'B1-S17', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.push(1060, 520, 0.08), note: 'map: rented from the Nayak of Tanjore',
      draw(lt, d, t) { const pr = K.realMap('south', { view: [75.8, 8.9, 83.2, 13.0] }); const [tx, ty] = K.place(pr, 'Tranquebar'), [jx, jy] = K.place(pr, 'Tanjore');
        const land = () => { ctx.beginPath(); for (const ring of K.GEO.data.south.land) ring.forEach(([lo, la], i) => { const [px, py] = pr(lo, la); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); };
        ctx.save(); ctx.globalAlpha = 0.55; K.greenTide(land, clamp((t - vl) / 1.2), jx, jy, 520, 3); ctx.restore();
        K.inkBleed(() => { ctx.beginPath(); ctx.arc(tx, ty, 34, 0, TAU); }, P.crimson, clamp((t - rt) / 0.5), tx, ty, 40, 2); circle(tx, ty, 9, P.ink);
        circle(jx, jy, 10, P.ink); K.slip('TANJORE', jx - 40, jy - 70, pop(t, fr + 0.5), -0.02, 38); K.slip('TRANQUEBAR', tx + 190, ty - 90, 1, 0.02, 32);
        if (t > fr + 0.5) { K.seal(jx, jy + 90, pop(t, fr + 0.7) * 0.42, '♛'); } } });
    ev(rt, 'ink', { note: 'the rented village' }); ev(vl + 0.1, 'ink', { note: "the Nayak's land" }); ev(fr + 0.5, 'pop', { note: 'TANJORE' });
  }
  // S18 · the tribute slip: coins slide to the crown seal; YEARLY stamp
  { const st = at(16), yr = Wd('yearly', 16), tb = Wd('tribute', 16);
    add({ id: 'B1-S18', at: st, beat: 1, year: 1639, cam: K.cam.push(960, 520, 0.08), note: 'tribute slip',
      draw(lt, d, t) { K.parchment(36); K.rentSlip(960, 520, 1.5, { mult: 1 }); for (let i = 0; i < 4; i++) { const k = eio(clamp((t - yr - i * 0.12) / 0.5)); if (k > 0 && k < 1) cut(P_rr(lerp(420, 1120, k), 720 - i * 18 - Math.sin(k * Math.PI) * 60, 110, 22, 11), P.gold, { shadow: 0.3, edge: 2 }); }
        K.stamp('YEARLY', 1340, 300, pop(t, tb, 0.18), 0.12, 64); } });
    ev(yr, 'coin', { note: 'coins slide' }); ev(tb, 'stamp', { note: 'YEARLY' });
  }
  // S19 · the voyage begins: route draws from Copenhagen, wobbling; storm clouds on "hard"
  { const st = at(17), hd = Wd('hard', 17);
    add({ id: 'B1-S19', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.push(560, 420, 0.08), note: 'voyage route starts',
      draw(lt, d, t) { worldVoyage(t, 0.42 * eio(clamp(lt / d))); if (t > hd) for (let i = 0; i < 3; i++) { ctx.save(); ctx.globalAlpha = clamp((t - hd) * 3); ctx.translate(380 + i * 70, 520 + i * 40); ctx.scale(pop(t, hd + i * 0.1), pop(t, hd + i * 0.1)); cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-40, 0, 36], [0, -20, 44], [40, 0, 34]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } }, '#7D8590', { shadow: 0.4, edge: 3 }); ctx.restore(); } } });
    ev(st + 0.1, 'route', { note: 'route draws' }); ev(hd, 'appear', { note: 'storm clouds' });
  }
  // S20 · the Christianshavn in a paper storm
  { const st = at(18), sh = Wd('ship', 18);
    add({ id: 'B1-S20', at: st, beat: 1, year: 1639, enter: 'whip', cam: K.cam.push(960, 520, 0.07), note: 'Christianshavn in the storm',
      draw(lt, d, t) { K.parchment(37); ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = '#4B5563'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
        for (let i = 0; i < 4; i++) { const y = 640 + i * 110; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, y + Math.sin(x * 0.009 + t * 2.4 + i) * 46); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, i % 2 ? '#6E8584' : '#86A09B', { shadow: 0.7, edge: 4 }); if (i === 0) K.ship(960, 700 + Math.sin(t * 2.4) * 30, 1.1, Math.sin(t * 2.4 + 1) * 0.12); }
        K.slip('CHRISTIANSHAVN', 960, 200, pop(t, sh + 0.4), -0.02, 46); } });
    ev(st + 0.9, 'appear', { note: 'big wave', sfx: false }); ev(sh + 0.4, 'pop', { note: 'ship name' });
  }
  // S21 · route reaches Tranquebar; STAT CARD 1639-1643
  { const st = at(19), sx = Wd('sixteen', 19);
    add({ id: 'B1-S21', at: st, beat: 1, year: 1639, yearAt: (lt) => lerp(1639, 1643, clamp(lt / 2.4)), enter: 'whip', cam: K.cam.push(1300, 640, 0.07), note: 'voyage arrives, 1639-1643',
      draw(lt, d, t) { worldVoyage(t, lerp(0.42, 1, eio(clamp(lt / 2.0))), { star: 1 }); },
      overlay(lt, d, t) { K.statCard('1639–1643', 'FOUR YEARS AT SEA', 420, 640, pop(t, sx, 0.25), { date: 1, size: 80 }); } });
    ev(st + 0.1, 'route', { note: 'route completes', dur: 1.8 }); ev(sx, 'stat', { note: '1639-1643' });
  }
  // S22 · at anchor off Tranquebar; the crew steps ashore, unaware
  { const st = at(20), kn = Wd('knew', 20);
    add({ id: 'B1-S22', at: st, beat: 1, year: 1643, enter: 'whip', cam: K.cam.push(1100, 600, 0.08), note: 'crew ashore, unaware',
      draw(lt, d, t) { K.daySky(38, 600); K.sea(660, t); K.ship(1380, 760 + K.idle.bob(t, 3, 6), 0.9, Math.sin(t * 1.2) * 0.03); cut(P_rr(-300, 880, W + 600, 400, 0), '#DCC9A0', { shadow: 0.5, edge: 4 }); K.fortDansborg(380, 880, 0.6, t, {});
        for (let i = 0; i < 4; i++) K.person({ x: 1150 - i * 150 - lt * 60, y: 1000, h: 300, who: i === 0 ? 'kongsYoung' : 'soldier', t, seed: i, dir: -1, walk: t * 5 + i, prop: null }); } });
    ev(kn, 'appear', { note: 'crew walks ashore', sfx: false }); ev(st + 0.2, 'bell', { note: 'ship bell', gain: 0.4 });
  }
  // S23 · the ship sails away; the harbour empties; SNAP on "twenty-six"; stat card; sting
  { const st = at(21), ls = Wd('last', 21), tw = Wd('twenty', 22);
    add({ id: 'B1-S23', at: st, beat: 1, year: 1643, cam: K.cam.push(1300, 640, 0.06), snaps: [snap(tw, 1300, 600, 1.2)], note: 'last ship leaves; 26 years',
      draw(lt, d, t) { K.daySky(39, 600); K.sea(660, t); const k = eio(clamp((t - ls + 0.4) / 3.2)); K.ship(lerp(1300, 1760, k), lerp(760, 650, k) + K.idle.bob(t, 3, 5), lerp(0.9, 0.25, k), 0); cut(P_rr(-300, 880, W + 600, 400, 0), '#DCC9A0', { shadow: 0.5, edge: 4 }); K.fortDansborg(380, 880, 0.6, t, {}); },
      overlay(lt, d, t) { K.statCard('26 YEARS', 'THE LAST DANISH SHIP UNTIL 1669', 960, 470, pop(t, tw, 0.22), { size: 110 }); } });
    ev(ls, 'appear', { note: 'ship sails off', sfx: false }); ev(tw, 'stat', { note: '26 years' }); ev(Le(22) - 0.05, 'sting', { note: 'beat 1 sting' });
  }
}
