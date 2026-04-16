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


const NAV = [
  { name: "Dashboard", tKey: "admin_sidebar.dashboard", defaultVi: "Bảng điều khiển", defaultEn: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { name: "Problems", tKey: "admin_sidebar.problems", defaultVi: "Bài tập", defaultEn: "Problems", key: "problem", icon: FileCode },
  { name: "Contests", tKey: "admin_sidebar.contests", defaultVi: "Kỳ thi", defaultEn: "Contests", key: "contest", icon: Trophy },
  { name: "Users", tKey: "admin_sidebar.users", defaultVi: "Người dùng", defaultEn: "Users", key: "user", icon: Users },
  { name: "Settings", tKey: "admin_sidebar.settings", defaultVi: "Cài đặt", defaultEn: "Settings", key: "settings", icon: Settings },
  { name: "Gamification", tKey: "admin_sidebar.gamification", defaultVi: "Hệ thống điểm", defaultEn: "Gamification", key: "gamification", icon: Award },
  { name: "Package", tKey: "admin_sidebar.package", defaultVi: "Gói dịch vụ", defaultEn: "Package", key: "package", icon: Package },
  { name: "Coin Package", tKey: "admin_sidebar.coin_package", defaultVi: "Gói xu", defaultEn: "Coin Package", key: "coin", icon: Coins },
  { name: "MODERATION & REPORT", tKey: "admin_sidebar.moderation", defaultVi: "Kiểm duyệt & Báo cáo", defaultEn: "MODERATION & REPORT", key: "moderation", icon: Shredder },
  { name: "Notification", tKey: "admin_sidebar.notification", defaultVi: "Thông báo", defaultEn: "Notification", key: "notification", icon: Bell },
  { name: "Class", tKey: "admin_sidebar.class", defaultVi: "Lớp học", defaultEn: "Class", key: "class", icon: School },
  { name: "Subject", tKey: "admin_sidebar.subject", defaultVi: "Môn học", defaultEn: "Subject", key: "subject", icon: BookOpen },
  { name: "Semester", tKey: "admin_sidebar.semester", defaultVi: "Học kỳ", defaultEn: "Semester", key: "semester", icon: Calendar },
  { name: "Tags", tKey: "admin_sidebar.tags", defaultVi: "Nhãn bài tập", defaultEn: "Tags", key: "tags", icon: Tag },
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
    class:<ClassComponents/>,
    subject:<SubjectComponents/>,
    semester:<SemesterComponents/>,
    tags: <TagsManagementPage />,
    settings: <div>Settings</div>,
  };

  return (
    <div
      className="
      min-h-screen flex
      bg-[#F0F2F5] transition-colors duration-500 relative
      text-[#071739]
    "
    >
      {/* SIDEBAR */}
      <aside
        className="
        w-64 p-6 border-r
        bg-white border-slate-200 overflow-y-auto shadow-xl z-50
      "
      >

        <nav className="flex flex-col gap-2">
          {NAV.map((item, index) => {
            const Icon = item.icon;
            const active = page === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`
                  relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all opacity-0 animate-fade-in-right active-bump overflow-hidden
                  ${
                    active
                      ? "bg-[#071739] text-white font-black shadow-lg shadow-[#071739]/30"
                      : "text-slate-500 hover:bg-slate-100"
                  }
                  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[3px] after:w-0 hover:after:w-[70%] after:bg-[#FF5C00] after:transition-all after:duration-300
                `}
                style={{ animationFillMode: 'both', animationDelay: `${index * 60 + 100}ms` }}
              >
                <Icon size={20} className="shrink-0" />
                <span className="text-sm font-bold tracking-wide truncate">
                  {t(item.tKey) || (language === "vi" ? item.defaultVi : item.defaultEn)}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* CONTENT */}
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          {pages[page]}
        </main>
      </div>
    </div>
  );
}