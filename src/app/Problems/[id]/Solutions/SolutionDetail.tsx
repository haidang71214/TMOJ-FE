"use client";
import React, { useRef } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, Share2, Star, MoreHorizontal } from "lucide-react";
import { SolutionData } from "./types";
import { VideoSolution } from "../Editorial/VideoSolution";
import { SolutionArticle } from "../Editorial/SolutionArticle";
import { EditorialDiscussion } from "../Editorial/EditorialDiscussion";
import { EditorialActionBar } from "../Editorial/EditorialActionBar";
interface Props {
  solution: SolutionData;
  onBack: () => void;
}

export const SolutionDetail = ({ solution, onBack }: Props) => {
  const commentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C2737] animate-in fade-in slide-in-from-right-2 duration-300 font-sans text-[#262626] dark:text-[#F9FAFB] transition-colors duration-500">
      {/* 1. Header Navigation: Sticky & Glassmorphism nhẹ */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-[#334155] shrink-0 bg-white dark:bg-[#1C2737] sticky top-0 z-10 transition-all">
        <Button
          variant="light"
          size="sm"
          startContent={<ChevronLeft size={18} />}
          onClick={onBack}
          className="text-gray-500 dark:text-[#94A3B8] font-black hover:text-black dark:hover:text-white hover:dark:bg-[#101828] transition-all"
        >
          All Solutions
        </Button>

        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="text-gray-400 dark:text-[#667085] hover:dark:text-white"
          >
            <Share2 size={18} />
          </Button>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="text-gray-400 dark:text-[#667085] hover:dark:text-white"
          >
            <Star size={18} />
          </Button>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="text-gray-400 dark:text-[#667085] hover:dark:text-white"
          >
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar flex flex-col gap-10">
        {/* Video Solution Section */}
        {solution.isEditorial && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <VideoSolution />
          </div>
        )}

        {/* Bài viết lời giải chính */}
        <div className="border-t border-gray-100 dark:border-[#334155] pt-10">
          <SolutionArticle />
        </div>

        {/* Thảo luận chuyên sâu */}
        <div
          ref={commentRef}
          className="border-t border-gray-100 dark:border-[#334155] pt-10 pb-10"
        >
          <EditorialDiscussion />
        </div>
      </div>
      <EditorialActionBar
        initialUpvotes={4900}
        initialComments="2.7K"
        commentSectionRef={commentRef}
      />
    </div>
  );
};
