"use client";
import React, { use } from "react";
import {
  Input,
  Button,
  Switch,
  RadioGroup,
  Radio,
  Textarea,
  Divider,
  Chip,
} from "@heroui/react";
import {
  Save,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Palette,
  List,
  Link2,
  Lock as LockIcon,
  X,
  CalendarDays,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditContestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const EditorToolbar = () => (
    <div className="bg-slate-50 dark:bg-black/20 p-2 border-b border-slate-200 dark:border-white/10 flex gap-1 flex-wrap">
      {[Heading1, Heading2, Bold, Italic, Underline, List, Link2].map(
        (Icon, i) => (
          <Button
            key={i}
            isIconOnly
            size="sm"
            variant="light"
            className="text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E]"
          >
            <Icon size={16} />
          </Button>
        )
      )}
      <Divider orientation="vertical" className="h-6 mx-1 dark:bg-white/10" />
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="text-slate-500 hover:text-[#FF5C00]"
      >
        <Palette size={16} />
      </Button>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
              EDIT <span className="text-[#FF5C00]">CONTEST</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                Contest ID: #{id}
              </span>
              <Chip
                size="sm"
                variant="flat"
                color="success"
                className="font-black uppercase text-[8px] h-5 italic px-2"
              >
                Published
              </Chip>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="flat"
              onClick={() => router.back()}
              className="flex-1 md:flex-none font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
              startContent={<X size={16} />}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 md:flex-none bg-[#071739] dark:bg-[#FF5C00] text-white font-black uppercase text-[10px] tracking-widest h-12 px-10 rounded-xl shadow-xl active:scale-95 transition-all"
              startContent={<Save size={18} strokeWidth={3} />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10">
        {/* TITLE */}
        <Input
          label="Contest Title"
          defaultValue="TMOJ Spring Contest 2025"
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
        <div className="space-y-3 group">
          <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
            Description & Rules
          </label>
          <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10 transition-all">
            <EditorToolbar />
            <Textarea
              placeholder="Write contest rules and details..."
              variant="flat"
              minRows={6}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-4",
                input: "font-medium text-slate-600 dark:text-slate-300",
              }}
            />
          </div>
        </div>

        {/* TIME & PASSWORD */}
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
            placeholder="Optional"
            type="password"
            labelPlacement="outside"
            startContent={<LockIcon size={18} className="text-slate-400" />}
            classNames={{
              inputWrapper:
                "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            }}
          />
        </div>

        {/* CONFIGURATION BOX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5">
          <RadioGroup
            label="Contest Rule Type"
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

          <div className="flex flex-col gap-4 group">
            <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
              Real-time Rank
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

          <div className="flex flex-col gap-4 group">
            <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
              Visible Status
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
        </div>

        {/* IP RANGES */}
        <div className="space-y-3 group">
          <div className="flex justify-between items-center">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
              Allowed IP Ranges
            </label>
            <Button
              variant="light"
              size="sm"
              className="font-bold text-[9px] uppercase tracking-widest text-slate-400 hover:text-red-500"
            >
              Clear All IPs
            </Button>
          </div>
          <Textarea
            placeholder="Enter IP ranges (one per line)..."
            labelPlacement="outside"
            minRows={3}
            classNames={{
              inputWrapper:
                "rounded-2xl dark:bg-black/20 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] p-4 transition-all",
            }}
          />
        </div>
      </div>

      {/* FOOTER DECOR */}
      <div className="flex justify-center opacity-20 italic font-black uppercase text-[10px] tracking-[1em] text-slate-400 pb-10">
        TMOJ &bull; SYSTEM &bull; EDIT
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
