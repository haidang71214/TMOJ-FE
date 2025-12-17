"use client";
import React from "react";
import { Chip, Accordion, AccordionItem } from "@heroui/react";
import { Tag } from "lucide-react";

interface StatsProps {
  topicRef: React.RefObject<HTMLDivElement>;
}

export const Stats = ({ topicRef }: StatsProps) => {
  return (
    <div className="mt-10 space-y-6 border-t border-gray-100 pt-6">
      <div className="flex gap-10 text-[13px]">
        <div>
          <p className="text-gray-400 font-medium">Accepted</p>
          <p className="font-bold">19.9M</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Submissions</p>
          <p className="font-bold">35M</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Acceptance Rate</p>
          <p className="font-bold">56.7%</p>
        </div>
      </div>

      <div ref={topicRef} className="scroll-mt-20">
        <Accordion variant="light" className="px-0">
          <AccordionItem
            key="topics"
            aria-label="Topics"
            title={
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Tag size={16} /> Topics
              </div>
            }
          >
            <div className="flex flex-wrap gap-2 pb-2">
              <Chip
                size="sm"
                variant="flat"
                className="bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200"
              >
                Array
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                className="bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200"
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
