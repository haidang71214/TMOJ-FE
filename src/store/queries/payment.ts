import { PaymentEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  ConversionRateResponse,
  CreateVNPayPaymentRequest,
  CreateVNPayPaymentResponse,
  PaymentHistoryResponse,
  PaymentResponse,
  VNPayCallbackResponse
} from "@/types";

export const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createVNPayPayment: builder.mutation<CreateVNPayPaymentResponse, CreateVNPayPaymentRequest>({
      query: (body) => ({
        url: PaymentEndpoint.VNPAY_CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),
    getVNPayCallback: builder.query<VNPayCallbackResponse, { vnp_TxnRef: string; vnp_ResponseCode: string }>({
      query: (params) => ({
        url: PaymentEndpoint.VNPAY_CALLBACK,
        method: "GET",
        params,
      }),
      providesTags: ["Payment"],
    }),
    getVNPayReturn: builder.query<any, void>({
      query: () => ({
        url: PaymentEndpoint.VNPAY_RETURN,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    getPaymentDetail: builder.query<PaymentResponse, string>({
      query: (id) => ({
        url: PaymentEndpoint.GET_BY_ID.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    getConversionRate: builder.query<ConversionRateResponse, void>({
      query: () => ({
        url: PaymentEndpoint.CONVERSION_RATE,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    getPaymentHistoryMe: builder.query<PaymentHistoryResponse, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: PaymentEndpoint.HISTORY_ME,
        method: "GET",
        params: { page, pageSize },
      }),
      providesTags: ["Payment"],
    }),
    getPaymentHistoryAdmin: builder.query<PaymentHistoryResponse, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: PaymentEndpoint.HISTORY_ADMIN,
        method: "GET",
        params: { page, pageSize },
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreateVNPayPaymentMutation,
  useGetVNPayCallbackQuery,
  useGetVNPayReturnQuery,
  useGetPaymentDetailQuery,
  useGetConversionRateQuery,
  useGetPaymentHistoryMeQuery,
  useGetPaymentHistoryAdminQuery,
} = paymentApi;
