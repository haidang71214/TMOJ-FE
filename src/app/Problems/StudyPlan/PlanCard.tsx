"use client";
import React from "react";

interface PlanCardProps {
  title: string;
  desc: string;
  bgGradient: string;
  icon: React.ReactNode;
  className?: string; // Đã thêm prop className
}

export const PlanCard = ({
  title,
  desc,
  bgGradient,
  icon,
  className,
}: PlanCardProps) => {
  return (
    <div
      className={`relative overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-95 ${bgGradient} ${className}`}
    >
      {/* Background Icon Decoration */}
      <div className="absolute right-[-10px] bottom-[-10px] transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 ease-out">
        {icon}
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
          {title}
        </h3>
        <p className="text-white/60 text-[10px] font-bold uppercase mt-3 tracking-widest">
          {desc}
        </p>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
