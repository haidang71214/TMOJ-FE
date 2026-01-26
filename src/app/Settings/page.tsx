"use client";
import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Edit3, User, Briefcase, Code2 } from "lucide-react";

export default function SettingsPage() {
  const basicInfo = [
    ["Name", "Đăng Hải"],
    ["Gender", "Not provided"],
    ["Location", "Your location"],
    ["Birthday", "Your birthday"],
    ["Summary", "Tell us about yourself"],
    ["Website", "Your blog, portfolio, etc."],
    ["Github", "Your Github username or url"],
    ["LinkedIn", "Your Linkedin username or url"],
    ["X (Twitter)", "Your X username or url"],
  ];

  const experienceInfo = ["Work", "Education"];

  return (
    <div className="flex flex-col gap-8 pb-10 p-2">
      {/* HEADER PAGE */}
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
          PROFILE <span className="text-[#FF5C00]">SETTINGS</span>
        </h1>
        <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] italic">
          Manage your profile and public information
        </p>
      </div>

      {/* BASIC INFO SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <User size={20} className="text-[#FF5C00]" />
          <h2 className="text-xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white">
            Basic Info
          </h2>
        </div>
        <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] shadow-sm overflow-hidden">
          <CardBody className="p-0 divide-y divide-slate-100 dark:divide-white/5">
            {basicInfo.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between py-5 px-8 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-[10px] font-[1000] uppercase italic text-slate-400 tracking-widest w-40">
                  {label}
                </span>
                <span className="text-sm font-bold flex-1 text-[#071739] dark:text-slate-300 italic group-hover:text-[#FF5C00] transition-colors">
                  {value}
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Edit3 size={14} />}
                  className="font-black uppercase text-[9px] tracking-widest bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#00FF41] hover:text-[#071739] transition-all"
                >
                  Edit
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <Briefcase size={20} className="text-[#FF5C00]" />
          <h2 className="text-xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white">
            Experience
          </h2>
        </div>
        <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] shadow-sm overflow-hidden">
          <CardBody className="p-0 divide-y divide-slate-100 dark:divide-white/5">
            {experienceInfo.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-6 px-8 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-[10px] font-[1000] uppercase italic text-slate-400 tracking-widest w-40">
                  {item}
                </span>
                <span className="text-sm font-bold flex-1 text-slate-400 italic">
                  Add a {item.toLowerCase()}...
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  className="font-black uppercase text-[9px] tracking-widest bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#00FF41] hover:text-[#071739] transition-all"
                >
                  Add
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      {/* SKILLS SECTION */}
      <section className="space-y-4 pb-10">
        <div className="flex items-center gap-3 px-2">
          <Code2 size={20} className="text-[#FF5C00]" />
          <h2 className="text-xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white">
            Skills
          </h2>
        </div>
        <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] shadow-sm">
          <CardBody className="py-6 px-8 flex flex-row items-center justify-between">
            <span className="text-[10px] font-[1000] uppercase italic text-slate-400 tracking-widest w-40">
              Technical Skills
            </span>
            <span className="text-sm font-bold flex-1 text-slate-400 italic">
              Share your expertise...
            </span>
            <Button
              size="sm"
              variant="flat"
              className="font-black uppercase text-[9px] tracking-widest bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#00FF41] hover:text-[#071739] transition-all"
            >
              Edit
            </Button>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
