
export type Move = 'COOPERATE' | 'DEFECT';
export type Reaction = Move | 'RANDOM';

export interface Strategy {
  id: string;
  name: string;
  initialMove: Reaction;
  onOpponentDefect: Reaction;
  onOpponentCooperate: Reaction;
  finalMove: Reaction;
  description: string;
}

export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  strategy: Strategy;
}

export interface GameRound {
  p1Move: Move;
  p2Move: Move;
  p1Score: number;
  p2Score: number;
}

export interface MatchResult {
  p1Id: string;
  p2Id: string;
  rounds: GameRound[];
  p1TotalScore: number;
  p2TotalScore: number;
}

export interface TournamentSummary {
  participantScores: Record<string, number>;
  matches: MatchResult[];
  rankings: { participantId: string; totalScore: number; avgScorePerRound: number }[];
}

export interface ScoringMatrix {
  CC: [number, number]; // Cooperate, Cooperate
  CD: [number, number]; // Cooperate, Defect
  DC: [number, number]; // Defect, Cooperate
  DD: [number, number]; // Defect, Defect
}

export interface VillagePreset {
  id: string;
  name: string;
  participants: Participant[];
  scoring: ScoringMatrix;
  numRounds: number;
  timestamp: number;
}
