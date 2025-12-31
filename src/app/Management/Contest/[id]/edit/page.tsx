"use client";
import React from "react";
import {
  Input,
  Button,
  Switch,
  RadioGroup,
  Radio,
  Textarea,
  Divider,
} from "@heroui/react";
import {
  Save,
  ArrowLeft,
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
  CalendarDays, // Thêm icon lịch
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditContestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-6 transition-colors duration-500">
      <div className="flex items-center gap-4 mb-2">
        <Button
          isIconOnly
          variant="light"
          onClick={() => router.back()}
          className="rounded-full hover:bg-gray-200 dark:hover:bg-[#333A45]"
        >
          <ArrowLeft size={24} className="dark:text-white" />
        </Button>
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter leading-none">
            Edit Contest<span className="text-[#FFB800]">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Contest ID: #{id}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#282E3A] rounded-[2.5rem] p-10 shadow-2xl space-y-8 border border-transparent dark:border-[#474F5D]/30">
        <Input
          label="Contest Title"
          placeholder="Enter contest title"
          labelPlacement="outside"
          variant="flat"
          defaultValue="TMOJ Spring Contest 2025"
          classNames={{
            mainWrapper: "mt-6",
            inputWrapper:
              "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800] transition-all",
            label:
              "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
          }}
        />

        <div className="space-y-3">
          <label className="dark:text-white font-black uppercase text-[10px] tracking-widest ml-2">
            Description
          </label>
          <div className="rounded-2xl border-2 border-gray-100 dark:border-[#474F5D] overflow-hidden focus-within:border-[#FFB800] transition-all bg-gray-50/50 dark:bg-[#333A45]/30">
            <div className="bg-gray-100/50 dark:bg-[#333A45] p-2 border-b dark:border-[#474F5D] flex gap-1 flex-wrap">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="dark:text-white"
              >
                <Heading1 size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="dark:text-white"
              >
                <Heading2 size={16} />
              </Button>
              <Divider
                orientation="vertical"
                className="h-6 mx-1 dark:bg-[#474F5D]"
              />
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
              <Divider
                orientation="vertical"
                className="h-6 mx-1 dark:bg-[#474F5D]"
              />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="dark:text-white"
              >
                <List size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="dark:text-white"
              >
                <Link2 size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="dark:text-[#FFB800]"
              >
                <Palette size={16} />
              </Button>
            </div>
            <Textarea
              placeholder="Write contest rules and details..."
              variant="flat"
              minRows={6}
              classNames={{
                inputWrapper: "bg-transparent shadow-none p-4",
                input: "dark:text-white font-medium",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Input
            label="Start Time"
            type="datetime-local"
            labelPlacement="outside"
            placeholder=" " // Quan trọng: Khoảng trắng giúp label không bị nhảy
            startContent={
              <CalendarDays size={16} className="text-gray-400 shrink-0" />
            }
            classNames={{
              mainWrapper: "mt-6",
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
              input: "ml-2", // Đẩy text sang phải một chút cho đẹp
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
              mainWrapper: "mt-6",
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
              input: "ml-2",
            }}
          />
          <Input
            label="Password"
            placeholder="Optional"
            type="password"
            labelPlacement="outside"
            startContent={
              <LockIcon size={16} className="text-gray-400 shrink-0" />
            }
            classNames={{
              mainWrapper: "mt-6",
              inputWrapper:
                "rounded-2xl dark:bg-[#333A45] h-12 border-2 border-transparent focus-within:!border-[#FFB800]",
              label:
                "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
              input: "ml-2",
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50 dark:bg-[#333A45]/50 rounded-[2rem] items-center border border-gray-100 dark:border-[#474F5D]/30">
          <RadioGroup
            label="Contest Rule Type"
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
                classNames={{ label: "text-sm font-bold dark:text-white" }}
              >
                ACM
              </Radio>
              <Radio
                value="oi"
                classNames={{ label: "text-sm font-bold dark:text-white" }}
              >
                OI
              </Radio>
            </div>
          </RadioGroup>

          <div className="flex flex-col gap-3">
            <span className="dark:text-white font-black uppercase text-[10px] tracking-widest leading-none ml-1">
              Real Time Rank
            </span>
            <Switch color="warning" defaultSelected size="lg" />
          </div>

          <div className="flex flex-col gap-3">
            <span className="dark:text-white font-black uppercase text-[10px] tracking-widest leading-none ml-1">
              Status (Visible)
            </span>
            <Switch color="success" defaultSelected size="lg" />
          </div>
        </div>

        <Textarea
          label="Allowed IP Ranges"
          placeholder="Enter IP ranges (one per line)..."
          labelPlacement="outside"
          minRows={3}
          classNames={{
            mainWrapper: "mt-6",
            inputWrapper:
              "rounded-2xl dark:bg-[#333A45] border-2 border-transparent focus-within:!border-[#FFB800] transition-all",
            label:
              "dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
          }}
        />

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 gap-4 border-t dark:border-[#474F5D]/30">
          <Button
            variant="flat"
            startContent={<X size={18} />}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest dark:text-gray-400 dark:bg-[#333A45] px-8 h-12 w-full md:w-auto"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <div className="flex gap-4 w-full md:w-auto">
            <Button
              variant="light"
              className="rounded-xl font-bold uppercase text-[10px] tracking-widest dark:text-gray-400 h-12"
            >
              Clear IPs
            </Button>
            <Button
              startContent={<Save size={20} />}
              className="bg-[#17c964] text-white font-black rounded-2xl h-12 px-12 uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-all flex-1 md:flex-none"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center opacity-30 italic font-black uppercase text-[10px] tracking-[0.5em] dark:text-white pb-10">
        .... &bull; ....
      </div>
    </div>
  );
}
