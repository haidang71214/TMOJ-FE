"use client";
import React from "react";
import { Avatar, Chip } from "@heroui/react";
import { CheckCircle2, Link as LinkIcon, Eye } from "lucide-react";

export const VideoSolution = () => {
  return (
    <div className="space-y-6 transition-colors duration-500">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#262626] dark:text-[#F9FAFB] tracking-tight">
          Two Sum
        </h2>
        <LinkIcon
          size={18}
          className="text-gray-300 dark:text-[#475569] cursor-pointer hover:text-gray-600 dark:hover:text-[#E3C39D] transition-colors"
        />
      </div>

      {/* Thông tin kênh đăng video */}
      <div className="flex items-center gap-3 p-1">
        <Avatar
          src="https://assets.leetcode.com/users/leetcode/avatar_1568224780.png"
          className="w-10 h-10 border border-gray-100 dark:border-[#334155] shadow-sm"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-[#262626] dark:text-white">
              LeetCode
            </span>
            <CheckCircle2
              size={14}
              className="text-blue-500 fill-blue-500 dark:text-[#101828] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-tighter">
            <span className="flex items-center gap-1">
              <Eye size={12} /> 12,069,515
            </span>
            <span>•</span>
            <span>Jun 25, 2021</span>
          </div>
        </div>
      </div>

      {/* Tag Editorial */}
      <Chip
        size="sm"
        variant="flat"
        className="bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 font-black border-none px-3 h-6 rounded-lg uppercase text-[10px] tracking-widest"
      >
        Editorial
      </Chip>

      <div className="pt-4">
        <h3 className="text-lg font-black text-[#262626] dark:text-[#F9FAFB] mb-4">
          Video Solution
        </h3>

        {/* Khung Video giả lập chuyên nghiệp */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group cursor-pointer shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <img
            src="https://img.youtube.com/vi/KLlXCFG5TkE/maxresdefault.jpg"
            className="w-full h-full object-cover opacity-90 dark:opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
            alt="YouTube Thumbnail"
          />

          {/* Overlay gradient cho video thêm sâu */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Nút Play trung tâm */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-11 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] dark:shadow-[0_0_30px_rgba(220,38,38,0.15)] group-hover:scale-110">
              <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-white ml-1"></div>
            </div>
          </div>

          {/* Thời lượng video */}
          <div className="absolute bottom-4 left-4 bg-black/80 dark:bg-[#101828]/90 px-2 py-1 rounded-lg text-[11px] text-white dark:text-[#E3C39D] font-black backdrop-blur-md border border-white/10">
            12:07
          </div>
        </div>
      </div>
    </div>
  );
};
