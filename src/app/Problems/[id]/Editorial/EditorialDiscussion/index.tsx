"use client";
import React, { useState, useMemo } from "react";
import { Pagination, PaginationItemType } from "@heroui/react";
import {
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { INITIAL_DATA } from "./data";
import { CommentData } from "./types";

export const EditorialDiscussion = () => {
  const [comments, setComments] = useState<CommentData[]>(INITIAL_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCodes, setExpandedCodes] = useState<Record<number, boolean>>(
    {}
  );

  const itemsPerPage = 4;

  const updateReaction = (
    list: CommentData[],
    id: number,
    type: "like" | "dislike"
  ): CommentData[] => {
    return list.map((c) => {
      if (c.id === id) {
        if (type === "like") {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            isDisliked: false,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
          };
        } else {
          const isDisliked = !c.isDisliked;
          return {
            ...c,
            isDisliked,
            isLiked: false,
            likes: c.isLiked ? c.likes - 1 : c.likes,
          };
        }
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: updateReaction(c.replies, id, type) };
      }
      return c;
    });
  };

  const handleLike = (id: number) => {
    setComments((prev) => updateReaction(prev, id, "like"));
  };

  const handleDislike = (id: number) => {
    setComments((prev) => updateReaction(prev, id, "dislike"));
  };

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return comments.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, comments]);

  const totalPages = Math.ceil(comments.length / itemsPerPage);

  return (
    <div className="pb-10 font-sans text-[#262626] dark:text-[#F9FAFB] transition-colors duration-500">
      {/* Header Discussion */}
      <div className="flex items-center justify-between mb-8 border-b dark:border-[#1C2737] pb-4">
        <h3 className="text-lg font-black flex items-center gap-3">
          <MessageSquare
            size={20}
            className="text-[#A68868] dark:text-[#E3C39D]"
          />
          Comments
          <span className="text-gray-400 dark:text-[#667085] font-bold text-sm">
            ({comments.length})
          </span>
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-[#94A3B8] font-black uppercase tracking-widest cursor-pointer hover:text-black dark:hover:text-white transition-colors">
          Sort by: <span className="text-black dark:text-[#E3C39D]">Best</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <CommentInput />

      <div className="space-y-4 min-h-[300px]">
        {currentItems.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onDislike={handleDislike}
            expandedCodes={expandedCodes}
            setExpandedCodes={setExpandedCodes}
          />
        ))}
      </div>

      {/* PHÂN TRANG (Pagination) */}
      {totalPages > 0 && (
        <div className="flex justify-center mt-12 mb-8">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            size="sm"
            variant="light"
            showControls
            classNames={{
              base: "gap-2",
              cursor:
                "bg-gray-100 dark:bg-[#E3C39D] text-black dark:text-[#101828] font-black shadow-lg shadow-black/10",
            }}
            renderItem={(props) => {
              const {
                ref,
                key,
                value,
                isActive,
                onNext,
                onPrevious,
                className,
              } = props;
              const baseBtnClass =
                "min-w-[32px] h-8 rounded-xl font-black transition-all active:scale-90 flex items-center justify-center hover:dark:bg-[#1C2737]";

              if (value === PaginationItemType.NEXT)
                return (
                  <button
                    key={key}
                    className={`${className} ${baseBtnClass} dark:text-white`}
                    onClick={onNext}
                  >
                    <ChevronRight size={16} />
                  </button>
                );
              if (value === PaginationItemType.PREV)
                return (
                  <button
                    key={key}
                    className={`${className} ${baseBtnClass} dark:text-white`}
                    onClick={onPrevious}
                  >
                    <ChevronLeft size={16} />
                  </button>
                );
              if (value === PaginationItemType.DOTS)
                return (
                  <span
                    key={key}
                    className="px-2 text-gray-300 dark:text-[#475569] self-center"
                  >
                    ...
                  </span>
                );

              return (
                <button
                  key={key}
                  ref={ref}
                  onClick={() => setCurrentPage(value as number)}
                  className={`${className} ${baseBtnClass} ${
                    isActive
                      ? "bg-gray-100 dark:bg-[#E3C39D] text-black dark:text-[#101828]"
                      : "text-gray-400 dark:text-[#94A3B8] hover:text-black dark:hover:text-white"
                  } border-none`}
                >
                  {value}
                </button>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
