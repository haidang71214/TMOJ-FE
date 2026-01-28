"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
} from "lucide-react";

const NAV = [
  { name: "Dashboard", path: "/Dashboard", icon: LayoutDashboard },
  { name: "Problems", path: "/Problem", icon: FileCode },
  { name: "Contests", path: "/Contest", icon: Trophy },
  { name: "Users", path: "/Users", icon: Users },
  { name: "Settings", path: "/Settings", icon: Settings },
  { name: "Gamification", path: "/Gamification", icon: Award },
  { name: "Package", path: "/Package", icon: Package },
  { name: "Coin Package", path: "/Coin", icon: Coins },
  {name:"MODERATION & REPORT", path:"/Moderation", icon: Shredder},
  { name: "Notification", path: "/Notification", icon: Bell },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [dark] = useState(true);
  const [mounted] = useState(false);

useEffect(() => {
  if (!mounted) return;

  const root = document.documentElement;

  if (dark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}, [dark, mounted]);

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
        <h1 className="text-2xl font-extrabold tracking-widest mb-10">
          <span className="text-indigo-600 dark:text-cyan-400">CYBER</span>
          <span className="text-fuchsia-500">ADMIN</span>
        </h1>

        <nav className="flex flex-col gap-2">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
