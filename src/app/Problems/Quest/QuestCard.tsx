"use client";
import React from "react";
import { Card, CardBody, Button } from "@heroui/react";

interface QuestCardProps {
  title: string;
  levels: string;
  icon: React.ReactNode;
  iconBg: string;
}

export const QuestCard = ({ title, levels, icon, iconBg }: QuestCardProps) => (
  <Card className="border-none shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all cursor-pointer bg-white dark:bg-[#1C2737] rounded-2xl overflow-hidden group">
    <CardBody className="flex flex-row items-center justify-between p-8">
      <div className="flex flex-col gap-1">
        {/* Title: Trắng sứ trong Dark Mode */}
        <h3 className="text-xl font-black text-[#262626] dark:text-[#F9FAFB] group-hover:dark:text-[#E3C39D] transition-colors">
          {title}
        </h3>

        {/* Levels info */}
        <p className="text-sm text-gray-400 dark:text-[#667085] font-bold uppercase tracking-wider">
          {levels}
        </p>

        {/* Action Button */}
        <Button
          size="sm"
          variant="flat"
          className="mt-6 w-fit bg-[#fff7ed] dark:bg-[#E3C39D]/10 text-[#fb923c] dark:text-[#E3C39D] font-black rounded-xl px-6 h-10 shadow-sm active:scale-95 transition-all"
        >
          👋 Start
        </Button>
      </div>

      {/* Icon Container */}
      <div
        className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500 ${iconBg} dark:opacity-90`}
      >
        <div className="scale-125">{icon}</div>
      </div>
    </CardBody>
  </Card>
);
