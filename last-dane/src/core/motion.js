// Motion grammar for the 16:9 history films (re-exported by kit.js, so shots use K.cam, K.ev, K.idle, K.sfxFor).
//   cam   : how a shot's camera moves (push · drift · still) + snap-zooms on reveal words
//   ev    : registers a VISUAL EVENT at an absolute time (and its sound cue). `capture.mjs events` checks the gaps.
//   idle  : small life on everything (breathing, flicker, sway, bob)
//   sfxFor: which sound each kind of visual event makes
import { W, H, clamp, lerp, eo, eio, eob } from './lib.js';

// ═════════════════════════ EVENTS + THEIR SOUNDS ═════════════════════════
export const EV = [];      // { t, kind, note }
export const SFX = [];     // { t, type, gain, dur, pan }
export function resetEvents() { EV.length = 0; SFX.length = 0; }

/** the sound each visual event kind makes ([type, options]); null = silent */
export function sfxFor(kind) {
  return ({
    whip: ['whip', { gain: 0.9 }], cut: ['tap', { gain: 0.4 }], snap: ['snap', { gain: 0.7 }], push: ['swell', { gain: 0.5, dur: 1.6 }],
    ink: ['brush', { gain: 0.7 }], route: ['quill', { gain: 0.6, dur: 1.4 }], card: ['slide', { gain: 0.55, dur: 0.5 }],
    stat: ['slide', { gain: 0.6, dur: 0.45 }], seal: ['seal', { gain: 0.8 }], stamp: ['seal', { gain: 0.7 }], pop: ['pop', { gain: 0.5 }],
    flag: ['flap', { gain: 0.6 }], write: ['quill', { gain: 0.5, dur: 1.0 }], door: ['door', { gain: 0.7 }], coin: ['coin', { gain: 0.5 }],
    bell: ['bell', { gain: 0.6 }], appear: ['pop', { gain: 0.35 }], move: null, sting: ['sting', { gain: 0.9 }], page: ['slide', { gain: 0.4, dur: 0.6 }],
  })[kind] ?? ['pop', { gain: 0.3 }];
}
/** register a visual event at absolute time t (seconds). o.sfx = false to keep it silent; o.gain/dur/pan override the sound */
export function ev(t, kind, o = {}) {
  EV.push({ t: +t.toFixed(3), kind, note: o.note || '' });
  const s = o.sfx === false ? null : sfxFor(kind);
  if (s) SFX.push({ t: +(t + (o.off || 0)).toFixed(3), type: o.type || s[0], ...s[1], ...(o.gain != null ? { gain: o.gain } : {}), ...(o.dur != null ? { dur: o.dur } : {}), ...(o.pan != null ? { pan: o.pan } : {}) });
  return t;
}

// ═════════════════════════ CAMERA ═════════════════════════
// A shot's `cam` is one of these. The camera is applied by main.js around the shot's draw(); overlays are not moved.
export const cam = {
  /** slow push-in toward (x, y) by amt (0.05-0.10) across the shot: tension */
  push: (x = W / 2, y = H / 2, amt = 0.07) => ({ kind: 'push', x, y, amt }),
  /** sideways drift of dx px across the shot at a slight zoom z: calm, maps, establishing */
  drift: (dx = 120, x = W / 2, y = H / 2, z = 1.05) => ({ kind: 'drift', x, y, dx, z }),
  /** hold (still has the punch-in and any snaps) */
  still: (x = W / 2, y = H / 2) => ({ kind: 'still', x, y }),
};
/** snap-zoom: at absolute time t, punch in by z toward (x, y) in 0.12 s; hold for `hold` s (default: to the end of the shot) */
export const snap = (t, x, y, z = 1.22, hold = null) => ({ t, x, y, z, hold });

/** the camera transform at shot-local time lt: returns { x, y, s, tx } (scale s about (x, y), then shift tx) */
export function camAt(c = cam.push(), lt, d, snaps = [], t0 = 0) {
  let x = c.x, y = c.y, s = 1, tx = 0;
  const k = eio(clamp(lt / Math.max(0.5, d)));
  if (c.kind === 'push') s = 1 + c.amt * k;
  else if (c.kind === 'drift') { s = c.z; tx = lerp(c.dx / 2, -c.dx / 2, k); }
  s *= 1 + 0.035 * (1 - eo(clamp(lt / 0.3)));                     // small settle on every cut
  for (const sn of snaps) {
    const st = sn.t - t0; if (lt < st) continue;
    let p = eob(clamp((lt - st) / 0.12));
    if (sn.hold != null && lt > st + sn.hold) p *= 1 - eio(clamp((lt - st - sn.hold) / 0.3));
    s *= lerp(1, sn.z, p); x = lerp(x, sn.x, clamp(p)); y = lerp(y, sn.y, clamp(p));
  }
  return { x, y, s, tx };
}

// ═════════════════════════ IDLE LIFE ═════════════════════════
export const idle = {
  /** breathing: a vertical scale factor around 1 */
  breathe: (t, seed = 0, amt = 0.012) => 1 + amt * Math.sin(t * 2.1 + seed),
  /** flame / lantern flicker 0.75..1 */
  flicker: (t, seed = 0) => 0.88 + 0.07 * Math.sin(t * 13 + seed) + 0.05 * Math.sin(t * 31 + seed * 3),
  /** sway angle (radians) for banners, trees, hanging things */
  sway: (t, seed = 0, amp = 0.05) => amp * Math.sin(t * 1.3 + seed) + amp * 0.3 * Math.sin(t * 3.1 + seed * 2),
  /** bob (px) for ships, floating things */
  bob: (t, seed = 0, amp = 6) => amp * Math.sin(t * 1.7 + seed),
  /** slow pacing position 0..1..0 */
  pace: (t, period = 6, seed = 0) => 0.5 - 0.5 * Math.cos((t + seed) / period * Math.PI * 2),
};
