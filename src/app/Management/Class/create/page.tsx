"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

import { ArrowLeft, Info, Rocket } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCreateClassMutation } from "@/store/queries/Class";
import { useGetAllSubjectQueryQuery } from "@/store/queries/Subject";
import { useGetUserRoleQuery } from "@/store/queries/user";
import { CreateClassRequest } from "@/types";
import { useGetSemestersQuery } from "@/store/queries/Semester";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

export default function CreateClassPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [create_class, { isLoading: isLaunching }] = useCreateClassMutation();

  const { data: subjectData, isLoading: subjectLoading } =
    useGetAllSubjectQueryQuery();

  const subjects = subjectData?.data?.items ?? [];

  const { data: teacherData, isLoading: teacherLoading } =
    useGetUserRoleQuery({
      roleName: "teacher",
    });
    // get những cái public
 const { data: semesterData, isLoading: semesterLoading } =useGetSemestersQuery();

const semesters = semesterData?.data?.items ?? [];

  const teachers = teacherData?.data ?? [];

  const [form, setForm] = useState({
    subjectId: "",
    semesterId: "",
    classCode: "",
    teacherId: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedSubject = subjects.find(
    (s) => s.subjectId === form.subjectId
  );

  const handleLaunch = async () => {
    if (!form.subjectId || !form.semesterId) {
      toast.error("Subject and Semester are required");
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
      router.push("/Management/Class");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create class");
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 p-2 max-w-5xl mx-auto w-full">

      {/* HEADER */}
      <div className="flex items-center gap-4 shrink-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
        <Link href="/Management/Class">
          <Button
            isIconOnly
            variant="flat"
            className="rounded-xl bg-white dark:bg-[#111827]"
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>

        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white">
          {t('class_create.title1') || "CREATE NEW"} <span className="text-[#FF5C00]">{t('class_create.title2') || "CLASS"}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] p-4 shadow-sm animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <CardBody className="gap-8">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Info size={20} />
                </div>

                <h2 className="text-xl font-black italic uppercase tracking-tight text-[#071739] dark:text-white">
                  {t('class_create.general_info') || "General Information"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                  onSelectionChange={(keys) =>
                    handleChange("subjectId", Array.from(keys)[0] as string)
                  }
                  classNames={{
                    base: "animate-fade-in-up",
                    trigger: "h-12 rounded-xl",
                    label: "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                  style={{ animationDelay: '150ms', animationFillMode: 'both' }}
                >
                  {subjects.map((s) => (
                    <SelectItem key={s.subjectId}>
                      {s.name || s.code}
                    </SelectItem>
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
                  onSelectionChange={(keys) =>
                    handleChange("semesterId", Array.from(keys)[0] as string)
                  }
                  classNames={{
                    base: "animate-fade-in-up",
                    trigger: "h-12 rounded-xl",
                    label: "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                  style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                >
                  {semesters.map((s) => (
                    <SelectItem key={s.semesterId} textValue={`${s.code}-${s.name}`}>
                      {s.code}-{s.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label={
                    <div className="flex items-center gap-1">
                      {t('class_create.class_code') || "Class Code"}
                      <RequiredStar rules={["Required field","Class Code must be unique"]} />
                    </div>
                  }
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
                  onSelectionChange={(keys) =>
                    handleChange("teacherId", Array.from(keys)[0] as string)
                  }
                  classNames={{
                    base: "animate-fade-in-up",
                    trigger: "h-12 rounded-xl",
                    label: "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                  style={{ animationDelay: '300ms', animationFillMode: 'both' }}
                >
                  {teachers.map((t) => (
                    <SelectItem key={t.userId}>
                      {t.displayName}
                    </SelectItem>
                  ))}
                </Select>

                <div className="md:col-span-2 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-divider flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '350ms', animationFillMode: 'both' }}>
                  <span className="text-[10px] font-black uppercase italic text-slate-400">
                    {t('class_create.class_identifier') || "Class Identifier"}
                  </span>
                  <span className="font-[1000] italic text-xl text-blue-600 dark:text-blue-400 uppercase">
                    {selectedSubject?.code || "???"}-{form.classCode || "???"}
                  </span>
                </div>

              </div>
            </CardBody>
          </Card>

        </div>

        {/* RIGHT */}
        <div>

          <div className="p-8 rounded-[2.5rem] bg-[#071739] text-white flex flex-col gap-6 relative overflow-hidden shadow-2xl animate-fade-in-right" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>

            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Rocket size={120} />
            </div>

            <h3 className="text-sm font-black uppercase italic tracking-widest text-[#FF5C00]">
              {t('class_create.finalize_classroom') || "Finalize Classroom"}
            </h3>

            <p className="text-xs text-slate-400 italic">
              {t('class_create.launch_text', { subject: selectedSubject?.code || "...", classCode: form.classCode || "...", semester: form.semesterId || "..." }) || `Launch ${selectedSubject?.code || "..."}-${form.classCode || "..."} in ${form.semesterId || "..."} semester.`}
            </p>

            <Button
              onPress={handleLaunch}
              isLoading={isLaunching}
              className="w-full bg-[#FF5C00] text-[#071739] font-[1000] h-16 rounded-2xl shadow-xl uppercase text-sm italic active-bump"
            >
              {t('class_create.create_class_btn') || "Create Class"}
            </Button>

          </div>

        </div>

      </div>
    </div>
  );
}