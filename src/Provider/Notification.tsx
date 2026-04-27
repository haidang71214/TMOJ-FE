"use client";

import {
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
  DropdownSection,
  Chip,
  Spinner,
} from "@heroui/react";
import {
  Bell,
  Trophy,
  Code2,
  Megaphone,
  Star,
  ArrowUpRight,
  ShieldAlert,
  BookOpen,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetUserNotificationsQuery, useMarkNotificationAsReadMutation } from "@/store/queries/notification";
import { useLazyGetDiscussionQuery } from "@/store/queries/discussion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { NotificationDto } from "@/types/notification";

const iconByType = (type: string) => {
  switch (type.toLowerCase()) {
    case "contest":
      return <Trophy size={18} className="text-[#ff5c00]" />;
    case "problem":
      return <Code2 size={18} className="text-blue-500" />;
    case "discussion":
    case "comment":
    case "class":
      return <BookOpen size={18} className="text-purple-500" />;
    case "system":
    case "announcement":
      return <Megaphone size={18} className="text-blue-500" />;
    case "report":
      return <ShieldAlert size={18} className="text-rose-500" />;
    case "submission":
      return <Code2 size={18} className="text-green-500" />;
    case "badge":
      return <Star size={18} className="text-yellow-500" />;
    case "store":
      return <Settings size={18} className="text-yellow-500" />;
    case "user":
      return <Bell size={18} className="text-[#A4B5C4]" />;
    case "security":
      return <ShieldAlert size={18} className="text-rose-500" />;
    default:
      return <Bell size={18} className="text-[#A4B5C4]" />;
  }
};

export default function NotificationInNavbar() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: notificationsData, isLoading } = useGetUserNotificationsQuery(user?.userId || "", {
    skip: !user?.userId,
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [triggerGetDiscussion] = useLazyGetDiscussionQuery();

  const notifications = notificationsData || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleNotificationClick = async (n: NotificationDto) => {
    console.log("🔔 Navbar Notification Clicked:", {
      id: n.notificationId,
      scopeId: n.scopeId,
      scopeType: n.scopeType
    });
    // 1. Đánh dấu đã đọc
    handleMarkAsRead(n.notificationId, n.isRead);

    // 2. Điều hướng nếu có scopeId
    if (!n.scopeId) {
      console.warn("⚠️ Navbar: No scopeId found");
      return;
    }

    try {
      const scopeType = n.scopeType?.toLowerCase();
      switch (scopeType) {
        case "discussion":
          const discussionRes = await triggerGetDiscussion({ id: n.scopeId }).unwrap();
          const problemId = discussionRes?.data?.problemId;
          if (problemId) {
            router.push(`/Problems/${problemId}?tab=description&discussionId=${n.scopeId}`);
          } else {
            router.push("/");
          }
          break;
        case "problem":
          router.push(`/Problems/${n.scopeId}`);
          break;
        case "contest":
          router.push(`/Contest/${n.scopeId}`);
          break;
        case "study_plan":
          router.push(`/StudyPlan/${n.scopeId}`);
          break;
        case "class":
          router.push(`/Class/${n.scopeId}`);
          break;
        case "team":
          // router.push(`/Management/Team/${n.scopeId}`);
          break;
        case "store":
          router.push(`/Coin`);
          break;
        case "user":
          router.push(`/Profile/${n.scopeId}`);
          break;
        case "system":
          break;
        default:
          console.warn("Unknown scopeType:", scopeType);
          break;
      }
    } catch (err) {
      console.error("Failed to handle navigation", err);
    }
  };

  return (
    <NavbarItem>
      <Dropdown
        placement="bottom-end"
        className="p-0 border-2 border-blue-600 dark:border-[#22c55e] shadow-2xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#1C2737]"
      >
        <DropdownTrigger>
          <div className="relative cursor-pointer group">
            <Badge
              content={unreadCount}
              color="danger"
              isInvisible={unreadCount === 0}
              shape="circle"
              className="font-black border-2 border-white dark:border-[#1C2737]"
            >
              <div className="p-2 rounded-xl hover:bg-[#CDD5DB]/30 dark:hover:bg-[#3F4755] transition-all duration-300">
                <Bell
                  size={22}
                  className="text-[#071739] dark:text-white group-hover:rotate-12 transition-transform"
                />
              </div>
            </Badge>
          </div>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Notifications"
          className="w-[360px] p-0 max-h-[500px] overflow-y-auto no-scrollbar"
        >
          <DropdownSection
            showDivider
            className="mb-0 sticky top-0 bg-white dark:bg-[#1C2737] z-20 shadow-sm"
          >
            <DropdownItem
              key="header"
              isReadOnly
              className="opacity-100 p-4 rounded-none cursor-default"
              textValue="Header"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
                  Notifications
                </span>
                <Chip
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="font-black text-[9px] italic h-5 uppercase"
                >
                  {unreadCount} New
                </Chip>
              </div>
            </DropdownItem>
            <DropdownItem
              key="view_all"
              isReadOnly
              className="p-0 rounded-none"
              textValue="View all"
            >
              <Button
                fullWidth
                variant="light"
                onPress={() => router.push("/Notifications")}
                className="rounded-none h-12 font-[1000] italic uppercase text-[10px] text-[#ff5c00] gap-2 hover:bg-[#ff5c00]/10 border-t border-divider dark:border-white/5"
                endContent={<ArrowUpRight size={14} strokeWidth={3} />}
              >
                View all
              </Button>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection className="mb-0">
            {isLoading ? (
              <DropdownItem key="loading" isReadOnly textValue="Loading" className="p-10 flex justify-center">
                <div className="flex justify-center w-full">
                  <Spinner color="warning" size="sm" />
                </div>
              </DropdownItem>
            ) : notifications.length === 0 ? (
              <DropdownItem key="no_notif" isReadOnly textValue="No Notifications" className="p-10 text-center font-black uppercase italic text-slate-400 opacity-50">
                No Notifications
              </DropdownItem>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <DropdownItem
                  key={n.notificationId}
                  textValue={n.title}
                  className={`gap-4 rounded-none px-5 py-5 border-b border-divider dark:border-white/5 last:border-none ${!n.isRead ? "bg-[#ff5c00]/5" : ""
                    }`}
                  onPress={() => handleNotificationClick(n as unknown as NotificationDto)}
                >
                  <div className="flex items-start gap-4 text-black dark:text-white">
                    <div className="mt-1 p-2 bg-slate-100 dark:bg-white/10 rounded-xl shrink-0 border border-divider dark:border-white/5">
                      {iconByType(n.scopeType || n.type)}
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <span className={`font-[1000] text-sm leading-tight italic uppercase tracking-tight ${!n.isRead ? "text-[#071739] dark:text-white" : "text-slate-400"}`}>
                        {n.title}
                      </span>
                      <span className={`text-xs line-clamp-2 font-bold italic leading-snug ${!n.isRead ? "text-[#667085] dark:text-[#A4B5C4]" : "text-slate-400"}`}>
                        {n.message}
                      </span>
                      <span className="text-[9px] font-black text-[#98A2B3] uppercase italic mt-2">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!n.isRead && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5c00] mt-2 shadow-[0_0_10px_#ff5c00] shrink-0" />
                    )}
                  </div>
                </DropdownItem>
              ))
            )}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </NavbarItem>
  );
}
