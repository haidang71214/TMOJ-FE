import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types";
import webStorageClient from "@/utils/webStorageClient";
import { authApi } from "../queries/auth";

interface AuthSlickInterface {
  isAuthenticatedAccount: boolean;
  user?: User;
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
        const user = action.payload?.result.user;
        const token = action.payload?.result.token;

        webStorageClient.setToken(token);
        webStorageClient.setUser(user);

        state.user = user;
        state.isAuthenticatedAccount = true;
      },
    );
  },
});

export const { loginFromToken, clearLoginToken, setHydrated } = authSlice.actions;

export default authSlice.reducer;
