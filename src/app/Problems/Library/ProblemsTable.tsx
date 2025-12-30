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
import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

export interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isSolved: boolean;
  isLocked: boolean;
  acceptance?: string;
}

interface ProblemsTableProps {
  problems: Problem[];
}

export const ProblemsTable = ({ problems }: ProblemsTableProps) => (
  <Table aria-label="Problems table" removeWrapper className="mt-2">
    <TableHeader>
      <TableColumn className="bg-transparent border-b border-gray-100 dark:border-[#334155] text-[11px] text-gray-400 dark:text-[#94a3b8] uppercase font-black py-4">
        Title
      </TableColumn>
      <TableColumn className="bg-transparent border-b border-gray-100 dark:border-[#334155] text-center text-[11px] text-gray-400 dark:text-[#94a3b8] uppercase font-black py-4">
        Difficulty
      </TableColumn>
      <TableColumn className="bg-transparent border-b border-gray-100 dark:border-[#334155] text-right text-[11px] text-gray-400 dark:text-[#94a3b8] uppercase font-black py-4">
        Status
      </TableColumn>
    </TableHeader>
    <TableBody>
      {problems.map((p, index) => {
        const problemSlug = p.title.toLowerCase().replace(/\s+/g, "-");

        return (
          <TableRow
            key={p.id}
            // Logic: Hàng lẻ sẽ có màu nền sáng hơn một chút để phân biệt (Striped effect)
            className={`cursor-pointer border-b border-gray-50 dark:border-[#1e293b] transition-all duration-200 
              ${
                index % 2 !== 0
                  ? "bg-gray-50/50 dark:bg-[#1e293b]/40"
                  : "bg-transparent"
              } 
              hover:bg-blue-50/50 dark:hover:bg-[#334155]/60`}
          >
            {/* Cột Tiêu đề: Chữ trắng sáng hoàn toàn trong Dark Mode */}
            <TableCell className="py-5 font-bold text-[14px] text-gray-900 dark:text-[#f8fafc] leading-none">
              <Link
                href={`/Problems/${problemSlug}`}
                className="hover:text-blue-600 dark:hover:text-[#E3C39D] transition-colors block w-full"
              >
                <span className="opacity-50 mr-1">{p.id}.</span> {p.title}
              </Link>
            </TableCell>

            {/* Cột Độ khó */}
            <TableCell className="text-center py-5">
              <span
                className={`text-[12px] font-black px-2 py-1 rounded-md ${
                  p.difficulty === "Easy"
                    ? "text-teal-500 bg-teal-500/10"
                    : p.difficulty === "Medium"
                    ? "text-orange-400 bg-orange-400/10"
                    : "text-red-500 bg-red-500/10"
                }`}
              >
                {p.difficulty}
              </span>
            </TableCell>

            {/* Cột Trạng thái */}
            <TableCell className="text-right py-5 pr-4">
              <div className="flex justify-end items-center">
                {p.isSolved ? (
                  <CheckCircle2
                    size={18}
                    className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                  />
                ) : p.isLocked ? (
                  <Lock
                    size={16}
                    className="text-gray-300 dark:text-[#475569]"
                  />
                ) : (
                  <span className="text-gray-200 dark:text-[#334155] font-light">
                    —
                  </span>
                )}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);
