"use client";
import React, { useState } from "react";
import { Button, Divider, Tooltip } from "@heroui/react";
import {
  MessageSquare,
  ArrowBigUp,
  ArrowBigDown,
  MoreHorizontal,
  Share2,
} from "lucide-react";

interface EditorialActionBarProps {
  initialUpvotes?: number;
  initialComments?: string;
  commentSectionRef: React.RefObject<HTMLDivElement | null>; // Ref để trỏ tới chỗ comment
}

export const EditorialActionBar = ({
  initialUpvotes = 4900,
  initialComments = "2.7K",
  commentSectionRef,
}: EditorialActionBarProps) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num;
  };

  // Hàm cuộn tới chỗ comment
  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="shrink-0 border-t border-gray-100 dark:border-[#334155] bg-white dark:bg-[#162130] px-4 py-2 flex items-center shadow-[0_-4px_12px_rgba(0,0,0,0.03)] transition-all">
      <div className="flex items-center gap-2">
        {/* Cụm Vote: Mũi tên Up/Down */}
        <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5">
          <Tooltip content="Upvote" className="font-bold text-xs">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className={`min-w-0 w-9 h-8 transition-all ${
                hasUpvoted
                  ? "text-[#FF5C00]"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onPress={() => {
                if (hasUpvoted) {
                  setUpvotes((prev) => prev - 1);
                  setHasUpvoted(false);
                } else {
                  setUpvotes((prev) => prev + (hasDownvoted ? 2 : 1));
                  setHasUpvoted(true);
                  setHasDownvoted(false);
                }
              }}
            >
              <ArrowBigUp
                size={20}
                fill={hasUpvoted ? "currentColor" : "none"}
              />
            </Button>
          </Tooltip>

          <span
            className={`text-xs font-black px-1 min-w-[30px] text-center ${
              hasUpvoted
                ? "text-[#FF5C00]"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {formatNumber(upvotes)}
          </span>

          <Tooltip content="Downvote" className="font-bold text-xs">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className={`min-w-0 w-9 h-8 transition-all ${
                hasDownvoted
                  ? "text-blue-500"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onPress={() => {
                if (hasDownvoted) {
                  setHasDownvoted(false);
                } else {
                  if (hasUpvoted) setUpvotes((prev) => prev - 1);
                  setHasDownvoted(true);
                  setHasUpvoted(false);
                }
              }}
            >
              <ArrowBigDown
                size={20}
                fill={hasDownvoted ? "currentColor" : "none"}
              />
            </Button>
          </Tooltip>
        </div>

        {/* Nút Comment - Bấm vào trỏ tới chỗ comment */}
        <Button
          size="sm"
          variant="light"
          onPress={scrollToComments}
          className="text-slate-500 dark:text-slate-400 font-bold gap-2 px-3 h-9 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
        >
          <MessageSquare size={18} strokeWidth={2.5} />
          <span className="text-xs">{initialComments}</span>
        </Button>

        <Divider
          orientation="vertical"
          className="h-5 bg-gray-200 dark:bg-slate-700 mx-1"
        />

        {/* Các nút phụ sát lề trái luôn */}
        <div className="flex items-center gap-1">
          <Tooltip content="Share">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-slate-500 dark:text-slate-400 w-9 h-9 rounded-lg"
            >
              <Share2 size={18} strokeWidth={2.5} />
            </Button>
          </Tooltip>

          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-slate-500 dark:text-slate-400 w-9 h-9 rounded-lg"
          >
            <MoreHorizontal size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};
