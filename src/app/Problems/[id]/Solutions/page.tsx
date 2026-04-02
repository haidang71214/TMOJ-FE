"use client";
import React from "react";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";

const MOCK_SOLUTIONS = [
  {
    id: "1",
    author: "user_abc",
    title: "Hash Map - O(n) time, O(n) space",
    lang: "Python3",
    likes: 4821,
    views: "32K",
    excerpt:
      "Use a hash map to store value → index pairs. For each element, check if the complement exists in the map.",
  },
  {
    id: "2",
    author: "coder_xyz",
    title: "Two Pointers approach (sorted copy)",
    lang: "C++",
    likes: 891,
    views: "10K",
    excerpt:
      "Sort a copy of the array, then use two pointers from both ends. Map back to original indices.",
  },
  {
    id: "3",
    author: "javaguru",
    title: "Single-pass HashMap — clean solution",
    lang: "Java",
    likes: 2234,
    views: "18K",
    excerpt:
      "Iterate once. While inserting into map, check if complement already exists. Return indices immediately.",
  },
];

export default function SolutionsTab () {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="px-6 py-4 border-b dark:border-[#334155] flex items-center justify-between">
        <span className="font-black text-[13px] text-[#262626] dark:text-[#F9FAFB]">
          {MOCK_SOLUTIONS.length} Solutions
        </span>
        <div className="flex gap-2">
          {["All Languages", "Most Votes"].map((label) => (
            <button
              key={label}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-400 dark:text-[#667085] bg-gray-100 dark:bg-[#101828] border dark:border-[#334155] hover:text-black dark:hover:text-white transition-colors"
            >
              {label} ▾
            </button>
          ))}
        </div>
      </div>

      {/* Solution Cards */}
      <div className="divide-y dark:divide-[#334155]">
        {MOCK_SOLUTIONS.map((sol) => (
          <div
            key={sol.id}
            className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-[#101828] cursor-pointer transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[14px] text-[#262626] dark:text-[#F9FAFB] group-hover:text-blue-600 dark:group-hover:text-[#E3C39D] transition-colors mb-1 truncate">
                  {sol.title}
                </h3>
                <p className="text-[12px] text-gray-400 dark:text-[#475569] mb-3 line-clamp-2 leading-relaxed">
                  {sol.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-[#475569]">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 font-black uppercase tracking-tight">
                    {sol.lang}
                  </span>
                  <span className="font-bold">{sol.author}</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={11} /> {sol.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {sol.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={11} /> 0
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
