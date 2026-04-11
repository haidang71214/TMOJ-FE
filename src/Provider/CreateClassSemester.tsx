"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";

import { Rocket } from "lucide-react";
import { toast } from "sonner";

import { useCreateClassMutation } from "@/store/queries/Class";
import { useGetAllSubjectQueryQuery } from "@/store/queries/Subject";
import { useGetUserRoleQuery } from "@/store/queries/user";
import { useGetSemestersQuery } from "@/store/queries/Semester";
import { CreateClassRequest, ErrorForm } from "@/types";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

interface CreateClassSemesterProps {
  isOpen: boolean;
  onClose: () => void;
  classCode?: string;   // Class Code mặc định (nếu có)
  onSuccess?: () => void;
}

export default function CreateClassSemester({
  isOpen,
  onClose,
  classCode = "",
  onSuccess,
}: CreateClassSemesterProps) {
  const { t, language } = useTranslation();
  const [create_class, { isLoading: isLaunching }] = useCreateClassMutation();

  // Fetch dữ liệu như trang create gốc
  const { data: subjectData, isLoading: subjectLoading } = useGetAllSubjectQueryQuery();
  const { data: semesterData, isLoading: semesterLoading } = useGetSemestersQuery();
  const { data: teacherData, isLoading: teacherLoading } = useGetUserRoleQuery({
    roleName: "teacher",
  });

  const subjects = subjectData?.data?.items ?? [];
  const semesters = semesterData?.data?.items ?? [];
  const teachers = teacherData?.data ?? [];

  const [form, setForm] = useState({
    subjectId: "",
    semesterId: "",
    classCode: "",
    teacherId: "",
  });

  // Reset form và set classCode mặc định khi mở modal
  useEffect(() => {
    if (isOpen) {
      setForm({
        subjectId: "",
        semesterId: "",
        classCode: classCode || "",
        teacherId: "",
      });
    }
  }, [isOpen, classCode]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedSubject = subjects.find((s) => s.subjectId === form.subjectId);

  const handleCreate = async () => {
    if (!form.subjectId || !form.semesterId) {
      toast.error("Subject and Semester are required");
      return;
    }

    if (!form.classCode.trim()) {
      toast.error("Class Code is required");
      return;
    }

    try {
      const payload: CreateClassRequest = {
        subjectId: form.subjectId,
        semesterId: form.semesterId,
        classCode: classCode,
        teacherId: form.teacherId || null,
      };

      await create_class(payload).unwrap();

      toast.success("Class created successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error((error as ErrorForm)?.data?.data?.message|| "Failed to create class");
    }
  };

  const displayIdentifier = `${selectedSubject?.code || "???"}-${form.classCode || "???"}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      classNames={{
        base: "rounded-[2.5rem] overflow-hidden",
        wrapper: "z-[999]",
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>


            <ModalBody className="px-8 py-6 gap-8">

              <div className="p-5 bg-[#071739] text-white rounded-3xl flex items-center gap-4 animate-fade-in-down" style={{ animationFillMode: "both" }}>
                <Rocket className="text-[#FF5C00]" size={28} />
                <div>
                  <p className="font-medium">{t('class_semester.add_new_semester_for_class') || (language === 'vi' ? 'THÊM HỌC KỲ MỚI CHO LỚP' : 'ADD NEW SEMESTER FOR CLASS')}</p>
                  {classCode && <p className="text-[#FF5C00] font-bold">{t('class_semester.base_class') || (language === 'vi' ? 'Lớp gốc:' : 'Base Class:')} {classCode}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <Select
                  className="animate-fade-in-right"
                  style={{ animationFillMode: "both", animationDelay: "100ms" }}
                  label={
                    <div className="flex items-center gap-1">
                      {t('class_semester.subject') || (language === 'vi' ? 'Môn học' : 'Subject')}
                      <RequiredStar rules={["Required field"]} />
                    </div>
                  }
                  placeholder={t('class_semester.select_subject') || (language === 'vi' ? 'Chọn môn học' : 'Select subject')}
                  labelPlacement="outside"
                  variant="bordered"
                  isLoading={subjectLoading}
                  selectedKeys={form.subjectId ? [form.subjectId] : []}
                  onSelectionChange={(keys) =>
                    handleChange("subjectId", Array.from(keys)[0] as string)
                  }
                  classNames={{
                    trigger: "h-12 rounded-xl",
                    label: "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                >
                  {subjects.map((s) => (
                    <SelectItem key={s.subjectId}>
                      {s.name || s.code}
                    </SelectItem>
                  ))}
                </Select>

                {/* Semester */}
                <Select
                  className="animate-fade-in-left"
                  style={{ animationFillMode: "both", animationDelay: "100ms" }}
                  label={
                    <div className="flex items-center gap-1">
                      {t('class_semester.semester') || (language === 'vi' ? 'Học kỳ' : 'Semester')}
                      <RequiredStar rules={["Required field"]} />
                    </div>
                  }
                  placeholder={t('class_semester.select_semester') || (language === 'vi' ? 'Chọn học kỳ' : 'Select semester')}
                  labelPlacement="outside"
                  variant="bordered"
                  isLoading={semesterLoading}
                  selectedKeys={form.semesterId ? [form.semesterId] : []}
                  onSelectionChange={(keys) =>
                    handleChange("semesterId", Array.from(keys)[0] as string)
                  }
                  classNames={{
                    trigger: "h-12 rounded-xl",
                    label: "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                >
                  {semesters.map((s) => (
                    <SelectItem key={s.semesterId} textValue={`${s.code}-${s.name}`}>
                      {s.code}-{s.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Teacher */}
                <Select
                  className="md:col-span-2 animate-fade-in-up"
                  style={{ animationFillMode: "both", animationDelay: "200ms" }}
                  label={
                    <div className="flex items-center gap-1">
                      {t('class_semester.teacher') || (language === 'vi' ? 'Giáo viên' : 'Teacher')}
                      <RequiredStar rules={["Optional"]} />
                    </div>
                  }
                  placeholder={t('class_semester.select_teacher_optional') || (language === 'vi' ? 'Chọn giáo viên (không bắt buộc)' : 'Select teacher (optional)')}
                  labelPlacement="outside"
                  variant="bordered"
                  isLoading={teacherLoading}
                  selectedKeys={form.teacherId ? [form.teacherId] : []}
                  onSelectionChange={(keys) =>
                    handleChange("teacherId", Array.from(keys)[0] as string)
                  }
                  classNames={{
                    trigger: "h-12 rounded-xl",
                    label: "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                >
                  {teachers.map((t) => (
                    <SelectItem key={t.userId}>{t.displayName}</SelectItem>
                  ))}
                </Select>

                {/* Class Identifier */}
                <div className="md:col-span-2 p-5 bg-slate-50 dark:bg-black/20 rounded-3xl border-2 border-dashed border-divider flex items-center justify-between animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "300ms" }}>
                  <span className="text-xs font-black uppercase italic text-slate-400">
                    {t('class_semester.class_identifier') || (language === 'vi' ? 'ĐỊNH DANH LỚP' : 'CLASS IDENTIFIER')}
                  </span>
                  <span className="font-[1000] italic text-2xl text-blue-600 dark:text-blue-400">
                    {displayIdentifier}
                  </span>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="px-8 pb-8">
              <Button
                variant="flat"
                onPress={onCloseModal}
                className="h-12 rounded-2xl font-medium animate-fade-in-left"
                style={{ animationFillMode: "both", animationDelay: "400ms" }}
              >
                {t('common.cancel') || (language === 'vi' ? 'Hủy' : 'Cancel')}
              </Button>
              <Button
                onPress={handleCreate}
                isLoading={isLaunching}
                className="h-12 bg-[#FF5C00] text-[#071739] font-[1000] rounded-2xl shadow-xl uppercase tracking-wider px-10 animate-fade-in-left"
                style={{ animationFillMode: "both", animationDelay: "500ms" }}
              >
                {t('class_semester.create_class') || (language === 'vi' ? 'TẠO LỚP' : 'CREATE CLASS')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}