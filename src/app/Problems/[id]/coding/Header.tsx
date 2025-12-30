"use client";
import React from "react";
import {
  Terminal,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Play,
  Send,
  StickyNote,
  Clock,
  Settings,
} from "lucide-react";
import { Button, Tooltip } from "@heroui/react";

interface HeaderProps {
  problemId: string | number;
  onNoteClick: () => void;
  isNoteActive: boolean;
  onProblemListClick: () => void;
}

export const Header = ({
  onNoteClick,
  isNoteActive,
  onProblemListClick,
}: HeaderProps) => {
  return (
    <header className="flex items-center px-4 py-2 bg-white dark:bg-[#101828] border-b dark:border-[#1C2737] shrink-0 transition-colors duration-500 h-12">
      {/* 1. PHẦN BÊN TRÁI: Problem List & Navigation */}
      <div className="flex-1 flex items-center gap-4 text-gray-500 dark:text-[#94A3B8]">
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-black dark:hover:text-white font-bold transition-all group"
          onClick={onProblemListClick}
        >
          <div className="p-1.5 bg-gray-100 dark:bg-[#1C2737] rounded-md group-hover:bg-gray-200 dark:group-hover:bg-[#334155]">
            <Terminal size={16} className="text-gray-600 dark:text-[#E3C39D]" />
          </div>
          <span className="text-xs uppercase tracking-wider hidden md:block">
            Problem List
          </span>
        </div>

        <div className="flex gap-1 border-l dark:border-[#1C2737] pl-4">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="dark:text-[#94A3B8] hover:dark:text-white"
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="dark:text-[#94A3B8] hover:dark:text-white"
          >
            <ChevronRight size={18} />
          </Button>
          <Tooltip
            content="Pick One"
            size="sm"
            className="dark:bg-[#1C2737] dark:text-white"
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="dark:text-[#94A3B8] hover:dark:text-white"
              onClick={() => window.location.reload()}
            >
              <Shuffle size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* 2. PHẦN Ở GIỮA: Run & Submit (Căn giữa tuyệt đối) */}
      <div className="flex items-center justify-center gap-3">
        <Button
          size="sm"
          variant="flat"
          className="bg-gray-100 dark:bg-[#1C2737] text-[#071739] dark:text-[#F9FAFB] font-black px-4 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#334155] transition-all"
          startContent={<Play size={14} className="fill-current" />}
        >
          Run
        </Button>
        <Button
          size="sm"
          className="bg-[#2cbb5d] dark:bg-[#2cbb5d] text-white font-black px-4 h-8 rounded-lg shadow-lg shadow-green-500/20 active:scale-95 transition-all"
          startContent={<Send size={14} />}
        >
          Submit
        </Button>
      </div>

      {/* 3. PHẦN BÊN PHẢI: Tools & Profile */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <div className="flex items-center gap-0.5">
          <Tooltip
            content="Note"
            size="sm"
            className="dark:bg-[#1C2737] dark:text-white"
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className={`h-8 w-8 rounded-lg transition-all ${
                isNoteActive
                  ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "text-gray-500 dark:text-[#94A3B8] hover:dark:bg-[#1C2737]"
              }`}
              onClick={onNoteClick}
            >
              <StickyNote
                size={18}
                fill={isNoteActive ? "currentColor" : "none"}
              />
            </Button>
          </Tooltip>

          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-gray-400 dark:text-[#667085] hover:dark:text-white h-8 w-8"
          >
            <Clock size={18} />
          </Button>

          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-gray-400 dark:text-[#667085] hover:dark:text-white h-8 w-8"
          >
            <Settings size={18} />
          </Button>
        </div>

        <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#1C2737] mx-1" />
      </div>
    </header>
  );
};
