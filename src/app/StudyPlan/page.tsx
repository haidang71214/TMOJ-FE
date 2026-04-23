"use client";

import React, { useMemo } from "react";
import {
  Spinner,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
} from "@heroui/react";
import {
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetStudyPlansQuery } from "@/store/queries/StudyPlan";
import { motion } from "framer-motion";

export default function StudyPlanPublicPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetStudyPlansQuery();

  console.log(apiResponse);

  const studyPlans = useMemo(() => {
    if (!apiResponse?.data) return [];
    return [...apiResponse.data].sort(
      (a: any, b: any) => (a.order || 0) - (b.order || 0)
    );
  }, [apiResponse]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 dark:bg-[#111c35]">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500 font-medium">
          {t("common.loading") ||
            (language === "vi"
              ? "Đang tải lộ trình..."
              : "Loading Study Plans...")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-center p-8 bg-slate-50 dark:bg-[#111c35]">
        <div className="text-red-500 text-2xl font-black italic mb-4">
          {t("common.error") ||
            (language === "vi"
              ? "Có lỗi xảy ra"
              : "An error occurred")}
        </div>
        <p className="text-slate-400 mb-6 font-medium">
          {language === "vi"
            ? "Không thể tải danh sách Lộ trình học tập."
            : "Failed to load Study Plans."}
        </p>
        <Button
          color="primary"
          onPress={refetch}
          className="font-bold"
        >
          {t("common.retry") ||
            (language === "vi" ? "Thử lại" : "Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm mb-6"
          >
            <Target size={18} />
            {language === "vi"
              ? "CHINH PHỤC THỬ THÁCH"
              : "CONQUER CHALLENGES"}
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white mb-6">
            {language === "vi" ? (
              <>
                LỘ TRÌNH{" "}
                <span className="text-[#FF5C00]">HỌC TẬP</span>
              </>
            ) : (
              <>
                STUDY{" "}
                <span className="text-[#FF5C00]">PLANS</span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            {language === "vi"
              ? "Khám phá các lộ trình được thiết kế chuyên biệt để nâng cao kỹ năng lập trình của bạn."
              : "Discover structured pathways to improve your programming skills."}
          </p>
        </div>

        {/* GRID */}
        {studyPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studyPlans.map((plan: any, index: number) => {
              // ✅ chuẩn hóa logic free/paid
              const isFree = !plan.isPaid || plan.price === 0;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  onClick={() =>
                    router.push(
                      `/Problems/StudyPlan/${plan.id}`
                    )
                  }
                  className="cursor-pointer"
                >
                  <Card className="w-full h-full bg-white dark:bg-[#1A2235] border border-slate-200 dark:border-white/5 hover:border-[#FF5C00] hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    
                    {/* TOP LINE */}
                    <div className="h-2 w-full bg-gradient-to-r from-[#FF5C00] to-amber-500" />

                    {/* HEADER */}
                    <CardHeader className="flex flex-col items-start gap-4 p-6 pb-0">
                      <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <BookOpen size={24} />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase">
                            {language === "vi"
                              ? "LỘ TRÌNH"
                              : "PLAN"}{" "}
                            {plan.order}
                          </span>
                        </div>

                        {/* LOCK */}
                        <Chip
                          size="sm"
                          color={
                            plan.isUnlocked
                              ? "success"
                              : "warning"
                          }
                          className="text-[10px] font-bold"
                        >
                          {plan.isUnlocked
                            ? language === "vi"
                              ? "MỞ"
                              : "UNLOCKED"
                            : language === "vi"
                            ? "KHÓA"
                            : "LOCKED"}
                        </Chip>
                      </div>

                      <h3 className="text-xl font-black text-[#071739] dark:text-white line-clamp-2 group-hover:text-[#FF5C00]">
                        {plan.title}
                      </h3>
                    </CardHeader>

                    {/* BODY */}
                    <CardBody className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <CheckCircle2 size={16} />
                        <span className="text-sm font-semibold">
                          {plan.problemCount || 0}{" "}
                          {language === "vi"
                            ? "Bài tập"
                            : "Problems"}
                        </span>
                      </div>
                    </CardBody>

                    {/* FOOTER */}
                    <CardFooter className="px-6 py-4 border-t flex justify-between items-center">
                      
                      {/* LEFT */}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#4B6382]">
                          {language === "vi"
                            ? "Bắt đầu"
                            : "Start"}
                        </span>

                        {/* PRICE */}
                        {isFree ? (
                          <span className="text-xs font-bold text-emerald-500">
                            {language === "vi"
                              ? "Miễn phí"
                              : "Free"}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-500">
                            {plan.price}đ
                          </span>
                        )}
                      </div>

                      {/* RIGHT */}
                      <div className="bg-[#071739] text-white rounded-full w-8 h-8 flex items-center justify-center group-hover:translate-x-1 transition">
                        <ArrowRight size={16} />
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            {language === "vi"
              ? "Chưa có lộ trình"
              : "No study plans"}
          </div>
        )}
      </div>
    </div>
  );
}