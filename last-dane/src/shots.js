// THE LAST DANE · the shot list, one file per beat in src/beats/. Each beat adds its shots and logs its visual events.
import * as K from './core/kit.js';
import { b0 } from './beats/b0_cold.js';
import { b1 } from './beats/b1_nobody.js';
import { T } from './core/timing.js';

export function buildShots() {
  const S = [], add = (o) => (S.push(o), o);
  b0(add, K.ev, K.snap); b1(add, K.ev, K.snap);
  // pilot: hold the last built shot to the end of the timeline (later beats replace this)
  return { shots: S, cues: [] };
}
