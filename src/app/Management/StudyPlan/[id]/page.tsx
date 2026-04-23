"use client";

import React, { useState, use } from "react";
import {
  Button,
  Input,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
  Chip,
} from "@heroui/react";
import { ChevronLeft, Plus, Edit, FileCode, BookOpen, Trash2, CheckCircle2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetStudyPlanDetailQuery,
  useAddProblemToStudyPlanMutation,
} from "@/store/queries/StudyPlan";
import { useTranslation } from "@/hooks/useTranslation";

export default function StudyPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: studyPlanId } = use(params);
  const { t, language } = useTranslation();

  const { data: detailResponse, isLoading, isError, refetch } = useGetStudyPlanDetailQuery(studyPlanId);
  const [addProblem, { isLoading: isAddingProblem }] = useAddProblemToStudyPlanMutation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [problemIdInput, setProblemIdInput] = useState("");

  const studyPlan = detailResponse?.data;

  const handleAddProblem = async (onClose: () => void) => {
    if (!problemIdInput.trim()) {
      addToast({
        title: language === 'vi' ? "Lỗi" : "Error",
        description: language === 'vi' ? "Vui lòng nhập Problem ID" : "Please enter Problem ID",
        color: "danger",
      });
      return;
    }

    try {
      await addProblem({
        planId: studyPlanId,
        problemId: problemIdInput.trim(),
      }).unwrap();

      addToast({
        title: language === 'vi' ? "Thành công" : "Success",
        description: language === 'vi' ? "Đã thêm bài tập vào Study Plan!" : "Problem added to Study Plan!",
        color: "success",
      });

      setProblemIdInput("");
      onClose();
      refetch();
    } catch (error: any) {
      addToast({
        title: language === 'vi' ? "Lỗi" : "Error",
        description: error?.data?.message || (language === 'vi' ? "Không thể thêm bài tập" : "Failed to add problem"),
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
      <div 
        className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8 animate-fade-in-up"
        style={{ animationFillMode: "both", animationDelay: "100ms" }}
      >
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

          {/* SỬA TẠI ĐÂY: Bỏ flex-wrap để 3 nút luôn nằm trên 1 hàng */}
          <div className="flex items-center gap-3">
            {(!studyPlan?.isPaid || studyPlan?.price === 0) ? (
              <Chip variant="flat" color="success" className="font-black uppercase text-[10px]">
                {language === "vi" ? "MIỄN PHÍ" : "FREE"}
              </Chip>
            ) : (
              <Chip variant="flat" color="danger" className="font-black uppercase text-[10px]">
                {language === "vi" ? `${studyPlan.price}đ` : `$${studyPlan.price}`}
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
      <div 
        className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10 animate-fade-in-up"
        style={{ animationFillMode: "both", animationDelay: "200ms" }}
      >
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

          {/* HIỂN THỊ DANH SÁCH TỪ TRƯỜNG items NHƯ TRONG ẢNH */}
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
                      <span className="font-bold text-lg text-[#071739] dark:text-white">
                        {/* Hiển thị title nếu có, nếu không thì hiện ID rút gọn */}
                        Problem {item.problemId.substring(0, 8)}...
                      </span>
                      <span className="text-xs font-mono text-slate-400 italic">
                        UID: {item.problemId}
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

                    <Button isIconOnly size="sm" variant="light" color="danger" className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* ADD PROBLEM MODAL */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        backdrop="blur" 
        classNames={{
          base: "bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl",
          header: "border-b border-slate-100 dark:border-white/5 px-8 py-6",
          body: "p-8",
          footer: "border-t border-slate-100 dark:border-white/5 px-8 py-6"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center animate-bounce-slow">
                    <Plus className="text-[#FF5C00]" size={20} strokeWidth={3} />
                  </div>
                  <h2 className="text-2xl font-black italic uppercase text-[#071739] dark:text-white">
                    {language === 'vi' ? (
                      <>THÊM <span className="text-[#FF5C00]">BÀI TẬP</span></>
                    ) : (
                      <>ADD <span className="text-[#FF5C00]">PROBLEM</span></>
                    )}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium normal-case">
                  {t('studyPlan.addProblemDesc') || (language === 'vi' ? "Nhập chính xác ID của Problem để thêm vào hệ thống Study Plan của bạn." : "Enter the exact Problem ID to add it to your Study Plan.")}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                  <Input
                    label="Problem ID"
                    placeholder="e.g., 93c52f01..."
                    value={problemIdInput}
                    onValueChange={setProblemIdInput}
                    isRequired
                    labelPlacement="outside"
                    startContent={<FileCode size={18} className="text-slate-400 mr-2" />}
                    classNames={{
                      label: "text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest",
                      inputWrapper: "h-14 bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-white/10 hover:border-orange-500/50 focus-within:!border-[#FF5C00] shadow-none transition-all rounded-2xl px-4",
                      input: "text-base font-medium text-[#071739] dark:text-white"
                    }}
                  />
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex gap-3 border border-blue-100 dark:border-blue-800/30">
                    <BookOpen className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                      {language === 'vi' 
                        ? "Lưu ý: Problem sẽ được thêm vào Study Plan hiện tại. Kiểm tra kỹ ID để tránh lỗi." 
                        : "Note: The problem will be added to the current plan. Double check the ID to avoid errors."}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} className="font-bold rounded-xl px-6">
                  {t('common.cancel') || (language === 'vi' ? "Hủy" : "Cancel")}
                </Button>
                <Button
                  className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black rounded-xl px-8 h-12 shadow-lg uppercase tracking-widest text-xs transition-all hover:scale-105"
                  onPress={() => handleAddProblem(onClose)}
                  isLoading={isAddingProblem}
                  startContent={!isAddingProblem && <Plus size={18} strokeWidth={3} />}
                >
                  {t('common.addNow') || (language === 'vi' ? "Thêm Ngay" : "Add Now")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}