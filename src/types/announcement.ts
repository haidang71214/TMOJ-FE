export interface AnnouncementDto {
  announcementId: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export interface CreateAnnouncementCommand {
  title: string;
  content: string;
  pinned: boolean;
  scopeType: string;
  scopeId: string | null;
}
