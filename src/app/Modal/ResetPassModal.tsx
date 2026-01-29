"use client";

import React, { useState, useMemo } from "react";
import {
  Button,
  addToast,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react"; // Xóa Input ở đây
import { useModal } from "../../Provider/ModalProvider";
import { ArrowRight, X, Info, Check, AlertCircle } from "lucide-react"; // Xóa ShieldCheck ở đây
import RegisterModal from "./RegisterModal";
import PasswordInput from "../components/PasswordInput";

export default function ResetPassModal({ token }: { token: string }) {
  const { closeModal, openModal } = useModal();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validation = useMemo(() => {
    return {
      length: password.length >= 10,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const isPasswordValid = Object.values(validation).every(Boolean);
  const isMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      addToast({ title: "Password is too weak!", color: "danger" });
      return;
    }
    if (!isMatch) {
      addToast({ title: "Passwords do not match!", color: "danger" });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Initiating password reset for token:", token);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addToast({ title: "Password reset successfully!", color: "success" });
      closeModal();
    } catch {
      addToast({ title: "Reset failed", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-5 py-10 px-8 bg-white dark:bg-[#282E3A] transition-colors duration-500 rounded-[2.5rem] shadow-2xl max-w-[420px] w-full border-none outline-none">
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-gray-400 hover:text-[#FFB800] transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-1 items-center justify-center text-center mt-2 mb-6">
        <h2 className="text-4xl font-[1000] text-[#3F4755] dark:text-white tracking-tighter uppercase leading-none italic">
          Reset Password<span className="text-[#FFB800]">.</span>
        </h2>
        <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mt-2 uppercase">
          Enter your new credentials
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-1 relative">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase text-slate-400">
              New Password <span className="text-[#FFB800]">*</span>
            </label>
            <Popover placement="right" showArrow offset={15}>
              <PopoverTrigger>
                <button
                  type="button"
                  className="text-slate-400 hover:text-[#FFB800] transition-colors"
                >
                  <Info size={14} strokeWidth={3} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-4 py-3 w-64 bg-white dark:bg-[#333A45]">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
                    Security Checklist
                  </p>
                  <div className="flex flex-col gap-2">
                    <RequirementItem
                      met={validation.length}
                      label="At least 10 characters"
                    />
                    <RequirementItem
                      met={validation.upper}
                      label="Uppercase letter"
                    />
                    <RequirementItem
                      met={validation.lower}
                      label="Lowercase letter"
                    />
                    <RequirementItem
                      met={validation.number}
                      label="At least one number"
                    />
                    <RequirementItem
                      met={validation.special}
                      label="Special character"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <PasswordInput value={password} onChange={setPassword} required />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            Confirm Password <span className="text-[#FFB800]">*</span>
          </label>
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            placeholder="Repeat new password"
            isInvalid={confirmPassword.length > 0 && !isMatch} // Lỗi TS sẽ biến mất sau khi sửa file PasswordInput
          />
          {confirmPassword.length > 0 && !isMatch && (
            <p className="text-[10px] font-bold text-danger ml-1 italic animate-pulse">
              Passwords do not match
            </p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          endContent={!isLoading && <ArrowRight size={18} />}
          className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-[1000] rounded-2xl h-14 mt-4 shadow-xl uppercase tracking-widest text-sm transition-all hover:-translate-y-1 active:scale-95"
        >
          Confirm Reset
        </Button>
      </form>

      <div className="flex flex-col gap-4 mt-2">
        <Divider className="dark:bg-[#474F5D] opacity-30" />
        <p className="text-center text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">
          New to TMOJ?{" "}
          <span
            className="text-[#3F4755] dark:text-[#FFB800] cursor-pointer hover:underline font-black"
            onClick={() => openModal({ content: <RegisterModal /> })}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 transition-colors ${
        met ? "text-emerald-500" : "text-slate-500"
      }`}
    >
      {met ? <Check size={12} strokeWidth={4} /> : <AlertCircle size={12} />}
      <span
        className={`text-[11px] font-bold ${
          met ? "line-through opacity-50" : ""
        }`}
      >
        {label}
      </span>
    </div>
  );
}
