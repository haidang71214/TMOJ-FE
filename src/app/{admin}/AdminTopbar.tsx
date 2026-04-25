"use client";

import { LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import webStorageClient from "@/utils/webStorageClient";
import { useLogoutMutation } from "@/store/queries/auth";
import { baseApi } from "@/store/base";
import { addToast } from "@heroui/toast";

interface AdminTopbarProps {
  username?: string;
  email?: string;
  avatarUrl?: string | null;
  role?: string;
  onLogout?: () => void; // callback để RedirectProvider reset về màn login
}

export default function AdminTopbar({ username, email, avatarUrl, role, onLogout }: AdminTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const initials = username
    ? username
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout().unwrap();
    } catch {
      // Dù API lỗi vẫn clear hết
    } finally {
      dispatch(baseApi.util.resetApiState());
      webStorageClient.logout();
      addToast({ title: "Signed out successfully", color: "success" });
      setDropdownOpen(false);
      setIsLoggingOut(false);
      // Về màn login admin thay vì redirect ra ngoài
      onLogout?.();
    }
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06]"
      style={{
        background: "linear-gradient(90deg, #060C18 0%, #0D1525 100%)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span
          className="text-sm font-black tracking-widest uppercase"
          style={{
            background: "linear-gradient(90deg, #3B5BFF, #9B3BFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TMOJ
        </span>
        <span className="text-white/15 text-xs">|</span>
        <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">
          Admin Panel
        </span>
      </div>

      {/* Right — user info */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors"
        >
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#3B5BFF]/40"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #3B5BFF 0%, #9B3BFF 100%)",
                }}
              >
                {initials}
              </div>
            )}
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#060C18]" />
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-white text-xs font-bold leading-none mb-0.5">
              {username ?? "Admin"}
            </p>
            <p className="text-white/35 text-[10px] font-medium leading-none">
              {role ? role.toUpperCase() : "ADMINISTRATOR"}
            </p>
          </div>

          <ChevronDown
            size={14}
            className={`text-white/30 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div
            className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl border border-white/[0.07] overflow-hidden z-50 shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #0D1525 0%, #060C18 100%)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* User info */}
            <div className="px-4 py-4 border-b border-white/[0.06]">
              <p className="text-white text-sm font-bold truncate">{username ?? "Admin"}</p>
              <p className="text-white/35 text-xs truncate mt-0.5">{email ?? ""}</p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoggingOut ? (
                <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <LogOut size={15} />
              )}
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        )}
      </div>

      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
}
