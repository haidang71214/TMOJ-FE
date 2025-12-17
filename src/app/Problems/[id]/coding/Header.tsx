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

export const Header = ({
  problemId,
  onNoteClick,
  isNoteActive,
  onProblemListClick,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b shrink-0">
      <div className="flex items-center gap-4 text-gray-500">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-black font-medium transition-colors"
          onClick={onProblemListClick}
        >
          <Terminal size={18} /> <span className="text-sm">Problem List</span>
        </div>
        <div className="flex gap-1 border-l pl-4">
          <Button isIconOnly size="sm" variant="light">
            <ChevronLeft size={18} />
          </Button>
          <Button isIconOnly size="sm" variant="light">
            <ChevronRight size={18} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => window.location.reload()}
          >
            <Shuffle size={16} />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="flat"
          className="bg-gray-100 font-bold px-4 h-8"
          startContent={<Play size={16} />}
        >
          Run
        </Button>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="bg-[#2cbb5d] text-white font-bold px-4 h-8"
            startContent={<Send size={16} />}
          >
            Submit
          </Button>
          <Tooltip content="Note">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className={`h-8 w-8 ${
                isNoteActive ? "text-orange-500 bg-orange-50" : "text-gray-500"
              }`}
              onClick={onNoteClick}
            >
              <StickyNote size={18} />
            </Button>
          </Tooltip>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-gray-400 h-8 w-8"
        >
          <Clock size={18} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-gray-400 h-8 w-8"
        >
          <Settings size={18} />
        </Button>
      </div>
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
        {String(problemId).charAt(0)}
      </div>
    </header>
  );
};
