// Review pages for gate 3: ?sheet=cast (the cast with idle motion) · ?sheet=kit (the set pieces). Same OP API as main.js,
// so tools/capture.mjs frames / video work:  PAGE=review.html QS='&sheet=cast' node tools/capture.mjs video review/idle.mp4
import { W, H, setCtx, ctx, clamp, eo, rnd } from './core/lib.js';
import * as K from './core/kit.js';
const { P } = K;
const cv = document.getElementById('cv'); setCtx(cv.getContext('2d'));
const q = new URLSearchParams(location.search), sheet = q.get('sheet') || 'cast';
const OP = (window.OP = { ready: false });
function head(t) { K.label(t, W / 2, 50, 34, P.ink); }
function tag(t, x, y) { K.label(t, x, y, 20, P.sepia); }
function cast(t) {
  K.parchment(5); head('THE LAST DANE · CAST (paper cut-outs, idle motion)');
  const row1 = [['kongsYoung', {}], ['kongsOld', {}], ['korsor', {}], ['soldier', {}], ['nayak', {}], ['parasol', {}], ['portuguese', {}], ['defender', {}], ['clerk', {}]];
  const row2 = [['vanHagen', {}], ['eggers', {}], ['officer', {}], ['weaver', {}], ['trader', {}], ['child', {}], ['silhouette', {}], ['king', {}]];
  row1.forEach(([w, o], i) => { const x = 120 + i * 210; K.person({ x, y: 500, h: 340, who: w, t, seed: i * 1.3, dir: 1, ...o, arm: w === 'kongsOld' ? 25 + 6 * Math.sin(t * 1.4) : w === 'nayak' ? 10 + 8 * Math.sin(t) : 0 }); tag(K.CAST[w].label, x, i % 2 ? 562 : 532); });
  row2.forEach(([w, o], i) => { const x = 160 + i * 230; K.person({ x, y: 990, h: 340, who: w, t, seed: i * 2.1 + 5, dir: w === 'eggers' || w === 'officer' ? -1 : 1, ...o, walk: w === 'vanHagen' ? t * 4 : undefined }); tag(K.CAST[w].label, x, i % 2 ? 1052 : 1022); });
}
function idle(t) {
  K.nightSky(2, t, 560);
  K.siegeRing(960, 640, 1100, 300, t, 1, 0.75);
  K.cut(K.P_rr(-300, 600, W + 600, 700, 0), '#6E5A44', { shadow: 0.6, edge: 5 });
  for (let x = -100; x < W + 100; x += 120) K.cut(K.P_rr(x, 552, 70, 56, 4), '#6E5A44', { shadow: 0.4, edge: 4 });
  K.danishFlag(1460, 600, 240, t);
  const px = 700 + 90 * Math.sin(t * 0.9);
  K.person({ x: px, y: 1000, h: 620, who: 'kongsOld', t, dir: Math.cos(t * 0.9) > 0 ? 1 : -1, walk: t * 5, arm: 28 });
  K.person({ x: 1220, y: 1000, h: 560, who: 'portuguese', t, seed: 3, dir: -1 });
  K.person({ x: 330, y: 1000, h: 560, who: 'defender', t, seed: 7 });
}
function thumb() {
  // 1280x720 thumbnail from the real cold-open lantern frame (review/thumb-base.jpg = film t 3.6 s, no overlays)
  ctx.drawImage(OP.base, 0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(20,22,40,0.45)'); g.addColorStop(0.5, 'rgba(20,22,40,0.0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  K.danishFlag(1560, 560, 220, 0.6, { pole: 420, wind: 1.3 });
  ctx.save(); ctx.translate(700, 860); ctx.rotate(-0.03); ctx.font = '700 200px Caladea'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText('FORGOTTEN').width + 120;
  K.cut(() => { ctx.beginPath(); ctx.moveTo(-w / 2, -150); for (let x = -w / 2; x <= w / 2; x += 30) ctx.lineTo(x, -150 + (rnd(x) - 0.5) * 18); for (let x = w / 2; x >= -w / 2; x -= 30) ctx.lineTo(x, 150 + (rnd(x + 7) - 0.5) * 18); ctx.closePath(); }, '#F3E9D2', { shadow: 1.6, edge: 0 });
  ctx.fillStyle = K.P.crimson; ctx.fillText('FORGOTTEN', 0, 12); ctx.restore();
  K.slip('14 YEARS', 330, 170, 1.25, -0.04, 70);
}
function kit(t) {
  K.parchment(8); head('THE LAST DANE · KIT PIECES');
  const cell = (x, y, s, f, name) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); f(); ctx.restore(); tag(name, x, y + 150); };
  // row 1
  ctx.save(); ctx.beginPath(); ctx.rect(40, 90, 600, 300); ctx.clip(); ctx.translate(40, 90); ctx.scale(600 / W, 300 / H); K.nightSky(3, t); K.fortDansborg(960, 900, 1.0, t, { night: 1, wall: 1, towers: 4, houses: 1 }); K.siegeRing(960, 900, 900, 260, t, 1, 0.9); ctx.restore(); tag('fortDansborg · walled + 4 towers · besieged (siegeRing)', 340, 410);
  ctx.save(); ctx.beginPath(); ctx.rect(660, 90, 600, 300); ctx.clip(); ctx.translate(660, 90); ctx.scale(600 / W, 300 / H); K.daySky(4, 760); K.sea(840, t); K.fortDansborg(960, 860, 1.1, t, { houses: 1 }); ctx.restore(); tag('fortDansborg · busy 1643 / peace (day)', 960, 410);
  ctx.save(); ctx.beginPath(); ctx.rect(1280, 90, 600, 300); ctx.clip(); ctx.translate(1280, 90); ctx.scale(600 / W, 300 / H); K.nightSky(6, t); K.fortDansborg(960, 900, 1.2, t, { night: 1, cracks: 1, lamps: 0.2 }); K.grave(400, 900, 1, t); ctx.restore(); tag('fortDansborg · lonely + cracks · grave + lantern', 1580, 410);
  // row 2
  cell(220, 560, 0.3, () => K.ledger(0, 0, 1, t, 0.4 + 0.6 * ((t % 3) / 3), { blot: 1 }), 'ledger (writes, crossed out)');
  cell(560, 560, 0.42, () => K.rentSlip(0, 0, 1, { mult: 2, p: clamp((t % 3) / 1) }), 'rentSlip (×2 = raised)');
  cell(840, 560, 0.5, () => K.monthCounter(0, 0, 1, 1 + Math.floor(t * 3) % 9, (t * 3) % 1), 'monthCounter 1→9');
  ctx.save(); ctx.beginPath(); ctx.rect(1000, 440, 420, 250); ctx.clip(); ctx.translate(1000, 440); ctx.scale(420 / W, 250 / H); K.parchment(9); K.letterBin(900, 600, 1.6, t, (t % 3) / 2); K.coldWash(); ctx.restore(); tag('letterBin (Copenhagen cold wash)', 1210, 710);
  cell(1640, 560, 0.42, () => K.sealedOrders(0, 0, 1, (t % 3) / 2.4), 'sealedOrders → "IF DEAD…"');
  // row 3
  ctx.save(); ctx.beginPath(); ctx.rect(40, 760, 520, 290); ctx.clip(); ctx.translate(40, 760); ctx.scale(520 / W, 290 / H); K.bookVsNotebook(t, 1); ctx.restore(); tag('bookVsNotebook (1907 vs today)', 300, 1062);
  ['orders', 'coins', 'ship'].forEach((k, i) => K.emptyIcon(k, 660 + i * 130, 880, 0.38, clamp(t * 2 - i * 0.4)));
  tag('emptyIcon ×3 (cold open)', 790, 960);
  K.quoteSlip(['That is the honour one gets', 'for five years of service in Europe,', 'and thirty years in India.'], 'KONGSBAKKE, COMPLAINT ABOUT EGGERS (TRANSLATED)', 1270, 860, clamp(t / 2.2), 26);
  K.stamp('DISSOLVED', 1700, 820, clamp(t * 2), -0.12, 40); K.wreath(1720, 950, 60, 1);
  tag('quoteSlip · stamp · wreath', 1500, 1062);
}
(async () => {
  try {
    await document.fonts.load('700 100px Caladea'); await document.fonts.load('900 100px Inter');
    K.setGeo(await (await fetch('data/geo.json')).json());
    if (sheet === 'thumb') { OP.base = new Image(); OP.base.src = 'review/thumb-base.jpg'; await OP.base.decode(); }
    OP.duration = () => 3; OP.draw = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; (sheet === 'kit' ? kit : sheet === 'idle' ? idle : sheet === 'thumb' ? thumb : cast)(t); };
    OP.frame = (t, qq = 0.92) => { OP.draw(t); return cv.toDataURL('image/jpeg', qq); };
    OP.ready = true; if (!q.has('capture')) { const loop = (n) => { OP.draw(n / 1000 % 3); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  } catch (e) { OP.bootError = String(e && e.stack || e); }
})();
