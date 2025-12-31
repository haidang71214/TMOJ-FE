"use client";
import React from "react";
import {
  Input,
  Button,
  RadioGroup,
  Radio,
  Switch,
  Textarea,
} from "@heroui/react";
import {
  ArrowLeft,
  X,
  Trophy,
  Lock,
  CalendarDays,
  Heading1,
  Bold,
  Italic,
  List,
  Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateContestPage() {
  const router = useRouter();

  const EditorToolbar = () => (
    <div className="bg-gray-100/50 dark:bg-[#333A45] p-2 border-b dark:border-[#474F5D] flex gap-1">
      <Button isIconOnly size="sm" variant="light" className="dark:text-white">
        <Heading1 size={16} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="dark:text-white font-bold"
      >
        <Bold size={16} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="dark:text-white italic"
      >
        <Italic size={16} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="dark:text-white underline"
      >
        <List size={16} />
      </Button>
      <Button isIconOnly size="sm" variant="light" className="dark:text-white">
        <Link2 size={16} />
      </Button>
    </div>
  );

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="light"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft size={24} className="dark:text-white" />
        </Button>
        <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic leading-none">
          New Contest<span className="text-[#FFB800]">.</span>
        </h2>
      </div>

      <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 border border-transparent dark:border-[#474F5D]/30">
        {/* CONTEST TITLE */}
        <Input
          label="Contest Title"
          placeholder="e.g. TMOJ Spring Contest 2025"
          labelPlacement="outside"
          variant="flat"
          classNames={{
            mainWrapper: "mt-6",
            inputWrapper:
              "rounded-2xl dark:bg-[#333A45] h-14 border-2 border-transparent focus-within:!border-[#FFB800]",
            label:
              "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
          }}
        />

        {/* DESCRIPTION */}
        <div className="space-y-3">
          <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-2">
            Description
          </label>
          <div className="rounded-2xl border-2 border-gray-100 dark:border-[#474F5D] overflow-hidden focus-within:border-[#FFB800] bg-gray-50/50 dark:bg-[#333A45]/30">
            <EditorToolbar />
            <Textarea
              placeholder="Contest rules and details..."
              variant="flat"
              minRows={6}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-4",
                input: "dark:text-white font-medium",
              }}
            />
          </div>
        </div>

        {/* TIME & PASSWORD - FIXED OVERLAP HERE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Input
            label="Start Time"
            type="datetime-local"
            labelPlacement="outside"
            placeholder=" "
            startContent={
              <CalendarDays size={16} className="text-gray-400 shrink-0" />
            }
            classNames={{
              mainWrapper: "mt-8", // Tăng khoảng cách phía trên
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
              input: "pt-1", // Đẩy text xuống 1 chút
            }}
          />
          <Input
            label="End Time"
            type="datetime-local"
            labelPlacement="outside"
            placeholder=" "
            startContent={
              <CalendarDays size={16} className="text-gray-400 shrink-0" />
            }
            classNames={{
              mainWrapper: "mt-8",
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
              input: "pt-1",
            }}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Optional"
            labelPlacement="outside"
            startContent={<Lock size={16} className="text-gray-400 shrink-0" />}
            classNames={{
              mainWrapper: "mt-8",
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            }}
          />
        </div>

        {/* RULES & STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50 dark:bg-[#333A45]/50 rounded-[2.5rem] border border-gray-100 dark:border-[#474F5D]/30">
          <RadioGroup
            label="Rule Type"
            orientation="horizontal"
            defaultValue="acm"
            classNames={{
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-4 ml-1",
            }}
          >
            <div className="flex gap-6">
              <Radio
                value="acm"
                classNames={{ label: "text-xs font-bold dark:text-white" }}
              >
                ACM
              </Radio>
              <Radio
                value="oi"
                classNames={{ label: "text-xs font-bold dark:text-white" }}
              >
                OI
              </Radio>
            </div>
          </RadioGroup>
          <div className="flex flex-col gap-3">
            <span className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 leading-none">
              Real Time Rank
            </span>
            <Switch color="warning" defaultSelected size="lg" />
          </div>
          <div className="flex flex-col gap-3">
            <span className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 leading-none">
              Public Visible
            </span>
            <Switch color="success" defaultSelected size="lg" />
          </div>
        </div>

        {/* IP RANGES */}
        <Textarea
          label="Allowed IP Ranges"
          placeholder="e.g. 192.168.1.1/24 (One per line)"
          labelPlacement="outside"
          classNames={{
            mainWrapper: "mt-6",
            inputWrapper: "rounded-2xl dark:bg-[#333A45] p-4",
            label:
              "dark:text-white font-black uppercase text-[10px] tracking-widest mb-2 ml-1",
          }}
        />

        {/* FOOTER */}
        <div className="flex justify-between items-center pt-8 border-t dark:border-[#474F5D]/30">
          <Button
            variant="flat"
            startContent={<X size={18} />}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-10 h-12 dark:bg-[#333A45] dark:text-gray-400"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            startContent={<Trophy size={20} />}
            className="bg-[#17c964] text-white font-black rounded-2xl h-14 px-20 uppercase tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all"
          >
            Launch Contest
          </Button>
        </div>
      </div>
    </div>
  );
}
