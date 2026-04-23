import { WalletEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import { WalletBalanceResponse, WalletTransactionsResponse } from "@/types";

export const walletApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getWalletBalance: builder.query<WalletBalanceResponse, void>({
      query: () => ({
        url: WalletEndpoint.BALANCE,
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    getWalletTransactions: builder.query<WalletTransactionsResponse, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: WalletEndpoint.TRANSACTIONS,
        method: "GET",
        params: { page, pageSize },
      }),
      providesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
} = walletApi;
