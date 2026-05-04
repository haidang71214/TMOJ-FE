import { StudyPlanEndpoint, StudyProgressEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  CreateProblemDraftResponse,
  CreateStudyPlanRequest,
  CreateStudyPlanResponse,
  GetStudyPlansResponse,
  UpdateStudyPlanRequest,
  GetStudyPlanDetailResponse,
  UnlockedPlanItem,
  StudyPlanEnrollmentResponse,
  StudyPlanNextItemResponse,
  StudyPlanStatsResponse,
  StudyPlanProgressResponse,
  MyStudyProgressResponse,
  UploadStudyPlanImageResponse
} from "@/types";


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
      invalidatesTags: ["StudyPlan"],
    }),
    updateStudyPlan: builder.mutation<
      { success: boolean },
      UpdateStudyPlanRequest
    >({
      query: ({ id, ...body }) => ({
        url: StudyPlanEndpoint.UPDATE_STUDY_PLAN.replace("{id}", id),
        method: "PUT",
        body,
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    deleteStudyPlan: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: StudyPlanEndpoint.DELETE_STUDY_PLAN.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["StudyPlan"],
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
    getStudyPlanDetail: builder.query<GetStudyPlanDetailResponse, string>({
      query: (id) => ({
        url: StudyPlanEndpoint.GET_DETAIL.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["StudyPlan"],
    }),
    addProblemToStudyPlan: builder.mutation<
      { data: boolean },
      { planId: string; problemId: string }
    >({
      query: ({ planId, problemId }) => ({
        url: StudyPlanEndpoint.ADD_PROBLEM_TO_PLAN.replace("{planId}", planId).replace("{problemId}", problemId),
        method: "POST",
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    removeProblemFromPlan: builder.mutation<
      { data: boolean },
      { planId: string; problemId: string }
    >({
      query: ({ planId, problemId }) => ({
        url: StudyPlanEndpoint.REMOVE_PROBLEM_FROM_PLAN.replace("{planId}", planId).replace("{problemId}", problemId),
        method: "DELETE",
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    buyStudyPlan: builder.mutation<{ data: boolean }, string>({
      query: (planId) => ({
        url: StudyPlanEndpoint.BUY_STUDY_PLAN.replace("{planId}", planId),
        method: "POST",
      }),
      invalidatesTags: ["StudyPlan", "Wallet"],
    }),
    enrollStudyPlan: builder.mutation<{ data: boolean }, string>({
      query: (planId) => ({
        url: StudyPlanEndpoint.ENROLL_STUDY_PLAN.replace("{planId}", planId),
        method: "POST",
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    getUnlockedPlans: builder.query<GetStudyPlansResponse, { creatorId?: string } | void>({
      query: (params) => {
        let url = StudyPlanEndpoint.GET_UNLOCKED_PLANS;
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
    getNextStudyPlanItem: builder.query<{ data: StudyPlanNextItemResponse }, { planId: string; itemId: string }>({
      query: ({ planId, itemId }) => ({
        url: StudyPlanEndpoint.GET_NEXT_ITEM.replace("{planId}", planId).replace("{itemId}", itemId),
        method: "GET",
      }),
    }),
    getStudyPlanEnrollment: builder.query<{ data: StudyPlanEnrollmentResponse }, { planId: string }>({
      query: ({ planId }) => ({
        url: StudyPlanEndpoint.GET_ENROLLMENT.replace("{planId}", planId),
        method: "GET",
      }),
      providesTags: ["StudyPlan"],
    }),
    getStudyPlanStats: builder.query<{ data: StudyPlanStatsResponse }, string>({
      query: (planId) => ({
        url: StudyPlanEndpoint.GET_STATS.replace("{planId}", planId),
        method: "GET",
      }),
    }),

    // --- Study Progress Endpoints ---
    completeStudyPlan: builder.mutation<{ data: boolean }, { planId: string }>({
      query: (body) => ({
        url: StudyProgressEndpoint.COMPLETE_PLAN,
        method: "POST",
        body,
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    completeStudyPlanItem: builder.mutation<{ data: { success: boolean; message?: string; studyPlanItemId?: string; userId?: string; } }, string>({
      query: (itemId) => ({
        url: StudyProgressEndpoint.COMPLETE_ITEM.replace("{studyPlanItemId}", itemId),
        method: "POST",
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    getStudyPlanProgress: builder.query<StudyPlanProgressResponse, string>({
      query: (planId) => ({
        url: StudyProgressEndpoint.GET_PLAN_PROGRESS.replace("{planId}", planId),
        method: "GET",
      }),
      transformResponse: (response: { data: StudyPlanProgressResponse }) => response.data,
      providesTags: ["StudyPlan"],
    }),
    getMyStudyProgress: builder.query<MyStudyProgressResponse, void>({
      query: () => ({
        url: StudyProgressEndpoint.GET_MY_PROGRESS,
        method: "GET",
      }),
      transformResponse: (response: { data: { data: MyStudyProgressResponse } }) => response.data.data,
      providesTags: ["StudyPlan"],
    }),
    resetStudyProgress: builder.mutation<{ success: boolean }, string>({
      query: (planId) => ({
        url: StudyProgressEndpoint.RESET_PROGRESS.replace("{planId}", planId),
        method: "DELETE",
      }),
      invalidatesTags: ["StudyPlan"],
    }),
    uploadStudyPlanImage: builder.mutation<UploadStudyPlanImageResponse, FormData>({
      query: (body) => ({
        url: StudyPlanEndpoint.UPLOAD_IMAGE,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateStudyPlanMutation,
  useUpdateStudyPlanMutation,
  useDeleteStudyPlanMutation,
  useGetStudyPlansQuery,
  useCreateProblemInPlanMutation,
  useGetStudyPlanDetailQuery,
  useAddProblemToStudyPlanMutation,
  useRemoveProblemFromPlanMutation,
  useBuyStudyPlanMutation,
  useEnrollStudyPlanMutation,
  useGetUnlockedPlansQuery,
  useGetNextStudyPlanItemQuery,
  useGetStudyPlanEnrollmentQuery,
  useGetStudyPlanStatsQuery,
  useCompleteStudyPlanMutation,
  useCompleteStudyPlanItemMutation,
  useGetStudyPlanProgressQuery,
  useGetMyStudyProgressQuery,
  useResetStudyProgressMutation,
  useUploadStudyPlanImageMutation,
} = studyPlanApi;
