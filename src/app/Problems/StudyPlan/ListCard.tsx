"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Lock } from "lucide-react";

interface ListCardProps {
  title: string;
  desc: string;
  image: string;
  isLocked?: boolean;
}

export const ListCard = ({ title, desc, image, isLocked }: ListCardProps) => (
  <Card
    className={`border-none shadow-sm transition-all cursor-pointer bg-white dark:bg-[#1C2737] h-[90px] group ${
      isLocked ? "opacity-75" : "hover:bg-gray-50 dark:hover:bg-[#162130]"
    }`}
  >
    <CardBody className="flex flex-row items-center p-4 gap-4 relative overflow-hidden">
      {/* Image Container */}
      <div
        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border dark:border-[#334155] ${
          isLocked ? "grayscale" : ""
        }`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-black text-gray-800 dark:text-[#F9FAFB] truncate transition-colors group-hover:dark:text-[#E3C39D]">
          {title}
        </h4>
        <p className="text-[12px] text-gray-400 dark:text-[#667085] mt-0.5 truncate font-bold uppercase tracking-tighter">
          {desc}
        </p>
      </div>

      {/* Lock Icon Section */}
      {isLocked ? (
        <div className="flex items-center justify-center bg-orange-50 dark:bg-orange-500/10 p-2 rounded-lg">
          <Lock size={16} className="text-orange-500 dark:text-[#E3C39D]" />
        </div>
      ) : (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-[#E3C39D]" />
        </div>
      )}
    </CardBody>
  </Card>
);
