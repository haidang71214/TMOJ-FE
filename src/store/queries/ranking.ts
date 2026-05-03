import { RankingEndpoint } from "@/constants/endpoints";
import {
  RankingGlobalRequest,
  RankingGlobalResponse,
  RankingContestsResponse,
  RatingLeaderboardRequest,
  RatingLeaderboardResponse,
  UserRatingHistoryResponse,
  RecalculateContestRatingsResponse,
} from "@/types";
import { baseApi } from "../base";

export const rankingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGlobalRanking: builder.query<RankingGlobalResponse, RankingGlobalRequest>({
      query: (params) => ({
        url: RankingEndpoint.GLOBAL,
        method: "GET",
        params,
      }),
      providesTags: ["Ranking"],
    }),
    getPublicContests: builder.query<RankingContestsResponse, void>({
      query: () => ({
        url: RankingEndpoint.CONTESTS,
        method: "GET",
      }),
      providesTags: ["Ranking"],
    }),
    getRatingLeaderboard: builder.query<RatingLeaderboardResponse, RatingLeaderboardRequest>({
      query: (params) => ({
        url: RankingEndpoint.RATING,
        method: "GET",
        params,
      }),
      providesTags: ["Ranking"],
    }),
    getUserRatingHistory: builder.query<UserRatingHistoryResponse, string>({
      query: (userId) => ({
        url: RankingEndpoint.USER_RATING_HISTORY.replace("{userId}", userId),
        method: "GET",
      }),
      providesTags: ["Ranking"],
    }),
    recalculateContestRatings: builder.mutation<RecalculateContestRatingsResponse, string>({
      query: (contestId) => ({
        url: RankingEndpoint.ADMIN_RECALCULATE.replace("{contestId}", contestId),
        method: "POST",
      }),
      invalidatesTags: ["Ranking"],
    }),
  }),
});

export const {
  useGetGlobalRankingQuery,
  useGetPublicContestsQuery,
  useGetRatingLeaderboardQuery,
  useGetUserRatingHistoryQuery,
  useRecalculateContestRatingsMutation,
} = rankingApi;
