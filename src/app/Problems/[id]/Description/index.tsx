"use client";
import React, { useRef } from "react";
import { Content } from "./Content";
import { Stats } from "./Stats";
import { Hints } from "./Hints";
import { Discussion } from "./Discussion";

export const DescriptionTab = () => {
  // Khởi tạo các điểm mốc để cuộn tới
  const topicRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 overflow-y-auto p-6 text-[#262626] no-scrollbar flex flex-col gap-2">
      <Content topicRef={topicRef} hintRef={hintRef} />
      <Stats topicRef={topicRef} />

      {/* Gắn Ref vào phần Hints */}
      <div ref={hintRef} className="scroll-mt-20">
        <Hints />
      </div>

      <Discussion />

      <div className="pt-10 pb-6 text-[12px] text-gray-400 border-t border-gray-50 mt-10">
        Copyright © 2025 LeetCode. All rights reserved.
      </div>
    </div>
  );
};
