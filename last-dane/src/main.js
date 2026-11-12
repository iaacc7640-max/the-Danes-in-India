// Boot: fonts → script + timing + geo → captions → shots. Then draw(t) renders film time t (a pure function of t).
// 16:9 engine: every shot is drawn into its own layer under its camera (K.cam + snaps); a WHIP pan slides the old and
// new layers past each other with a motion smear; overlays (era bar, beat cards, shot.overlay, captions) sit on top
// and never move with the camera. No fades, no cross-fades: hard cuts, snaps and whips only.
// window.OP is the API tools/capture.mjs drives: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots(),
// captions(), events(), beats().
import { W, H, setCtx, ctx, clamp, lerp, eio } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList } from './core/captions.js';
import * as K from './core/kit.js';
import { buildShots } from './shots.js';

const cv = document.getElementById('cv');
const main = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const LA = mk(), LB = mk(), la = LA.getContext('2d'), lb = LB.getContext('2d');
setCtx(main);
const OP = (window.OP = { ready: false });
const WHIP = 0.3;                                         // whip pan length (s)

function shotIndex(t) { const S = OP._shots; let i = S.length - 1; while (i > 0 && S[i].at > t) i--; return i; }
function shotEnd(i) { const S = OP._shots; return i < S.length - 1 ? S[i + 1].at : T.dur; }

/** draw shot i at film time t into canvas context c, under its camera */
function renderShot(i, t, c) {
  const sh = OP._shots[i], d = shotEnd(i) - sh.at, lt = t - sh.at;
  setCtx(c); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.letterSpacing = '0px'; c.filter = 'none';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  const m = K.camAt(sh.cam, lt, d, sh.snaps || [], sh.at);
  c.save(); c.translate(m.tx, 0); c.translate(m.x, m.y); c.scale(m.s, m.s); c.translate(-m.x, -m.y);
  sh.draw(lt, d, t);
  c.restore(); c.globalAlpha = 1; c.letterSpacing = '0px';
}

/** the era-bar year at time t: each shot's `year` (or yearAt(lt)), eased from the previous shot's over 0.6 s */
function yearAt(t) {
  const S = OP._shots, i = shotIndex(t), sh = S[i], lt = t - sh.at;
  const y = (s, l) => (s.yearAt ? s.yearAt(l) : s.year);
  const cur = y(sh, lt); if (cur == null) return null;
  let prev = null; for (let j = i - 1; j >= 0 && prev == null; j--) prev = y(S[j], sh.at - S[j].at);
  return prev == null || sh.yearAt ? cur : lerp(prev, cur, eio(clamp(lt / 0.6)));
}

function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  const i = shotIndex(t), sh = OP._shots[i], lt = t - sh.at;
  renderShot(i, t, la);
  setCtx(main); main.setTransform(1, 0, 0, 1, 0, 0); main.globalAlpha = 1; main.fillStyle = '#000'; main.fillRect(0, 0, W, H);
  if (sh.enter === 'whip' && i > 0 && lt < WHIP) {
    renderShot(i - 1, t, lb);
    const k = eio(lt / WHIP), dir = sh.dir || 1, speed = Math.sin(Math.PI * lt / WHIP);   // 0 → 1 → 0
    const smear = (img, x) => { const n = 7, sp = 26 * speed; for (let j = 0; j < n; j++) { main.globalAlpha = j === 0 ? 1 : 0.22; main.drawImage(img, x + dir * (j - n / 2) * sp, 0); } main.globalAlpha = 1; };
    smear(LB, -dir * W * k); smear(LA, dir * W * (1 - k));
  } else main.drawImage(LA, 0, 0);
  setCtx(main); main.globalAlpha = 1; main.letterSpacing = '0px';
  // overlays: shot overlay, era bar, beat card (none move with the camera)
  if (sh.overlay) { main.save(); sh.overlay(lt, shotEnd(i) - sh.at, t); main.restore(); }
  const S = OP.script, yr = yearAt(t);
  if (S.era && sh.beat >= (S.eraFromBeat ?? 1) && yr != null) K.eraBar(S.era, yr, 1);
  const b = OP._beats.find((b) => t >= b.start && t < b.start + 1.25);
  if (b && b.card) K.beatCard(b.card.year, b.card.hook, t - b.start - 0.05);
  drawCaption(t);
}

(async () => {
  try {
    await document.fonts.load('900 100px Inter'); await document.fonts.load('700 100px Caladea');
    const get = async (f) => (await fetch(f, { cache: 'no-store' })).json();
    const script = await get('script.json'); K.setGeo(await get('data/geo.json'));
    await loadTiming();
    buildCaptions(script);
    K.resetEvents();
    const { shots, cues = [] } = buildShots(script);
    shots.sort((a, b) => a.at - b.at);
    // every cut is a visual event; snaps too
    shots.forEach((s, i) => { if (i) K.ev(s.at, s.enter || 'cut', { note: s.id, sfx: s.cutSfx !== false }); (s.snaps || []).forEach((sn) => K.ev(sn.t, 'snap', { note: s.id })); });
    // beats: start = first shot of that beat; cards from script.beats
    const beats = []; shots.forEach((s) => { if (s.beat != null && !beats.find((b) => b.n === s.beat)) beats.push({ n: s.beat, start: s.at, card: (script.beats || []).find((c) => c.n === s.beat && c.year) || null }); });
    beats.forEach((b, j) => { b.end = j < beats.length - 1 ? beats[j + 1].start : T.dur; if (b.card) K.ev(b.start + 0.05, 'card', { note: `beat ${b.n} card` }); });
    OP._shots = shots; OP._beats = beats; OP.script = script;
    OP.duration = () => T.dur;
    OP.draw = draw;
    OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, beat: s.beat, at: +s.at.toFixed(3), end: +shotEnd(i).toFixed(3), note: s.note || '' }));
    OP.captions = () => captionList().map((c) => ({ s: +c.s.toFixed(3), e: +c.e.toFixed(3), text: c.words.map((w) => (w.hi ? '*' : '') + w.txt).join(' ') }));
    OP.cues = () => [...cues, ...K.SFX].slice().sort((a, b) => a.t - b.t);
    OP.events = () => K.EV.slice().sort((a, b) => a.t - b.t);
    OP.beats = () => beats.map((b) => ({ n: b.n, start: +b.start.toFixed(3), end: +b.end.toFixed(3), card: b.card ? `${b.card.year} · ${b.card.hook}` : '' }));
    OP.ready = true;
    const q = new URLSearchParams(location.search);
    if (!q.has('capture')) {
      if (q.has('t')) draw(+q.get('t'));
      else {
        const audio = new Audio('data/mix.wav'); let t0 = null;
        const btn = document.getElementById('play'); btn.hidden = false;
        btn.onclick = () => { btn.hidden = true; t0 = performance.now(); audio.currentTime = 0; audio.play().catch(() => {}); };
        const loop = (now) => { const t = t0 == null ? 0 : (now - t0) / 1000; draw(t0 == null ? 0 : t); if (t0 != null && t > T.dur) { t0 = null; btn.hidden = false; } requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      }
    }
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
