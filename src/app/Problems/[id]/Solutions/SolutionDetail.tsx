"use client";
import React from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, Share2, Star, MoreHorizontal } from "lucide-react";
import { SolutionData } from "./types";
// Import các component đã tách nhỏ từ Editorial
import { VideoSolution } from "../Editorial/VideoSolution";
import { SolutionArticle } from "../Editorial/SolutionArticle";
import { EditorialDiscussion } from "../Editorial/EditorialDiscussion";

interface Props {
  solution: SolutionData;
  onBack: () => void;
}

export const SolutionDetail = ({ solution, onBack }: Props) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-right-2 duration-300 font-sans text-[#262626]">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 shrink-0 bg-white sticky top-0 z-10">
        <Button
          variant="light"
          size="sm"
          startContent={<ChevronLeft size={18} />}
          onClick={onBack}
          className="text-gray-500 font-medium hover:text-black"
        >
          All Solutions
        </Button>
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="text-gray-400"
          >
            <Share2 size={18} />
          </Button>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="text-gray-400"
          >
            <Star size={18} />
          </Button>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="text-gray-400"
          >
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 text-[#262626] no-scrollbar flex flex-col gap-6">
        {/* 2. Chỉ hiện Video nếu là bài Editorial hoặc có video */}
        {solution.isEditorial && <VideoSolution />}

        <div className="border-t border-gray-100 pt-10">
          <SolutionArticle />
        </div>

        <div className="border-t border-gray-100 pt-10">
          <EditorialDiscussion />
        </div>
      </div>
    </div>
  );
};
