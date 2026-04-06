"use client";
import React from "react";
import {
  FileText,
  Clock,
  Database,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";
import { useAppSelector } from "@/utils/redux";
import { Discussion } from "@/app/components/Discussion";

export default function DescriptionTab() {
  const { id } = useParams<{ id: string }>();

  const {
    data: response,
    isLoading,
    isError,
  } = useGetDetailProblemPublicQuery({ id }, { skip: !id });

  const problem = response?.data;
  const user = useAppSelector((state) => state.auth.user);
  const currentUserId = user?.userId || "";

  if (isLoading) {
    return (
      <div className="h-full px-6 py-5 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Đang tải...
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="h-full px-6 py-5 flex items-center justify-center text-red-500">
        Không tìm thấy bài toán.
      </div>
    );
  }

  // Map difficulty style
  const difficultyMap: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    easy: { bg: "bg-cyan-500/10", text: "text-cyan-500", label: "Easy" },
    medium: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Medium" },
    hard: { bg: "bg-red-500/10", text: "text-red-500", label: "Hard" },
  };

  const diff = difficultyMap[problem.difficulty?.toLowerCase() ?? "easy"];

  // Format ngày tháng đơn giản
  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "Not publish";

  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-6 no-scrollbar">
      {/* Title + Difficulty */}
      <div className="space-y-3">
        <h1 className="text-xl font-black text-[#262626] dark:text-[#F9FAFB]">
          {problem.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${diff.bg} ${diff.text}`}
          >
            {diff.label}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-400 dark:text-[#667085] bg-gray-100 dark:bg-[#101828] border dark:border-[#334155]">
            <FileText size={11} /> {problem.statusCode}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-400 dark:text-[#667085] bg-gray-100 dark:bg-[#101828] border dark:border-[#334155]">
            <CheckCircle2 size={11} />{" "}
            {problem.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="text-[14px] leading-7 text-[#3D3D3D] dark:text-[#CDD5DB] prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: problem.content ?? "" }} />
      </div>

      {/* Metadata - chỉ hiển thị field có thật */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-[#101828] rounded-xl p-5 border dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <FileText size={16} className="text-gray-500" />
          <div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">Slug</p>
            <p className="text-[14px] font-mono text-[#262626] dark:text-[#F9FAFB] break-all">
              {problem.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={16} className="text-blue-500" />
          <div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Time Limit
            </p>
            <p className="text-[14px] font-semibold text-[#262626] dark:text-[#F9FAFB]">
              {problem.timeLimitMs} ms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Database size={16} className="text-purple-500" />
          <div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Memory Limit
            </p>
            <p className="text-[14px] font-semibold text-[#262626] dark:text-[#F9FAFB]">
              {problem.memoryLimitKb} KB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-amber-500" />
          <div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Created At
            </p>
            <p className="text-[14px] font-semibold text-[#262626] dark:text-[#F9FAFB]">
              {formatDate(problem.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-green-500" />
          <div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Published At
            </p>
            <p className="text-[14px] font-semibold text-[#262626] dark:text-[#F9FAFB]">
              {formatDate(problem.publishedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <div>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Acceptance
            </p>
            <p className="text-[14px] font-semibold text-[#262626] dark:text-[#F9FAFB]">
              {problem.acceptancePercent?.toFixed(2) ?? "?"}%
            </p>
          </div>
        </div>
      </div>

      {/* Footer đơn giản - chỉ giữ acceptance */}
      <div className="pt-5 border-t dark:border-[#334155] flex items-center gap-6 text-[12px] text-gray-400 dark:text-[#475569]">
        <span className="flex items-center gap-1.5 font-bold">
          Acceptance: {problem.acceptancePercent?.toFixed(1) ?? "??"}%
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </span>
      </div>

      <Discussion problemId={id} currentUserId={currentUserId} />
    </div>
  );
}
