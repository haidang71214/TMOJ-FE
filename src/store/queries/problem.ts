import { ProblemEndPoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {  CreateProblemDraftResponse, ProblemListResponse, ProblemTestCaseUploadResponse, ProblemTestsetCreate, ProblemTestsetResponse } from "@/types";
export const prolemApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProblemListQuery: builder.query<ProblemListResponse, void>({
  query: () => ({
    url: ProblemEndPoint.GET_LIST_PROBLEM,
    method: "GET",
    
  }),
  providesTags: ["Problem"],
}),
getProblemListPublic: builder.query<ProblemListResponse, void>({
  query: () => ({
    url: ProblemEndPoint.GET_LIST_PROBLEM_PUBLIC,
    method: "GET",
    
  }),
  providesTags: ["Problem"],
}),
// create problem draft sẽ là của sinh viên. 
createProblemDraft: builder.mutation<
  CreateProblemDraftResponse,
  FormData
>({
  query: (body) => ({
    url: ProblemEndPoint.CREATE_PROBLEM_DAFT,
    method: "POST",
    body,
  }),
  invalidatesTags: ["Problem"],
}),
createProblemStudent: builder.mutation<
  CreateProblemDraftResponse,
  FormData
>({
  query: (body) => ({
    url: ProblemEndPoint.CREATE_PROBLEM_STUDENT,
    method: "POST",
    body,
  }),
  invalidatesTags: ["Problem"],
}),
// này để cấp phát bộ nhớ
createTestSet: builder.mutation<ProblemTestsetResponse,{ id: string; body: ProblemTestsetCreate }>({
  query: ({ id, body }) => ({
    url: ProblemEndPoint.CREATE_TESTSET_PROBLEM.replace("{id}", id),
    method: "POST",
    body,
  }),
  invalidatesTags: ["Problem"],
}),
// này để lưu
 createTestCase: builder.mutation<ProblemTestCaseUploadResponse,{ id: string; body: FormData }>({
  query: ({ id, body }) => ({
    url: ProblemEndPoint.CREATE_TESTCASE_PROBLEM.replace("{id}", id),
    method: "POST",
    body,
  }),
  invalidatesTags: ["Problem"],
}),
updateProblemContent: builder.mutation<
  any,
  { problemId: string; body: FormData }
>({
  query: ({ problemId, body }) => ({
    url: ProblemEndPoint.UPDATE_PROBLEM.replace("{problemId}", problemId),
    method: "PUT",
    body,
  }),
  invalidatesTags: ["Problem"],
}),
updateProblemDifficulty: builder.mutation<
  any,
  { problemId: string; difficulty: string }
>({
  query: ({ problemId, difficulty }) => ({
    url: ProblemEndPoint.UPDATE_PROBLEM_DIFFICULTY.replace("{problemId}", problemId),
    method: "PUT",
    body: { difficulty },
  }),
  invalidatesTags: ["Problem"],
}),
downloadProblemStatement: builder.mutation<Blob, string>({
  query: (problemId) => ({
    url: ProblemEndPoint.DOWNLOAD_PROBLEM_STATEMENT.replace("{problemId}", problemId),
    method: "GET",
    responseHandler: (response) => response.blob(),
  }),
}),
    }),
   
  })
export const {
  useGetProblemListQueryQuery,
  useCreateProblemDraftMutation,
  useCreateTestSetMutation,
  useCreateTestCaseMutation,
  useUpdateProblemContentMutation,
  useUpdateProblemDifficultyMutation,
  useDownloadProblemStatementMutation,
  useGetProblemListPublicQuery,
  useCreateProblemStudentMutation
} = prolemApi;
