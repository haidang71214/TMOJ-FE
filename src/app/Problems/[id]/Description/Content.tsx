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
    <article className="prose prose-sm max-w-none text-[#262626] dark:text-[#F9FAFB] transition-colors duration-500">
      <h1 className="text-2xl font-black mb-2 dark:text-white">1. Two Sum</h1>

      <div className="flex items-center gap-2 mb-6 shrink-0">
        <Chip
          size="sm"
          className="bg-[#eff2f6] dark:bg-[#2cbb5d]/10 text-[#2cbb5d] font-bold border-none h-6"
        >
          Easy
        </Chip>

        {/* Bấm cuộn tới Topics */}
        <Button
          onClick={() => scrollTo(topicRef)}
          size="sm"
          variant="flat"
          className="bg-[#eff2f6] dark:bg-[#101828] text-gray-500 dark:text-[#94A3B8] h-6 px-2 min-w-0 font-bold hover:bg-gray-200 dark:hover:bg-[#334155] transition-all"
          startContent={<Tag size={14} />}
        >
          Topics
        </Button>

        <Button
          size="sm"
          variant="flat"
          className="bg-[#eff2f6] dark:bg-[#101828] text-gray-500 dark:text-[#94A3B8] h-6 px-2 min-w-0 font-bold hover:bg-gray-200 dark:hover:bg-[#334155] transition-all"
          startContent={<Building2 size={14} />}
        >
          Companies
        </Button>

        {/* Bấm cuộn tới Hint */}
        <Button
          onClick={() => scrollTo(hintRef)}
          size="sm"
          variant="flat"
          className="bg-[#eff2f6] dark:bg-[#101828] text-[#fac213] h-6 px-2 min-w-0 font-bold hover:bg-gray-200 dark:hover:bg-[#334155] transition-all"
          startContent={<Lightbulb size={14} />}
          endContent={<ChevronDown size={14} />}
        >
          Hint
        </Button>
      </div>

      <div className="space-y-4 mb-8 leading-relaxed text-[14px] dark:text-[#F1F5F9]">
        <p>
          Given an array of integers{" "}
          <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
            nums
          </code>{" "}
          and an integer{" "}
          <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
            target
          </code>
          , return{" "}
          <em className="text-[#071739] dark:text-[#E3C39D] font-medium">
            indices of the two numbers such that they add up to{" "}
            <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
              target
            </code>
          </em>
          .
        </p>
        <p>
          You may assume that each input would have{" "}
          <strong className="dark:text-white font-black">
            exactly one solution
          </strong>
          , and you may not use the <em className="italic">same</em> element
          twice.
        </p>
        <p>You can return the answer in any order.</p>
      </div>

      {/* Example Box - Làm sáng hơn nền chính để tách biệt khối 3D */}
      <div className="space-y-6">
        <div className="bg-[#f7f8fa] dark:bg-[#101828] p-5 rounded-xl border-l-4 border-gray-200 dark:border-[#E3C39D] font-mono text-xs whitespace-pre-wrap leading-6 shadow-inner dark:text-[#F1F5F9]">
          <p>
            <strong className="text-gray-900 dark:text-[#E3C39D]">
              Input:
            </strong>{" "}
            nums = [2,7,11,15], target = 9
          </p>
          <p>
            <strong className="text-gray-900 dark:text-[#E3C39D]">
              Output:
            </strong>{" "}
            [0,1]
          </p>
          <p>
            <strong className="text-gray-900 dark:text-[#E3C39D]">
              Explanation:
            </strong>{" "}
            Because nums[0] + nums[1] == 9, we return [0, 1].
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="font-black text-sm mb-3 dark:text-white uppercase tracking-wider">
          Constraints:
        </p>
        <ul className="list-disc ml-5 space-y-3 text-[13px] text-gray-700 dark:text-[#94A3B8]">
          <li>
            <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
              2 &lt;= nums.length &lt;= 10<sup>4</sup>
            </code>
          </li>
          <li>
            <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
              -10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup>
            </code>
          </li>
          <li className="dark:text-white font-medium">
            <strong>Only one valid answer exists.</strong>
          </li>
        </ul>
      </div>

      {/* Follow-up Box */}
      <div className="mt-10 p-5 bg-gray-50 dark:bg-[#162130] rounded-xl border border-gray-100 dark:border-[#334155] italic shadow-sm">
        <p className="text-sm dark:text-[#F1F5F9]">
          <strong className="text-[#A68868] dark:text-[#E3C39D] not-italic mr-1">
            Follow-up:
          </strong>
          Can you come up with an algorithm that is less than O(n²) time
          complexity?
        </p>
      </div>
    </article>
  );
};
