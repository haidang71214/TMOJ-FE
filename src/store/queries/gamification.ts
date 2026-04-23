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
  CreateBadgeRuleRequest,
  LeaderboardResponse
} from "@/types/gamification";

export const gamificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // USER APIs
    getGamificationMe: builder.query<{ data: UserGamification }, void>({
      query: () => GamificationEndpoint.ME,
      providesTags: ["Gamification"],
    }),
    getBadges: builder.query<{ data: Badge[] }, void>({
      query: () => GamificationEndpoint.BADGES,
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
    getLeaderboard: builder.query<{ data: LeaderboardResponse }, { type: "exp" | "streak" | "badge" }>({
      query: ({ type }) => `${GamificationEndpoint.LEADERBOARD}?type=${type}`,
      providesTags: ["Gamification"],
    }),

    // ADMIN APIs
    getAdminBadges: builder.query<{ data: AdminBadge[] }, void>({
      query: () => AdminGamificationEndpoint.BADGES,
      providesTags: ["Gamification"],
    }),
    createBadge: builder.mutation<{ data: { id: string } }, { name: string; code: string }>({
      query: (body) => ({
        url: AdminGamificationEndpoint.BADGES,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Gamification"],
    }),
    updateBadge: builder.mutation<{ data: void }, { id: string; name: string; code: string }>({
      query: ({ id, ...body }) => ({
        url: AdminGamificationEndpoint.BADGE_ID.replace("{id}", id),
        method: "PUT",
        body,
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

    getAdminBadgeRules: builder.query<{ data: AdminBadgeRule[] }, void>({
      query: () => AdminGamificationEndpoint.BADGE_RULES,
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
    updateBadgeRule: builder.mutation<{ data: void }, { id: string; ruleType: string; targetEntity: string; targetValue: number; isActive: boolean }>({
      query: ({ id, ...body }) => ({
        url: AdminGamificationEndpoint.BADGE_RULE_ID.replace("{id}", id),
        method: "PUT",
        body,
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
  useGetLeaderboardQuery,
  useGetAdminBadgesQuery,
  useCreateBadgeMutation,
  useUpdateBadgeMutation,
  useDeleteBadgeMutation,
  useGetAdminBadgeRulesQuery,
  useCreateBadgeRuleMutation,
  useUpdateBadgeRuleMutation,
  useDeleteBadgeRuleMutation,
} = gamificationApi;
