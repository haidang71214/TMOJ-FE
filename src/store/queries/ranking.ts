import { RankingEndpoint } from "@/constants/endpoints";
import { RankingGlobalRequest, RankingGlobalResponse, RankingContestsResponse } from "@/types";
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
  }),
});

export const {
  useGetGlobalRankingQuery,
  useGetPublicContestsQuery,
} = rankingApi;
