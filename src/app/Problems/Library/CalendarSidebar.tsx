"use client";
import React, { useState } from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { ChevronLeft, ChevronRight, Flame, Heart } from "lucide-react";

export const CalendarSidebar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dữ liệu mẫu
  const solvedDays = [5, 12, 18, 19, 22];
  const streakDays = [27, 28, 29, 30];
  const currentStreak = streakDays.length;

  // State cho Like (trái tim) theo ngày
  const [likedDays, setLikedDays] = useState<Set<number>>(new Set());

  const toggleLike = (day: number) => {
    setLikedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const changeMonth = (offset: number) =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
      {/* CALENDAR CARD */}
      <Card
        shadow="sm"
        className="border-none bg-white dark:bg-[#1C2737] p-1 transition-all duration-500"
      >
        <CardBody className="p-2">
          {/* Header: Chữ trắng sáng */}
          <div className="flex justify-between items-center mb-4 text-[13px] font-bold px-1 text-[#071739] dark:text-[#FFFFFF]">
            <span className="capitalize tracking-tight">
              {currentDate.toLocaleString("en-US", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </span>
            <div className="flex gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="dark:text-white dark:hover:bg-[#101828]"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="dark:text-white dark:hover:bg-[#101828]"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-3 text-center text-[10px] mb-4 font-bold">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={`weekday-${i}`}
                className="text-gray-400 dark:text-[#94A3B8] uppercase tracking-tighter"
              >
                {d}
              </div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 w-8" />
            ))}

            {days.map((day) => {
              const now = new Date();
              const isToday =
                day === now.getDate() &&
                currentDate.getMonth() === now.getMonth() &&
                currentDate.getFullYear() === now.getFullYear();

              const isStreak = streakDays.includes(day);
              const isSolved = solvedDays.includes(day);
              const isLiked = likedDays.has(day);

              return (
                <div
                  key={day}
                  className="relative flex flex-col items-center justify-center group"
                >
                  <div
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-[11px] cursor-pointer font-bold transition-all ${
                      isToday
                        ? "bg-[#071739] dark:bg-[#E3C39D] text-[#E3C39D] dark:text-[#101828] shadow-lg z-10 scale-110"
                        : "hover:bg-gray-100 dark:hover:bg-[#101828] text-gray-600 dark:text-[#F1F5F9]"
                    }`}
                  >
                    {day}
                  </div>

                  {/* Chấm Cam cho Streak */}
                  {isStreak && (
                    <div
                      className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] ${
                        isToday ? "dark:bg-[#101828]" : ""
                      }`}
                    >
                      {isToday && (
                        <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></span>
                      )}
                    </div>
                  )}

                  {/* Chấm Xanh cho Solved */}
                  {isSolved && !isStreak && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.4)]"></div>
                  )}

                  {/* Ô Thích (trái tim) */}
                  <button
                    onClick={() => toggleLike(day)}
                    className="absolute -top-1 right-0 focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Heart
                      size={14}
                      className={`transition-colors ${
                        isLiked
                          ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                          : "text-gray-400 hover:text-red-400 dark:text-[#475569] dark:hover:text-red-400"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Card */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-[#334155] px-1">
            <div className="flex items-center gap-1.5 text-[12px] font-bold">
              <Flame
                size={16}
                className={
                  currentStreak > 0
                    ? "text-orange-500 fill-orange-500 animate-pulse"
                    : "text-gray-300 dark:text-[#475569]"
                }
              />
              <span className="text-[#071739] dark:text-[#E3C39D] uppercase tracking-tight">
                {currentStreak} Day Streak
              </span>
            </div>
            <button className="text-[10px] text-teal-600 dark:text-teal-400 font-black hover:underline transition-all">
              DETAILS
            </button>
          </div>
        </CardBody>
      </Card>

      {/* TRENDING COMPANIES */}
      <Card
        shadow="sm"
        className="border-none bg-white dark:bg-[#1C2737] transition-all duration-500"
      >
        <CardBody className="p-4">
          <h3 className="text-[11px] font-black text-gray-400 dark:text-[#94A3B8] uppercase mb-4 tracking-widest">
            Trending Companies
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Meta", count: 1352 },
              { name: "Amazon", count: 1903 },
              { name: "Google", count: 2177 },
            ].map((co) => (
              <Chip
                key={co.name}
                variant="flat"
                className="bg-[#CDD5DB]/20 dark:bg-[#101828] border-none px-2"
                size="sm"
              >
                <span className="text-[#071739] dark:text-[#FFFFFF] font-bold text-[11px]">
                  {co.name}
                </span>
                <span className="ml-1 text-orange-500 font-black text-[11px]">
                  {co.count}
                </span>
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};