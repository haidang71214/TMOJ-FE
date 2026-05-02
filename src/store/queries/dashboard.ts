import { DashboardEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { DashboardStatsResponse } from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: DashboardEndpoint.STATS,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
