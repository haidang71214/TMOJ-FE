import { AdminUserEndPoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { CreateUserRequest, CreateUserResponse, ImportUsersResponse, UpdateUserRequest, Users } from "@/types";



export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserList: builder.query<{ data: Users[] }, void>({ // query 
      query: () => ({
        url: AdminUserEndPoint.GET_LIST_USER,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserRole: builder.query<{ data: Users[] }, { roleName: string }>({
      query: ({ roleName }) => ({
        url: AdminUserEndPoint.GET_USER_ROLE.replace("{roleName}", roleName),
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (body) => ({
        url: AdminUserEndPoint.CREATE_USER,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    downloadImportUserTemplate: builder.mutation<Blob, void>({
      query: () => ({
        url: AdminUserEndPoint.GET_USER_IMPORT_TEMPLATE,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    importUsers: builder.mutation<ImportUsersResponse, FormData>({
      query: (formData) => ({
        url: AdminUserEndPoint.IMPORT_USERS,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    lockUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: AdminUserEndPoint.LOCK_USER_PUT.replace("{id}", id),
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["User"],
    }),
    unlockUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: AdminUserEndPoint.UNLOCK_USER_PUT.replace("{id}", id),
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["User"],
    }),
    getLockedUsers: builder.query<{ data: Users[] }, void>({
      query: () => ({
        url: AdminUserEndPoint.GET_USER_LOCK,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUnlockedUsers: builder.query<{ data: Users[] }, void>({
      query: () => ({
        url: AdminUserEndPoint.GET_USER_UNLOCK,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getStudentById: builder.query<{ data: Users }, { id: string; semesterId?: string; subjectId?: string }>({
      query: ({ id, semesterId, subjectId }) => {
        let url = AdminUserEndPoint.GET_STUDENT_BY_ID.replace("{id}", id);
        const params = new URLSearchParams();
        if (semesterId) params.append("semesterId", semesterId);
        if (subjectId) params.append("subjectId", subjectId);
        if (params.toString()) url += `?${params.toString()}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    getTeacherById: builder.query<{ data: any }, { id: string; semesterId?: string; subjectId?: string }>({
      query: ({ id, semesterId, subjectId }) => {
        let url = AdminUserEndPoint.GET_TEACHER_BY_ID.replace("{id}", id);
        const params = new URLSearchParams();
        if (semesterId) params.append("semesterId", semesterId);
        if (subjectId) params.append("subjectId", subjectId);
        if (params.toString()) url += `?${params.toString()}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    assignRole: builder.mutation<{ message: string }, { id: string, data: { roleCode: string } }>({
      query: ({ id, data }) => ({
        url: AdminUserEndPoint.POST_ASSIGN_ROLE.replace("{id}", id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<{ message: string }, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: AdminUserEndPoint.UPDATE_USER.replace("{id}", id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getUserById: builder.query<{ data: Users }, string>({
      query: (id) => ({
        url: AdminUserEndPoint.GET_DETAIL_USER.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    searchUsers: builder.query<{ data: Users[] }, { search: string }>({
      query: ({ search }) => ({
        url: AdminUserEndPoint.GET_LIST_USER,
        method: "GET",
        params: { search },
      }),
      providesTags: ["User"],
    }),

  }),

});


export const {
  useGetUserListQuery,
  useGetUserRoleQuery,
  useCreateUserMutation,
  useDownloadImportUserTemplateMutation,
  useImportUsersMutation,
  useLockUserMutation,
  useUnlockUserMutation,
  useGetLockedUsersQuery,
  useGetUnlockedUsersQuery,
  useGetStudentByIdQuery,
  useGetTeacherByIdQuery,
  useAssignRoleMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useSearchUsersQuery,
} = userApi;

