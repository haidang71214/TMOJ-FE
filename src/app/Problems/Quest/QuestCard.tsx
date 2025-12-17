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
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white rounded-2xl overflow-hidden">
    <CardBody className="flex flex-row items-center justify-between p-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-[#262626]">{title}</h3>
        <p className="text-sm text-gray-400 font-medium">{levels}</p>
        <Button 
          size="sm" 
          variant="flat" 
          className="mt-4 w-fit bg-[#fff7ed] text-[#fb923c] font-bold rounded-lg px-5 h-9"
        >
          👋 Start
        </Button>
      </div>
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
    </CardBody>
  </Card>
);