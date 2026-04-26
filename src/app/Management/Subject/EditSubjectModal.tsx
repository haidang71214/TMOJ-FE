"use client";

import React, { useState } from "react";
import { Input, Button, Textarea } from "@heroui/react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useUpdateSubjectMutation } from "@/store/queries/Subject";
import { useModal } from "@/Provider/ModalProvider";
import { SubjectResponseForm, ErrorForm } from "@/types";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

interface EditSubjectModalProps {
  subject: SubjectResponseForm;
}

export default function EditSubjectModal({ subject }: EditSubjectModalProps) {
  const { t, language } = useTranslation();
  const { closeModal } = useModal();
  const [updateSubject, { isLoading }] = useUpdateSubjectMutation();

  const [form, setForm] = useState({
    code: subject.code,
    name: subject.name,
    description: subject.description,
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.code || !form.name || !form.description) {
        toast.error(t('common.fill_required') || (language === 'vi' ? 'Vui lòng điền đủ các trường.' : 'Please fill all required fields.'));
        return;
      }
      await updateSubject({ id: subject.subjectId, body: form }).unwrap();
      toast.success(t('subject_management.updated_title') || (language === 'vi' ? 'Đã cập nhật môn học!' : 'Subject Updated!'), {
        description: t('subject_management.updated_desc') || (language === 'vi' ? 'Các thay đổi đã được lưu.' : 'The changes have been saved successfully.'),
      });
      closeModal();
    } catch (error) {
      const err = error as ErrorForm;
      toast.error(err?.data?.data?.message || (t('common.error') || (language === 'vi' ? 'Cập nhật thất bại' : 'Failed to update subject.')));
    }
  };

  return (
    <div className="w-[480px] rounded-2xl overflow-hidden bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/10 shadow-xl">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#071739]/50">
        <h2 className="text-xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white">
           {language === 'vi' ? 'Sửa ' : 'Edit '} <span className="text-[#FF5C00]">{t('subject_management.subject') || (language === 'vi' ? 'Môn học' : 'Subject')}</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
          {t('subject_management.edit_desc') || (language === 'vi' ? 'Cập nhật thông tin môn học' : 'Update academic subject details')}
        </p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        <div className="animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "100ms" }}>
          <Input
            label={
              <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
                {t('subject_management.code') || (language === 'vi' ? 'Mã môn' : 'Subject Code')} <RequiredStar rules={[t('common.required') || "Required"]} />
              </div>
            }
          placeholder="e.g. CS101"
          value={form.code}
          onChange={(e) => handleChange("code", e.target.value)}
          variant="bordered"
          labelPlacement="outside"
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#071739]/30 border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00]",
            input: "font-bold text-[#071739] dark:text-white",
          }}
        />
        </div>

        <div className="animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "200ms" }}>
          <Input
            label={
              <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
                {t('subject_management.name') || (language === 'vi' ? 'Tên môn' : 'Subject Name')} <RequiredStar rules={[t('common.required') || "Required"]} />
              </div>
            }
          placeholder="e.g. Introduction to CS"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          variant="bordered"
          labelPlacement="outside"
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#071739]/30 border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00]",
            input: "font-bold text-[#071739] dark:text-white",
          }}
        />
        </div>

        <div className="animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "300ms" }}>
          <Textarea
            label={
              <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
                {t('subject_management.description') || (language === 'vi' ? 'Mô tả' : 'Description')} <RequiredStar rules={[t('common.required') || "Required"]} />
              </div>
            }
          placeholder="Brief description of the subject..."
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          variant="bordered"
          labelPlacement="outside"
          minRows={3}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#071739]/30 border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00]",
            input: "font-bold text-[#071739] dark:text-white",
          }}
        />
        </div>
      </div>

      <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50 dark:bg-[#071739]/50 border-t border-slate-100 dark:border-white/5">
        <Button
          variant="light"
          onPress={closeModal}
          isDisabled={isLoading}
          className="font-black text-[10px] uppercase italic text-slate-500 animate-fade-in-left"
          style={{ animationFillMode: "both", animationDelay: "400ms" }}
        >
          {t('common.cancel') || (language === 'vi' ? 'Hủy' : 'Cancel')}
        </Button>
        <Button
          isLoading={isLoading}
          onPress={handleSubmit}
          startContent={!isLoading && <Save size={16} />}
          className="bg-[#FF5C00] text-white font-black text-[10px] uppercase italic shadow-lg active-bump animate-fade-in-left"
          style={{ animationFillMode: "both", animationDelay: "500ms" }}
        >
          {t('common.save') || (language === 'vi' ? 'Lưu Thay Đổi' : 'Save Changes')}
        </Button>
      </div>
    </div>
  );
}
