import { TagEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";

export interface Tag {
  id: string;
  name: string | null;
  slug: string | null;
  isActive?: boolean;
}

export interface CreateTagPayload {
  name: string | null;
  slug: string | null;
}

export interface AttachTagsPayload {
  problemId: string;
  tagIds: string[];
}

export const tagApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => ({
        url: TagEndpoint.GET_TAGS,
        method: "GET",
      }),
      providesTags: ["Tag"] as any,
      // Fallback in case the API returns { data: Tag[] } or directly Tag[]
      transformResponse: (response: any) => {
        if (response?.data) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      }
    }),
    createTag: builder.mutation<Tag, CreateTagPayload>({
      query: (body) => ({
        url: TagEndpoint.CREATE_TAG,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tag"] as any,
    }),
    attachTagsToProblem: builder.mutation<any, AttachTagsPayload>({
      query: ({ problemId, tagIds }) => ({
        url: TagEndpoint.ATTACH_TAGS.replace("{problemId}", problemId),
        method: "POST",
        body: tagIds, // Using string array of Tag IDs as body based on typical OData action
      }),
      invalidatesTags: ["Problem", "Tag"] as any,
    }),
    updateProblemTags: builder.mutation<any, AttachTagsPayload>({
      query: ({ problemId, tagIds }) => ({
        url: TagEndpoint.UPDATE_PROBLEM_TAGS.replace("{problemId}", problemId),
        method: "PUT",
        body: tagIds,
      }),
      invalidatesTags: ["Problem", "Tag"] as any,
    }),
  }),
});

export const { 
  useGetTagsQuery, 
  useCreateTagMutation,
  useAttachTagsToProblemMutation,
  useUpdateProblemTagsMutation
} = tagApi;
