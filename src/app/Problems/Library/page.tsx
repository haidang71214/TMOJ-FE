"use client";

import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { QuestBanners } from "./QuestBanners";
import { CategoryTags } from "./CategoryTags";
import { ProblemsTable, Problem } from "./ProblemsTable";
import { CalendarSidebar } from "./CalendarSidebar";
import { Input, Button, Progress } from "@heroui/react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function LibraryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const allCategories = [
    { name: "Array", count: 2062 },
    { name: "String", count: 834 },
    { name: "Hash Table", count: 763 },
    { name: "Math", count: 642 },
    { name: "Dynamic Programming", count: 633 },
    { name: "Sorting", count: 489 },
    { name: "Greedy", count: 447 },
    { name: "Depth-First Search", count: 331 },
    { name: "Binary Search", count: 330 },
    { name: "Database", count: 310 },
    { name: "Matrix", count: 267 },
    { name: "Bit Manipulation", count: 265 },
    { name: "Tree", count: 255 },
    { name: "Breadth-First Search", count: 250 },
    { name: "Two Pointers", count: 234 },
    { name: "Prefix Sum", count: 230 },
    { name: "Heap (Priority Queue)", count: 205 },
    { name: "Simulation", count: 195 },
    { name: "Counting", count: 183 },
    { name: "Graph", count: 178 },
    { name: "Binary Tree", count: 177 },
    { name: "Stack", count: 176 },
    { name: "Sliding Window", count: 159 },
    { name: "Enumeration", count: 131 },
    { name: "Design", count: 131 },
    { name: "Backtracking", count: 111 },
    { name: "Union Find", count: 98 },
    { name: "Number Theory", count: 87 },
    { name: "Linked List", count: 82 },
    { name: "Ordered Set", count: 76 },
  ];

  const problems: Problem[] = [
    {
      id: 1,
      title: "Two Sum",
      acceptance: "56.7%",
      difficulty: "Easy",
      isLocked: false,
      isSolved: true,
    },
    {
      id: 2,
      title: "Add Two Numbers",
      acceptance: "47.5%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      acceptance: "38.0%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: true,
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      acceptance: "45.4%",
      difficulty: "Hard",
      isLocked: true,
      isSolved: false,
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      acceptance: "36.9%",
      difficulty: "Medium",
      isLocked: true,
      isSolved: false,
    },
    {
      id: 6,
      title: "Zigzag Conversion",
      acceptance: "53.0%",
      difficulty: "Medium",
      isLocked: true,
      isSolved: false,
    },
    {
      id: 7,
      title: "Reverse Integer",
      acceptance: "28.1%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: true,
    },
    {
      id: 8,
      title: "String to Integer (atoi)",
      acceptance: "17.5%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 9,
      title: "Palindrome Number",
      acceptance: "57.2%",
      difficulty: "Easy",
      isLocked: false,
      isSolved: true,
    },
    {
      id: 10,
      title: "Regular Expression Matching",
      acceptance: "28.5%",
      difficulty: "Hard",
      isLocked: true,
      isSolved: false,
    },
    {
      id: 11,
      title: "Container With Most Water",
      acceptance: "54.8%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 12,
      title: "Integer to Roman",
      acceptance: "65.1%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 13,
      title: "Roman to Integer",
      acceptance: "62.4%",
      difficulty: "Easy",
      isLocked: false,
      isSolved: true,
    },
    {
      id: 14,
      title: "Longest Common Prefix",
      acceptance: "43.1%",
      difficulty: "Easy",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 15,
      title: "3Sum",
      acceptance: "34.5%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 16,
      title: "3Sum Closest",
      acceptance: "45.8%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 17,
      title: "Letter Combinations of a Phone Number",
      acceptance: "60.2%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 18,
      title: "4Sum",
      acceptance: "35.9%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 19,
      title: "Remove Nth Node From End of List",
      acceptance: "45.2%",
      difficulty: "Medium",
      isLocked: false,
      isSolved: false,
    },
    {
      id: 20,
      title: "Valid Parentheses",
      acceptance: "40.8%",
      difficulty: "Easy",
      isLocked: false,
      isSolved: true,
    },
  ];

  return (
    <main className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans text-[#071739] dark:text-[#F9FAFB] flex relative transition-colors duration-500">
      {/* SIDEBAR TRÁI - Màu #1C2737 */}
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
        {/* NÚT TOGGLE SIDEBAR - Căn chỉnh lại vị trí để không bị lệch */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ left: isSidebarOpen ? "244px" : "12px" }}
          className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-[#4B6382] dark:text-[#98A2B3] hover:text-[#071739] dark:hover:text-[#FFB800] transition-all duration-300 cursor-pointer hover:scale-110"
        >
          {isSidebarOpen ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>

        <div className="w-full overflow-y-auto h-screen custom-scrollbar dark:bg-[#101828]">
          <div className="max-w-[1400px] mx-auto p-8 lg:p-12 flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 flex flex-col gap-8 w-full min-w-0">
              <QuestBanners />

              {/* Category Area - Bo góc lớn và Glassmorphism nhẹ */}
              <div className="bg-white/50 dark:bg-[#1C2737]/40 p-6 rounded-[2rem] border border-[#A4B5C4]/20 dark:border-[#344054]/30 backdrop-blur-sm shadow-sm">
                <CategoryTags categories={allCategories} />
              </div>

              {/* TOPIC BUTTONS - Màu Vàng #FFB800 khi Active */}
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
                    startContent={
                      <Search
                        size={18}
                        className="text-gray-400 dark:text-[#667085]"
                      />
                    }
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

              {/* TABLE AREA - Đồng bộ bo góc và bóng đổ */}
              <div className="bg-white dark:bg-[#1C2737] rounded-[2.5rem] shadow-xl border border-transparent dark:border-[#344054]/50 overflow-hidden transition-all duration-300 p-4">
                <ProblemsTable problems={problems} />
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
    </main>
  );
}
