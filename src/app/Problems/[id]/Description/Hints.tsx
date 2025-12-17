"use client";
import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { Lightbulb, Layers } from "lucide-react";

export const Hints = () => {
  return (
    <div className="border-t border-gray-100 pt-4">
      <Accordion variant="light" className="px-0" selectionMode="multiple">
        <AccordionItem
          key="hint-1"
          aria-label="Hint 1"
          startContent={<Lightbulb size={16} className="text-orange-400" />}
          title={
            <span className="text-sm font-bold text-gray-700">Hint 1</span>
          }
        >
          <div className="text-sm text-gray-600 pl-6 pb-2">
            A really brute force way would be to search for all possible pairs
            of numbers but that would be too slow.
          </div>
        </AccordionItem>

        <AccordionItem
          key="hint-2"
          aria-label="Hint 2"
          startContent={<Lightbulb size={16} className="text-orange-400" />}
          title={
            <span className="text-sm font-bold text-gray-700">Hint 2</span>
          }
        >
          <div className="text-sm text-gray-600 pl-6 pb-2">
            So, if we fix one of the numbers, say x, we have to scan the entire
            array to find the next number y which is equal to target - x where
            value of y is what we need to look for.
          </div>
        </AccordionItem>

        <AccordionItem
          key="similar"
          aria-label="Similar Questions"
          startContent={<Layers size={16} className="text-blue-400" />}
          title={
            <span className="text-sm font-bold text-gray-700">
              Similar Questions
            </span>
          }
        >
          <div className="pl-6 pb-2 space-y-2">
            <div className="flex justify-between items-center group cursor-pointer">
              <span className="text-sm text-blue-600 group-hover:underline">
                3Sum
              </span>
              <span className="text-[11px] font-bold text-orange-400">
                Medium
              </span>
            </div>
            <div className="flex justify-between items-center group cursor-pointer">
              <span className="text-sm text-blue-600 group-hover:underline">
                4Sum
              </span>
              <span className="text-[11px] font-bold text-orange-400">
                Medium
              </span>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
