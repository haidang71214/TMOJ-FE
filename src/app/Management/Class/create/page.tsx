"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import {
  ArrowLeft,
  UploadCloud,
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  Users,
  Info,
  Rocket,
} from "lucide-react";
import Link from "next/link";

export default function CreateClassPage() {
  const [copied, setCopied] = useState(false);
  const [inviteCode] = useState(
    "TMOJ-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://tmoj.edu.vn/join/${inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-8 p-2 max-w-5xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/Management/Class">
          <Button
            isIconOnly
            variant="flat"
            className="rounded-xl bg-white dark:bg-[#111827]"
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
          CREATE NEW <span className="text-[#FF5C00]">CLASS</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto pr-2 custom-scrollbar pb-10">
        {/* LEFT COLUMN: FORM DỮ LIỆU */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] p-4 shadow-sm">
            <CardBody className="gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Info size={20} />
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tight text-[#071739] dark:text-white">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Class ID (e.g. SDN302)"
                  placeholder="Enter subject code"
                  labelPlacement="outside"
                  variant="bordered"
                  classNames={{
                    label:
                      "font-black uppercase text-[10px] tracking-widest text-slate-500 italic",
                    inputWrapper:
                      "h-12 rounded-xl border-slate-200 dark:border-white/10",
                  }}
                />
                <Select
                  label="Semester"
                  placeholder="Select semester"
                  labelPlacement="outside"
                  variant="bordered"
                  classNames={{
                    label:
                      "font-black uppercase text-[10px] tracking-widest text-slate-500 italic",
                    trigger:
                      "h-12 rounded-xl border-slate-200 dark:border-white/10",
                  }}
                >
                  <SelectItem key="f25">FALL 2025</SelectItem>
                  <SelectItem key="s26">SPRING 2026</SelectItem>
                  <SelectItem key="su26">SUMMER 2026</SelectItem>
                </Select>
                <div className="md:col-span-2">
                  <Input
                    label="Class Name"
                    placeholder="e.g. Server-Side development with NodeJS"
                    labelPlacement="outside"
                    variant="bordered"
                    classNames={{
                      label:
                        "font-black uppercase text-[10px] tracking-widest text-slate-500 italic",
                      inputWrapper:
                        "h-12 rounded-xl border-slate-200 dark:border-white/10",
                    }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* IMPORT FILE SECTION */}
          <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] p-4 shadow-sm">
            <CardBody className="gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Users size={20} />
                  </div>
                  <h2 className="text-xl font-black italic uppercase tracking-tight text-[#071739] dark:text-white">
                    Students List
                  </h2>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  className="font-bold text-blue-500 text-[10px] uppercase italic"
                >
                  Download Template
                </Button>
              </div>

              <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 group hover:border-[#FF5C00] transition-colors cursor-pointer bg-slate-50/50 dark:bg-black/20">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1e293b] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-[#FF5C00]" size={32} />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase text-sm italic tracking-tight dark:text-white">
                    Click or Drag to Upload
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Support Excel, CSV (Max 5MB)
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN: SHARE LINK & ACTION */}
        <div className="space-y-6">
          <Card className="bg-[#071739] dark:bg-[#1C2737] border-none rounded-[2.5rem] p-4 shadow-xl text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF5C00] rounded-full blur-[80px] opacity-20" />

            <CardBody className="gap-6 relative z-10">
              <div className="flex items-center gap-3">
                <LinkIcon size={20} className="text-[#FF5C00]" />
                <h2 className="text-xl font-black italic uppercase tracking-tight">
                  Invite Link
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Invite Code
                  </p>
                  <p className="text-2xl font-black tracking-tighter text-[#FF5C00] italic">
                    {inviteCode}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-2 pr-4 rounded-2xl border border-white/10">
                  <div className="flex-1 px-2 truncate text-xs font-bold text-slate-300 italic">
                    tmoj.edu.vn/join/{inviteCode}
                  </div>
                  <Tooltip content={copied ? "Copied!" : "Copy link"}>
                    <Button
                      isIconOnly
                      size="sm"
                      onPress={handleCopy}
                      className="bg-[#FF5C00] text-white rounded-xl min-w-8 h-8"
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed italic">
                Share this code or link with your students. They can enter it in
                the Join Class section.
              </p>
            </CardBody>
          </Card>

          <Button
            className="w-full bg-[#FF5C00] text-[#071739] font-[1000] h-16 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(255,92,0,0.3)] uppercase tracking-widest text-sm italic group hover:bg-[#22C55E] transition-all hover:scale-[1.02]"
            endContent={
              <Rocket
                size={20}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            }
          >
            Launch Class
          </Button>

          <div className="p-6 rounded-[2rem] border-2 border-slate-200 dark:border-white/5 border-dashed flex flex-col gap-3">
            <p className="text-[11px] font-black uppercase italic tracking-tighter text-slate-500">
              Quick Tip:
            </p>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
              You can add more students later from the class settings dashboard
              after launching.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
