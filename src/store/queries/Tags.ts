import { TagEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";

export interface Tag {
  id: string;
  name: string | null;
  slug: string | null;
}

export interface CreateTagPayload {
  name: string | null;
  slug: string | null;
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
  }),
});

export const { useGetTagsQuery, useCreateTagMutation } = tagApi;
