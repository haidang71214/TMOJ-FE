"use client";

import { useState } from "react";
import { useLoginMutation } from "@/store/queries/auth";
import { addToast } from "@heroui/toast";
import { Shield, Mail, Eye, EyeOff, ArrowRight, Lock } from "lucide-react";
import { ErrorForm, Users } from "@/types";

interface AdminLoginPageProps {
  onLoginSuccess?: (user: Users) => void;
}

export default function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      if (res) {
        const user = res?.data?.user;
        if (user?.role !== "admin") {
          addToast({ title: "Access denied. Admin only.", color: "danger" });
          return;
        }
        addToast({ title: "Welcome back, Admin!", color: "success" });
        if (onLoginSuccess) {
          onLoginSuccess(user);
        } else {
          window.location.reload();
        }
      }
    } catch (err: unknown) {
      const error = err as ErrorForm;
      addToast({
        title: error?.data?.data?.message ?? "Login failed. Please check your credentials.",
        color: "danger",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060C18] relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#3B5BFF] opacity-[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#9B3BFF] opacity-[0.07] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Card */}
        <div
          className="rounded-3xl p-10 border border-white/[0.06] shadow-2xl"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Logo / Badge */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #3B5BFF 0%, #9B3BFF 100%)",
                boxShadow: "0 8px 32px rgba(59,91,255,0.35)",
              }}
            >
              <Shield size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              TMOJ <span className="text-[#3B5BFF]">Admin</span>
            </h1>
            <p className="text-xs text-white/30 font-medium mt-1 uppercase tracking-widest">
              Restricted Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
              <input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#3B5BFF]/60 focus:bg-white/[0.07] transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#3B5BFF]/60 focus:bg-white/[0.07] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: isLoading
                  ? "rgba(59,91,255,0.5)"
                  : "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)",
                boxShadow: isLoading ? "none" : "0 6px 24px rgba(59,91,255,0.4)",
              }}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[11px] text-white/20 mt-8 font-medium">
            This portal is for authorized administrators only.
          </p>
        </div>

        <p className="text-center text-[11px] text-white/15 mt-6 font-medium uppercase tracking-widest">
          TMOJ — Online Judge Platform
        </p>
      </div>
    </div>
  );
}
