import { SubjectEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { SubjectResponseForm, SubjectCreateForm } from "@/types";

export const subjectApi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    getAllSubjectQuery: builder.query<{ data: { items: SubjectResponseForm[] } }, void>({
      query: () => ({
        url: SubjectEndpoint.GET_ALL_SUBJECT,
        method: "GET",
      }),
      providesTags: ["Subject"],
    }),

    getDetailSubjectQuery: builder.query<{ data: SubjectResponseForm }, { id: string }>({
      query: ({ id }) => ({
        url: SubjectEndpoint.GET_DETAIL_SUBJECT.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["Subject"],
    }),

    createSubject: builder.mutation<SubjectResponseForm, SubjectCreateForm>({
      query: (body) => ({
        url: SubjectEndpoint.CREATE_SUBJECT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    updateSubject: builder.mutation<SubjectResponseForm, { id: string; body: Partial<SubjectCreateForm> }>({
      query: ({ id, body }) => ({
        url: SubjectEndpoint.UPDATE_SUBJECT.replace("{id}", id),
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useGetAllSubjectQueryQuery,
  useGetDetailSubjectQueryQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} = subjectApi;