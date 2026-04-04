import { baseApi } from "../base";
import { SemesterEndpoint } from "@/constants/endpoints";
import {
  SemesterItem,
  SemesterResponse,
  CreateSemesterRequest,
  UpdateSemesterRequest,
} from "@/types";

export const semesterApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    
    getSemesters: builder.query<SemesterResponse, void>({
      query: () => ({
        url: SemesterEndpoint.GET_PUBLIC_SEMESTER,
        method: "GET",
      }),
      providesTags: ["Semester"],
    }),

    getSemesterDetail: builder.query<{ data: SemesterItem }, { id: string }>({
      query: ({ id }) => ({
        url: SemesterEndpoint.GET_DETAIL_SEMESTER.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["Semester"],
    }),

    createSemester: builder.mutation<SemesterItem, CreateSemesterRequest>({
      query: (data) => ({
        url: SemesterEndpoint.CREATE_SEMESTER,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),

    updateSemester: builder.mutation<
      SemesterItem,
      { id: string; data: UpdateSemesterRequest }
    >({
      query: ({ id, data }) => ({
        url: SemesterEndpoint.UPDATE_SEMESTER.replace("{id}", id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),

    deleteSemester: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: SemesterEndpoint.DELETE_SEMESTER.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Semester"],
    }),
    
   getALLSemesters: builder.query<SemesterResponse, void>({
      query: () => ({
        url: SemesterEndpoint.GET_ALL_SEMESTER,
        method: "GET",
      }),
      providesTags: ["Semester"],
    }),

    getSemesterImportTemplate: builder.mutation<Blob, void>({
      query: () => ({
        url: SemesterEndpoint.IMPORT_TEMPLATE,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    importSemesters: builder.mutation<void, FormData>({
      query: (data) => ({
        url: SemesterEndpoint.IMPORT_SEMESTER,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Semester"],
    }),
  }),
});

export const {
  useGetSemestersQuery,
  useGetSemesterDetailQuery,
  useGetALLSemestersQuery,
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
  useGetSemesterImportTemplateMutation,
  useImportSemestersMutation,
} = semesterApi;