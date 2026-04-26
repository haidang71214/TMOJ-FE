export interface CreateNotificationRequestDto {
  userId: string;
  title: string;
  message: string;
  type: "system" | "comment" | "report";
  scopeType: "comment" | "discussion" | "team" | "study_plan";
  scopeId: string;
  createdBy?: string;
}

export interface BroadcastNotificationCommand {
  title: string;
  message: string;
  role: string;
}

export interface NotificationDto {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  scopeType: string;
  scopeId: string;
  isRead: boolean;
  createdAt: string; // UTC DateTime
}
