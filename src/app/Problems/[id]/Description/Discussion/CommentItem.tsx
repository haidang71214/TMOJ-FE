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
    <div className="flex gap-4 border-b border-gray-50 pb-6 group">
      <Avatar
        size="sm"
        name={comment.user[0]}
        className={`${comment.color} font-bold shrink-0`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
              {comment.user}
            </span>
            <span className="text-[11px] text-gray-400">| {comment.date}</span>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="invisible group-hover:visible p-1 hover:bg-gray-100 rounded-md">
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Action">
              <DropdownItem
                key="report"
                startContent={<Flag size={14} />}
                color="danger"
                className="text-danger"
              >
                Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <p className="text-sm text-gray-600 mb-3">{comment.content}</p>

        <div className="flex items-center gap-6 text-gray-400">
          <div
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1.5 cursor-pointer ${
              comment.isLiked ? "text-blue-600 font-bold" : ""
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
          <ThumbsDown
            size={14}
            onClick={() => onDislike(comment.id)}
            fill={comment.isDisliked ? "currentColor" : "none"}
            className={`cursor-pointer ${
              comment.isDisliked ? "text-orange-600" : ""
            }`}
          />
          {comment.repliesCount && (
            <div
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500"
            >
              <MessageCircle size={14} />
              <span className="text-[11px] font-bold">
                {showReplies ? "Hide" : `Show ${comment.repliesCount}`} Replies
              </span>
            </div>
          )}
          <div
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 font-bold text-[11px]"
          >
            <Share2 size={14} className="-scale-x-100" /> Reply
          </div>
        </div>

        {isReplying && (
          <CommentInput
            isReply
            targetUser={comment.user}
            onCancel={() => setIsReplying(false)}
          />
        )}

        {showReplies && comment.replies && (
          <div className="mt-6 ml-4 pl-6 border-l-2 border-gray-100 space-y-6">
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
