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
  // ... các type khác nếu cần
} from "@/types";

export const classSlotApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // ── Queries ────────────────────────────────────────────────

    getClassSlots: builder.query<{data :ClassSlotResponse[]}, string>({
      query: (classId) => ({
        url: ClassSlotEndpoint.GET_CLASS_SLOTS.replace("{classId}", classId),
        method: "GET",
      }),
      providesTags: ["ClassSlot"],   // ← chỉ 1 tag chung
    }),

    getSlotScores: builder.query<StudentSlotScoreResponse[], { classId: string; slotId: string }>({
      query: ({ classId, slotId }) => ({
        url: ClassSlotEndpoint.GET_SLOT_SCORES
          .replace("{classId}", classId)
          .replace("{slotId}", slotId),
        method: "GET",
      }),
      providesTags: ["ClassSlot"],   // ← chung
    }),

    getUserSubmissionInSlot: builder.query<
      StudentSubmissionDetailResponse[],
      { classId: string; slotId: string; userId: string }
    >({
      query: ({ classId, slotId, userId }) => ({
        url: ClassSlotEndpoint.GET_USER_SUBMISSION
          .replace("{classId}", classId)
          .replace("{slotId}", slotId)
          .replace("{userId}", userId),
        method: "GET",
      }),
      providesTags: ["ClassSlot"],   // ← chung
    }),

    // ── Mutations ──────────────────────────────────────────────

    createClassSlot: builder.mutation<
      ClassSlotResponse,
      { classId: string; data: CreateClassSlotRequest }
    >({
      query: ({ classId, data }) => ({
        url: ClassSlotEndpoint.CREATE_CLASS_SLOT.replace("{classId}", classId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClassSlot"],   // ← invalidate chung → tất cả query refetch
    }),

    updateClassSlot: builder.mutation<
      ClassSlotResponse,
      { classId: string; slotId: string; data: UpdateClassSlotRequest }
    >({
      query: ({ classId, slotId, data }) => ({
        url: `${ClassSlotEndpoint.GET_CLASS_SLOTS.replace("{classId}", classId)}/${slotId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ClassSlot"],
    }),

    setSlotDueDate: builder.mutation<
      ClassSlotResponse,
      { classId: string; slotId: string; data: SetDueDateRequest }
    >({
      query: ({ classId, slotId, data }) => ({
        url: ClassSlotEndpoint.UPDATE_SLOT_DUE_DATE
          .replace("{classId}", classId)
          .replace("{slotId}", slotId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ClassSlot"],
    }),

    publishClassSlot: builder.mutation<
      ClassSlotResponse,
      { classId: string; slotId: string }
    >({
      query: ({ classId, slotId }) => ({
        url: ClassSlotEndpoint.PUBLISH_SLOT
          .replace("{classId}", classId)
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
  useCreateClassSlotMutation,
  useUpdateClassSlotMutation,
  useSetSlotDueDateMutation,
  usePublishClassSlotMutation,
} = classSlotApi