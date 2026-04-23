"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { Info, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useModal } from "@/Provider/ModalProvider";
import { useCreateClassMutation } from "@/store/queries/Class";
import { useGetAllSubjectQueryQuery } from "@/store/queries/Subject";
import { useGetUserRoleQuery } from "@/store/queries/user";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { CreateClassRequest } from "@/types";
import { useCurrentSemester } from "@/hooks/useCurrentSemester";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

export default function CreateClassModal({ onCreated }: { onCreated?: () => void }) {
  const { t } = useTranslation();
  const { closeModal } = useModal();

  const [create_class, { isLoading: isLaunching }] = useCreateClassMutation();

  const { data: subjectData, isLoading: subjectLoading } = useGetAllSubjectQueryQuery();
  const subjects = subjectData?.data?.items ?? [];

  const { data: userProfile } = useGetUserInformationQuery();
  const isManagerOrAdmin = userProfile?.role?.toLowerCase() === "manager" || userProfile?.role?.toLowerCase() === "admin";

  const { data: teacherData, isLoading: teacherLoading } = useGetUserRoleQuery({ roleName: "teacher" }, { skip: !isManagerOrAdmin });
  const teachers = teacherData?.data ?? [];

  const { currentSemester, semesters, isLoading: semesterLoading } = useCurrentSemester();

  const [form, setForm] = useState({
    subjectId: "",
    semesterId: "",
    classCode: "",
    teacherId: "",
  });

  React.useEffect(() => {
    let updatedSemesterId = form.semesterId;
    let updatedTeacherId = form.teacherId;
    let shouldUpdate = false;

    if (currentSemester && !form.semesterId) {
      updatedSemesterId = currentSemester.semesterId;
      shouldUpdate = true;
    }
    if (userProfile?.userId && !form.teacherId && !isManagerOrAdmin) {
      updatedTeacherId = userProfile.userId;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      setForm((prev) => ({ ...prev, semesterId: updatedSemesterId, teacherId: updatedTeacherId }));
    }
  }, [currentSemester, userProfile]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedSubject = subjects.find((s) => s.subjectId === form.subjectId);

  const handleLaunch = async () => {
    if (!form.subjectId || !form.semesterId || !form.classCode || !form.teacherId) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload: CreateClassRequest = {
        subjectId: form.subjectId,
        semesterId: form.semesterId,
        classCode: form.classCode || null,
        teacherId: form.teacherId || null,
      };

      await create_class(payload).unwrap();

      toast.success("Class created successfully");
      if (onCreated) onCreated();
      closeModal();
    } catch  {
      toast.error("Failed to create class");
    }
  };

  return (
    <div className="w-[480px] bg-white dark:bg-[#0f172a] p-7 rounded-3xl flex flex-col gap-6 shadow-2xl border dark:border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none animate-fade-in-right" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
        <Rocket size={120} />
      </div>

      {/* HEADER */}
      <div className="flex items-center gap-3 relative z-10 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500 shadow-sm border border-orange-200 dark:border-orange-500/20">
          <Info size={18} />
        </div>
        <div>
          <h3 className="font-black text-lg text-[#071739] dark:text-white uppercase tracking-wide flex items-center gap-2">
            {t('class_create.title1') || "CREATE NEW"} <span className="text-[#FF5C00]">{t('class_create.title2') || "CLASS"}</span>
          </h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {t('class_create.general_info') || "General Information"}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col gap-5 relative z-10">
        
        <Select
          label={
            <div className="flex items-center gap-1">
              {t('class_create.subject') || "Subject"}
              <RequiredStar rules={["Required field"]} />
            </div>
          }
          placeholder={t('class_create.select_subject') || "Select subject"}
          labelPlacement="outside"
          variant="bordered"
          isLoading={subjectLoading}
          selectedKeys={form.subjectId ? [form.subjectId] : []}
          onSelectionChange={(keys) => handleChange("subjectId", Array.from(keys)[0] as string)}
          classNames={{
            base: "animate-fade-in-up",
            trigger: "h-12 rounded-xl",
            label: "font-black uppercase text-[10px] italic text-slate-500",
          }}
          style={{ animationDelay: '150ms', animationFillMode: 'both' }}
        >
          {subjects.map((s) => (
            <SelectItem key={s.subjectId}>{s.name || s.code}</SelectItem>
          ))}
        </Select>

        <Select
          label={
            <div className="flex items-center gap-1">
              {t('class_create.semester') || "Semester"}
              <RequiredStar rules={["Required field"]} />
            </div>
          }
          placeholder={t('class_create.select_semester') || "Select semester"}
          labelPlacement="outside"
          variant="bordered"
          isLoading={semesterLoading}
          selectedKeys={form.semesterId ? [form.semesterId] : []}
          onSelectionChange={(keys) => handleChange("semesterId", Array.from(keys)[0] as string)}
          classNames={{
            base: "animate-fade-in-up",
            trigger: "h-12 rounded-xl",
            label: "font-black uppercase text-[10px] italic text-slate-500",
          }}
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          {semesters.map((s) => (
            <SelectItem key={s.semesterId} textValue={`${s.code}-${s.name}`}>
              {s.code} - {s.name}
            </SelectItem>
          ))}
        </Select>

        <Input
          label={
            <div className="flex items-center gap-1">
              {t('class_create.class_code') || "Class Code"}
              <RequiredStar rules={["Required field"]} />
            </div>
          }
          placeholder="Ex: SE1701"
          value={form.classCode}
          onValueChange={(v) => handleChange("classCode", v)}
          labelPlacement="outside"
          variant="bordered"
          classNames={{
            base: "animate-fade-in-up",
            label: "font-black uppercase text-[10px] italic text-slate-500",
            inputWrapper: "h-12 rounded-xl",
          }}
          style={{ animationDelay: '250ms', animationFillMode: 'both' }}
        />

        {isManagerOrAdmin ? (
          <Select
            label={
              <div className="flex items-center gap-1">
                {t('class_create.teacher') || "Teacher"}
                <RequiredStar rules={["Required field"]} />
              </div>
            }
            placeholder={t('class_create.select_teacher') || "Select teacher"}
            labelPlacement="outside"
            variant="bordered"
            isLoading={teacherLoading}
            selectedKeys={form.teacherId ? [form.teacherId] : []}
            onSelectionChange={(keys) => handleChange("teacherId", Array.from(keys)[0] as string)}
            classNames={{
              base: "animate-fade-in-up",
              trigger: "h-12 rounded-xl",
              label: "font-black uppercase text-[10px] italic text-slate-500",
            }}
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            {teachers.map((t) => (
              <SelectItem key={t.userId}>{t.displayName || t.userId}</SelectItem>
            ))}
          </Select>
        ) : (
          <Input
            label={
              <div className="flex items-center gap-1">
                {t('class_create.teacher') || "Teacher"}
                <RequiredStar rules={["Required field"]} />
              </div>
            }
            isReadOnly
            value={userProfile?.displayName ? `${userProfile.displayName} (${userProfile.email})` : ""}
            labelPlacement="outside"
            variant="faded"
            classNames={{
              base: "animate-fade-in-up",
              label: "font-black uppercase text-[10px] italic text-slate-500",
              inputWrapper: "h-12 rounded-xl bg-slate-50 dark:bg-white/5 opacity-80 cursor-not-allowed",
              input: "font-semibold italic text-slate-500"
            }}
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          />
        )}

        <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-divider flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'both' }}>
          <span className="text-[10px] font-black uppercase italic text-slate-400">
            {t('class_create.class_identifier') || "Class Identifier"}
          </span>
          <span className="font-[1000] italic text-sm text-blue-600 dark:text-blue-400 uppercase">
            {selectedSubject?.code || "???"}-{form.classCode || "???"}
          </span>
        </div>

      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex justify-end gap-3 pt-4 border-t border-divider relative z-10 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
        <Button variant="flat" radius="lg" onPress={closeModal} className="font-bold">
          Cancel
        </Button>
        <Button
          color="primary"
          radius="lg"
          onPress={handleLaunch}
          isLoading={isLaunching}
          className="font-bold px-6 bg-[#FF5C00] text-white active-bump"
        >
          {t('class_create.create_class_btn') || "Create Class"}
        </Button>
      </div>

    </div>
  );
}
