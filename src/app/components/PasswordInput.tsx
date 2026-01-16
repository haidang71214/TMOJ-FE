"use client";

import { useState } from "react";
import { Input } from "@heroui/react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  required = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <Input
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      startContent={
        <Lock
          size={18}
          className="text-[#3F4755] dark:text-[#FFB800]"
        />
      }
      endContent={
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="
            w-8 h-8 flex items-center justify-center rounded-full
            transition-all duration-200
            hover:bg-black/5 dark:hover:bg-white/10
            active:scale-90
          "
        >
          {show ? (
            <EyeOff size={18} className="text-[#3F4755] dark:text-[#FFB800]" />
          ) : (
            <Eye size={18} className="text-[#3F4755] dark:text-[#FFB800]" />
          )}
        </button>
      }
      classNames={{
        inputWrapper:
          "bg-gray-100 dark:bg-[#333A45] border border-transparent dark:border-[#474F5D] focus-within:!border-[#FFB800] h-12 rounded-2xl transition-all",
        input:
          "font-bold ml-2 text-sm text-[#3F4755] dark:text-white placeholder:text-gray-500",
      }}
    />
  );
}
