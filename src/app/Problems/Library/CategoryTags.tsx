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
    <div className="flex flex-col gap-2">
      <div
        className={`flex flex-wrap gap-x-4 gap-y-3 transition-all duration-500 overflow-hidden ${
          isExpanded ? "max-h-[1000px]" : "max-h-[32px]"
        }`}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors shrink-0"
          >
            <span className="text-[13px] text-gray-500 font-medium">
              {cat.name}
            </span>
            <span className="text-[11px] text-gray-400 font-normal">
              {cat.count}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-end border-b border-gray-100 pb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[13px] text-gray-400 hover:text-black flex items-center gap-1 font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              Collapse <ChevronUp size={14} />
            </>
          ) : (
            <>
              Expand <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
