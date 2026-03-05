import { AdminUserEndPoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { Users } from "@/types";
export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
     getUserList: builder.query<Users[], void>({
      query: () => ({
        url: AdminUserEndPoint.GET_LIST_USER,
        method: "GET",
      }),
      providesTags: ["User"], 
    }),

  }),
});


export const {
  useGetUserListQuery,
} = userApi;
