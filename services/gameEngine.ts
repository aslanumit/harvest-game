
import { 
  Move, 
  Reaction,
  Strategy, 
  Participant, 
  GameRound, 
  MatchResult, 
  TournamentSummary, 
  ScoringMatrix 
} from '../types';
import { DEFAULT_SCORING } from '../constants';

const resolveReaction = (reaction: Reaction): Move => {
  if (reaction === 'RANDOM') {
    return Math.random() > 0.5 ? 'COOPERATE' : 'DEFECT';
  }
  return reaction;
};

const determineMove = (
  strategy: Strategy, 
  opponentHistory: Move[],
  currentRound: number,
  totalRounds: number
): Move => {
  // Case 1: First Round
  if (currentRound === 0) {
    return resolveReaction(strategy.initialMove);
  }

  // Case 2: Final Round
  if (currentRound === totalRounds - 1) {
    return resolveReaction(strategy.finalMove);
  }

  // Case 3: Middle Rounds - react to previous move
  const lastOpponentMove = opponentHistory[opponentHistory.length - 1];
  
  if (lastOpponentMove === 'DEFECT') {
    return resolveReaction(strategy.onOpponentDefect);
  } else {
    return resolveReaction(strategy.onOpponentCooperate);
  }
};

export const simulateMatch = (
  p1: Participant, 
  p2: Participant, 
  rounds: number,
  scoring: ScoringMatrix = DEFAULT_SCORING
): MatchResult => {
  const s1 = p1.strategy;
  const s2 = p2.strategy;

  const p1History: Move[] = [];
  const p2History: Move[] = [];
  const roundResults: GameRound[] = [];

  let p1Total = 0;
  let p2Total = 0;

  for (let r = 0; r < rounds; r++) {
    const m1 = determineMove(s1, p2History, r, rounds);
    const m2 = determineMove(s2, p1History, r, rounds);

    p1History.push(m1);
    p2History.push(m2);

    let s1Round = 0;
    let s2Round = 0;

    if (m1 === 'COOPERATE' && m2 === 'COOPERATE') {
      [s1Round, s2Round] = scoring.CC;
    } else if (m1 === 'COOPERATE' && m2 === 'DEFECT') {
      [s1Round, s2Round] = scoring.CD;
    } else if (m1 === 'DEFECT' && m2 === 'COOPERATE') {
      [s1Round, s2Round] = scoring.DC;
    } else {
      [s1Round, s2Round] = scoring.DD;
    }

    p1Total += s1Round;
    p2Total += s2Round;

    roundResults.push({
      p1Move: m1,
      p2Move: m2,
      p1Score: s1Round,
      p2Score: s2Round
    });
  }

  return {
    p1Id: p1.id,
    p2Id: p2.id,
    rounds: roundResults,
    p1TotalScore: p1Total,
    p2TotalScore: p2Total
  };
};

export const runTournament = (
  participants: Participant[],
  numRounds: number,
  scoring: ScoringMatrix = DEFAULT_SCORING
): TournamentSummary => {
  const matches: MatchResult[] = [];
  const totalScores: Record<string, number> = {};

  participants.forEach(p => { totalScores[p.id] = 0; });

  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      const match = simulateMatch(participants[i], participants[j], numRounds, scoring);
      matches.push(match);
      totalScores[participants[i].id] += match.p1TotalScore;
      totalScores[participants[j].id] += match.p2TotalScore;
    }
  }

  const totalPossibleRoundsPerParticipant = (participants.length - 1) * numRounds;
  const rankings = participants.map(p => ({
    participantId: p.id,
    totalScore: totalScores[p.id],
    avgScorePerRound: totalPossibleRoundsPerParticipant > 0 
      ? totalScores[p.id] / totalPossibleRoundsPerParticipant 
      : 0
  })).sort((a, b) => b.totalScore - a.totalScore);

  return {
    participantScores: totalScores,
    matches,
    rankings
  };
};
