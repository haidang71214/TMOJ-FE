import { ContestEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  AddProblemToContestRequest,
  AddProblemToContestResponse,
  ContestDetailResponse,
  ContestListResponse,
  ContestProblemsResponse,
  CreateContestRequest,
  CreateContestResponse,
  UpdateContestResponse,
  LeaderboardResponse,
  PublishContestResponse,
  MyContestsResponse,
  RegisterContestRequest,
  RegisterContestResponse,
  UnregisterContestResponse,
  SubmitContestRequest,
  SubmitContestResponse,
  ChangeVisibilityRequest,
  ChangeVisibilityResponse,
  ContestParticipantsResponse,
} from "@/types";

export const contestApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 1. Tạo contest
    createContest: builder.mutation<CreateContestResponse, CreateContestRequest>({
      query: (body) => ({
        url: ContestEndpoint.CREATE_CONTEST,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contest"],
    }),

    // 1.1 Cập nhật contest
    updateContest: builder.mutation<UpdateContestResponse, { id: string; body: CreateContestRequest }>({
      query: ({ id, body }) => ({
        url: ContestEndpoint.UPDATE_CONTEST.replace("{id}", id),
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Contest", id }, "Contest"],
    }),

    // 2. Danh sách contest
    getContestList: builder.query<
      ContestListResponse,
      { page?: number; pageSize?: number; status?: string; search?: string; title?: string; name?: string; visibilityCode?: string | string[] }
    >({
      query: (params) => ({
        url: ContestEndpoint.GET_CONTEST_LIST,
        method: "GET",
        params,
      }),
      providesTags: ["Contest"],
    }),

    // 3. Chi tiết contest
    getContestDetail: builder.query<ContestDetailResponse, string>({
      query: (id) => ({
        url: ContestEndpoint.GET_CONTEST_DETAIL.replace("{id}", id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Contest", id }],
    }),

    // 4. Thêm problem vào contest (Endpoint 5 cũ)
    addProblemToContest: builder.mutation<
      AddProblemToContestResponse,
      { contestId: string; body: AddProblemToContestRequest }
    >({
      query: ({ contestId, body }) => ({
        url: ContestEndpoint.ADD_PROBLEM_TO_CONTEST.replace("{contestId}", contestId),
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // 5. Danh sách problem contest (Endpoint 6 cũ)
    getContestProblems: builder.query<ContestProblemsResponse, string>({
      query: (contestId) => ({
        url: ContestEndpoint.GET_CONTEST_PROBLEMS.replace("{contestId}", contestId),
        method: "GET",
      }),
      providesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // 6. Submit bài contest (Endpoint 7 cũ)
    submitContest: builder.mutation<
      SubmitContestResponse,
      { contestId: string; body: SubmitContestRequest }
    >({
      query: ({ contestId, body }) => ({
        url: ContestEndpoint.SUBMIT_CONTEST.replace("{contestId}", contestId),
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // 7. Publish contest (Endpoint 8 cũ)
    publishContest: builder.mutation<PublishContestResponse, string>({
      query: (id) => ({
        url: ContestEndpoint.PUBLISH_CONTEST.replace("{id}", id),
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Contest", id }],
    }),

    // 8. Bảng xếp hạng (Endpoint 9 cũ)
    getLeaderboard: builder.query<LeaderboardResponse, string>({
      query: (contestId) => ({
        url: ContestEndpoint.LEADERBOARD.replace("{contestId}", contestId),
        method: "GET",
      }),
      providesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // 9. Register contest (Endpoint 11 cũ)
    registerContest: builder.mutation<
      RegisterContestResponse,
      { contestId: string; body: RegisterContestRequest }
    >({
      query: ({ contestId, body }) => ({
        url: ContestEndpoint.REGISTER.replace("{contestId}", contestId),
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // 10. Unregister contest (Endpoint 12 cũ)
    unregisterContest: builder.mutation<UnregisterContestResponse, string>({
      query: (contestId) => ({
        url: ContestEndpoint.UNREGISTER.replace("{contestId}", contestId),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
        "Contest",
      ],
    }),
    // 11. Danh sách contest của tôi
    getMyContests: builder.query<MyContestsResponse, { status?: string }>({
      query: (params) => ({
        url: ContestEndpoint.GET_MY_CONTESTS,
        method: "GET",
        params,
      }),
      providesTags: ["Contest"],
    }),
    // 12. Xóa bài tập khỏi contest
    removeProblemFromContest: builder.mutation<any, { contestId: string; contestProblemId: string }>({
      query: ({ contestId, contestProblemId }) => ({
        url: ContestEndpoint.REMOVE_PROBLEM_FROM_CONTEST.replace("{contestId}", contestId).replace("{contestProblemId}", contestProblemId),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { contestId }) => [{ type: "Contest", id: contestId }],
    }),
    // 13. Thay đổi visibility
    changeVisibility: builder.mutation<ChangeVisibilityResponse, { id: string; body: ChangeVisibilityRequest }>({
      query: ({ id, body }) => ({
        url: ContestEndpoint.CHANGE_VISIBILITY.replace("{id}", id),
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Contest", id }, "Contest"],
    }),
    // 21. Gia hạn thời gian cuộc thi
    extendContestTime: builder.mutation<any, { id: string; newEndAt: string }>({
      query: ({ id, newEndAt }) => ({
        url: ContestEndpoint.EXTEND_CONTEST.replace("{id}", id),
        method: "PATCH",
        body: { newEndAt },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Contest", id }, "Contest"],
    }),
    // 22. Xóa contest
    deleteContest: builder.mutation<any, string>({
      query: (id) => ({
        url: ContestEndpoint.DELETE_CONTEST.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Contest"],
    }),
    // 23. Join Team in Contest by Code
    joinContestTeamByCode: builder.mutation<
      any,
      { contestId: string; body: { code: string } }
    >({
      query: ({ contestId, body }) => ({
        url: ContestEndpoint.JOIN_CONTEST_TEAM_BY_CODE.replace("{contestId}", contestId),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contest", "Team"],
    }),
    // 24. Lấy danh sách participants của một contest
    getContestParticipants: builder.query<ContestParticipantsResponse, string>({
      query: (id) => ({
        url: ContestEndpoint.GET_CONTEST_PARTICIPANTS.replace("{id}", id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Contest", id: `participants_${id}` }],
    }),
  }),
});

export const {
  useCreateContestMutation,
  useUpdateContestMutation,
  useGetContestListQuery,
  useGetContestDetailQuery,
  useAddProblemToContestMutation,
  useGetContestProblemsQuery,
  useSubmitContestMutation,
  usePublishContestMutation,
  useGetLeaderboardQuery,
  useRegisterContestMutation,
  useUnregisterContestMutation,
  useGetMyContestsQuery,
  useRemoveProblemFromContestMutation,
  useChangeVisibilityMutation,
  useExtendContestTimeMutation,
  useDeleteContestMutation,
  useJoinContestTeamByCodeMutation,
  useGetContestParticipantsQuery,
} = contestApi;
