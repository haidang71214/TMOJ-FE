import { Runtime, RuntimeResponse, SubmissionResponse, SubmitResponseV2, SubmissionListResponse } from "@/types";
import { baseApi } from "../base";
import { RuntimeEndpoint, SubmittionEndPoint } from "@/constants/endpoints";

export const SubmitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postSubmission: builder.mutation< SubmissionResponse, { problemId: string; body: FormData }>({
  query: ({ problemId, body }) => ({
    url: SubmittionEndPoint.GET_SUBMITTION_FROM_USER.replace("{problemId}", problemId),
    method: "POST",
    body: body,
  }),
  invalidatesTags: ["submittion", "ProblemDetail"],
}),
getSubmission: builder.query<SubmitResponseV2, {submissionId:string}>({
    query: ({submissionId}) => ({
      url: SubmittionEndPoint.GET_SUBMITTION.replace("{submissionId}",submissionId),
      method: "GET",
    }),
    async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      try {
        await queryFulfilled;
        // Kích hoạt rtk-query chọc API list tự động refetch lại mọi lần GET_SUBMITTION hoàn thành
        dispatch(baseApi.util.invalidateTags(["ProblemDetail"]));
      } catch (e) {
        // silently ignore error map
      }
    },
  }),
getSubmissionListByProblem: builder.query<SubmissionListResponse, string>({
  query: (problemId) => ({
    url: SubmittionEndPoint.GET_SUBMISSIONS_LIST_BY_PROBLEM.replace("{problemId}", problemId),
    method: "GET",
  }),
  providesTags: ["ProblemDetail"],
}),
// get toàn bộ phần runtime, và get chi tiết phần runtime
getRuntimeList: builder.query<RuntimeResponse, void>({
  query: () => ({
    url: RuntimeEndpoint.GET_ALL_RUNTIME,
    method: "GET",
  }),
}),
 getRuntimeDetail:builder.query<{data:Runtime},{id:string}>({
  query: ({id}) => ({
    url: RuntimeEndpoint.GET_DETAIL_RUNTIME.replace("{id}",id),
    method: "GET",
  }),
  providesTags: ["submittion"],
}),
  }),
});


export const {
  useGetSubmissionQuery,
  usePostSubmissionMutation,
  useGetRuntimeListQuery,
  useGetRuntimeDetailQuery,
  useGetSubmissionListByProblemQuery,
} = SubmitionApi;
