"use client";
import React, { useState } from "react";
// Loại bỏ Progress vì không sử dụng trong file này
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

export const CalendarSidebar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
      <Card shadow="sm" className="border-none bg-white p-1">
        <CardBody className="p-2">
          <div className="flex justify-between items-center mb-4 text-[13px] font-bold px-1">
            <span className="capitalize">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </span>
            <div className="flex gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] mb-4 font-bold">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`weekday-${i}`} className="text-gray-400">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-7 w-7" />
            ))}
            {days.map((day) => {
              const now = new Date();
              const isToday =
                day === now.getDate() &&
                currentDate.getMonth() === now.getMonth() &&
                currentDate.getFullYear() === now.getFullYear();

              return (
                <div
                  key={day}
                  className={`h-7 w-7 mx-auto flex items-center justify-center rounded-full text-[11px] cursor-pointer font-bold ${
                    isToday
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 px-1">
            <div className="flex items-center gap-1 text-[11px] text-orange-500 font-bold">
              <Flame size={14} fill="currentColor" /> 0
            </div>
            <button className="text-[10px] text-green-600 font-bold hover:underline">
              Redeem
            </button>
          </div>
        </CardBody>
      </Card>

      <Card shadow="sm" className="border-none bg-white">
        <CardBody className="p-4">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase mb-4 tracking-wider">
            Trending Companies
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Meta", count: 1352 },
              { name: "Amazon", count: 1903 },
              { name: "Google", count: 2177 },
              { name: "Apple", count: 421 },
            ].map((co) => (
              <Chip
                key={co.name}
                variant="flat"
                className="bg-gray-50"
                size="sm"
              >
                <span className="text-gray-700 font-medium text-[12px]">
                  {co.name}
                </span>
                <span className="ml-1 text-orange-500 font-bold text-[12px]">
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
