"use client";
import React, { useState } from "react";
import Image from "next/image"; // Import component Image của Next.js
import { Card, CardBody } from "@heroui/react";
import { Lock, ChevronRight, Image as ImageIcon } from "lucide-react";

interface ListCardProps {
  title: string;
  desc: string;
  image?: string;
  isLocked?: boolean;
  className?: string;
}

export const ListCard = ({
  title,
  desc,
  image,
  isLocked,
  className,
}: ListCardProps) => {
  const [imgError, setImgError] = useState(false);

  // URL mặc định nếu không có ảnh hoặc ảnh lỗi
  const fallbackImage =
    "https://assets.leetcode.com/study_plan_v2/top-interview-150/cover";

  return (
    <Card
      shadow="none"
      className={`border-none transition-all cursor-pointer bg-white dark:bg-[#1C2737] h-[100px] group overflow-hidden rounded-[2rem] border border-transparent hover:border-slate-200 dark:hover:border-white/10 ${
        isLocked
          ? "opacity-50 grayscale"
          : "hover:bg-slate-50 dark:hover:bg-white/5 shadow-sm hover:shadow-xl"
      } ${className}`}
    >
      <CardBody className="flex flex-row items-center p-4 gap-6 relative h-full">
        {/* Image Container */}
        <div
          className={`w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20 flex items-center justify-center relative transition-colors duration-500 ${
            !isLocked && "group-hover:border-[#FF5C00]/50"
          }`}
        >
          {imgError ? (
            <ImageIcon size={24} className="text-slate-400 opacity-50" />
          ) : (
            <Image
              src={image || fallbackImage}
              alt={title}
              fill // Sử dụng fill để ảnh lấp đầy container
              sizes="64px" // Tối ưu kích thước tải
              priority={false}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
              unoptimized={image?.startsWith("http") ? false : true} // Tự động tối ưu nếu là ảnh remote
            />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[16px] font-black text-[#071739] dark:text-white truncate uppercase italic tracking-tighter group-hover:text-[#FF5C00] transition-colors leading-tight">
            {title}
          </h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-bold uppercase tracking-widest mt-1">
            {desc}
          </p>
        </div>

        {/* Status Section */}
        <div className="shrink-0 flex items-center justify-center pr-2">
          {isLocked ? (
            <div className="bg-slate-100 dark:bg-black/40 p-2.5 rounded-xl text-slate-400">
              <Lock size={16} strokeWidth={3} />
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-[#FF5C00] transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <ChevronRight size={20} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Decor Line */}
        {!isLocked && (
          <div className="absolute bottom-0 left-0 h-1 bg-[#FF5C00] w-0 group-hover:w-full transition-all duration-500" />
        )}
      </CardBody>
    </Card>
  );
};
