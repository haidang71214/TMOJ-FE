export interface UserGamification {
  currentStreak: number;
  longestStreak: number;
  solvedProblems: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  badges: Badge[];
}

export interface Badge {
  badgeId: string;
  name: string;
  awardedAt: string;
}

export interface BadgeProgress {
  badge: string;
  progress: number;
  target: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface GamificationHistory {
  type: string;
  name: string;
  time: string;
}

export interface CreateBadgeRuleRequest {
  badgeId: string;
  ruleType: string;
  targetEntity?: string | null;
  targetValue: number;
  scopeId?: string | null;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  solvedCount: number;
  avatarUrl: string | null;
  value: number;
  rank: number;
}

export interface LeaderboardResponse {
  type: string;
  total: number;
  top: number;
  items: LeaderboardEntry[];
  me: LeaderboardEntry | null;
}

export interface AdminBadge {
  id: string;
  name: string;
  code: string;
  category: "contest" | "course" | "org" | "streak" | "problem";
  level: number;
  isRepeatable: boolean;
  description: string;
  iconUrl?: string;
  awardedCount: number;
}

export interface AdminBadgeRule {
  id: string;
  badgeId: string;
  badgeName: string;
  ruleType: string;
  targetEntity: string;
  targetValue: number;
  isActive: boolean;
}
