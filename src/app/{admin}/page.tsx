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
} from "lucide-react";


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


const NAV = [
  { name: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { name: "Problems", key: "problem", icon: FileCode },
  { name: "Contests", key: "contest", icon: Trophy },
  { name: "Users", key: "user", icon: Users },
  { name: "Settings", key: "settings", icon: Settings },
  { name: "Gamification", key: "gamification", icon: Award },
  { name: "Package", key: "package", icon: Package },
  { name: "Coin Package", key: "coin", icon: Coins },
  { name: "MODERATION & REPORT", key: "moderation", icon: Shredder },
  { name: "Notification", key: "notification", icon: Bell },
  { name: "Class", key: "class", icon: School },
  { name: "Subject", key: "subject", icon: BookOpen },
];

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");

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
    Subject:<SubjectComponents/>,
    settings: <div>Settings</div>,
  };

  return (
    <div
      className="
      min-h-screen flex
      bg-slate-100 text-slate-800
      dark:bg-gradient-to-br dark:from-[#0B0F1A] dark:via-[#120B2E] dark:to-[#05010F]
      dark:text-slate-200
    "
    >
      {/* SIDEBAR */}
      <aside
        className="
        w-64 p-6 border-r
        bg-white border-slate-200
        dark:bg-white/5 dark:border-white/10 dark:backdrop-blur-xl
      "
      >

        <nav className="flex flex-col gap-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                ${
                  active
                    ? "bg-indigo-100 text-indigo-700 dark:bg-gradient-to-r dark:from-cyan-400/20 dark:to-fuchsia-500/20 dark:text-cyan-600 shadow"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-cyan-300"
                }
              `}
              >
                <Icon size={20} />
                <span className="text-sm font-bold tracking-wide">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header
          className="
          h-16 px-8 flex items-center justify-between
          border-b bg-white border-slate-200
          dark:bg-black/30 dark:border-white/10 dark:backdrop-blur
        "
        >
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            system / admin
          </span>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-black">
              A
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-10">
          <div
            className="
            rounded-2xl p-8
            bg-white border border-slate-200 shadow-lg
            dark:bg-black/40 dark:border-white/10 dark:backdrop-blur-xl
            dark:shadow-[0_0_40px_rgba(34,211,238,0.15)]
          "
          >
            {pages[page]}
          </div>
        </main>
      </div>
    </div>
  );
}