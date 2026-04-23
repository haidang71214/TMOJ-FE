import { TagEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";

export interface Tag {
  id: string;
  name: string | null;
  slug: string | null;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  isActive?: boolean;
}

export interface CreateTagPayload {
  name: string | null;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
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
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
        if (response?.items && Array.isArray(response.items)) return response.items;
        if (Array.isArray(response)) return response;
        if (response?.data) return [response.data]; // fallback for single obj
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
   updateProblemTags: builder.mutation<any, { problemId: string; tagIds: string[] }>({
  query: ({ problemId, tagIds }) => {
    const payload = {
      tagIds: tagIds   // viết rõ ràng, không dùng shorthand
    };
    console.log(problemId);
    
    console.log("=== PAYLOAD ĐANG GỬI ===", JSON.stringify(payload, null, 2));

    return {
      url: TagEndpoint.UPDATE_PROBLEM_TAGS.replace("{problemId}", problemId),
      method: "PUT",
      body: payload,
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
  invalidatesTags: ["Problem", "Tag", "ProblemBank"] as any,
}),
// Thêm vào Tags api slice (cùng chỗ với updateProblemTags)
attachProblemTags: builder.mutation<any, { problemId: string; tagIds: string[] }>({
  query: ({ problemId, tagIds }) => {
    const payload = {
      tagIds: tagIds ?? [],           // đảm bảo không undefined
    };
    return {
      url: TagEndpoint.ATTACH_TAGS_PROBLEM.replace("{problemId}", problemId),   // ← phải là endpoint POST attach
      method: "POST",
      body: payload,
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
  invalidatesTags: ["Problem", "Tag"] as any,
}),
  }),
});

export const { 
  useGetTagsQuery, 
  useCreateTagMutation,
  useUpdateProblemTagsMutation,
  useAttachProblemTagsMutation
} = tagApi;
