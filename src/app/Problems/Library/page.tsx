"use client";

import React from "react";
import Sidebar from "../Sidebar";
import { QuestBanners } from "./QuestBanners";
import { CategoryTags } from "./CategoryTags";
import { ProblemsTable, Problem } from "./ProblemsTable";
import { CalendarSidebar } from "./CalendarSidebar";
import { Input, Button, Progress } from "@heroui/react";
import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";

export default function LibraryPage() {
  // Danh sách đầy đủ Tags (Categories)
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
    <main className="min-h-screen bg-white font-sans text-[#262626]">
      <div className="max-w-[1450px] mx-auto p-6 flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar />

        <div className="flex-1 flex flex-col gap-6 w-full">
          {/* Banner Quests */}
          <QuestBanners />

          {/* Hàng Tags có tính năng Expand/Collapse */}
          <CategoryTags categories={allCategories} />

          {/* Pill Filters */}
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
                variant={i === 0 ? "solid" : "light"}
                className={`text-[13px] rounded-lg h-8 px-4 font-medium ${
                  i === 0
                    ? "bg-[#262626] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {t}
              </Button>
            ))}
          </div>

          {/* Search & Progress Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search questions"
                startContent={<Search size={16} className="text-gray-400" />}
                className="w-full md:w-[260px]"
                variant="flat"
                size="sm"
              />
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                className="bg-gray-50"
              >
                <Filter size={16} />
              </Button>
              <Button
                variant="flat"
                size="sm"
                className="bg-gray-50 font-bold text-gray-600 px-4"
                startContent={<ArrowUpDown size={14} />}
              >
                Sort
              </Button>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-end w-32">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                  6/3829 Solved
                </span>
                {/* Dùng Progress ở đây để xóa lỗi unused */}
                <Progress
                  aria-label="Solved progress"
                  size="sm"
                  value={(6 / 3829) * 100}
                  className="mt-1"
                  classNames={{
                    indicator: "bg-green-500",
                    track: "bg-gray-100",
                  }}
                />
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-gray-300"
              >
                <ChevronDown size={18} />
              </Button>
            </div>
          </div>

          {/* Bảng danh sách bài tập */}
          <ProblemsTable problems={problems} />
        </div>

        {/* Sidebar phải chứa Lịch và Công ty */}
        <CalendarSidebar />
      </div>
    </main>
  );
}
