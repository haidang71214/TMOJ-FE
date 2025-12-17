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
    className={`border-none shadow-sm hover:shadow-md transition-all cursor-pointer h-[240px] ${bgGradient} text-white`}
  >
    <CardBody className="flex flex-col justify-between p-6">
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-[12px] opacity-80 mt-1">{desc}</p>
      </div>
      <div className="flex justify-center items-center opacity-90 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </CardBody>
  </Card>
);
