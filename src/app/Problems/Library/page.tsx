"use client";
import "./hehe.css";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { QuestBanners } from "./QuestBanners";

import { ProblemsTable } from "./ProblemsTable";
import { CalendarSidebar } from "./CalendarSidebar";
import { Input, Button, Progress } from "@heroui/react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetProblemListQuery } from "@/store/queries/ProblemPublic";

export default function LibraryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State cho Like (trái tim)
  const [likedProblems, setLikedProblems] = useState<Set<string>>(new Set());

  const toggleLike = (problemId: string) => {
    setLikedProblems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const { data: problemResponse, isLoading } = useGetProblemListQuery();
  const problems = problemResponse?.data || [];
  console.log("aaaa" , problemResponse);
  
  return (
    <div className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans text-[#071739] dark:text-[#F9FAFB] flex relative transition-colors duration-500 ">
      {/* SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-[#A4B5C4] dark:border-[#1C2737] bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* NÚT TOGGLE SIDEBAR */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ left: isSidebarOpen ? "244px" : "12px" }}
          className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-[#4B6382] dark:text-[#98A2B3] hover:text-[#071739] dark:hover:text-[#FFB800] transition-all duration-300 cursor-pointer hover:scale-110"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        <div className="overflow-y-auto custom-scrollbar dark:bg-[#101828]">
          <div className="max-w-[1400px] mx-auto p-8 lg:p-12 flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 flex flex-col gap-8 w-full min-w-0">
              <QuestBanners />

              {/* TOPIC BUTTONS */}
              <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
                {[
                  "All Topics",
                  "Algorithms",
                  "Database",
                  "Shell",
                  "Concurrency",
                  "JavaScript",
                ].map((t, i) => (
                  <Button
                    key={t}
                    size="sm"
                    className={`text-[12px] rounded-xl h-10 px-5 font-black uppercase tracking-widest transition-all ${
                      i === 0
                        ? "bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#101828] shadow-lg shadow-[#FFB800]/20"
                        : "bg-white dark:bg-[#1C2737] text-gray-500 dark:text-[#98A2B3] hover:bg-gray-100 dark:hover:bg-[#344054] hover:text-[#071739] dark:hover:text-white border border-transparent dark:border-[#344054]/50"
                    }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>

              {/* FILTER & SEARCH ROW */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-3 w-full md:w-auto">
                  <Input
                    placeholder="Search questions..."
                    startContent={<Search size={18} className="text-gray-400 dark:text-[#667085]" />}
                    className="w-full md:w-[320px]"
                    classNames={{
                      inputWrapper:
                        "bg-white dark:bg-[#1C2737] border-2 border-transparent focus-within:!border-[#FFB800] transition-all rounded-2xl h-12 shadow-sm",
                      input: "dark:text-white font-medium",
                    }}
                    variant="flat"
                  />
                  <Button
                    isIconOnly
                    className="bg-white dark:bg-[#1C2737] text-[#4B6382] dark:text-white rounded-2xl h-12 w-12 shadow-sm border border-transparent dark:border-[#344054]"
                  >
                    <Filter size={20} />
                  </Button>
                  <Button
                    className="bg-white dark:bg-[#1C2737] font-black uppercase text-[10px] tracking-widest text-[#4B6382] dark:text-white px-6 rounded-2xl h-12 shadow-sm border border-transparent dark:border-[#344054]"
                    startContent={<ArrowUpDown size={16} />}
                  >
                    Sort
                  </Button>
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-white/40 dark:bg-[#1C2737]/30 p-4 rounded-2xl border border-[#A4B5C4]/10">
                  <div className="flex flex-col items-end w-40 text-right">
                    <span className="text-[10px] font-black text-[#4B6382] dark:text-[#FFB800] uppercase tracking-widest leading-none mb-2">
                      6 / 3829 Solved
                    </span>
                    <Progress
                      aria-label="Solved progress"
                      size="sm"
                      value={(6 / 3829) * 100}
                      classNames={{
                        indicator: "bg-green-500 dark:bg-[#FFB800]",
                        track: "bg-gray-200 dark:bg-[#101828]",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* TABLE AREA */}
              <div className="bg-white dark:bg-[#1C2737] rounded-[2.5rem] shadow-xl border border-transparent dark:border-[#344054]/50 overflow-hidden transition-all duration-300 p-4 min-h-[400px]">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center p-20 text-gray-400 dark:text-[#98A2B3] font-medium animate-pulse">
                    Loading problems...
                  </div>
                ) : problems.length > 0 ? (
                  <ProblemsTable
                    problems={problems}
                    likedProblems={likedProblems}
                    toggleLike={toggleLike}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-20 text-gray-400 dark:text-[#98A2B3] font-medium">
                    No problems found.
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR PHẢI */}
            <div className="sticky top-10 flex flex-col gap-6">
              <CalendarSidebar />
              <div className="flex justify-center opacity-20 italic font-black uppercase text-[10px] tracking-[0.5em] dark:text-white mt-4">
                TMOJ &bull; 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}