"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Search, ArrowUpDown, Filter, ChevronRight } from "lucide-react";
import { Input, Button } from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentProblemId: string;
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

  const filteredProblems = useMemo(() => {
    return MOCK_PROBLEMS.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleProblemClick = (id: string) => {
    router.push(`/Problems/${id}`);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300 backdrop-blur-sm ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[400px] bg-white dark:bg-[#1C2737] shadow-2xl z-[101] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } border-r dark:border-[#334155]`}
      >
        <div className="flex flex-col h-full font-sans text-[#262626] dark:text-[#F9FAFB]">
          {/* Header Sidebar */}
          <div className="p-5 flex items-center justify-between border-b dark:border-[#334155]">
            <div className="flex items-center gap-1 font-black text-lg cursor-pointer hover:text-blue-600 dark:hover:text-[#E3C39D] transition-colors uppercase tracking-tight">
              Problem List{" "}
              <ChevronRight
                size={20}
                className="text-gray-400 dark:text-[#667085]"
              />
            </div>
            <div className="flex items-center gap-4 text-[12px] font-bold text-gray-400 dark:text-[#94A3B8]">
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#101828] px-2 py-1 rounded-full">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500" />
                <span>0/3778 Solved</span>
              </div>
              <X
                className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
                onClick={onClose}
                size={22}
              />
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 flex gap-2 items-center bg-gray-50/50 dark:bg-[#162130]">
            <Input
              size="sm"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={
                <Search
                  size={16}
                  className="text-gray-400 dark:text-[#667085]"
                />
              }
              className="flex-1"
              variant="flat"
              classNames={{
                inputWrapper:
                  "dark:bg-[#101828] border-transparent group-data-[focus=true]:dark:border-[#E3C39D] dark:text-white transition-all",
                input: "placeholder:dark:text-[#475569] text-sm",
              }}
            />
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400 dark:text-[#94A3B8] hover:dark:text-white"
            >
              <ArrowUpDown size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400 dark:text-[#94A3B8] hover:dark:text-white"
            >
              <Filter size={16} />
            </Button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-1">
            {filteredProblems.map((prob) => {
              const isSelected = String(prob.id) === String(currentProblemId);

              return (
                <div
                  key={prob.id}
                  onClick={() => handleProblemClick(prob.id)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 group ${
                    isSelected
                      ? "bg-gray-900 dark:bg-[#E3C39D] text-white dark:text-[#101828] shadow-lg shadow-black/10 scale-[1.02] z-10"
                      : "hover:bg-gray-100 dark:hover:bg-[#101828] text-[#262626] dark:text-[#CDD5DB]"
                  }`}
                >
                  <div className="flex gap-4 text-[14px] font-bold items-center overflow-hidden">
                    <span
                      className={`w-6 text-right shrink-0 transition-colors ${
                        isSelected
                          ? "dark:text-[#101828]/60"
                          : "text-gray-400 dark:text-[#475569]"
                      }`}
                    >
                      {prob.id}.
                    </span>
                    <span className="truncate group-hover:dark:text-white transition-colors">
                      {prob.title}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-black uppercase tracking-tighter shrink-0 ml-2 px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-black/10 dark:bg-black/20 text-current"
                        : prob.difficulty === "Easy"
                        ? "text-cyan-500 bg-cyan-500/10"
                        : prob.difficulty === "Med."
                        ? "text-orange-500 bg-orange-500/10"
                        : "text-rose-500 bg-rose-500/10"
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>
              );
            })}

            {filteredProblems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <Search size={40} className="mb-2" />
                <p className="text-sm font-bold uppercase tracking-widest">
                  No problems found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
