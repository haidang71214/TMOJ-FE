"use client";

import React from "react";
import { Card, CardBody, Progress, Chip } from "@heroui/react";
import { Zap, Trophy, Flame, Coins, Star } from "lucide-react";
import { useGetGamificationMeQuery } from "@/store/queries/gamification";

export default function GamificationOverview() {
  const { data: response, isLoading } = useGetGamificationMeQuery();
  const stats = response?.data;

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm animate-pulse">
        <CardBody className="h-40" />
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm overflow-hidden group">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5C00]/5 rounded-bl-full pointer-events-none group-hover:bg-[#FF5C00]/10 transition-colors" />

      <CardBody className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF5C00]/10 rounded-xl">
              <Trophy className="text-[#FF5C00] w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 italic leading-none mb-1">Solved Problems</p>
              <h3 className="text-xl font-[1000] uppercase italic tracking-tighter text-[#071739] dark:text-white leading-none">
                {stats.solvedProblems} Problems
              </h3>
            </div>
          </div>
          <Chip
            startContent={<Flame size={12} className="fill-current" />}
            className="bg-[#FF5C00] text-white font-black italic uppercase text-[10px] border-none px-3"
          >
            {stats.currentStreak} Day Streak
          </Chip>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center group/item hover:border-[#FF5C00]/30 transition-all">
            <div className="p-2 bg-orange-500/10 rounded-lg mb-2 group-hover/item:scale-110 transition-transform">
              <Flame className="text-orange-500 w-4 h-4" />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-400 italic mb-1">Current Streak</p>
            <p className="text-lg font-[1000] uppercase italic text-[#071739] dark:text-white leading-none">{stats.currentStreak} Days</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center group/item hover:border-blue-500/30 transition-all">
            <div className="p-2 bg-blue-500/10 rounded-lg mb-2 group-hover/item:scale-110 transition-transform">
              <Zap className="text-blue-500 w-4 h-4" />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-400 italic mb-1">Longest Streak</p>
            <p className="text-lg font-[1000] uppercase italic text-[#071739] dark:text-white leading-none">{stats.longestStreak} Days</p>
          </div>
        </div>

        {stats.badges.length > 0 && (
          <div className="pt-2 space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400 italic">Recent Badges</p>
            <div className="flex gap-2">
              {stats.badges.slice(0, 4).map((badge) => (
                <div key={badge.badgeId} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center" title={badge.name}>
                  <Star className="text-yellow-500 w-5 h-5 fill-current" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
