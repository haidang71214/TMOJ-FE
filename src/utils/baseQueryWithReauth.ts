import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import webStorageClient from "@/utils/webStorageClient";
import { BASE_URL, BASE_URLS } from "@/constants";


export const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URLS,

  prepareHeaders: (headers, { endpoint }) => {
    const token = webStorageClient.getToken();

    // ❗ Không attach token cho login & refresh
    const authEndpoints = ["login", "refreshToken"];

    if (token && !authEndpoints.includes(endpoint)) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(null);
  });
  failedQueue = [];
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log("🚀 API CALL:", args);

  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    typeof args !== "string" &&
    !args.url?.includes("refresh-token")
  ) {
    console.log("⛔ 401 detected. Attempting refresh...");

    if (!isRefreshing) {
      isRefreshing = true;

      const refreshToken = webStorageClient.getRefreshToken();
      console.log("🔑 Refresh Token:", refreshToken);

      if (!refreshToken) {
        console.log("❌ No refresh token. Logging out.");
        webStorageClient.logout();
        return result;
      }

      console.log("🔄 Calling refresh-token endpoint...");

      const refreshResult = await rawBaseQuery(
        {
          url: "Auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      console.log("📥 Refresh response:", refreshResult);

      if (refreshResult.data) {
        const newAccessToken =
          (refreshResult.data as any).data.accessToken;

        console.log("✅ New access token received:", newAccessToken);

        webStorageClient.setToken(newAccessToken);

        processQueue(null);

        console.log("🔁 Retrying original request...");
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        console.log("❌ Refresh failed. Logging out.");
        processQueue(refreshResult.error);
        webStorageClient.logout();
      }

      isRefreshing = false;
    } else {
      console.log("⏳ Waiting for ongoing refresh...");

      await new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });

      console.log("🔁 Retrying request after queued refresh...");
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};