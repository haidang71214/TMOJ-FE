"use client";
import React, { useState } from "react";
import ProblemsSidebar from "../../Sidebar";
import { ListControls } from "../ListControls";
import { CircularProgress, Button } from "@heroui/react";
import {
  Play,
  Share2,
  MoreHorizontal,
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
    <main className="min-h-screen bg-[#F7F8FA] font-sans text-[#262626] flex relative overflow-hidden">
      {/* 1. SIDEBAR TRÁI (THU GỌN) */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-gray-200 bg-white sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <ProblemsSidebar />
        </div>
      </aside>

      {/* 2. NÚT TOGGLE - Dùng fixed để luôn đè lên trên và không bị sidebar đẩy đi */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:text-blue-500 hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 3. KHU VỰC NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        {/* NỘI DUNG CHÍNH - Nổi bật trên nền xám */}
        <div className="flex flex-1 overflow-y-auto overflow-x-hidden p-6 gap-6 lg:flex-row flex-col">
          {/* CỘT THÔNG TIN TIẾN ĐỘ (Card Trắng) */}
          <div className="w-full lg:w-[320px] bg-white rounded-[24px] border border-gray-100 p-8 flex flex-col items-center text-center gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-fit sticky top-0">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm text-4xl">
              {currentId === "Favorite" ? "⭐" : "🗒️"}
            </div>

            <div>
              <h1 className="text-2xl font-bold capitalize text-blue-900">
                {currentId}
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-medium italic">
                Rimtapcode · {MY_LIST_PROBLEMS.length} questions
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-600 text-white font-bold px-6 h-9 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                startContent={<Play size={16} fill="currentColor" />}
              >
                Practice
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-gray-50 h-9 w-9 text-gray-400 rounded-xl hover:text-blue-500 transition-colors"
              >
                <Share2 size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-gray-100 h-8 w-8 text-gray-600 rounded-xl"
              >
                <MoreHorizontal size={16} />
              </Button>
            </div>

            <div className="w-full mt-2 p-5 border border-blue-50 rounded-[20px] bg-blue-50/20 text-left">
              <div className="flex justify-between items-center text-[11px] font-bold mb-4 uppercase text-blue-400 tracking-wider">
                <span>Progress</span>
                <RotateCcw
                  size={14}
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                />
              </div>
              <div className="relative flex items-center justify-center mb-6">
                <CircularProgress
                  classNames={{
                    svg: "w-32 h-32",
                    indicator: "stroke-blue-500",
                    track: "stroke-blue-50/50",
                  }}
                  value={0}
                  maxValue={MY_LIST_PROBLEMS.length}
                  strokeWidth={3}
                />
                <div className="absolute flex flex-col items-center leading-tight">
                  <span className="text-2xl font-bold text-blue-900">
                    0
                    <span className="text-blue-200 text-sm">
                      /{MY_LIST_PROBLEMS.length}
                    </span>
                  </span>
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-tighter">
                    Solved
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 text-[11px] font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-teal-500">Easy</span>
                  <span className="text-gray-400">0/4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-500">Med.</span>
                  <span className="text-gray-400">0/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-500">Hard</span>
                  <span className="text-gray-400">0/1</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT DANH SÁCH BÀI TẬP (Card Trắng) */}
          <div className="flex-1 bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-fit">
            <ListControls />

            <div className="mt-6">
              <div className="grid grid-cols-[1fr_120px_100px] px-4 py-3 text-[11px] font-bold text-gray-400 uppercase border-b border-gray-50 tracking-widest">
                <span>Title</span>
                <span className="text-right">Acceptance</span>
                <span className="text-right">Difficulty</span>
              </div>

              <div className="flex flex-col">
                {MY_LIST_PROBLEMS.map((prob) => (
                  <div
                    key={prob.id}
                    className="grid grid-cols-[1fr_120px_100px] px-4 py-4 items-center cursor-pointer transition-all border-b border-gray-50 group hover:bg-blue-50/30 rounded-xl mx-[-8px] px-[24px]"
                  >
                    <div className="flex gap-4 items-center overflow-hidden">
                      <span className="text-gray-300 font-medium text-sm w-6 text-right shrink-0">
                        {prob.id}.
                      </span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[15px] font-semibold truncate text-gray-700 group-hover:text-blue-600 transition-colors">
                          {prob.title}
                        </span>
                        {prob.isLocked ? (
                          <Lock
                            size={14}
                            className="text-orange-300 shrink-0"
                          />
                        ) : (
                          <Globe size={14} className="text-gray-200 shrink-0" />
                        )}
                      </div>
                    </div>
                    <span className="text-right text-sm text-gray-400 font-medium">
                      {prob.acceptance}
                    </span>
                    <span
                      className={`text-right text-sm font-bold ${
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
