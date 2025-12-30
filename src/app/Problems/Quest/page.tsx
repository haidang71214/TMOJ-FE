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
      icon: <Network size={40} className="text-blue-500 dark:text-blue-400" />,
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Database",
      levels: "5 Levels",
      icon: (
        <Database
          size={40}
          className="text-emerald-500 dark:text-emerald-400"
        />
      ),
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "System & Software Design",
      levels: "5 Levels",
      icon: (
        <PencilRuler size={40} className="text-rose-400 dark:text-rose-400" />
      ),
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
    },
    {
      title: "Maths",
      levels: "7 Levels",
      icon: (
        <Calculator
          size={40}
          className="text-orange-400 dark:text-orange-400"
        />
      ),
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#101828] font-sans flex transition-colors duration-500">
      {/* SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-gray-100 dark:border-[#1c2737] bg-white dark:bg-[#1c2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6">
          <Sidebar />
        </div>
      </aside>

      {/* NỘI DUNG VÀ NÚT TOGGLE */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="absolute top-24 -left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 bg-white dark:bg-[#1c2737] border border-gray-200 dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-gray-500 dark:text-white hover:text-blue-500 dark:hover:text-[#E3C39D] hover:scale-110 transition-all cursor-pointer"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        <div className="w-full overflow-y-auto h-screen custom-scrollbar">
          <div className="max-w-[1200px] mx-auto p-6 flex flex-col items-center">
            {/* Header Section */}
            <div className="w-full flex flex-col items-center pt-12 pb-16 gap-6">
              <div className="relative group">
                {/* Hiệu ứng hào quang phía sau icon núi */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent dark:from-[#E3C39D]/10 opacity-50 -z-10 scale-[2] blur-xl rounded-full" />

                <div className="w-28 h-28 bg-white dark:bg-[#1c2737] border dark:border-[#344054] rounded-[2.5rem] shadow-xl dark:shadow-2xl flex items-center justify-center text-6xl transform rotate-3 group-hover:rotate-0 transition-all duration-500 ease-out cursor-default">
                  🏔️
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-5xl font-black text-[#262626] dark:text-white tracking-tight uppercase">
                  TMOJ{" "}
                  <span className="text-[#A68868] dark:text-[#E3C39D]">
                    Quest
                  </span>
                </h1>
                <p className="text-gray-400 dark:text-[#94a3b8] font-bold mt-3 text-xl italic opacity-80">
                  &ldquo;Turn practice into progress&rdquo;
                </p>
              </div>
            </div>

            {/* Quest Cards Grid */}
            <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-10 px-4 pb-20">
              {quests.map((item, index) => (
                <div
                  key={index}
                  className="transform hover:-translate-y-2 transition-all duration-300"
                >
                  <QuestCard {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
