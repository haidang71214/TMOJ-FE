"use client";
import React, { useRef } from "react";
import { VideoSolution } from "./VideoSolution";
import { SolutionArticle } from "./SolutionArticle";
import { EditorialDiscussion } from "./EditorialDiscussion";
import { EditorialActionBar } from "./EditorialActionBar";
export const EditorialTab = () => {
  const commentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C2737] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 text-[#262626] no-scrollbar flex flex-col gap-10">
        <VideoSolution />
        <div className="border-t border-gray-100 pt-10">
          <SolutionArticle />
        </div>
        <div ref={commentRef} className="border-t border-gray-100 pt-10">
          <EditorialDiscussion />
        </div>
      </div>
      <EditorialActionBar
        initialUpvotes={4900}
        initialComments="2.7K"
        commentSectionRef={commentRef}
      />
    </div>
  );
};
