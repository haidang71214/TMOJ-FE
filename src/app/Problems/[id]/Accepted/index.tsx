"use client";

import React, { useState } from "react";
import { Button, Card, CardBody, Avatar } from "@heroui/react";
import {
  History,
  Sparkles,
  Share2,
  BookOpen,
  ChevronRight,
  Cpu,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PostSolution } from "../PostSolution";
// Data giả lập cho Runtime và Memory
const RUNTIME_DATA = Array.from({ length: 40 }, (_, i) => ({
  name: `${i * 2}ms`,
  value: Math.random() * (i > 10 && i < 20 ? 50 : 10),
}));

const MEMORY_DATA = Array.from({ length: 40 }, (_, i) => ({
  name: `${14 + i * 0.1}MB`,
  value: Math.random() * (i > 25 ? 40 : 15),
}));

export const AcceptedTab = () => {
  // State để quản lý việc đang chọn Tab Runtime hay Memory
  const [activeStat, setActiveStat] = useState<"runtime" | "memory">("runtime");
  // 1. Thêm State để kiểm soát việc hiện trang Post Solution
  const [showPostSolution, setShowPostSolution] = useState(false);
  // 2. Nếu showPostSolution = true, trả về Component PostSolution
  if (showPostSolution) {
    return (
      <PostSolution
        onClose={() => setShowPostSolution(false)}
        initialCode={`// Your accepted code here\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // ... logic\n    }\n};`}
      />
    );
  }
  const currentData = activeStat === "runtime" ? RUNTIME_DATA : MEMORY_DATA;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C2737] transition-colors duration-500 overflow-y-auto no-scrollbar">
      {/* 1. HEADER STATUS */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-[#334155] shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-[1000] text-emerald-500 tracking-tight uppercase italic">
              Accepted
            </h1>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
              63 / 63 testcases passed
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Avatar src="" className="w-5 h-5 border border-emerald-500/20" />
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              Rimtapcode{" "}
              <span className="font-medium text-slate-400 ml-1 italic">
                submitted at Feb 06, 2026 09:43
              </span>
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            startContent={<BookOpen size={14} />}
            className="font-black text-[10px] uppercase tracking-wider rounded-xl h-9"
          >
            Editorial
          </Button>
          <Button
            size="sm"
            onPress={() => setShowPostSolution(true)}
            className="bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl h-9 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Solution
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* 2. STATS TABS & CHART CARD */}
        <Card
          shadow="none"
          className="bg-slate-50/50 dark:bg-black/20 border border-slate-100 dark:border-[#334155] rounded-[2.5rem]"
        >
          <CardBody className="p-6">
            <div className="flex gap-4 mb-8">
              {/* NÚT TAB RUNTIME */}
              <button
                onClick={() => setActiveStat("runtime")}
                className={`flex-1 text-left p-4 rounded-2xl transition-all border-2 ${
                  activeStat === "runtime"
                    ? "bg-white dark:bg-[#1C2737] border-blue-500 shadow-xl shadow-blue-500/10"
                    : "bg-transparent border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <History
                    size={14}
                    className={activeStat === "runtime" ? "text-blue-500" : ""}
                  />
                  <span className="text-[10px] font-[1000] uppercase tracking-widest">
                    Runtime
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#071739] dark:text-white">
                    2 ms
                  </span>
                  <span className="text-xs font-bold text-emerald-500 italic">
                    Beats 72.93%
                  </span>
                </div>
              </button>

              {/* NÚT TAB MEMORY */}
              <button
                onClick={() => setActiveStat("memory")}
                className={`flex-1 text-left p-4 rounded-2xl transition-all border-2 ${
                  activeStat === "memory"
                    ? "bg-white dark:bg-[#1C2737] border-blue-500 shadow-xl shadow-blue-500/10"
                    : "bg-transparent border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Cpu
                    size={14}
                    className={activeStat === "memory" ? "text-blue-500" : ""}
                  />
                  <span className="text-[10px] font-[1000] uppercase tracking-widest">
                    Memory
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#071739] dark:text-white">
                    14.94 MB
                  </span>
                  <span className="text-xs font-bold text-emerald-500 italic">
                    Beats 18.88%
                  </span>
                </div>
              </button>
            </div>

            {/* BIỂU ĐỒ THAY ĐỔI THEO TAB CHỌN */}
            <div className="h-44 w-full relative group">
              <div className="absolute -top-6 left-0 text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                {activeStat} Distribution
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {currentData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 15 ? "#3b82f6" : "#3b82f630"}
                        className="transition-all duration-500"
                      />
                    ))}
                  </Bar>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                </BarChart>
              </ResponsiveContainer>

              {/* Chỉ báo "R" (Vị trí của Rim) */}
              <div className="absolute top-4 left-[38%] flex flex-col items-center animate-bounce">
                <div className="bg-blue-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-[#1C2737]">
                  R
                </div>
                <div className="w-0.5 h-20 bg-gradient-to-b from-blue-600 to-transparent opacity-50"></div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                variant="light"
                size="sm"
                startContent={<Sparkles size={14} />}
                className="text-indigo-500 font-black text-[10px] uppercase tracking-widest"
              >
                Analyze Complexity
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 3. SUBMITTED CODE PREVIEW */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-slate-400 italic">
              Submitted Code | C++
            </span>
            <Share2
              size={16}
              className="text-slate-400 cursor-pointer hover:text-[#FF5C00] transition-colors"
            />
          </div>
          <div className="bg-slate-50/50 dark:bg-[#101828]/60 border border-slate-100 dark:border-[#334155] rounded-[1.5rem] overflow-hidden">
            <div className="p-5 font-mono text-[13px] leading-relaxed relative">
              <div className="text-blue-500 font-bold">class</div>{" "}
              <span className="text-rose-500 italic">Solution</span> {"{"}
              <div className="text-blue-500 font-bold ml-4">public:</div>
              <div className="ml-8">
                vector&lt;int&gt; <span className="text-rose-500">twoSum</span>
                (vector&lt;int&gt;&amp; nums,{" "}
                <span className="text-blue-500">int</span> target) {"{"}
              </div>
              <div className="text-center pt-4 pb-2">
                <Button
                  size="sm"
                  variant="light"
                  className="text-[10px] font-black uppercase text-slate-400 tracking-widest"
                >
                  View full code
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MORE CHALLENGES */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="h-px w-6 bg-slate-200 dark:bg-slate-700" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Next Challenges
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <ChallengeItem
              id="2006"
              title="Count Number of Pairs With Absolute Difference K"
            />
            <ChallengeItem id="2395" title="Find Subarrays With Equal Sum" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChallengeItem = ({ id, title }: { id: string; title: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-emerald-500/30 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">
        {id}. {title}
      </span>
    </div>
    <ChevronRight
      size={16}
      className="text-slate-300 group-hover:translate-x-1 transition-transform"
    />
  </div>
);
