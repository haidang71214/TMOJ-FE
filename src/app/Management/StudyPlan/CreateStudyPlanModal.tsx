"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  addToast,
} from "@heroui/react";
import { Plus, Type, AlignLeft, DollarSign } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCreateStudyPlanMutation } from "@/store/queries/StudyPlan";
import { ErrorForm } from "@/types";

interface CreateStudyPlanModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateStudyPlanModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateStudyPlanModalProps) {
  const { t, language } = useTranslation();
  const [createStudyPlan, { isLoading }] = useCreateStudyPlanMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);

  const handleCreate = async () => {
    if (!title.trim()) {
      addToast({
        title: t('common.error') || (language === 'vi' ? "Lỗi" : "Error"),
        description: t('studyPlan.enterTitle') || (language === 'vi' ? "Vui lòng nhập tiêu đề" : "Please enter a title"),
        color: "danger",
      });
      return;
    }

    try {
      await createStudyPlan({
        title,
        description,
        isPublic,
        isPaid,
        price: isPaid ? Number(price) : 0,
      }).unwrap();

      addToast({
        title: t('common.success') || (language === 'vi' ? "Thành công" : "Success"),
        description: t('studyPlan.createSuccess') || (language === 'vi' ? "Tạo Study Plan thành công" : "Study Plan created successfully"),
        color: "success",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setIsPublic(true);
      setIsPaid(false);
      setPrice(0);

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      const err = error as ErrorForm;
      addToast({
        title: t('common.error') || (language === 'vi' ? "Lỗi" : "Error"),
        description: err?.data?.data?.message || (t('studyPlan.createFail') || (language === 'vi' ? "Không thể tạo Study Plan" : "Failed to create Study Plan")),
        color: "danger",
      });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      size="2xl"
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
                    <>TẠO <span className="text-[#FF5C00]">LỘ TRÌNH MỚI</span></>
                  ) : (
                    <>CREATE <span className="text-[#FF5C00]">STUDY PLAN</span></>
                  )}
                </h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium normal-case">
                {t('studyPlan.createDesc') || (language === 'vi' ? "Tạo lộ trình học mới để nhóm các bài tập cho học sinh/sinh viên." : "Create a new study plan to group problems together.")}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                <Input
                  label={t('studyPlan.title') || (language === 'vi' ? "Tiêu đề" : "Title")}
                  placeholder={language === 'vi' ? "Nhập tiêu đề lộ trình..." : "Enter study plan title"}
                  value={title}
                  onValueChange={setTitle}
                  isRequired
                  labelPlacement="outside"
                  startContent={<Type size={18} className="text-slate-400 mr-2" />}
                  classNames={{
                    label: "text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest",
                    inputWrapper: "h-14 bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-white/10 hover:border-orange-500/50 dark:hover:border-orange-500/50 focus-within:!border-[#FF5C00] focus-within:ring-2 focus-within:ring-orange-500/20 shadow-none transition-all rounded-2xl px-4",
                    input: "text-base font-medium text-[#071739] dark:text-white placeholder:text-slate-400"
                  }}
                />
                <Textarea
                  label={t('studyPlan.description') || (language === 'vi' ? "Mô tả" : "Description")}
                  placeholder={language === 'vi' ? "Nhập mô tả lộ trình..." : "Enter study plan description"}
                  value={description}
                  onValueChange={setDescription}
                  labelPlacement="outside"
                  startContent={<AlignLeft size={18} className="text-slate-400 mr-2 mt-1" />}
                  classNames={{
                    label: "text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest",
                    inputWrapper: "bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-white/10 hover:border-orange-500/50 dark:hover:border-orange-500/50 focus-within:!border-[#FF5C00] focus-within:ring-2 focus-within:ring-orange-500/20 shadow-none transition-all rounded-2xl px-4 py-3",
                    input: "text-base font-medium text-[#071739] dark:text-white placeholder:text-slate-400"
                  }}
                />
                <div className="flex gap-8 mt-2 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <Switch isSelected={isPublic} onValueChange={setIsPublic} size="sm" color="success">
                    <span className="font-bold text-sm text-[#071739] dark:text-white">Public</span>
                  </Switch>
                  <Switch isSelected={isPaid} onValueChange={setIsPaid} size="sm" color="warning">
                    <span className="font-bold text-sm text-[#071739] dark:text-white">Paid</span>
                  </Switch>
                </div>
                {isPaid && (
                  <Input
                    type="number"
                    label={t('studyPlan.price') || (language === 'vi' ? "Giá tiền" : "Coin")}
                    placeholder={language === 'vi' ? "Nhập số tiền..." : "Enter price"}
                    value={price.toString()}
                    onValueChange={(val) => setPrice(Number(val))}
                    isRequired
                    labelPlacement="outside"
                    startContent={<DollarSign size={18} className="text-amber-500 mr-2" />}
                    classNames={{
                      label: "text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest",
                      inputWrapper: "h-14 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 hover:border-amber-400 dark:hover:border-amber-500 focus-within:!border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 shadow-none transition-all rounded-2xl px-4",
                      input: "text-base font-medium text-[#071739] dark:text-white placeholder:text-amber-700/50 dark:placeholder:text-amber-500/50 text-amber-700 dark:text-amber-500"
                    }}
                  />
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-3 mt-4">
              <Button 
                color="danger" 
                variant="light" 
                onPress={onClose}
                className="font-bold rounded-xl px-6 h-12"
              >
                {t('common.cancel') || (language === 'vi' ? "Hủy" : "Cancel")}
              </Button>
              <Button
                className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black rounded-xl px-8 h-12 shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
                onPress={handleCreate}
                isLoading={isLoading}
                startContent={!isLoading && <Plus size={18} strokeWidth={3} />}
              >
                {t('common.create') || (language === 'vi' ? "Tạo Ngay" : "Create")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
