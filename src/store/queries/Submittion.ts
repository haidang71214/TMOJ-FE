import { Runtime, RuntimeResponse, SubmitResponse } from "@/types";
import { baseApi } from "../base";
import { RuntimeEndpoint, SubmittionEndPoint } from "@/constants/endpoints";

export const SubmitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postSubmission: builder.mutation<{data: SubmitResponse}, { problemId: string; body: FormData }>({
  query: ({ problemId, body }) => ({
    url: SubmittionEndPoint.GET_SUBMITTION_FROM_USER.replace("{problemId}", problemId),
    method: "POST",
    body: body,
  }),
  invalidatesTags: ["submittion"],
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
  usePostSubmissionMutation,
  useGetRuntimeListQuery,
  useGetRuntimeDetailQuery,
} = SubmitionApi;
