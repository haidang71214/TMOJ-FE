"use client";

import React, { useState } from "react";
import { Avatar, Spinner } from "@heroui/react";
import { useCreateDiscussionMutation, useCreateCommentMutation } from "@/store/queries/discussion";
import { useAppSelector } from "@/utils/redux";
import { toast } from "sonner";

interface CommentInputProps {
  isReply?: boolean;
  isEdit?: boolean;
  initialContent?: string;
  targetUser?: string;
  discussionId: string;
  parentId?: string;
  userId: string | undefined;
  onCancel?: () => void;
  onSuccess?: (newComment?: any) => void;
  onSaveEdit?: (content: string) => Promise<void>;
}

export const CommentInput = ({
  isReply,
  isEdit,
  initialContent = "",
  targetUser,
  discussionId,
  parentId,
  userId,
  onCancel,
  onSuccess,
  onSaveEdit,
}: CommentInputProps) => {
  const [content, setContent] = useState(initialContent);

  const user = useAppSelector((state) => state.auth.user);
  const [createDiscussion, { isLoading: isCreatingDiscussion }] = useCreateDiscussionMutation();
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isSubmitting = isCreatingDiscussion || isCreatingComment || isUpdating;

  const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() || !userId) return;

    try {
      if (isEdit && onSaveEdit) {
        setIsUpdating(true);
        await onSaveEdit(content.trim());
        setIsUpdating(false);
        setContent("");
        if (onSuccess) onSuccess();
        if (onCancel) onCancel();
        return;
      }

      if (isReply) {
        // Post a reply (comment)
        const payload: any = {
          content: content.trim(),
        };
        if (parentId) {
          payload.parentId = parentId;
          payload.id = parentId;
        }
        console.log("🔥 Payload for CREATE_COMMENT:", payload);
        const res = await createComment({ discussionId, ...payload }).unwrap();
        console.log("🔥 Response from CREATE_COMMENT:", res);
        if (res && res.data === null && res.message) {
          throw new Error(res.message);
        }
        toast.success("Bình luận đã được gửi");
        if (onSuccess) {
          onSuccess({
            id: typeof res.data === 'string' ? res.data : (res.data as any)?.commentId || (res.data as any)?.id || generateGuid(),
            content: content.trim(),
            userId,
            discussionId,
            parentId: parentId || null,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Post a top-level discussion
        // discussionId prop here holds the problemId in index.tsx
        const payload = {
          problemId: discussionId,
          userId,
          content: content.trim(),
          title: "Discussion", // Optional title
        };
        console.log("🔥 Payload for CREATE_DISCUSSION:", payload);
        const res = await createDiscussion(payload).unwrap();
        console.log("🔥 Response from CREATE_DISCUSSION:", res);
        if (res && res.data === null && res.message) {
          throw new Error(res.message);
        }
        toast.success("Đã đăng bình luận");
        if (onSuccess) {
          onSuccess({
            id: typeof res.data === 'string' ? res.data : (res.data as any)?.id || (res.data as any)?.commentId || generateGuid(),
            content: content.trim(),
            userId,
            discussionId: generateGuid(),
            createdAt: new Date().toISOString(),
            repliesCount: 0,
            likesCount: 0
          });
        }
      }

      setContent("");
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Lỗi Reply: " + (error instanceof Error ? error.message : JSON.stringify((error as any)?.data || (error as any)?.message || error)));
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2 w-full">
      {isReply && targetUser && (
        <span className="text-sm text-gray-500">
          Đang trả lời: <span className="font-bold text-blue-500">@{targetUser}</span>
        </span>
      )}
      
      <div className="flex items-start gap-3">
        <Avatar
          size="sm"
          name={user?.displayName?.[0] || user?.lastName?.[0] || user?.email?.[0] || "?"}
          className="bg-gray-100 text-gray-500 font-bold shrink-0 mt-1"
        />
        <textarea
          className="flex-1 w-full p-2 text-sm border rounded-md dark:bg-[#1C2737] dark:border-[#334155] dark:text-white outline-none focus:border-blue-500 min-h-[80px]"
          placeholder="Viết bình luận của bạn..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Hủy
          </button>
        )}
        <button 
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="px-4 py-1.5 flex items-center gap-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting && <Spinner size="sm" color="white" />}
          {isEdit ? "Lưu chỉnh sửa" : isReply ? "Trả lời" : "Gửi bình luận"}
        </button>
      </div>
    </div>
  );
};
