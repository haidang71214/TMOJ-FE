import { ProblemEndPoint, ProblemTemplateEndPoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {  
  CreateProblemDraftResponse, 
  ProblemListResponse, 
  ProblemTestCaseUploadResponse, 
  ProblemTestsetCreate, 
  ProblemTestsetResponse, 
  ProblemBankListResponse,
  CreateProblemTemplateRequest,
  CreateProblemTemplateResponse,
  GetProblemTemplatesResponse,
  UpdateProblemTemplateRequest,
  CreateVirtualProblemRequest
} from "@/types";

export const problemApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProblemListQuery: builder.query<ProblemListResponse, void>({
      query: () => ({
        url: ProblemEndPoint.GET_LIST_PROBLEM,
        method: "GET",
      }),
      providesTags: ["Problem"],
    }),
    getProblemBankList: builder.query<ProblemBankListResponse, { page?: number; pageSize?: number; search?: string; difficulty?: string }>({
      query: ({ page = 1, pageSize = 20, search = "", difficulty = "" }) => ({
        url: ProblemEndPoint.GET_LIST_PROBLEM_BANK,
        method: "GET",
        params: { page, pageSize, search, difficulty },
      }),
      providesTags: ["ProblemBank"],
    }),
    getProblemListPublic: builder.query<ProblemListResponse, void>({
      query: () => ({
        url: ProblemEndPoint.GET_LIST_PROBLEM_PUBLIC,
        method: "GET",
      }),
      providesTags: ["Problem"],
    }),
    createProblemDraft: builder.mutation<CreateProblemDraftResponse, FormData>({
      query: (body) => ({
        url: ProblemEndPoint.CREATE_PROBLEM_DAFT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
    createProblemStudent: builder.mutation<CreateProblemDraftResponse, FormData>({
      query: (body) => ({
        url: ProblemEndPoint.CREATE_PROBLEM_STUDENT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
    createTestSet: builder.mutation<ProblemTestsetResponse,{ id: string; body: ProblemTestsetCreate }>({
      query: ({ id, body }) => ({
        url: ProblemEndPoint.CREATE_TESTSET_PROBLEM.replace("{id}", id),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
    createTestCase: builder.mutation<ProblemTestCaseUploadResponse,{ id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: ProblemEndPoint.CREATE_TESTCASE_PROBLEM.replace("{id}", id),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
    updateProblemContent: builder.mutation<any, { problemId: string; body: FormData }>({
      query: ({ problemId, body }) => ({
        url: ProblemEndPoint.UPDATE_PROBLEM.replace("{problemId}", problemId),
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
    updateProblemDifficulty: builder.mutation<any, { problemId: string; difficulty: string }>({
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
    donateProblem: builder.mutation<CreateProblemDraftResponse, FormData>({
      query: (body) => ({
        url: ProblemEndPoint.DONATE_PROBLEM,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProblemBank"],
    }),
    createProblemTemplate: builder.mutation<
      CreateProblemTemplateResponse,
      { problemId: string; body: CreateProblemTemplateRequest }
    >({
      query: ({ problemId, body }) => ({
        url: ProblemTemplateEndPoint.CREATE_TEMPLATE.replace("{problemId}", problemId),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
    getProblemTemplates: builder.query<GetProblemTemplatesResponse, string>({
      query: (problemId) => ({
        url: ProblemTemplateEndPoint.GET_TEMPLATES.replace("{problemId}", problemId),
        method: "GET",
      }),
      providesTags: ["Problem"],
    }),
    updateProblemTemplate: builder.mutation<
      any,
      { codeTemplateId: string; body: UpdateProblemTemplateRequest }
    >({
      query: ({ codeTemplateId, body }) => ({
        url: ProblemTemplateEndPoint.UPDATE_TEMPLATE.replace("{codeTemplateId}", codeTemplateId),
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
    createVirtualProblem: builder.mutation<any, CreateVirtualProblemRequest>({
      query: (body) => ({
        url: ProblemEndPoint.CREATE_VIRTUAL_PROBLEM,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProblemBank"], // Or "Problem" if you want to refresh the list
    }),
    createRemixProblem: builder.mutation<any, FormData>({
      query: (body) => ({
        url: ProblemEndPoint.CREATE_REMIX_PROBLEM,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Problem"],
    }),
  }),
});

export const {
  useGetProblemListQueryQuery,
  useCreateProblemDraftMutation,
  useCreateTestSetMutation,
  useCreateTestCaseMutation,
  useUpdateProblemContentMutation,
  useUpdateProblemDifficultyMutation,
  useDownloadProblemStatementMutation,
  useGetProblemListPublicQuery,
  useCreateProblemStudentMutation,
  useDonateProblemMutation,
  useGetProblemBankListQuery,
  useCreateProblemTemplateMutation,
  useGetProblemTemplatesQuery,
  useUpdateProblemTemplateMutation,
  useCreateVirtualProblemMutation,
  useCreateRemixProblemMutation,
} = problemApi;

