import { baseApi } from "../base";
import { AnnouncementEndpoint } from "@/constants/endpoints";
import { AnnouncementDto, CreateAnnouncementCommand } from "@/types/announcement";

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<AnnouncementDto[], void>({
      query: () => AnnouncementEndpoint.GET_ALL,
      providesTags: ["Announcement"],
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        return response || [];
      },
    }),
    createAnnouncement: builder.mutation<AnnouncementDto, CreateAnnouncementCommand>({
      query: (body) => ({
        url: AnnouncementEndpoint.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Announcement"],
    }),
    deleteAnnouncement: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: AnnouncementEndpoint.DELETE.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
