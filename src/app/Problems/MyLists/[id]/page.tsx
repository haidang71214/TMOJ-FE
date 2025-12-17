"use client";
import React from "react";
import ProblemsSidebar from "../../Sidebar";
import { ListControls } from "../ListControls";
import { CircularProgress, Button } from "@heroui/react";
import {
  Play,
  Share2,
  MoreHorizontal,
  RotateCcw,
  Lock,
  Globe,
} from "lucide-react";
import { useParams } from "next/navigation";

const MY_LIST_PROBLEMS = [
  {
    id: "1",
    title: "Two Sum",
    acceptance: "56.7%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "8",
    title: "String to Integer (atoi)",
    acceptance: "20.2%",
    difficulty: "Med.",
    isLocked: true,
  },
  {
    id: "15",
    title: "3Sum",
    acceptance: "34.1%",
    difficulty: "Med.",
    isLocked: false,
  },
  {
    id: "20",
    title: "Valid Parentheses",
    acceptance: "41.5%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "42",
    title: "Trapping Rain Water",
    acceptance: "62.3%",
    difficulty: "Hard",
    isLocked: true,
  },
  {
    id: "70",
    title: "Climbing Stairs",
    acceptance: "53.1%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "121",
    title: "Best Time to Buy and Sell Stock",
    acceptance: "54.2%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "146",
    title: "LRU Cache",
    acceptance: "42.1%",
    difficulty: "Med.",
    isLocked: true,
  },
];

export default function MyListDetailPage() {
  const params = useParams();
  const currentId = params.id;

  return (
    <div className="flex h-screen bg-white font-sans text-[#262626]">
      {/* CỘT 1: SIDEBAR */}
      <div className="w-[240px] border-r p-4 shrink-0 overflow-y-auto no-scrollbar">
        <ProblemsSidebar />
      </div>

      {/* CỘT 2: THÔNG TIN TIẾN ĐỘ */}
      <div className="w-[300px] flex flex-col items-center text-center gap-6 p-8 border-r shrink-0">
        <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center border shadow-sm text-4xl">
          {currentId === "Favorite" ? "⭐" : "🗒️"}
        </div>

        <div>
          <h1 className="text-2xl font-bold capitalize">{currentId}</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            Rimtapcode · {MY_LIST_PROBLEMS.length} questions
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-[#262626] text-white font-bold px-6 h-8 hover:bg-black/90 transition-colors"
            startContent={<Play size={16} fill="currentColor" />}
          >
            Practice
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-gray-100 h-8 w-8 text-gray-600"
          >
            <Share2 size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-gray-100 h-8 w-8 text-gray-600"
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>

        <div className="w-full mt-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/30 text-left">
          <div className="flex justify-between items-center text-[10px] font-bold mb-4 uppercase text-gray-400 tracking-wider">
            <span>Progress</span>
            <RotateCcw
              size={14}
              className="cursor-pointer hover:text-black transition-colors"
            />
          </div>
          <div className="relative flex items-center justify-center mb-6">
            <CircularProgress
              classNames={{
                svg: "w-32 h-32",
                indicator: "stroke-gray-300",
                track: "stroke-gray-100",
              }}
              value={0}
              maxValue={MY_LIST_PROBLEMS.length}
              strokeWidth={3}
            />
            <div className="absolute flex flex-col items-center leading-tight">
              <span className="text-2xl font-bold">
                0
                <span className="text-gray-300 text-sm">
                  /{MY_LIST_PROBLEMS.length}
                </span>
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                Solved
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-[11px] font-bold">
            <div className="flex justify-between items-center">
              <span className="text-cyan-500">Easy</span>{" "}
              <span className="text-gray-500">0/4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-500">Med.</span>{" "}
              <span className="text-gray-500">0/3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-rose-500">Hard</span>{" "}
              <span className="text-gray-500">0/1</span>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT 3: DANH SÁCH BÀI TẬP TRONG LIST */}
      <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
        <ListControls />

        <div className="mt-6">
          <div className="grid grid-cols-[1fr_120px_100px] px-4 py-2 text-[11px] font-bold text-gray-400 uppercase border-b border-gray-100 tracking-widest">
            <span>Title</span>
            <span className="text-right">Acceptance</span>
            <span className="text-right">Difficulty</span>
          </div>

          <div className="flex flex-col">
            {MY_LIST_PROBLEMS.map((prob) => (
              <div
                key={prob.id}
                className="grid grid-cols-[1fr_120px_100px] px-4 py-4 items-center cursor-pointer transition-all border-b border-gray-50 group hover:bg-gray-50/80"
              >
                <div className="flex gap-4 items-center overflow-hidden">
                  <span className="text-gray-300 font-medium text-sm w-6 text-right shrink-0">
                    {prob.id}.
                  </span>
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[15px] font-semibold truncate text-[#262626] group-hover:text-blue-600 transition-colors">
                      {prob.title}
                    </span>
                    {/* Hiển thị icon tương ứng để hết lỗi unused */}
                    {prob.isLocked ? (
                      <Lock size={14} className="text-orange-400 shrink-0" />
                    ) : (
                      <Globe size={14} className="text-gray-300 shrink-0" />
                    )}
                  </div>
                </div>
                <span className="text-right text-sm text-gray-500 font-medium">
                  {prob.acceptance}
                </span>
                <span
                  className={`text-right text-sm font-bold ${
                    prob.difficulty === "Easy"
                      ? "text-cyan-500"
                      : prob.difficulty === "Med."
                      ? "text-orange-500"
                      : "text-rose-500"
                  }`}
                >
                  {prob.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
