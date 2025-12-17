"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Search, ArrowUpDown, Filter, ChevronRight } from "lucide-react";
import { Input, Button } from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentProblemId: string; // ID lấy từ URL (ví dụ: "1")
}

const MOCK_PROBLEMS = [
  { id: "1", title: "Two Sum", difficulty: "Easy" },
  { id: "2", title: "Add Two Numbers", difficulty: "Med." },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Med.",
  },
  { id: "4", title: "Median of Two Sorted Arrays", difficulty: "Hard" },
  { id: "5", title: "Longest Palindromic Substring", difficulty: "Med." },
  { id: "6", title: "Zigzag Conversion", difficulty: "Med." },
  { id: "7", title: "Reverse Integer", difficulty: "Med." },
  { id: "8", title: "String to Integer (atoi)", difficulty: "Med." },
  { id: "9", title: "Palindrome Number", difficulty: "Easy" },
  { id: "10", title: "Regular Expression Matching", difficulty: "Hard" },
];

export const ProblemListSidebar = ({
  isOpen,
  onClose,
  currentProblemId,
}: Props) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Logic tìm kiếm bài tập
  const filteredProblems = useMemo(() => {
    return MOCK_PROBLEMS.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.includes(searchQuery)
    );
  }, [searchQuery]);

  // Xử lý khi click chọn bài tập
  const handleProblemClick = (id: string) => {
    router.push(`/Problems/${id}`);
    onClose(); // Đóng sidebar sau khi chọn bài mới
  };

  return (
    <>
      {/* Overlay - Làm mờ nền */}
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[400px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full font-sans text-[#262626]">
          {/* Header Sidebar */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-1 font-bold text-lg cursor-pointer hover:text-gray-500 transition-colors">
              Problem List <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-4 text-[13px] text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                <span>0/3778 Solved</span>
              </div>
              <X
                className="cursor-pointer hover:text-black transition-colors"
                onClick={onClose}
                size={20}
              />
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="px-4 pb-4 flex gap-2 items-center">
            <Input
              size="sm"
              placeholder="Search questions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search size={16} className="text-gray-400" />}
              className="flex-1"
              variant="flat"
              classNames={{
                inputWrapper:
                  "bg-gray-100/50 group-data-[focus=true]:bg-white border-transparent group-data-[focus=true]:border-gray-200",
              }}
            />
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400"
            >
              <ArrowUpDown size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400"
            >
              <Filter size={16} />
            </Button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-10">
            {filteredProblems.map((prob) => {
              // ÉP KIỂU STRING ĐỂ SO SÁNH (Sửa lỗi highlight không hiện màu đen)
              const isSelected = String(prob.id) === String(currentProblemId);

              return (
                <div
                  key={prob.id}
                  onClick={() => handleProblemClick(prob.id)}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer rounded-lg transition-all mb-0.5 ${
                    isSelected
                      ? "bg-[#262626] text-white shadow-md"
                      : "hover:bg-gray-100 text-[#262626]"
                  }`}
                >
                  <div className="flex gap-3 text-[14px] font-medium items-center overflow-hidden">
                    <span
                      className={`w-6 text-right shrink-0 ${
                        isSelected ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {prob.id}.
                    </span>
                    <span className="truncate">{prob.title}</span>
                  </div>
                  <span
                    className={`text-[12px] font-bold shrink-0 ml-2 ${
                      isSelected
                        ? "text-cyan-400"
                        : prob.difficulty === "Easy"
                        ? "text-cyan-500"
                        : prob.difficulty === "Med."
                        ? "text-orange-500"
                        : "text-rose-500"
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>
              );
            })}

            {filteredProblems.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm italic">
                No problems found
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
