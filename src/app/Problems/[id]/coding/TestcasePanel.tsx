"use client";
import React from "react";
import {
  Play,
  Terminal,
  ChevronUp,
  ChevronDown,
  Maximize,
  Plus,
  MessageSquare,
} from "lucide-react";
import { Button } from "@heroui/react";

interface TestcasePanelProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  testTab: string;
  setTestTab: (value: string) => void;
  activeCase: number;
  setActiveCase: (value: number) => void;
}

export const TestcasePanel: React.FC<TestcasePanelProps> = ({
  isCollapsed,
  setIsCollapsed,
  testTab,
  setTestTab,
  activeCase,
  setActiveCase,
}) => {
  return (
    <div
      className={`transition-all duration-300 bg-white dark:bg-[#1C2737] rounded-xl shadow-sm border border-gray-200 dark:border-[#334155] flex flex-col overflow-hidden ${
        isCollapsed ? "h-[40px]" : "h-[280px]"
      }`}
    >
      {/* Header của Panel */}
      <div className="px-4 bg-[#fafafa] dark:bg-[#162130] border-b dark:border-[#334155] flex items-center justify-between shrink-0 h-[40px]">
        <div className="flex gap-4 h-full">
          <button
            onClick={() => {
              setTestTab("testcase");
              setIsCollapsed(false);
            }}
            className={`text-[11px] font-bold flex items-center gap-2 border-b-2 transition-all ${
              testTab === "testcase"
                ? "border-green-600 dark:border-[#E3C39D] text-green-600 dark:text-[#E3C39D]"
                : "border-transparent text-gray-400 dark:text-[#667085]"
            }`}
          >
            <Play size={12} fill="currentColor" /> Testcase
          </button>
          <button
            onClick={() => {
              setTestTab("result");
              setIsCollapsed(false);
            }}
            className={`text-[11px] font-bold flex items-center gap-2 border-b-2 transition-all ${
              testTab === "result"
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-gray-400 dark:text-[#667085]"
            }`}
          >
            <Terminal size={12} /> Test Result
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 dark:text-[#94A3B8] h-7 w-7 hover:dark:text-white"
          >
            {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-gray-400 dark:text-[#94A3B8] h-7 w-7 hover:dark:text-white"
          >
            <Maximize size={14} />
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar bg-white dark:bg-[#1C2737]">
          {testTab === "testcase" ? (
            <>
              {/* Tabs cho từng Case */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3].map((num) => (
                  <Button
                    key={num}
                    size="sm"
                    variant="flat"
                    onClick={() => setActiveCase(num)}
                    className={`h-7 px-3 text-[11px] font-bold rounded-lg transition-all ${
                      activeCase === num
                        ? "bg-gray-100 dark:bg-[#334155] text-black dark:text-[#E3C39D] shadow-sm"
                        : "bg-transparent text-gray-400 dark:text-[#667085] hover:dark:bg-[#162130]"
                    }`}
                  >
                    Case {num}
                  </Button>
                ))}
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="h-7 w-7 text-gray-400 dark:text-[#667085] hover:dark:text-white"
                >
                  <Plus size={14} />
                </Button>
              </div>

              {/* Nội dung Input Case */}
              <div className="space-y-4 font-sans">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-[#94A3B8] mb-1 tracking-widest uppercase">
                    nums =
                  </p>
                  <div className="bg-gray-50 dark:bg-[#101828] p-3 rounded-xl border border-gray-100 dark:border-[#334155] text-xs font-mono text-gray-700 dark:text-[#CDD5DB] shadow-inner">
                    {activeCase === 1
                      ? "[2,7,11,15]"
                      : activeCase === 2
                      ? "[3,2,4]"
                      : "[3,3]"}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-[#94A3B8] mb-1 tracking-widest uppercase">
                    target =
                  </p>
                  <div className="bg-gray-50 dark:bg-[#101828] p-3 rounded-xl border border-gray-100 dark:border-[#334155] text-xs font-mono text-gray-700 dark:text-[#CDD5DB] shadow-inner">
                    {activeCase === 1 ? "9" : "6"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Trạng thái trống của Test Result */
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-[#475569] gap-2 opacity-80">
              <MessageSquare size={32} />
              <p className="text-xs font-black uppercase tracking-widest">
                You must run your code first
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
