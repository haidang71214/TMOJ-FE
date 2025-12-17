"use client";
import React from "react";
import { VideoSolution } from "./VideoSolution";
import { SolutionArticle } from "./SolutionArticle";
import { EditorialDiscussion } from "./EditorialDiscussion";

export const EditorialTab = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 text-[#262626] no-scrollbar flex flex-col gap-10">
      <VideoSolution />
      <div className="border-t border-gray-100 pt-10">
        <SolutionArticle />
      </div>
      <div className="border-t border-gray-100 pt-10">
        <EditorialDiscussion />
      </div>
    </div>
  );
};
