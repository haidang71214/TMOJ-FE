"use client";

import React, { useState } from "react";
import { Input, Button, Textarea } from "@heroui/react";

import { useUpdateSubjectMutation } from "@/store/queries/Subject";
import { useModal } from "@/Provider/ModalProvider";
import { SubjectResponseForm } from "@/types";
import { RequiredStar } from "@/Common/RequiredStar";

interface EditSubjectModalProps {
  subject: SubjectResponseForm;
}

export default function EditSubjectModal({ subject }: EditSubjectModalProps) {
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
      await updateSubject({ id: subject.subjectId, body: form }).unwrap();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[480px] rounded-2xl overflow-hidden bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-indigo-500/20 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="px-6 pt-5 pb-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/5 border-b border-amber-100 dark:border-amber-500/12">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
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
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Edit Subject
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Update subject information
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 flex flex-col gap-3">
        <div className="flex gap-3">

          <Input
            label={
              <div className="flex items-center gap-1">
                Subject Code
                <RequiredStar rules={["Subject code is required"]} />
              </div>
            }
            placeholder="e.g. CS101"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
            variant="bordered"
            classNames={{
              inputWrapper:
                "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-400/50 focus-within:!border-amber-500 transition-colors",
              label: "text-gray-500 dark:text-slate-400",
              input:
                "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
            }}
          />

          <Input
            label={
              <div className="flex items-center gap-1">
                Subject Name
                <RequiredStar rules={["Subject name is required"]} />
              </div>
            }
            placeholder="e.g. Introduction to CS"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            variant="bordered"
            classNames={{
              inputWrapper:
                "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-400/50 focus-within:!border-amber-500 transition-colors",
              label: "text-gray-500 dark:text-slate-400",
              input:
                "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
            }}
          />
        </div>

        <Textarea
          label={
            <div className="flex items-center gap-1">
              Description
              <RequiredStar
                rules={[
                  "Description is required",
                  "Minimum 10 characters",
                ]}
              />
            </div>
          }
          placeholder="Brief description of the subject..."
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          variant="bordered"
          minRows={2}
          maxRows={3}
          classNames={{
            inputWrapper:
              "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-400/50 focus-within:!border-amber-500 transition-colors",
            label: "text-gray-500 dark:text-slate-400",
            input:
              "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-3 flex justify-end gap-3 bg-gray-50 dark:bg-[#0b1120] border-t border-gray-100 dark:border-amber-500/8">
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
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            boxShadow:
              "0 4px 15px rgba(245, 158, 11, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}