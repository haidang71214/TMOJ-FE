import { StudyPlanEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { CreateProblemDraftResponse, CreateStudyPlanRequest, CreateStudyPlanResponse, GetStudyPlansResponse } from "@/types";


export const studyPlanApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createStudyPlan: builder.mutation<
      { data: CreateStudyPlanResponse }, 
      CreateStudyPlanRequest
    >({
      query: (params) => ({
        url: StudyPlanEndpoint.CREATE_STUDY_PLAN,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["StudyPlan"], // hoặc ["StudyPlans"] tùy bạn dùng
    }),
    getStudyPlans: builder.query<GetStudyPlansResponse, { creatorId?: string } | void>({
      query: (params) => {
        let url = StudyPlanEndpoint.GET_ALL;
        if (params && params.creatorId) {
          url += `?creatorId=${params.creatorId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["StudyPlan"],
    }),
// tạo riêng 1 cái cho người tạo.
createProblemInPlan: builder.mutation<
  CreateProblemDraftResponse,
  FormData
>({
  query: (body) => ({
    url: StudyPlanEndpoint.CREATE_PROBLEM_INPLAN,
    method: "POST",
    body,
  }),
  invalidatesTags: ["StudyPlan"],
}),
    getStudyPlanDetail: builder.query<{ data: any }, string>({
      query: (id) => ({
        url: StudyPlanEndpoint.GET_DETAIL.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["StudyPlan"],
    }),
    addProblemToStudyPlan: builder.mutation<
      { message: string },
      { planId: string; problemId: string }
    >({
      query: ({ planId, problemId }) => ({
        url: StudyPlanEndpoint.ADD_PROBLEM_TO_PLAN.replace("{planId}", planId).replace("{problemId}", problemId),
        method: "POST",
      }),
      invalidatesTags: ["StudyPlan"],
    }),
  }),
  
});

export const {
  useCreateStudyPlanMutation,
  useGetStudyPlansQuery,
  useCreateProblemInPlanMutation,
  useGetStudyPlanDetailQuery,
  useAddProblemToStudyPlanMutation,
} = studyPlanApi;