"use client";
import SettingsSidebar from "@/Provider/SettingSlidebar";
import Image from "next/image";
import { Card, CardBody } from "@heroui/react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative custom-scrollbar">
      {/* ===== HEADER LAYER (NAVY BASE) ===== */}
      <div className="relative z-0 h-72 bg-[#071739] overflow-hidden">
        {/* Dải trang trí màu cam đặc trưng của hệ thống */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF5C00] opacity-10 skew-x-12 translate-x-20" />

        <div className="max-w-7xl mx-auto px-10 h-full flex items-center gap-8">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-[#FF5C00] shadow-2xl transition-all group-hover:scale-105 duration-300">
              <Image
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                alt="avatar"
                fill
                className="object-cover"
              />
            </div>
            {/* Chấm tròn trạng thái - Đã đổi sang màu Xanh Lá cho "Pro" */}
            <div className="absolute -bottom-2 -right-2 bg-[#00FF41] w-8 h-8 rounded-full border-4 border-[#071739] shadow-lg animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter text-white leading-none">
                Đăng <span className="text-[#FF5C00]">Hải</span>
              </h1>
              {/* PRO MEMBER Badge - Đã đổi sang màu Xanh Lá */}
              <div className="bg-[#00FF41]/10 backdrop-blur-md px-3 py-1 rounded-lg border border-[#00FF41]/20">
                <span className="text-[#00FF41] text-[10px] font-[1000] uppercase tracking-widest italic">
                  PRO MEMBER
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                LeetCode ID: <span className="text-white">yMXnOfMOzd</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT LAYER ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-10 -mt-12 pb-20">
        <div className="flex flex-col md:flex-row gap-10">
          <aside className="w-full md:w-72 shrink-0">
            <div className="sticky top-24">
              <SettingsSidebar />
            </div>
          </aside>

          <main className="flex-1">
            <Card className="bg-white dark:bg-[#0A0F1C] border-none rounded-[3rem] shadow-2xl overflow-visible">
              <CardBody className="p-4 md:p-8">{children}</CardBody>
            </Card>
          </main>
        </div>
      </div>

      {/* Global CSS điều khiển tương tác */}
      <style jsx global>{`
        /* LIGHT MODE: Tương tác màu Blue */
        .group:hover {
          background-color: rgba(37, 99, 235, 0.05);
        }
        .group:hover .transition-colors {
          color: #2563eb !important;
        }
        .group button:hover {
          background-color: #2563eb !important;
          color: white !important;
        }

        /* DARK MODE: Tương tác màu Green */
        .dark .group:hover {
          background-color: rgba(0, 255, 65, 0.05);
        }
        .dark .group:hover .transition-colors {
          color: #00ff41 !important;
        }
        .dark .group button:hover {
          background-color: #00ff41 !important;
          color: #071739 !important;
        }

        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00ff41;
        }
      `}</style>
    </div>
  );
}
