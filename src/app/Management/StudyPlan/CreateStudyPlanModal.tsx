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
  Spinner,
} from "@heroui/react";
import { Plus, Type, AlignLeft, Globe, Lock, DollarSign, Library } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCreateStudyPlanMutation, useUploadStudyPlanImageMutation } from "@/store/queries/StudyPlan";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
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
  const [uploadImage, { isLoading: isUploading }] = useUploadStudyPlanImageMutation();
  const { data: user } = useGetUserInformationQuery();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadImage(formData).unwrap();
      if (result.data?.imageUrl) {
        setImageUrl(result.data.imageUrl);
        addToast({
          title: language === 'vi' ? "Tải ảnh lên thành công" : "Image uploaded successfully",
          color: "success",
        });
      }
    } catch (error) {
      addToast({
        title: language === 'vi' ? "Lỗi tải ảnh" : "Upload failed",
        description: language === 'vi' ? "Không thể tải ảnh lên máy chủ" : "Could not upload image to server",
        color: "danger",
      });
    }
  };

  const handleCreate = async () => {
    if (!user?.userId) {
      alert("Please login first.");
      return;
    }

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
        creatorId: user.userId,
        isPaid,
        price: isPaid ? price : 0,
        imageUrl: imageUrl.trim() || null,
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
      size="xl"
      backdrop="blur"
      classNames={{
        wrapper: "z-[9999]",
        backdrop: "z-[9998] bg-black/50 backdrop-blur-md",
        base: "bg-white dark:bg-[#0A0F1C] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl",
        header: "border-b border-slate-100 dark:border-white/5 px-8 py-5",
        body: "p-6 px-8",
        footer: "border-t border-slate-100 dark:border-white/5 px-8 py-5"
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
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest mb-1">
                    {language === 'vi' ? "Hình ảnh lộ trình" : "Study Plan Image"}
                  </p>
                  <div className="flex gap-4 items-start">
                    <div className="relative group w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#111c35] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center transition-all hover:border-orange-500/50">
                      {imageUrl ? (
                        <>
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <label className="cursor-pointer p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                              <Plus size={20} />
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-orange-500 transition-colors">
                          {isUploading ? <Spinner size="sm" color="warning" /> : <Library size={24} />}
                          <span className="text-[10px] font-bold mt-2 uppercase tracking-tighter">Upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="https://example.com/image.png"
                        value={imageUrl}
                        onValueChange={setImageUrl}
                        size="sm"
                        label={language === 'vi' ? "Hoặc dán URL ảnh trực tiếp" : "Or paste image URL directly"}
                        labelPlacement="outside"
                        classNames={{
                          inputWrapper: "h-11 bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-white/10 rounded-xl",
                          label: "text-[10px] font-black uppercase text-slate-400 mb-1"
                        }}
                      />
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                        {language === 'vi'
                          ? "Hỗ trợ định dạng .jpg, .png, .webp. Kích thước đề xuất 800x450px."
                          : "Supports .jpg, .png, .webp. Recommended size: 800x450px."}
                      </p>
                    </div>
                  </div>
                </div>
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
