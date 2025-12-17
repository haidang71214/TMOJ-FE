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

  // Số lượng comment trên mỗi trang
  const itemsPerPage = 4;

  // Logic cập nhật đệ quy (Dùng để tìm ID ở bất cứ tầng nào: Cha hoặc Con)
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
      // Nếu có replies, đệ quy tiếp vào trong
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

  // Tính toán dữ liệu cắt theo trang
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return comments.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, comments]);

  // Tính tổng số trang
  const totalPages = Math.ceil(comments.length / itemsPerPage);

  return (
    <div className="pb-10 font-sans text-[#262626]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <MessageSquare size={20} className="text-gray-400" /> Comments (
          {comments.length})
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium cursor-pointer hover:text-black">
          Sort by: <span className="text-black font-bold">Best</span>{" "}
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Ô nhập comment chính */}
      <CommentInput />

      {/* Danh sách Comment */}
      <div className="space-y-8 min-h-[300px]">
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

      {/* PHÂN TRANG: Luôn hiển thị nếu có dữ liệu để bạn kiểm tra */}
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
              cursor: "bg-gray-100 text-black font-bold shadow-none",
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
                      ? "bg-gray-100 text-black font-bold"
                      : "text-gray-400"
                  } min-w-[32px] h-8 rounded-md border-none`}
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
