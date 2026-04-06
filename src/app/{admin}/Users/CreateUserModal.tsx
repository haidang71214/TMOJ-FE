"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";

import { useCreateUserMutation } from "@/store/queries/user";
import { useModal } from "@/Provider/ModalProvider";
import { UserRole, USER_ROLE_LABEL } from "@/types";

export default function CreateUserModal() {
  const { closeModal } = useModal();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: new Set<string>(),
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        roles: Array.from(form.roles),
      };
      await createUser(payload).unwrap();
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create New User
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Add a new user to the system
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 flex flex-col gap-3">
        <Input
          label="Username"
          placeholder="e.g. johndoe"
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
          variant="bordered"
          classNames={{
            inputWrapper:
              "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
            label: "text-gray-500 dark:text-slate-400",
            input:
              "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
          }}
        />
        <div className="flex gap-3">
          <Input
            label="Last Name"
            placeholder="e.g. Smith"
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
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
            label="First Name"
            placeholder="e.g. John"
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
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

        <Input
          label="Email Address"
          placeholder="e.g. user@example.com"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
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
          type="password"
          label="Password"
          placeholder="Enter a secure password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          variant="bordered"
          classNames={{
            inputWrapper:
              "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
            label: "text-gray-500 dark:text-slate-400",
            input:
              "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
          }}
        />

        <Select
          label="Roles"
          selectionMode="multiple"
          selectedKeys={form.roles}
          onSelectionChange={(keys) => handleChange("roles", keys as Set<string>)}
          variant="bordered"
          classNames={{
            trigger:
              "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
            label: "text-gray-500 dark:text-slate-400",
          }}
        >
          {Object.values(UserRole).map((role) => (
            <SelectItem key={role}>{USER_ROLE_LABEL[role]}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 flex justify-end gap-3 bg-gray-50 dark:bg-[#0b1120] border-t border-gray-100 dark:border-indigo-500/8">
        <Button
          variant="flat"
          onPress={closeModal}
          className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/10 font-medium transition-colors"
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          onPress={handleSubmit}
          className="font-semibold text-white transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow:
              "0 4px 15px rgba(99, 102, 241, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          Create User
        </Button>
      </div>
    </div>
  );
}
