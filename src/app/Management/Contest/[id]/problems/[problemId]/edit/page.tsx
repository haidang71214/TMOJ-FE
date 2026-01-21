"use client";
import React from "react";
import {
  Input,
  Button,
  Switch,
  Textarea,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Divider,
  Tooltip,
} from "@heroui/react";
import {
  Save,
  FileUp,
  X,
  Bold,
  Italic,
  Underline,
  List,
  FileCode,
  PlusSquare,
  ChevronLeft,
  Heading1,
  Link2,
  Plus,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProblemEditForm() {
  const router = useRouter();

  const EditorToolbar = () => (
    <div className="bg-slate-50 dark:bg-black/20 p-2 border-b border-slate-200 dark:border-white/10 flex gap-1 flex-wrap">
      {[Heading1, Bold, Italic, Underline, List, Link2].map((Icon, i) => (
        <Button
          key={i}
          isIconOnly
          size="sm"
          variant="light"
          className="text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E]"
        >
          <Icon size={16} />
        </Button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <Button
          variant="light"
          onPress={() => router.back()}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          Back to Problems
        </Button>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
          EDIT <span className="text-[#FF5C00]">PROBLEM</span>
        </h1>
      </div>

      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10">
        {/* PROBLEM TITLE */}
        <Input
          label="Problem Title"
          placeholder="Enter problem title..."
          labelPlacement="outside"
          classNames={{
            inputWrapper:
              "rounded-2xl dark:bg-black/20 h-14 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
            label:
              "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            input: "font-bold italic uppercase text-lg",
          }}
        />

        {/* DESCRIPTION */}
        <div className="space-y-3 group">
          <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
            Description
          </label>
          <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10">
            <EditorToolbar />
            <Textarea
              placeholder="Detailed problem statement..."
              variant="flat"
              minRows={5}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-4",
                input: "font-medium",
              }}
            />
          </div>
        </div>

        {/* INPUT & OUTPUT FORMAT (CÙNG MỘT DÒNG) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 group">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
              Input Format
            </label>
            <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10">
              <EditorToolbar />
              <Textarea
                placeholder="Describe input data..."
                variant="flat"
                minRows={3}
                classNames={{ inputWrapper: "bg-transparent shadow-none p-4" }}
              />
            </div>
          </div>
          <div className="space-y-3 group">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
              Output Format
            </label>
            <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10">
              <EditorToolbar />
              <Textarea
                placeholder="Describe expected output..."
                variant="flat"
                minRows={3}
                classNames={{ inputWrapper: "bg-transparent shadow-none p-4" }}
              />
            </div>
          </div>
        </div>

        {/* SAMPLES MANAGEMENT (KHÔI PHỤC) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Sample Case #1
            </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="danger"
                startContent={<Trash2 size={14} />}
                className="font-bold rounded-xl px-4"
              >
                Remove
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="warning"
                startContent={<PlusCircle size={14} />}
                className="font-bold rounded-xl px-4"
              >
                Add Sample
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-slate-50/50 dark:bg-[#071739]/30 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <Textarea
              label="Sample Input"
              variant="flat"
              labelPlacement="outside"
              placeholder="Input test data..."
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl",
                label: "font-bold text-[10px] uppercase mb-2",
              }}
            />
            <Textarea
              label="Sample Output"
              variant="flat"
              labelPlacement="outside"
              placeholder="Expected output data..."
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl",
                label: "font-bold text-[10px] uppercase mb-2",
              }}
            />
          </div>
        </div>

        {/* CODE TEMPLATE - DARK STUDIO */}
        <div className="space-y-3 group">
          <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
            Code Template
          </label>
          <div className="rounded-[2rem] border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-[#121212] shadow-2xl">
            <div className="bg-white/5 p-3 border-b border-white/10 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <FileCode size={18} className="text-[#FF5C00]" />
                <span className="text-[10px] text-slate-500 font-black uppercase italic tracking-widest">
                  solution.cpp
                </span>
              </div>
              <Chip
                size="sm"
                variant="flat"
                className="bg-emerald-500/10 text-emerald-400 font-bold text-[8px]"
              >
                C++ 17
              </Chip>
            </div>
            <Textarea
              variant="flat"
              placeholder="// Write template code here..."
              minRows={10}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-6 font-mono",
                input: "text-[#00FF41] selection:bg-emerald-500/30",
              }}
            />
          </div>
        </div>

        {/* LIMITS & MODE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-6">
            <Input
              label="Time Limit (ms)"
              type="number"
              defaultValue="1000"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl dark:bg-black/20 h-12" }}
            />
            <Input
              label="Memory Limit (MB)"
              type="number"
              defaultValue="256"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl dark:bg-black/20 h-12" }}
            />
          </div>
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
            <RadioGroup
              label="Problem Type"
              defaultValue="acm"
              classNames={{
                label:
                  "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-6",
              }}
            >
              <Radio
                value="acm"
                classNames={{
                  label: "text-[11px] font-black uppercase italic",
                }}
              >
                ACM Mode
              </Radio>
              <Radio
                value="oi"
                classNames={{
                  label: "text-[11px] font-black uppercase italic",
                }}
              >
                OI Mode
              </Radio>
            </RadioGroup>
          </div>
<Tooltip
  content="Upload file .zip chứa toàn bộ input/output testcase"
  placement="top"
  delay={200}
  classNames={{
    content:
      "bg-black text-white text-[11px] px-3 py-2 rounded-lg font-semibold",
  }}
>
          <div className="p-8 border-2 border-dashed border-[#474F5D] rounded-[2.5rem] flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-[#071739]/30 hover:border-[#FFB800] transition-all group">
            <FileUp
              size={24}
              className="text-[#FFB800] group-hover:scale-110 transition-transform"
            />

  <span className="font-black dark:text-white uppercase text-[10px] tracking-widest cursor-help">
    Testcase Data (.zip)
  </span>


            <Button
              size="sm"
              className="bg-[#FFB800] text-[#071739] font-black rounded-xl px-8 h-9 mt-1"
            >
              Upload
            </Button>
          </div>
</Tooltip>
          <div className="p-8 bg-gray-50 dark:bg-[#333A45]/30 rounded-[2.5rem] border border-gray-100 dark:border-[#474F5D]/30 flex flex-col justify-center">
            <RadioGroup
              label="IO Mode"
              defaultValue="standard"
              classNames={{
                label:
                  "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-6",
              }}
            >
              <Radio
                value="standard"
                classNames={{
                  label: "text-[11px] font-black uppercase italic",
                }}
              >
                Standard IO
              </Radio>
              <Radio
                value="file"
                classNames={{
                  label: "text-[11px] font-black uppercase italic",
                }}
              >
                File IO
              </Radio>
            </RadioGroup>
          </div>
        </div>

        {/* SETTINGS BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 p-10 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5 items-start">
          <div className="space-y-6">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest">
              Settings
            </label>
            <div className="space-y-4">
              <Switch
                size="sm"
                classNames={{
                  wrapper:
                    "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                }}
              >
                <span className="text-[10px] font-black uppercase italic text-slate-400">
                  Visible
                </span>
              </Switch>
              <Switch
                size="sm"
                classNames={{
                  wrapper:
                    "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                }}
              >
                <span className="text-[10px] font-black uppercase italic text-slate-400">
                  Share
                </span>
              </Switch>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest">
                Tags
              </label>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-[#FF5C00] text-white rounded-lg h-7 w-7"
              >
                <Plus size={14} />
              </Button>
            </div>
            <Input
              startContent={<PlusSquare size={14} className="text-slate-400" />}
              placeholder="Add tag..."
              classNames={{
                inputWrapper:
                  "rounded-xl dark:bg-black/20 h-10 border-none shadow-inner",
              }}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest">
              Languages
            </label>
            <CheckboxGroup
              orientation="horizontal"
              defaultValue={["C++", "Python"]}
              classNames={{ wrapper: "gap-x-6 gap-y-4" }}
            >
              {["C++", "Java", "Python", "Go", "Rust"].map((lang) => (
                <Checkbox
                  key={lang}
                  value={lang}
                  classNames={{
                    label: "text-[10px] font-black uppercase italic",
                    wrapper: "after:bg-blue-600 dark:after:bg-[#22C55E]",
                  }}
                >
                  {lang}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </div>

        {/* TESTCASE & FILE INFO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 bg-slate-50/50 dark:bg-black/10 hover:border-blue-600 dark:hover:border-[#22C55E] transition-all group cursor-pointer">
            <FileUp
              size={32}
              className="text-slate-300 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors"
            />
            <Button
              size="sm"
              className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black rounded-lg h-8 text-[9px] uppercase tracking-widest"
            >
              Upload .zip
            </Button>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Input File"
              placeholder="input.txt"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl dark:bg-black/20 h-12" }}
            />
            <Input
              label="Output File"
              placeholder="output.txt"
              labelPlacement="outside"
              classNames={{ inputWrapper: "rounded-2xl dark:bg-black/20 h-12" }}
            />
            <Input
              label="Problem Score"
              type="number"
              defaultValue="100"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "rounded-2xl dark:bg-black/20 h-12",
                input: "font-black text-blue-600 dark:text-[#22C55E]",
              }}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-white/5">
          <Button
            variant="flat"
            startContent={<X size={18} />}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest px-10 h-12 text-slate-500 hover:text-red-500"
            onClick={() => router.back()}
          >
            Discard Changes
          </Button>
          <Button
            startContent={<Save size={20} strokeWidth={3} />}
            className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all hover:bg-[#22C55E] hover:shadow-green-500/20 active:scale-95"
          >
            Save Problem Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
