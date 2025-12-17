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
    className="py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors px-4 group"
    onClick={() => onClick(solution)}
  >
    <div className="flex items-center gap-2 mb-1">
      <Avatar src={solution.avatar} size="sm" className="w-6 h-6" />
      <span className="text-sm font-medium text-gray-600">
        {solution.author}
      </span>
      {solution.isEditorial && (
        <span className="text-blue-500 bg-blue-50 text-[10px] px-1 rounded">
          Editorial
        </span>
      )}
    </div>

    <div className="flex items-center gap-2 mb-2">
      <h4 className="text-[15px] font-bold text-[#262626] group-hover:text-blue-600 transition-colors">
        {solution.title}
      </h4>
      {solution.isEditorial && (
        <PlayCircle size={16} className="text-gray-500" />
      )}
    </div>

    <div className="flex gap-2 mb-3">
      {solution.tags.map((tag) => (
        <Chip
          key={tag}
          size="sm"
          variant="flat"
          className="bg-gray-100 text-gray-500 h-5 text-[10px]"
        >
          {tag}
        </Chip>
      ))}
    </div>

    <div className="flex items-center gap-6 text-gray-400 text-[12px]">
      <div className="flex items-center gap-1">
        <ThumbsUp size={14} />{" "}
        {solution.upvotes >= 1000
          ? (solution.upvotes / 1000).toFixed(1) + "K"
          : solution.upvotes}
      </div>
      <div className="flex items-center gap-1">
        <Eye size={14} /> {solution.views}
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare size={14} /> {solution.comments}
      </div>
    </div>
  </div>
);
