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
  comment: any;
  discussionId: string;
  currentUserId: string | undefined;
  onLike: (id: string) => void;
  onDownvote: (id: string) => void;
  onEditSuccess: (id: string, newContent: string) => void;
  onHideSuccess: (id: string, isHidden: boolean) => void;
  onReplySuccess: (parentId: string | null, newComment: any) => void;
}

import { useUpdateCommentMutation, useHideCommentMutation, useGetDiscussionCommentsQuery, useUpdateDiscussionMutation } from "@/store/queries/discussion";
import { toast } from "sonner";

export const CommentItem = ({ comment, discussionId, currentUserId, onLike, onDownvote, onEditSuccess, onHideSuccess, onReplySuccess }: Props) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [updateComment] = useUpdateCommentMutation();
  const [updateDiscussion] = useUpdateDiscussionMutation();
  const [hideComment] = useHideCommentMutation();

  const checkResponse = (resData: any) => {
    // Only throw if data is null AND message doesn't contain "success"
    const isSuccessMessage = (msg: string) => 
      msg.toLowerCase().includes("success") || 
      msg.toLowerCase().includes("thành công");

    if (typeof resData === "string") {
      try {
        const parsed = JSON.parse(resData);
        if (parsed && parsed.data === null && parsed.message && !isSuccessMessage(parsed.message)) {
          throw new Error(parsed.message);
        }
      } catch (e) {
        if (e instanceof Error && e.message !== "Unexpected end of JSON input" && !e.message.includes("is not valid JSON")) {
          throw e;
        }
      }
    } else if (resData && resData.data === null && resData.message && !isSuccessMessage(resData.message)) {
      throw new Error(resData.message);
    }
  };
  
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const isMe = currentUserId === comment.userId;
  const isTopLevel = !!comment.problemId || (!comment.discussionId && !comment.parentId);
  
  const displayName = isMe 
    ? (currentUser?.displayName || currentUser?.lastName || currentUser?.email || "My Account") 
    : (comment?.userDisplayName || comment?.userFullName || `User ${comment?.userId?.substring(0, 5)}`);
    
  const displayAvatar = isMe 
    ? (currentUser?.avatarUrl || displayName?.[0]) 
    : (comment?.userAvatarUrl || comment?.userAvatar || comment?.userDisplayName?.[0] || "?");

  const { data: fetchedRepliesData } = useGetDiscussionCommentsQuery(
    { id: comment.id },
    { skip: !isTopLevel || (!showReplies && !comment?.replies && !comment?.children && !comment?.comments) }
  );

  const serverReplies = isTopLevel && fetchedRepliesData?.data 
    ? (fetchedRepliesData.data as any[]).map((c: any) => ({ ...c, id: c.id || c.commentId }))
    : null;
  const childComments = serverReplies || comment?.children || comment?.comments || comment?.replies;

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
                  ...(!isTopLevel ? [{
                    key: "hide",
                    label: comment.isHidden ? "Hiện (Unhide)" : "Ẩn (Hide)",
                    icon: <EyeOff size={14} />,
                    color: "warning" as const,
                    className: "text-warning font-bold",
                    onClick: async () => {
                      try {
                        const newIsHidden = !comment.isHidden;
                        const res = await hideComment({ commentId: comment.id, isHidden: newIsHidden }).unwrap();
                        checkResponse(res);
                        toast.success(newIsHidden ? "Đã ẩn bình luận" : "Đã hiện bình luận");
                        onHideSuccess(comment.id, newIsHidden);
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Lỗi khi cập nhật trạng thái hiển thị");
                      }
                    }
                  }] : [])
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
                  let res;
                  if (isTopLevel) {
                    res = await updateDiscussion({ 
                      id: comment.id, 
                      content: newContent, 
                      title: comment.title || "Discussion" 
                    }).unwrap();
                  } else {
                    res = await updateComment({ 
                      commentId: comment.id, 
                      content: newContent 
                    }).unwrap();
                  }
                  checkResponse(res);
                  toast.success(isTopLevel ? "Cập nhật thảo luận thành công" : "Cập nhật bình luận thành công");
                  onEditSuccess(comment.id, newContent);
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Lỗi cập nhật");
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
          <div className="flex items-center bg-gray-50 dark:bg-[#1C2737]/40 rounded-lg border border-gray-100 dark:border-[#334155]">
            <div
              onClick={() => {
                if (isMe) {
                  toast.error("Không thể vote bình luận của chính mình");
                  return;
                }
                onLike(comment.id || comment.commentId);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors border-r border-gray-100 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1C2737] rounded-l-lg ${
                comment.userVote === 1
                  ? "text-blue-600 dark:text-[#E3C39D] font-black"
                  : "hover:text-blue-500"
              }`}
            >
              <ThumbsUp
                size={14}
                strokeWidth={comment.userVote === 1 ? 3 : 2}
                className="transition-transform active:scale-125"
              />
              <span className="text-[12px] font-black min-w-[12px] text-center">
                {comment.voteCount || 0}
              </span>
            </div>

            <div
              onClick={() => {
                if (isMe) {
                  toast.error("Không thể vote bình luận của chính mình");
                  return;
                }
                onDownvote(comment.id || comment.commentId);
              }}
              className={`px-3 py-1 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-[#1C2737] rounded-r-lg ${
                comment.userVote === -1
                  ? "text-red-500 font-black"
                  : "hover:text-red-500"
              }`}
            >
              <ThumbsDown
                size={14}
                strokeWidth={comment.userVote === -1 ? 3 : 2}
                className="transition-transform active:scale-125"
              />
            </div>
          </div>

          {(comment.repliesCount || childComments?.length) ? (
            <div
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 dark:hover:text-[#E3C39D] transition-colors"
            >
              <MessageCircle size={14} />
              <span className="text-[11px] font-bold uppercase tracking-tighter">
                {showReplies ? "Hide" : `Show ${comment.repliesCount || childComments?.length || 0}`} Replies
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
        {showReplies && childComments && (
          <div className="mt-6 ml-2 pl-6 border-l-2 border-gray-100 dark:border-[#1C2737] space-y-6 animate-in slide-in-from-left-2 duration-300">
            {childComments.map((reply: any) => (
              <CommentItem
                key={reply.id || reply.commentId}
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
