"use client";
import React from "react";
import { Listbox, ListboxItem } from "@heroui/react";
import {
  LayoutDashboard,
  FileCode,
  Trophy,
  Settings,
  Users,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#071739] transition-colors duration-500">
      {/* Sidebar */}
      <div className="w-[260px] shrink-0 border-r border-gray-200 dark:border-[#474F5D] p-6 flex flex-col gap-8 bg-white dark:bg-[#071739]">
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic">
          Teacher<span className="text-[#FFB800]">.</span>
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
                  ? "bg-black dark:bg-[#FFB800] text-white dark:text-[#071739] font-black shadow-lg shadow-[#FFB800]/20"
                  : "text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-[#333A45]"
              }`}
            >
              <span className="text-sm font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </ListboxItem>
          ))}
        </Listbox>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
