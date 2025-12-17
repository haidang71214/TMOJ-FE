"use client";
import React from "react";
import { Tabs, Tab, Button } from "@heroui/react";
import { Copy } from "lucide-react";

export const SolutionArticle = () => {
  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold">Solution Article</h2>

      {/* Approach 1 */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold">Approach 1: Brute Force</h3>
        <p className="text-[14px] leading-relaxed">
          The brute force approach is simple. Loop through each element{" "}
          <code>x</code> and find if there is another value that equals to{" "}
          <code>target - x</code>.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-[#fafafa] px-2 border-b flex justify-between items-center h-10">
            <Tabs
              variant="underlined"
              size="sm"
              classNames={{
                tabList: "gap-4",
                cursor: "bg-black",
                tab: "h-9 font-bold",
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
              className="font-bold"
            >
              Copy
            </Button>
          </div>
          <pre className="p-4 bg-[#f8f8f8] text-[13px] font-mono leading-6 overflow-x-auto text-blue-700">
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
        <div className="space-y-2 pt-4">
          <h4 className="font-bold text-sm">Complexity Analysis</h4>
          <ul className="list-disc ml-5 text-sm space-y-2">
            <li>
              <strong>Time complexity:</strong> <code>O(n²)</code>. For each
              element, we try to find its complement by looping through the rest
              of the array which takes <code>O(n)</code> time.
            </li>
            <li>
              <strong>Space complexity:</strong> <code>O(1)</code>. The space
              required does not depend on the size of the input array.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
