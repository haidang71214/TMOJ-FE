import { ProblemListEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { Problem } from "@/types";
export const problemPublicApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
     getProblemList: builder.query<{data : Problem[]}, void>({
      query: () => ({
        url: ProblemListEndpoint.GET_LIST_PUBLIC_PROBLEM,
        method: "GET",
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
