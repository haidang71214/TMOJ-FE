"use client";
import React from "react";
import Sidebar from "../Sidebar";
import { QuestCard } from "./QuestCard";
// Import các icon phù hợp từ lucide-react hoặc dùng hình ảnh/svg
import { Network, Database, PencilRuler, Calculator } from "lucide-react";

export default function QuestPage() {
  const quests = [
    {
      title: "Data Structures and Algorithms",
      levels: "35 Levels",
      icon: <Network size={40} className="text-blue-500" />,
      iconBg: "bg-blue-50",
    },
    {
      title: "Database",
      levels: "5 Levels",
      icon: <Database size={40} className="text-emerald-500" />,
      iconBg: "bg-emerald-50",
    },
    {
      title: "System & Software Design",
      levels: "5 Levels",
      icon: <PencilRuler size={40} className="text-rose-400" />,
      iconBg: "bg-rose-50",
    },
    {
      title: "Maths",
      levels: "7 Levels",
      icon: <Calculator size={40} className="text-orange-400" />,
      iconBg: "bg-orange-50",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fa] font-sans">
      <div className="max-w-[1450px] mx-auto p-6 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar giữ nguyên từ Library */}
        <Sidebar />

        <div className="flex-1 w-full flex flex-col items-center">
          {/* Header Section: Hình ảnh quả núi và tên Quest */}
          <div className="w-full flex flex-col items-center pt-12 pb-16 gap-6">
            <div className="relative">
              {/* Background trang trí dạng núi mờ phía sau */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#f7f8fa] to-transparent opacity-50 -z-10 scale-150" />

              {/* Icon Núi/Cờ ở trung tâm */}
              <div className="w-28 h-28 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-6xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                🏔️
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-[#262626] tracking-tight">
                TMOJ Quest
              </h1>
              <p className="text-gray-400 font-medium mt-2 text-lg italic">
                Turn practice into progress
              </p>
            </div>
          </div>

          {/* Quest Cards Grid: Chia 2 cột */}
          <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {quests.map((item, index) => (
              <QuestCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
