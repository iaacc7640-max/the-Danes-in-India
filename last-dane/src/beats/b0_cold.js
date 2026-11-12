// BEAT 0 · COLD OPEN (0:00-0:17.4). Story at frame 1, a visual change every <= 2.5 s, hard cuts + snaps only, no title.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from '../core/lib.js';
import { L, Le, Wd } from '../core/timing.js';
import * as K from '../core/kit.js';
const { P, cut, P_rr, P_poly } = K;

/** the walled town at night, seen from the land side: siege ring in front, town + fort behind, sea beyond */
export function siegeNight(t, o = {}) {
  K.nightSky(1, t, 520);
  K.sea(640, t, 2, ['#55677A', '#4B5B6C']);
  K.fortDansborg(960, 760, 0.95, t, { night: 1, wall: 1, towers: 4, houses: 1, lamps: 0.7, wind: 1.1 });
  cut(P_rr(-300, 760, W + 600, 600, 0), '#4A3E33', { shadow: 0.5, edge: 4 });
  K.lantern(o.lx ?? 690, o.ly ?? 600, 0.55, t, 1.2);                     // the one lantern on the rampart
  K.siegeRing(960, 900, 1150, 340, t, o.ring ?? 1, 0.85);
}
export const LANTERN = [690, 600];

export function b0(add, ev, snap) {
  // S00 · wide night siege → SNAP onto the lantern (2.5 s); the ring rises on "surrounded"
  { const sur = Wd('surrounded', 1), town = Wd('town', 1);
    add({ id: 'B0-S00', at: 0, beat: 0, cam: K.cam.push(960, 640, 0.08), snaps: [snap(2.5, LANTERN[0], LANTERN[1], 2.3)], note: 'wide night siege → snap to the lantern',
      draw(lt, d, t) { siegeNight(t, { ring: 0.45 + 0.3 * eo(clamp((lt - 1.2) / 0.6)) + 0.35 * eo(clamp((lt - sur) / 0.5)) }); } });
    ev(0.02, 'appear', { note: 'torches flicker on', sfx: false }); ev(1.25, 'appear', { note: 'banners ripple in' }); ev(sur, 'flag', { note: 'siege ring on "surrounded"' }); ev(town + 0.1, 'appear', { note: 'torch flare' });
  }
  // S01 · close on the lantern; the month block tears 1 → 9 on "nine"
  { const st = L(2) - 0.08, nine = Wd('nine', 2);
    add({ id: 'B0-S01', at: st, beat: 0, cam: K.cam.push(860, 560, 0.07), note: 'lantern + month counter 1→9',
      draw(lt, d, t) { K.nightSky(2, t, 500); for (let x = -100; x < W + 100; x += 140) cut(P_rr(x, 600, 90, 70, 4), '#5E5040', { shadow: 0.4, edge: 4 }); cut(P_rr(-300, 660, W + 600, 600, 0), '#5E5040', { shadow: 0.6, edge: 5 });
        for (let i = 0; i < 6; i++) K.banner(140 + i * 330, 600, 0.6, t, i);
        K.lantern(700, 610, 1.6, t, 1.3);
        const n = lt < nine - st ? 1 : 1 + Math.min(8, Math.floor((lt - (nine - st)) * 9)); K.monthCounter(1230, 470, 0.95, n, ((lt - (nine - st)) * 9) % 1); } });
    ev(nine, 'page', { note: 'months tear 1→9' });
  }
  // S02 · a hand writes slowly in a ledger, crossed-out marks; SNAP on "read"
  { const st = L(3) - 0.08, rd = Wd('read', 3);
    add({ id: 'B0-S02', at: st, beat: 0, cam: K.cam.push(900, 520, 0.06), snaps: [snap(rd, 980, 480, 1.25)], note: 'ledger: slow hand, crossed-out words',
      draw(lt, d, t) { K.parchment(12); ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = K.NAVY; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); K.lantern(1650, 360, 1.2, t, 1.4); K.ledger(900, 540, 1.25, t, 0.25 + 0.55 * clamp(lt / d), { blot: lt > 1.2 }); } });
    ev(st + 1.15, 'write', { note: 'a word crossed out' }); ev(st + 1.25, 'appear', { note: 'ink blot', sfx: false });
  }
  // S03 · three empty icons stamp in on "orders" · "money" · "ships"
  { const st = L(4) - 0.08, a = Wd('orders', 4), b = Wd('money', 4), c = Wd('ships', 4);
    add({ id: 'B0-S03', at: st, beat: 0, cam: K.cam.drift(80, 960, 500, 1.04), note: 'no orders · no money · no ships',
      draw(lt, d, t) { K.parchment(13); ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = K.NAVY; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); K.lantern(960, 900, 1.0, t, 1.0);
        [['orders', a, 520], ['coins', b, 960], ['ship', c, 1400]].forEach(([k, w, x]) => K.emptyIcon(k, x, 470, 1.15, clamp((t - w) / 0.22))); } });
    ev(a, 'stamp'); ev(b, 'stamp'); ev(c, 'stamp');
  }
  // S04 · COPENHAGEN, far and cold: a door slams on "forgotten"; a cobweb spreads over the map of India
  { const st = L(5) - 0.08, fg = Wd('forgotten', 5);
    add({ id: 'B0-S04', at: st, beat: 0, cam: K.cam.push(760, 480, 0.06), note: 'Copenhagen: door shuts, cobweb on India',
      draw(lt, d, t) { K.parchment(14); cut(P_rr(-300, 820, W + 600, 400, 0), '#7A6650', { shadow: 0.5, edge: 0 });
        ctx.save(); ctx.translate(380, 160); ctx.rotate(-0.02); cut(P_rr(0, 0, 760, 560, 6), '#E9DCBC', { shadow: 1, edge: 0 }); ctx.save(); ctx.beginPath(); ctx.rect(20, 20, 720, 520); ctx.clip(); ctx.translate(20, 20); ctx.scale(720 / W, 520 / H); K.realMap('sea', { view: [66, 4, 96, 30] }); ctx.restore(); circle(380, 20, 12, P.crimson); ctx.restore();
        K.cobweb(380, 160, 520, clamp((t - fg - 0.25) / 0.9)); K.cobweb(1140, 160, 380, clamp((t - fg - 0.45) / 0.9), -1);
        K.door(1560, 820, 1.1, clamp((t - fg + 0.25) / 0.25)); K.coldWash(1); } });
    ev(fg, 'door', { note: 'door slams on "forgotten"' }); ev(fg + 0.5, 'appear', { note: 'cobweb spreads', sfx: false });
  }
  // S05 · the Danish flag snaps in the wind over the dark fort; slow push; gust + sting on "flag"
  { const st = L(6) - 0.08, fl = Wd('flag', 6);
    add({ id: 'B0-S05', at: st, beat: 0, cam: K.cam.push(1180, 380, 0.10), note: 'flag over the dark fort, push, sting',
      draw(lt, d, t) { K.nightSky(4, t, 700); K.fortDansborg(860, 1000, 1.5, t, { night: 1, lamps: 0.3, flag: false }); K.danishFlag(1180, 640, 330, t, { pole: 380, wind: t > fl ? 1.5 : 1.0 }); } });
    ev(st + 1.0, 'appear', { note: 'flag ripples', sfx: false }); ev(fl, 'flag', { note: 'gust on "flag"' }); ev(Le(6) - 0.1, 'sting', { note: 'cold-open sting', sfx: true });
  }
}
