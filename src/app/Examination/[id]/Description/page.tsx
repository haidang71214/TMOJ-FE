"use client";

import React from "react";
import {CheckCircle2, Clock, Cpu, Target, Activity, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Discussion } from "@/app/components/Discussion";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";

// Types
interface Problem {
  title: string;
  content?: string;
  difficulty?: string;
  statusCode?: string;
  isActive?: boolean;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  acceptancePercent?: number;
}

const DIFFICULTY_MAP: Record<string, { color: string; bg: string; border: string; label: string }> = {
  easy:   { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", label: "Easy" },
  medium: { color: "text-amber-700 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10",   border: "border-amber-200 dark:border-amber-500/20",   label: "Medium" },
  hard:   { color: "text-rose-700 dark:text-rose-400",     bg: "bg-rose-50 dark:bg-rose-500/10",    border: "border-rose-200 dark:border-rose-500/20",     label: "Hard" },
};

const DEFAULT_DIFFICULTY = DIFFICULTY_MAP.easy;

const getDifficulty = (difficulty?: string) => 
  DIFFICULTY_MAP[difficulty?.toLowerCase() ?? "easy"] ?? DEFAULT_DIFFICULTY;

export default function DescriptionTab() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();
     const { data: userData, } = useGetUserInformationQuery();
    console.log("aaaaaaaaaaa",userData);
  const { data: response, isLoading, isError } = useGetDetailProblemPublicQuery(
    { id }, 
    { skip: !id }
  );
  console.log("aaaa",response);
  
  const problem = response as Problem | undefined;

  if (isLoading) {
    return (
      <div className="h-full w-full overflow-hidden px-8 py-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4 bg-white dark:bg-[#1C2737]">
        <div className="w-10 h-10 border-4 border-slate-100 dark:border-[#334155] border-t-orange-500 dark:border-t-orange-500 rounded-full animate-spin"></div>
        <p className="font-black tracking-widest uppercase text-xs">
          {t("loading") || (language === "vi" ? "Đang tải dữ liệu..." : "Loading data...")}
        </p>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="h-full w-full overflow-hidden px-8 py-8 flex flex-col items-center justify-center text-rose-500 space-y-4 bg-white dark:bg-[#1C2737]">
        <AlertCircle size={48} className="text-rose-500/50" />
        <p className="font-black tracking-widest uppercase text-xs text-center">
          {t("error") || (language === "vi" ? "Không tìm thấy bài toán hoặc đã có lỗi xảy ra." : "Problem not found or an error occurred.")}
        </p>
      </div>
    );
  }

  const diff = getDifficulty(problem.difficulty);

  return (
    <div className="h-full overflow-y-auto px-6 md:px-10 py-8 space-y-8 no-scrollbar bg-white dark:bg-[#1C2737] text-slate-700 dark:text-slate-300 selection:bg-orange-500/20 selection:text-orange-600 transition-colors">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white leading-tight animate-fade-in-right" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          {problem.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest animate-fade-in-right" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <span className={`px-2.5 py-1 rounded-md border ${diff.bg} ${diff.color} ${diff.border} flex items-center gap-1 shadow-sm`}>
            <Activity size={12} />
            {t(`management.problem.difficulty.${problem.difficulty?.toLowerCase()}`) || 
             (language === 'vi' 
               ? (diff.label === 'Easy' ? 'Dễ' : diff.label === 'Medium' ? 'Trung bình' : 'Khó') 
               : diff.label.toUpperCase())}
          </span>
          
          {problem.statusCode && (
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-sm">
              {t(`management.problem.status.${problem.statusCode.toLowerCase()}`) || 
               (language === 'vi' && problem.statusCode === 'DRAFT' ? 'Nháp' : problem.statusCode.toUpperCase())}
            </span>
          )}

          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1 shadow-sm
            ${problem.isActive 
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" 
              : "bg-slate-100 dark:bg-slate-500/10 text-slate-500 border-slate-200 dark:border-slate-500/20"}`}
          >
            <CheckCircle2 size={12} className={problem.isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"} />
            {problem.isActive 
              ? (t("management.problem.active") || (language === 'vi' ? "Đang hoạt động" : "Active"))
              : (t("management.problem.inactive") || (language === 'vi' ? "Tạm ngưng" : "Inactive"))}
          </span>
        </div>
      </div>

      {/* Main Description Content - Render thật từ Markdown */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }: any) {
              return !inline ? (
                <div className="my-6 rounded-xl overflow-hidden bg-white dark:bg-[#111c35] border border-slate-200 dark:border-[#334155]/50 shadow-sm">
                  <div className="flex items-center px-4 py-2.5 bg-slate-50 dark:bg-[#0D1B2A] border-b border-slate-100 dark:border-[#334155]/50">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400 opacity-60"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-60"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-60"></div>
                    </div>
                  </div>
                  <pre className="p-4 overflow-auto text-sm bg-transparent !m-0">
                    <code className={`${className} text-slate-800 dark:text-slate-200 font-mono`} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code className="bg-[#FF5C00]/10 text-[#FF5C00] dark:text-[#FFB800] px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border border-[#FF5C00]/20" {...props}>
                  {children}
                </code>
              );
            },
            // Ẩn tiêu đề "Subtasks" nếu có trong markdown (tránh trùng với phần UI tĩnh)
            h1: ({ children }) => (String(children).toLowerCase().trim() === "subtasks" ? null : <h1>{children}</h1>),
            h2: ({ children }) => (String(children).toLowerCase().trim() === "subtasks" ? null : <h2>{children}</h2>),
            h3: ({ children }) => (String(children).toLowerCase().trim() === "subtasks" ? null : <h3>{children}</h3>),
          }}
        >
          {problem.content || "Chưa có mô tả cho bài toán này."}
        </ReactMarkdown>
      {/* Metadata */}
      <div className="flex flex-wrap gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 bg-white dark:bg-[#162130] border border-orange-100 dark:border-white/5 rounded-lg px-4 py-3 hover:border-[#FF5C00]/50 hover:shadow-md transition-all duration-300 group shadow-sm">
          <div className="text-[#FF5C00] group-hover:scale-110 transition-transform">
            <Clock size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#FF5C00]/70 dark:text-[#FF5C00]/80 font-black uppercase tracking-widest">{t("problem_workspace.time_limit") || (language === "vi" ? "Thời gian" : "Time Limit")}</span>
            <span className="text-[12px] font-bold text-slate-800 dark:text-white">{problem.timeLimitMs} ms</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-[#162130] border border-orange-100 dark:border-white/5 rounded-lg px-4 py-3 hover:border-[#FF5C00]/50 hover:shadow-md transition-all duration-300 group shadow-sm">
          <div className="text-[#FF5C00] group-hover:scale-110 transition-transform">
            <Cpu size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#FF5C00]/70 dark:text-[#FF5C00]/80 font-black uppercase tracking-widest">{t("problem_workspace.memory_limit") || (language === "vi" ? "Bộ nhớ" : "Memory Limit")}</span>
            <span className="text-[12px] font-bold text-slate-800 dark:text-white">{problem.memoryLimitKb} KB</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-[#162130] border border-orange-100 dark:border-white/5 rounded-lg px-4 py-3 hover:border-[#FF5C00]/50 hover:shadow-md transition-all duration-300 group shadow-sm">
          <div className="text-[#FF5C00] group-hover:scale-110 transition-transform">
            <Target size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#FF5C00]/70 dark:text-[#FF5C00]/80 font-black uppercase tracking-widest">{t("problem_workspace.acceptance") || (language === "vi" ? "Tỉ lệ đúng" : "Acceptance")}</span>
            <span className="text-[12px] font-bold text-slate-800 dark:text-white">
              {problem.acceptancePercent?.toFixed(1) ?? "?"}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-8" />
       <Discussion problemId={id} currentUserId={userData?.userId} />
   
    </div>
  );
}
