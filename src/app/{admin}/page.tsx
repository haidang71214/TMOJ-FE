"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FileCode,
  Trophy,
  Users,
  Settings,
  Package,
  Coins,
  Bell,
  Award,
  Shredder,
  BookOpen,
  School,
  Calendar,
  Tag,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

import ContestManagementPage from "./Contest/page";
import GamificationManagementPage from "./Gamification/page";
import ModerationManagementPage from "./Moderation/page";
import NotificationManagementPage from "./Notification/page";
import ProblemManagementPage from "./Problem/page";
import DasboardPage from "./DasboardPage";
import UserManagerPage from "./Users/page";
import PracticePackagePage from "./Package/page";
import ClassComponents from "./Class/ClassComponents";
import SubjectComponents from "./Subject/SubjectComponents";
import SemesterComponents from "./Semester/SemesterComponents";
import TagsManagementPage from "../Management/Tags/page";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { tKey: "admin_sidebar.dashboard", defaultVi: "Bảng điều khiển", defaultEn: "Dashboard", key: "dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { tKey: "admin_sidebar.problems", defaultVi: "Bài tập", defaultEn: "Problems", key: "problem", icon: FileCode },
      { tKey: "admin_sidebar.contests", defaultVi: "Kỳ thi", defaultEn: "Contests", key: "contest", icon: Trophy },
      { tKey: "admin_sidebar.tags", defaultVi: "Nhãn bài tập", defaultEn: "Tags", key: "tags", icon: Tag },
    ],
  },
  {
    label: "Academy",
    items: [
      { tKey: "admin_sidebar.class", defaultVi: "Lớp học", defaultEn: "Class", key: "class", icon: School },
      { tKey: "admin_sidebar.subject", defaultVi: "Môn học", defaultEn: "Subject", key: "subject", icon: BookOpen },
      { tKey: "admin_sidebar.semester", defaultVi: "Học kỳ", defaultEn: "Semester", key: "semester", icon: Calendar },
    ],
  },
  {
    label: "Users & Rewards",
    items: [
      { tKey: "admin_sidebar.users", defaultVi: "Người dùng", defaultEn: "Users", key: "user", icon: Users },
      { tKey: "admin_sidebar.gamification", defaultVi: "Hệ thống điểm", defaultEn: "Gamification", key: "gamification", icon: Award },
      { tKey: "admin_sidebar.coin_package", defaultVi: "Gói xu", defaultEn: "Coin Package", key: "coin", icon: Coins },
    ],
  },
  {
    label: "Business",
    items: [
      { tKey: "admin_sidebar.package", defaultVi: "Gói dịch vụ", defaultEn: "Package", key: "package", icon: Package },
      { tKey: "admin_sidebar.notification", defaultVi: "Thông báo", defaultEn: "Notification", key: "notification", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { tKey: "admin_sidebar.moderation", defaultVi: "Kiểm duyệt & Báo cáo", defaultEn: "Moderation", key: "moderation", icon: Shredder },
      { tKey: "admin_sidebar.settings", defaultVi: "Cài đặt", defaultEn: "Settings", key: "settings", icon: Settings },
    ],
  },
];

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");
  const { t, language } = useTranslation();

  const pages: Record<string, JSX.Element> = {
    dashboard: <DasboardPage />,
    problem: <ProblemManagementPage />,
    contest: <ContestManagementPage />,
    user: <UserManagerPage />,
    gamification: <GamificationManagementPage />,
    moderation: <ModerationManagementPage />,
    notification: <NotificationManagementPage />,
    package: <PracticePackagePage />,
    coin: <PracticePackagePage />,
    class: <ClassComponents />,
    subject: <SubjectComponents />,
    semester: <SemesterComponents />,
    tags: <TagsManagementPage />,
    settings: <div className="text-white">Settings</div>,
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]" style={{ background: "#0E1420" }}>
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className="w-60 shrink-0 flex flex-col overflow-y-auto"
        style={{
          background: "#06090F",
          borderRight: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Nav groups */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {/* Group label */}
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/20 px-3 mb-1.5">
                {group.label}
              </p>

              {/* Group items */}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const active = page === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setPage(item.key)}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left w-full group opacity-0 animate-fade-in-right"
                      style={{
                        animationFillMode: "both",
                        animationDelay: `${index * 40}ms`,
                        background: active
                          ? "linear-gradient(135deg, rgba(59,91,255,0.2) 0%, rgba(155,59,255,0.1) 100%)"
                          : "transparent",
                        boxShadow: active ? "inset 0 0 0 1px rgba(59,91,255,0.25)" : "none",
                      }}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                          style={{ background: "linear-gradient(180deg, #3B5BFF, #9B3BFF)" }}
                        />
                      )}

                      {/* Icon */}
                      <Icon
                        size={17}
                        className="shrink-0 transition-colors duration-200"
                        style={{
                          color: active ? "#7B9FFF" : "rgba(255,255,255,0.35)",
                        }}
                      />

                      {/* Label */}
                      <span
                        className="text-[13px] font-semibold truncate transition-colors duration-200"
                        style={{
                          color: active ? "#E0E8FF" : "rgba(255,255,255,0.45)",
                        }}
                      >
                        {t(item.tKey) || (language === "vi" ? item.defaultVi : item.defaultEn)}
                      </span>

                      {/* Chevron on hover */}
                      {active && (
                        <ChevronRight
                          size={13}
                          className="ml-auto shrink-0"
                          style={{ color: "rgba(123,159,255,0.5)" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/[0.05]">
          <p className="text-[10px] font-medium text-white/15 text-center uppercase tracking-widest">
            TMOJ Admin Panel
          </p>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-white custom-scrollbar"
        style={{ background: "#0E1420" }}
      >
        {pages[page]}
      </main>
    </div>
  );
}