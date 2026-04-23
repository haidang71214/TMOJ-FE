export interface UserGamification {
  exp: number;
  level: number;
  streak: number;
  coins: number;
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
}

export interface GamificationHistory {
  type: "badge" | "reward" | string;
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
  value: number;
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
