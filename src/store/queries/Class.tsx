import { ClassEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { addClassMemberRequest, ClassItem, ClassMemberResponse, ClassResponse, CreateClassRequest, UpdateClassTeacherPayload } from "@/types";
export const classApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // đã test
  // Trong endpoints của createApi
getClasses: builder.query<ClassResponse, {
  semesterId?: string;
  subjectId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}>({
  query: (params = {}) => ({
    url: ClassEndpoint.GET_ALL_CLASS,
    method: "GET",
    params: {
      semesterId: params.semesterId ,
      subjectId: params.subjectId,
      search: params.search,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
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
// đã fix xong
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
   getClassMembers: builder.query<{data : ClassMemberResponse[]}, { id: string }>({
  query: ({ id }) => ({
    url: ClassEndpoint.GET_CLASS_MEMBERS.replace("{id}", id),
    method: "GET",
  }),
  providesTags: ["Class"],
}),

    exportClass: builder.mutation<Blob, { id: string }>({
      query: ({ id }) => ({
        url: ClassEndpoint.EXPORT_CLASS.replace("{id}", id),
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
addClassMembers: builder.mutation<
  void,
  { id: string; data: addClassMemberRequest }
>({
  query: ({ id, data }) => ({
    url: ClassEndpoint.ADD_CLASS_MEMBERS.replace("{id}", id),
    method: "POST",
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
   useGetClassMembersQuery,
   useAddClassMembersMutation,
   useExportClassMutation
} = classApi;
