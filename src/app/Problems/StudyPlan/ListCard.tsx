"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Lock } from "lucide-react";

interface ListCardProps {
  title: string;
  desc: string;
  image?: string; // Chuyển thành optional để tránh lỗi nếu không có ảnh
  isLocked?: boolean;
  className?: string; // Thêm className để nhận style từ StudyPlanPage
}

export const ListCard = ({
  title,
  desc,
  image,
  isLocked,
  className,
}: ListCardProps) => (
  <Card
    shadow="none"
    className={`border-none transition-all cursor-pointer bg-white dark:bg-[#1C2737] h-[95px] group overflow-hidden ${
      isLocked ? "opacity-60" : "hover:bg-gray-50 dark:hover:bg-[#222B3A]"
    } ${className}`} // Nhận className từ props truyền vào
  >
    <CardBody className="flex flex-row items-center p-4 gap-5 relative">
      {/* Image Container */}
      <div
        className={`w-16 h-16 rounded-[1.25rem] overflow-hidden shrink-0 border-2 border-[#CDD5DB] dark:border-[#344054]/50 shadow-sm ${
          isLocked ? "grayscale" : ""
        }`}
      >
        <img
          src={
            image ||
            "https://assets.leetcode.com/study_plan_v2/top-interview-150/cover"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[16px] font-black text-[#071739] dark:text-[#F9FAFB] truncate uppercase italic tracking-tighter group-hover:text-[#A68868] dark:group-hover:text-[#FFB800] transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-[#4B6382] dark:text-[#98A2B3] mt-1 truncate font-bold uppercase tracking-widest opacity-70">
          {desc}
        </p>
      </div>

      {/* Status Section */}
      <div className="shrink-0 flex items-center justify-center">
        {isLocked ? (
          <div className="bg-orange-50 dark:bg-[#FFB800]/10 p-2.5 rounded-xl border border-orange-100 dark:border-[#FFB800]/20">
            <Lock size={18} className="text-orange-500 dark:text-[#FFB800]" />
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-[#CDD5DB] dark:bg-[#344054] group-hover:bg-[#FFB800] group-hover:scale-150 transition-all shadow-sm" />
        )}
      </div>
    </CardBody>
  </Card>
);
