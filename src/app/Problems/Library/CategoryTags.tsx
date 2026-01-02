"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  name: string;
  count: number;
}

export const CategoryTags = ({ categories }: { categories: Category[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2 transition-colors duration-500">
      {/* Container Tags */}
      <div
        className={`flex flex-wrap gap-x-6 gap-y-3 transition-all duration-700 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-[30px] opacity-80"
        }`}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            {/* Tên danh mục */}
            <span className="text-[13px] text-gray-600 dark:text-[#94A3B8] font-bold group-hover:text-blue-600 dark:group-hover:text-[#E3C39D] transition-colors">
              {cat.name}
            </span>
            {/* Số lượng - bo tròn badge nhẹ cho dark mode */}
            <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#1C2737] text-gray-400 dark:text-[#667085] font-black group-hover:bg-blue-50 dark:group-hover:bg-[#E3C39D]/10 transition-all">
              {cat.count}
            </span>
          </div>
        ))}
      </div>

      {/* Nút điều khiển */}
      <div className="flex justify-end border-b border-gray-100 dark:border-[#1C2737] pb-2 mt-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[12px] uppercase tracking-widest text-gray-400 dark:text-[#475569] hover:text-black dark:hover:text-white flex items-center gap-1 font-black transition-all active:scale-95"
        >
          {isExpanded ? (
            <>
              Collapse <ChevronUp size={14} className="dark:text-[#E3C39D]" />
            </>
          ) : (
            <>
              Expand <ChevronDown size={14} className="dark:text-[#E3C39D]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
