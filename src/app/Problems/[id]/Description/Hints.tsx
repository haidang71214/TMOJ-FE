"use client";
import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { Lightbulb, Layers } from "lucide-react";

export const Hints = () => {
  return (
    <div className="border-t border-gray-100 dark:border-[#334155] pt-4 transition-colors duration-500">
      <Accordion
        variant="light"
        className="px-0"
        selectionMode="multiple"
        itemClasses={{
          base: "py-0 w-full",
          title: "text-sm font-black text-gray-700 dark:text-[#F9FAFB]", // Chữ tiêu đề trắng sáng
          trigger:
            "py-3 px-2 hover:bg-gray-50 dark:hover:bg-[#101828] rounded-lg transition-all",
          content:
            "text-sm text-gray-600 dark:text-[#94A3B8] pl-8 pb-4 leading-relaxed italic", // Chữ gợi ý xám dịu
          indicator: "text-gray-400 dark:text-[#94A3B8]",
        }}
      >
        <AccordionItem
          key="hint-1"
          aria-label="Hint 1"
          startContent={
            <Lightbulb
              size={16}
              className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]"
            />
          }
          title="Hint 1"
        >
          A really brute force way would be to search for all possible pairs of
          numbers but that would be too slow.
        </AccordionItem>

        <AccordionItem
          key="hint-2"
          aria-label="Hint 2"
          startContent={
            <Lightbulb
              size={16}
              className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]"
            />
          }
          title="Hint 2"
        >
          So, if we fix one of the numbers, say x, we have to scan the entire
          array to find the next number y which is equal to target - x where
          value of y is what we need to look for.
        </AccordionItem>

        <AccordionItem
          key="similar"
          aria-label="Similar Questions"
          startContent={
            <Layers size={16} className="text-blue-400 dark:text-[#38BDF8]" />
          }
          title="Similar Questions"
        >
          <div className="space-y-3">
            {[
              { title: "3Sum", diff: "Medium" },
              { title: "4Sum", diff: "Medium" },
              { title: "Two Sum II - Input Array Is Sorted", diff: "Medium" },
            ].map((q, i) => (
              <div
                key={i}
                className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform"
              >
                <span className="text-sm text-blue-600 dark:text-[#E3C39D] font-bold group-hover:underline decoration-2 underline-offset-4">
                  {q.title}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 uppercase tracking-tighter">
                  {q.diff}
                </span>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
