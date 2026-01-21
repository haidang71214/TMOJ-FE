"use client";
import React, { useState, useEffect } from "react";
import { Listbox, ListboxItem } from "@heroui/react";
import {
  LayoutDashboard,
  FileCode,
  Trophy,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Đảm bảo chỉ render sau khi đã mount để tránh lỗi Hydration ID của Listbox
  useEffect(() => {
    setMounted(true);
  }, []);

  const menu = [
    {
      key: "Dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { key: "Problem", label: "Problem", icon: <FileCode size={20} /> },
    { key: "Contest", label: "Contest", icon: <Trophy size={20} /> },
    { key: "Class", label: "Class", icon: <Users size={20} /> },
    { key: "Settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] transition-colors duration-500 relative">
      {/* SIDEBAR TOGGLE BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-[60] w-8 h-8 bg-white dark:bg-[#1C2737] border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-xl text-[#4B6382] dark:text-[#98A2B3] hover:text-[#FF5C00] transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`shrink-0 border-r border-slate-200 dark:border-white/5 flex flex-col gap-8 bg-white dark:bg-[#1C2737] shadow-xl z-50 transition-all duration-300 ease-in-out sticky top-0 h-screen overflow-hidden
          ${isSidebarOpen ? "w-[260px] p-6" : "w-0 p-0 border-none"}`}
      >
        <div className="w-[212px]">
          <h1 className="text-3xl font-black text-[#071739] dark:text-white uppercase tracking-tighter italic mb-8">
            Teacher<span className="text-[#FF5C00]">.</span>
          </h1>
          <Listbox
            aria-label="Admin Menu"
            onAction={(key) => router.push(`/Management/${key}`)}
            className="p-0 gap-2"
          >
            {menu.map((item) => (
              <ListboxItem
                key={item.key}
                startContent={item.icon}
                className={`h-12 rounded-2xl px-4 transition-all ${
                  pathname.includes(item.key)
                    ? "bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-white font-black shadow-lg shadow-orange-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#FF5C00] dark:hover:text-white"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider">
                  {item.label}
                </span>
              </ListboxItem>
            ))}
          </Listbox>
        </div>
      </aside>

      {/* 4. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-[#CDD5DB] dark:bg-[#101828]">
        {children}
      </div>
    </div>
  );
}
