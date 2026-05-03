"use client";
import React from "react";
import { Lock, FileText, AlertCircle } from "lucide-react";
import { useGetEditorialsQuery } from "@/store/queries/ProblemEditorial";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";
import { useParams } from "next/navigation";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

import { useTranslation } from "@/hooks/useTranslation";

export default function EditorialTab() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();

  // First get problem detail to ensure we have the correct UUID if id is a slug
  const { data: problemResponse, isLoading: isProblemLoading } = useGetDetailProblemPublicQuery({ id: id || "" }, { skip: !id });

  // Wait until problem data is loaded if we started with a slug-like string
  const isSlug = !!(id && id.length < 36); // Simple check for UUID vs slug
  const realProblemId = problemResponse?.id || id || "";

  const { data, isLoading, error } = useGetEditorialsQuery(
    { problemId: realProblemId },
    { skip: !realProblemId || (isSlug && isProblemLoading) }
  );

  // Debugging logs (visible in browser console for the user/us)
  console.log("EditorialTab info:", { id, realProblemId, isProblemLoading, data });

  if (isLoading || isProblemLoading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 py-10 text-center gap-4 text-rose-500 bg-white dark:bg-[#1C2737]">
        <AlertCircle size={48} className="opacity-50" />
        <p className="font-black tracking-widest uppercase text-xs">
          {t('problem_management.error_loading') || (language === 'vi' ? "Lỗi tải lời giải" : "Error loading editorial")}
        </p>
      </div>
    );
  }

  // Data is already transformed into an array by the query hook
  const editorial = data?.[0];

  if (!editorial) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 py-10 text-center gap-3 bg-white dark:bg-[#1C2737]">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
          <FileText size={24} className="text-slate-400 dark:text-slate-500" />
        </div>
        <p className="font-black text-[14px] text-slate-500 dark:text-slate-400">
          {language === 'vi' ? "Chưa có lời giải từ giáo viên" : "No solution provided by instructor"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col p-8 max-w-5xl mx-auto dark:text-gray-200">

      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5C00] via-amber-500 to-transparent rounded-full opacity-50" />
        <div className="pl-6 prose prose-lg dark:prose-invert max-w-none">
          <MarkdownRenderer content={editorial.content} />
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} TMOJ Editorial System</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span>Academic Purpose Only</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] hover:translate-x-1 transition-transform">Report Issue</button>
          <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:translate-x-1 transition-transform">Cite Editorial</button>
        </div>
      </div>
    </div>
  );
}
