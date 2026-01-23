"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

type ProblemItem = {
  id: number;
  displayId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  visible: boolean;
};

export default function Page() {
  const router = useRouter();

  const problems: ProblemItem[] = [
    {
      id: 501,
      displayId: "A",
      title: "Two Sum",
      difficulty: "Easy",
      visible: true,
    },
    {
      id: 502,
      displayId: "B",
      title: "Longest Substring",
      difficulty: "Medium",
      visible: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220]">
      {/* Hero Section - Đồng bộ phong cách Landing Page */}
      <div className="relative bg-white dark:bg-[#1C2737] py-20 border-b border-slate-200 dark:border-white/5 shadow-sm">
        <div className="mx-auto px-6 text-center space-y-8">
          {/* Icon Trophy */}
          <div className="flex justify-center">
            <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] text-[#071739] dark:text-[#FF5C00] shadow-inner transition-all group hover:scale-105 duration-500 border border-slate-100 dark:border-white/5">
              <Trophy
                size={60}
                strokeWidth={1.5}
                className="group-hover:rotate-12 transition-transform"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-[1000] text-[#071739] dark:text-white uppercase tracking-tighter italic leading-none">
              TMOJ <span className="text-[#FF5C00]">CONTEST</span>
            </h1>

            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
              <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] italic">
                Compete • Solve • Conquer
              </p>
              <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Problem List */}
      <div className="p-8 max-w-10xl mx-auto">
        <div className="space-y-4">
          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push("/Problems/two-sum")}
              className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-[#1C2737] shadow cursor-pointer hover:shadow-xl hover:translate-x-1 transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                <span className="text-xl font-black text-[#FFB800]">
                  {p.displayId}
                </span>

                <div>
                  <div className="font-black text-lg text-[#071739] dark:text-white">
                    {p.title}
                  </div>
                  <div className="text-sm text-gray-400 uppercase">
                    {p.difficulty}
                  </div>
                </div>
              </div>

              <span className="font-black text-sm uppercase text-[#17c964]">
                Solve →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
