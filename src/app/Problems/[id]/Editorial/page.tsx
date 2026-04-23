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

  // Defensive data access: check multiple possible paths
  const editorial = data?.data?.data?.[0] || (data as any)?.data?.[0] || (data?.data as any)?.items?.[0];

  if (!editorial) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 py-10 text-center gap-4 bg-white dark:bg-[#1C2737]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Lock size={28} className="text-amber-400" />
        </div>
        <div>
          <h2 className="font-black text-[16px] text-[#262626] dark:text-[#F9FAFB] mb-1">
            {t('problem_management.official_editorial') || "Official Editorial"}
          </h2>
          <p className="text-[13px] text-gray-400 dark:text-[#475569] max-w-xs leading-relaxed">
            {language === 'vi' 
              ? "Lời giải cho bài toán này hiện chưa có. Vui lòng quay lại sau hoặc thảo luận cùng cộng đồng."
              : "The editorial for this problem is not available yet. Check back later or explore community solutions."}
          </p>
        </div>
        <button 
          onClick={() => window.location.hash = "#solutions"}
          className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-[13px] font-black transition-colors shadow-lg shadow-amber-500/20"
        >
          {language === 'vi' ? "Xem thảo luận cộng đồng" : "View Community Solutions"}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8 max-w-5xl mx-auto dark:text-gray-200">
      <div className="relative group mb-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5C00] to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center justify-between p-8 bg-white dark:bg-[#0D1B2A]/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 animate-pulse" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                <FileText size={28} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic underline decoration-[#FF5C00]/30 underline-offset-8">
                {t('problem_management.official_editorial') || "Official Editorial"}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"> Verified Solution</span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-black">
                  Updated {new Date(editorial.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Internal Resource</span>
            </div>
          </div>
        </div>
      </div>

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
