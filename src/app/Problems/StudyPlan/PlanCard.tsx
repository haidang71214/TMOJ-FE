"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";

interface PlanCardProps {
  title: string;
  desc: string;
  bgGradient: string;
  icon: React.ReactNode;
}

export const PlanCard = ({ title, desc, bgGradient, icon }: PlanCardProps) => (
  <Card
    className={`border-none shadow-sm hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-500 cursor-pointer h-[240px] group overflow-hidden ${bgGradient} text-white`}
  >
    {/* Lớp phủ mờ giúp card trông sâu hơn trong Dark Mode */}
    <CardBody className="flex flex-col justify-between p-7 relative z-10 dark:bg-black/10">
      <div className="space-y-2">
        <h3 className="text-xl font-black tracking-tight drop-shadow-md">
          {title}
        </h3>
        <p className="text-[12px] font-bold opacity-90 leading-relaxed max-w-[80%] uppercase tracking-widest">
          {desc}
        </p>
      </div>

      <div className="flex justify-center items-center opacity-90 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500 ease-out drop-shadow-2xl">
        {/* Tăng kích thước icon và hiệu ứng đổ bóng */}
        <div className="scale-[1.5]">{icon}</div>
      </div>

      {/* Hiệu ứng ánh sáng nền (Glow) đặc trưng cho Dark Mode */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
    </CardBody>
  </Card>
);
