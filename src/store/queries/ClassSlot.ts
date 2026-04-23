// file: src/services/api/classSlotApi.ts  (hoặc đặt tên tùy ý)

import { baseApi } from "../base"; // giả sử baseApi của mày nằm đây
import { ClassSlotEndpoint } from "@/constants/endpoints"; // endpoint constants của mày

// Import các interface (đặt ở file types/classSlot.ts hoặc tương tự)
import {
  CreateClassSlotRequest,
  UpdateClassSlotRequest,
  SetDueDateRequest,
  ClassSlotResponse,
  StudentSlotScoreResponse,
  StudentSubmissionDetailResponse,
} from "@/types";
// mấy cái này đổi thành class-semester
export const classSlotApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // ── Queries ────────────────────────────────────────────────

    getClassSlots: builder.query<{data :ClassSlotResponse[]}, string>({
      query: (semesterId) => ({
        url: ClassSlotEndpoint.GET_CLASS_SLOTS.replace("{semesterId}", semesterId),
        method: "GET",
      }),
      providesTags: ["ClassSlot"],   // ← chỉ 1 tag chung
    }),

    getSlotScores: builder.query<{success: boolean, data: StudentSlotScoreResponse[]}, { semesterId: string; slotId: string }>({
      query: ({ semesterId, slotId }) => ({
        url: ClassSlotEndpoint.GET_SLOT_SCORES
          .replace("{semesterId}", semesterId)
          .replace("{slotId}", slotId),
        method: "GET",
      }),
      providesTags: ["ClassSlot"],   // ← chung
    }),

    getUserSubmissionInSlot: builder.query<
      StudentSubmissionDetailResponse[],
      { semesterId: string; slotId: string; userId: string }
    >({
      query: ({ semesterId, slotId, userId }) => ({
        url: ClassSlotEndpoint.GET_USER_SUBMISSION
          .replace("{semesterId}", semesterId)
          .replace("{slotId}", slotId)
          .replace("{userId}", userId),
        method: "GET",
      }),
      providesTags: ["ClassSlot"],   // ← chung
    }),

    getSlotRankings: builder.query<any, { semesterId: string; slotId: string }>({
      query: ({ semesterId, slotId }) => ({
        url: ClassSlotEndpoint.GET_SLOT_RANKINGS
          .replace("{semesterId}", semesterId)
          .replace("{slotId}", slotId),
        method: "GET",
      }),
      providesTags: ["ClassSlot"],
    }),

    // ── Mutations ──────────────────────────────────────────────

    createClassSlot: builder.mutation<
      ClassSlotResponse,
      { semesterId: string; data: CreateClassSlotRequest }
    >({
      query: ({ semesterId, data }) => ({
        url: ClassSlotEndpoint.CREATE_CLASS_SLOT.replace("{semesterId}", semesterId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClassSlot"],   // ← invalidate chung → tất cả query refetch
    }),

    updateClassSlot: builder.mutation<
      void,
      { semesterId: string; slotId: string; data: UpdateClassSlotRequest }
    >({
      query: ({ semesterId, slotId, data }) => ({
        url: ClassSlotEndpoint.UPDATE_SLOT
          .replace("{semesterId}", semesterId)
          .replace("{slotId}", slotId),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ClassSlot"],
    }),

    deleteClassSlot: builder.mutation<
      void,
      { semesterId: string; slotId: string }
    >({
      query: ({ semesterId, slotId }) => ({
        url: ClassSlotEndpoint.DELETE_SLOT
          .replace("{semesterId}", semesterId)
          .replace("{slotId}", slotId),
        method: "DELETE",
      }),
      invalidatesTags: ["ClassSlot"],
    }),

    setSlotDueDate: builder.mutation<
      ClassSlotResponse,
      { semesterId: string; slotId: string; data: SetDueDateRequest }
    >({
      query: ({ semesterId, slotId, data }) => ({
        url: ClassSlotEndpoint.UPDATE_SLOT_DUE_DATE
          .replace("{semesterId}", semesterId)
          .replace("{slotId}", slotId),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ClassSlot"],
    }),

    publishClassSlot: builder.mutation<
      ClassSlotResponse,
      { semesterId: string; slotId: string }
    >({
      query: ({ semesterId, slotId }) => ({
        url: ClassSlotEndpoint.PUBLISH_SLOT
          .replace("{semesterId}", semesterId)
          .replace("{slotId}", slotId),
        method: "PUT",
      }),
      invalidatesTags: ["ClassSlot"],
    }),
  }),
});
export const {
   useGetClassSlotsQuery,
  useGetSlotScoresQuery,
  useGetUserSubmissionInSlotQuery,
  useGetSlotRankingsQuery,
  useCreateClassSlotMutation,
  useUpdateClassSlotMutation,
  useDeleteClassSlotMutation,
  useSetSlotDueDateMutation,
  usePublishClassSlotMutation,
} = classSlotApi