"use client";
import React, { useRef } from "react";
import { Content } from "./Content";
import { Stats } from "./Stats";
import { Hints } from "./Hints";
import { Discussion } from "./Discussion";
import { DescriptionActionBar } from "./DescriptionActionBar";
export const DescriptionTab = () => {
  // Khởi tạo các điểm mốc để cuộn tới
  const topicRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const discussionRef = useRef<HTMLDivElement>(null);
  const handleScrollToDiscussion = () => {
    discussionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C2737] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 text-[#262626] no-scrollbar flex flex-col gap-2">
        <Content topicRef={topicRef} hintRef={hintRef} />
        <Stats topicRef={topicRef} />

        {/* Gắn Ref vào phần Hints */}
        <div ref={hintRef} className="scroll-mt-20">
          <Hints />
        </div>

        <div ref={discussionRef} className="scroll-mt-20">
          <Discussion />
        </div>
      </div>

      <DescriptionActionBar
        onCommentClick={handleScrollToDiscussion}
        initialUpvotes={6730}
        initialComments="1.8K"
      />
    </div>
  );
};
