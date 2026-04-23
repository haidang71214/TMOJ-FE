
// ACM Mode DTOs
export interface ACMProblemAttemptDTO {
  problemId: string;
  isSolved: boolean;
  isFirstBlood: boolean;
  attemptsCount: number;
  penaltyTime?: number;
}

export interface ACMScoreboardRowDTO {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  fullname?: string;
  totalSolved: number;
  totalPenalty: number;
  problems: ACMProblemAttemptDTO[];
}

// IOI Mode DTOs
export interface IOIProblemAttemptDTO {
  problemId: string;
  score: number;
  attemptsCount: number;
}

export interface IOIScoreboardRowDTO {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  fullname?: string;
  totalScore: number;
  problems: IOIProblemAttemptDTO[];
}

// Union type for rows based on mode
export type ScoreboardRowDTO = ACMScoreboardRowDTO | IOIScoreboardRowDTO;
export type ProblemAttemptDTO = ACMProblemAttemptDTO | IOIProblemAttemptDTO;
export interface ContestProblemHeaderDTO {
  id: string;
  title: string;
  balloonColor?: string;
  solvedCount: number;
  totalAttempts: number;
}

// Base response structure (shared fields)
interface BaseScoreboardResponseDTO {
  contestId: string;
  contestName: string;
  scoringMode: "acm" | "ioi";
  status: "upcoming" | "running" | "ended";
  frozen: boolean;
  problems: ContestProblemHeaderDTO[];
  lastUpdated: string;
}

// ACM-specific response
export interface ACMScoreboardResponseDTO extends BaseScoreboardResponseDTO {
  scoringMode: "acm";
  rows: ACMScoreboardRowDTO[];
}

// IOI-specific response
export interface IOIScoreboardResponseDTO extends BaseScoreboardResponseDTO {
  scoringMode: "ioi";
  rows: IOIScoreboardRowDTO[];
}

// Union type for the full response
export type ScoreboardResponseDTO = ACMScoreboardResponseDTO | IOIScoreboardResponseDTO;
