"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { PlanCard } from "./PlanCard";
import { ListCard } from "./ListCard";
import { Button } from "@heroui/react";
import {
  Target,
  MessageSquareText,
  Filter,
  Database,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export default function StudyPlanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // Thẻ main bao quát toàn bộ chiều cao tối thiểu của trình duyệt
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans flex relative transition-colors duration-500">
      {/* 1. SIDEBAR: Giữ sticky top-0 h-screen để luôn bám theo khi cuộn Main Content */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      {/* 2. TOGGLE BUTTON: Dùng fixed để luôn nằm ở vị trí dễ bấm */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-xl text-slate-400 hover:text-[#FF5C00] transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 3. MAIN CONTENT: Bỏ h-screen và overflow-y-auto để cuộn tự nhiên theo thẻ main */}
      <div className="flex-1 min-w-0 relative">
        {/* Container bên trong quy định Padding toàn cục, quan trọng nhất là pb-24 hoặc pb-32 */}
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-16 p-8 lg:p-14 lg:pb-32">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full border-b border-slate-200 dark:border-white/10 pb-10 gap-6">
            <div className="space-y-3">
              <h1 className="text-6xl font-black text-[#071739] dark:text-white tracking-tighter uppercase leading-none">
                STUDY <span className="text-[#FF5C00]">PLAN</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  Strategic learning paths to master coding interviews.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-14 px-8 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
              endContent={<ChevronRight size={18} strokeWidth={3} />}
            >
              My Learning Dashboard
            </Button>
          </div>

          {/* Featured Plans */}
          <section className="flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#FF5C00]/10 rounded-xl">
                <Sparkles
                  size={24}
                  className="text-[#FF5C00]"
                  strokeWidth={2.5}
                />
              </div>
              <h2 className="text-2xl font-black text-[#071739] dark:text-white uppercase tracking-tighter">
                FEATURED <span className="text-slate-400">PLANNING</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <PlanCard
                title="TMOJCode 75"
                desc="Ace Interview with 75 Qs"
                bgGradient="bg-gradient-to-br from-[#071739] to-[#1e293b]"
                className="rounded-[2.5rem] shadow-2xl border border-white/5 h-48"
                icon={
                  <Target size={80} className="text-[#FF5C00] opacity-20" />
                }
              />
              <PlanCard
                title="Interview 150"
                desc="Essential Interview Prep"
                bgGradient="bg-gradient-to-br from-[#134e4a] to-[#064e3b]"
                className="rounded-[2.5rem] shadow-2xl border border-white/5 h-48"
                icon={
                  <MessageSquareText
                    size={80}
                    className="text-emerald-400 opacity-20"
                  />
                }
              />
              <PlanCard
                title="Binary Search"
                desc="Master BS in 42 Qs"
                bgGradient="bg-gradient-to-br from-[#4c1d95] to-[#2e1065]"
                className="rounded-[2.5rem] shadow-2xl border border-white/5 h-48"
                icon={
                  <Filter size={80} className="text-purple-400 opacity-20" />
                }
              />
              <PlanCard
                title="SQL Mastery"
                desc="Crack SQL in 50 Qs"
                bgGradient="bg-gradient-to-br from-[#164e63] to-[#083344]"
                className="rounded-[2.5rem] shadow-2xl border border-white/5 h-48"
                icon={
                  <Database size={80} className="text-cyan-400 opacity-20" />
                }
              />
            </div>
          </section>

          {/* Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-10">
            <section className="flex flex-col gap-8">
              <div className="flex items-center gap-4 border-l-4 border-[#FF5C00] pl-4">
                <h2 className="text-xl font-black text-[#071739] dark:text-white uppercase tracking-tighter">
                  30 DAYS <span className="text-slate-400">CHALLENGE</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <ListCard
                  title="30 Days of Pandas"
                  desc="Essential for data interviews"
                  image="/pandas-icon.png"
                  className="rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-md"
                />
                <ListCard
                  title="30 Days of JavaScript"
                  desc="Master JS basics in 30 Qs"
                  image="/js-icon.png"
                  className="rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-md"
                />
              </div>
            </section>

            <section className="flex flex-col gap-8">
              <div className="flex items-center gap-4 border-l-4 border-[#071739] dark:border-white pl-4">
                <h2 className="text-xl font-black text-[#071739] dark:text-white uppercase tracking-tighter">
                  CRACKING <span className="text-slate-400">INTERVIEW</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 max-h-[460px] pr-2 custom-scrollbar">
                <ListCard
                  title="Top Interview 150"
                  desc="Must-do List for Prep"
                  image="/top150.png"
                  className="rounded-[2rem]"
                />
                <ListCard
                  title="Premium Algo 100"
                  desc="TMOJ Staff Pick"
                  image="/algo.png"
                  isLocked
                  className="rounded-[2rem]"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
