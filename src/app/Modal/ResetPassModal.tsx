"use client";

import React, { useState, useMemo } from "react";
import { Button, addToast, Divider, Input } from "@heroui/react";
import { useModal } from "../../Provider/ModalProvider";
import { ArrowRight, X, Mail, KeyRound } from "lucide-react";
import RegisterModal from "./RegisterModal";
import PasswordInput from "../components/PasswordInput";
import { useResetPasswordMutation } from "@/store/queries/auth";
import { ErrorForm, resetPasswordInformation } from "@/types";

export default function ResetPassModal() {
  const { closeModal, openModal } = useModal();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ===== PASSWORD VALIDATION =====
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

    try {
      const payload: resetPasswordInformation = {
        email,
        token,
        newPassword: password,
      };

      await resetPassword(payload).unwrap();

      addToast({
        title: "Password reset successfully!",
        color: "success",
      });

      closeModal();
    } catch (error: unknown) {
      const err = error as ErrorForm;

      addToast({
        title: err?.data?.data?.message ?? "Reset failed",
        color: "danger",
      });
    }
  };

  return (
    <div className="relative flex flex-col gap-6 py-10 px-8 bg-white dark:bg-[#282E3A] rounded-[2.5rem] shadow-2xl max-w-[420px] w-full">

      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-gray-400 hover:text-[#FFB800]"
      >
        <X size={20} />
      </button>

      <div className="text-center">
        <h2 className="text-4xl font-[1000] text-[#3F4755] dark:text-white italic uppercase">
          Reset Password
        </h2>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">
          Enter your new credentials
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        {/* EMAIL */}
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          startContent={
            <Mail
              size={18}
              className="text-[#3F4755] dark:text-[#FFB800] shrink-0"
            />
          }
          classNames={{
            inputWrapper:
              "bg-gray-100 dark:bg-[#333A45] border border-transparent dark:border-[#474F5D] focus-within:!border-[#FFB800] h-12 rounded-2xl transition-all",
            input:
              "font-bold ml-2 text-sm text-[#3F4755] dark:text-white placeholder:text-gray-500",
          }}
          autoFocus
        />

        {/* TOKEN */}
        <Input
          type="text"
          placeholder="Reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          startContent={
            <KeyRound
              size={18}
              className="text-[#3F4755] dark:text-[#FFB800] shrink-0"
            />
          }
          classNames={{
            inputWrapper:
              "bg-gray-100 dark:bg-[#333A45] border border-transparent dark:border-[#474F5D] focus-within:!border-[#FFB800] h-12 rounded-2xl transition-all",
            input:
              "font-bold ml-2 text-sm text-[#3F4755] dark:text-white placeholder:text-gray-500",
          }}
        />

        {/* PASSWORD */}
        <PasswordInput
          value={password}
          onChange={setPassword}
          required
          placeholder="New password"
        />

        {/* CONFIRM */}
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          placeholder="Confirm password"
          isInvalid={confirmPassword.length > 0 && !isMatch}
        />

        {confirmPassword.length > 0 && !isMatch && (
          <p className="text-[11px] font-bold text-danger ml-1 italic">
            Passwords do not match
          </p>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          endContent={!isLoading && <ArrowRight size={18} />}
          className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-[1000] rounded-2xl h-14 mt-4 shadow-xl uppercase tracking-widest text-sm transition-all hover:-translate-y-1 active:scale-95"
        >
          Confirm Reset
        </Button>
      </form>

      <Divider className="dark:bg-[#474F5D] opacity-30" />

      <p className="text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
        New to TMOJ?{" "}
        <span
          className="text-[#3F4755] dark:text-[#FFB800] cursor-pointer hover:underline"
          onClick={() => openModal({ content: <RegisterModal /> })}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}