"use client";

import React, { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import {
  Play,
  Share2,
  RotateCcw,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import ProblemsSidebar from "../../Sidebar";
import { ListControls } from "../ListControls";
import { CircularProgress } from "@heroui/react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State quản lý danh sách
  const [myList, setMyList] = useState(MY_LIST_PROBLEMS);

  // State cho modal confirm remove
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [problemToRemove, setProblemToRemove] = useState<string | null>(null);

  const openRemoveModal = (id: string) => {
    setProblemToRemove(id);
    setIsRemoveModalOpen(true);
  };

  const confirmRemove = () => {
    if (!problemToRemove) return;

    setMyList((prev) => prev.filter((p) => p.id !== problemToRemove));
    alert(`Removed "${MY_LIST_PROBLEMS.find(p => p.id === problemToRemove)?.title}" from favorites`);

    setIsRemoveModalOpen(false);
    setProblemToRemove(null);
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans flex relative overflow-hidden transition-colors duration-500">
      {/* SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <ProblemsSidebar />
        </div>
      </aside>

      {/* NÚT TOGGLE SIDEBAR */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-xl text-slate-400 hover:text-blue-600 dark:hover:text-[#00FF41] transition-all duration-300 cursor-pointer"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        <div className="flex flex-1 overflow-y-auto p-8 lg:p-12 gap-8 lg:flex-row flex-col custom-scrollbar">
          {/* CỘT TIẾN ĐỘ */}
          <div className="w-full lg:w-[340px] bg-white dark:bg-[#1C2737] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 flex flex-col items-center text-center gap-8 shadow-sm h-fit sticky top-0">
            <div className="w-24 h-24 bg-slate-50 dark:bg-black/20 rounded-[2rem] flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-inner text-5xl">
              {currentId === "Favorite" ? "⭐" : "🗒️"}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black uppercase text-[#071739] dark:text-white tracking-tighter">
                {currentId}
              </h1>
              <div className="flex items-center gap-2 justify-center">
                <div className="h-1 w-8 bg-blue-600 dark:bg-[#00FF41] rounded-full" />
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                  {myList.length} QUESTIONS
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center w-full">
              <Button
                className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-12 px-10 rounded-2xl shadow-lg uppercase text-[11px] tracking-[0.15em] transition-all 
                  hover:bg-blue-600 dark:hover:bg-[#00FF41] hover:text-white dark:hover:text-[#071739] active:scale-95"
                startContent={<Play size={16} fill="currentColor" />}
              >
                Practice
              </Button>
              <Button
                isIconOnly
                className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 h-12 w-12 rounded-2xl border border-slate-200 dark:border-white/5 hover:text-blue-600 dark:hover:text-[#00FF41] transition-all"
              >
                <Share2 size={18} />
              </Button>
            </div>

            <div className="w-full p-6 border border-slate-100 dark:border-white/5 rounded-[2rem] bg-slate-50/50 dark:bg-black/20 text-left">
              <div className="flex justify-between items-center text-[10px] font-black mb-6 uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">
                <span>Stats</span>
                <RotateCcw
                  size={14}
                  className="cursor-pointer hover:text-blue-600 dark:hover:text-[#00FF41] transition-colors"
                />
              </div>

              <div className="relative flex items-center justify-center mb-8">
                <CircularProgress
                  classNames={{
                    svg: "w-36 h-36 drop-shadow-md",
                    indicator: "stroke-blue-600 dark:stroke-[#00FF41]",
                    track: "stroke-slate-200/50 dark:stroke-white/5",
                  }}
                  value={0}
                  maxValue={myList.length}
                  strokeWidth={3}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-[#071739] dark:text-white">
                    0
                    <span className="text-slate-300 dark:text-slate-600 text-sm ml-1 font-bold">
                      /{myList.length}
                    </span>
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                    Solved
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Easy", color: "text-teal-500", count: "0/4" },
                  { label: "Med.", color: "text-amber-500", count: "0/3" },
                  { label: "Hard", color: "text-rose-500", count: "0/1" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center px-2"
                  >
                    <span
                      className={`${item.color} text-[10px] font-black uppercase tracking-widest`}
                    >
                      {item.label}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-black text-[10px]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DANH SÁCH BÀI TẬP */}
          <div className="flex-1 bg-white dark:bg-[#1C2737] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 shadow-sm h-fit">
            <ListControls />

            <div className="mt-8">
              <div className="grid grid-cols-[1fr_120px_100px_80px] px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                <span>Question Title</span>
                <span className="text-right">Acceptance</span>
                <span className="text-right">Difficulty</span>
                <span className="text-center">Remove</span>
              </div>

              <div className="flex flex-col mt-4">
                {myList.map((prob) => (
                  <div
                    key={prob.id}
                    className="grid grid-cols-[1fr_120px_100px_80px] px-6 py-5 items-center cursor-pointer transition-all border-b border-slate-50 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl"
                  >
                    <div className="flex gap-5 items-center overflow-hidden">
                      <span className="text-slate-300 dark:text-slate-600 font-black text-xs w-8 text-right shrink-0">
                        {prob.id}
                      </span>
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-[15px] font-bold truncate text-[#071739] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                          {prob.title}
                        </span>
                        {prob.isLocked ? (
                          <Lock
                            size={14}
                            className="text-[#FF5C00]"
                            strokeWidth={3}
                          />
                        ) : (
                          <Globe
                            size={14}
                            className="text-slate-200 dark:text-slate-700"
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-right text-[13px] text-slate-400 dark:text-slate-500 font-bold">
                      {prob.acceptance}
                    </span>
                    <span
                      className={`text-right text-[11px] font-black uppercase tracking-wider ${
                        prob.difficulty === "Easy"
                          ? "text-teal-500"
                          : prob.difficulty === "Med."
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {prob.difficulty}
                    </span>

                    {/* NÚT XÓA KHỎI DANH SÁCH YÊU THÍCH */}
                    <div className="flex justify-center">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        onPress={() => openRemoveModal(prob.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CONFIRM REMOVE */}
      <Modal
        isOpen={isRemoveModalOpen}
        onOpenChange={setIsRemoveModalOpen}
        size="sm"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase text-red-600">
                Remove from Favorites?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  Are you sure you want to remove{" "}
                  <span className="font-bold">
                    {MY_LIST_PROBLEMS.find(p => p.id === problemToRemove)?.title}
                  </span>{" "}
                  from your favorites list?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    confirmRemove();
                    onClose();
                  }}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}