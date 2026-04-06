import { DiscussionEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  DiscussionResponseData,
  CreateDiscussionRequest,
  VoteCommentRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  HideCommentRequest
} from "@/types";

export const discussionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProblemDiscussions: builder.query<DiscussionResponseData, { problemId: string }>({
      query: ({ problemId }) => ({
        url: DiscussionEndpoint.GET_PROBLEM_DISCUSSIONS,
        method: "GET",
        params: { problemId, pageSize: 100 },
      }),
      providesTags: ["Discussion"],
    }),

    createDiscussion: builder.mutation<any, CreateDiscussionRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.CREATE_DISCUSSION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Discussion"],
    }),

    voteComment: builder.mutation<any, VoteCommentRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.VOTE_COMMENT,
        method: "POST", // Adjust to POST/PUT depending on actual API details
        body: body,
      }),
      invalidatesTags: ["Discussion"], // Not invalidating everything to avoid full refetch if optimistic is used
    }),
    
    createComment: builder.mutation<any, CreateCommentRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.CREATE_COMMENT,
        method: "POST",
        body,
      }),
      // Không cần invalidate nữa vì ta sẽ dùng Optimistic UI
      
      invalidatesTags: ["Discussion"],
    }),
    
    updateComment: builder.mutation<any, UpdateCommentRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.UPDATE_COMMENT,
        method: "PUT",
        body: body,
        responseHandler: (response) => response.text(),
      }),
     
      invalidatesTags: ["Discussion"],
    }),
    
    hideComment: builder.mutation<any, HideCommentRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.HIDE_COMMENT,
        method: "PUT",
        body: body,
        responseHandler: (response) => response.text(),
      }),
      
      invalidatesTags: ["Discussion"],
    }),
  }),
});

export const {
  useGetProblemDiscussionsQuery,
  useCreateDiscussionMutation,
  useVoteCommentMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useHideCommentMutation,
} = discussionApi;
