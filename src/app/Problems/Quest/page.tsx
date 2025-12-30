"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { QuestCard } from "./QuestCard";
import {
  Network,
  Database,
  PencilRuler,
  Calculator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function QuestPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <main className="min-h-screen bg-[#f7f8fa] font-sans flex">
      {/* SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-gray-100 bg-white sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6">
          <Sidebar />
        </div>
      </aside>

      {/* NỘI DUNG VÀ NÚT TOGGLE */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* NÚT TOGGLE - Vị trí top-24 (Cao hơn) */}
        <div className="absolute top-24 -left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:text-blue-500 hover:scale-110 transition-all cursor-pointer"
            title={isSidebarOpen ? "Collapse menu" : "Expand menu"}
          >
            {isSidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        <div className="w-full overflow-y-auto h-screen">
          <div className="max-w-[1200px] mx-auto p-6 flex flex-col items-center">
            {/* Header Section */}
            <div className="w-full flex flex-col items-center pt-12 pb-16 gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#f7f8fa] to-transparent opacity-50 -z-10 scale-150" />
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

            {/* Quest Cards Grid */}
            <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-20">
              {quests.map((item, index) => (
                <QuestCard key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
