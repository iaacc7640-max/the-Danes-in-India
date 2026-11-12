// THE LAST DANE · the shot list, one file per beat in src/beats/. Each beat adds its shots and logs its visual events.
import * as K from './core/kit.js';
import { b0 } from './beats/b0_cold.js';
import { b1 } from './beats/b1_nobody.js';
import { b2 } from './beats/b2_breaks.js';
import { b3 } from './beats/b3_chosen.js';
import { b4 } from './beats/b4_rent.js';
import { b5 } from './beats/b5_nine.js';
import { b6 } from './beats/b6_trader.js';
import { b7 } from './beats/b7_sail.js';
import { b8 } from './beats/b8_nothanks.js';
import { b9 } from './beats/b9_twist.js';
import { T } from './core/timing.js';

export function buildShots() {
  const S = [], add = (o) => (S.push(o), o);
  b0(add, K.ev, K.snap); b1(add, K.ev, K.snap); b2(add, K.ev, K.snap); b3(add, K.ev, K.snap); b4(add, K.ev, K.snap); b5(add, K.ev, K.snap); b6(add, K.ev, K.snap); b7(add, K.ev, K.snap); b8(add, K.ev, K.snap); b9(add, K.ev, K.snap);
  // foley beds (pilot: cold open + beat 1)
  const F = [[0, 7.0, 'siege', 1], [7.0, 13.0, 'room', 0.8], [13.0, 14.65, 'room', 0.6], [14.65, 17.5, 'siege', 0.9], [17.4, 25.9, 'harbour', 1],
    [25.9, 28.9, 'crowd', 0.8], [31.5, 36.2, 'room', 0.7], [38.7, 41.3, 'surf', 0.9], [47.8, 52.4, 'storm', 1], [55.3, 61.0, 'surf', 0.9]];
  F.forEach(([a, b, n, g]) => K.foley(a, b, n, g));
  // beats 2-9: a foley bed for every shot, from its note/look (siege + wind at night, room indoors, surf at the shore, crowd in town)
  const bedFor = (id) => ({ 'B2-S30': 'surf', 'B2-S31': 'siege', 'B2-S32': 'siege', 'B2-S33': 'room', 'B2-S34': 'harbour', 'B2-S35': 'room', 'B2-S37': 'surf', 'B2-S38': 'room', 'B2-S39': 'surf', 'B2-S41': 'surf', 'B2-S42': 'surf',
    'B3-S50': 'room', 'B3-S51': 'room', 'B3-S52': 'room', 'B3-S53': 'crowd', 'B3-S54': 'crowd', 'B3-S55': 'room',
    'B4-S60': 'crowd', 'B4-S62': 'crowd', 'B4-S63': 'crowd', 'B4-S64': 'room', 'B4-S66': 'room', 'B4-S67': 'siege', 'B4-S68': 'siege', 'B4-S69': 'siege',
    'B5-S81': 'crowd', 'B5-S85': 'siege', 'B5-S86': 'siege', 'B5-S87': 'surf', 'B5-S88': 'room', 'B5-S89': 'room',
    'B6-S90': 'surf', 'B6-S91': 'surf', 'B6-S96': 'surf', 'B6-S97': 'surf', 'B6-S99': 'room', 'B6-S100': 'room',
    'B7-S110': 'surf', 'B7-S111': 'surf', 'B7-S113': 'room', 'B7-S114': 'surf', 'B7-S115': 'surf', 'B7-S116': 'surf', 'B7-S117': 'surf', 'B7-S118': 'room', 'B7-S119': 'room', 'B7-S120': 'surf', 'B7-S121': 'crowd',
    'B8-S130': 'room', 'B8-S132': 'room', 'B8-S133': 'room', 'B8-S134': 'room', 'B8-S135': 'room', 'B8-S136': 'room', 'B8-S138': 'surf', 'B8-S139': 'surf', 'B8-S140': 'room',
    'B9-S153': 'crowd', 'B9-S157': 'surf', 'B9-S158': 'surf', 'B9-S159': 'surf', 'B9-S160': 'crowd', 'B9-S161': 'siege', 'B9-S162': 'crowd' })[id];
  const ss = S.slice().sort((a, b) => a.at - b.at);
  ss.forEach((s, i) => { const n = bedFor(s.id); if (n && s.at > 60) K.foley(s.at, i < ss.length - 1 ? ss[i + 1].at : T.dur, n, n === 'siege' ? 0.7 : 0.8); });
  // pilot: hold the last built shot to the end of the timeline (later beats replace this)
  return { shots: S, cues: [] };
}
