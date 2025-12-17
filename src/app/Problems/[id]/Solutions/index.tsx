"use client";
import React, { useState } from "react";
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
];

export const SolutionsTab = () => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionData | null>(
    null
  );
  const [sortBy, setSortBy] = useState("Hot");

  if (selectedSolution) {
    return (
      <div className="p-6 overflow-y-auto no-scrollbar h-full bg-white">
        <SolutionDetail
          solution={selectedSolution}
          onBack={() => setSelectedSolution(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search & Sort Bar (image_a1e499.png) */}
      <div className="p-4 border-b border-gray-50 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search..."
            size="sm"
            startContent={<Search size={16} className="text-gray-400" />}
            className="max-w-xs"
            variant="flat"
          />
          <div className="flex items-center gap-4">
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-black">
                  Sort by:{" "}
                  <span className="font-bold text-black">{sortBy}</span>{" "}
                  <ChevronDown size={14} />
                </div>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) => setSortBy(key as string)}>
                <DropdownItem key="Hot">Hot</DropdownItem>
                <DropdownItem key="Most Recent">Most Recent</DropdownItem>
                <DropdownItem key="Most Votes">Most Votes</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button isIconOnly size="sm" variant="light">
              <ListFilter size={18} />
            </Button>
          </div>
        </div>

        {/* Tags Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            "All",
            "My Solution",
            "C++",
            "Java",
            "Python3",
            "Array",
            "Hash Table",
          ].map((tag) => (
            <Button
              key={tag}
              size="sm"
              variant="flat"
              className="rounded-full bg-gray-100 text-gray-600 min-w-fit h-7"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Share Box */}
      <div className="p-4 flex items-center justify-between bg-gray-50/50 border-b border-gray-50">
        <p className="text-xs text-gray-500">
          Submit at least 1 AC to publish a solution.
        </p>
        <Button size="sm" className="bg-[#2cbb5d] text-white font-bold gap-2">
          <Share2 size={14} /> Share my solution
        </Button>
      </div>

      {/* Solutions List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {MOCK_SOLUTIONS.map((sol) => (
          <SolutionItem
            key={sol.id}
            solution={sol}
            onClick={setSelectedSolution}
          />
        ))}
      </div>
    </div>
  );
};
