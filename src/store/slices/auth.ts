import { createSlice } from "@reduxjs/toolkit";
import { Users } from "@/types";
import webStorageClient from "@/utils/webStorageClient";
import { authApi } from "../queries/auth";

interface AuthSlickInterface {
  isAuthenticatedAccount: boolean;
  user?: Users;
  isHydrated: boolean;
}

const initialState: AuthSlickInterface = {
  isAuthenticatedAccount: false,
  user: undefined,
  isHydrated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginFromToken: (state, action) => {
      state.user = action.payload;
      state.isAuthenticatedAccount = true;
    },
    clearLoginToken: (state) => {
      state.user = undefined;
      state.isAuthenticatedAccount = false;
      webStorageClient.setToken("");
      webStorageClient.logout();
    },
    setHydrated: (state, action) => {
      state.isHydrated = action.payload ?? true;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const user = action.payload?.data?.user;
        const token = action.payload?.data?.accessToken;

        if (token) {
          webStorageClient.setToken(token); // đây
          webStorageClient.setUser(user);

          state.user = user;
          state.isAuthenticatedAccount = true;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.googleLogin.matchFulfilled,
      (state, action) => {
        // googleLogin might return payload.result or payload.data based on current type definitions
        const payload = action.payload as any;
        const responseData = payload?.result || payload?.data || payload;
        const user = responseData?.user;
        const token = responseData?.accessToken;

        if (token) {
          webStorageClient.setToken(token);
          webStorageClient.setUser(user);

          state.user = user;
          state.isAuthenticatedAccount = true;
        }
      },
    );
  },
});

export const { loginFromToken, clearLoginToken, setHydrated } = authSlice.actions;

export default authSlice.reducer;
