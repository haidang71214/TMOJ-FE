"use client";
import React from "react";
import { Avatar, Chip } from "@heroui/react";
import { ThumbsUp, Eye, MessageSquare, PlayCircle } from "lucide-react";
import { SolutionData } from "./types";

interface Props {
  solution: SolutionData;
  onClick: (s: SolutionData) => void;
}

export const SolutionItem = ({ solution, onClick }: Props) => (
  <div
    className="py-5 border-b border-gray-100 dark:border-[#1C2737] hover:bg-gray-50 dark:hover:bg-[#1C2737]/60 cursor-pointer transition-all px-4 group duration-300"
    onClick={() => onClick(solution)}
  >
    {/* Author Info */}
    <div className="flex items-center gap-2 mb-2">
      <Avatar
        src={solution.avatar}
        size="sm"
        className="w-6 h-6 border dark:border-[#334155]"
      />
      <span className="text-sm font-bold text-gray-500 dark:text-[#94A3B8]">
        {solution.author}
      </span>
      {solution.isEditorial && (
        <span className="text-blue-500 dark:text-[#E3C39D] bg-blue-50 dark:bg-[#E3C39D]/10 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
          Editorial
        </span>
      )}
    </div>

    {/* Title & Icon */}
    <div className="flex items-center gap-2 mb-3">
      <h4 className="text-[15px] font-black text-[#262626] dark:text-[#F9FAFB] group-hover:text-blue-600 dark:group-hover:text-[#E3C39D] transition-colors leading-snug">
        {solution.title}
      </h4>
      {solution.isEditorial && (
        <PlayCircle
          size={16}
          className="text-gray-400 dark:text-[#475569] shrink-0"
        />
      )}
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      {solution.tags.map((tag) => (
        <Chip
          key={tag}
          size="sm"
          variant="flat"
          className="bg-gray-100 dark:bg-[#101828] text-gray-500 dark:text-[#94A3B8] h-5 text-[10px] font-bold border dark:border-[#334155]/30"
        >
          {tag}
        </Chip>
      ))}
    </div>

    {/* Stats */}
    <div className="flex items-center gap-6 text-gray-400 dark:text-[#667085] text-[12px] font-bold">
      <div className="flex items-center gap-1.5 group-hover:dark:text-[#94A3B8] transition-colors">
        <ThumbsUp
          size={14}
          className={
            solution.upvotes > 100 ? "text-blue-500 dark:text-[#E3C39D]" : ""
          }
        />
        {solution.upvotes >= 1000
          ? (solution.upvotes / 1000).toFixed(1) + "K"
          : solution.upvotes}
      </div>
      <div className="flex items-center gap-1.5">
        <Eye size={14} /> {solution.views}
      </div>
      <div className="flex items-center gap-1.5">
        <MessageSquare size={14} /> {solution.comments}
      </div>
    </div>
  </div>
);
