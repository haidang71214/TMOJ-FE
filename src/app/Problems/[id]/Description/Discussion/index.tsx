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
    color: "bg-blue-100",
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
        color: "bg-gray-100",
      },
      {
        id: 102,
        user: "Coder123",
        date: "1 day ago",
        content: "Is this O(n) or O(n log n)?",
        likes: 2,
        isLiked: false,
        isDisliked: false,
        color: "bg-gray-100",
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
    color: "bg-gray-100",
  },
  // Thêm dữ liệu để test phân trang
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: i + 3,
    user: `User_${i + 3}`,
    date: "Oct 12, 2023",
    content: "Algorithm problems are fun!",
    likes: 10 + i,
    isLiked: false,
    isDisliked: false,
    color: "bg-slate-50",
  })),
];

export const Discussion = () => {
  const [comments, setComments] = useState<CommentData[]>(INITIAL_COMMENTS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Logic Like/Dislike đệ quy (hỗ trợ cả con)
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
    <div className="mt-10 pb-10 border-t border-gray-100 pt-10 font-sans text-[#262626]">
      <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
        <MessageSquare size={20} className="text-gray-400" /> Discussion (
        {comments.length})
      </h3>

      <CommentInput />

      <div className="space-y-6 min-h-[400px]">
        {currentTableData.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </div>

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
            if (value === PaginationItemType.NEXT)
              return (
                <button key={key} className={className} onClick={onNext}>
                  <ChevronRight size={16} />
                </button>
              );
            if (value === PaginationItemType.PREV)
              return (
                <button key={key} className={className} onClick={onPrevious}>
                  <ChevronLeft size={16} />
                </button>
              );
            if (value === PaginationItemType.DOTS)
              return (
                <span key={key} className="px-2 text-gray-300 self-center">
                  ...
                </span>
              );
            return (
              <button
                key={key}
                ref={ref}
                onClick={() => setCurrentPage(value as number)}
                className={`${className} ${
                  isActive
                    ? "bg-gray-100 text-black font-bold shadow-none"
                    : "text-gray-400"
                } min-w-[32px] h-8 rounded-md`}
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
