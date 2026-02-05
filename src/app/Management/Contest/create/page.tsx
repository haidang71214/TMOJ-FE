"use client";
import React from "react";
import {
  Input,
  Button,
  RadioGroup,
  Radio,
  Switch,
  Textarea,
  Chip,
} from "@heroui/react";
import {
  X,
  Trophy,
  Lock,
  CalendarDays,
  Heading1,
  Bold,
  Italic,
  List,
  Link2,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateContestPage() {
  const router = useRouter();

  const EditorToolbar = () => (
    <div className="bg-slate-50 dark:bg-black/20 p-2 border-b border-slate-200 dark:border-white/10 flex gap-1">
      {[Heading1, Bold, Italic, List, Link2].map((Icon, i) => (
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
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 transition-colors h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          Back to Contest List
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            CREATE NEW <span className="text-[#FF5C00]">CONTEST</span>
          </h1>
          <Chip
            variant="dot"
            color="warning"
            className="font-black uppercase text-[10px] border-none italic"
          >
            Draft Mode
          </Chip>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10">
        {/* TITLE */}
        <Input
          label="Contest Title"
          placeholder="e.g. TMOJ Spring Contest 2025"
          labelPlacement="outside"
          classNames={{
            inputWrapper:
              "rounded-2xl dark:bg-black/20 h-14 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] transition-all",
            label:
              "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            input: "font-bold italic uppercase tracking-tight text-lg",
          }}
        />

        {/* DESCRIPTION */}
        <div className="space-y-3">
          <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
            Contest Description & Rules
          </label>
          <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10">
            <EditorToolbar />
            <Textarea
              placeholder="Explain the rules, prizes, and details..."
              variant="flat"
              minRows={5}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-4",
                input: "font-medium text-slate-600 dark:text-slate-300",
              }}
            />
          </div>
        </div>

        {/* SETTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Input
            label="Start Time"
            type="datetime-local"
            labelPlacement="outside"
            startContent={<CalendarDays size={18} className="text-slate-400" />}
            classNames={{
              inputWrapper:
                "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            }}
          />
          <Input
            label="End Time"
            type="datetime-local"
            labelPlacement="outside"
            startContent={<CalendarDays size={18} className="text-slate-400" />}
            classNames={{
              inputWrapper:
                "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            }}
          />
          <Input
            label="Security Password"
            type="password"
            placeholder="Keep empty for public"
            labelPlacement="outside"
            startContent={<Lock size={18} className="text-slate-400" />}
            classNames={{
              inputWrapper:
                "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            }}
          />
        </div>

        {/* CONFIGURATION BOX */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5">
          <RadioGroup
            label="Rule System"
            orientation="horizontal"
            defaultValue="acm"
            classNames={{
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-4",
            }}
          >
            <div className="flex gap-8">
              <Radio
                value="acm"
                classNames={{ label: "text-xs font-black uppercase italic" }}
              >
                ACM
              </Radio>
              <Radio
                value="oi"
                classNames={{ label: "text-xs font-black uppercase italic" }}
              >
                OI
              </Radio>
            </div>
          </RadioGroup>

          <div className="flex flex-col gap-4">
            <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none">
              Real-time Ranking
            </span>
            <Switch
              defaultSelected
              size="sm"
              classNames={{
                wrapper:
                  "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none">
              Publicly Visible
            </span>
            <Switch
              defaultSelected
              size="sm"
              classNames={{
                wrapper:
                  "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
              }}
            />
          </div>

          <RadioGroup
            label="Public Solution"
            orientation="horizontal"
            defaultValue="acm"
            classNames={{
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-4",
            }}
          >
            <div className="flex gap-8">
              <Radio
                value="acm"
                classNames={{ label: "text-xs font-black uppercase italic" }}
              >
                After
              </Radio>
              <Radio
                value="oi"
                classNames={{ label: "text-xs font-black uppercase italic" }}
              >
                Always
              </Radio>
            </div>
          </RadioGroup>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-white/5">
          <Button
            variant="flat"
            startContent={<X size={18} />}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest px-10 h-12 bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
            onClick={() => router.back()}
          >
            Discard Draft
          </Button>
          <Button
            startContent={<Trophy size={20} strokeWidth={3} />}
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black rounded-2xl h-14 px-16 uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            Launch Contest
          </Button>
        </div>
      </div>

      <style jsx global>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }
        .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
}
