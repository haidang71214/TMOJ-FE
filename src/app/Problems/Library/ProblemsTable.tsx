"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

import { Problem } from "@/types";

interface ProblemsTableProps {
  problems: Problem[];
  likedProblems: Set<string>; // Truyền từ parent
  toggleLike: (id: string) => void; // Hàm toggle từ parent
}

export const ProblemsTable = ({ problems, likedProblems, toggleLike }: ProblemsTableProps) => {
  const { t, language } = useTranslation();

  return (
  <Table aria-label="Problems table" removeWrapper className="mt-2">
    <TableHeader>
      {/* Cột Like mới */}
      <TableColumn className="bg-transparent border-b border-gray-100 dark:border-[#334155] text-center text-[11px] text-gray-400 dark:text-[#94a3b8] uppercase font-black py-4 w-12">
        {t('common.like') || (language === 'vi' ? 'Thích' : 'Like')}
      </TableColumn>
      <TableColumn className="bg-transparent border-b border-gray-100 dark:border-[#334155] text-[11px] text-gray-400 dark:text-[#94a3b8] uppercase font-black py-4">
        {t('common.title') || (language === 'vi' ? 'Tên bài tập' : 'Title')}
      </TableColumn>
      <TableColumn className="bg-transparent border-b border-gray-100 dark:border-[#334155] text-center text-[11px] text-gray-400 dark:text-[#94a3b8] uppercase font-black py-4">
        {t('common.difficulty') || (language === 'vi' ? 'Độ khó' : 'Difficulty')}
      </TableColumn>
      <TableColumn className="bg-transparent border-b border-gray-100 dark:border-[#334155] text-right text-[11px] text-gray-400 dark:text-[#94a3b8] uppercase font-black py-4">
        {t('common.status') || (language === 'vi' ? 'Trạng thái' : 'Status')}
      </TableColumn>
    </TableHeader>
    <TableBody>
      {problems.map((p, index) => {
        
        const isLiked = likedProblems.has(p.id);

        return (
          <TableRow
            key={p.id}
            className={`cursor-pointer border-b border-gray-50 dark:border-[#1e293b] transition-all duration-200 animate-fade-in-right
              ${index % 2 !== 0 ? "bg-gray-50/50 dark:bg-[#1e293b]/40" : "bg-transparent"} 
              hover:bg-blue-50/50 dark:hover:bg-[#334155]/60`}
            style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
          >
            {/* Cột Like */}
            <TableCell className="py-5 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn click row chuyển trang
                  toggleLike(p.id);
                }}
                className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95 animate-fade-in-up"
                style={{ animationFillMode: 'both', animationDelay: `${index * 50 + 100}ms` }}
              >
                <Heart
                  size={18}
                  className={`transition-colors ${
                    isLiked
                      ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                      : "text-gray-400 hover:text-red-400 dark:text-[#475569] dark:hover:text-red-400"
                  }`}
                />
              </button>
            </TableCell>

            {/* Title */}
            <TableCell className="py-5 font-bold text-[14px] text-gray-900 dark:text-[#f8fafc] leading-none">
              <Link
                href={`/Problems/${p.id}`}
                className="hover:text-blue-600 dark:hover:text-[#E3C39D] transition-colors block w-full"
              >
                <span className="opacity-50 mr-1">{index + 1}.</span> {p.title}
              </Link>
            </TableCell>

            {/* Difficulty */}
            <TableCell className="text-center py-5">
              <span
                className={`inline-block text-[12px] font-black px-2 py-1 rounded-md ${
                  p.difficulty?.toLowerCase() === "easy"
                    ? "text-teal-500 bg-teal-500/10"
                    : p.difficulty?.toLowerCase() === "medium"
                    ? "text-orange-400 bg-orange-400/10"
                    : "text-red-500 bg-red-500/10"
                }`}
              >
                {p.difficulty?.toLowerCase() === "easy" ? (t('problem_management.easy') || (language === 'vi' ? 'Dễ' : 'Easy')) :
                 p.difficulty?.toLowerCase() === "medium" ? (t('problem_management.medium') || (language === 'vi' ? 'Vừa' : 'Medium')) :
                 p.difficulty?.toLowerCase() === "hard" ? (t('problem_management.hard') || (language === 'vi' ? 'Khó' : 'Hard')) :
                 p.difficulty}
              </span>
            </TableCell>

            {/* Status */}
            <TableCell className="text-right py-5 pr-4">
              <div className="flex justify-end items-center">
                 {/*  TODO: Map with user's solved status from API when available */}
                 <span className="text-gray-200 dark:text-[#334155] font-light">—</span>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
  );
};