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
  JoinContestRequest,
  JoinContestResponse,
  LeaderboardResponse,
  PublishContestResponse,
  SubmitContestRequest,
  SubmitContestResponse,
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

    // 2. Danh sách contest
    getContestList: builder.query<
      ContestListResponse,
      { page?: number; pageSize?: number; status?: string }
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

    // 4. Join contest
    joinContest: builder.mutation<
      JoinContestResponse,
      { id: string; body: JoinContestRequest }
    >({
      query: ({ id, body }) => ({
        url: ContestEndpoint.JOIN_CONTEST.replace("{id}", id),
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Contest", id }],
    }),

    // 5. Thêm problem vào contest
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

    // 6. Danh sách problem contest
    getContestProblems: builder.query<ContestProblemsResponse, string>({
      query: (contestId) => ({
        url: ContestEndpoint.GET_CONTEST_PROBLEMS.replace("{contestId}", contestId),
        method: "GET",
      }),
      providesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // 7. Submit bài contest
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

    // 8. Publish contest
    publishContest: builder.mutation<PublishContestResponse, string>({
      query: (id) => ({
        url: ContestEndpoint.PUBLISH_CONTEST.replace("{id}", id),
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Contest", id }],
    }),

    // 9. Bảng xếp hạng
    getLeaderboard: builder.query<LeaderboardResponse, string>({
      query: (contestId) => ({
        url: ContestEndpoint.LEADERBOARD.replace("{contestId}", contestId),
        method: "GET",
      }),
      providesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // 10. Health check
    pingContest: builder.query<string, void>({
      query: () => ({
        url: ContestEndpoint.PING,
        method: "GET",
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
});

export const {
  useCreateContestMutation,
  useGetContestListQuery,
  useGetContestDetailQuery,
  useJoinContestMutation,
  useAddProblemToContestMutation,
  useGetContestProblemsQuery,
  useSubmitContestMutation,
  usePublishContestMutation,
  useGetLeaderboardQuery,
  usePingContestQuery,
} = contestApi;
