import { TeamEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  CreateTeamRequest,
  CreateTeamResponse,
  TeamDetailResponse,
  AddTeamMemberRequest,
  JoinTeamByCodeRequest,
  JoinTeamByCodeResponse,
} from "@/types";

export const teamApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 1. Tạo team
    createTeam: builder.mutation<CreateTeamResponse, CreateTeamRequest>({
      query: (body) => ({
        url: TeamEndpoint.CREATE_TEAM,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team"],
    }),

    // 2. Xem chi tiết team (bao gồm thành viên)
    getTeamDetail: builder.query<TeamDetailResponse, string>({
      query: (id) => ({
        url: TeamEndpoint.GET_TEAM_DETAIL.replace("{id}", id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),

    // 3. Thêm thành viên vào team
    addTeamMember: builder.mutation<any, AddTeamMemberRequest>({
      query: ({ teamId, userId }) => ({
        url: TeamEndpoint.ADD_TEAM_MEMBER.replace("{id}", teamId),
        method: "POST",
        body: { teamId, userId },
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "Team", id: teamId }],
    }),

    // 4. Tham gia team bằng mã mời
    joinTeamByCode: builder.mutation<JoinTeamByCodeResponse, JoinTeamByCodeRequest>({
      query: (body) => ({
        url: TeamEndpoint.JOIN_BY_CODE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team"],
    }),
    // 5. Xóa thành viên khỏi team
    deleteTeamMember: builder.mutation<any, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: TeamEndpoint.DELETE_TEAM_MEMBER.replace("{id}", teamId).replace("{userId}", userId),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "Team", id: teamId }],
    }),
    // 6. Cập nhật avatar team
    updateTeamAvatar: builder.mutation<any, { teamId: string; avatarUrl: string }>({
      query: ({ teamId, avatarUrl }) => ({
        url: TeamEndpoint.UPDATE_AVATAR.replace("{id}", teamId),
        method: "PUT",
        body: { avatarUrl },
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "Team", id: teamId }, "Team"],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useGetTeamDetailQuery,
  useAddTeamMemberMutation,
  useJoinTeamByCodeMutation,
  useDeleteTeamMemberMutation,
  useUpdateTeamAvatarMutation,
} = teamApi;
