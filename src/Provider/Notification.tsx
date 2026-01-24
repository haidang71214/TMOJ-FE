"use client";

import {
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "@heroui/react";
import { Bell, Trophy, Code2, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";

type NotificationType =
  | "system"
  | "contest"
  | "problem"
  | "badge"
  | "submission"
  | "announcement";

type Notification = {
  notification_id: string;
  title: string;
  message?: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  scope_type?: string;
  scope_id?: string;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notification_id: "1",
    title: "Contest Weekly #12 đã bắt đầu",
    message: "Tham gia contest để nhận coin & badge",
    type: "contest",
    is_read: false,
    created_at: "2 phút trước",
    scope_type: "contest",
    scope_id: "contest-uuid-1",
  },
  {
    notification_id: "2",
    title: "Submission Accepted",
    message: "Bài Two Sum đã AC (Runtime 32ms)",
    type: "submission",
    is_read: false,
    created_at: "10 phút trước",
  },
  {
    notification_id: "3",
    title: "New Editorial Available",
    message: "Editorial cho bài Binary Search",
    type: "problem",
    is_read: true,
    created_at: "1 giờ trước",
  },
  {
    notification_id: "4",
    title: "Announcement",
    message: "Hệ thống sẽ bảo trì lúc 02:00 AM",
    type: "announcement",
    is_read: true,
    created_at: "Hôm qua",
  },
];

const iconByType = (type: NotificationType) => {
  switch (type) {
    case "contest":
      return <Trophy size={18} className="text-[#ff8904]" />;
    case "submission":
      return <Code2 size={18} className="text-green-500" />;
    case "announcement":
      return <Megaphone size={18} className="text-blue-500" />;
    default:
      return <Bell size={18} className="text-[#A4B5C4]" />;
  }
};

export default function NotificationInNavbar() {
  const router = useRouter();

  const unreadCount = MOCK_NOTIFICATIONS.filter(
    (n) => !n.is_read
  ).length;

  const handleClick = (n: Notification) => {
    if (n.scope_type === "contest" && n.scope_id) {
      router.push(`/Contest/${n.scope_id}`);
    }
  };

  return (
    <NavbarItem>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="relative cursor-pointer">
            <Badge
              content={unreadCount}
              color="danger"
              isInvisible={unreadCount === 0}
              shape="circle"
            >
              <div className="p-2 rounded-full hover:bg-[#CDD5DB]/30 dark:hover:bg-[#3F4755] transition">
                <Bell
                  size={20}
                  className="text-[#071739] dark:text-white"
                />
              </div>
            </Badge>
          </div>
        </DropdownTrigger>

        <DropdownMenu
  aria-label="Notifications"
  items={MOCK_NOTIFICATIONS}
  className="w-[340px] max-h-[420px] overflow-auto dark:bg-[#1C2737]"
  itemClasses={{
    base:
      "gap-3 rounded-xl px-3 py-2 data-[hover=true]:bg-[#ff8904]/10",
  }}
>
  {(n) => (
    <DropdownItem
      key={n.notification_id}
      onClick={() => handleClick(n)}
      className={`flex items-start gap-3 ${
        !n.is_read ? "bg-[#ff8904]/5" : ""
      }`}
    >
      <div className="mt-1">{iconByType(n.type)}</div>

      <div className="flex flex-col gap-0.5">
        <span className="font-black text-sm">
          {n.title}
        </span>

        {n.message && (
          <span className="text-xs text-[#667085] dark:text-[#A0AEC0]">
            {n.message}
          </span>
        )}

        <span className="text-[10px] text-[#98A2B3]">
          {n.created_at}
        </span>
      </div>
    </DropdownItem>
  )}
</DropdownMenu>

      </Dropdown>
    </NavbarItem>
  );
}
