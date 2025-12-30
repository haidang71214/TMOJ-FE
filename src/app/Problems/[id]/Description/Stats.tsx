"use client";
import React from "react";
import { Chip, Accordion, AccordionItem } from "@heroui/react";
import { Tag } from "lucide-react";

interface StatsProps {
  topicRef: React.RefObject<HTMLDivElement>;
}

export const Stats = ({ topicRef }: StatsProps) => {
  return (
    <div className="mt-10 space-y-6 border-t border-gray-100 dark:border-[#334155] pt-6 transition-colors duration-500">
      {/* KHU VỰC THỐNG KÊ - Chữ trắng sáng */}
      <div className="flex gap-10 text-[13px]">
        <div>
          <p className="text-gray-400 dark:text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider mb-1">
            Accepted
          </p>
          <p className="font-black text-gray-900 dark:text-white text-lg">
            19.9M
          </p>
        </div>
        <div>
          <p className="text-gray-400 dark:text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider mb-1">
            Submissions
          </p>
          <p className="font-black text-gray-900 dark:text-white text-lg">
            35M
          </p>
        </div>
        <div>
          <p className="text-gray-400 dark:text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider mb-1">
            Acceptance Rate
          </p>
          <p className="font-black text-gray-900 dark:text-[#E3C39D] text-lg">
            56.7%
          </p>
        </div>
      </div>

      <div ref={topicRef} className="scroll-mt-20">
        <Accordion
          variant="light"
          className="px-0"
          itemClasses={{
            base: "py-0 w-full",
            title: "text-sm font-black text-gray-800 dark:text-[#F9FAFB]",
            trigger: "py-2 px-0 hover:bg-transparent",
            indicator: "text-gray-400 dark:text-[#94A3B8]",
          }}
        >
          <AccordionItem
            key="topics"
            aria-label="Topics"
            title={
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-[#A68868] dark:text-[#E3C39D]" />
                <span className="uppercase tracking-widest text-[11px]">
                  Topics
                </span>
              </div>
            }
          >
            <div className="flex flex-wrap gap-2 pb-4 pt-2">
              <Chip
                size="sm"
                variant="flat"
                className="bg-gray-100 dark:bg-[#101828] text-gray-600 dark:text-[#CDD5DB] border border-transparent dark:border-[#334155] cursor-pointer hover:bg-gray-200 dark:hover:bg-[#334155] transition-all font-bold"
              >
                Array
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                className="bg-gray-100 dark:bg-[#101828] text-gray-600 dark:text-[#CDD5DB] border border-transparent dark:border-[#334155] cursor-pointer hover:bg-gray-200 dark:hover:bg-[#334155] transition-all font-bold"
              >
                Hash Table
              </Chip>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
