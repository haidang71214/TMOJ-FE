import { LoginRequest, LoginResponse, Logout, RegisterRequestDto, RegisterResponseDto } from "@/types";
import { baseApi } from "../base";

import { authEndpoint } from "@/constants/endpoints";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation< { data: LoginResponse}, LoginRequest>({
      query: (params) => ({
        url: authEndpoint.LOGIN,
        method: "POST",
        body: params,
      }),
       invalidatesTags: ["User"],
    }),
    logout: builder.mutation< { data: Logout}, void>({
      query: (params) => ({
        url: authEndpoint.LOGOUT,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["User"],
    }),
    googleLogin: builder.mutation<{ result: LoginResponse }, { tokenId: string }>({
      query: (params) => ({
        url: authEndpoint.GOOGLE_LOGIN,
        method: "POST",
        body: params,
      }),
    }),
    register: builder.mutation<{ result: RegisterResponseDto }, RegisterRequestDto>({
      query: (params) => ({
        url: authEndpoint.REGISTER,
        method: "POST",
        body: params,
      }),
    }),
  }),
});


export const {
  useLogoutMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation
} = authApi;
