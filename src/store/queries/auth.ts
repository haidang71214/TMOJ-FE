import { LoginRequest, LoginResponse } from "@/types";
import { baseApi } from "../base";

import { authEndpoint } from "@/constants/endpoints";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<{ result: LoginResponse }, LoginRequest>({
      query: (params) => ({
        url: authEndpoint.LOGIN,
        method: "POST",
        body: params,
      }),
    }),
    googleLogin: builder.mutation<{ result: LoginResponse }, { tokenId: string }>({
      query: (params) => ({
        url: authEndpoint.GOOGLE_LOGIN,
        method: "POST",
        body: params,
      }),
    }),
  }),
});


export const {
  useLoginMutation,
  useGoogleLoginMutation,
} = authApi;
