"use client";
import React, { useState, useMemo } from "react";
import { Pagination, PaginationItemType } from "@heroui/react";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { CommentData } from "./types";

const INITIAL_COMMENTS: CommentData[] = [
  {
    id: 1,
    user: "Yu-Chia Liu",
    date: "Nov 07, 2018",
    content: "Python3 approach using Hash Map. Efficient and clean.",
    likes: 1900,
    isLiked: false,
    isDisliked: false,
    color: "bg-blue-100 dark:bg-blue-500/20",
    repliesCount: 2,
    replies: [
      {
        id: 101,
        user: "DevUser",
        date: "2 days ago",
        content: "Thanks! This helped a lot.",
        likes: 5,
        isLiked: false,
        isDisliked: false,
        color: "bg-gray-100 dark:bg-[#101828]",
      },
      {
        id: 102,
        user: "Coder123",
        date: "1 day ago",
        content: "Is this O(n) or O(n log n)?",
        likes: 2,
        isLiked: false,
        isDisliked: false,
        color: "bg-gray-100 dark:bg-[#101828]",
      },
    ],
  },
  {
    id: 2,
    user: "freeNeasy",
    date: "Sep 25, 2018",
    content: "My first leetcode solution, keeping it simple with nested loops.",
    likes: 5400,
    isLiked: false,
    isDisliked: false,
    color: "bg-gray-100 dark:bg-[#101828]",
  },
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: i + 3,
    user: `User_${i + 3}`,
    date: "Oct 12, 2023",
    content: "Algorithm problems are fun!",
    likes: 10 + i,
    isLiked: false,
    isDisliked: false,
    color: "bg-slate-50 dark:bg-[#101828]",
  })),
];

export const Discussion = () => {
  const [comments, setComments] = useState<CommentData[]>(INITIAL_COMMENTS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const updateReaction = (
    data: CommentData[],
    id: number,
    type: "like" | "dislike"
  ): CommentData[] => {
    return data.map((c) => {
      if (c.id === id) {
        if (type === "like") {
          const isLiked = !c.isLiked;
          return {
            ...c,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
            isLiked,
            isDisliked: false,
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
      if (c.replies) {
        return { ...c, replies: updateReaction(c.replies, id, type) };
      }
      return c;
    });
  };

  const handleLike = (id: number) =>
    setComments((prev) => updateReaction(prev, id, "like"));
  const handleDislike = (id: number) =>
    setComments((prev) => updateReaction(prev, id, "dislike"));

  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return comments.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, comments]);

  const totalPages = Math.ceil(comments.length / itemsPerPage);

  return (
    <div className="mt-10 pb-10 border-t border-gray-100 dark:border-[#1C2737] pt-10 font-sans text-[#262626] dark:text-[#F9FAFB] transition-colors duration-500">
      <h3 className="text-lg font-black mb-8 flex items-center gap-3">
        <MessageSquare
          size={20}
          className="text-[#A68868] dark:text-[#E3C39D]"
        />
        Discussion{" "}
        <span className="text-gray-400 dark:text-[#667085] font-bold">
          ({comments.length})
        </span>
      </h3>

      <CommentInput />

      <div className="space-y-2 min-h-[400px]">
        {currentTableData.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </div>

      {/* PAGINATION AREA */}
      <div className="flex justify-center mt-12 mb-8">
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
          size="sm"
          variant="light"
          showControls
          renderItem={({
            ref,
            key,
            value,
            isActive,
            onNext,
            onPrevious,
            className,
          }) => {
            const commonProps =
              "min-w-[32px] h-8 rounded-xl font-black transition-all active:scale-90 flex items-center justify-center";

            if (value === PaginationItemType.NEXT)
              return (
                <button
                  key={key}
                  className={`${className} ${commonProps} dark:text-white dark:hover:bg-[#1C2737]`}
                  onClick={onNext}
                >
                  <ChevronRight size={16} />
                </button>
              );

            if (value === PaginationItemType.PREV)
              return (
                <button
                  key={key}
                  className={`${className} ${commonProps} dark:text-white dark:hover:bg-[#1C2737]`}
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
                className={`${className} ${commonProps} ${
                  isActive
                    ? "bg-gray-100 dark:bg-[#E3C39D] text-black dark:text-[#101828] shadow-lg shadow-black/10"
                    : "text-gray-400 dark:text-[#94A3B8] dark:hover:bg-[#1C2737] hover:text-black dark:hover:text-white"
                }`}
              >
                {value}
              </button>
            );
          }}
        />
      </div>
    </div>
  );
};
