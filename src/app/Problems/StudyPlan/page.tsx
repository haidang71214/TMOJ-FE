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
    <main className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans flex relative overflow-hidden transition-colors duration-500">
      {/* 1. LEFT SIDEBAR - Đồng bộ màu #1C2737 */}
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

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-y-auto p-8 lg:p-12 text-[#071739] dark:text-[#F9FAFB]">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-12">
          {/* Header Section */}
          <div className="flex justify-between items-end w-full border-b border-[#A4B5C4]/30 dark:border-[#344054]/50 pb-8">
            <div className="space-y-1">
              <h1 className="text-5xl font-black dark:text-white tracking-tighter uppercase italic leading-none">
                Study{" "}
                <span className="text-[#A68868] dark:text-[#FFB800]">Plan</span>
              </h1>
              <p className="text-[#4B6382] dark:text-[#98A2B3] font-bold italic opacity-70">
                Strategic learning paths to master coding interviews.
              </p>
            </div>
            <Button
              size="md"
              className="bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#101828] font-black px-6 rounded-xl uppercase tracking-widest shadow-lg shadow-[#FFB800]/10 hover:scale-105 transition-all"
              endContent={<ChevronRight size={18} />}
            >
              My Dashboard
            </Button>
          </div>

          {/* Section: Featured Plans */}
          <section className="flex flex-col gap-8">
            <h2 className="text-xl font-black dark:text-[#F9FAFB] uppercase tracking-[0.3em] flex items-center gap-4 italic">
              <Sparkles
                size={20}
                className="text-[#A68868] dark:text-[#FFB800]"
              />
              Featured Plans
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <PlanCard
                title="TMOJCode 75"
                desc="Ace Interview with 75 Qs"
                bgGradient="bg-gradient-to-br from-[#1e293b] to-[#0f172a]"
                icon={
                  <Target size={80} className="text-[#FFB800] opacity-20" />
                }
              />
              <PlanCard
                title="Top Interview 150"
                desc="Essential Interview Prep"
                bgGradient="bg-gradient-to-br from-[#134e4a] to-[#064e3b]"
                icon={
                  <MessageSquareText
                    size={80}
                    className="text-[#E3C39D] opacity-20"
                  />
                }
              />
              <PlanCard
                title="Binary Search"
                desc="Master BS in 42 Qs"
                bgGradient="bg-gradient-to-br from-[#4c1d95] to-[#2e1065]"
                icon={
                  <Filter size={80} className="text-purple-400 opacity-20" />
                }
              />
              <PlanCard
                title="SQL 50"
                desc="Crack SQL in 50 Qs"
                bgGradient="bg-gradient-to-br from-[#164e63] to-[#083344]"
                icon={
                  <Database size={80} className="text-cyan-400 opacity-20" />
                }
              />
            </div>
          </section>

          {/* Section: 30 Days Challenge */}
          <section className="flex flex-col gap-8">
            <h2 className="text-xl font-black dark:text-[#F9FAFB] uppercase tracking-[0.3em] flex items-center gap-4 italic">
              <div className="w-8 h-[3px] bg-[#A68868] dark:bg-[#FFB800] rounded-full" />
              30 Days Challenge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ListCard
                title="30 Days of Pandas"
                desc="Essential for data interviews"
                image="/pandas-icon.png"
                className="shadow-xl rounded-[2.5rem]"
              />
              <ListCard
                title="30 Days of JavaScript"
                desc="Master JS basics in 30 Qs"
                image="/js-icon.png"
                className="shadow-xl rounded-[2.5rem]"
              />
            </div>
          </section>

          {/* Section: Cracking Coding Interview */}
          <section className="pb-20 flex flex-col gap-8">
            <h2 className="text-xl font-black dark:text-[#F9FAFB] uppercase tracking-[0.3em] flex items-center gap-4 italic">
              <div className="w-8 h-[3px] bg-[#A68868] dark:bg-[#FFB800] rounded-full" />
              Cracking Interview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ListCard
                title="Top Interview 150"
                desc="Must-do List for Prep"
                image="/top150.png"
                className="shadow-xl rounded-[2.5rem]"
              />
              <ListCard
                title="TMOJCode 75"
                desc="Ace Interview with 75 Qs"
                image="/75.png"
                className="shadow-xl rounded-[2.5rem]"
              />
              <ListCard
                title="Top 100 Liked"
                desc="100 Best Rated Problems"
                image="/liked.png"
                className="shadow-xl rounded-[2.5rem]"
              />
              <ListCard
                title="SQL 50"
                desc="Crack SQL Interview"
                image="/sql.png"
                className="shadow-xl rounded-[2.5rem]"
              />
              <ListCard
                title="Premium Algo 100"
                desc="TMOJ Staff Pick"
                image="/algo.png"
                isLocked
                className="shadow-xl rounded-[2.5rem]"
              />
              <ListCard
                title="Advanced SQL 50"
                desc="50 Advanced Problems"
                image="/adv-sql.png"
                isLocked
                className="shadow-xl rounded-[2.5rem]"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
