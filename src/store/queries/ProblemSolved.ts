import { ProblemSolvedEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  ProblemSolvedStatsResponse,
  ProblemSolvedListResponse,
} from "@/types";

export const problemSolvedApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProblemSolvedStats: builder.query<
      ProblemSolvedStatsResponse,
      { visibilityCode?: string; solvedSourceCode?: string } | void
    >({
      query: (params) => ({
        url: ProblemSolvedEndpoint.GET_ME_STATS,
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Problem"],
    }),
    getProblemSolvedList: builder.query<
      ProblemSolvedListResponse,
      {
        page?: number;
        pageSize?: number;
        visibilityCode?: string;
        solvedSourceCode?: string;
        difficulty?: string;
      } | void
    >({
      query: (params) => ({
        url: ProblemSolvedEndpoint.GET_ME,
        method: "GET",
        params: params || { page: 1, pageSize: 20 },
      }),
      providesTags: ["Problem"],
    }),
  }),
});

export const {
  useGetProblemSolvedStatsQuery,
  useGetProblemSolvedListQuery,
} = problemSolvedApi;
