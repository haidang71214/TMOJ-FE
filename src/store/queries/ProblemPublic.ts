import { ProblemListEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { Problem } from "@/types";
export const problemPublicApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProblemListPublic: builder.query<{
      data: Problem[];
      pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      };
    }, { page: number; pageSize: number; search?: string; difficulty?: string; tags?: string; sortBy?: string; sortOrder?: string }>({
      query: ({ page, pageSize, search, difficulty, tags, sortBy, sortOrder }) => ({
        url: ProblemListEndpoint.GET_LIST_PUBLIC_PROBLEM,
        method: "GET",
        params: {
          page,
          pageSize,
          search,
          difficulty: difficulty && difficulty !== "All" ? difficulty.toLowerCase() : undefined,
          tags,
          sortBy,
          sortOrder,
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
  useGetProblemListPublicQuery,
  useGetDetailProblemPublicQuery
} = problemPublicApi;
