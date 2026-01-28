"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trophy, Clock, Users } from "lucide-react";

type ProblemItem = {
  id: number;
  displayId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  visible: boolean;
};

const difficultyColor = {
  Easy: "text-[#17c964] bg-[#17c964]/10",
  Medium: "text-[#f5a524] bg-[#f5a524]/10",
  Hard: "text-[#f31260] bg-[#f31260]/10",
};

export default function Page() {
  const router = useRouter();

  const problems: ProblemItem[] = [
    { id: 501, displayId: "A", title: "Two Sum", difficulty: "Easy", visible: true },
    { id: 502, displayId: "B", title: "Longest Substring", difficulty: "Medium", visible: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220]">
      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071739] via-[#0B1220] to-black" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#FF5C00]/20 blur-[120px] rounded-full" />

        <div className="relative z-10 py-24 text-center text-white space-y-10">
          {/* Trophy */}
          <div className="flex justify-center">
            <div className="p-6 rounded-[2.5rem] bg-white/10 backdrop-blur border border-white/20 shadow-xl">
              <Trophy size={64} className="text-[#FFB800]" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">
            FPTU CODING MASTER
            <span className="text-[#FF5C00]"> SPRING 2026</span>
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <StatCard icon={<Users />} label="Students" value="1240" />
            <StatCard icon={<Clock />} label="Duration" value="02h 45m" />
          </div>
        </div>
      </div>

      {/* ================= PROBLEMS ================= */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
        <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-black text-[#071739] dark:text-white">
    Problems
  </h2>

  <button
    className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl
      bg-[#071739] dark:bg-[#00FF41]
      text-white dark:text-[#071739]
      font-black uppercase tracking-wider text-sm
      shadow-lg hover:shadow-2xl
      transition-all duration-300"
  >
    {/* Glow */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
      bg-gradient-to-r from-[#FF5C00]/30 to-transparent transition" />

    <span className="relative">Export Contest Result</span>
  </button>
</div>

        {problems.map((p) => (
          <div
            key={p.id}
            onClick={() => router.push("/Problems/two-sum")}
            className="group relative flex items-center justify-between p-6 rounded-[2rem]
              bg-white dark:bg-[#1C2737]
              border border-slate-200 dark:border-white/5
              shadow-sm hover:shadow-2xl
              transition-all duration-300 cursor-pointer"
          >
            {/* Glow hover */}
            <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#FF5C00]/10 to-transparent transition" />

            <div className="relative flex items-center gap-6">
              {/* Index */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#071739] text-white font-black">
                {p.displayId}
              </div>

              <div>
                <div className="font-black text-lg text-[#071739] dark:text-white">
                  {p.title}
                </div>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${difficultyColor[p.difficulty]}`}
                >
                  {p.difficulty}
                </span>
              </div>
            </div>

            <span className="relative font-black text-sm uppercase text-[#FF5C00]">
              Solve →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== COMPONENT ===== */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg text-center">
      <div className="flex justify-center mb-2 text-[#FF5C00]">{icon}</div>
      <div className="text-xs uppercase tracking-widest text-slate-300">
        {label}
      </div>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}
