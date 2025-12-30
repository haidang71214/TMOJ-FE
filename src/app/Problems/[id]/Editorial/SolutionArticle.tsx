"use client";

import React from "react";
import { Tabs, Tab, Button } from "@heroui/react";
import { Copy } from "lucide-react";

export const SolutionArticle = () => {
  return (
    <div className="space-y-10 text-[#262626] dark:text-[#F9FAFB] transition-colors duration-500">
      <h2 className="text-2xl font-black dark:text-white border-b dark:border-[#1C2737] pb-4">
        Solution Article
      </h2>

      {/* Approach 1 */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-[#071739] dark:text-[#E3C39D]">
          Approach 1: Brute Force
        </h3>
        <p className="text-[14px] leading-relaxed dark:text-[#CDD5DB]">
          The brute force approach is simple. Loop through each element{" "}
          <code className="bg-gray-100 dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
            x
          </code>
          and find if there is another value that equals to{" "}
          <code className="bg-gray-100 dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
            target - x
          </code>
          .
        </p>

        {/* Code Block Container */}
        <div className="bg-white dark:bg-[#1C2737] border border-gray-200 dark:border-[#334155] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#fafafa] dark:bg-[#162130] px-2 border-b dark:border-[#334155] flex justify-between items-center h-10">
            <Tabs
              variant="underlined"
              size="sm"
              classNames={{
                tabList: "gap-4 px-2",
                cursor: "bg-black dark:bg-[#E3C39D]",
                tab: "h-9 font-black text-xs dark:text-[#94A3B8] data-[selected=true]:dark:text-[#E3C39D]",
              }}
            >
              <Tab key="cpp" title="C++" />
              <Tab key="java" title="Java" />
              <Tab key="python" title="Python3" />
            </Tabs>
            <Button
              size="sm"
              variant="light"
              startContent={<Copy size={14} />}
              className="font-black text-gray-500 dark:text-[#94A3B8] hover:dark:text-white transition-colors"
            >
              Copy
            </Button>
          </div>
          <pre className="p-5 bg-[#f8f8f8] dark:bg-[#101828] text-[13px] font-mono leading-6 overflow-x-auto text-blue-700 dark:text-[#E3C39D] custom-scrollbar shadow-inner">
            {`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[j] == target - nums[i]) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};`}
          </pre>
        </div>

        {/* Complexity Analysis */}
        <div className="space-y-4 pt-4">
          <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#A68868] dark:bg-[#E3C39D]"></span>
            Complexity Analysis
          </h4>
          <ul className="list-disc ml-5 text-[14px] space-y-3 dark:text-[#94A3B8]">
            <li>
              <strong className="text-black dark:text-white font-black">
                Time complexity:
              </strong>{" "}
              <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
                O(n²)
              </code>
              . For each element, we try to find its complement by looping
              through the rest of the array which takes{" "}
              <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
                O(n)
              </code>{" "}
              time.
            </li>
            <li>
              <strong className="text-black dark:text-white font-black">
                Space complexity:
              </strong>{" "}
              <code className="dark:bg-[#101828] dark:text-[#E3C39D] px-1 rounded">
                O(1)
              </code>
              . The space required does not depend on the size of the input
              array.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
