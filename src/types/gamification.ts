export type BadgeCategory = "contest" | "course" | "org" | "streak" | "problem";

export interface Badge {
  id: string;
  name: string;
  badge_code: string;
  badge_category: BadgeCategory;
  badge_level: number;
  is_repeatable: boolean;
  description: string;
  icon_url?: string;
  awarded_count: number;
}

export interface CreateBadgeRequest {
  name: string;
  code: string;
}

export interface CreateBadgeResponse {
  id: string;
}

export type RuleType = "rank" | "streak_days" | "solved" | "complete_contest";
export type TargetEntity = "contest" | "course" | "org" | "streak" | "problem";

export interface BadgeRule {
  id: string;
  badge_id: string;
  badge_name: string;
  rule_type: RuleType;
  target_entity: TargetEntity;
  target_value: number;
  is_active: boolean;
}

export interface CreateBadgeRuleRequest {
  ruleType: string;
  targetValue: number;
}

export interface UpdateBadgeRuleRequest extends Partial<CreateBadgeRuleRequest> {
  id: string;
}

export interface CreateBadgeRuleResponse {
  id: string;
}
