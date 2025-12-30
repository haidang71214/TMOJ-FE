"use client";
import React, { useState } from "react";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MoreHorizontal,
  Flag,
  Share2,
} from "lucide-react";
import { CommentData } from "./types";
import { CommentInput } from "./CommentInput";

interface Props {
  comment: CommentData;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
}

export const CommentItem = ({ comment, onLike, onDislike }: Props) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="flex gap-4 border-b border-gray-50 dark:border-[#1C2737] pb-6 group transition-colors duration-500">
      <Avatar
        size="sm"
        name={comment.user[0]}
        className={`${comment.color} font-black shrink-0 shadow-sm`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900 dark:text-[#F9FAFB] hover:text-blue-600 dark:hover:text-[#E3C39D] cursor-pointer transition-colors">
              {comment.user}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-[#667085] font-bold">
              | {comment.date}
            </span>
          </div>

          <Dropdown
            placement="bottom-end"
            classNames={{ content: "dark:bg-[#1C2737] dark:border-[#334155]" }}
          >
            <DropdownTrigger>
              <button className="invisible group-hover:visible p-1 hover:bg-gray-100 dark:hover:bg-[#1C2737] rounded-md transition-all">
                <MoreHorizontal
                  size={16}
                  className="text-gray-400 dark:text-[#94A3B8]"
                />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Action" variant="flat">
              <DropdownItem
                key="report"
                startContent={<Flag size={14} />}
                color="danger"
                className="text-danger font-bold"
              >
                Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <p className="text-[14px] text-gray-600 dark:text-[#CDD5DB] mb-3 leading-relaxed">
          {comment.content}
        </p>

        {/* Nút Action: Like, Dislike, Reply */}
        <div className="flex items-center gap-6 text-gray-400 dark:text-[#94A3B8]">
          <div
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              comment.isLiked
                ? "text-blue-600 dark:text-[#E3C39D] font-black"
                : "hover:dark:text-white"
            }`}
          >
            <ThumbsUp
              size={14}
              fill={comment.isLiked ? "currentColor" : "none"}
              className="transition-transform active:scale-125"
            />
            <span className="text-[11px] font-bold">
              {comment.likes.toLocaleString()}
            </span>
          </div>

          <div
            onClick={() => onDislike(comment.id)}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              comment.isDisliked
                ? "text-orange-600 dark:text-orange-400"
                : "hover:dark:text-white"
            }`}
          >
            <ThumbsDown
              size={14}
              fill={comment.isDisliked ? "currentColor" : "none"}
              className="transition-transform active:scale-125"
            />
          </div>

          {comment.repliesCount ? (
            <div
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 dark:hover:text-[#E3C39D] transition-colors"
            >
              <MessageCircle size={14} />
              <span className="text-[11px] font-bold uppercase tracking-tighter">
                {showReplies ? "Hide" : `Show ${comment.repliesCount}`} Replies
              </span>
            </div>
          ) : null}

          <div
            onClick={() => setIsReplying(!isReplying)}
            className={`flex items-center gap-1.5 cursor-pointer hover:text-blue-500 dark:hover:text-[#E3C39D] font-black text-[11px] uppercase tracking-tighter transition-colors ${
              isReplying ? "text-blue-600 dark:text-[#E3C39D]" : ""
            }`}
          >
            <Share2 size={14} className="-scale-x-100" /> Reply
          </div>
        </div>

        {/* Input Reply */}
        {isReplying && (
          <div className="mt-4">
            <CommentInput
              isReply
              targetUser={comment.user}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}

        {/* Cấu trúc phân cấp Reply */}
        {showReplies && comment.replies && (
          <div className="mt-6 ml-2 pl-6 border-l-2 border-gray-100 dark:border-[#1C2737] space-y-6 animate-in slide-in-from-left-2 duration-300">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onLike={onLike}
                onDislike={onDislike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
