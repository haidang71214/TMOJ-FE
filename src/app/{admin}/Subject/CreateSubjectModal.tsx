"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Textarea,
} from "@heroui/react";

import { useCreateSubjectMutation } from "@/store/queries/Subject";
import { useModal } from "@/Provider/ModalProvider";
import { RequiredStar } from "@/Common/RequiredStar";

export default function CreateSubjectModal() {
  const { closeModal } = useModal();
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createSubject(form).unwrap();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[480px] rounded-2xl overflow-hidden bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-indigo-500/20 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create New Subject
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Add a new subject to the system
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
                "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
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
                "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
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
              "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
            label: "text-gray-500 dark:text-slate-400",
            input:
              "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
          }}
        />
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
          Create Subject
        </Button>
      </div>
    </div>
  );
}