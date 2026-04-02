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
import { useRegisterMutation } from "@/store/queries/auth";
import { ErrorForm } from "@/types";

export default function RegisterModal() {
  const { closeModal, openModal } = useModal();
  const [register, { isLoading }] = useRegisterMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Password Validation
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
  addToast({
    title: "Password is too weak!",
    description:
      "Must contain at least 10 characters, uppercase, lowercase, number and special character.",
    color: "danger",
  });
  return;
}

    if (password !== confirmPassword) {
      addToast({ title: "Passwords do not match!", color: "danger" });
      return;
    }

    try {
    const res =   await register({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();
      console.log("res",res);
      
      addToast({
        title: "Account created successfully, please check your email for the verification code!",
        color: "success",
      });

      // Move to email verification step instead of closing
      setStep(2);
    } catch (error: unknown) {
      console.log(error);
      
      const err = error as ErrorForm;

      addToast({
        title: err?.data?.data?.message || "Register failed!",
        color: "danger",
      });
    }
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      addToast({
        title: "Please enter the 6-digit verification code.",
        color: "danger",
      });
      return;
    }

    addToast({
      title: "Email verified successfully!",
      color: "success",
    });
    closeModal();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow 1 char
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const PasswordRequirements = (
    <div className="px-4 py-3 w-64 bg-white dark:bg-[#333A45]">
      <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
        Security Checklist
      </p>
      <div className="flex flex-col gap-2">
        <RequirementItem met={validation.length} label="At least 10 characters" />
        <RequirementItem met={validation.upper} label="Uppercase letter" />
        <RequirementItem met={validation.lower} label="Lowercase letter" />
        <RequirementItem met={validation.number} label="At least one number" />
        <RequirementItem met={validation.special} label="Special character (!@#...)" />
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col gap-5 py-10 px-8 bg-white dark:bg-[#282E3A] rounded-[2.5rem] shadow-2xl max-w-[480px] w-full">
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-gray-400 hover:text-[#FFB800]"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-1 items-center text-center mt-2 mb-6">
        <h2 className="text-4xl font-[1000] text-[#3F4755] dark:text-white uppercase italic">
          {step === 1 ? (
            <>Sign up<span className="text-[#FFB800]">.</span></>
          ) : (
            <>Verify<span className="text-[#FFB800]">.</span></>
          )}
        </h2>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">
          {step === 1 ? "Create your TMOJ account" : `Enter the verification code sent to ${email || "your email"}`}
        </p>
      </div>

      {step === 1 ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              variant="flat"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              startContent={<IdCard size={16} className="text-[#FFB800]" />}
              classNames={inputStyles}
            />
            <Input
              placeholder="Last name"
              variant="flat"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              classNames={inputStyles}
            />
          </div>

          <Input
            type="email"
            placeholder="example@tmoj.com"
            variant="flat"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startContent={<Mail size={16} className="text-[#FFB800]" />}
            classNames={inputStyles}
          />

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Password
              </label>
              <Popover placement="right" showArrow>
                <PopoverTrigger>
                  <button type="button">
                    <Info size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent>{PasswordRequirements}</PopoverContent>
              </Popover>
            </div>
            <PasswordInput value={password} onChange={setPassword} required />
          </div>

          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            placeholder="Confirm password"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            endContent={!isLoading && <ArrowRight size={18} />}
            className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-[1000] rounded-2xl h-14 mt-4 uppercase"
          >
            Sign up now
          </Button>
        </form>
      ) : (
        <form className="flex flex-col gap-6" onSubmit={handleVerifyEmail}>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                required
                classNames={{
                  inputWrapper: "w-12 h-14 bg-gray-100 dark:bg-[#333A45] rounded-xl flex justify-center border border-transparent dark:border-[#474F5D] focus-within:!border-[#FFB800]",
                  input: "text-center text-xl font-black text-[#3F4755] dark:text-white",
                }}
              />
            ))}
          </div>
          
          <Button
            type="submit"
            endContent={<Check size={18} />}
            className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-[1000] rounded-2xl h-14 uppercase"
          >
            Verify Email
          </Button>
          
          <p className="text-center text-[10px] font-bold text-gray-400 cursor-pointer hover:text-[#FFB800] mt-[-10px]">
            Didn't receive the code? Resend
          </p>
        </form>
      )}

      <Divider className="my-4" />

      <p className="text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
        Already a member?{" "}
        <span
          className="text-[#3F4755] dark:text-[#FFB800] cursor-pointer hover:underline"
          onClick={() => openModal({ content: <LoginModal /> })}
        >
          Sign In
        </span>
      </p>
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 ${met ? "text-emerald-500" : "text-slate-500"}`}>
      {met ? <Check size={12} strokeWidth={4} /> : <AlertCircle size={12} />}
      <span className={`text-[11px] font-bold ${met ? "line-through opacity-50" : ""}`}>
        {label}
      </span>
    </div>
  );
}

const inputStyles = {
  inputWrapper:
    "bg-gray-100 dark:bg-[#333A45] border border-transparent dark:border-[#474F5D] focus-within:!border-[#FFB800] h-12 rounded-2xl",
  input:
    "text-[#3F4755] dark:text-white placeholder:text-gray-500 font-bold ml-2 text-sm",
};