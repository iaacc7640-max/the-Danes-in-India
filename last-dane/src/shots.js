// THE LAST DANE · the shot list, one file per beat in src/beats/. Each beat adds its shots and logs its visual events.
import * as K from './core/kit.js';
import { b0 } from './beats/b0_cold.js';
import { b1 } from './beats/b1_nobody.js';
import { b2 } from './beats/b2_breaks.js';
import { b3 } from './beats/b3_chosen.js';
import { T } from './core/timing.js';

export function buildShots() {
  const S = [], add = (o) => (S.push(o), o);
  b0(add, K.ev, K.snap); b1(add, K.ev, K.snap); b2(add, K.ev, K.snap); b3(add, K.ev, K.snap);
  // foley beds (pilot: cold open + beat 1)
  const F = [[0, 7.0, 'siege', 1], [7.0, 13.0, 'room', 0.8], [13.0, 14.65, 'room', 0.6], [14.65, 17.5, 'siege', 0.9], [17.4, 25.9, 'harbour', 1],
    [25.9, 28.9, 'crowd', 0.8], [31.5, 36.2, 'room', 0.7], [38.7, 41.3, 'surf', 0.9], [47.8, 52.4, 'storm', 1], [55.3, 62.1, 'surf', 0.9]];
  F.forEach(([a, b, n, g]) => K.foley(a, b, n, g));
  // pilot: hold the last built shot to the end of the timeline (later beats replace this)
  return { shots: S, cues: [] };
}
