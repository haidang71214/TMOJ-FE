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
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- MOCK DATA ---
const MOCK_NOTIFICATIONS = [
  {
    notification_id: "1",
    title: "Contest Weekly #12 Started",
    message: "Join now to earn exclusive coins and badges!",
    type: "contest",
    is_read: false,
    created_at: "2 mins ago",
  },
  {
    notification_id: "2",
    title: "Submission Accepted",
    message: "Your code for 'Two Sum' passed all test cases (32ms).",
    type: "submission",
    is_read: false,
    created_at: "10 mins ago",
  },
  {
    notification_id: "3",
    title: "New Editorial Available",
    message: "Check out the detailed solution for 'Binary Search'.",
    type: "problem",
    is_read: true,
    created_at: "1 hour ago",
  },
  {
    notification_id: "4",
    title: "System Maintenance",
    message: "The system will be down for upgrade at 02:00 AM.",
    type: "announcement",
    is_read: true,
    created_at: "Yesterday",
  },
  {
    notification_id: "5",
    title: "New Rank Achieved!",
    message: "Congratulations! You have reached Gold Tier.",
    type: "badge",
    is_read: false,
    created_at: "3 hours ago",
  },
  {
    notification_id: "6",
    title: "Class Enrollment",
    message: "Instructor RimND added you to SDN302 class.",
    type: "class",
    is_read: true,
    created_at: "5 hours ago",
  },
  {
    notification_id: "7",
    title: "Security Alert",
    message: "New login detected from a different device.",
    type: "security",
    is_read: false,
    created_at: "1 day ago",
  },
  {
    notification_id: "8",
    title: "Assignment Deadline",
    message: "Final call for SDN302 project submission tonight!",
    type: "problem",
    is_read: false,
    created_at: "Just now",
  },
];

const iconByType = (type: string) => {
  switch (type) {
    case "contest":
      return <Trophy size={18} className="text-[#ff5c00]" />;
    case "submission":
      return <Code2 size={18} className="text-green-500" />;
    case "announcement":
      return <Megaphone size={18} className="text-blue-500" />;
    case "badge":
      return <Star size={18} className="text-yellow-500" />;
    case "security":
      return <ShieldAlert size={18} className="text-rose-500" />;
    case "class":
      return <BookOpen size={18} className="text-purple-500" />;
    default:
      return <Bell size={18} className="text-[#A4B5C4]" />;
  }
};

export default function NotificationInNavbar() {
  const router = useRouter();
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length;

  return (
    <NavbarItem>
      <Dropdown
        placement="bottom-end"
        // ÉP BORDER: Light mode dùng Blue (#2563eb), Dark mode dùng Green (#22c55e)
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
            {MOCK_NOTIFICATIONS.map((n) => (
              <DropdownItem
                key={n.notification_id}
                textValue={n.title}
                className={`gap-4 rounded-none px-5 py-5 border-b border-divider dark:border-white/5 last:border-none ${
                  !n.is_read ? "bg-[#ff5c00]/5" : ""
                }`}
              >
                <div className="flex items-start gap-4 text-black dark:text-white">
                  <div className="mt-1 p-2 bg-slate-100 dark:bg-white/10 rounded-xl shrink-0 border border-divider dark:border-white/5">
                    {iconByType(n.type)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="font-[1000] text-sm leading-tight italic uppercase tracking-tight">
                      {n.title}
                    </span>
                    <span className="text-xs text-[#667085] dark:text-[#A4B5C4] line-clamp-2 font-bold italic leading-snug">
                      {n.message}
                    </span>
                    <span className="text-[9px] font-black text-[#98A2B3] uppercase italic mt-2">
                      {n.created_at}
                    </span>
                  </div>
                  {!n.is_read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5c00] mt-2 shadow-[0_0_10px_#ff5c00] shrink-0" />
                  )}
                </div>
              </DropdownItem>
            ))}
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
