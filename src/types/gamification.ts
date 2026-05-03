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

export interface AdminBadge {
  badgeId: string;
  name: string;
  iconUrl: string;
  description: string;
  badgeCode: string;
  badgeCategory: string;
  badgeLevel: number;
  isRepeatable: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  badgeRules?: any[];
}

export interface CreateBadgeRequest {
  name: string;
  iconUrl?: string;
  iconFile?: File | null;
  description?: string;
  badgeCode: string;
  badgeCategory: string;
  badgeLevel: number;
  isRepeatable: boolean;
}

export interface UpdateBadgeRequest {
  id: string;
  name: string;
  iconUrl?: string;
  iconFile?: File | null;
  description?: string;
  badgeCategory: string;
  badgeLevel: number;
}

export interface Badge {
  badgeId: string;
  name: string;
  iconUrl?: string | null;
  currentValue?: number;
  targetValue?: number;
  progressPercent?: number;
  isCompleted?: boolean;
  awardedAt?: string;
  description?: string;
}



export interface BadgeProgress {
  badgeId: string;
  name: string;
  iconUrl?: string | null;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  isCompleted: boolean;
  awardedAt?: string;
  description?: string;
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

export interface DailyActivity {
  date: string;
  count: number;
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


export interface AdminBadgeRule {
  id: string;
  badgeId: string;
  badgeName: string;
  ruleType: string;
  targetEntity: string;
  targetValue: number;
  isActive: boolean;
}

export interface Mission {
  ruleId: string;
  title: string;
  description: string;
  category: "CHECK-IN" | "CONTEST" | "PROFILE" | "CONTRIBUTION" | string;
  rewardCoin: number;
  rewardExp: number;
  currentValue: number;
  targetValue: number;
  status: "LOCKED" | "READY" | "CLAIMED";
  claimedAt: string | null;
}

export interface ClaimResponse {
  success: boolean;
  message: string;
  addedCoin: number;
  addedExp: number;
}
