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
              <Zap className="text-[#FF5C00] w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 italic leading-none mb-1">Level {stats.level}</p>
              <h3 className="text-xl font-[1000] uppercase italic tracking-tighter text-[#071739] dark:text-white leading-none">
                Challenger
              </h3>
            </div>
          </div>
          <Chip
            startContent={<Star size={12} className="fill-current" />}
            className="bg-[#FF5C00] text-white font-black italic uppercase text-[10px] border-none px-3"
          >
            {stats.exp} EXP
          </Chip>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-400">
            <span>Next Level</span>
            <span>{Math.min(100, (stats.exp % 1000) / 10)}%</span>
          </div>
          <Progress
            size="sm"
            value={(stats.exp % 1000) / 10}
            className="h-2"
            classNames={{
              indicator: "bg-gradient-to-r from-[#FF5C00] to-[#FF8A00]",
              track: "bg-slate-100 dark:bg-white/5",
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center group/item hover:border-[#FF5C00]/30 transition-all">
            <div className="p-2 bg-orange-500/10 rounded-lg mb-2 group-hover/item:scale-110 transition-transform">
              <Flame className="text-orange-500 w-4 h-4" />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-400 italic mb-1">Streak</p>
            <p className="text-lg font-[1000] uppercase italic text-[#071739] dark:text-white leading-none">{stats.streak} Days</p>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center group/item hover:border-yellow-500/30 transition-all">
            <div className="p-2 bg-yellow-500/10 rounded-lg mb-2 group-hover/item:scale-110 transition-transform">
              <Coins className="text-yellow-500 w-4 h-4" />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-400 italic mb-1">Coins</p>
            <p className="text-lg font-[1000] uppercase italic text-[#071739] dark:text-white leading-none">{stats.coins}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
