"use client";
import React, { useState, useEffect } from "react";
import { Listbox, ListboxItem } from "@heroui/react";
import {
  LayoutDashboard,
  FileCode,
  Trophy,
  Settings,
  Users,
  GraduationCap,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Library,
  Database,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [activeKey, setActiveKey] = useState<string>("");

  const { t, language } = useTranslation();
  const { data: user } = useGetUserInformationQuery();
  const isManagerOrAdmin = user?.role?.toLowerCase() === "manager" || user?.role?.toLowerCase() === "admin";

  const menu = [
    { key: "Dashboard", label: t('sidebar.dashboard') || (language === 'vi' ? "Bảng Điều Khiển" : "Dashboard"), icon: <LayoutDashboard size={20} /> },
    { key: "Problem", label: t('sidebar.problem') || (language === 'vi' ? "Bài Tập" : "Problem"), icon: <FileCode size={20} /> },
    { key: "Contest", label: t('sidebar.contest') || (language === 'vi' ? "Kỳ Thi" : "Contest"), icon: <Trophy size={20} /> },
    ...(isManagerOrAdmin ? [{ key: "Class", label: t('sidebar.class') || (language === 'vi' ? "Lớp Học" : "Class"), icon: <Users size={20} /> }] : []),
    ...(isManagerOrAdmin ? [{ key: "Teacher", label: t('sidebar.teacher') || (language === 'vi' ? "Giáo Viên" : "Teacher"), icon: <GraduationCap size={20} /> }] : []),
    { key: "Subject", label: t('sidebar.subject') || (language === 'vi' ? "Môn Học" : "Subject"), icon: <BookOpenCheck size={20} /> },
    { key: "StudyPlan", label: t('sidebar.studyPlan') || (language === 'vi' ? "Lộ Trình Học" : "Study Plan"), icon: <Library size={20} /> },
    { key: "Bank", label: t('sidebar.bankProblem') || (language === 'vi' ? "Ngân Hàng Bài Tập" : "Bank Problem"), icon: <Database size={20} /> },
    { key: "Settings", label: t('sidebar.settings') || (language === 'vi' ? "Cài Đặt" : "Settings"), icon: <Settings size={20} /> },
    ...(isManagerOrAdmin ? [{ key: "Semester", label: t('sidebar.semester') || (language === 'vi' ? "Học Kỳ" : "Semester"), icon: <Calendar size={20} /> }] : []),
    { key: "Tags", label: t('sidebar.tags') || (language === 'vi' ? "Nhãn" : "Tags"), icon: <Tag size={20} /> }
  ];

  // Đảm bảo chỉ render sau khi đã mount để tránh lỗi Hydration ID của Listbox
  useEffect(() => {
    setMounted(true);
  }, []);

  // Thay đổi màu ngay khi được click (hoặc đồng bộ nếu thay đổi via URL)
  useEffect(() => {
    const matchingItem = menu.find(item => pathname.startsWith(`/Management/${item.key}`));
    if (matchingItem) {
      setActiveKey(matchingItem.key);
    }
  }, [pathname]);

  // Bảo vệ route: Nếu user là student thì đá ra ngoài
  useEffect(() => {
    if (user && user.role?.toLowerCase() === "student") {
      router.push("/");
    }
  }, [user, router]);

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
            {user?.role?.toLowerCase() === "teacher" ? "Teacher Manager" : "Manager"} <span className="text-[#FF5C00]">.</span>
          </h1>
          <Listbox
            aria-label="Admin Menu"
            onAction={(key) => {
              setActiveKey(key as string);
              router.push(`/Management/${key}`);
            }}
            className="p-0 gap-2"
          >
            {menu.map((item, index) => (
              <ListboxItem
                key={item.key}
                startContent={item.icon}
                className={`relative h-12 rounded-2xl px-4 transition-all opacity-0 animate-fade-in-right overflow-hidden
                  ${
                  activeKey === item.key
                    ? "bg-[#071739] data-[hover=true]:bg-[#071739] dark:bg-[#FF5C00] dark:data-[hover=true]:bg-[#FF5C00] text-white data-[hover=true]:text-white font-black shadow-lg shadow-orange-500/20 opacity-100 data-[hover=true]:opacity-100"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 data-[hover=true]:bg-slate-100 dark:hover:bg-[#FF5C00] dark:data-[hover=true]:bg-[#FF5C00] dark:hover:text-white dark:data-[hover=true]:text-white"
                } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[3px] after:w-0 hover:after:w-3/4 after:bg-[#FF5C00] after:transition-all after:duration-300`}
                style={{ animationFillMode: 'both', animationDelay: `${index * 60 + 100}ms` }}
              >
                <span className="text-sm font-bold uppercase tracking-wider">
                  {item.label}
                </span>
              </ListboxItem>
            ))}
          </Listbox>
        </div>
      </aside>

      {/*4.  MAIN CONTENT AREA  */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="flex-1 p-10 lg:p-14 w-full">{children}</div>
      </main>
    </div>
  );
}
