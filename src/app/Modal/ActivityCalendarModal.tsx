"use client";

import React, { useMemo, useState } from "react";
import { Card, CardBody, Tooltip, Button } from "@heroui/react";
import { X, Flame, Trophy, Calendar, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useModal } from "@/Provider/ModalProvider";
import { useGetDailyActivitiesQuery, useGetStreakQuery, useGetGamificationMeQuery } from "@/store/queries/gamification";

export default function ActivityCalendarModal() {
  const { closeModal } = useModal();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: activitiesResponse } = useGetDailyActivitiesQuery();
  const { data: streakResponse } = useGetStreakQuery();
  const { data: statsResponse } = useGetGamificationMeQuery();

  const activities = activitiesResponse?.data || [];
  const streak = streakResponse?.data;
  const overallStats = statsResponse?.data;

  // Generate days for the selected year (Jan 1st to Dec 31st)
  const days = useMemo(() => {
    const result = [];
    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);

    // Align start to the beginning of the week (Sunday) to keep the grid consistent
    const firstDayPadding = start.getDay();
    const adjustedStart = new Date(start);
    adjustedStart.setDate(adjustedStart.getDate() - firstDayPadding);

    const current = new Date(adjustedStart);
    // We want to cover at least until Dec 31, and align the end to Saturday
    while (current <= end || current.getDay() !== 0) {
      const dateStr = current.toISOString().split("T")[0];
      const activity = activities.find((a) => a.date === dateStr);

      result.push({
        date: new Date(current),
        count: current.getFullYear() === selectedYear ? (activity?.count || 0) : -1, // -1 means out of year range
      });
      current.setDate(current.getDate() + 1);
      if (result.length > 400) break; // Safety break
    }
    return result;
  }, [activities, selectedYear]);

  const getColor = (count: number) => {
    if (count === -1) return "opacity-0 pointer-events-none"; // Hide days outside the selected year
    if (count === 0) return "bg-slate-100 dark:bg-white/5";
    if (count < 3) return "bg-[#FF5C00]/20";
    if (count < 6) return "bg-[#FF5C00]/40";
    if (count < 9) return "bg-[#FF5C00]/70";
    return "bg-[#FF5C00]";
  };

  // Group by weeks for the grid
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  // Months label positioning
  const monthLabels = useMemo(() => {
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth && week[0].count !== -1) {
        labels.push({
          month: week[0].date.toLocaleString("en-US", { month: "short" }),
          index
        });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="relative flex flex-col gap-6 py-8 px-8 bg-white dark:bg-[#0D121F] transition-colors duration-500 rounded-[2.5rem] shadow-2xl max-w-[950px] w-full border border-slate-200 dark:border-white/5 outline-none overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF5C00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FF5C00] font-black text-[10px] tracking-[0.3em] uppercase">
            <div className="w-6 h-[2px] bg-[#FF5C00]" />
            <span>Activity History</span>
          </div>
          <h2 className="text-3xl font-black text-[#071739] dark:text-white tracking-tighter uppercase leading-none">
            Learning <span className="text-slate-400">Calendar</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Year Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-1 border border-slate-200 dark:border-white/10">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="min-w-8 h-8 rounded-lg"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="px-4 text-sm font-black text-[#071739] dark:text-white">{selectedYear}</span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => setSelectedYear(selectedYear + 1)}
              isDisabled={selectedYear >= currentYear}
              className="min-w-8 h-8 rounded-lg"
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <Button
            isIconOnly
            variant="flat"
            onClick={closeModal}
            className="bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col gap-1 group hover:border-[#FF5C00]/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Solved</span>
          </div>
          <p className="text-2xl font-black text-[#071739] dark:text-white leading-none">
            {overallStats?.solvedProblems || 0} <span className="text-sm text-slate-400 uppercase font-bold">Problems</span>
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col gap-1 group hover:border-[#FF5C00]/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-[#FF5C00]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Streak</span>
          </div>
          <p className="text-2xl font-black text-[#071739] dark:text-white leading-none">
            {streak?.currentStreak || 0} <span className="text-sm text-slate-400 uppercase font-bold">Days</span>
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col gap-1 group hover:border-[#FF5C00]/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longest Streak</span>
          </div>
          <p className="text-2xl font-black text-[#071739] dark:text-white leading-none">
            {streak?.longestStreak || 0} <span className="text-sm text-slate-400 uppercase font-bold">Days</span>
          </p>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-x-auto scrollbar-hide">
        <div className="min-w-[800px]">
          {/* Months Row */}
          <div className="flex mb-3 ml-[35px] relative h-4">
            {monthLabels.map((label, idx) => (
              <span
                key={idx}
                className="text-[9px] font-black text-slate-400 uppercase absolute"
                style={{ left: `${(label.index / weeks.length) * 100}%` }}
              >
                {label.month}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5 h-[120px]">
            {/* Week Labels */}
            <div className="flex flex-col justify-between text-[9px] font-black text-slate-400 uppercase py-1 pr-2">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Grid */}
            <div className="flex-1 flex gap-1.5">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1.5 flex-1">
                  {week.map((day, dayIdx) => (
                    day.count === -1 ? (
                      <div key={dayIdx} className="w-full aspect-square opacity-0" />
                    ) : (
                      <Tooltip
                        key={dayIdx}
                        content={`${day.count} problems on ${day.date.toLocaleDateString()}`}
                        closeDelay={0}
                      >
                        <div
                          className={`w-full aspect-square rounded-[3px] transition-all hover:scale-125 hover:z-10 cursor-pointer ${getColor(day.count)}`}
                        />
                      </Tooltip>
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-slate-300" />
          <span>Viewing activities for the year {selectedYear}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-slate-100 dark:bg-white/5" />
          <div className="w-3 h-3 rounded-[2px] bg-[#FF5C00]/20" />
          <div className="w-3 h-3 rounded-[2px] bg-[#FF5C00]/40" />
          <div className="w-3 h-3 rounded-[2px] bg-[#FF5C00]/70" />
          <div className="w-3 h-3 rounded-[2px] bg-[#FF5C00]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
