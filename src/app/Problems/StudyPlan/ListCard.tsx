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
  <Card className="border-none shadow-sm hover:bg-gray-50 transition-colors cursor-pointer bg-white h-[90px]">
    <CardBody className="flex flex-row items-center p-4 gap-4">
      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="text-[15px] font-bold text-gray-800">{title}</h4>
        <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
      </div>
      {isLocked && <Lock size={16} className="text-orange-400" />}
    </CardBody>
  </Card>
);
