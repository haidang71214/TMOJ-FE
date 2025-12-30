"use client";
import React, { useState } from "react";
import ProblemsSidebar from "../../Sidebar";
import { ListControls } from "../ListControls";
import { CircularProgress, Button } from "@heroui/react";
import {
  Play,
  Share2,
  RotateCcw,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";

const MY_LIST_PROBLEMS = [
  {
    id: "1",
    title: "Two Sum",
    acceptance: "56.7%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "8",
    title: "String to Integer (atoi)",
    acceptance: "20.2%",
    difficulty: "Med.",
    isLocked: true,
  },
  {
    id: "15",
    title: "3Sum",
    acceptance: "34.1%",
    difficulty: "Med.",
    isLocked: false,
  },
  {
    id: "20",
    title: "Valid Parentheses",
    acceptance: "41.5%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "42",
    title: "Trapping Rain Water",
    acceptance: "62.3%",
    difficulty: "Hard",
    isLocked: true,
  },
  {
    id: "70",
    title: "Climbing Stairs",
    acceptance: "53.1%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "121",
    title: "Best Time to Buy and Sell Stock",
    acceptance: "54.2%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "146",
    title: "LRU Cache",
    acceptance: "42.1%",
    difficulty: "Med.",
    isLocked: true,
  },
];

export default function MyListDetailPage() {
  const params = useParams();
  const currentId = params.id;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="min-h-screen bg-[#F7F8FA] dark:bg-[#101828] font-sans text-[#262626] dark:text-[#F9FAFB] flex relative overflow-hidden transition-colors duration-500">
      {/* 1. SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-[#1C2737] bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <ProblemsSidebar />
        </div>
      </aside>

      {/* 2. SIDEBAR TOGGLE */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-gray-200 dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-gray-500 dark:text-white hover:text-blue-500 dark:hover:text-[#E3C39D] transition-all duration-300 cursor-pointer"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 3. NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        <div className="flex flex-1 overflow-y-auto p-6 gap-6 lg:flex-row flex-col custom-scrollbar">
          {/* CỘT TIẾN ĐỘ (Left Info Card) */}
          <div className="w-full lg:w-[320px] bg-white dark:bg-[#1C2737] rounded-[32px] border border-gray-100 dark:border-[#344054] p-8 flex flex-col items-center text-center gap-6 shadow-sm h-fit sticky top-0">
            <div className="w-20 h-20 bg-blue-50 dark:bg-[#101828] rounded-3xl flex items-center justify-center border border-blue-100 dark:border-[#4B6382] shadow-inner text-4xl">
              {currentId === "Favorite" ? "⭐" : "🗒️"}
            </div>

            <div>
              <h1 className="text-2xl font-black capitalize text-[#071739] dark:text-white tracking-tight">
                {currentId}
              </h1>
              <p className="text-gray-400 dark:text-[#94A3B8] text-sm mt-1 font-bold italic opacity-80">
                Toitapcode · {MY_LIST_PROBLEMS.length} questions
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-600 dark:bg-[#E3C39D] text-white dark:text-[#101828] font-black px-6 h-10 rounded-2xl shadow-lg shadow-blue-200/20 active:scale-95 transition-all"
                startContent={<Play size={16} fill="currentColor" />}
              >
                Practice
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-gray-50 dark:bg-[#101828] dark:text-[#94A3B8] h-10 w-10 rounded-2xl"
              >
                <Share2 size={16} />
              </Button>
            </div>

            {/* PROGRESS BOX */}
            <div className="w-full mt-2 p-6 border border-blue-50 dark:border-[#4B6382]/30 rounded-[28px] bg-blue-50/20 dark:bg-[#101828]/40 text-left">
              <div className="flex justify-between items-center text-[11px] font-black mb-5 uppercase text-blue-500 dark:text-[#E3C39D] tracking-widest">
                <span>Stats</span>
                <RotateCcw size={14} className="cursor-pointer" />
              </div>

              <div className="relative flex items-center justify-center mb-6">
                <CircularProgress
                  classNames={{
                    svg: "w-32 h-32 drop-shadow-md",
                    indicator: "stroke-blue-500 dark:stroke-[#E3C39D]",
                    track: "stroke-blue-50/50 dark:stroke-[#1C2737]",
                  }}
                  value={0}
                  maxValue={MY_LIST_PROBLEMS.length}
                  strokeWidth={3}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-[#071739] dark:text-white">
                    0
                    <span className="text-blue-200 dark:text-[#4B6382] text-sm ml-0.5">
                      /{MY_LIST_PROBLEMS.length}
                    </span>
                  </span>
                  <span className="text-[10px] text-blue-300 dark:text-[#94A3B8] font-bold uppercase tracking-tighter">
                    Solved
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-[11px] font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-teal-500">Easy</span>
                  <span className="text-gray-400 dark:text-[#94A3B8]">0/4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-500">Med.</span>
                  <span className="text-gray-400 dark:text-[#94A3B8]">0/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-500">Hard</span>
                  <span className="text-gray-400 dark:text-[#94A3B8]">0/1</span>
                </div>
              </div>
            </div>
          </div>

          {/* DANH SÁCH BÀI TẬP (Right List Card) */}
          <div className="flex-1 bg-white dark:bg-[#1C2737] rounded-[32px] border border-gray-100 dark:border-[#344054] p-6 shadow-sm h-fit">
            <ListControls />

            <div className="mt-6">
              <div className="grid grid-cols-[1fr_120px_100px] px-6 py-4 text-[10px] font-black text-gray-400 dark:text-[#667085] uppercase tracking-[0.2em] border-b border-gray-50 dark:border-[#344054]">
                <span>Title</span>
                <span className="text-right">Acceptance</span>
                <span className="text-right">Difficulty</span>
              </div>

              <div className="flex flex-col mt-2">
                {MY_LIST_PROBLEMS.map((prob) => (
                  <div
                    key={prob.id}
                    className="grid grid-cols-[1fr_120px_100px] px-6 py-5 items-center cursor-pointer transition-all border-b border-gray-50 dark:border-[#344054]/30 group hover:bg-blue-50/40 dark:hover:bg-[#101828]/60 rounded-2xl"
                  >
                    <div className="flex gap-4 items-center overflow-hidden">
                      <span className="text-gray-300 dark:text-[#475569] font-bold text-xs w-6 text-right shrink-0">
                        {prob.id}.
                      </span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[15px] font-bold truncate text-gray-700 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-[#E3C39D]">
                          {prob.title}
                        </span>
                        {prob.isLocked ? (
                          <Lock
                            size={14}
                            className="text-orange-400 shadow-sm"
                          />
                        ) : (
                          <Globe
                            size={14}
                            className="text-gray-200 dark:text-[#475569]"
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-right text-sm text-gray-400 dark:text-[#94A3B8] font-bold">
                      {prob.acceptance}
                    </span>
                    <span
                      className={`text-right text-sm font-black ${
                        prob.difficulty === "Easy"
                          ? "text-teal-500"
                          : prob.difficulty === "Med."
                          ? "text-yellow-500"
                          : "text-rose-500"
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
