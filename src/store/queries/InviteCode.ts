import { ClassEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";

export const inviteCodeApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInviteCode: builder.query<string, string>({
      query: (classSemesterId) => ({
        url: ClassEndpoint.GET_INVITE_CODE.replace("{classSemesterId}", classSemesterId),
        method: "GET",
      }),
      providesTags: ["InviteCode"],
    }),

    createInviteCode: builder.mutation<{ code: string }, { classSemesterId: string; data: { minutesValid: number } }>({
      query: ({ classSemesterId, data }) => ({
        url: ClassEndpoint.CREATE_INVITE_CODE.replace("{classSemesterId}", classSemesterId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["InviteCode"],
    }),

    deleteInviteCode: builder.mutation<void, string>({
      query: (classSemesterId) => ({
        url: ClassEndpoint.DELETE_INVITE_CODE.replace("{classSemesterId}", classSemesterId),
        method: "DELETE",
      }),
      invalidatesTags: ["InviteCode"],
    }),
  }),
});

export const {
  useGetInviteCodeQuery,
  useCreateInviteCodeMutation,
  useDeleteInviteCodeMutation,
} = inviteCodeApi;
