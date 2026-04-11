import { ProblemListEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { Problem } from "@/types";
export const problemPublicApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProblemList: builder.query<{
      data: Problem[];
      pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      };
    }, { page: number; pageSize: number; search?: string; difficulty?: string }>({
      query: ({ page, pageSize, search, difficulty }) => ({
        url: ProblemListEndpoint.GET_LIST_PUBLIC_PROBLEM,
        method: "GET",
        params: {
          page,
          pageSize,
          search,
          difficulty,
        },
      }),
      providesTags: ["ProblemList"], 
    }),
getDetailProblemPublic: builder.query<{ data: Problem }, { id: string }>({
  query: ({ id }) => ({
    url: ProblemListEndpoint.GET_DETAIL_PUBLIC_PROBLEM.replace("{id}", id),
    method: "GET",
  }),
  providesTags: ["ProblemList"],
}),
  }),
});


export const {
  useGetProblemListQuery,
  useGetDetailProblemPublicQuery
} = problemPublicApi;
