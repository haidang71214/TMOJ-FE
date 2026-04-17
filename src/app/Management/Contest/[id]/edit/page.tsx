"use client";
import React, { use, useState, useEffect } from "react";
import {
  Input,
  Button,
  Switch,
  RadioGroup,
  Radio,
  Textarea,
  Divider,
  Chip,
  Spinner,
  Select,
  SelectItem,
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
  Globe,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetContestDetailQuery, useUpdateContestMutation } from "@/store/queries/Contest";
import { toast } from "sonner";
import { CreateContestRequest } from "@/types";

export default function EditContestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  // APIs
  const { data: contestResult, isLoading: isFetching } = useGetContestDetailQuery(id);
  const [updateContest, { isLoading: isUpdating }] = useUpdateContestMutation();

  const [formData, setFormData] = useState<CreateContestRequest>({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    visibilityCode: "public",
    allowTeams: false,
    contestType: "acm",
  });

  const contest = contestResult?.data;
  // Status check logic
  const status = contest?.status?.toLowerCase() || "draft";
  const isUpcoming = status === "upcoming" || status === "draft";
  const isRunning = status === "running";
  const isEnded = status === "ended";

  // Restricted means only endAt is editable
  const isRestricted = isRunning;
  const isReadOnly = isEnded;

  useEffect(() => {
    if (contest) {
      setFormData({
        title: contest.title || "",
        description: contest.description || "",
        startAt: contest.startAt ? new Date(contest.startAt).toISOString().slice(0, 16) : "",
        endAt: contest.endAt ? new Date(contest.endAt).toISOString().slice(0, 16) : "",
        visibilityCode: (contest.visibility as any) || "public",
        allowTeams: contest.allowTeams || false,
        contestType: (contest.contestType?.toLowerCase() as any) || "acm",
      });
    }
  }, [contest]);

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.startAt || !formData.endAt) {
        toast.error("Vui lòng điền đủ Title, Start Time và End Time");
        return;
      }

      const payload = {
        ...formData,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
      };

      await updateContest({ id, body: payload }).unwrap();
      toast.success("Cập nhật Contest thành công!");
      router.push("/Management/Contest");
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.data?.message || "Không thể cập nhật Contest");
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="warning" />
        <p className="font-black italic uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Contest Information...
        </p>
      </div>
    );
  }

  const EditorToolbar = () => (
    <div className="bg-slate-50 dark:bg-black/20 p-2 border-b border-slate-200 dark:border-white/10 flex gap-1 flex-wrap">
      {[Heading1, Heading2, Bold, Italic, Underline, List, Link2].map(
        (Icon, i) => (
          <Button
            key={i}
            isIconOnly
            size="sm"
            variant="light"
            disabled={isRestricted || isReadOnly}
            className="text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E]"
          >
            <Icon size={16} />
          </Button>
        )
      )}
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
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
              EDIT <span className="text-[#FF5C00]">CONTEST</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                Contest ID: #{id.slice(0, 8)}
              </span>
              <Chip
                size="sm"
                variant="dot"
                color={
                  isRunning ? "success" : isUpcoming ? "primary" : "default"
                }
                className="font-black uppercase text-[8px] h-5 italic px-2 border-none"
              >
                {status}
              </Chip>
              {isRunning && (
                <Chip
                  size="sm"
                  className="bg-orange-500/10 text-orange-600 font-bold uppercase text-[8px] h-5"
                >
                  ⚡ Restricted Edit Mode
                </Chip>
              )}
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="flat"
              onPress={() => router.back()}
              className="flex-1 md:flex-none font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
              startContent={<X size={16} />}
            >
              Cancel
            </Button>
            {!isReadOnly && (
              <Button
                isLoading={isUpdating}
                onPress={handleSave}
                className="flex-1 md:flex-none bg-[#071739] dark:bg-[#FF5C00] text-white font-black uppercase text-[10px] tracking-widest h-12 px-10 rounded-xl shadow-xl active:scale-95 transition-all"
                startContent={<Save size={18} strokeWidth={3} />}
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10">
        {/* TITLE */}
        <Input
          label="Contest Title"
          value={formData.title}
          onValueChange={(val) => setFormData(p => ({ ...p, title: val }))}
          labelPlacement="outside"
          isDisabled={isRestricted || isReadOnly}
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
              value={formData.description}
              onValueChange={(val) => setFormData(p => ({ ...p, description: val }))}
              isDisabled={isRestricted || isReadOnly}
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
            value={formData.startAt}
            onValueChange={(val) => setFormData(p => ({ ...p, startAt: val }))}
            isDisabled={isRestricted || isReadOnly}
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
            value={formData.endAt}
            onValueChange={(val) => setFormData(p => ({ ...p, endAt: val }))}
            isDisabled={isReadOnly}
            startContent={<CalendarDays size={18} className="text-slate-400" />}
            classNames={{
              inputWrapper:
                `rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] ${isRunning ? "border-green-500/50" : ""}`,
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
            }}
          />
          <Input
            label="Security Password"
            placeholder="Optional"
            type="password"
            labelPlacement="outside"
            isDisabled={isRestricted || isReadOnly}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5">
          <RadioGroup
            label="Rule Type"
            orientation="horizontal"
            value={formData.contestType}
            onValueChange={(val) => setFormData(p => ({ ...p, contestType: val as any }))}
            isDisabled={isRestricted || isReadOnly}
            classNames={{
              label:
                "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-4",
            }}
          >
            <div className="flex gap-8">
              <Radio value="acm" classNames={{ label: "text-xs font-black uppercase italic" }}>ACM</Radio>
              <Radio value="oi" classNames={{ label: "text-xs font-black uppercase italic" }}>OI</Radio>
            </div>
          </RadioGroup>

          <div className="flex flex-col gap-4 group">
            <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
              Visible Status
            </span>
            <Select
              size="sm"
              variant="flat"
              disallowEmptySelection
              selectedKeys={[formData.visibilityCode]}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                setFormData((prev) => ({ ...prev, visibilityCode: val }));
              }}
              isDisabled={isRestricted || isReadOnly}
              classNames={{
                trigger: "bg-white dark:bg-black/20 rounded-xl border border-transparent hover:border-blue-600 h-10",
                value: "font-black uppercase text-[10px] italic tracking-wider",
              }}
              renderValue={(items) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    {item.key === "public" ? <Globe size={14} className="text-green-500" /> :
                      item.key === "private" ? <LockIcon size={14} className="text-amber-500" /> :
                        <EyeOff size={14} className="text-slate-400" />}
                    <span>{item.textValue?.toUpperCase()}</span>
                  </div>
                ));
              }}
            >
              <SelectItem
                key="public"
                textValue="Public"
                startContent={<Globe size={18} className="text-green-500" />}
                className="font-black uppercase text-[10px] italic tracking-wider"
              >
                Public
              </SelectItem>
              <SelectItem
                key="private"
                textValue="Private"
                startContent={<LockIcon size={18} className="text-amber-500" />}
                className="font-black uppercase text-[10px] italic tracking-wider"
              >
                Private
              </SelectItem>
              <SelectItem
                key="hidden"
                textValue="Hidden"
                startContent={<EyeOff size={18} className="text-slate-400" />}
                className="font-black uppercase text-[10px] italic tracking-wider"
              >
                Hidden
              </SelectItem>
            </Select>
          </div>

          <div className="flex flex-col gap-4 group">
            <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
              Allow Teams
            </span>
            <Switch
              isSelected={formData.allowTeams}
              onValueChange={(val) => setFormData(p => ({ ...p, allowTeams: val }))}
              isDisabled={isRestricted || isReadOnly}
              size="sm"
              classNames={{
                wrapper:
                  "group-data-[selected=true]:bg-[#FF5C00]",
              }}
            />
          </div>
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
