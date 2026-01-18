"use client";

import React, { useState } from "react";
import { Button, addToast, Divider, Input } from "@heroui/react";
import { useModal } from "../../Provider/ModalProvider";
import {  MoreHorizontal, ArrowRight, X } from "lucide-react";
import RegisterModal from "./RegisterModal";
// chỗ này cho nó trả về url rồi mới mở nha, nay demo thì click mở cũng được <3
// theo a nghĩ là có chỗ lưu url với phải check trong db xem có trùng không thì mới cho mở, còn không thì không cho
export default function ResetPassModal({ }: { token: string }) {
  const { closeModal, openModal } = useModal();
  const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
     const [isLoading, setIsLoading] = useState(false);
   const isPasswordMatch = () => {
   return password === confirmPassword;
   };
   const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
//  chỗ này nếu api trả lỗi thì báo không cho mở modal 
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({ title: "Account created!", color: "success" });
      closeModal();
    }, 1500);
   if (!isPasswordMatch()) {
      addToast({
         title: "Passwords do not match",
         color: "danger",
      });
      return;
   }

   try {
      // gọi API reset password ở đây
      addToast({ title: "Password reset successfully", color: "success" });
      closeModal();
   } catch {
      addToast({ title: "Reset password failed", color: "danger" });
   }
   };


  return (
    <div className="relative flex flex-col gap-5 py-10 px-8 bg-white dark:bg-[#282E3A] transition-colors duration-500 rounded-[2.5rem] shadow-2xl max-w-[420px] w-full border-none outline-none">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="flex flex-col gap-1 items-center justify-center text-center mt-2 mb-8">
        <h2 className="text-4xl font-black text-[#3F4755] dark:text-white tracking-tighter uppercase leading-none">
          Sign in<span className="text-[#3F4755] dark:text-[#FFB800]">.</span>
        </h2>
        <p className="text-[12px] font-bold text-gray-400 dark:text-[#E3C39D] tracking-wide mt-2 uppercase">
          Welcome to TMOJ
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
               <div className="flex flex-col gap-4">
         {/* New password */}
         <Input
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
         />

         {/* Confirm password */}
         <Input
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
            isInvalid={confirmPassword.length > 0 && !isPasswordMatch()}
            errorMessage={
               confirmPassword.length > 0 && !isPasswordMatch()
               ? "Passwords do not match"
               : ""
            }
         />
         </div>


        <Button
          type="submit"
          isLoading={isLoading}
          endContent={!isLoading && <ArrowRight size={18} />}
          className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-black rounded-2xl h-14 mt-4 shadow-lg dark:shadow-[0_8px_20px_rgba(255,184,0,0.3)] uppercase tracking-widest text-sm transition-transform active:scale-95"
        >
           reset password
        </Button>
      </form>

      {/* Social Login */}
      <div className="flex flex-col gap-4 mt-2">
        <Divider className="dark:bg-[#474F5D] opacity-50" />
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="bordered"
            isIconOnly
            className="w-11 h-11 rounded-full border-gray-200 dark:border-[#474F5D] transition-all"
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
            className="w-11 h-11 rounded-full border-gray-200 dark:border-[#474F5D] transition-all"
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
          <Button
            variant="bordered"
            isIconOnly
            className="w-11 h-11 rounded-full border-gray-200 dark:border-[#474F5D] transition-all"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Button>
          <Button
            variant="light"
            isIconOnly
            className="w-11 h-11 rounded-full text-gray-400"
          >
            <MoreHorizontal size={20} />
          </Button>
        </div>
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
