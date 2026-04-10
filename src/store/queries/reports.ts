import { baseApi } from "../base";
import { ReportEndpoint } from "@/constants/endpoints";
import { 
  CreateReportRequest, 
  PendingReportsResponse, 
  ReportGroupsResponse, 
  MyReportsResponse, 
  AllReportsResponse, 
  ReportDetailResponse 
} from "@/types";

export const reportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createReport: builder.mutation<{ data: { reportId: string }; message: string; traceId: string | null }, CreateReportRequest>({
      query: (body) => ({
        url: ReportEndpoint.CREATE_REPORT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),

    getPendingReports: builder.query<PendingReportsResponse, { cursorCreatedAt?: string, cursorId?: string }>({
      query: (params) => {
        let url = ReportEndpoint.GET_PENDING_REPORTS;
        const queryParams = new URLSearchParams();
        if (params.cursorCreatedAt) queryParams.append("cursorCreatedAt", params.cursorCreatedAt);
        if (params.cursorId) queryParams.append("cursorId", params.cursorId);
        if (queryParams.toString()) url += `?${queryParams.toString()}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Reports"],
    }),

    getMyReports: builder.query<MyReportsResponse, void>({
      query: () => ({
        url: ReportEndpoint.GET_MY_REPORTS,
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    getAllReports: builder.query<AllReportsResponse, { targetType?: string, status?: string } | void>({
      query: (params) => {
        let url = ReportEndpoint.GET_ALL_REPORTS;
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.targetType && params.targetType !== "all") queryParams.append("targetType", params.targetType);
          if (params.status && params.status !== "all") queryParams.append("status", params.status);
          const qs = queryParams.toString();
          if (qs) url += `?${qs}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Reports"],
    }),

    getReportById: builder.query<ReportDetailResponse, { id: string }>({
      query: ({ id }) => ({
        url: ReportEndpoint.GET_REPORT_BY_ID.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    getReportGroups: builder.query<ReportGroupsResponse, void>({
      query: () => ({
        url: ReportEndpoint.GET_REPORT_GROUPS,
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    approveReport: builder.mutation<{ data: boolean; message: string; traceId: string | null }, { id: string, moderatorNote?: string }>({
      query: ({ id, moderatorNote }) => ({
        url: ReportEndpoint.APPROVE_REPORT.replace("{id}", id),
        method: "POST",
        body: moderatorNote ? { moderatorNote } : undefined,
      }),
      invalidatesTags: ["Reports", "Discussion"],
    }),

    rejectReport: builder.mutation<{ data: boolean; message: string; traceId: string | null }, { id: string, moderatorNote?: string }>({
      query: ({ id, moderatorNote }) => ({
        url: ReportEndpoint.REJECT_REPORT.replace("{id}", id),
        method: "POST",
        body: moderatorNote ? { moderatorNote } : undefined,
      }),
      invalidatesTags: ["Reports", "Discussion"],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetPendingReportsQuery,
  useGetMyReportsQuery,
  useGetAllReportsQuery,
  useGetReportByIdQuery,
  useGetReportGroupsQuery,
  useApproveReportMutation,
  useRejectReportMutation,
} = reportsApi;
