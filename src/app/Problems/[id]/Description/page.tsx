"use client";

import React from "react";
import { 
  FileText, 
  Clock, 
  Database, 
  Calendar, 
  CheckCircle2 
} from "lucide-react";
import { useParams } from "next/navigation";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";

// Types
interface Problem {
  id?: string;
  title: string;
  content?: string;
  difficulty?: string;
  statusCode?: string;
  isActive?: boolean;
  slug?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  createdAt?: string;
  publishedAt?: string;
  acceptancePercent?: number;
}

// Constants
const DIFFICULTY_MAP: Record<string, { bg: string; text: string; label: string }> = {
  easy:   { bg: "bg-cyan-500/10", text: "text-cyan-500", label: "Easy" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Medium" },
  hard:   { bg: "bg-red-500/10",   text: "text-red-500",   label: "Hard" },
};

const DEFAULT_DIFFICULTY = { bg: "bg-cyan-500/10", text: "text-cyan-500", label: "Easy" };

// Helper functions
const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "Chưa công bố";
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDifficulty = (difficulty?: string) => 
  DIFFICULTY_MAP[difficulty?.toLowerCase() ?? "easy"] ?? DEFAULT_DIFFICULTY;

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="h-full px-6 py-5 space-y-6">
    <div className="space-y-3">
      <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-[#101828] rounded-xl p-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function DescriptionTab() {
  const { id } = useParams<{ id: string }>();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetDetailProblemPublicQuery({ id }, { skip: !id });

  const problem = response?.data as Problem | undefined;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !problem) {
    return (
      <div className="h-full px-6 py-5 flex items-center justify-center text-red-500 dark:text-red-400">
        Không tìm thấy bài toán hoặc có lỗi khi tải dữ liệu.
      </div>
    );
  }

  const diff = getDifficulty(problem.difficulty);

  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-8 no-scrollbar">
      {/* Header: Title + Badges */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#262626] dark:text-[#F9FAFB]">
          {problem.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${diff.bg} ${diff.text}`}
          >
            {diff.label}
          </span>

          {problem.statusCode && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#101828] border dark:border-[#334155] text-gray-500 dark:text-[#94A3B8]">
              <FileText size={14} />
              {problem.statusCode}
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#101828] border dark:border-[#334155] text-gray-500 dark:text-[#94A3B8]">
            <CheckCircle2 size={14} />
            {problem.isActive ? "Đang hoạt động" : "Tạm ngưng"}
          </div>
        </div>
      </div>

      {/* Problem Description - Bỏ comment và làm đẹp */}
      {problem.content && (
        <div className="prose prose-sm dark:prose-invert max-w-none 
                        text-[15px] leading-relaxed text-[#3D3D3D] dark:text-[#CDD5DB]
                        prose-headings:font-semibold prose-headings:text-[#262626] dark:prose-headings:text-white
                        prose-strong:text-[#262626] dark:prose-strong:text-white
                        prose-code:font-mono prose-code:bg-gray-100 dark:prose-code:bg-[#1F2937] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          <div dangerouslySetInnerHTML={{ __html: problem.content }} />
        </div>
      )}

      {/* Metadata Card */}
      <div className="bg-gray-50 dark:bg-[#101828] rounded-2xl p-6 border dark:border-[#334155]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { 
              icon: <FileText size={18} className="text-gray-500" />, 
              label: "Slug", 
              value: problem.slug,
              className: "font-mono break-all" 
            },
            { 
              icon: <Clock size={18} className="text-blue-500" />, 
              label: "Time Limit", 
              value: `${problem.timeLimitMs} ms` 
            },
            { 
              icon: <Database size={18} className="text-purple-500" />, 
              label: "Memory Limit", 
              value: `${problem.memoryLimitKb} KB` 
            },
            { 
              icon: <Calendar size={18} className="text-amber-500" />, 
              label: "Ngày tạo", 
              value: formatDate(problem.createdAt) 
            },
            { 
              icon: <Calendar size={18} className="text-green-500" />, 
              label: "Ngày công bố", 
              value: formatDate(problem.publishedAt) 
            },
            { 
              icon: <CheckCircle2 size={18} className="text-emerald-500" />, 
              label: "Tỷ lệ chấp nhận", 
              value: problem.acceptancePercent != null 
                ? `${problem.acceptancePercent.toFixed(2)}%` 
                : "Chưa có dữ liệu" 
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="mt-0.5">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 tracking-wide">
                  {item.label}
                </p>
                <p className={`text-[15px] font-medium text-[#262626] dark:text-[#F9FAFB] ${item.className || ""}`}>
                  {item.value ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t dark:border-[#334155] flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-[#64748B]">
        <div className="flex items-center gap-2 font-medium">
          Acceptance: 
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {problem.acceptancePercent?.toFixed(1) ?? "??"}%
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs">Online</span>
        </div>
      </div>
    </div>
  );
}