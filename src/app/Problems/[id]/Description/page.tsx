"use client";

import React from "react";
import {CheckCircle2, Clock, Cpu, Target, Activity, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Discussion } from "@/app/components/Discussion";
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
  easy:   { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Easy" },
  medium: { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Medium" },
  hard:   { color: "text-rose-700",     bg: "bg-rose-50",    border: "border-rose-200",     label: "Hard" },
};

const DEFAULT_DIFFICULTY = DIFFICULTY_MAP.easy;

const getDifficulty = (difficulty?: string) => 
  DIFFICULTY_MAP[difficulty?.toLowerCase() ?? "easy"] ?? DEFAULT_DIFFICULTY;

export default function DescriptionTab() {
  const { id } = useParams<{ id: string }>();
     const { data: userData, isLoading: isUserLoading } = useGetUserInformationQuery();
    console.log("aaaaaaaaaaa",userData);
  const { data: response, isLoading, isError } = useGetDetailProblemPublicQuery(
    { id }, 
    { skip: !id }
  );

  const problem = response?.data as Problem | undefined;

  if (isLoading) {
    return (
      <div className="h-full px-8 py-8 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-white">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="animate-pulse">Đang tải mô tả bài toán...</p>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="h-full px-8 py-8 flex flex-col items-center justify-center text-rose-500 space-y-4 bg-white">
        <AlertCircle size={48} className="text-rose-500/50" />
        <p>Không tìm thấy bài toán hoặc đã có lỗi xảy ra.</p>
      </div>
    );
  }

  const diff = getDifficulty(problem.difficulty);

  return (
    <div className="h-full overflow-y-auto px-6 md:px-10 py-8 space-y-10 no-scrollbar bg-slate-50 text-slate-700 selection:bg-orange-500/20">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
          {problem.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <span className={`px-3 py-1 rounded-full border ${diff.bg} ${diff.color} ${diff.border} flex items-center gap-1.5 shadow-sm`}>
            <Activity size={14} />
            {diff.label}
          </span>
          
          {problem.statusCode && (
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
              {problem.statusCode}
            </span>
          )}

          <span className={`px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm
            ${problem.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
          >
            <CheckCircle2 size={14} className={problem.isActive ? "text-emerald-600" : "text-slate-400"} />
            {problem.isActive ? "Đang hoạt động" : "Tạm ngưng"}
          </span>
        </div>
      </div>

      {/* Main Description Content - Render thật từ Markdown */}
      <div className="prose prose-slate prose-headings:text-slate-900 prose-headings:font-bold 
                      prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-800 
                      prose-a:text-orange-600 hover:prose-a:text-orange-500 
                      max-w-none text-[15.5px] leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }: any) {
              return !inline ? (
                <div className="my-6 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                  </div>
                  <pre className="p-4 overflow-auto text-sm bg-transparent !m-0">
                    <code className={`${className} text-slate-800 font-mono`} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border border-orange-100" {...props}>
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
      </div>
      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-orange-200 transition-all group">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-all">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Time Limit</div>
            <div className="font-bold text-slate-800">{problem.timeLimitMs} ms</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-200 transition-all group">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-all">
            <Cpu size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Memory Limit</div>
            <div className="font-bold text-slate-800">{problem.memoryLimitKb} KB</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-amber-200 transition-all group">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-all">
            <Target size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Acceptance</div>
            <div className="font-bold text-slate-800">
              {problem.acceptancePercent?.toFixed(1) ?? "?"}%
            </div>
          </div>
        </div>
      </div>

      <div className="h-8" />
       <Discussion problemId={id} currentUserId={userData?.userId} />
   
    </div>
  );
}
