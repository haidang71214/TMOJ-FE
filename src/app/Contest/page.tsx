"use client";

import React from "react";
import UpcomingContests from "./UpcomingContests";
import { Trophy, Gift } from "lucide-react";

export default function ContestPage() {
  return (
    <div className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] text-[#071739] dark:text-white transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-[#1C2737] py-24 border-b border-[#A4B5C4] dark:border-[#1C2737] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          {/* Icon Trophy Section */}
          <div className="flex justify-center">
            <div className="p-6 bg-gray-100 dark:bg-orange-500/10 rounded-[2.5rem] text-[#071739] dark:text-[#FFB800] shadow-inner transition-colors duration-500">
              <Trophy size={80} strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-7xl font-black uppercase italic tracking-tighter">
              TMOJ{" "}
              <span className="text-[#A68868] dark:text-[#FFB800]">
                Contests
              </span>
            </h1>
            <p className="text-xl text-[#4B6382] dark:text-[#98A2B3] font-medium max-w-2xl mx-auto italic">
              Compete every week, solve challenging problems, and climb the
              global leaderboard!
            </p>
          </div>

          <button className="bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#101828] px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto shadow-xl shadow-[#FFB800]/10">
            <Gift size={20} /> Unbox Surprise
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12">
          {/* Section Heading */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-10 w-2 bg-[#A68868] dark:bg-[#FFB800] rounded-full transition-colors"></div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight">
              Featured Events
            </h2>
          </div>

          {/* Upcoming Contests Container */}
          <div className="bg-white dark:bg-[#1C2737] rounded-[3rem] p-10 shadow-2xl border border-transparent dark:border-[#344054]/50">
            <UpcomingContests />
          </div>
        </div>
      </div>
    </div>
  );
}
