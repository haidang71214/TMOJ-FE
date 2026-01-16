"use client";
import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Play } from "lucide-react";

export const QuestBanners = () => {
  const banners = [
    {
      title: "Practice Adventure",
      sub: "Quest",
      color: "bg-[#f2f2f2]",
      icon: "🏆",
      btn: "Begin Now",
      btnColor: "bg-black text-white",
    },
    {
      title: "30 Days Challenge",
      sub: "JavaScript",
      color: "bg-[#fff7ed]",
      icon: "JS",
      btn: "Start Learning",
      btnColor: "bg-white text-orange-600 border border-orange-100",
    },
    {
      title: "Top Questions",
      sub: "Interview",
      color: "bg-[#eff6ff]",
      icon: "🚀",
      btn: "Get Started",
      btnColor: "bg-blue-600 text-white shadow-md shadow-blue-100",
    },
    {
      title: "Data Structure",
      sub: "Premium",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      icon: "💎",
      btn: "Unlock",
      btnColor: "bg-white text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {banners.map((b, i) => (
        <Card
          key={i}
          className={`${b.color} h-32 border-none shadow-none cursor-pointer overflow-hidden group`}
        >
          <CardBody className="p-4 flex flex-col justify-center relative" style={{overflowY:"hidden",overflowX:"hidden"}}>
            <p
              className={`text-[10px] font-bold uppercase tracking-widest ${
                b.sub === "Premium" ? "text-white/80" : "text-gray-400"
              }`}
            >
              {b.sub}
            </p>
            <p
              className={`text-sm font-bold mt-1 ${
                b.sub === "Premium" ? "text-white" : ""
              }`}
            >
              {b.title}
            </p>
            <Button
              size="sm"
              className={`mt-2 w-fit rounded-md font-bold ${b.btnColor}`}
              startContent={
                b.sub !== "Premium" && <Play size={10} fill="currentColor" />
              }
            >
              {b.btn}
            </Button>
            <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 group-hover:scale-110 transition-transform">
              {b.icon}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
