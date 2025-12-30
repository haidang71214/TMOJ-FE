"use client";

import React, { useState } from "react";
import {
  Avatar,
  Button,
  Tooltip,
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
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { CommentData } from "./types";
import { CommentInput } from "./CommentInput";

interface Props {
  comment: CommentData;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  expandedCodes: Record<number, boolean>;
  setExpandedCodes: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
}

export const CommentItem = ({
  comment,
  onLike,
  onDislike,
  expandedCodes,
  setExpandedCodes,
}: Props) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex gap-4 border-b border-gray-100 dark:border-[#334155] pb-8 group last:border-0 transition-colors duration-500">
      <Avatar
        size="sm"
        name={comment.user[0]}
        className={`${comment.color} shrink-0 font-bold dark:ring-1 dark:ring-white/10`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-black text-gray-900 dark:text-[#F9FAFB] hover:text-blue-600 dark:hover:text-[#E3C39D] cursor-pointer transition-colors">
            {comment.user}
          </span>
          <Dropdown
            placement="bottom-end"
            className="dark:bg-[#101828] dark:border-[#334155]"
          >
            <DropdownTrigger>
              <MoreHorizontal
                size={16}
                className="text-gray-300 dark:text-[#475569] invisible group-hover:visible cursor-pointer hover:text-gray-600 dark:hover:text-white transition-all"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Comment Actions">
              <DropdownItem
                key="report"
                color="danger"
                className="text-danger font-bold"
              >
                Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {comment.title && (
          <h4 className="text-md font-black my-2 text-gray-900 dark:text-white tracking-tight italic">
            {comment.title}
          </h4>
        )}
        <p className="text-sm text-gray-700 dark:text-[#CDD5DB] mb-3 leading-relaxed">
          {comment.content}
        </p>

        {/* Khối Code Snippet */}
        {comment.code && (
          <div className="relative mt-3 mb-4 rounded-xl border border-gray-100 dark:border-[#334155] bg-[#f7f8fa] dark:bg-[#101828] overflow-hidden shadow-inner">
            <div className="absolute right-2 top-2 z-10">
              <Tooltip
                content={isCopied ? "Copied!" : "Copy"}
                className="dark:bg-[#101828] dark:text-white border dark:border-[#334155]"
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="hover:bg-white dark:hover:bg-[#1C2737]"
                  onClick={() => handleCopy(comment.code!)}
                >
                  {isCopied ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy
                      size={14}
                      className="text-gray-400 dark:text-[#475569]"
                    />
                  )}
                </Button>
              </Tooltip>
            </div>
            <div
              className={`p-4 text-[13px] font-mono text-blue-600 dark:text-[#E3C39D] transition-all duration-500 ${
                !expandedCodes[comment.id]
                  ? "max-h-[120px] overflow-hidden"
                  : "max-h-none"
              }`}
            >
              <pre className="whitespace-pre-wrap">{comment.code}</pre>
            </div>

            {/* Gradient phủ mờ khi chưa expand */}
            {!expandedCodes[comment.id] && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f7f8fa] dark:from-[#101828] to-transparent flex items-end justify-center pb-2">
                <button
                  onClick={() =>
                    setExpandedCodes((p) => ({ ...p, [comment.id]: true }))
                  }
                  className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-[#94A3B8] hover:text-black dark:hover:text-white transition-colors"
                >
                  Read more
                </button>
              </div>
            )}
          </div>
        )}

        {/* Thanh Reaction & Actions */}
        <div className="flex items-center gap-6 text-gray-400 dark:text-[#94A3B8]">
          <div
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1.5 cursor-pointer transition-all active:scale-110 ${
              comment.isLiked
                ? "text-blue-600 dark:text-[#E3C39D] font-black"
                : "hover:text-black dark:hover:text-white"
            }`}
          >
            <ThumbsUp
              size={14}
              fill={comment.isLiked ? "currentColor" : "none"}
            />
            <span className="text-[11px] font-bold">
              {comment.likes.toLocaleString()}
            </span>
          </div>

          <div
            onClick={() => onDislike(comment.id)}
            className={`cursor-pointer transition-all active:scale-110 ${
              comment.isDisliked
                ? "text-orange-600 dark:text-orange-400"
                : "hover:text-black dark:hover:text-white"
            }`}
          >
            <ThumbsDown
              size={14}
              fill={comment.isDisliked ? "currentColor" : "none"}
            />
          </div>

          {comment.repliesCount && (
            <div
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 dark:hover:text-[#E3C39D] transition-colors"
            >
              <MessageCircle size={14} />
              <span className="text-[11px] font-black uppercase tracking-tighter">
                {showReplies ? "Hide" : `Show ${comment.repliesCount}`} Replies
              </span>
            </div>
          )}

          <div
            onClick={() =>
              setReplyingToId(replyingToId === comment.id ? null : comment.id)
            }
            className={`flex items-center gap-1 cursor-pointer hover:text-blue-500 dark:hover:text-[#E3C39D] font-black text-[11px] uppercase tracking-tighter transition-colors ${
              replyingToId === comment.id
                ? "text-blue-500 dark:text-[#E3C39D]"
                : ""
            }`}
          >
            <Share2 size={14} className="-scale-x-100" /> Reply
          </div>
        </div>

        {/* Input trả lời */}
        {replyingToId === comment.id && (
          <div className="mt-4 animate-in fade-in zoom-in-95 duration-200">
            <CommentInput
              isReply
              targetUser={comment.user}
              onCancel={() => setReplyingToId(null)}
            />
          </div>
        )}

        {/* Recursive Replies */}
        {showReplies && comment.replies && (
          <div className="mt-6 ml-2 pl-6 border-l-2 border-gray-100 dark:border-[#334155] space-y-8 animate-in slide-in-from-left-2 duration-300">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onLike={onLike}
                onDislike={onDislike}
                expandedCodes={expandedCodes}
                setExpandedCodes={setExpandedCodes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
