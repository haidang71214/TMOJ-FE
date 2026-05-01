"use client";

import React, { useState, useEffect, use } from "react";
import {
  Button,
  Input,
  Textarea,
  Switch,
  Spinner,
  addToast,
} from "@heroui/react";
import { ChevronLeft, Save, Type, AlignLeft, DollarSign, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetStudyPlanDetailQuery, useUpdateStudyPlanMutation, useUploadStudyPlanImageMutation } from "@/store/queries/StudyPlan";
import { useTranslation } from "@/hooks/useTranslation";
import { ErrorForm } from "@/types";

export default function EditStudyPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: studyPlanId } = use(params);
  const { t, language } = useTranslation();

  const { data: detailResponse, isLoading: isFetching } = useGetStudyPlanDetailQuery(studyPlanId);
  const [updateStudyPlan, { isLoading: isUpdating }] = useUpdateStudyPlanMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadStudyPlanImageMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (detailResponse?.data) {
      const plan = detailResponse.data;
      setTitle(plan.title || "");
      setDescription(plan.description || "");
      setIsPaid(!!plan.isPaid);
      setPrice(plan.price || 0);
      setImageUrl(plan.imageUrl || "");
    }
  }, [detailResponse]);

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

  const handleUpdate = async () => {
    if (!title.trim()) {
      addToast({
        title: language === 'vi' ? "Lỗi" : "Error",
        description: language === 'vi' ? "Vui lòng nhập tiêu đề" : "Please enter a title",
        color: "danger",
      });
      return;
    }

    try {
      await updateStudyPlan({
        id: studyPlanId,
        title,
        description,
        isPaid,
        price: isPaid ? price : 0,
        imageUrl: imageUrl.trim() || null,
      }).unwrap();

      addToast({
        title: language === 'vi' ? "Thành công" : "Success",
        description: language === 'vi' ? "Cập nhật lộ trình thành công!" : "Study Plan updated successfully!",
        color: "success",
      });

      router.push(`/Management/StudyPlan/${studyPlanId}`);
    } catch (error) {
      const err = error as ErrorForm;
      addToast({
        title: language === 'vi' ? "Lỗi" : "Error",
        description: err?.data?.data?.message || (language === 'vi' ? "Không thể cập nhật lộ trình" : "Failed to update study plan"),
        color: "danger",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col h-[500px] items-center justify-center animate-fade-in-up">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8 animate-fade-in-up">
        <Button
          variant="light"
          onPress={() => router.back()}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 transition-colors h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          {t('common.back') || (language === 'vi' ? "Quay lại" : "Back")}
        </Button>

        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
          {language === 'vi' ? "CHỈNH SỬA" : "EDIT"} <span className="text-[#FF5C00]">STUDY PLAN</span>
        </h1>
      </div>

      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-transparent dark:border-white/5 space-y-8 animate-fade-in-up">
        <div className="flex flex-col gap-8">
          <Input
            label={t('studyPlan.title') || (language === 'vi' ? "Tiêu đề" : "Title")}
            placeholder="Enter title..."
            value={title}
            onValueChange={setTitle}
            isRequired
            labelPlacement="outside"
            startContent={<Type size={18} className="text-slate-400 mr-2" />}
            classNames={{
              label: "text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest",
              inputWrapper: "h-14 bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00] shadow-none rounded-2xl px-4",
              input: "text-base font-medium"
            }}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest mb-1">
              {language === 'vi' ? "Hình ảnh lộ trình" : "Study Plan Image"}
            </p>
            <div className="flex gap-6 items-start">
              <div className="relative group w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#111c35] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center transition-all hover:border-orange-500/50 shadow-inner">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                      <label className="cursor-pointer p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:scale-110 transition-transform">
                        <Save size={24} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-orange-500 transition-colors">
                    {isUploading ? <Spinner size="sm" color="warning" /> : <ImageIcon size={32} />}
                    <span className="text-[10px] font-bold mt-2 uppercase tracking-tighter">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <Input
                  placeholder="https://example.com/image.png"
                  value={imageUrl}
                  onValueChange={setImageUrl}
                  label={language === 'vi' ? "Hoặc dán URL ảnh trực tiếp" : "Or paste image URL directly"}
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper: "h-12 bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-white/10 rounded-xl",
                    label: "text-[10px] font-black uppercase text-slate-400 mb-1"
                  }}
                />
                <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                  {language === 'vi'
                    ? "Sử dụng ảnh chất lượng cao để tăng tính thẩm mỹ cho lộ trình học. Định dạng: .jpg, .png, .webp."
                    : "Use high-quality images to enhance your study plan. Format: .jpg, .png, .webp."}
                </p>
              </div>
            </div>
          </div>

          <Textarea
            label={t('studyPlan.description') || (language === 'vi' ? "Mô tả" : "Description")}
            placeholder="Enter description..."
            value={description}
            onValueChange={setDescription}
            labelPlacement="outside"
            startContent={<AlignLeft size={18} className="text-slate-400 mr-2 mt-1" />}
            classNames={{
              label: "text-sm font-bold text-[#071739] dark:text-white uppercase tracking-widest",
              inputWrapper: "bg-slate-50 dark:bg-[#111c35] border border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00] shadow-none rounded-2xl px-4 py-3",
              input: "text-base font-medium"
            }}
          />

          <div className="flex gap-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 items-center">
            <Switch isSelected={isPaid} onValueChange={setIsPaid} color="warning" size="lg">
              <span className="font-black text-sm text-[#071739] dark:text-white uppercase tracking-wider">Paid Plan</span>
            </Switch>

            {isPaid && (
              <div className="flex-1 max-w-xs animate-fade-in-right">
                <Input
                  type="number"
                  label={language === 'vi' ? "Giá tiền (COINS)" : "Price (COINS)"}
                  value={price.toString()}
                  onValueChange={(val) => setPrice(Number(val))}
                  startContent={<DollarSign size={18} className="text-amber-500" />}
                  classNames={{
                    inputWrapper: "h-12 bg-white dark:bg-[#071739] border border-amber-200 dark:border-amber-500/30 focus-within:!border-amber-500 rounded-xl"
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="light"
              onPress={() => router.back()}
              className="font-bold px-8 h-12 rounded-xl"
            >
              {t('common.cancel') || "Cancel"}
            </Button>
            <Button
              className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black px-10 h-12 rounded-xl shadow-lg uppercase tracking-widest text-xs transition-all hover:scale-105"
              onPress={handleUpdate}
              isLoading={isUpdating}
              startContent={!isUpdating && <Save size={18} strokeWidth={3} />}
            >
              {t('common.save') || "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
