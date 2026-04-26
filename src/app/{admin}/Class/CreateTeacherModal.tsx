"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
} from "@heroui/react";

import { useCreateUserMutation } from "@/store/queries/user";
import { useModal } from "@/Provider/ModalProvider";
import { CreateUserRequest } from "@/types";
import { RequiredStar } from "@/Common/RequiredStar";

export default function CreateTeacherModal() {
  const { closeModal } = useModal();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload: CreateUserRequest = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        username: form.username,
        roles: ["teacher"],
      };

      await createUser(payload).unwrap();
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create New Teacher
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Fill in the details below to add a new teacher
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 flex flex-col gap-3">
        {/* Section: Personal Info */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Personal Information
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Input
                label={
                  <div className="flex items-center gap-1">
                    First Name
                    <RequiredStar rules={["Required field"]} />
                  </div>
                }
                placeholder="e.g. John"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
                  label: "text-gray-500 dark:text-slate-400",
                  input: "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
                }}
              />
              <Input
                label={
                  <div className="flex items-center gap-1">
                    Last Name
                    <RequiredStar rules={["Required field"]} />
                  </div>
                }
                placeholder="e.g. Doe"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
                  label: "text-gray-500 dark:text-slate-400",
                  input: "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
                }}
              />
            </div>
            <Input
              label={
                <div className="flex items-center gap-1">
                  Email
                  <RequiredStar rules={["Required field"]} />
                </div>
              }
              type="email"
              placeholder="e.g. johndoe@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
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

        {/* Section: Account Details */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 mt-2">
            Account Details
          </p>
          <div className="flex gap-3">
            <Input
              label={
                <div className="flex items-center gap-1">
                  Username
                  <RequiredStar rules={["Required field"]} />
                </div>
              }
              placeholder="e.g. johndoe"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
                label: "text-gray-500 dark:text-slate-400",
                input: "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
              }}
            />
            <Input
              label={
                <div className="flex items-center gap-1">
                  Password
                  <RequiredStar rules={["Required field"]} />
                </div>
              }
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
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
          Create Teacher
        </Button>
      </div>
    </div>
  );
}
