"use client";
import React from "react";
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
  Divider,
} from "@heroui/react";
import {
  Save,
  ArrowLeft,
  PlusCircle,
  FileUp,
  X,
  Bold,
  Italic,
  Underline,
  List,
  Type,
  Plus,
  FileCode,
  PlusSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateProblemPage() {
  const router = useRouter();

  const EditorToolbar = () => (
    <div className="bg-gray-100/80 dark:bg-[#333A45] p-2 border-b dark:border-[#474F5D] flex gap-1 flex-wrap">
      <Button isIconOnly size="sm" variant="light" className="dark:text-white">
        <Type size={16} />
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
        <Underline size={16} />
      </Button>
      <Divider orientation="vertical" className="h-6 mx-1 dark:bg-[#474F5D]" />
      <Button isIconOnly size="sm" variant="light" className="dark:text-white">
        <List size={16} />
      </Button>
    </div>
  );

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 pb-20">
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
          Create New Problem<span className="text-[#FFB800]">.</span>
        </h2>
      </div>

      <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 border border-transparent dark:border-[#474F5D]/30">
        {/* ROW 1: ID & TITLE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Input
            label="Display ID"
            placeholder="e.g., P1001"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-2 ml-1",
            }}
          />
          <Input
            label="Title"
            placeholder="Problem Title"
            variant="flat"
            labelPlacement="outside"
            className="md:col-span-3"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-2 ml-1",
            }}
          />
        </div>

        {/* EDITOR SECTIONS */}
        {["Description", "Input Format", "Output Format", "Hint"].map(
          (item) => (
            <div key={item} className="space-y-3">
              <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-2">
                {item}
              </label>
              <div className="rounded-2xl border-2 border-gray-100 dark:border-[#474F5D] overflow-hidden focus-within:border-[#FFB800] bg-gray-50/50 dark:bg-[#333A45]/30">
                <EditorToolbar />
                <Textarea
                  placeholder={`Enter ${item.toLowerCase()}...`}
                  variant="flat"
                  minRows={3}
                  classNames={{
                    inputWrapper: "bg-transparent shadow-none p-4",
                    input: "dark:text-white font-medium",
                  }}
                />
              </div>
            </div>
          )
        )}

        {/* CODE TEMPLATE */}
        <div className="space-y-3">
          <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-2">
            Code Template
          </label>
          <div className="rounded-2xl border-2 border-gray-100 dark:border-[#474F5D] overflow-hidden bg-white dark:bg-[#1e2530]">
            <div className="bg-gray-50 dark:bg-[#333A45] p-3 border-b dark:border-[#474F5D] flex items-center gap-2">
              <FileCode size={18} className="text-[#FFB800]" />
              <span className="text-[11px] text-gray-500 dark:text-gray-300 font-black uppercase tracking-widest">
                Initial Source Code Template
              </span>
            </div>
            <Textarea
              variant="flat"
              placeholder="// Initial code structure..."
              minRows={8}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-6 font-mono",
                input: "text-gray-800 dark:text-gray-100",
              }}
            />
          </div>
        </div>

        {/* TIME, MEMORY, DIFFICULTY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Input
            label="Time Limit (ms)"
            type="number"
            defaultValue="1000"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
              label:
                "dark:text-white font-bold text-[10px] uppercase mb-2 ml-1",
            }}
          />
          <Input
            label="Memory Limit (MB)"
            type="number"
            defaultValue="256"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
              label:
                "dark:text-white font-bold text-[10px] uppercase mb-2 ml-1",
            }}
          />
          <Select
            label="Difficulty"
            variant="flat"
            labelPlacement="outside"
            defaultSelectedKeys={["mid"]}
            classNames={{
              trigger: "rounded-2xl dark:bg-[#333A45] mt-4 h-12",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-2 ml-1",
            }}
          >
            <SelectItem key="easy">Easy</SelectItem>
            <SelectItem key="mid">Medium</SelectItem>
            <SelectItem key="hard">Hard</SelectItem>
          </Select>
        </div>

        {/* SETTINGS BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-8 bg-gray-50 dark:bg-[#333A45]/30 rounded-[2.5rem] border border-gray-100 dark:border-[#474F5D]/30">
          <div className="flex flex-col gap-5">
            <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Settings
            </label>
            <div className="space-y-4">
              <Switch color="warning" defaultSelected size="sm">
                <span className="text-xs font-bold dark:text-white uppercase ml-1">
                  Visible
                </span>
              </Switch>
              <Switch color="warning" defaultSelected size="sm">
                <span className="text-xs font-bold dark:text-white uppercase ml-1">
                  Share Submission
                </span>
              </Switch>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pr-1">
              <label className="dark:text-white font-black uppercase text-[10px] tracking-widest">
                Tags
              </label>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-[#FFB800] text-[#071739] rounded-lg"
              >
                <Plus size={14} />
              </Button>
            </div>
            <Input
              startContent={<PlusSquare size={14} className="text-gray-400" />}
              placeholder="Add tag..."
              variant="flat"
              classNames={{
                inputWrapper:
                  "rounded-xl dark:bg-[#282E3A] h-10 border-none shadow-inner",
              }}
            />
          </div>
          <div className="col-span-2 space-y-5">
            <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Languages
            </label>
            <CheckboxGroup
              color="warning"
              orientation="horizontal"
              defaultValue={["C++", "Python", "Java"]}
            >
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                {[
                  "C++",
                  "Java",
                  "Python",
                  "Go",
                  "C#",
                  "Rust",
                  "NodeJS",
                  "Ruby",
                  "Swift",
                ].map((lang) => (
                  <Checkbox
                    key={lang}
                    value={lang}
                    classNames={{
                      label: "text-[11px] font-bold dark:text-white",
                    }}
                  >
                    {lang}
                  </Checkbox>
                ))}
              </div>
            </CheckboxGroup>
          </div>
        </div>

        {/* SAMPLES */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Sample 1
            </label>
            <Button
              size="sm"
              variant="flat"
              color="warning"
              startContent={<PlusCircle size={14} />}
              className="font-bold rounded-xl px-4 uppercase text-[10px]"
            >
              Add Sample
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-gray-50 dark:bg-[#071739]/30 rounded-[2.5rem] border-2 border-dashed dark:border-[#474F5D]">
            <Textarea
              label="Sample Input"
              variant="flat"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl border-none",
                label: "dark:text-white font-bold text-[10px] uppercase mb-2",
              }}
            />
            <Textarea
              label="Sample Output"
              variant="flat"
              labelPlacement="outside"
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl border-none",
                label: "dark:text-white font-bold text-[10px] uppercase mb-2",
              }}
            />
          </div>
        </div>

        {/* TYPE, TESTCASE, IO MODE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 dark:bg-[#333A45]/30 rounded-[2.5rem] flex flex-col justify-center border border-gray-100 dark:border-[#474F5D]/30">
            <RadioGroup
              label="Problem Type"
              orientation="horizontal"
              defaultValue="acm"
              classNames={{
                label:
                  "dark:text-white font-black uppercase text-[10px] tracking-widest mb-4 ml-1",
              }}
            >
              <div className="flex gap-6">
                <Radio value="acm">ACM</Radio>
                <Radio value="oi">OI</Radio>
              </div>
            </RadioGroup>
          </div>
          <div className="p-8 border-2 border-dashed border-[#474F5D] rounded-[2.5rem] flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-[#071739]/30 hover:border-[#FFB800] transition-all">
            <FileUp size={24} className="text-[#FFB800]" />
            <span className="font-black dark:text-white uppercase text-[10px] tracking-widest">
              Testcase Data (.zip)
            </span>
            <Button
              size="sm"
              className="bg-[#FFB800] text-[#071739] font-black rounded-xl px-8 mt-1"
            >
              Upload
            </Button>
          </div>
          <div className="p-8 bg-gray-50 dark:bg-[#333A45]/30 rounded-[2.5rem] border border-gray-100 dark:border-[#474F5D]/30 flex flex-col justify-center">
            <RadioGroup
              label="IO Mode"
              orientation="horizontal"
              defaultValue="standard"
              classNames={{
                label:
                  "dark:text-white font-black uppercase text-[10px] tracking-widest mb-4 ml-1",
              }}
            >
              <div className="flex gap-6">
                <Radio value="standard">Standard</Radio>
                <Radio value="file">File IO</Radio>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* FILENAMES & SCORE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Input
            label="Input File Name"
            placeholder="input.txt"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
              label:
                "dark:text-white font-bold text-[10px] uppercase mb-2 ml-1",
            }}
          />
          <Input
            label="Output File Name"
            placeholder="output.txt"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
              label:
                "dark:text-white font-bold text-[10px] uppercase mb-2 ml-1",
            }}
          />
          <Input
            label="Problem Score"
            type="number"
            defaultValue="100"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
              label:
                "dark:text-white font-black text-[10px] uppercase mb-2 ml-1",
            }}
          />
        </div>

        <Input
          label="Source / Author"
          variant="flat"
          labelPlacement="outside"
          placeholder="Original author..."
          classNames={{
            mainWrapper: "mt-4",
            inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
            label:
              "dark:text-white font-black uppercase text-[10px] tracking-widest mb-2 ml-1",
          }}
        />

        {/* FOOTER ACTIONS */}
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
            startContent={<Save size={20} />}
            className="bg-[#17c964] text-white font-black rounded-2xl h-14 px-20 uppercase tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all"
          >
            Create Problem
          </Button>
        </div>
      </div>
    </div>
  );
}
