import { UpdateUserDto, UserDto } from "@/types";
import { baseApi } from "../base";
import { userProfileEndpoint } from "@/constants/endpoints";

export const userApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({
    getUserInformation: builder.query<UserDto, void>({
      query: () => ({
        url: userProfileEndpoint.GET_PROFILE,
        method: "GET",
      }),
      transformResponse: (response: { result: UserDto }) => response.result,
      providesTags: ["User"], 
      // vai trò của provided tag là cập nhật đồng bộ khi có 1 mutation xảy ra
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
  useGetUserInformationQuery
} = userApi;
