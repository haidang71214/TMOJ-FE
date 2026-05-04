"use client";

import { Button, Card, CardBody, Chip, Progress, Spinner } from "@heroui/react";
import { Bookmark, CheckCircle2, ChevronLeft, ChevronRight, Lock, Trophy } from "lucide-react";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import {
  useGetStudyPlanDetailQuery,
  useGetStudyPlanEnrollmentQuery,
  useGetStudyPlanStatsQuery,
  useEnrollStudyPlanMutation,
  useGetStudyPlanProgressQuery,
  useBuyStudyPlanMutation,
  useResetStudyProgressMutation
} from "@/store/queries/StudyPlan";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSelector } from "@/utils/redux";
import { useModal } from "@/Provider/ModalProvider";
import LoginModal from "@/app/Modal/LoginModal";
import { ErrorForm } from "@/types";

export default function PackageEnrollPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { t } = useTranslation();
  const { openModal } = useModal();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticatedAccount);

  const { data: detailResponse, isLoading: isDetailLoading, isError } = useGetStudyPlanDetailQuery(id, { skip: !id });
  const { data: enrollmentData, refetch: refetchEnrollment } = useGetStudyPlanEnrollmentQuery({ planId: id }, { skip: !id });

  const plan = detailResponse;
  const isEnrolled = enrollmentData?.data?.isEnrolled || plan?.data?.isEnrolled || false;
  const isPurchased = enrollmentData?.data?.isPurchased || plan?.data?.isPurchased || false;
  const price = plan?.data?.price || 0;

  const { data: statsData } = useGetStudyPlanStatsQuery(id, { skip: !id });
  const { data: progressData } = useGetStudyPlanProgressQuery(id, { skip: !isEnrolled });

  const [enrollPlan, { isLoading: isEnrolling }] = useEnrollStudyPlanMutation();
  const [buyPlan, { isLoading: isBuying }] = useBuyStudyPlanMutation();
  const [resetProgress, { isLoading: isResetting }] = useResetStudyProgressMutation();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      openModal({ title: t("common.login") || "Đăng nhập", content: <LoginModal /> });
      return;
    }
    if (!id) {
      addToast({ title: "Invalid Study Plan ID", color: "danger" });
      return;
    }
    try {
      await enrollPlan(id).unwrap();
      refetchEnrollment();
      addToast({ title: t("studyplan_detail.enroll_success") || "Enrolled successfully!", color: "success" });
    } catch (error) {
      const apiError = error as ErrorForm;
      const msg = apiError?.data?.data?.message || apiError?.data?.message || t("studyplan_detail.enroll_fail") || "Failed to enroll. Please try again.";
      addToast({ title: msg, color: "danger" });
    }
  };

  const handleBuy = async () => {
    if (!isAuthenticated) {
      openModal({ title: t("common.login") || "Đăng nhập", content: <LoginModal /> });
      return;
    }
    if (!id) {
      addToast({ title: "Invalid Study Plan ID", color: "danger" });
      return;
    }
    try {
      await buyPlan(id).unwrap();
      if (price) {
        window.dispatchEvent(new CustomEvent("coin-deducted", { detail: { amount: price } }));
      }
      refetchEnrollment();
      addToast({ title: t("studyplan_detail.buy_success") || "Plan purchased successfully!", color: "success" });
    } catch (error) {
      const apiError = error as ErrorForm;
      const msg = apiError?.data?.data?.message || apiError?.data?.message || t("studyplan_detail.buy_fail") || "Failed to purchase. Please check your balance.";
      addToast({ title: msg, color: "danger" });
    }
  };

  const handleResetProgress = async () => {
    if (!confirm(t("studyplan_detail.reset_confirm") || "Are you sure you want to reset all progress for this plan?")) return;
    try {
      await resetProgress(id).unwrap();
      refetchEnrollment();
      addToast({ title: t("studyplan_detail.reset_success") || "Progress reset successfully!", color: "success" });
    } catch (error) {
      const apiError = error as ErrorForm;
      const msg = apiError?.data?.data?.message || apiError?.data?.message || t("studyplan_detail.reset_fail") || "Reset failed, please try again.";
      addToast({ title: msg, color: "danger" });
    }
  };

  const overallProgress = Number(((progressData?.progressPercent ?? enrollmentData?.data?.progressPercent) || 0).toFixed(2));

  const items = useMemo(() => {
    if (!plan?.data) return [];
    const rawItems = [...(plan.data.items || [])];
    const itemsFromProgress = progressData?.items || [];
    return rawItems.map((item: any) => {
      const prog = itemsFromProgress.find((p: any) => p.studyPlanItemId === item.studyPlanItemId);
      return {
        ...item,
        isCompleted: prog ? prog.isCompleted : item.isCompleted,
        isUnlocked: prog ? prog.isUnlocked : item.isUnlocked,
      };
    }).sort((a: any, b: any) => a.order - b.order);
  }, [plan, progressData]);

  if (isDetailLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F2F5] dark:bg-[#0A0F1C]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#F0F2F5] dark:bg-[#0A0F1C]">
        <h2 className="text-2xl font-bold mb-4 text-[#071739] dark:text-white">{t("studyplan_detail.failed_load") || "Failed to load study plan"}</h2>
        <Button color="primary" onPress={() => router.push('/StudyPlan')}>{t("studyplan_detail.back") || "Back to Study Plans"}</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans pb-24">
      {/* HEADER BANNER WITH DYNAMIC BACKGROUND */}
      <div className="relative text-white pt-16 pb-12 px-8 overflow-hidden min-h-[400px] flex items-center">
        {/* BACKGROUND LAYER */}
        {plan.data.imageUrl ? (
          <div className="absolute inset-0 z-0">
            <img src={plan.data.imageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071739] via-[#071739]/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#071739] dark:bg-[#1a2035] z-0" />
        )}

        <div className="relative z-20 max-w-[1000px] mx-auto w-full space-y-6">
          <Button
            variant="light"
            className="text-slate-400 hover:text-white -ml-4"
            startContent={<ChevronLeft size={16} />}
            onPress={() => router.push('/StudyPlan')}
          >
            {t("studyplan_detail.back") || "Back to Study Plans"}
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <Chip size="sm" className="bg-[#FF5C00] text-white font-bold">{plan.data.isPaid ? t("studyplan_detail.premium_path") || "PREMIUM PATH" : t("studyplan_detail.free_path") || "FREE PATH"}</Chip>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Trophy size={14} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-wider">{t("studyplan_detail.expert_curriculum") || "Expert Curriculum"}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">{plan.data.title}</h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {plan.data.description || t("studyplan_detail.description_fallback") || "Comprehensive problem solving pathway to enhance your skills."}
              </p>
              <div className="flex items-center gap-6">
                {statsData?.data && (statsData.data.totalUsers ?? 0) > 0 && (
                  <p className="text-slate-400 text-sm">{t("studyplan_detail.joined_by", { count: String(statsData.data.totalUsers ?? 0) }) || `Joined by ${statsData.data.totalUsers ?? 0} learners`}</p>
                )}
                {plan.data.isPaid && !isPurchased && (
                  <p className="text-[#FF5C00] font-black text-xl">{plan.data.price} COINS</p>
                )}
              </div>
            </div>


            <div className="flex flex-col gap-3 min-w-[200px]">
              {!isEnrolled && (
                isPurchased || !plan.data.isPaid ? (
                  <Button
                    size="lg"
                    isLoading={isEnrolling}
                    className="bg-[#FF5C00] text-white font-black uppercase text-lg shadow-xl shadow-[#FF5C00]/20 h-16 transition-transform active:scale-95"
                    onPress={handleEnroll}
                  >
                    {t("studyplan_detail.start_learning") || "Start Learning"}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    isLoading={isBuying}
                    className="bg-[#FF5C00] text-white font-black uppercase text-lg shadow-xl shadow-[#FF5C00]/20 h-16 transition-transform active:scale-95"
                    onPress={handleBuy}
                  >
                    {t("studyplan_detail.buy_plan", { price: String(plan.data.price) }) || `Buy Plan - ${plan.data.price} Coins`}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-[1000px] mx-auto px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT COLUMN: MODULES */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Bookmark className="text-[#FF5C00]" /> {t("studyplan_detail.curriculum") || "Curriculum"}
          </h2>

          <div className="space-y-4">
            {items.map((item: any, idx: number) => (
              <Card
                key={item.studyPlanItemId}
                className={`border-none shadow-sm ${!item.isUnlocked ? "bg-slate-50 dark:bg-black/20 opacity-70" : "bg-white dark:bg-[#1C2737]"}`}
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black flex-shrink-0
                        ${item.isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : !item.isUnlocked ? "bg-slate-200 text-slate-400" : "bg-indigo-100 text-indigo-600"}`}
                      >
                        {item.isCompleted ? <CheckCircle2 size={20} strokeWidth={3} /> : !item.isUnlocked ? <Lock size={18} /> : idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                          {item.problemTitle || `Challenge #${idx + 1}`}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1 max-w-xl line-clamp-1">
                          {(item as any).problemDescription || t("studyplan_detail.challenge_desc_fallback") || "Master the core concepts of this challenge to progress further."}
                        </p>
                      </div>
                    </div>

                    {item.isUnlocked && isEnrolled && (
                      <Button
                        size="md"
                        className="bg-[#FF5C00] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-[#FF5C00]/20 hover:scale-105 transition-all"
                        endContent={<ChevronRight size={16} strokeWidth={3} />}
                        onPress={() => {
                          if (isEnrolled) {
                            router.push(`/Problems/${item.problemId}?planId=${id}&itemId=${item.studyPlanItemId}`);
                          } else {
                            alert("Please enroll first to access the challenge!");
                          }
                        }}
                      >
                        {t("studyplan_detail.solve") || "Solve"}
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: STATS/ACTION */}
        <div className="space-y-8">
          {isEnrolled && (
            <Card className="bg-[#071739] text-white border-none shadow-2xl overflow-hidden">
              <CardBody className="p-8">
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#FF5C00]/20 flex items-center justify-center text-[#FF5C00]">
                    <Trophy size={40} />
                  </div>
                  <h3 className="text-xl font-black uppercase">{t("studyplan_detail.your_progress") || "Your Progress"}</h3>
                </div>

                <div className="space-y-2 mb-8">
                  <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-5xl font-black">{overallProgress}%</span>
                    <span className="text-sm font-bold opacity-70">{t("studyplan_detail.completed") || "COMPLETED"}</span>
                  </div>
                  <Progress
                    value={overallProgress}
                    className="h-3 bg-white/10"
                    classNames={{ indicator: "bg-[#FF5C00]" }}
                  />
                  <p className="text-xs font-medium opacity-70 mt-4 leading-relaxed">
                    {t("studyplan_detail.keep_going") || "Keep going! Complete the next challenge to increase your progress."}
                  </p>
                </div>

                {overallProgress >= 100 ? (
                  <Button
                    fullWidth
                    isLoading={isResetting}
                    className="bg-rose-500 text-white font-black h-12 uppercase tracking-wider hover:bg-rose-600 transition-colors"
                    onPress={handleResetProgress}
                  >
                    {t("studyplan_detail.reset_progress") || "Reset Progress"}
                  </Button>
                ) : (
                  <p className="text-center text-xs text-white/40 font-medium uppercase tracking-widest">
                    {t("studyplan_detail.complete_all_to_reset") || "You can reset progress after completing all challenges"}
                  </p>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
