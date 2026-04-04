"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";

import { useCreateClassMutation } from "@/store/queries/Class";
import { useModal } from "@/Provider/ModalProvider";
import { useGetUserRoleQuery } from "@/store/queries/user";
import { useGetAllSubjectQueryQuery } from "@/store/queries/Subject";
import { CreateClassRequest } from "@/types";
import { useGetSemestersQuery } from "@/store/queries/Semester";
import { RequiredStar } from "@/Common/RequiredStar";

export default function CreateClassModal() {
  const { closeModal } = useModal();
const { data: semesterData,  isLoading: semesterLoading  } =useGetSemestersQuery();
const semesters = semesterData?.data?.items ?? [];

  const [create_class, { isLoading }] = useCreateClassMutation();
  const { data: subjectData, isLoading: subject_loading } =
    useGetAllSubjectQueryQuery();
  const subjects = subjectData?.data?.items ?? [];

  const { data, isLoading: teacher_loading } = useGetUserRoleQuery({
    roleName: "teacher",
  });

  const teachers = data?.data ?? [];

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

const handleSubmit = async () => {
  try {
    const payload: CreateClassRequest = {
      subjectId: form.subjectId,
      semesterId: form.semesterId,
      classCode: form.classCode || null,
      teacherId: form.teacherId || null,
    };

    await create_class(payload).unwrap();
    closeModal();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="w-[560px] rounded-2xl overflow-hidden bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-indigo-500/20 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/5 border-b border-indigo-100 dark:border-indigo-500/12">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create New Class
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Fill in the details below to set up a new class
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 flex flex-col gap-3">
        {/* Section: Basic Info */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Basic Information
          </p>
          <div className="flex gap-3">
            <Input
              label="Class Code"
              placeholder="e.g. CS101-01"
              value={form.classCode}
              onChange={(e) => handleChange("classCode", e.target.value)}
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
                label: "text-gray-500 dark:text-slate-400",
                input: "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
              }}
            />
          </div>
        </div>

        {/* Section: Course Details */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Course Details
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Select
                  label={
                  <div className="flex items-center gap-1">
                    Subject
                    <RequiredStar rules={["Required field"]} />
                  </div>
                }
                placeholder="Select subject"
                isLoading={subject_loading}
                selectedKeys={form.subjectId ? [form.subjectId] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleChange("subjectId", value);
                }}
                variant="bordered"
                classNames={{
                  trigger:
                    "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 data-[focus=true]:border-indigo-500 transition-colors",
                  label: "text-gray-500 dark:text-slate-400",
                  value: "text-gray-900 dark:text-white",
                }}
              >
                {subjects?.map((s) => (
                  <SelectItem key={s.subjectId}>{s.name}</SelectItem>
                ))}
              </Select>
                 <Select
                 label={
                  <div className="flex items-center gap-1">
                    Semester
                    <RequiredStar rules={["Required field"]} />
                  </div>
                }
                placeholder="Select semester"
                
                variant="bordered"
                isLoading={semesterLoading}
                selectedKeys={form.semesterId ? [form.semesterId] : []}
                onSelectionChange={(keys) =>
                  handleChange("semesterId", Array.from(keys)[0] as string)
                }
                classNames={{
                  trigger:
                    "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 data-[focus=true]:border-indigo-500 transition-colors",
                  label: "text-gray-500 dark:text-slate-400",
                  value: "text-gray-900 dark:text-white",
                }}
              >
                {semesters.map((s) => (
                  <SelectItem
                  
                    key={s.semesterId}
                    textValue={`${s.code}-${s.name}`}
                  >
                    {s.code}-{s.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Select
              label="Teacher"
              placeholder="Select teacher"
              isLoading={teacher_loading}
              selectedKeys={form.teacherId ? [form.teacherId] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleChange("teacherId", value);
              }}
              variant="bordered"
              classNames={{
                trigger:
                  "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 data-[focus=true]:border-indigo-500 transition-colors",
                label: "text-gray-500 dark:text-slate-400",
                value: "text-gray-900 dark:text-white",
              }}
            >
              {teachers.map((t) => (
                <SelectItem key={t.userId}>{t.displayName}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 flex justify-end gap-3 bg-gray-50 dark:bg-[#0b1120] border-t border-gray-100 dark:border-indigo-500/8">
        <Button
          variant="flat"
          onPress={closeModal}
          className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/10 font-medium"
        >
          Cancel
        </Button>

        <Button
          isLoading={isLoading}
          onPress={handleSubmit}
          className="font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow:
              "0 4px 15px rgba(99, 102, 241, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          Create Class
        </Button>
      </div>
    </div>
  );
}