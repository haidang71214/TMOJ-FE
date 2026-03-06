import { UpdateUserDto, Users } from "@/types";
import { baseApi } from "../base";
import { userProfileEndpoint } from "@/constants/endpoints";

export const userApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({
    getUserInformation: builder.query<Users, void>({
      query: () => ({
        url: userProfileEndpoint.GET_PROFILE,
        method: "GET",
      }),
      transformResponse: (response: { data: Users }) => {
        console.log(`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ${JSON.stringify(response)}`);
        return response.data;
      },
      
      providesTags: ["User"], 
    }),
    getUserManual: builder.mutation<Users,string>({
      query: (token:string) => ({
        url:userProfileEndpoint.GET_PROFILE,
        method: "GET",
        headers: {"Authorization": token}
      }),
      
    }),

    updateUserProfile: builder.mutation<void, UpdateUserDto>({
      query: (body) => ({
        url: userProfileEndpoint.UPDATE_INFOMATION,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"], 
    }),
  }),
});


export const {
  useUpdateUserProfileMutation,
  useGetUserInformationQuery,
  useGetUserManualMutation
} = userApi;
