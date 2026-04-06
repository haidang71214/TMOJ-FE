"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Pagination, PaginationItemType, Spinner } from "@heroui/react";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { toast } from "sonner";
import { DiscussionCommentResponse } from "@/types";
import {
  useGetProblemDiscussionsQuery,
  useCreateDiscussionMutation,
  useVoteCommentMutation,
} from "@/store/queries/discussion";

interface DiscussionProps {
  problemId: string;
  currentUserId: string | undefined; // From auth context or props
}

export const Discussion = ({ problemId, currentUserId }: DiscussionProps) => {
  const { data: discussionResponse, isLoading, isError } = useGetProblemDiscussionsQuery({ problemId });
  const [createDiscussion] = useCreateDiscussionMutation();
  const [voteComment] = useVoteCommentMutation();

  const [comments, setComments] = useState<DiscussionCommentResponse[]>([]);
  const [discussionId, setDiscussionId] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    console.log("🔥 GET_PROBLEM_DISCUSSIONS trigger with Response:", discussionResponse);
    if (discussionResponse?.data) {
      const respData = discussionResponse.data as any;
      if (Array.isArray(respData)) {
        setComments(respData);
      } else if (respData && Array.isArray(respData.items)) {
        setComments(respData.items);
      } else if (respData && Array.isArray(respData.data)) {
        setComments(respData.data);
      } else if (typeof respData === "object" && respData !== null) {
        // Fallback or debug mode
        console.log("🔥 Data is an object but no 'items' array found. Keys:", Object.keys(respData));
        setComments([]);
      } else {
        setComments([]);
      }
      setDiscussionId(problemId); 
    }
  }, [discussionResponse, problemId]);

  // Centralized optimistic state updater
  const updateCommentState = (
    data: DiscussionCommentResponse[],
    id: string,
    action: "like" | "dislike" | "edit" | "hide" | "addReply",
    payload?: any
  ): DiscussionCommentResponse[] => {
    return data.map((c) => {
      if (c.id === id) {
        if (action === "like") {
          const isLiked = !c.isLiked;
          return {
            ...c,
            likesCount: isLiked ? (c.likesCount || 0) + 1 : (c.likesCount || 0) - 1,
            isLiked,
            isDisliked: false,
          };
        }
        if (action === "dislike") {
          return {
            ...c,
            isDisliked: true,
            isLiked: false,
            // Custom hidden flag to hide downvoted comments
            isHidden: true,
          } as any;
        }
        if (action === "edit") {
          return { ...c, content: payload };
        }
        if (action === "hide") {
          return { ...c, isHidden: true } as any;
        }
        if (action === "addReply") {
          return {
            ...c,
            repliesCount: (c.repliesCount || 0) + 1,
            replies: c.replies ? [...c.replies, payload] : [payload],
          };
        }
      }
      if (c.replies) {
        return { ...c, replies: updateCommentState(c.replies, id, action, payload) };
      }
      return c;
    });
  };

  const handleLike = async (id: string) => {
    setComments((prev) => updateCommentState(prev, id, "like"));
    try {
      await voteComment({ commentId: id, vote: 1 }).unwrap();
    } catch (error: any) {
      toast.error("Lỗi Vote: " + JSON.stringify(error?.data || error?.message || error));
    }
  };

  const handleDownvote = async (id: string) => {
    setComments((prev) => updateCommentState(prev, id, "dislike"));
    try {
      await voteComment({ commentId: id, vote: -1 }).unwrap();
    } catch (error: any) {
      toast.error("Lỗi Vote: " + JSON.stringify(error?.data || error?.message || error));
    }
  };

  const handleEdit = (id: string, newContent: string) => {
    setComments((prev) => updateCommentState(prev, id, "edit", newContent));
  };

  const handleHide = (id: string) => {
    setComments((prev) => updateCommentState(prev, id, "hide"));
  };

  const handleAddReply = (parentId: string | null, newComment: any) => {
    if (!parentId) {
      // Top level
      setComments((prev) => [newComment, ...prev]);
    } else {
      setComments((prev) => updateCommentState(prev, parentId, "addReply", newComment));
    }
  };

  // Helper to filter and sort
  const processComments = (list: any[]): any[] => {
    if (!list) return [];
    return list
      .filter((c) => !c.isHidden && !c.isDisliked)
      .map((c) => ({
        ...c,
        replies: processComments(c.replies),
      }))
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
  };

  const safeComments = useMemo(() => {
    return Array.isArray(comments) ? processComments(comments) : [];
  }, [comments]);

  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return safeComments.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, safeComments]);

  const totalPages = Math.ceil(safeComments.length / itemsPerPage);

  if (isLoading) return <Spinner className="w-full flex justify-center mt-10" />;
  if (isError) return <div className="text-red-500 mt-10">Failed to load discussions</div>;

  return (
    <div className="mt-10 pb-10 border-t border-gray-100 dark:border-[#1C2737] pt-10 font-sans text-[#262626] dark:text-[#F9FAFB] transition-colors duration-500">
      <h3 className="text-lg font-black mb-8 flex items-center gap-3">
        <MessageSquare
          size={20}
          className="text-[#A68868] dark:text-[#E3C39D]"
        />
        Discussion{" "}
        <span className="text-gray-400 dark:text-[#667085] font-bold">
          ({safeComments.length})
        </span>
      </h3>
    {currentUserId?
     <CommentInput 
        discussionId={discussionId} 
        userId={currentUserId} 
        onSuccess={(newComment) => handleAddReply(null, newComment)}
      />
    :<div>Phải đăng nhập mới bình luận được</div>}

      <div className="space-y-2 min-h-[400px]">
        {currentTableData.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            discussionId={comment.discussionId || comment.id}
            currentUserId={currentUserId}
            onLike={handleLike}
            onDownvote={handleDownvote}
            onEditSuccess={handleEdit}
            onHideSuccess={handleHide}
            onReplySuccess={handleAddReply}
          />
        ))}
        {safeComments.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No discussion yet. Be the first to comment!</p>
        )}
      </div>

      {/* PAGINATION AREA */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-8">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            size="sm"
            variant="light"
            showControls
            renderItem={({
              ref,
              key,
              value,
              isActive,
              onNext,
              onPrevious,
              className,
            }) => {
              const commonProps =
                "min-w-[32px] h-8 rounded-xl font-black transition-all active:scale-90 flex items-center justify-center";

              if (value === PaginationItemType.NEXT)
                return (
                  <button
                    key={key}
                    className={`${className} ${commonProps} dark:text-white dark:hover:bg-[#1C2737]`}
                    onClick={onNext}
                  >
                    <ChevronRight size={16} />
                  </button>
                );

              if (value === PaginationItemType.PREV)
                return (
                  <button
                    key={key}
                    className={`${className} ${commonProps} dark:text-white dark:hover:bg-[#1C2737]`}
                    onClick={onPrevious}
                  >
                    <ChevronLeft size={16} />
                  </button>
                );

              if (value === PaginationItemType.DOTS)
                return (
                  <span
                    key={key}
                    className="px-2 text-gray-300 dark:text-[#475569] self-center"
                  >
                    ...
                  </span>
                );

              return (
                <button
                  key={key}
                  ref={ref}
                  onClick={() => setCurrentPage(value as number)}
                  className={`${className} ${commonProps} ${
                    isActive
                      ? "bg-gray-100 dark:bg-[#E3C39D] text-black dark:text-[#101828] shadow-lg shadow-black/10"
                      : "text-gray-400 dark:text-[#94A3B8] dark:hover:bg-[#1C2737] hover:text-black dark:hover:text-white"
                  }`}
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
