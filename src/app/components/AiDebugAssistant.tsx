"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Chip,
  Textarea,
  Divider,
} from "@heroui/react";
import {
  Sparkles,
  AlertCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Info,
  Zap,
} from "lucide-react";

interface AiDebugAssistantProps {
  verdict?: string;
  testcase?: {
    input?: string;
    expected?: string;
    actual?: string;
  };
}

export default function AiDebugAssistant({ verdict, testcase }: AiDebugAssistantProps) {
  const [state, setState] = useState<"idle" | "loading" | "result" | "quota" | "no_data" | "error">("idle");
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const handleExplain = () => {
    if (!testcase?.input && verdict !== "Compile Error") {
      setState("no_data");
      return;
    }
    setState("loading");
    // Simulate API call
    setTimeout(() => {
      setState("result");
    }, 2500);
  };

  if (state === "quota") {
    return (
      <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
        <AlertCircle size={16} />
        Bạn đã đạt giới hạn AI hôm nay. Vui lòng quay lại vào ngày mai.
      </div>
    );
  }

  if (state === "no_data") {
    return (
      <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 text-xs font-bold flex items-center gap-2">
        <Info size={16} />
        Không thể phân tích vì không có dữ liệu testcase hiển thị.
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
        <XCircle size={16} />
        AI tạm thời không khả dụng. Vui lòng thử lại sau.
      </div>
    );
  }

  if (state === "idle") {
    return (
      <div className="mt-6 flex justify-center">
        <Button
          className="bg-linear-to-r from-indigo-600 to-fuchsia-500 text-white font-black text-sm px-8 h-12 rounded-2xl shadow-xl shadow-indigo-500/20 active-bump"
          startContent={<Sparkles size={20} />}
          onPress={handleExplain}
        >
          Giải thích lỗi bằng AI
        </Button>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <Card className="mt-6 border-none bg-slate-50 dark:bg-white/5 shadow-none">
        <CardBody className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="text-amber-500 animate-pulse" />
            <span className="font-black text-sm uppercase tracking-widest text-slate-500">Đang phân tích lỗi...</span>
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
        <Chip size="sm" variant="flat" color="warning" className="font-bold text-[10px]">CONFIDENCE: MEDIUM</Chip>
      </CardHeader>
      <CardBody className="p-6 space-y-8">
        {/* Summary */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-black text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            SUMMARY
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-3.5 border-l-2 border-slate-100 dark:border-white/5">
            Mã nguồn của bạn gặp lỗi <strong>{verdict || "Wrong Answer"}</strong>. Dựa trên phân tích, có vẻ như bạn đang xử lý sai trường hợp số âm hoặc giá trị biên của mảng.
          </p>
        </section>

        {/* Possible Causes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-black text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            NGUYÊN NHÂN CÓ THỂ
          </div>
          <ul className="space-y-3 pl-3.5">
            {[
              "Chỉ số mảng (index) vượt quá giới hạn khi truy cập.",
              "Sử dụng kiểu dữ liệu int thay vì long long cho các giá trị lớn.",
              "Logic so sánh không bao gồm trường hợp bằng nhau (=)."
            ].map((cause, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <ChevronRight size={14} className="mt-1 text-indigo-400 shrink-0" />
                {cause}
              </li>
            ))}
          </ul>
        </section>

        {/* Evidence */}
        <section className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border dark:border-white/5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs mb-3">
            <Info size={14} />
            EVIDENCE (DỰA TRÊN TESTCASE)
          </div>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
            "Trong testcase có input là 0, output mong đợi là 'YES' nhưng code của bạn không in ra gì. Điều này cho thấy vòng lặp while của bạn có thể không chạy khi n = 0."
          </p>
        </section>

        {/* Suggestions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-black text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            GỢI Ý DEBUG & EDGE CASES
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-green-500/10 bg-green-500/5 text-[12px] text-green-700 dark:text-green-400">
              <span className="font-black block mb-1">💡 Hướng sửa:</span>
              Thêm kiểm tra `if (n == 0)` ở đầu hàm main.
            </div>
            <div className="p-3 rounded-lg border border-amber-500/10 bg-amber-500/5 text-[12px] text-amber-700 dark:text-amber-400">
              <span className="font-black block mb-1">⚠️ Thử với:</span>
              Mảng rỗng, Mảng 1 phần tử, Giá trị âm.
            </div>
          </div>
        </section>

        <Divider />

        {/* Feedback Section */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">AI có thể sai. Chỉ dùng như gợi ý.</p>

          {!showFeedbackInput ? (
            <div className="flex gap-4">
              <Button
                size="sm"
                variant={feedback === "helpful" ? "solid" : "flat"}
                color={feedback === "helpful" ? "success" : "default"}
                className="font-bold text-xs"
                startContent={<ThumbsUp size={14} />}
                onPress={() => setFeedback("helpful")}
              >
                Hữu ích
              </Button>
              <Button
                size="sm"
                variant={feedback === "not_helpful" ? "solid" : "flat"}
                color={feedback === "not_helpful" ? "danger" : "default"}
                className="font-bold text-xs"
                startContent={<ThumbsDown size={14} />}
                onPress={() => {
                  setFeedback("not_helpful");
                  setShowFeedbackInput(true);
                }}
              >
                Không hữu ích
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-3 animate-fade-in">
              <Textarea
                placeholder="Vui lòng cho biết AI đã phân tích sai ở đâu..."
                size="sm"
                classNames={{ input: "text-xs" }}
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="light" className="text-xs font-bold" onPress={() => setShowFeedbackInput(false)}>Hủy</Button>
                <Button size="sm" color="primary" className="text-xs font-black">Gửi phản hồi</Button>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
