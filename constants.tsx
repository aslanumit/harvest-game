
import { ScoringMatrix, Strategy } from './types';

export const DEFAULT_SCORING: ScoringMatrix = {
  CC: [3, 3],
  CD: [0, 5],
  DC: [5, 0],
  DD: [1, 1],
};