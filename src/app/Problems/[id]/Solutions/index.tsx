"use client";
import React, { useState, useMemo } from "react"; // Thêm useMemo
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Search, ChevronDown, ListFilter, Share2 } from "lucide-react";
import { SolutionItem } from "./SolutionItem";
import { SolutionDetail } from "./SolutionDetail";
import { SolutionData } from "./types";

const MOCK_SOLUTIONS: SolutionData[] = [
  {
    id: 1,
    author: "LeetCode",
    avatar: "",
    title: "Two Sum",
    tags: ["Editorial"],
    upvotes: 4700,
    views: "12M",
    comments: 2700,
    date: "Jun 25, 2021",
    isEditorial: true,
  },
  {
    id: 2,
    author: "niits",
    avatar: "",
    title: "【Video】Step by Step Easy Solution",
    tags: ["Array", "Hash Table", "C++", "Java"],
    upvotes: 2600,
    views: "206.8K",
    comments: 9,
    date: "2 days ago",
  },
  {
    id: 3,
    author: "Rahul Varma",
    avatar: "",
    title: "✅3 Method's || C++ || JAVA || PYTHON || Beginner Friendly",
    tags: ["Array", "Hash Table", "C++"],
    upvotes: 11100,
    views: "2.1M",
    comments: 267,
    date: "1 week ago",
  },
  // THÊM DỮ LIỆU MẪU CHO MY SOLUTION
  {
    id: 4,
    author: "Rim (Me)", // Giả định đây là tên của bạn
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    title: "My Optimized O(n) Approach with HashMap",
    tags: ["Hash Table", "Python3", "My Solution"], // Có tag này để lọc
    upvotes: 45,
    views: "1.2K",
    comments: 4,
    date: "Just now",
  },
];

export const SolutionsTab = () => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionData | null>(
    null
  );
  const [sortBy, setSortBy] = useState("Hot");

  // 1. Thêm State để theo dõi Tag đang chọn
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = [
    "All",
    "My Solution",
    "C++",
    "Java",
    "Python3",
    "Array",
    "Hash Table",
  ];

  // 2. Logic Filter dữ liệu
  const filteredSolutions = useMemo(() => {
    if (selectedTag === "All") return MOCK_SOLUTIONS;

    // Nếu chọn "My Solution", tìm trong tags bài nào có tag đó hoặc check theo author
    return MOCK_SOLUTIONS.filter(
      (sol) =>
        sol.tags.includes(selectedTag) ||
        (selectedTag === "My Solution" && sol.author.includes("(Me)"))
    );
  }, [selectedTag]);

  if (selectedSolution) {
    return (
      <div className="h-full bg-white dark:bg-[#1C2737] overflow-hidden">
        <SolutionDetail
          solution={selectedSolution}
          onBack={() => setSelectedSolution(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C2737] transition-colors duration-500">
      {/* 1. Search & Sort Bar */}
      <div className="p-4 border-b border-gray-50 dark:border-[#334155] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search solutions..."
            size="sm"
            startContent={
              <Search size={16} className="text-gray-400 dark:text-[#667085]" />
            }
            className="max-w-xs"
            variant="flat"
            classNames={{
              inputWrapper:
                "dark:bg-[#101828] dark:hover:bg-[#162130] transition-colors",
              input: "text-sm dark:text-white",
            }}
          />
          <div className="flex items-center gap-4">
            <Dropdown className="dark:bg-[#101828] dark:border-[#334155]">
              <DropdownTrigger>
                <div className="flex items-center gap-1 text-[13px] text-gray-500 dark:text-[#94A3B8] cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                  Sort by:{" "}
                  <span className="font-black text-black dark:text-[#E3C39D]">
                    {sortBy}
                  </span>{" "}
                  <ChevronDown size={14} />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => setSortBy(key as string)}
                className="dark:text-[#F9FAFB]"
              >
                <DropdownItem key="Hot">Hot</DropdownItem>
                <DropdownItem key="Most Recent">Most Recent</DropdownItem>
                <DropdownItem key="Most Votes">Most Votes</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="dark:text-[#94A3B8] hover:dark:text-white"
            >
              <ListFilter size={18} />
            </Button>
          </div>
        </div>

        {/* 2. Tags Bar - CẬP NHẬT ONCLICK */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tags.map((tag) => (
            <Button
              key={tag}
              size="sm"
              variant="flat"
              // Cập nhật selectedTag khi nhấn
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full min-w-fit h-7 px-4 text-[11px] font-black transition-all ${
                selectedTag === tag // So sánh với state đang chọn
                  ? "bg-gray-100 dark:bg-[#E3C39D] text-black dark:text-[#101828]"
                  : "bg-gray-100 dark:bg-[#101828] text-gray-600 dark:text-[#94A3B8] hover:dark:bg-[#162130]"
              }`}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* 3. Share Box */}
      <div className="p-4 flex items-center justify-between bg-gray-50/50 dark:bg-[#101828]/40 border-b border-gray-50 dark:border-[#334155]">
        <p className="text-[11px] text-gray-500 dark:text-[#667085] font-bold italic">
          Submit at least 1 AC to publish a solution.
        </p>
        <Button
          size="sm"
          className="bg-[#2cbb5d] dark:bg-[#2cbb5d] text-white font-black gap-2 rounded-lg h-8 shadow-lg shadow-green-500/10 active:scale-95 transition-all"
        >
          <Share2 size={14} /> Share my solution
        </Button>
      </div>

      {/* 4. Solutions List - SỬ DỤNG DỮ LIỆU ĐÃ FILTER */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredSolutions.length > 0 ? (
          filteredSolutions.map((sol) => (
            <SolutionItem
              key={sol.id}
              solution={sol}
              onClick={setSelectedSolution}
            />
          ))
        ) : (
          <div className="p-10 text-center text-gray-400 text-sm italic font-bold">
            No solutions found for &quot;{selectedTag}&quot;{" "}
          </div>
        )}
      </div>
    </div>
  );
};
