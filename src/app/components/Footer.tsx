"use client";
import { Divider } from "@heroui/react";
import { Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full py-8 px-8 border-t border-[#A4B5C4]/30 dark:border-[#1C2737] bg-white dark:bg-[#101828] mt-auto transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Giảm gap và padding để footer ngắn lại */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-black italic text-[#071739] dark:text-white">
              TMOJ.
            </h2>
            <p className="text-xs text-[#4B6382] dark:text-[#98A2B3] leading-relaxed max-w-[200px]">
              The ultimate platform for coding practice and community growth.
            </p>
          </div>

          {[
            {
              title: "Platform",
              links: ["Library", "Quests", "Discuss"],
            },
            {
              title: "Resources",
              links: ["Editorial", "Tutorials"],
            },
            { title: "Legal", links: ["Privacy", "Terms"] },
          ].map((col, i) => (
            <div key={i} className="flex flex-col gap-3">
              <h4 className="font-bold text-[#071739] dark:text-[#E3C39D] uppercase text-[9px] tracking-[0.2em]">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-1.5">
                {col.links.map((link) => (
                  <li
                    key={link}
                    className="text-[13px] text-[#4B6382] dark:text-[#98A2B3] hover:text-[#A68868] dark:hover:text-[#E3C39D] cursor-pointer transition-colors font-medium"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="my-6 bg-[#A4B5C4]/20 dark:bg-[#1C2737]" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#A4B5C4] dark:text-[#667085] text-[10px] font-bold uppercase tracking-widest">
          <span>© 2026 TMOJ Online Judge. </span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#071739] dark:text-[#CDD5DB]">
              <Globe size={12} />
              <span>English (US)</span>
            </div>
            <span className="cursor-pointer hover:text-[#A68868] dark:hover:text-white transition-colors">
              Github
            </span>
            <span className="cursor-pointer hover:text-[#A68868] dark:hover:text-white transition-colors">
              Discord
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
