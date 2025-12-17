"use client";
import React from "react";
import { Chip, Button } from "@heroui/react";
import { Tag, Building2, Lightbulb, ChevronDown } from "lucide-react";

interface ContentProps {
  topicRef: React.RefObject<HTMLDivElement>;
  hintRef: React.RefObject<HTMLDivElement>;
}

export const Content = ({ topicRef, hintRef }: ContentProps) => {
  // Hàm cuộn trang mượt mà
  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article className="prose prose-sm max-w-none text-[#262626]">
      <h1 className="text-2xl font-bold mb-2">1. Two Sum</h1>

      <div className="flex items-center gap-2 mb-6 shrink-0">
        <Chip
          size="sm"
          className="bg-[#eff2f6] text-[#2cbb5d] font-bold border-none h-6"
        >
          Easy
        </Chip>

        {/* Bấm cuộn tới Topics */}
        <Button
          onClick={() => scrollTo(topicRef)}
          size="sm"
          variant="flat"
          className="bg-[#eff2f6] text-gray-500 h-6 px-2 min-w-0 font-medium hover:bg-gray-200"
          startContent={<Tag size={14} />}
        >
          Topics
        </Button>

        <Button
          size="sm"
          variant="flat"
          className="bg-[#eff2f6] text-gray-500 h-6 px-2 min-w-0 font-medium hover:bg-gray-200"
          startContent={<Building2 size={14} />}
        >
          Companies
        </Button>

        {/* Bấm cuộn tới Hint */}
        <Button
          onClick={() => scrollTo(hintRef)}
          size="sm"
          variant="flat"
          className="bg-[#eff2f6] text-[#fac213] h-6 px-2 min-w-0 font-medium hover:bg-gray-200"
          startContent={<Lightbulb size={14} />}
          endContent={<ChevronDown size={14} />}
        >
          Hint
        </Button>
      </div>

      <div className="space-y-4 mb-8 leading-relaxed text-[14px]">
        <p>
          Given an array of integers <code>nums</code> and an integer{" "}
          <code>target</code>, return{" "}
          <em>
            indices of the two numbers such that they add up to{" "}
            <code>target</code>
          </em>
          .
        </p>
        <p>
          You may assume that each input would have{" "}
          <strong>exactly one solution</strong>, and you may not use the{" "}
          <em>same</em> element twice.
        </p>
        <p>You can return the answer in any order.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#f7f8fa] p-4 rounded-lg border-l-4 border-gray-200 font-mono text-xs whitespace-pre-wrap leading-5">
          <p>
            <strong>Input:</strong> nums = [2,7,11,15], target = 9
          </p>
          <p>
            <strong>Output:</strong> [0,1]
          </p>
          <p>
            <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we
            return [0, 1].
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="font-bold text-sm mb-3">Constraints:</p>
        <ul className="list-disc ml-5 space-y-2 text-[13px] text-gray-700">
          <li>
            <code>
              2 &lt;= nums.length &lt;= 10<sup>4</sup>
            </code>
          </li>
          <li>
            <code>
              -10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup>
            </code>
          </li>
          <li>
            <strong>Only one valid answer exists.</strong>
          </li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 italic">
        <p className="text-sm">
          <strong>Follow-up:</strong> Can you come up with an algorithm that is
          less than O(n²) time complexity?
        </p>
      </div>
    </article>
  );
};
