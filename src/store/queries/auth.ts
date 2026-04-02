import { LoginGGResponse, LoginRequest, LoginResponse, Logout, RegisterRequestDto, RegisterResponseDto, resetPasswordInformation, sendEmailForgotPassword } from "@/types";
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
    googleLogin: builder.mutation<{ data: LoginGGResponse }, { tokenId: string }>({
      query: (params) => ({
        url: authEndpoint.GOOGLE_LOGIN,
        method: "POST",
        body: params,
      }),
       invalidatesTags: ["User"],
    }),
    register: builder.mutation<{ result: RegisterResponseDto }, RegisterRequestDto>({
      query: (params) => ({
        url: authEndpoint.REGISTER,
        method: "POST",
        body: params,
      }),
    }),
    forgotpass: builder.mutation<{ result: void }, sendEmailForgotPassword>({
      query: (params) => ({
        url: authEndpoint.FORGOT_PASSWORD,
        method: "POST",
        body: params,
      }),
    }),
    resetPassword: builder.mutation<{ result: void }, resetPasswordInformation>({
      query: (params) => ({
        url: authEndpoint.RESET_PASSWORD,
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
  useRegisterMutation,
  useForgotpassMutation,
  useResetPasswordMutation,
} = authApi;
