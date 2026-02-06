"use client";

import React from "react";
import { Card, CardBody, Textarea, Button } from "@heroui/react";
import {
  History,
  Sparkles,
  Share2,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";

// 1. Định nghĩa Interface chuẩn xác
interface CodeLine {
  line: number;
  content: string;
}

interface RequirementItemProps {
  met: boolean;
  label: string;
}

// 2. Named Export để đồng bộ với SolutionsTab của Rim
export const CompileErrorTab = () => {
  const errorDetails = {
    line: 3,
    char: 56,
    message:
      "error: non-void function does not return a value [-Werror,-Wreturn-type]",
    snippet: "vector<int> twoSum(vector<int>& nums, int target) {}",
    codeContent: [
      { line: 1, content: "class Solution {" },
      { line: 2, content: "public:" },
      {
        line: 3,
        content: "    vector<int> twoSum(vector<int>& nums, int target) {}",
      },
      { line: 4, content: "};" },
    ] as CodeLine[],
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C2737] transition-colors duration-500 overflow-y-auto no-scrollbar">
      {/* STATUS BAR - Đồng bộ Style với Share Box của SolutionsTab */}
      <div className="p-4 flex items-center justify-between bg-rose-50/30 dark:bg-rose-500/5 border-b border-gray-50 dark:border-[#334155] shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/10 rounded-lg">
            <History size={16} className="text-rose-500" />
          </div>
          <h1 className="text-lg font-[1000] text-rose-500 tracking-tighter uppercase italic">
            Compile Error
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
            <span className="text-rose-500 text-sm">0 / 0</span> Passed
          </span>
          <Share2
            size={16}
            className="text-slate-400 cursor-pointer hover:text-[#FF5C00] transition-colors"
          />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-4 flex flex-col gap-6">
        {/* ERROR MESSAGE CARD */}
        <Card
          shadow="none"
          className="bg-rose-50/50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl"
        >
          <CardBody className="p-5 font-mono text-[13px] leading-relaxed text-rose-600 dark:text-rose-400">
            <p className="font-bold mb-3">
              Line {errorDetails.line}: Char {errorDetails.char}:{" "}
              {errorDetails.message}
            </p>
            <div className="py-3 px-4 bg-white/60 dark:bg-black/30 rounded-xl border border-rose-200/50 dark:border-rose-500/10">
              <p className="opacity-80 text-slate-500 dark:text-slate-400">
                {errorDetails.line} | {errorDetails.snippet}
              </p>
              <div className="flex flex-col mt-1">
                <span className="ml-[10px] text-rose-500 font-black leading-none text-xs">
                  |
                </span>
                <span className="ml-[45px] text-rose-500 font-black leading-none text-xs">
                  ^
                </span>
              </div>
            </div>
            <p className="mt-3 text-[10px] font-black uppercase italic tracking-[0.2em] opacity-60">
              1 compilation error generated.
            </p>
          </CardBody>
        </Card>

        {/* CODE PREVIEW */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-[1000] uppercase tracking-widest text-slate-400 italic">
                Source Preview
              </span>
              <div className="h-px w-10 bg-slate-200 dark:bg-slate-700" />
              <span className="text-[10px] font-black text-[#FF5C00] uppercase tracking-[0.3em]">
                C++
              </span>
            </div>
            <Button
              variant="flat"
              size="sm"
              startContent={<Sparkles size={14} />}
              className="bg-indigo-500/10 text-indigo-500 font-black text-[9px] uppercase tracking-widest h-7 rounded-lg"
            >
              Analyze
            </Button>
          </div>

          <div className="bg-slate-50/50 dark:bg-[#101828]/40 border border-slate-100 dark:border-[#334155] rounded-[1.5rem] overflow-hidden">
            <div className="flex flex-col py-4 font-mono text-[13px]">
              {errorDetails.codeContent.map((line) => (
                <div
                  key={line.line}
                  className={`flex transition-colors ${
                    line.line === 3 ? "bg-rose-500/5" : "hover:bg-slate-500/5"
                  }`}
                >
                  <div className="w-12 text-right pr-4 text-slate-300 select-none border-r border-slate-100 dark:border-white/5 mr-4 italic font-bold">
                    {line.line}
                  </div>
                  <div
                    className={`whitespace-pre ${
                      line.line === 3
                        ? "text-rose-500 font-bold italic"
                        : "text-slate-600 dark:text-[#94A3B8]"
                    }`}
                  >
                    {line.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECURITY CHECKLIST (Sử dụng RequirementItemProps để hết lỗi) */}
        <div className="space-y-3 mt-2 px-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 italic">
            <AlertCircle size={12} className="text-[#FF5C00]" /> Common Causes
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <RequirementItem met={false} label="Missing Return Statement" />
            <RequirementItem met={false} label="Incorrect Return Type" />
          </div>
        </div>
      </div>

      {/* PERSONAL NOTES SECTION */}
      <div className="p-4 mt-auto border-t border-gray-50 dark:border-[#334155] bg-gray-50/30 dark:bg-[#101828]/20 shrink-0">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Info size={14} className="text-[#FF5C00]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Personal Notes
          </span>
        </div>
        <Textarea
          variant="flat"
          placeholder="Document your fix here..."
          classNames={{
            input:
              "text-sm font-bold italic dark:text-white placeholder:text-slate-300",
            inputWrapper:
              "dark:bg-[#101828] border border-transparent dark:border-[#474F5D] focus-within:!border-[#FF5C00] rounded-2xl transition-all h-24",
          }}
        />
        <div className="flex justify-between items-center mt-4 px-1">
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-[#FF5C00] shadow-lg shadow-orange-500/20" />
            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">
            TMOJ Debugger v1.0
          </span>
        </div>
      </div>
    </div>
  );
};

// 3. Sử dụng Interface RequirementItemProps tại đây để giải quyết lỗi ts(6196)
const RequirementItem = ({ met, label }: RequirementItemProps) => {
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-xl border border-transparent transition-all bg-slate-50/50 dark:bg-white/5`}
    >
      {met ? (
        <Check size={14} strokeWidth={4} className="text-emerald-500" />
      ) : (
        <AlertCircle size={14} className="text-rose-500" />
      )}
      <span
        className={`text-[11px] font-bold ${
          met ? "text-emerald-500" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
};
