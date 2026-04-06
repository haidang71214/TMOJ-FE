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
  Pencil,
  EyeOff,
} from "lucide-react";
import { CommentInput } from "./CommentInput";
import { useAppSelector } from "@/utils/redux";

interface Props {
  comment: DiscussionCommentResponse;
  discussionId: string;
  currentUserId: string | undefined;
  onLike: (id: string) => void;
  onDownvote: (id: string) => void;
  onEditSuccess: (id: string, newContent: string) => void;
  onHideSuccess: (id: string) => void;
  onReplySuccess: (parentId: string | null, newComment: any) => void;
}

import { useUpdateCommentMutation, useHideCommentMutation } from "@/store/queries/discussion";
import { toast } from "sonner";
import { DiscussionCommentResponse } from "@/types";

export const CommentItem = ({ comment, discussionId, currentUserId, onLike, onDownvote, onEditSuccess, onHideSuccess, onReplySuccess }: Props) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [updateComment] = useUpdateCommentMutation();
  const [hideComment] = useHideCommentMutation();

  const checkResponse = (resData: any) => {
    if (typeof resData === "string") {
      try {
        const parsed = JSON.parse(resData);
        if (parsed && parsed.data === null && parsed.message) throw new Error(parsed.message);
      } catch (e) {
        if (e instanceof Error && e.message !== "Unexpected end of JSON input" && !e.message.includes("is not valid JSON")) {
          throw e; // Relaise custom error
        }
      }
    } else if (resData && resData.data === null && resData.message) {
      throw new Error(resData.message);
    }
  };
  
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const isMe = currentUserId === comment.userId;
  const displayName = isMe 
    ? (currentUser?.displayName || currentUser?.lastName || currentUser?.email || "My Account") 
    : (comment.userFullName || `User ${comment.userId.substring(0, 5)}`);
    
  const displayAvatar = isMe 
    ? (currentUser?.avatarUrl || displayName?.[0]) 
    : (comment.userAvatar || comment.userFullName?.[0] || "?");

  return (
    <div className="flex gap-4 border-b border-gray-50 dark:border-[#1C2737] pb-6 group transition-colors duration-500">
      <Avatar
        size="sm"
        name={displayAvatar}
        className={`bg-blue-100 dark:bg-blue-500/20 font-black shrink-0 shadow-sm`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900 dark:text-[#F9FAFB] hover:text-blue-600 dark:hover:text-[#E3C39D] cursor-pointer transition-colors">
              {displayName}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-[#667085] font-bold">
              | {new Date(comment.createdAt).toLocaleDateString()}
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
              {[
                ...(isMe ? [
                  {
                    key: "edit",
                    label: "Chỉnh sửa",
                    icon: <Pencil size={14} />,
                    onClick: () => setIsEditing(true),
                    className: "font-bold"
                  },
                  {
                    key: "hide",
                    label: "Ẩn",
                    icon: <EyeOff size={14} />,
                    color: "warning" as const,
                    className: "text-warning font-bold",
                    onClick: async () => {
                      try {
                        const res = await hideComment({ commentId: comment.id }).unwrap();
                        checkResponse(res);
                        toast.success("Đã ẩn bình luận");
                        onHideSuccess(comment.id);
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Lỗi khi ẩn bình luận");
                      }
                    }
                  }
                ] : []),
                {
                  key: "report",
                  label: "Báo cáo",
                  icon: <Flag size={14} />,
                  color: "danger" as const,
                  className: "text-danger font-bold"
                }
              ].map((item) => (
                <DropdownItem
                  key={item.key}
                  startContent={item.icon}
                  onClick={item.onClick}
                  color={item.color}
                  className={item.className}
                >
                  {item.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {isEditing ? (
          <div className="mb-3">
            <CommentInput
              isEdit
              initialContent={comment.content}
              discussionId={discussionId}
              userId={currentUserId}
              onCancel={() => setIsEditing(false)}
              onSaveEdit={async (newContent) => {
                try {
                  const res = await updateComment({ commentId: comment.id, content: newContent }).unwrap();
                  checkResponse(res);
                  toast.success("Cập nhật bình luận thành công");
                  onEditSuccess(comment.id, newContent);
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Lỗi cập nhật bình luận");
                }
              }}
            />
          </div>
        ) : (
          <p className="text-[14px] text-gray-600 dark:text-[#CDD5DB] mb-3 leading-relaxed">
            {comment.content}
          </p>
        )}

        {/* Action Buttons: Vote, Reply */}
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
              size={16}
              strokeWidth={comment.isLiked ? 3 : 2}
              className="transition-transform active:scale-125"
            />
            <span className="text-[11px] font-bold tracking-wider">
              {(comment.likesCount || 0) > 0 ? `${(comment.likesCount || 0).toLocaleString()} VOTE${(comment.likesCount || 0) > 1 ? 'S' : ''}` : "VOTE"}
            </span>
          </div>

          <div
            onClick={() => onDownvote(comment.id)}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              comment.isDisliked
                ? "text-red-500 dark:text-red-400 font-black"
                : "hover:dark:text-white"
            }`}
          >
            <ThumbsDown
              size={16}
              strokeWidth={comment.isDisliked ? 3 : 2}
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
              targetUser={displayName}
              discussionId={discussionId}
              parentId={comment.discussionId ? comment.id : undefined}
              userId={currentUserId}
              onCancel={() => setIsReplying(false)}
              onSuccess={(newComment) => {
                setIsReplying(false);
                setShowReplies(true);
                if (newComment) {
                  onReplySuccess(comment.id, newComment);
                }
              }}
            />
          </div>
        )}

        {/* Nested Replies Rendering */}
        {showReplies && comment.replies && (
          <div className="mt-6 ml-2 pl-6 border-l-2 border-gray-100 dark:border-[#1C2737] space-y-6 animate-in slide-in-from-left-2 duration-300">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                discussionId={discussionId}
                currentUserId={currentUserId}
                onLike={onLike}
                onDownvote={onDownvote}
                onEditSuccess={onEditSuccess}
                onHideSuccess={onHideSuccess}
                onReplySuccess={onReplySuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
