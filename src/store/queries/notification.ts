import { NotificationEndpoint } from "@/constants/endpoints";
import { CreateNotificationRequestDto, NotificationDto } from "@/types/notification";
import { baseApi } from "../base";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNotification: builder.mutation<NotificationDto, CreateNotificationRequestDto>({
      query: (body) => ({
        url: NotificationEndpoint.CREATE_NOTIFICATION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),
    getUserNotifications: builder.query<NotificationDto[], string>({
      query: (userId) => NotificationEndpoint.GET_NOTIFICATION_BY_USER.replace("{userId}", userId),
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        return response || [];
      },
      providesTags: ["Notification"],
    }),
    getAllNotifications: builder.query<NotificationDto[], void>({
      query: () => NotificationEndpoint.GET_ALL_NOTIFICATION,
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        return response || [];
      },
      providesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: NotificationEndpoint.MARK_AS_READ.replace("{id}", id),
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<string, string>({
      query: (id) => ({
        url: NotificationEndpoint.DELETE_NOTIFICATION.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetUserNotificationsQuery,
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
