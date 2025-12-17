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

// Định nghĩa kiểu dữ liệu cho bài tập
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
      <TableColumn className="bg-transparent border-b text-[11px] text-gray-400 uppercase font-bold py-3">
        Title
      </TableColumn>
      <TableColumn className="bg-transparent border-b text-center text-[11px] text-gray-400 uppercase font-bold py-3">
        Difficulty
      </TableColumn>
      <TableColumn className="bg-transparent border-b text-right text-[11px] text-gray-400 uppercase font-bold py-3">
        Status
      </TableColumn>
    </TableHeader>
    <TableBody>
      {problems.map((p) => {
        // 2. Tạo slug đơn giản cho URL (Ví dụ: "Two Sum" -> "two-sum")
        const problemSlug = p.title.toLowerCase().replace(/\s+/g, "-");

        return (
          <TableRow
            key={p.id}
            className="hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
          >
            <TableCell className="py-4 font-medium text-[14px] text-gray-900 leading-none">
              {/* 3. Thay span bằng Link trỏ tới folder [id] bạn đã tạo */}
              <Link
                href={`/Problems/${problemSlug}`}
                className="hover:text-blue-600 transition-colors block w-full"
              >
                {p.id}. {p.title}
              </Link>
            </TableCell>
            <TableCell className="text-center">
              <span
                className={`text-[13px] font-bold ${
                  p.difficulty === "Easy"
                    ? "text-teal-500"
                    : p.difficulty === "Medium"
                    ? "text-orange-400"
                    : "text-red-500"
                }`}
              >
                {p.difficulty}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end">
                {p.isSolved ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : p.isLocked ? (
                  <Lock size={16} className="text-gray-300" />
                ) : (
                  <span className="text-gray-200 font-light">—</span>
                )}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);
