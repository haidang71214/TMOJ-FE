"use client";
import React, { use } from "react";
import {
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Textarea,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Chip,
} from "@heroui/react";
import {
  Save,
  FileUp,
  X,
  Bold,
  Italic,
  Underline,
  List,
  Type,
  Trash2,
  FileCode
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PROBLEM_TAG_LABEL, ProblemTag } from "@/types";

export default function GlobalProblemEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

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
const [selectedTags, setSelectedTags] = React.useState<ProblemTag[]>([]);
const addTag = (tag: ProblemTag) => {
  setSelectedTags((prev) =>
    prev.includes(tag) ? prev : [...prev, tag]
  );
};

const removeTag = (tag: ProblemTag) => {
  setSelectedTags((prev) => prev.filter((t) => t !== tag));
};
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
          Back to Repository
        </Button>
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            EDIT <span className="text-[#FF5C00]">REPOSITORY PROBLEM</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              Global ID: #{id}
            </span>
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              className="font-black uppercase text-[8px] h-5 italic px-2"
            >
              Master Data
            </Chip>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10">
        {/* PROBLEM TITLE */}
        <Input
          label="Problem Title"
          defaultValue="A + B Problem"
          placeholder="Enter problem title..."
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
            Description
          </label>
          <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10 transition-all">
            <EditorToolbar />
            <Textarea
              placeholder="Detailed problem statement..."
              variant="flat"
              minRows={5}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-4",
                input: "font-medium text-slate-600 dark:text-slate-300",
              }}
            />
          </div>
        </div>

        {/* FORMATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 group">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
              Input Format
            </label>
            <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10">
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
              <Textarea
                placeholder="Describe expected output..."
                variant="flat"
                minRows={3}
                classNames={{ inputWrapper: "bg-transparent shadow-none p-4" }}
              />
            </div>
          </div>
        </div>

        {/* CODE TEMPLATE - DARK STUDIO */}
        <div className="space-y-3 group">
          <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
            Initial Code Template
          </label>
          <div className="rounded-[2rem] border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50 dark:bg-[#121212] shadow-sm dark:shadow-2xl transition-all">
            <div className="bg-slate-100/50 dark:bg-white/5 p-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <FileCode size={18} className="text-[#FF5C00]" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest italic">
                  solution_template.cpp
                </span>
              </div>
              <Chip
                size="sm"
                variant="flat"
                className="bg-blue-500/10 dark:bg-emerald-500/10 text-blue-600 dark:text-emerald-400 font-bold text-[8px]"
              >
                SYNTAX HIGH LIGHTING
              </Chip>
            </div>
            <Textarea
              variant="flat"
              placeholder="// Write template code here..."
              minRows={10}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-6 font-mono",
                input:
                  "text-slate-700 dark:text-[#00FF41] font-medium selection:bg-blue-200 dark:selection:bg-emerald-500/30",
              }}
            />
          </div>
        </div>

        {/* LIMITS & DIFFICULTY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5 items-end">
          <Input
            label="Time Limit (ms)"
            type="number"
            defaultValue="1000"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
            }}
          />
          <Input
            label="Memory Limit (MB)"
            type="number"
            defaultValue="256"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
            }}
          />
          <Select
            label="Difficulty"
            labelPlacement="outside"
            defaultSelectedKeys={["mid"]}
            classNames={{
              trigger:
                "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
            }}
          >
            <SelectItem
              key="easy"
              className="font-bold uppercase text-[10px] text-emerald-500"
            >
              Easy
            </SelectItem>
            <SelectItem
              key="mid"
              className="font-bold uppercase text-[10px] text-amber-500"
            >
              Medium
            </SelectItem>
            <SelectItem
              key="hard"
              className="font-bold uppercase text-[10px] text-rose-500"
            >
              Hard
            </SelectItem>
          </Select>
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
                defaultSelected
                classNames={{
                  wrapper:
                    "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                }}
              >
                <span className="text-[10px] font-black uppercase italic text-slate-500 dark:text-slate-300">
                  Visible
                </span>
              </Switch>
              <Switch
                size="sm"
                defaultSelected
                classNames={{
                  wrapper:
                    "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                }}
              >
                <span className="text-[10px] font-black uppercase italic text-slate-500 dark:text-slate-300">
                  Share Results
                </span>
              </Switch>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Tags
            </label>
          
            <Select
              placeholder="Select tag"
              variant="flat"
              classNames={{
                trigger: "rounded-xl dark:bg-[#282E3A] h-10",
              }}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as ProblemTag;
                if (value) addTag(value);
              }}
            >
              {Object.values(ProblemTag).map((tag) => (
                <SelectItem key={tag}>
                  {PROBLEM_TAG_LABEL[tag]}
                </SelectItem>
              ))}
            </Select>
          
            {/* Selected tags */}
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-[11px] font-bold"
                >
                  {PROBLEM_TAG_LABEL[tag]}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
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
                    label:
                      "text-[10px] font-black uppercase italic text-slate-500 dark:text-slate-300",
                    wrapper: "after:bg-blue-600 dark:after:bg-[#22C55E]",
                  }}
                >
                  {lang}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </div>

        {/* SAMPLES MANAGEMENT */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Example Samples
            </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="danger"
                startContent={<Trash2 size={14} />}
                className="font-bold rounded-xl px-4 text-[10px] uppercase"
              >
                Remove
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="warning"
                startContent={<PlusCircle size={14} />}
                className="font-bold rounded-xl px-4 text-[10px] uppercase"
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
              placeholder="Input data..."
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl",
                label: "font-bold text-[10px] uppercase mb-2",
              }}
            />
            <Textarea
              label="Sample Output"
              variant="flat"
              labelPlacement="outside"
              placeholder="Output data..."
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl",
                label: "font-bold text-[10px] uppercase mb-2",
              }}
            />
          </div>
        </div>

        {/* TYPE & IO MODE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
            <RadioGroup
              label="Problem Type"
              defaultValue="acm"
              classNames={{
                label:
                  "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-6",
              }}
            >
              <div className="flex gap-8">
                <Radio
                  value="acm"
                  classNames={{
                    label: "text-[11px] font-black uppercase italic",
                  }}
                >
                  ACM (Penalty)
                </Radio>
                <Radio
                  value="oi"
                  classNames={{
                    label: "text-[11px] font-black uppercase italic",
                  }}
                >
                  OI (Score)
                </Radio>
              </div>
            </RadioGroup>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
            <RadioGroup
              label="IO Mode"
              defaultValue="standard"
              classNames={{
                label:
                  "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-6",
              }}
            >
              <div className="flex gap-8">
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
              </div>
            </RadioGroup>
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
              Update .zip
            </Button>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Input Filename"
              placeholder="input.txt"
              labelPlacement="outside"
              classNames={{
                inputWrapper:
                  "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
              }}
            />
            <Input
              label="Output Filename"
              placeholder="output.txt"
              labelPlacement="outside"
              classNames={{
                inputWrapper:
                  "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
              }}
            />
            <Input
              label="Master Score"
              type="number"
              defaultValue="100"
              labelPlacement="outside"
              classNames={{
                inputWrapper:
                  "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
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
            className="rounded-xl font-black uppercase text-[10px] tracking-widest px-10 h-12 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all"
            onClick={() => router.back()}
          >
            Discard Changes
          </Button>
          <Button
            startContent={<Save size={20} strokeWidth={3} />}
            className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all hover:bg-[#22C55E] hover:shadow-green-500/20 active:scale-95"
          >
            Update Repository Problem
          </Button>
        </div>
      </div>
    </div>
  );
}
