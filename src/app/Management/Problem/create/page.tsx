"use client";
import React from "react";
import {
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Textarea,
  RadioGroup,
  Radio,
  Divider,
  Chip,
  useDisclosure,
} from "@heroui/react";
import {
  Save,
  X,
  FileCode,
  ChevronLeft,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { CreateProblemDraftRequest } from "@/types";
import TestcaseGuideModal from "./../../../components/TestcaseGuideModal";
import { useCreateProblemDraftMutation } from "@/store/queries/problem";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";

export default function CreateProblemPage() {
  const router = useRouter();
  const [createProblemDraft] = useCreateProblemDraftMutation();
  const { data: userData, isLoading: isUserLoading } =useGetUserInformationQuery();
  const [form, setForm] = React.useState<CreateProblemDraftRequest>({
  slug: "",
  title: "",
  difficulty: "medium",
  typeCode: "algorithm",
  visibilityCode: "public",
  scoringCode: "acm",
  descriptionMd: "",
  displayIndex: 1,
  timeLimitMs: 1000,
  memoryLimitKb: 262144,
  createdBy: "",
});
const handlePublish = async () => {
  if (!userData?.userId) {
    alert("User not loaded yet");
    return;
  }

  if (!form.slug || !form.title) {
    alert("Slug and Title are required");
    return;
  }

  try {
    const data = await createProblemDraft({
      ...form,
      createdBy: userData.userId,
    }).unwrap();

    console.log(data);

    // redirect sang trang tạo testset
    router.push(`/Management/Problem/${data.data.id}/CreateTestSet`);

  } catch (error) {
    console.error("Create problem failed:", error);
    alert("Create failed");
  }
};
  // Logic mở Modal
  const { isOpen, onOpenChange } = useDisclosure();
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
              CREATE <span className="text-[#FF5C00]">PROBLEM DRAFT</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] italic">
              Define new algorithm challenge
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 border border-transparent dark:border-[#474F5D]/30">
        {/* ROW 1: TITLE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Input
  label="Title"
  placeholder="Problem Title"
  variant="flat"
  value={form.title}
  onChange={(e) =>
    setForm({ ...form, title: e.target.value })
  }
/>
        </div>
<Input
  label="Slug"
  placeholder="two-sum"
  variant="flat"
  value={form.slug}
  onChange={(e) =>
    setForm({ ...form, slug: e.target.value })
  }
/>
        <Divider className="my-4 dark:bg-white/10" />
        {/* DESCRIPTION */}
        <Textarea
  placeholder="Detailed problem statement..."
  value={form.descriptionMd}
  onChange={(e) =>
    setForm({ ...form, descriptionMd: e.target.value })
  }
/>

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

        {/* LIMITS, DIFFICULTY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5 items-end">
         <Input
  label="Time Limit (ms)"
  type="number"
  value={form.timeLimitMs.toString()}
  onChange={(e) =>
    setForm({
      ...form,
      timeLimitMs: Number(e.target.value),
    })
  }
/>
          <Input
  label="Memory Limit (MB)"
  type="number"
  value={(form.memoryLimitKb / 1024).toString()}
  onChange={(e) =>
    setForm({
      ...form,
      memoryLimitKb: Number(e.target.value) * 1024,
    })
  }
/>
          <Select
  selectedKeys={[form.difficulty]}
  onSelectionChange={(keys) => {
    const value = Array.from(keys)[0] as
      | "easy"
      | "medium"
      | "hard";
    setForm({ ...form, difficulty: value });
  }}
>
            <SelectItem
              key="easy"
              className="font-bold uppercase text-[10px] text-emerald-500"
            >
              Easy
            </SelectItem>
            <SelectItem
              key="medium"
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

        {/* MODE SECTIONS - FIXED RADIOGROUP ERROR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex flex-col justify-center">
            <RadioGroup
  value={form.scoringCode}
  onValueChange={(value) =>
    setForm({
      ...form,
      scoringCode: value as "acm" | "oi",
    })
  }
>
              <Radio
                value="acm"
                classNames={{ label: "text-[11px] font-bold uppercase italic" }}
              >
                ACM (Penalty)
              </Radio>
              <Radio
                value="oi"
                classNames={{ label: "text-[11px] font-bold uppercase italic" }}
              >
                OI (Score based)
              </Radio>
            </RadioGroup>
          </div>


          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex flex-col justify-center">
              <div className="space-y-6">
            <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest">
              Visibility
            </label>
            <div className="space-y-4">
              <Switch
  isSelected={form.visibilityCode === "public"}
  onValueChange={(checked) =>
    setForm({
      ...form,
      visibilityCode: checked ? "public" : "private",
    })
  }
>
                <span className="text-[10px] font-black uppercase italic text-slate-500 dark:text-slate-300">
                  Public Visible
                </span>
              </Switch>
            </div>
          </div>
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
            Discard Draft
          </Button>
          <Button
            startContent={<Save size={20} strokeWidth={3} />}
            onPress={handlePublish}
  isDisabled={isUserLoading}
            className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all hover:bg-[#22C55E] hover:shadow-green-500/20 active:scale-95"
          >
            Import TestSet Problem
          </Button>
        </div>
      </div>
      {/* GỌI MODAL TẠI ĐÂY */}
      <TestcaseGuideModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
