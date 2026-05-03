"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Chip,
  Divider,
} from "@heroui/react";
import {
  Sparkles,
  AlertCircle,
  XCircle,
  ChevronRight,
  Info,
  Zap,
} from "lucide-react";
import { useGenerateAiDebugMutation } from "@/store/queries/ai";
import { AiDebugResponse } from "@/types/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useTranslation } from "@/hooks/useTranslation";
import { useAdjustCoinMutation } from "@/store/queries/wallet";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { toast } from "sonner";

interface AiDebugAssistantProps {
  submissionId?: string;
  verdict?: string;
  testcase?: {
    input?: string;
    expected?: string;
    actual?: string;
  };
}

export default function AiDebugAssistant({ submissionId, verdict, testcase }: AiDebugAssistantProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<"idle" | "loading" | "result" | "quota" | "no_data" | "error">("idle");
  const [debugData, setDebugData] = useState<AiDebugResponse["data"]["data"] | null>(null);

  const [generateDebug] = useGenerateAiDebugMutation();
  const { data: user } = useGetUserInformationQuery();
  const [adjustCoin] = useAdjustCoinMutation();

  const handleExplain = async () => {
    if (!submissionId) {
      setState("error");
      return;
    }

    setState("loading");
    try {
      // Trừ 750 coin trước khi gọi AI
      if (user?.userId) {
        try {
          await adjustCoin({
            userId: user.userId,
            amount: -700,
            note: "AI Debug Assistant fee"
          }).unwrap();

          // Kích hoạt hiệu ứng bay coin ở Navbar
          window.dispatchEvent(new CustomEvent('coin-deducted', { detail: { amount: 700 } }));
        } catch (coinError: any) {
          toast.error(
            coinError?.data?.message ||
            (t("problem_management.ai_debug_insufficient_coins") || "Bạn không đủ coin để sử dụng tính năng này (700 coin).")
          );
          setState("idle");
          return;
        }
      }

      const response = await generateDebug({
        submissionId,
        languageCode: "en" // Gợi ý từ BE dùng en để tiết kiệm token
      }).unwrap();

      if (response.data.succeeded) {
        setDebugData(response.data.data);
        setState("result");
      } else {
        setState("error");
      }
    } catch (error: any) {
      if (error?.status === 429) {
        setState("quota");
      } else {
        setState("error");
      }
    }
  };

  if (state === "quota") {
    return (
      <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
        <AlertCircle size={16} />
        {t("problem_management.ai_debug_quota") || "Bạn đã đạt giới hạn AI hôm nay. Vui lòng quay lại vào ngày mai."}
      </div>
    );
  }

  if (state === "no_data") {
    return (
      <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 text-xs font-bold flex items-center gap-2">
        <Info size={16} />
        {t("problem_management.ai_debug_no_data") || "Không thể phân tích vì không có dữ liệu testcase hiển thị."}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
        <XCircle size={16} />
        {t("problem_management.ai_debug_error") || "AI tạm thời không khả dụng. Vui lòng thử lại sau."}
      </div>
    );
  }

  if (state === "idle") {
    return (
      <div className="mt-6 flex flex-col items-center gap-3">
        <Button
          className="bg-linear-to-r from-indigo-600 to-fuchsia-500 text-white font-black text-sm px-10 h-14 rounded-2xl shadow-xl shadow-indigo-500/20 active-bump group"
          startContent={<Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
          onPress={handleExplain}
        >
          {t("problem_management.ai_debug_button") || "Giải thích lỗi bằng AI"}
        </Button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            {t("problem_management.ai_debug_cost") || "Chi phí"}: 700 COINS / {t("problem_management.ai_debug_usage") || "lần sử dụng"}
          </p>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <Card className="mt-6 border-none bg-slate-50 dark:bg-white/5 shadow-none">
        <CardBody className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="text-amber-500 animate-pulse" />
            <span className="font-black text-sm uppercase tracking-widest text-slate-500">
              {t("problem_management.ai_debug_analyzing") || "Đang phân tích lỗi..."}
            </span>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
          <Divider />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border-2 border-indigo-500/20 bg-white dark:bg-[#111c35] shadow-2xl animate-fade-in-up">
      <CardHeader className="flex justify-between items-center px-6 py-4 border-b dark:border-white/5">
        <div className="flex items-center gap-2 text-indigo-500">
          <Sparkles size={20} />
          <h3 className="font-black text-sm uppercase tracking-widest">AI Debug Assistant</h3>
        </div>
        <Chip size="sm" variant="flat" color="warning" className="font-bold text-[10px]">
          CONFIDENCE: {debugData?.confidence || 0}%
        </Chip>
      </CardHeader>
      <CardBody className="p-6 space-y-8">
        {/* Summary */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-black text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            SUMMARY
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-3.5 border-l-2 border-slate-100 dark:border-white/5 prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {debugData?.summary || ""}
            </ReactMarkdown>
          </div>
        </section>

        {/* Dynamic Sections from API */}
        {debugData?.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-black text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {section.title.toUpperCase()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 pl-3.5 prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {section.contentMd}
              </ReactMarkdown>
            </div>
          </section>
        ))}

        <Divider />

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border dark:border-white/5">
          <p className="text-[11px] text-slate-400 italic">
            {debugData?.safetyNote}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">AI may be incorrect. Use as guidance only.</p>
        </div>
      </CardBody>
    </Card>
  );
}
