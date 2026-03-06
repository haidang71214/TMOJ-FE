"use client";
import React from "react";
import { TriangleAlert, Copy, ChevronDown } from "lucide-react";

export const CompileErrorTab = () => {
  const mockError = `Line 3: error: expected ';' after expression
  solution.cpp:3:5: error: use of undeclared identifier 'vctor'
      vctor<int> nums = {1, 2, 3};
      ^
  solution.cpp:3:5: note: did you mean 'vector'?
      vector<int> nums = {1, 2, 3};
      ^
  1 error generated.`;

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-6 py-5 space-y-4">
      {/* Alert Banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
        <TriangleAlert size={18} className="text-rose-500 shrink-0" />
        <div>
          <p className="font-black text-[13px] text-rose-500">Compile Error</p>
          <p className="text-[11px] text-rose-400/80 mt-0.5">
            Your code failed to compile. Fix the errors below and try again.
          </p>
        </div>
      </div>

      {/* Submission Info */}
      <div className="flex flex-wrap gap-3 text-[12px]">
        {[
          { label: "Language", value: "C++" },
          { label: "Runtime", value: "N/A" },
          { label: "Memory", value: "N/A" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="px-3 py-2 bg-gray-50 dark:bg-[#101828] rounded-xl border dark:border-[#334155] min-w-[100px]"
          >
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-[#475569] mb-1">
              {label}
            </span>
            <span className="font-black text-[#262626] dark:text-[#F9FAFB]">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Error Output */}
      <div className="rounded-xl overflow-hidden border dark:border-[#334155]">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-[#162130] border-b dark:border-[#334155]">
          <div className="flex items-center gap-2 text-[12px] font-black text-gray-500 dark:text-[#94A3B8]">
            <ChevronDown size={14} />
            Error Output
          </div>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 dark:text-[#667085] hover:text-black dark:hover:text-white transition-colors">
            <Copy size={11} /> Copy
          </button>
        </div>
        <pre className="px-4 py-4 text-[12px] font-mono text-rose-400 dark:text-rose-300 bg-white dark:bg-[#0D1B2A] leading-6 overflow-x-auto no-scrollbar whitespace-pre-wrap">
          {mockError}
        </pre>
      </div>
    </div>
  );
};
