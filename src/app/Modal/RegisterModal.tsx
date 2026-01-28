"use client";

import React, { useState, useMemo } from "react";
import {
  Button,
  Input,
  Divider,
  addToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { useModal } from "../../Provider/ModalProvider";
import {
  Mail,
  ArrowRight,
  X,
  IdCard,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";
import LoginModal from "./LoginModal";
import PasswordInput from "../components/PasswordInput";

export default function RegisterModal() {
  const { closeModal, openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Password Validation Logic
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      addToast({ title: "Password is too weak!", color: "danger" });
      return;
    }

    if (password !== confirmPassword) {
      addToast({ title: "Passwords do not match!", color: "danger" });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({ title: "Account created successfully!", color: "success" });
      closeModal();
    }, 1500);
  };

  const PasswordRequirements = (
    <div className="px-4 py-3 w-64 bg-white dark:bg-[#333A45]">
      <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
        Security Checklist
      </p>
      <div className="flex flex-col gap-2">
        <RequirementItem
          met={validation.length}
          label="At least 10 characters"
        />
        <RequirementItem met={validation.upper} label="Uppercase letter" />
        <RequirementItem met={validation.lower} label="Lowercase letter" />
        <RequirementItem met={validation.number} label="At least one number" />
        <RequirementItem
          met={validation.special}
          label="Special character (!@#...)"
        />
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col gap-5 py-10 px-8 bg-white dark:bg-[#282E3A] transition-colors duration-500 rounded-[2.5rem] shadow-2xl max-w-[480px] w-full border-none outline-none">
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-gray-400 hover:text-[#FFB800] transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-1 items-center justify-center text-center mt-2 mb-6">
        <h2 className="text-4xl font-[1000] text-[#3F4755] dark:text-white tracking-tighter uppercase leading-none italic">
          Sign up<span className="text-[#FFB800]">.</span>
        </h2>
        <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 tracking-widest mt-2 uppercase">
          Create your TMOJ account
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* NAME SECTION */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Firstname <span className="text-[#FFB800]">*</span>
            </label>
            <Input
              placeholder="John"
              variant="flat"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              startContent={<IdCard size={16} className="text-[#FFB800]" />}
              classNames={inputStyles}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Lastname <span className="text-[#FFB800]">*</span>
            </label>
            <Input
              placeholder="Doe"
              variant="flat"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              classNames={inputStyles}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            Email Address <span className="text-[#FFB800]">*</span>
          </label>
          <Input
            type="email"
            placeholder="example@tmoj.com"
            variant="flat"
            required
            startContent={<Mail size={16} className="text-[#FFB800]" />}
            classNames={inputStyles}
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-1 relative">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase text-slate-400">
              Password <span className="text-[#FFB800]">*</span>
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
                {PasswordRequirements}
              </PopoverContent>
            </Popover>
          </div>
          <PasswordInput value={password} onChange={setPassword} required />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            Confirm Password <span className="text-[#FFB800]">*</span>
          </label>
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            placeholder="Confirm your password"
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          endContent={!isLoading && <ArrowRight size={18} />}
          className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-[1000] rounded-2xl h-14 mt-4 shadow-xl uppercase tracking-widest text-sm transition-all hover:-translate-y-1 active:scale-95"
        >
          Sign up now
        </Button>
      </form>

      {/* SOCIAL LOGIN */}
      <div className="flex flex-col gap-4 mt-2">
        <Divider className="dark:bg-[#474F5D] opacity-30" />
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="bordered"
            isIconOnly
            className="w-11 h-11 rounded-full border-gray-200 dark:border-[#474F5D]"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
          </Button>
          <Button
            variant="bordered"
            isIconOnly
            className="w-11 h-11 rounded-full border-gray-200 dark:border-[#474F5D]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#333] dark:text-white"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Button>
        </div>
        <p className="text-center text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">
          Already a member?{" "}
          <span
            className="text-[#3F4755] dark:text-[#FFB800] cursor-pointer hover:underline"
            onClick={() => openModal({ content: <LoginModal /> })}
          >
            Sign In
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

const inputStyles = {
  inputWrapper:
    "bg-gray-100 dark:bg-[#333A45] border border-transparent dark:border-[#474F5D] focus-within:!border-[#FFB800] h-12 rounded-2xl transition-all",
  input:
    "text-[#3F4755] dark:text-white placeholder:text-gray-500 font-bold ml-2 text-sm",
};
