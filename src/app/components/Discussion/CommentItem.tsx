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
  onLike: (id: string, voteType: number) => void;
  onDownvote: (id: string, voteType: number) => void;
  onEditSuccess: (id: string, newContent: string) => void;
  onHideSuccess: (id: string, isHidden: boolean) => void;
  onReplySuccess: (parentId: string | null, newComment: any) => void;
  depth?: number;
}

import { useUpdateCommentMutation, useHideCommentMutation, useGetDiscussionCommentsQuery, useUpdateDiscussionMutation } from "@/store/queries/discussion";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { toast } from "sonner";

export const CommentItem = ({ comment, discussionId, currentUserId: propUserId, onLike, onDownvote, onEditSuccess, onHideSuccess, onReplySuccess, depth = 0 }: Props) => {
  const { data: userData } = useGetUserInformationQuery();
  const currentUserId = userData?.userId || (userData as any)?.id || propUserId;

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
  const cid = comment.id || comment.commentId;

  const { data: fetchedRepliesData } = useGetDiscussionCommentsQuery(
    { id: cid },
    { skip: !cid || (!showReplies && !comment?.replies && !comment?.children && !comment?.comments) }
  );

  const serverReplies = fetchedRepliesData?.data 
    ? (fetchedRepliesData.data as any[]).map((c: any) => ({ ...c, id: c.id || c.commentId }))
    : null;
  const childComments = serverReplies || comment?.children || comment?.comments || comment?.replies;

  // Robust ID check for children and self
  const myIds = [
    String(userData?.userId || ""),
    String((userData as any)?.id || ""),
    String(currentUserId || ""),
  ].filter(v => v && v !== "undefined" && v !== "null");

  const processChildComments = (list: any[]): any[] => {
    if (!list) return [];
    return list
      .map((c) => ({ ...c, id: c.id || c.commentId }))
      .filter((c) => {
        const cOwnerIds = [
          String(c.userId || ""),
          String(c.creatorId || ""),
          String(c.authorId || ""),
          String(c.user?.id || ""),
          String(c.author?.id || ""),
        ].filter(v => v && v !== "undefined" && v !== "null");

        const isOwner = myIds.some(id => cOwnerIds.includes(id));
        if (c.isHidden && !isOwner) return false;
        return true;
      })
      .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  };

  const processedChildren = processChildComments(childComments);

  const commentOwnerIds = [
    String(comment.userId || ""),
    String(comment.creatorId || ""),
    String(comment.authorId || ""),
    String((comment as any).user?.id || ""),
    String((comment as any).author?.id || ""),
  ].filter(v => v && v !== "undefined" && v !== "null");

  const isMe = myIds.length > 0 && myIds.some(id => commentOwnerIds.includes(id));

  const isTopLevel = !!comment.problemId || (!comment.discussionId && !comment.parentId);

  const displayName = isMe 
    ? (currentUser?.displayName || currentUser?.lastName || currentUser?.email || "My Account") 
    : (comment?.userDisplayName || comment?.userFullName || comment?.user?.displayName || `User ${comment?.userId?.substring(0, 5)}`);
    
  const displayAvatar = isMe 
    ? (currentUser?.avatarUrl || displayName?.[0]) 
    : (comment?.userAvatarUrl || comment?.userAvatar || comment?.user?.avatarUrl || displayName?.[0] || "?");

  return (
    <div className={`flex gap-4 border-b border-gray-50 dark:border-[#1C2737] pb-6 group transition-colors duration-500 ${comment.isHidden ? "opacity-60" : ""}`}>
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
                    label: comment.isHidden ? "Hủy ẩn (Unhide)" : "Ẩn (Hide)",
                    icon: <EyeOff size={14} />,
                    color: "warning" as const,
                    className: "text-warning font-bold",
                    onClick: async () => {
                      try {
                        const newIsHidden = !comment.isHidden;
                        const res = await hideComment({ commentId: cid, isHidden: newIsHidden }).unwrap();
                        checkResponse(res);
                        toast.success(newIsHidden ? "Đã ẩn bình luận" : "Đã hủy ẩn bình luận");
                        onHideSuccess(cid, newIsHidden);
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
                      id: cid, 
                      content: newContent, 
                      title: comment.title || "Discussion" 
                    }).unwrap();
                  } else {
                    res = await updateComment({ 
                      commentId: cid, 
                      content: newContent 
                    }).unwrap();
                  }
                  checkResponse(res);
                  toast.success(isTopLevel ? "Cập nhật thảo luận thành công" : "Cập nhật bình luận thành công");
                  onEditSuccess(cid, newContent);
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
                const newVote = comment.userVote === 1 ? 0 : 1;
                onLike(cid, newVote);
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
                const newVote = comment.userVote === -1 ? 0 : -1;
                onDownvote(cid, newVote);
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

          {(comment.repliesCount || processedChildren?.length) ? (
            <div
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 dark:hover:text-[#E3C39D] transition-colors"
            >
              <MessageCircle size={14} />
              <span className="text-[11px] font-bold uppercase tracking-tighter">
                {showReplies ? "Hide" : `Show ${comment.repliesCount || processedChildren?.length || 0}`} Replies
              </span>
            </div>
          ) : null}

          {depth < 3 && (
            <div
              onClick={() => setIsReplying(!isReplying)}
              className={`flex items-center gap-1.5 cursor-pointer hover:text-blue-500 dark:hover:text-[#E3C39D] font-black text-[11px] uppercase tracking-tighter transition-colors ${
                isReplying ? "text-blue-600 dark:text-[#E3C39D]" : ""
              }`}
            >
              <Share2 size={14} className="-scale-x-100" /> Reply
            </div>
          )}
        </div>

        {/* Input Reply */}
        {isReplying && (
          <div className="mt-4">
            <CommentInput
              isReply
              targetUser={displayName}
              discussionId={discussionId}
              parentId={comment.problemId ? undefined : cid}
              userId={myIds[0] || currentUserId}
              onCancel={() => setIsReplying(false)}
              onSuccess={(newComment) => {
                setIsReplying(false);
                setShowReplies(true);
                if (newComment) {
                  onReplySuccess(cid, newComment);
                }
              }}
            />
          </div>
        )}

        {/* Nested Replies Rendering */}
        {showReplies && processedChildren && (
          <div className="mt-6 ml-2 pl-6 border-l-2 border-gray-100 dark:border-[#1C2737] space-y-6 animate-in slide-in-from-left-2 duration-300">
            {processedChildren.map((reply: any) => (
              <CommentItem
                key={reply.id || reply.commentId}
                comment={reply}
                discussionId={discussionId}
                currentUserId={currentUserId}
                depth={depth + 1}
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
