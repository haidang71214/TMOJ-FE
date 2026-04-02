"use client";
import React from "react";
import { Lock } from "lucide-react";

export default function EditorialTab() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-10 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <Lock size={28} className="text-amber-400" />
      </div>
      <div>
        <h2 className="font-black text-[16px] text-[#262626] dark:text-[#F9FAFB] mb-1">
          Editorial
        </h2>
        <p className="text-[13px] text-gray-400 dark:text-[#475569] max-w-xs leading-relaxed">
          The editorial for this problem is not available yet. Check back later
          or explore community solutions.
        </p>
      </div>
      <button className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-[13px] font-black transition-colors shadow-lg shadow-amber-500/20">
        View Solutions Instead
      </button>
    </div>
  );
};
