import { ProblemEditorialEndpoint } from "@/constants/endpoints";
import { CreateEditorialRequest, DeleteEditorialResponse, EditorialDetailResponse, EditorialListResponse, UpdateEditorialRequest } from "@/types";
import { baseApi } from "../base";

export const problemEditorialApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEditorials: builder.query<EditorialListResponse, { problemId: string }>({
      query: ({ problemId }) => ({
        url: ProblemEditorialEndpoint.GET_EDITORIALS,
        method: "GET",
        params: { problemId },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: "ProblemEditorial" as const, id })),
              { type: "ProblemEditorial", id: "LIST" },
            ]
          : [{ type: "ProblemEditorial", id: "LIST" }],
    }),
    getEditorialById: builder.query<EditorialDetailResponse, string>({
      query: (id) => ({
        url: ProblemEditorialEndpoint.GET_EDITORIAL_BY_ID.replace("{id}", id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ProblemEditorial", id }],
    }),
    createEditorial: builder.mutation<EditorialDetailResponse, CreateEditorialRequest>({
      query: (body) => ({
        url: ProblemEditorialEndpoint.CREATE_EDITORIAL,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ProblemEditorial", id: "LIST" }],
    }),
    updateEditorial: builder.mutation<EditorialDetailResponse, UpdateEditorialRequest>({
      query: ({ id, ...body }) => ({
        url: ProblemEditorialEndpoint.UPDATE_EDITORIAL.replace("{id}", id),
        method: "PUT",
        body,
      }),
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
