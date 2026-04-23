import { AdminGamificationEndpoint } from "@/constants/endpoints";
import {
  Badge,
  BadgeRule,
  CreateBadgeRequest,
  CreateBadgeResponse,
  CreateBadgeRuleRequest,
  CreateBadgeRuleResponse,
  UpdateBadgeRuleRequest
} from "@/types/gamification";
import { baseApi } from "../base";

export const gamificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Badge Admin APIs
    getAdminBadges: builder.query<{ data: Badge[] }, void>({
      query: () => ({
        url: AdminGamificationEndpoint.BADGES,
        method: "GET",
      }),
      providesTags: ["Badges"],
    }),
    createBadge: builder.mutation<CreateBadgeResponse, CreateBadgeRequest>({
      query: (body) => ({
        url: AdminGamificationEndpoint.BADGES,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Badges"],
    }),
    updateBadge: builder.mutation<{ message: string }, { id: string; data: Partial<CreateBadgeRequest> }>({
      query: ({ id, data }) => ({
        url: AdminGamificationEndpoint.BADGE_ID.replace("{id}", id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Badges"],
    }),
    deleteBadge: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: AdminGamificationEndpoint.BADGE_ID.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Badges"],
    }),

    // Badge Rule Admin APIs
    getAdminBadgeRules: builder.query<{ data: BadgeRule[] }, void>({
      query: () => ({
        url: AdminGamificationEndpoint.BADGE_RULES,
        method: "GET",
      }),
      providesTags: ["BadgeRules"],
    }),
    createBadgeRule: builder.mutation<CreateBadgeRuleResponse, CreateBadgeRuleRequest>({
      query: (body) => ({
        url: AdminGamificationEndpoint.BADGE_RULES,
        method: "POST",
        body,
      }),
      invalidatesTags: ["BadgeRules"],
    }),
    updateBadgeRule: builder.mutation<{ message: string }, UpdateBadgeRuleRequest>({
      query: ({ id, ...data }) => ({
        url: AdminGamificationEndpoint.BADGE_RULE_ID.replace("{id}", id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BadgeRules"],
    }),
    deleteBadgeRule: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: AdminGamificationEndpoint.BADGE_RULE_ID.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["BadgeRules"],
    }),
  }),
});

export const {
  useGetAdminBadgesQuery,
  useCreateBadgeMutation,
  useUpdateBadgeMutation,
  useDeleteBadgeMutation,
  useGetAdminBadgeRulesQuery,
  useCreateBadgeRuleMutation,
  useUpdateBadgeRuleMutation,
  useDeleteBadgeRuleMutation,
} = gamificationApi;
