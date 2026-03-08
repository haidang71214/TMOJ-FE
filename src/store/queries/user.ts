import { AdminUserEndPoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { Users } from "@/types";
export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
     getUserList: builder.query< Users[], void>({
      query: () => ({
        url: AdminUserEndPoint.GET_LIST_USER,
        method: "GET",
      }),
      providesTags: ["User"], 
    }),
    getUserRole : builder.query<{data :Users[]}, {roleName:string}>({
      query: ({roleName}) => ({
        url: AdminUserEndPoint.GET_USER_ROLE.replace("{roleName}",roleName),
        method: "GET",
      }),
      providesTags: ["User"], 
    }),
  }),
});


export const {
  useGetUserListQuery,
  useGetUserRoleQuery
} = userApi;
