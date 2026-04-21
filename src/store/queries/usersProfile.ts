import { UpdateUserDto, Users } from "@/types";
import { baseApi } from "../base";
import { userProfileEndpoint } from "@/constants/endpoints";

export interface UpdateMeRequest {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
}

export const userApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({
    getUserInformation: builder.query<Users, void>({
      query: () => ({
        url: userProfileEndpoint.GET_PROFILE,
        method: "GET",
      }),
      transformResponse: (response: { data: Users }) => {
        return response.data;
      },
      providesTags: ["User"],
    }),
    getUserManual: builder.mutation<Users, string>({
      query: (token: string) => ({
        url: userProfileEndpoint.GET_PROFILE,
        method: "GET",
        headers: { "Authorization": token }
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
    updateMe: builder.mutation<void, UpdateMeRequest>({
      query: (body) => ({
        url: userProfileEndpoint.UPDATE_ME,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateAvatar: builder.mutation<void, FormData>({
      query: (body) => ({
        url: userProfileEndpoint.UPDATE_AVATAR,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAvatar: builder.mutation<void, void>({
      query: () => ({
        url: userProfileEndpoint.DELETE_AVATAR,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});


export const {
  useUpdateUserProfileMutation,
  useGetUserInformationQuery,
  useGetUserManualMutation,
  useUpdateMeMutation,
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
} = userApi;
