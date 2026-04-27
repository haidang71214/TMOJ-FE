"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
  Spinner,
} from "@heroui/react";
import {
  Bell,
  Trophy,
  Code2,
  Trash2,
  CheckCheck,
  Search,
  Filter,
  ChevronDown,
  BookOpen,
  Settings,
  ShieldAlert,
  Megaphone,
} from "lucide-react";
import { useGetUserNotificationsQuery, useMarkNotificationAsReadMutation, useDeleteNotificationMutation } from "@/store/queries/notification";
import { useLazyGetDiscussionQuery } from "@/store/queries/discussion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { NotificationDto } from "@/types/notification";

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "contest":
      return <Trophy className="text-[#ff5c00]" />;
    case "problem":
      return <Code2 className="text-blue-500" />;
    case "discussion":
    case "comment":
    case "class":
      return <BookOpen className="text-purple-500" />;
    case "system":
    case "announcement":
      return <Megaphone className="text-blue-500" />;
    case "report":
      return <ShieldAlert className="text-rose-500" />;
    case "submission":
      return <Code2 className="text-green-500" />;
    case "store":
      return <Settings className="text-yellow-500" />;
    case "user":
      return <Bell className="text-slate-400" />;
    default:
      return <Bell className="text-slate-400" />;
  }
};

export default function NotificationsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const { data: notificationsData, isLoading } = useGetUserNotificationsQuery(user?.userId || "", {
    skip: !user?.userId,
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [triggerGetDiscussion] = useLazyGetDiscussionQuery();

  const [page, setPage] = useState(1);
  const [filterTab, setFilterTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const rowsPerPage = 6;

  const notifications = notificationsData || [];

  // Logic lọc kết hợp giữa Tabs và Category Dropdown
  const filteredData = useMemo(() => {
    return notifications.filter((n) => {
      const matchTab =
        filterTab === "all"
          ? true
          : filterTab === "unread"
            ? !n.isRead
            : n.isRead;

      const matchCategory =
        categoryFilter === "all"
          ? true
          : n.type.toLowerCase() === categoryFilter.toLowerCase() ||
          n.scopeType?.toLowerCase() === categoryFilter.toLowerCase();

      return matchTab && matchCategory;
    });
  }, [filterTab, categoryFilter, notifications]);

  const pages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, filteredData]);

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    try {
      await Promise.all(unreadNotifications.map(n => markAsRead(n.notificationId).unwrap()));
      addToast({ title: "Tất cả thông báo đã được đánh dấu là đã đọc", color: "success" });
    } catch (error) {
      addToast({ title: "Lỗi khi đánh dấu đã đọc", color: "danger" });
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tất cả thông báo?")) return;
    try {
      await Promise.all(notifications.map(n => deleteNotification(n.notificationId).unwrap()));
      addToast({ title: "Đã xóa tất cả thông báo", color: "success" });
    } catch (error) {
      addToast({ title: "Lỗi khi xóa thông báo", color: "danger" });
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleNotificationClick = async (n: NotificationDto) => {
    console.log("🔔 Notification Clicked:", {
      id: n.notificationId,
      scopeId: n.scopeId,
      scopeType: n.scopeType,
      title: n.title
    });
    // 1. Đánh dấu đã đọc
    handleMarkAsRead(n.notificationId, n.isRead);

    // 2. Điều hướng nếu có scopeId
    if (!n.scopeId) {
      console.warn("⚠️ No scopeId found, skipping navigation");
      return;
    }

    try {
      const scopeType = n.scopeType?.toLowerCase();
      switch (scopeType) {
        case "discussion":
          // Cách 1: Fetch problemId từ discussionId
          const discussionRes = await triggerGetDiscussion({ id: n.scopeId }).unwrap();
          const problemId = discussionRes?.data?.problemId;
          if (problemId) {
            router.push(`/Problems/${problemId}?tab=description&discussionId=${n.scopeId}`);
          } else {
            router.push("/"); // Fallback về trang chủ
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
          // Thông báo hệ thống có thể dẫn đến trang chi tiết hoặc giữ nguyên
          break;
        default:
          console.warn("Unknown scopeType:", scopeType);
          break;
      }
    } catch (err) {
      console.error("Failed to handle navigation", err);
      addToast({ title: "Không thể tìm thấy nội dung liên kết", color: "danger" });
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
      addToast({ title: "Đã xóa thông báo", color: "success" });
    } catch (error) {
      addToast({ title: "Lỗi khi xóa thông báo", color: "danger" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071739] transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto p-6 md:p-12 flex flex-col gap-8 pb-20">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end border-b border-divider dark:border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none text-[#071739] dark:text-white">
              NOTIFICATIONS<span className="text-[#ff5c00]">.</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic px-1">
              Academic Activity Hub
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="flat"
              size="sm"
              startContent={<CheckCheck size={16} />}
              onPress={handleMarkAllAsRead}
              className="font-black uppercase italic text-[10px] h-10 px-4 rounded-xl dark:bg-[#111c35] dark:text-white border border-divider dark:border-white/10"
            >
              Mark all
            </Button>
            <Button
              variant="flat"
              color="danger"
              size="sm"
              startContent={<Trash2 size={16} />}
              onPress={handleDeleteAll}
              className="font-black uppercase italic text-[10px] h-10 px-4 rounded-xl dark:bg-red-500/10"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 items-center flex-wrap flex-1">
            <Input
              placeholder="Search..."
              startContent={<Search size={18} className="text-[#A4B5C4]" />}
              classNames={{
                inputWrapper:
                  "bg-white dark:bg-[#111c35] rounded-xl h-11 border border-divider dark:border-white/10 shadow-none focus-within:!border-[#ff5c00]",
                input: "dark:text-white font-bold italic",
              }}
              className="max-w-[240px]"
            />

            <Tabs
              variant="underlined"
              selectedKey={filterTab}
              onSelectionChange={(key) => {
                setFilterTab(key.toString());
                setPage(1);
              }}
              classNames={{
                tabList: "gap-6",
                cursor: "w-full bg-[#ff5c00]",
                tab: "max-w-fit px-0 h-11 font-black uppercase italic text-[11px]",
                tabContent:
                  "group-data-[selected=true]:text-[#ff5c00] dark:text-white/60",
              }}
            >
              <Tab key="all" title="All" />
              <Tab key="unread" title="Unread" />
              <Tab key="read" title="Read" />
            </Tabs>
          </div>

          {/* DROPDOWN LỌC CATEGORY */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="h-11 rounded-xl bg-white dark:bg-[#111c35] border border-divider dark:border-white/10 font-black text-[10px] uppercase italic text-[#071739] dark:text-white min-w-[140px]"
                startContent={<Filter size={16} />}
                endContent={<ChevronDown size={14} />}
              >
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filter Categories"
              className="dark:bg-[#111c35]"
              onAction={(key) => {
                setCategoryFilter(key.toString());
                setPage(1);
              }}
            >
              <DropdownItem key="all" className="font-bold uppercase italic text-[10px] dark:text-white">
                All Categories
              </DropdownItem>
              <DropdownItem key="system" className="font-bold uppercase italic text-[10px] text-blue-500">
                System
              </DropdownItem>
              <DropdownItem key="problem" className="font-bold uppercase italic text-[10px] text-blue-500">
                Problems
              </DropdownItem>
              <DropdownItem key="contest" className="font-bold uppercase italic text-[10px] text-[#ff5c00]">
                Contests
              </DropdownItem>
              <DropdownItem key="discussion" className="font-bold uppercase italic text-[10px] text-purple-500">
                Discussions
              </DropdownItem>
              <DropdownItem key="study_plan" className="font-bold uppercase italic text-[10px] text-indigo-500">
                Study Plans
              </DropdownItem>
              <DropdownItem key="store" className="font-bold uppercase italic text-[10px] text-yellow-500">
                Store
              </DropdownItem>
              <DropdownItem key="report" className="font-bold uppercase italic text-[10px] text-red-500">
                Reports
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* LIST SECTION */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner color="warning" size="lg" />
            </div>
          ) : items.length > 0 ? (
            items.map((n) => (
              <Card
                key={n.notificationId}
                isPressable
                onPress={() => handleNotificationClick(n)}
                className={`border-none transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] rounded-[2rem] overflow-hidden 
                  ${!n.isRead
                    ? "bg-white dark:bg-[#111c35] border-l-8 border-[#ff5c00]"
                    : "bg-slate-100/50 dark:bg-white/5 opacity-80"
                  }`}
              >
                <CardBody className="p-6 md:px-10 flex flex-row items-center gap-6 text-black dark:text-white text-left">
                  <div
                    className={`p-4 rounded-2xl shrink-0 ${!n.isRead
                      ? "bg-[#ff5c00]/10"
                      : "bg-slate-200 dark:bg-white/5"
                      }`}
                  >
                    {getIcon(n.scopeType || n.type)}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`text-xl font-[1000] italic uppercase tracking-tight leading-tight ${!n.isRead
                          ? "text-[#071739] dark:text-white"
                          : "text-slate-500"
                          }`}
                      >
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-4 ml-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase italic whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                        <div
                          className="p-2 cursor-pointer hover:bg-red-500/10 rounded-full text-danger transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(e, n.notificationId);
                          }}
                        >
                          <Trash2 size={16} />
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-bold leading-relaxed italic line-clamp-2 ${!n.isRead
                        ? "text-slate-600 dark:text-slate-300"
                        : "text-slate-500"
                        }`}
                    >
                      {n.message}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center font-black uppercase italic text-slate-500 opacity-50 tracking-widest">
              No results for this category
            </div>
          )}
        </div>

        {/* PAGINATION SECTION */}
        <div className="flex justify-center mt-6">
          <Pagination
            total={pages}
            page={page}
            onChange={setPage}
            showControls
            classNames={{
              cursor:
                "bg-[#071739] dark:bg-[#ff5c00] text-white font-black italic shadow-lg",
              item: "dark:text-white",
            }}
          />
        </div>
      </div>
    </div>
  );
}
