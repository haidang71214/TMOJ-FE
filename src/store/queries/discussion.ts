import { DiscussionEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  ProblemDiscussionsResponse,
  CreateDiscussionRequest,
  DiscussionDetailResponse,
  DiscussionCommentsResponse,
  CreateCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  VoteCommentRequest,
  VoteDiscussionRequest,
  HideCommentRequest,
  UpdateDiscussionRequest
} from "@/types";

export const discussionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProblemDiscussions: builder.query<ProblemDiscussionsResponse, { problemId: string }>({
      query: ({ problemId }) => ({
        url: DiscussionEndpoint.GET_PROBLEM_DISCUSSIONS.replace("{problemId}", problemId),
        method: "GET",
      }),
      providesTags: ["Discussion"],
    }),

    createDiscussion: builder.mutation<any, CreateDiscussionRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.CREATE_DISCUSSION.replace("{problemId}", body.problemId),
        method: "POST",
        body: {
          title: body.title,
          content: body.content,
        },
      }),
      invalidatesTags: ["Discussion"],
    }),

    getDiscussion: builder.query<DiscussionDetailResponse, { id: string }>({
      query: ({ id }) => ({
        url: DiscussionEndpoint.GET_DISCUSSION.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["Discussion"],
    }),

    deleteDiscussion: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: DiscussionEndpoint.DELETE_DISCUSSION.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Discussion"],
    }),

    voteDiscussion: builder.mutation<any, VoteDiscussionRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.VOTE_DISCUSSION.replace("{id}", body.id),
        method: "POST",
        body: { voteType: body.voteType }
      }),
      invalidatesTags: ["Discussion"],
    }),
    updateDiscussion: builder.mutation<any, UpdateDiscussionRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.UPDATE_DISCUSSION.replace("{id}", body.id),
        method: "PUT",
        body: {
          title: body.title,
          content: body.content,
        },
      }),
      invalidatesTags: ["Discussion"],
    }),

    getDiscussionComments: builder.query<DiscussionCommentsResponse, { id: string }>({
      query: ({ id }) => ({
        url: DiscussionEndpoint.GET_DISCUSSION_COMMENTS.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["Discussion"],
    }),

    createComment: builder.mutation<CreateCommentResponse, any>({
      query: (payload) => {
        const { discussionId, userId, ...restBody } = payload;
        return {
          url: DiscussionEndpoint.CREATE_COMMENT.replace("{id}", discussionId),
          method: "POST",
          body: restBody,
        };
      },
      invalidatesTags: ["Discussion"],
    }),

    updateComment: builder.mutation<any, any>({
      query: (body) => ({
        url: DiscussionEndpoint.UPDATE_COMMENT.replace("{id}", body.commentId),
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Discussion"],
    }),

    deleteComment: builder.mutation<any, { commentId: string }>({
      query: ({ commentId }) => ({
        url: DiscussionEndpoint.DELETE_COMMENT.replace("{id}", commentId),
        method: "DELETE",
      }),
      invalidatesTags: ["Discussion"],
    }),

    voteComment: builder.mutation<any, VoteCommentRequest>({
      query: (body) => ({
        url: DiscussionEndpoint.VOTE_COMMENT.replace("{id}", body.id),
        method: "POST",
        body: { voteType: body.voteType },
      }),
      invalidatesTags: ["Discussion"],
    }),

    hideComment: builder.mutation<any, any>({
      query: (body) => ({
        url: DiscussionEndpoint.HIDE_COMMENT.replace("{id}", body.commentId),
        method: "POST",
        body: { hide: body.isHidden },
      }),
      invalidatesTags: ["Discussion"],
    }),
  }),
});

export const {
  useGetProblemDiscussionsQuery,
  useLazyGetProblemDiscussionsQuery,
  useCreateDiscussionMutation,
  useGetDiscussionQuery,
  useUpdateDiscussionMutation,
  useDeleteDiscussionMutation,
  useVoteDiscussionMutation,
  useGetDiscussionCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useVoteCommentMutation,
  useHideCommentMutation,
} = discussionApi;
