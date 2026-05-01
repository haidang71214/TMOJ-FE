import { ClassEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { CreateClassContestRequest, ClassContestDetailResponse, SubmissionResponse, ScoreboardResponse } from "@/types";

export const classContestApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createClassContest: builder.mutation<void, { classSemesterId: string; body: CreateClassContestRequest }>({
      query: ({ classSemesterId, body }) => ({
        url: ClassEndpoint.CREATE_CLASS_CONTEST.replace("{classSemesterId}", classSemesterId),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contest"],
    }),

    getClassContests: builder.query<any, { classSemesterId: string }>({
      query: ({ classSemesterId }) => ({
        url: ClassEndpoint.GET_CLASS_CONTESTS.replace("{classSemesterId}", classSemesterId),
        method: "GET",
      }),
      providesTags: ["Contest"],
    }),

    getClassContestDetail: builder.query<ClassContestDetailResponse, { classSemesterId: string; contestId: string }>({
      query: ({ classSemesterId, contestId }) => ({
        url: ClassEndpoint.GET_CLASS_CONTEST_DETAIL
          .replace("{classSemesterId}", classSemesterId)
          .replace("{contestId}", contestId),
        method: "GET",
      }),
      providesTags: ["Contest"],
    }),

    getClassContestScoreboard: builder.query<ScoreboardResponse, { classSemesterId: string; contestId: string }>({
      query: ({ classSemesterId, contestId }) => ({
        url: ClassEndpoint.GET_CLASS_CONTEST_SCOREBOARD
          .replace("{classSemesterId}", classSemesterId)
          .replace("{contestId}", contestId),
        method: "GET",
      }),
      providesTags: ["Contest"],
    }),

    postClassContestSubmission: builder.mutation<SubmissionResponse, { 
      classSemesterId: string; 
      contestId: string; 
      body: { contestProblemId: string; code: string; language: string } 
    }>({
      query: ({ classSemesterId, contestId, body }) => ({
        url: ClassEndpoint.SUBMIT_CLASS_CONTEST
          .replace("{classSemesterId}", classSemesterId)
          .replace("{contestId}", contestId),
        method: "POST",
        body,
      }),
      invalidatesTags: ["submittion", "ProblemDetail"],
    }),
  }),
});

export const {
  useCreateClassContestMutation,
  useGetClassContestsQuery,
  useGetClassContestDetailQuery,
  useGetClassContestScoreboardQuery,
  usePostClassContestSubmissionMutation,
} = classContestApi;
