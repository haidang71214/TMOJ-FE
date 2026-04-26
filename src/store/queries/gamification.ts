import { AdminGamificationEndpoint, GamificationEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  UserGamification,
  Badge,
  BadgeProgress,
  StreakInfo,
  GamificationHistory,
  LeaderboardEntry,
  AdminBadge,
  AdminBadgeRule,
  CreateBadgeRequest,
  CreateBadgeRuleRequest,
  LeaderboardResponse,
  DailyActivity
} from "@/types/gamification";

export const gamificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // USER APIs
    getGamificationMe: builder.query<{ data: UserGamification }, void>({
      query: () => GamificationEndpoint.ME,
      providesTags: ["Gamification"],
    }),
    getBadges: builder.query<Badge[], void>({
      query: () => GamificationEndpoint.BADGES,
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        return response || [];
      },
      providesTags: ["Gamification"],
    }),
    getBadgeProgress: builder.query<{ data: BadgeProgress[] }, void>({
      query: () => GamificationEndpoint.PROGRESS,
      providesTags: ["Gamification"],
    }),
    getStreak: builder.query<{ data: StreakInfo }, void>({
      query: () => GamificationEndpoint.STREAK,
      providesTags: ["Gamification"],
    }),
    getGamificationHistory: builder.query<{ data: GamificationHistory[] }, void>({
      query: () => GamificationEndpoint.HISTORY,
      providesTags: ["Gamification"],
    }),
    getGamificationLeaderboard: builder.query<{ data: LeaderboardResponse }, { type: "exp" | "streak" | "badge" }>({
      query: ({ type }) => `${GamificationEndpoint.LEADERBOARD}?type=${type}`,
      providesTags: ["Gamification"],
    }),
    getDailyActivities: builder.query<{ data: DailyActivity[] }, void>({
      query: () => GamificationEndpoint.DAILY_ACTIVITIES,
      providesTags: ["Gamification"],
    }),

    // ADMIN APIs
    getAdminBadges: builder.query<AdminBadge[], void>({
      query: () => AdminGamificationEndpoint.BADGES,
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        return response || [];
      },
      providesTags: ["Gamification"],
    }),
    createBadge: builder.mutation<{ id: string }, CreateBadgeRequest>({
      query: (body) => ({
        url: AdminGamificationEndpoint.BADGES,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Gamification"],
    }),
    updateBadge: builder.mutation<void, { id: string; name: string; iconUrl: string; description: string; badgeCode: string; badgeCategory: string; badgeLevel: number; isRepeatable: boolean }>({
      query: ({ id, ...body }) => ({
        url: AdminGamificationEndpoint.BADGE_ID.replace("{id}", id),
        method: "PUT",
        body: { badgeId: id, ...body },
      }),
      invalidatesTags: ["Gamification"],
    }),
    deleteBadge: builder.mutation<{ data: void }, string>({
      query: (id) => ({
        url: AdminGamificationEndpoint.BADGE_ID.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Gamification"],
    }),

    getAdminBadgeRules: builder.query<AdminBadgeRule[], void>({
      query: () => AdminGamificationEndpoint.BADGE_RULES,
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        return response || [];
      },
      providesTags: ["Gamification"],
    }),
    createBadgeRule: builder.mutation<{ data: { id: string } }, CreateBadgeRuleRequest>({
      query: (body) => ({
        url: AdminGamificationEndpoint.BADGE_RULES,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Gamification"],
    }),
    updateBadgeRule: builder.mutation<{ data: void }, { id: string; badgeId: string; ruleType: string; targetEntity: string; targetValue: number; isActive: boolean }>({
      query: ({ id, ...body }) => ({
        url: AdminGamificationEndpoint.BADGE_RULE_ID.replace("{id}", id),
        method: "PUT",
        body: { id, ...body },
      }),
      invalidatesTags: ["Gamification"],
    }),
    deleteBadgeRule: builder.mutation<{ data: void }, string>({
      query: (id) => ({
        url: AdminGamificationEndpoint.BADGE_RULE_ID.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Gamification"],
    }),
  }),
});

export const {
  useGetGamificationMeQuery,
  useGetBadgesQuery,
  useGetBadgeProgressQuery,
  useGetStreakQuery,
  useGetGamificationHistoryQuery,
  useGetGamificationLeaderboardQuery,
  useGetDailyActivitiesQuery,
  useGetAdminBadgesQuery,
  useCreateBadgeMutation,
  useUpdateBadgeMutation,
  useDeleteBadgeMutation,
  useGetAdminBadgeRulesQuery,
  useCreateBadgeRuleMutation,
  useUpdateBadgeRuleMutation,
  useDeleteBadgeRuleMutation,
} = gamificationApi;
