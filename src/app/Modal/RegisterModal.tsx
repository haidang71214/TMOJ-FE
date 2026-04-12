"use client";

import { useTranslation } from "@/hooks/useTranslation";
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
  const { t, language } = useTranslation();

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
        title: language === 'vi' ? "Mật khẩu quá yếu!" : "Password is too weak!",
        description: language === 'vi' ? "Phải chứa ít nhất 10 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt." : "Must contain at least 10 characters, uppercase, lowercase, number and special character.",
        color: "danger",
      });
      return;
    }

    if (password !== confirmPassword) {
      addToast({ title: language === 'vi' ? "Mật khẩu không khớp!" : "Passwords do not match!", color: "danger" });
      return;
    }

    try {
      const res = await register({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();
      console.log("res", res);
      
      addToast({
        title: language === 'vi' ? "Tạo tài khoản thành công!" : "Account created successfully!",
        color: "success",
      });

      closeModal();
    } catch (error: unknown) {
      console.log(error);
      
      const err = error as ErrorForm;

      addToast({
        title: err?.data?.data?.message || (language === 'vi' ? "Đăng ký thất bại!" : "Register failed!"),
        color: "danger",
      });
    }
  };

  const PasswordRequirements = (
    <div className="px-4 py-3 w-64 bg-white dark:bg-[#333A45]">
      <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
        {language === 'vi' ? "YÊU CẦU BẢO MẬT" : "Security Checklist"}
      </p>
      <div className="flex flex-col gap-2">
        <RequirementItem met={validation.length} label={language === 'vi' ? "Ít nhất 10 ký tự" : "At least 10 characters"} />
        <RequirementItem met={validation.upper} label={language === 'vi' ? "Có chữ hoa" : "Uppercase letter"} />
        <RequirementItem met={validation.lower} label={language === 'vi' ? "Có chữ thường" : "Lowercase letter"} />
        <RequirementItem met={validation.number} label={language === 'vi' ? "Có ít nhất 1 số" : "At least one number"} />
        <RequirementItem met={validation.special} label={language === 'vi' ? "Ký tự đặc biệt (!@#...)" : "Special character (!@#...)"} />
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col gap-5 py-10 px-8 bg-white dark:bg-[#282E3A] rounded-[2.5rem] shadow-2xl max-w-[480px] w-full opacity-0 animate-fade-in-up">
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-gray-400 hover:text-[#FFB800]"
      >
        <X size={20} />
      </button>

      <div 
        className="flex flex-col gap-1 items-center text-center mt-2 mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "100ms", animationFillMode: "both" }}
      >
        <h2 className="text-4xl font-[1000] text-[#3F4755] dark:text-white uppercase italic">
          {language === 'vi' ? "Đăng ký" : "Sign up"}<span className="text-[#FFB800]">.</span>
        </h2>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">
          {language === 'vi' ? "TẠO TÀI KHOẢN TMOJ CỦA BẠN" : "Create your TMOJ account"}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div 
          className="grid grid-cols-2 gap-3 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          <Input
            placeholder={language === 'vi' ? "Tên (First name)" : "First name"}
            variant="flat"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            startContent={<IdCard size={16} className="text-[#FFB800]" />}
            classNames={inputStyles}
          />
          <Input
            placeholder={language === 'vi' ? "Họ (Last name)" : "Last name"}
            variant="flat"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            classNames={inputStyles}
          />
        </div>

        <Input
          type="email"
          placeholder={language === 'vi' ? "Nhập địa chỉ email..." : "example@tmoj.com"}
          variant="flat"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startContent={<Mail size={16} className="text-[#FFB800]" />}
          classNames={inputStyles}
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        />

        <div 
          className="relative opacity-0 animate-fade-in-up"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-black uppercase text-slate-400">
              {language === 'vi' ? "Mật khẩu" : "Password"}
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

        <div
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            placeholder={language === 'vi' ? "Xác nhận mật khẩu" : "Confirm password"}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          endContent={!isLoading && <ArrowRight size={18} />}
          className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-[1000] rounded-2xl h-14 mt-4 uppercase active-bump opacity-0 animate-fade-in-up"
          style={{ animationDelay: "600ms", animationFillMode: "both" }}
        >
          {language === 'vi' ? "Đăng ký ngay" : "Sign up now"}
        </Button>
      </form>

      <div 
        className="opacity-0 animate-fade-in-up flex flex-col items-center w-full"
        style={{ animationDelay: "700ms", animationFillMode: "both" }}
      >
        <Divider className="my-4 w-full" />

        <p className="text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
          {language === 'vi' ? "Đã là thành viên?" : "Already a member?"}{" "}
          <span
            className="text-[#3F4755] dark:text-[#FFB800] cursor-pointer hover:underline font-black transition-colors"
            onClick={() => openModal({ content: <LoginModal /> })}
          >
            {language === 'vi' ? "Đăng Nhập" : "Sign In"}
          </span>
        </p>
      </div>
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