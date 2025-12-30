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
    <main className="min-h-screen bg-white dark:bg-[#101828] font-sans text-[#262626] dark:text-white flex transition-colors duration-500">
      {/* SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-gray-100 dark:border-[#1c2737] bg-white dark:bg-[#1c2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6">
          <Sidebar />
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH */}
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

        <div className="w-full overflow-y-auto h-screen custom-scrollbar dark:bg-[#101828]">
          <div className="max-w-[1400px] mx-auto p-6 flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
              <QuestBanners />
              <CategoryTags categories={allCategories} />

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
                    className={`text-[13px] rounded-lg h-8 px-4 font-bold transition-all ${
                      i === 0
                        ? "bg-[#262626] dark:bg-[#E3C39D] text-white dark:text-[#101828] shadow-md"
                        : "bg-transparent text-gray-500 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#1c2737] hover:text-[#071739] dark:hover:text-white"
                    }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>

              {/* FILTER & SEARCH ROW */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto">
                  <Input
                    placeholder="Search questions"
                    startContent={
                      <Search
                        size={16}
                        className="text-gray-400 dark:text-[#94a3b8]"
                      />
                    }
                    className="w-full md:w-[260px]"
                    classNames={{
                      inputWrapper:
                        "bg-gray-100 dark:bg-[#1c2737] border-transparent dark:border-[#344054] dark:hover:border-[#4b6382] transition-all rounded-xl",
                      input: "dark:text-white placeholder:dark:text-[#475569]",
                    }}
                    variant="flat"
                    size="sm"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-gray-50 dark:bg-[#1c2737] text-gray-600 dark:text-white border dark:border-[#344054] rounded-xl"
                  >
                    <Filter size={16} />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gray-50 dark:bg-[#1c2737] font-bold text-gray-600 dark:text-white px-4 border dark:border-[#344054] rounded-xl"
                    startContent={<ArrowUpDown size={14} />}
                  >
                    Sort
                  </Button>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-end w-32">
                    <span className="text-[10px] font-black text-gray-500 dark:text-[#E3C39D] uppercase tracking-tighter">
                      6/3829 Solved
                    </span>
                    <Progress
                      aria-label="Solved progress"
                      size="sm"
                      value={(6 / 3829) * 100}
                      className="mt-1"
                      classNames={{
                        indicator: "bg-green-500 dark:bg-[#E3C39D]",
                        track: "bg-gray-100 dark:bg-[#1c2737]",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* TABLE AREA - Làm sáng hơn một chút để chữ trắng nổi bật */}
              <div className="bg-white dark:bg-[#162130] rounded-2xl shadow-sm border border-transparent dark:border-[#1c2737] overflow-hidden transition-all duration-300">
                <ProblemsTable problems={problems} />
              </div>
            </div>

            {/* SIDEBAR PHẢI */}
            <CalendarSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
