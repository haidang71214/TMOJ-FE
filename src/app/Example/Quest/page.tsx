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
      // Trả lại màu Blue rực rỡ
      icon: (
        <Network
          size={40}
          strokeWidth={2.5}
          className="text-blue-500 dark:text-blue-400"
        />
      ),
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Database",
      levels: "5 Levels",
      // Trả lại màu Emerald (Xanh lá) rực rỡ
      icon: (
        <Database
          size={40}
          strokeWidth={2.5}
          className="text-emerald-500 dark:text-emerald-400"
        />
      ),
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "System & Software Design",
      levels: "5 Levels",
      // Trả lại màu Rose/Pink rực rỡ
      icon: (
        <PencilRuler
          size={40}
          strokeWidth={2.5}
          className="text-rose-500 dark:text-rose-400"
        />
      ),
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
    },
    {
      title: "Mathematics",
      levels: "7 Levels",
      // Trả lại màu Orange rực rỡ
      icon: (
        <Calculator
          size={40}
          strokeWidth={2.5}
          className="text-orange-500 dark:text-orange-400"
        />
      ),
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans flex relative overflow-hidden transition-colors duration-500">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
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
        className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-xl text-slate-400 hover:text-[#FF5C00] transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 3. MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen  p-8 lg:p-14">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center gap-16">
          {/* Header Section */}
          <section className="w-full flex flex-col items-center pt-8 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#FF5C00]/20 blur-3xl rounded-full scale-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="w-32 h-32 bg-white dark:bg-[#1C2737] border border-slate-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-500 relative z-10">
                <Mountain
                  size={64}
                  className="text-[#071739] dark:text-white group-hover:text-[#FF5C00] transition-colors"
                  strokeWidth={2}
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-7xl font-black text-[#071739] dark:text-white tracking-tighter uppercase leading-none italic">
                TMOJ <span className="text-[#FF5C00]">QUEST</span>
              </h1>
              <div className="flex items-center gap-4 justify-center">
                <div className="h-px w-12 bg-slate-300 dark:bg-white/10" />
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                  Turn practice into progress
                </p>
                <div className="h-px w-12 bg-slate-300 dark:bg-white/10" />
              </div>
            </div>
          </section>

          {/* Quest Cards Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 pb-20">
            {quests.map((item, index) => (
              <div
                key={index}
                className="group transform hover:-translate-y-2 transition-all duration-500"
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
