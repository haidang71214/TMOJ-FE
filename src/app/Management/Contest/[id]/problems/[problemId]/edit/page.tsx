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
  Tooltip,
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
  Trash2,
  FileCode,
  PlusSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProblemEditForm() {
  const router = useRouter();

  // Mini Rich Text Toolbar
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
    <div className="p-10 max-w-6xl mx-auto space-y-8 transition-colors duration-500 pb-20">
      {/* Header */}
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
          Edit Problem Detail<span className="text-[#FFB800]">.</span>
        </h2>
      </div>

      <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 border border-transparent dark:border-[#474F5D]/30">
        {/* ROW 1: Display ID & Title */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Input
            label="Display ID"
            placeholder="e.g., A"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              mainWrapper: "mt-4",
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-2 ml-1",
            }}
          />
          <Input
            label="Title"
            placeholder="Enter problem title"
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

        {/* SEQUENTIAL EDITOR SECTIONS */}
        {[
          {
            label: "Description",
            placeholder: "Detailed problem statement...",
          },
          {
            label: "Input Format",
            placeholder: "Describe the input data format...",
          },
          {
            label: "Output Format",
            placeholder: "Describe the expected output format...",
          },
          { label: "Hint", placeholder: "Provide hints for the problem..." },
        ].map((item) => (
          <div key={item.label} className="space-y-3">
            <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-2">
              {item.label}
            </label>
            <div className="rounded-2xl border-2 border-gray-100 dark:border-[#474F5D] overflow-hidden focus-within:border-[#FFB800] transition-all bg-gray-50/50 dark:bg-[#333A45]/30">
              <EditorToolbar />
              <Textarea
                placeholder={item.placeholder}
                variant="flat"
                minRows={item.label === "Description" ? 5 : 3}
                classNames={{
                  inputWrapper: "bg-transparent shadow-none p-4",
                  input: "dark:text-white font-medium",
                }}
              />
            </div>
          </div>
        ))}

        {/* CODE TEMPLATE (Light theme support) */}
        <div className="space-y-3">
          <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-2">
            Code Template
          </label>
          <div className="rounded-2xl border-2 border-gray-100 dark:border-[#474F5D] overflow-hidden focus-within:border-[#FFB800] bg-white dark:bg-[#1e2530]">
            <div className="bg-gray-50 dark:bg-[#333A45] p-3 border-b dark:border-[#474F5D] flex items-center gap-2">
              <FileCode size={18} className="text-[#FFB800]" />
              <span className="text-[11px] text-gray-500 dark:text-gray-300 font-black uppercase tracking-widest">
                Initial Source Code Template
              </span>
            </div>
            <Textarea
              variant="flat"
              placeholder="// Write your code template here..."
              minRows={8}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-6 font-mono",
                input: "text-gray-800 dark:text-gray-100",
              }}
            />
          </div>
        </div>

        {/* ROW: TIME, MEMORY, DIFFICULTY */}
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
            <SelectItem key="easy" className="dark:text-white">
              Easy
            </SelectItem>
            <SelectItem key="mid" className="dark:text-white">
              Medium
            </SelectItem>
            <SelectItem key="hard" className="dark:text-white">
              Hard
            </SelectItem>
          </Select>
        </div>

        {/* SETTINGS BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-8 bg-gray-50 dark:bg-[#333A45]/30 rounded-[2.5rem] items-start border border-gray-100 dark:border-[#474F5D]/30">
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
              placeholder="Add new tag..."
              variant="flat"
              classNames={{
                inputWrapper:
                  "rounded-xl dark:bg-[#282E3A] h-10 border-none shadow-inner",
              }}
            />
          </div>

          <div className="col-span-2 space-y-5">
            <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Supported Languages
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

        {/* SAMPLES MANAGEMENT */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
              Sample Case 1
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-gray-50 dark:bg-[#071739]/30 rounded-[2.5rem] border-2 border-dashed dark:border-[#474F5D]">
            <Textarea
              label="Sample Input"
              variant="flat"
              labelPlacement="outside"
              placeholder="Input test data..."
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl border-none",
                label: "dark:text-white font-bold text-[10px] uppercase mb-2",
              }}
            />
            <Textarea
              label="Sample Output"
              variant="flat"
              labelPlacement="outside"
              placeholder="Expected output data..."
              classNames={{
                inputWrapper: "dark:bg-[#282E3A] rounded-xl border-none",
                label: "dark:text-white font-bold text-[10px] uppercase mb-2",
              }}
            />
          </div>
        </div>

        {/* TYPE, TESTCASE, IO MODE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 dark:bg-[#333A45]/30 rounded-[2.5rem] border border-gray-100 dark:border-[#474F5D]/30 flex flex-col justify-center">
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
              orientation="horizontal"
              defaultValue="standard"
              classNames={{
                label:
                  "dark:text-white font-black uppercase text-[10px] tracking-widest mb-4 ml-1",
              }}
            >
              <div className="flex gap-6">
                <Radio
                  value="standard"
                  classNames={{ label: "text-xs font-bold dark:text-white" }}
                >
                  Standard IO
                </Radio>
                <Radio
                  value="file"
                  classNames={{ label: "text-xs font-bold dark:text-white" }}
                >
                  File IO
                </Radio>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* INPUT, OUTPUT, SCORE */}
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

        {/* SOURCE */}
        <Input
          label="Source / Author"
          variant="flat"
          labelPlacement="outside"
          placeholder="Problem original source or author..."
          classNames={{
            mainWrapper: "mt-4",
            inputWrapper: "rounded-2xl dark:bg-[#333A45] h-12",
            label:
              "dark:text-white font-black uppercase text-[10px] tracking-widest mb-2 ml-1",
          }}
        />

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-8 border-t dark:border-[#474F5D]/30">
          <Button
            variant="flat"
            startContent={<X size={18} />}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest dark:text-gray-400 dark:bg-[#333A45] px-10 h-12"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            startContent={<Save size={20} />}
            className="bg-[#17c964] text-white font-black rounded-2xl h-14 px-20 uppercase tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
