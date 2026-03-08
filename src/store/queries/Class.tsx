import { ClassEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { ClassItem, ClassResponse, CreateClassRequest, UpdateClassTeacherPayload } from "@/types";
export const classApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // đã test
    getClasses: builder.query<ClassResponse, void>({
  query: () => ({
    url: ClassEndpoint.GET_ALL_CLASS,
    method: "GET",
  }),
  providesTags: ["Class"],
}),
 getClassDetail: builder.query<{ data: ClassItem }, { id: string }>({
  query: ({ id }) => ({
    url: ClassEndpoint.GET_DETAIL_CLASS.replace("{id}", id),
    method: "GET",
  }),
  providesTags: ["Class"],
}),
     createClass: builder.mutation<ClassItem, CreateClassRequest>({
      query: (data) => ({
        url: ClassEndpoint.CREATE_CLASS,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),
    // tí test xong đã
     updateClassTeacher: builder.mutation<ClassItem, { id: string; data: UpdateClassTeacherPayload }>({
      query: ({ id, data }) => ({
        url: ClassEndpoint.PUT_CLASS_TEACHER.replace("{id}", id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});


export const {
   useGetClassesQuery,
   useGetClassDetailQuery,
   useCreateClassMutation,
   useUpdateClassTeacherMutation,
} = classApi;
