export interface AnnouncementDto {
  announcementId: string;
  title: string;
  content: string;
  pinned: boolean;
  durationHours: number;
  createdAt: string;
}

export interface CreateAnnouncementCommand {
  title: string;
  content: string;
  pinned: boolean;
  durationHours: number;
  scopeType: string;
  scopeId: string | null;
}
