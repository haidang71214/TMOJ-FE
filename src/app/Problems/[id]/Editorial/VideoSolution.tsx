"use client";
import React from "react";
import { Avatar, Chip } from "@heroui/react";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";

export const VideoSolution = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#262626]">Two Sum</h2>
        <LinkIcon
          size={18}
          className="text-gray-300 cursor-pointer hover:text-gray-600"
        />
      </div>

      {/* Thông tin kênh đăng video */}
      <div className="flex items-center gap-3">
        <Avatar
          src="https://assets.leetcode.com/users/leetcode/avatar_1568224780.png"
          className="w-9 h-9 border border-gray-100"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-[#262626]">LeetCode</span>
            <CheckCircle2
              size={14}
              className="text-blue-500 fill-blue-500 text-white"
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
            <span>👁️ 12,069,515</span>
            <span>•</span>
            <span>Jun 25, 2021</span>
          </div>
        </div>
      </div>

      <Chip
        size="sm"
        variant="flat"
        className="bg-orange-50 text-orange-500 font-bold border-none px-2 h-6 rounded-md"
      >
        Editorial
      </Chip>

      <div className="pt-4">
        <h3 className="text-lg font-bold text-[#262626] mb-4">
          Video Solution
        </h3>

        {/* Khung Video giả lập chuyên nghiệp */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
          <img
            src="https://img.youtube.com/vi/KLlXCFG5TkE/maxresdefault.jpg"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            alt="YouTube Thumbnail"
          />
          {/* Nút Play trung tâm */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-11 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-all shadow-xl group-hover:scale-110">
              <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-white ml-1"></div>
            </div>
          </div>
          {/* Thời lượng video */}
          <div className="absolute bottom-4 left-4 bg-black/70 px-2 py-1 rounded text-[11px] text-white font-bold backdrop-blur-sm">
            12:07
          </div>
        </div>
      </div>
    </div>
  );
};
