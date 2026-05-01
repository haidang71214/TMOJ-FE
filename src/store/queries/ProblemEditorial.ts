import { ProblemEditorialEndpoint } from "@/constants/endpoints";
import { ProblemEditorial, CreateEditorialRequest, DeleteEditorialResponse, EditorialDetailResponse, EditorialListResponse, UpdateEditorialRequest } from "@/types";
import { baseApi } from "../base";

export const problemEditorialApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEditorials: builder.query<ProblemEditorial[], { problemId: string }>({
      query: ({ problemId }) => ({
        url: ProblemEditorialEndpoint.GET_EDITORIALS,
        method: "GET",
        params: { problemId },
      }),
      transformResponse: (response: any) => {
        // Handle double-nested data from API
        if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "ProblemEditorial" as const, id })),
            { type: "ProblemEditorial", id: "LIST" },
          ]
          : [{ type: "ProblemEditorial", id: "LIST" }],
    }),
    getEditorialById: builder.query<ProblemEditorial, string>({
      query: (id) => ({
        url: ProblemEditorialEndpoint.GET_EDITORIAL_BY_ID.replace("{id}", id),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response?.data?.data) return response.data.data;
        if (response?.data) return response.data;
        return response;
      },
      providesTags: (result, error, id) => [{ type: "ProblemEditorial", id }],
    }),
    createEditorial: builder.mutation<ProblemEditorial, CreateEditorialRequest>({
      query: (body) => ({
        url: ProblemEditorialEndpoint.CREATE_EDITORIAL,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.data) return response.data.data;
        if (response?.data) return response.data;
        return response;
      },
      invalidatesTags: [{ type: "ProblemEditorial", id: "LIST" }],
    }),
    updateEditorial: builder.mutation<ProblemEditorial, UpdateEditorialRequest>({
      query: ({ id, ...body }) => ({
        url: ProblemEditorialEndpoint.UPDATE_EDITORIAL.replace("{id}", id),
        method: "PUT",
        body,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.data) return response.data.data;
        if (response?.data) return response.data;
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "ProblemEditorial", id },
        { type: "ProblemEditorial", id: "LIST" },
      ],
    }),
    deleteEditorial: builder.mutation<DeleteEditorialResponse, string>({
      query: (id) => ({
        url: ProblemEditorialEndpoint.DELETE_EDITORIAL.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ProblemEditorial", id },
        { type: "ProblemEditorial", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEditorialsQuery,
  useGetEditorialByIdQuery,
  useCreateEditorialMutation,
  useUpdateEditorialMutation,
  useDeleteEditorialMutation,
} = problemEditorialApi;
