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
  Mountain,
} from "lucide-react";

export default function QuestPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const quests = [
    {
      title: "Data Structures and Algorithms",
      levels: "35 Levels",
      icon: <Network size={40} className="text-blue-500 dark:text-[#FFB800]" />,
      iconBg: "bg-blue-50 dark:bg-[#FFB800]/10",
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
    <main className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans flex relative overflow-hidden transition-colors duration-500">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-[#A4B5C4] dark:border-[#1C2737] bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      {/* 2. SIDEBAR TOGGLE BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white/80 dark:bg-[#1C2737] backdrop-blur-md border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-[#4B6382] dark:text-[#98A2B3] hover:text-[#071739] dark:hover:text-white transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 3. MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-y-auto p-8 lg:p-12 text-[#071739] dark:text-[#F9FAFB]">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center gap-12">
          {/* Header Section */}
          <section className="w-full flex flex-col items-center pt-8 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#071739]/5 dark:bg-[#FFB800]/20 blur-3xl rounded-full scale-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="w-32 h-32 bg-white dark:bg-[#1C2737] border-4 border-transparent dark:border-[#344054] rounded-[3rem] shadow-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-all duration-500 ease-out relative z-10">
                {/* Mountain Icon: Trả về màu bình thường của hệ thống */}
                <Mountain
                  size={64}
                  className="text-[#071739] dark:text-[#FFB800]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-6xl font-black text-[#071739] dark:text-white tracking-tighter uppercase italic leading-none">
                TMOJ{" "}
                <span className="text-[#A68868] dark:text-[#FFB800]">
                  Quest
                </span>
              </h1>
              <p className="text-[#4B6382] dark:text-[#98A2B3] font-bold text-xl italic opacity-70 border-y border-[#A4B5C4]/30 dark:border-[#344054]/50 py-2 inline-block px-6">
                &ldquo;Turn practice into progress&rdquo;
              </p>
            </div>
          </section>

          {/* Quest Cards Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
            {quests.map((item, index) => (
              <div
                key={index}
                className="transform hover:-translate-y-2 transition-all duration-500"
              >
                <QuestCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
