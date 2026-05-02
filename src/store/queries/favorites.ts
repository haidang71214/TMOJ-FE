import { FavoriteEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { FavoriteToggleResponse, FavoriteCheckResponse, ProblemListResponse } from "@/types";

export const favoriteApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    toggleProblemFavorite: builder.mutation<FavoriteToggleResponse, string>({
      query: (problemId) => ({
        url: FavoriteEndpoint.TOGGLE_PROBLEM.replace("{problemId}", problemId),
        method: "POST",
      }),
      invalidatesTags: ["Problem", "Favorites","CollectionDetail","Collections"],
    }),
    toggleContestFavorite: builder.mutation<any, string>({
      query: (contestId) => ({
        url: FavoriteEndpoint.TOGGLE_CONTEST.replace("{contestId}", contestId),
        method: "POST",
      }),
      invalidatesTags: ["Contest", "Favorites","CollectionDetail","Collections"],
    }),
    checkFavorite: builder.query<FavoriteCheckResponse, { problemId?: string; contestId?: string }>({
      query: (params) => ({
        url: FavoriteEndpoint.CHECK,
        method: "GET",
        params,
      }),
      providesTags: ["Favorites"],
    }),
    getFavoriteProblems: builder.query<ProblemListResponse, { page?: number; pageSize?: number }>({
      query: (params) => ({
        url: FavoriteEndpoint.GET_PROBLEMS,
        method: "GET",
        params,
      }),
      providesTags: ["Favorites", "Problem"],
    }),
    getFavoriteContests: builder.query<any, { page?: number; pageSize?: number }>({
      query: (params) => ({
        url: FavoriteEndpoint.GET_CONTESTS,
        method: "GET",
        params,
      }),
      providesTags: ["Favorites", "Contest"],
    }),
  }),
});

export const {
  useToggleProblemFavoriteMutation,
  useToggleContestFavoriteMutation,
  useCheckFavoriteQuery,
  useGetFavoriteProblemsQuery,
  useGetFavoriteContestsQuery,
} = favoriteApi;
