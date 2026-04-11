import { ClassEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { addClassMemberRequest, DeleteClassStudentRequest, ClassItem, ClassMemberResponse, ClassResponse, CreateClassRequest, ImportProblemClassRequest, UpdateClassTeacherPayload, UpdateSlotProblemRequest, UpdateSlotProblemResponse } from "@/types";
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
getMyClassesStudent: builder.query<ClassResponse, {
  semesterId?: string;
  subjectId?: string;
  page?: number;
  pageSize?: number;
}>({
  query: (params = {}) => ({
    url: ClassEndpoint.GET_MY_CLASSES_STUDENT,
    method: "GET",
    params: {
      semesterId: params.semesterId ,
      subjectId: params.subjectId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
  }),
  providesTags: ["MyClass"],
}),
getMyClassesTeacher: builder.query<ClassResponse, {
  semesterId?: string;
  subjectId?: string;
  page?: number;
  pageSize?: number;
}>({
  query: (params = {}) => ({
    url: ClassEndpoint.GET_MY_CLASSES_TEACHER,
    method: "GET",
    params: {
      semesterId: params.semesterId ,
      subjectId: params.subjectId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
  }),
  providesTags: ["MyClass"],
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

    deleteStudentClassSemester: builder.mutation<void, DeleteClassStudentRequest>({
      query: ({ classSemesterId, studentId }) => ({
        url: ClassEndpoint.DELETE_STUDENT_CLASS_SEMESTER
             .replace("{classSemesterId}", classSemesterId)
             .replace("{studentId}", studentId),
        method: "DELETE",
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

 exportClass: builder.mutation<
  Blob,
  { semesterId?: string; subjectId?: string }
>({
  query: (params) => ({
    url: ClassEndpoint.EXPORT_CLASS,
    method: "GET",
    params,
    responseHandler: (response) => response.blob(),
  }),
}),

addClassMembers: builder.mutation<
  void,
  { id: string; data: addClassMemberRequest }
>({
  query: ({ id, data }) => ({
    url: ClassEndpoint.ADD_CLASS_MEMBERS.replace("{classSemesterId}", id),
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Class"],
}),
    // Export danh sách lớp (không truyền params)
    exportClassTemplate: builder.mutation<Blob, void>({
      query: () => ({
        url: ClassEndpoint.EXPORT_TEMPLATE_CLASS,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    importProblemToSlot: builder.mutation<
  void,
  { instanceId: string; slotId: string; data: ImportProblemClassRequest[] }
>({
  query: ({ instanceId, slotId, data }) => ({
    url: ClassEndpoint.IMPORT_PROBLEM_CLASS
      .replace("{instanceId}", instanceId)
      .replace("{slotId}", slotId),
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["ClassSlot"],
}),
  updateSlotProblems: builder.mutation<UpdateSlotProblemResponse,
  {
    instanceId: string;
    slotId: string;
    data: UpdateSlotProblemRequest[];
  }
>({
  query: ({ instanceId, slotId, data }) => ({
    url: ClassEndpoint.UPDATE_SLOT_PROBLEMS
      .replace("{instanceId}", instanceId)
      .replace("{slotId}", slotId),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["ClassSlot"],
}),
// xóa 
deleteSlotProblems: builder.mutation<
  void,
  { instanceId: string; slotId: string; problemIds: string[] }
>({
  query: ({ instanceId, slotId, problemIds }) => ({
    url: `/api/v1/class-instance/${instanceId}/slots/${slotId}/problems`,
    method: "DELETE", 
    body: problemIds,
  }),
  invalidatesTags: ["ClassSlot"],
}),

exportStudentsImportTemplate: builder.mutation<Blob, { classSemesterId: string }>({
  query: ({ classSemesterId }) => ({
    url: ClassEndpoint.GET_STUDENTS_IMPORT_TEMPLATE.replace("{classSemesterId}", classSemesterId),
    method: "GET",
    responseHandler: (response) => response.blob(),
  }),
}),

importStudents: builder.mutation<any, { classSemesterId: string; data: FormData }>({
  query: ({ classSemesterId, data }) => ({
    url: ClassEndpoint.IMPORT_STUDENTS_CLASS_SEMESTER.replace("{classSemesterId}", classSemesterId),
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Class"],
}),

exportStudentsClassSemester: builder.mutation<Blob, { classSemesterId: string }>({
  query: ({ classSemesterId }) => ({
    url: ClassEndpoint.EXPORT_STUDENTS_CLASS_SEMESTER.replace("{classSemesterId}", classSemesterId),
    method: "GET",
    responseHandler: (response) => response.blob(),
  }),
}),

updateClassSemester: builder.mutation<
  void,
  {
    id: string;
    classSemesterId: string;
    data: {
      classId: string | null;
      semesterId: string | null;
      subjectId: string | null;
      teacherId: string | null;
    }
  }
>({
  query: ({ id, classSemesterId, data }) => ({
    url: ClassEndpoint.UPDATE_CLASS_SEMESTER
      .replace("{id}", id)
      .replace("{classSemesterId}", classSemesterId),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Class"],
}),

joinClass: builder.mutation<void, { inviteCode: string | null }>({
  query: (data) => ({
    url: "/api/v1/Class/join",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["MyClass"],
}),

  }),
});


export const {
   useGetClassesQuery,
   useGetMyClassesStudentQuery,
   useGetMyClassesTeacherQuery,
   useGetClassDetailQuery,
   useCreateClassMutation,
   useUpdateClassTeacherMutation,
   useGetClassMembersQuery,
   useAddClassMembersMutation,
   useExportClassMutation,
   useExportClassTemplateMutation,
   useUpdateSlotProblemsMutation,
   useImportProblemToSlotMutation,
   useDeleteSlotProblemsMutation,
   useExportStudentsImportTemplateMutation,
   useImportStudentsMutation,
   useExportStudentsClassSemesterMutation,
   useDeleteStudentClassSemesterMutation,
   useUpdateClassSemesterMutation,
   useJoinClassMutation,
} = classApi;
