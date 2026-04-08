"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Pagination, PaginationItemType, Spinner } from "@heroui/react";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { toast } from "sonner";
import {
  useGetProblemDiscussionsQuery,
  useCreateDiscussionMutation,
  useVoteCommentMutation,
  useVoteDiscussionMutation,
} from "@/store/queries/discussion";

interface DiscussionProps {
  problemId: string;
  currentUserId: string | undefined; // From auth context or props
}

export const Discussion = ({ problemId, currentUserId }: DiscussionProps) => {
  const { data: discussionResponse, isLoading, isError } = useGetProblemDiscussionsQuery({ problemId });
  const [createDiscussion] = useCreateDiscussionMutation();
  const [voteComment] = useVoteCommentMutation();
  const [voteDiscussion] = useVoteDiscussionMutation();
  
  const [comments, setComments] = useState<any[]>([]);
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
    data: any[],
    id: string,
    action: "like" | "dislike" | "edit" | "hideToggle" | "addReply",
    payload?: any
  ): any[] => {
    return data.map((c) => {
      const currentId = c.commentId || c.id;
      if (currentId === id) {
        if (action === "like") {
           const oldVote = c.userVote || 0;
           const newVote = oldVote === 1 ? 0 : 1;
           const voteDiff = newVote - oldVote;
           return {
             ...c,
             voteCount: (c.voteCount || 0) + voteDiff,
             userVote: newVote,
           };
         }
         if (action === "dislike") {
           const oldVote = c.userVote || 0;
           const newVote = oldVote === -1 ? 0 : -1;
           const voteDiff = newVote - oldVote;
           return {
             ...c,
             voteCount: (c.voteCount || 0) + voteDiff,
             userVote: newVote,
             isHidden: newVote === -1 ? true : c.isHidden, // Keep hidden if downvoted
           };
         }
         if (action === "edit") {
           return { ...c, content: payload };
         }
         if (action === "hideToggle") {
           return { ...c, isHidden: payload };
         }
         if (action === "addReply") {
           const repliesKey = c.children !== undefined ? 'children' : c.comments !== undefined ? 'comments' : 'replies';
           const childs = c[repliesKey] || [];
           return {
             ...c,
             repliesCount: (c.repliesCount || 0) + 1,
             [repliesKey]: [...childs, payload],
           };
         }
      }
      
      const childArray = c.children || c.comments || c.replies;
      if (childArray) {
        const repliesKey = c.children !== undefined ? 'children' : c.comments !== undefined ? 'comments' : 'replies';
        return { ...c, [repliesKey]: updateCommentState(childArray, id, action, payload) };
      }
      return c;
    });
  };

  const handleLike = async (id: string) => {
    setComments((prev) => updateCommentState(prev, id, "like"));
    try {
      const isTopLevel = comments.some(c => (c.id || c.commentId) === id);
      if (isTopLevel) {
        await voteDiscussion({ id, voteType: 1 }).unwrap();
      } else {
        await voteComment({ id, voteType: 1 }).unwrap();
      }
      toast.success("Đã vote thành công!");
    } catch (error: any) {
      toast.error("Lỗi Vote: " + JSON.stringify(error?.data || error?.message || error));
    }
  };

  const handleDownvote = async (id: string) => {
    setComments((prev) => updateCommentState(prev, id, "dislike"));
    try {
      const isTopLevel = comments.some(c => (c.id || c.commentId) === id);
      if (isTopLevel) {
        await voteDiscussion({ id, voteType: -1 }).unwrap();
      } else {
        await voteComment({ id, voteType: -1 }).unwrap();
      }
      toast.success("Đã downvote thành công!");
    } catch (error: any) {
      toast.error("Lỗi Vote: " + JSON.stringify(error?.data || error?.message || error));
    }
  };

  const handleEdit = (id: string, newContent: string) => {
    setComments((prev) => updateCommentState(prev, id, "edit", newContent));
  };

  const handleHide = (id: string, isHidden: boolean) => {
    setComments((prev) => updateCommentState(prev, id, "hideToggle", isHidden));
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
      .filter((c) => {
        if (c.isDisliked) return false;
        if (c.isHidden && c.userId !== currentUserId) return false;
        return true;
      })
      .map((c) => {
        const id = c.id || c.commentId;
        const childArray = c.children || c.comments || c.replies;
        const repliesKey = c.children !== undefined ? 'children' : c.comments !== undefined ? 'comments' : 'replies';
        return {
          ...c,
          id,
          [repliesKey]: processComments(childArray),
        };
      })
      .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
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
            key={comment.id || comment.commentId}
            comment={comment}
            discussionId={comment.discussionId || comment.id || comment.commentId}
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
