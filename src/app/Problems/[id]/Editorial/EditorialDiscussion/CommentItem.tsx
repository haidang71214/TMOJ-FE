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
    <div className="flex gap-4 border-b border-gray-100 pb-8 group last:border-0">
      <Avatar
        size="sm"
        name={comment.user[0]}
        className={`${comment.color} shrink-0`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
            {comment.user}
          </span>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <MoreHorizontal
                size={16}
                className="text-gray-300 invisible group-hover:visible cursor-pointer hover:text-gray-600"
              />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="report" color="danger" className="text-danger">
                Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {comment.title && (
          <h4 className="text-md font-bold my-2">{comment.title}</h4>
        )}
        <p className="text-sm text-gray-700 mb-3">{comment.content}</p>

        {comment.code && (
          <div className="relative mt-3 mb-4 rounded-lg border border-gray-100 bg-[#f7f8fa]">
            <div className="absolute right-2 top-2 z-10">
              <Tooltip content={isCopied ? "Copied!" : "Copy"}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => handleCopy(comment.code!)}
                >
                  {isCopied ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} className="text-gray-400" />
                  )}
                </Button>
              </Tooltip>
            </div>
            <div
              className={`p-4 text-[13px] font-mono text-blue-600 transition-all ${
                !expandedCodes[comment.id]
                  ? "max-h-[100px] overflow-hidden"
                  : "max-h-none"
              }`}
            >
              <pre className="whitespace-pre-wrap">{comment.code}</pre>
            </div>
            {!expandedCodes[comment.id] && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#f7f8fa] flex items-end justify-center pb-1">
                <button
                  onClick={() =>
                    setExpandedCodes((p) => ({ ...p, [comment.id]: true }))
                  }
                  className="text-[11px] font-bold text-gray-500 hover:text-black"
                >
                  Read more
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-6 text-gray-400">
          <div
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              comment.isLiked ? "text-blue-600 font-bold" : "hover:text-black"
            }`}
          >
            <ThumbsUp
              size={14}
              fill={comment.isLiked ? "currentColor" : "none"}
            />
            <span className="text-[11px]">
              {comment.likes.toLocaleString()}
            </span>
          </div>
          <div
            onClick={() => onDislike(comment.id)}
            className={`cursor-pointer transition-colors ${
              comment.isDisliked ? "text-orange-600" : "hover:text-black"
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
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={14} />
              <span className="text-[11px] font-bold">
                {showReplies ? "Hide" : `Show ${comment.repliesCount}`} Replies
              </span>
            </div>
          )}
          <div
            onClick={() =>
              setReplyingToId(replyingToId === comment.id ? null : comment.id)
            }
            className="flex items-center gap-1 cursor-pointer hover:text-blue-500 font-bold text-[11px]"
          >
            <Share2 size={14} className="-scale-x-100" /> Reply
          </div>
        </div>

        {replyingToId === comment.id && (
          <CommentInput
            isReply
            targetUser={comment.user}
            onCancel={() => setReplyingToId(null)}
          />
        )}

        {/* RECURSIVE REPLIES (Đệ quy gọi lại chính nó) */}
        {showReplies && comment.replies && (
          <div className="mt-6 ml-4 pl-6 border-l-2 border-gray-100 space-y-8">
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
