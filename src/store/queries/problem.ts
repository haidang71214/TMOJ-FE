import { ProblemEndPoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { CreateProblemDraftRequest, CreateProblemDraftResponse, ProblemListResponse, ProblemTestCaseUploadResponse, ProblemTestsetCreate, ProblemTestsetResponse } from "@/types";
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

createProblemDraft: builder.mutation<CreateProblemDraftResponse, CreateProblemDraftRequest>({ // put,
  query: (body) => ({
    url: `${ProblemEndPoint.CREATE_PROBLEM_DAFT}`,
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
    }),
   
  })
export const {
  useGetProblemListQueryQuery,
  useCreateProblemDraftMutation,
  useCreateTestSetMutation,
  useCreateTestCaseMutation
} = prolemApi;
