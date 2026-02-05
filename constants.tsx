
import { ScoringMatrix, Strategy } from './types';

export const DEFAULT_SCORING: ScoringMatrix = {
  CC: [3, 3],
  CD: [0, 5],
  DC: [5, 0],
  DD: [1, 1],
};

export const PRESET_STRATEGIES: Strategy[] = [
  {
    id: 's-tft',
    name: 'Tit for Tat',
    initialMove: 'COOPERATE',
    onOpponentDefect: 'DEFECT',
    onOpponentCooperate: 'COOPERATE',
    finalMove: 'COOPERATE',
    description: 'Reciprocates the opponent\'s previous move.'
  },
  {
    id: 's-allc',
    name: 'Always Cooperate',
    initialMove: 'COOPERATE',
    onOpponentDefect: 'COOPERATE',
    onOpponentCooperate: 'COOPERATE',
    finalMove: 'COOPERATE',
    description: 'Pure altruism.'
  },
  {
    id: 's-alld',
    name: 'Always Defect',
    initialMove: 'DEFECT',
    onOpponentDefect: 'DEFECT',
    onOpponentCooperate: 'DEFECT',
    finalMove: 'DEFECT',
    description: 'Pure selfishness.'
  },
  {
    id: 's-rand',
    name: 'Random',
    initialMove: 'RANDOM',
    onOpponentDefect: 'RANDOM',
    onOpponentCooperate: 'RANDOM',
    finalMove: 'RANDOM',
    description: 'Unpredictable chaos.'
  }
];
