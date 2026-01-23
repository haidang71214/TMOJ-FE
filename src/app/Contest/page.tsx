"use client";
import UpcomingContests from "./UpcomingContests";
import { Trophy, Gift } from "lucide-react";

export default function ContestPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] text-[#071739] dark:text-white transition-colors duration-600">
      {/* Hero Section - Đồng bộ phong cách Landing Page */}
      <div className="relative bg-white dark:bg-[#1C2737] py-20 border-b border-slate-200 dark:border-white/5 shadow-sm">
        <div className=" mx-auto px-6 text-center space-y-8">
          {/* Icon Trophy Section */}
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
              TMOJ <span className="text-[#FF5C00]">CONTESTS</span>
            </h1>

            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
              <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] italic">
                Compete • Solve • Conquer
              </p>
              <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
            </div>
          </div>

          <button className="bg-[#071739] dark:bg-white/5 text-white dark:text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-[#00FF41] hover:text-[#071739] dark:hover:bg-[#00FF41] dark:hover:text-[#071739] flex items-center gap-3 mx-auto shadow-xl active:scale-95 border border-transparent dark:border-white/10">
            <Gift size={20} strokeWidth={2.5} /> Unbox Surprise
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-10">
          {/* Section Heading - Đồng bộ với style tiêu đề mục của Landing */}
          <div className="flex items-center gap-5">
            <div className="h-10 w-2.5 bg-[#FF5C00] rounded-full shadow-[0_0_15px_rgba(255,92,0,0.3)]"></div>
            <h2 className="text-3xl font-[1000] text-[#071739] dark:text-white uppercase tracking-tighter italic">
              Featured{" "}
              <span className="text-slate-400 dark:text-slate-500">Events</span>
            </h2>
          </div>

          {/* Upcoming Contests Container - Bo góc 3rem sang trọng */}
          <div className="bg-white dark:bg-[#1C2737] rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden ">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5C00]/5 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="relative z-12  ">
              <UpcomingContests />
            </div>
          </div>
        </div>
      </div>

      {/* Footer-like bottom spacing */}
      <div className="pb-20" />
    </div>
  );
}
