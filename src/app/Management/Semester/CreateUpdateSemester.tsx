"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
  Divider,
} from "@heroui/react";

import { CalendarDays } from "lucide-react";

import {
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
} from "@/store/queries/Semester";
import { RequiredStar } from "@/Common/RequiredStar";
import { ErrorForm } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";


export default function CreateUpdateSemester({
  open,
  setOpen,
  semester,
}: any) {
  const { t, language } = useTranslation();
  const [createSemester, { isLoading: creating }] = useCreateSemesterMutation();
  const [updateSemester, { isLoading: updating }] = useUpdateSemesterMutation();

  const [form, setForm] = useState({
    code: "",
    name: "",
    startAt: "",
    endAt: "",
  });

  useEffect(() => {
    if (semester) {
      setForm({
        code: semester.code,
        name: semester.name,
        startAt: semester.startAt,
        endAt: semester.endAt,
      });
    } else {
      setForm({
        code: "",
        name: "",
        startAt: "",
        endAt: "",
      });
    }
  }, [semester]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!semester) {
        if (!form.code || !form.name || !form.startAt || !form.endAt) {
          addToast({
            title: t('common.missing_fields') || (language === 'vi' ? 'Thiếu thông tin' : 'Missing fields'),
            description: t('common.fill_required') || (language === 'vi' ? 'Vui lòng điền đủ các trường' : 'Please fill all required fields'),
            color: "warning",
          });
          return;
        }
      }

      const today = new Date().toISOString().split("T")[0];

      if (form.startAt < today) {
        addToast({
          title: "Invalid date",
          description: "Start date cannot be before today",
          color: "warning",
        });
        return;
      }

     if (semester) {
  await updateSemester({
    id: semester.semesterId,
    data: {
      ...form,
      isActive: semester.isActive,
    },
  }).unwrap();

        addToast({
          title: "Success",
          description: "Semester updated successfully",
          color: "success",
        });
      } else {
        await createSemester(form).unwrap();

        addToast({
          title: "Success",
          description: "Semester created successfully",
          color: "success",
        });
      }

      setOpen(false);
    } catch (err) {
  const error = err as ErrorForm;
  addToast({
    title: "Error",
    description: error?.data?.data?.message || "Semester action failed",
    color: "danger",
  });
}
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      size="2xl"
      backdrop="blur"
      classNames={{
        base: "rounded-2xl",
      }}
    >
      <ModalContent>
        <ModalHeader className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#071739]/50 flex flex-col items-start gap-1">
          <h2 className="text-xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white flex items-center gap-2">
            <CalendarDays size={22} className="text-[#FF5C00]" />
            {semester 
              ? (<span>{language === 'vi' ? 'CẬP NHẬT ' : 'UPDATE '} <span className="text-[#FF5C00]">{t('semester_management.semester') || (language === 'vi' ? 'HỌC KỲ' : 'SEMESTER')}</span></span>)
              : (<span>{language === 'vi' ? 'TẠO ' : 'CREATE '} <span className="text-[#FF5C00]">{t('semester_management.semester') || (language === 'vi' ? 'HỌC KỲ MỚI' : 'NEW SEMESTER')}</span></span>)
            }
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
            {t('semester_management.manage_desc') || (language === 'vi' ? 'Quản lý thông tin học kỳ trên hệ thống' : 'Manage semester information for the system')}
          </p>
        </ModalHeader>

        <ModalBody className="grid grid-cols-2 gap-5 py-6">

          <div className="animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "100ms" }}>
            <Input
              label={
                <div className="flex items-center gap-1">
                  {t('semester_management.code') || (language === 'vi' ? 'Mã học kỳ' : 'Semester Code')}
                  <RequiredStar rules={[t('common.required') || "Required", "Max 10 characters"]} />
                </div>
              }
              placeholder="Ex: SEM01"
              value={form.code}
              maxLength={10}
              variant="bordered"
              onChange={(e) => handleChange("code", e.target.value)}
            />
          </div>

          <div className="animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "200ms" }}>
            <Input
              label={
                <div className="flex items-center gap-1">
                  {t('semester_management.name') || (language === 'vi' ? 'Tên học kỳ' : 'Semester Name')}
                  <RequiredStar rules={[t('common.required') || "Required", "Max 10 characters"]} />
                </div>
              }
              placeholder="Ex: Spring"
              value={form.name}
              maxLength={10}
              variant="bordered"
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "300ms" }}>
            <Input
              type="date"
              label={
                <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
                  {t('semester_management.start') || (language === 'vi' ? 'Ngày Bắt Đầu' : 'Start Date')}
                  <RequiredStar rules={[t('common.required') || "Required", "Cannot be before today"]} />
                </div>
              }
              variant="bordered"
              value={form.startAt}
              onChange={(e) => handleChange("startAt", e.target.value)}
            />
          </div>

          <div className="animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "400ms" }}>
            <Input
              type="date"
              label={
                <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
                  {t('semester_management.end') || (language === 'vi' ? 'Ngày Kết Thúc' : 'End Date')}
                  <RequiredStar rules={[t('common.required') || "Required", "Must be after start date"]} />
                </div>
              }
              variant="bordered"
              value={form.endAt}
              onChange={(e) => handleChange("endAt", e.target.value)}
            />
          </div>

        </ModalBody>

        <Divider />

        <ModalFooter className="flex justify-between">

          <Button
            variant="light"
            onPress={() => setOpen(false)}
            className="font-black text-[10px] uppercase italic text-slate-500 animate-fade-in-right"
            style={{ animationFillMode: "both", animationDelay: "500ms" }}
          >
            {t('common.cancel') || (language === 'vi' ? 'Hủy' : 'Cancel')}
          </Button>

          <Button
            className="bg-[#FF5C00] text-white font-black text-[10px] uppercase italic shadow-lg active-bump animate-fade-in-left"
            onPress={handleSubmit}
            isLoading={creating || updating}
            style={{ animationFillMode: "both", animationDelay: "500ms" }}
          >
            {semester 
              ? (t('semester_management.update_btn') || (language === 'vi' ? 'Cập Nhật' : 'Update Semester')) 
              : (t('semester_management.create_btn') || (language === 'vi' ? 'Tạo Mới' : 'Create Semester'))}
          </Button>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}