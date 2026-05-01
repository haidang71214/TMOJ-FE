"use client";

import React, { useState, use } from "react";
import {
  Button,
  Input,
  Spinner,
  useDisclosure,
  addToast,
  Chip,
} from "@heroui/react";
import { ChevronLeft, Plus, Edit, FileCode, Trash2, CheckCircle2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetStudyPlanDetailQuery,
  useAddProblemToStudyPlanMutation,
  useRemoveProblemFromPlanMutation
} from "@/store/queries/StudyPlan";
import { useTranslation } from "@/hooks/useTranslation";
import { ErrorForm } from "@/types";
import { AddProblemModal } from "@/app/components/AddProblemModal";

export default function StudyPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: studyPlanId } = use(params);
  const { t, language } = useTranslation();

  const { data: detailResponse, isLoading, isError, refetch } = useGetStudyPlanDetailQuery(studyPlanId);
  const [addProblem] = useAddProblemToStudyPlanMutation();
  const [removeProblem] = useRemoveProblemFromPlanMutation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const studyPlan = detailResponse?.data;

  const handleRemoveProblem = async (problemId: string) => {
    if (confirm(language === 'vi' ? "Bạn có chắc muốn xóa bài tập này khỏi lộ trình?" : "Are you sure you want to remove this problem?")) {
      try {
        await removeProblem({ planId: studyPlanId, problemId }).unwrap();
        addToast({
          title: language === 'vi' ? "Thành công" : "Success",
          description: language === 'vi' ? "Đã xóa bài tập!" : "Problem removed!",
          color: "success",
        });
        refetch();
      } catch (error) {
        addToast({
          title: language === 'vi' ? "Lỗi" : "Error",
          description: language === 'vi' ? "Không thể xóa bài tập" : "Failed to remove problem",
          color: "danger",
        });
      }
    }
  };

  const handleAddFromBank = async (selectedWithConfigs: any[]) => {
    try {
      await Promise.all(
        selectedWithConfigs.map((item) =>
          addProblem({
            planId: studyPlanId,
            problemId: item.problemId,
          }).unwrap()
        )
      );
      addToast({
        title: language === 'vi' ? "Thành công" : "Success",
        description: language === 'vi' ? `Đã thêm ${selectedWithConfigs.length} bài tập!` : `Added ${selectedWithConfigs.length} problems!`,
        color: "success",
      });
      refetch();
    } catch (error) {
      const err = error as ErrorForm;
      addToast({
        title: language === 'vi' ? "Lỗi" : "Error",
        description: err?.data?.data?.message || (language === 'vi' ? "Không thể thêm bài tập" : "Failed to add problems"),
        color: "danger",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[500px] items-center justify-center animate-fade-in-up">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500 font-medium">
          {t('common.loading') || (language === 'vi' ? "Đang tải thông tin Study Plan..." : "Loading Study Plan info...")}
        </p>
      </div>
    );
  }

  if (isError || !studyPlan) {
    return (
      <div className="flex flex-col h-[500px] items-center justify-center text-center p-8 animate-fade-in-up">
        <div className="text-red-500 text-2xl font-black italic mb-4">
          {t('common.error') || (language === 'vi' ? "Có lỗi xảy ra" : "An error occurred")}
        </div>
        <p className="text-slate-400 mb-6 font-medium">
          {t('studyPlan.notFound') || (language === 'vi' ? "Không thể tải thông tin Study Plan" : "Could not load Study Plan info")}
        </p>
        <Button color="primary" onPress={() => router.back()} className="font-bold">
          {t('common.back') || (language === 'vi' ? "Quay lại" : "Back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8 animate-fade-in-up">
        <Button
          variant="light"
          onPress={() => router.push("/Management/StudyPlan")}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 transition-colors h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          {t('studyPlan.backToList') || (language === 'vi' ? "Quay lại danh sách" : "Back to Study Plans")}
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
              {studyPlan?.title || "STUDY PLAN DETAIL"}
            </h1>
            <p className="text-sm font-bold text-slate-500 mt-2">
              ID: {studyPlan?.id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!studyPlan?.isPaid ? (
              <Chip variant="flat" color="success" className="font-black uppercase text-[10px]">
                {language === "vi" ? "MIỄN PHÍ" : "FREE"}
              </Chip>
            ) : (
              <Chip variant="flat" color="danger" className="font-black uppercase text-[10px]">
                {studyPlan.price} COINS
              </Chip>
            )}

            <Button
              startContent={<Edit size={16} />}
              onPress={() => router.push(`/Management/StudyPlan/${studyPlanId}/edit`)}
              className="bg-slate-100 dark:bg-[#111c35] text-[#071739] dark:text-white font-black px-6 rounded-xl shadow-sm uppercase text-[10px] tracking-wider"
            >
              {t('studyPlan.editPlan') || (language === 'vi' ? "SỬA PLAN" : "EDIT PLAN")}
            </Button>

            <Button
              startContent={<Plus size={20} strokeWidth={3} />}
              onPress={onOpen}
              className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump hover:scale-105"
            >
              {t('studyPlan.addProblem') || (language === 'vi' ? "THÊM PROBLEM" : "ADD PROBLEM")}
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-2">
              {t('studyPlan.order') || (language === 'vi' ? "Thứ Tự" : "Order")}
            </h3>
            <p className="text-2xl font-bold text-[#071739] dark:text-white">
              #{studyPlan?.order || 0}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-2">
              {t('studyPlan.problemCount') || (language === 'vi' ? "Số lượng bài tập" : "Problem Count")}
            </h3>
            <p className="text-2xl font-bold text-[#071739] dark:text-white">
              {studyPlan?.items?.length || 0}
            </p>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-2">
              {language === 'vi' ? "Mô tả" : "Description"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {studyPlan?.description || "---"}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-white/5">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#071739] dark:text-white mb-6 flex items-center gap-2">
            <FileCode className="text-[#FF5C00]" size={24} />
            {t('studyPlan.problemsList') || (language === 'vi' ? "Danh sách bài tập" : "Problems List")}
          </h3>

          {studyPlan?.items && studyPlan.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {studyPlan.items.map((item: any, index: number) => (
                <div
                  key={item.studyPlanItemId || index}
                  className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-[#FF5C00]/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all animate-fade-in-right"
                  style={{ animationFillMode: "both", animationDelay: `${350 + index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-slate-400 group-hover:text-[#FF5C00] transition-colors">
                      {item.order}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg text-[#071739] dark:text-white group-hover:text-[#FF5C00] transition-colors">
                        {item.problemTitle || `Problem ${item.problemId.substring(0, 8)}...`}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        ID: {item.problemId.substring(0, 8)}
                        {item.problemSlug && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            SLUG: {item.problemSlug}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                    {item.isCompleted ? (
                      <Chip startContent={<CheckCircle2 size={12} />} color="success" variant="flat" size="sm" className="font-bold">
                        DONE
                      </Chip>
                    ) : (
                      <Chip color="default" variant="flat" size="sm" className="font-bold text-slate-400">
                        PENDING
                      </Chip>
                    )}

                    {!item.isUnlocked ? (
                      <Chip startContent={<Lock size={12} />} color="warning" variant="flat" size="sm" className="font-bold">
                        LOCKED
                      </Chip>
                    ) : (
                      <Chip color="success" variant="dot" size="sm" className="font-bold">
                        UNLOCKED
                      </Chip>
                    )}

                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProblem(item.problemId);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl bg-slate-50 dark:bg-white/5">
              <p className="text-slate-500 font-medium mb-4">
                {t('studyPlan.noProblems') || (language === 'vi' ? "Chưa có Problem nào trong Study Plan này." : "No problems in this Study Plan yet.")}
              </p>
              <Button
                color="primary"
                variant="flat"
                startContent={<Plus size={16} />}
                onPress={onOpen}
                className="font-bold bg-blue-500/10 text-blue-600 dark:bg-[#FF5C00]/10 dark:text-[#FF5C00]"
              >
                {t('studyPlan.addProblemNow') || (language === 'vi' ? "Thêm Problem ngay" : "Add Problem Now")}
              </Button>
            </div>
          )}
        </div>
      </div>

      <AddProblemModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleAddFromBank}
        isStudyPlan={true}
      />
    </div>
  );
}