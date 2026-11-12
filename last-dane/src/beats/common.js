// Shared helpers for the beat files (no art here: art lives in kit.js).
import { ctx, W, H, TAU, clamp, eob } from '../core/lib.js';
import { L } from '../core/timing.js';
import * as K from '../core/kit.js';
export const at = (i) => L(i) - 0.08;
export const pop = (t, w, d = 0.25) => eob(clamp((t - w) / d));
/** shape() path for rings of [lon, lat] under projection pr */
export const shapeOf = (pr, rings) => () => { ctx.beginPath(); for (const ring of rings) ring.forEach(([lo, la], i) => { const [px, py] = pr(lo, la); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); };
/** dim night overlay */
export const dim = (a = 0.6, col = K.NAVY) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); };
/** ground strip */
export const ground = (y, col = '#DCC9A0') => K.cut(K.P_rr(-300, y, W + 600, 600, 0), col, { shadow: 0.5, edge: 4 });
/** a row of people walking or standing */
export const crowd = (list, t, h = 300) => list.forEach(([who, x, y, o = {}], i) => K.person({ who, x, y, h, t, seed: i * 1.7, ...o }));
