"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
  Spinner,
} from "@heroui/react";
import { Copy, Zap, X, Calendar, Globe, Lock, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContestDto, ErrorForm } from "@/types";
import { useRemixContestMutation, useCreateVirtualContestMutation, useUpdateContestMutation, useGetContestDetailQuery } from "@/store/queries/Contest";
import { toast } from "sonner";

interface RemixContestModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  contest: ContestDto | null;
  mode: "remix" | "virtual";
}

export const RemixContestModal = ({
  isOpen,
  onOpenChange,
  contest,
  mode,
}: RemixContestModalProps) => {
  const router = useRouter();
  const { data: contestDetail, isLoading: isLoadingDetail } = useGetContestDetailQuery(contest?.id || "", {
    skip: !contest?.id || !isOpen,
  });
  const [remixContest, { isLoading: isRemixing }] = useRemixContestMutation();
  const [createVirtual, { isLoading: isCreatingVirtual }] = useCreateVirtualContestMutation();
  const [updateContest, { isLoading: isUpdating }] = useUpdateContestMutation();

  const getLocalISOString = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibilityCode: "public",
    contestType: "ACM",
    allowTeams: false,
    startAt: "",
    endAt: "",
  });

  useEffect(() => {
    if (contestDetail?.data && isOpen) {
      const c = contestDetail.data;
      if (mode === "remix") {
        setFormData({
          title: `[Remix] ${c.title}`,
          description: c.description || "",
          visibilityCode: c.visibility || (c as any).visibilityCode || "public",
          contestType: c.contestType?.toUpperCase() || "ACM",
          allowTeams: c.allowTeams || false,
          startAt: getLocalISOString(new Date()),
          endAt: getLocalISOString(new Date(Date.now() + 3 * 3600000)),
        });
      } else {
        // Virtual mode
        const duration = new Date(c.endAt).getTime() - new Date(c.startAt).getTime();
        const now = new Date();
        const end = new Date(now.getTime() + duration);
        setFormData({
          title: `[Virtual] ${c.title}`,
          description: c.description || "",
          visibilityCode: "private",
          contestType: c.contestType?.toUpperCase() || "ACM",
          allowTeams: c.allowTeams || false,
          startAt: getLocalISOString(now),
          endAt: getLocalISOString(end),
        });
      }
    }
  }, [contestDetail, isOpen, mode]);

  const handleConfirm = async (onClose: () => void) => {
    if (!contest) return;

    try {
      let result;
      if (mode === "remix") {
        result = await remixContest({
          id: contest.id,
          body: {
            title: formData.title,
            startAt: new Date(formData.startAt).toISOString(),
            endAt: new Date(formData.endAt).toISOString(),
            visibilityCode: formData.visibilityCode,
          },
        }).unwrap();
      } else {
        result = await createVirtual({
          id: contest.id,
          body: {
            startAt: new Date(formData.startAt).toISOString(),
            endAt: new Date(formData.endAt).toISOString(),
          },
        }).unwrap();
      }

      const newContestId = result?.data;
      if (newContestId) {
        // Step 2: Update all fields (including description, contestType, allowTeams)
        await updateContest({
          id: newContestId,
          body: {
            title: formData.title,
            description: formData.description,
            startAt: new Date(formData.startAt).toISOString(),
            endAt: new Date(formData.endAt).toISOString(),
            visibilityCode: formData.visibilityCode,
            contestType: formData.contestType,
            allowTeams: formData.allowTeams,
          },
        }).unwrap();

        toast.success(`${mode === "remix" ? "Remix" : "Virtual"} contest thành công và đã lưu cấu hình!`);
        router.push(`/Management/Contest/${newContestId}/problems`);
      }
      onClose();
    } catch (error) {
      const err = error as ErrorForm;
      toast.error(err?.data?.data?.message || `Không thể ${mode === "remix" ? "remix" : "tạo virtual"} contest`);
    }
  };

  const isLoading = isRemixing || isCreatingVirtual || isUpdating || isLoadingDetail;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      classNames={{
        base: "dark:bg-[#0A0F1C] rounded-[2.5rem] border border-transparent dark:border-white/10",
      }}
      closeButton={
        <Button isIconOnly variant="light" className="mt-2 mr-2 rounded-full">
          <X size={20} className="text-slate-500" />
        </Button>
      }
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-4 border-b border-slate-100 dark:border-white/5 py-6 px-10">
              <div className="flex items-center gap-3">
                {mode === "remix" ? (
                  <Copy size={24} className="text-blue-500" />
                ) : (
                  <Zap size={24} className="text-amber-500" />
                )}
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white leading-none">
                  {mode === "remix" ? "REMIX" : "VIRTUAL"}{" "}
                  <span className={mode === "remix" ? "text-blue-500" : "text-amber-500"}>CONTEST</span>
                </h2>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                {mode === "remix"
                  ? "Clone an existing contest with all problems and settings"
                  : "Create a private practice session of an ended contest"}
              </p>
            </ModalHeader>

            <ModalBody className="p-8 space-y-6">
              <div className="space-y-4">
                <Input
                  label="Contest Title"
                  placeholder="Enter new contest title"
                  value={formData.title}
                  isDisabled={mode === "virtual"}
                  onValueChange={(v) => setFormData({ ...formData, title: v })}
                  classNames={{
                    inputWrapper: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                    label: "font-black uppercase text-[10px] tracking-widest text-slate-400",
                  }}
                />

                <Textarea
                  label="Description"
                  placeholder="Enter contest description"
                  value={formData.description}
                  isDisabled={mode === "virtual"}
                  onValueChange={(v) => setFormData({ ...formData, description: v })}
                  classNames={{
                    inputWrapper: "rounded-2xl bg-slate-50 dark:bg-black/20",
                    label: "font-black uppercase text-[10px] tracking-widest text-slate-400",
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Visibility"
                    isDisabled={mode === "virtual"}
                    selectedKeys={[formData.visibilityCode]}
                    onSelectionChange={(keys) => setFormData({ ...formData, visibilityCode: Array.from(keys)[0] as string })}
                    classNames={{
                      trigger: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                      label: "font-black uppercase text-[10px] tracking-widest text-slate-400",
                    }}
                    renderValue={(items) => (
                      <div className="flex items-center gap-2 font-bold uppercase text-xs">
                        {formData.visibilityCode === "public" && <Globe size={14} className="text-green-500" />}
                        {formData.visibilityCode === "private" && <Lock size={14} className="text-amber-500" />}
                        {formData.visibilityCode === "hidden" && <EyeOff size={14} className="text-slate-500" />}
                        {items[0].textValue}
                      </div>
                    )}
                  >
                    <SelectItem key="public" textValue="Public" startContent={<Globe size={14} className="text-green-500" />}>Public</SelectItem>
                    <SelectItem key="private" textValue="Private" startContent={<Lock size={14} className="text-amber-500" />}>Private</SelectItem>
                    <SelectItem key="hidden" textValue="Hidden" startContent={<EyeOff size={14} className="text-slate-500" />}>Hidden</SelectItem>
                  </Select>

                  <Select
                    label="Contest Type"
                    isDisabled={mode === "virtual"}
                    selectedKeys={[formData.contestType]}
                    onSelectionChange={(keys) => setFormData({ ...formData, contestType: Array.from(keys)[0] as string })}
                    classNames={{
                      trigger: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                      label: "font-black uppercase text-[10px] tracking-widest text-slate-400",
                    }}
                  >
                    <SelectItem key="ACM" className="font-bold">ACM</SelectItem>
                    <SelectItem key="OI" className="font-bold">OI</SelectItem>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Contest</p>
                    <p className="text-xs font-bold text-slate-500">Allow users to participate in teams</p>
                  </div>
                  <Switch
                    isDisabled={mode === "virtual"}
                    isSelected={formData.allowTeams}
                    onValueChange={(v) => setFormData({ ...formData, allowTeams: v })}
                    color={mode === "remix" ? "primary" : "warning"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Time"
                    type="datetime-local"
                    value={formData.startAt}
                    onValueChange={(v) => setFormData({ ...formData, startAt: v })}
                    startContent={<Calendar size={16} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                      label: "font-black uppercase text-[10px] tracking-widest text-slate-400",
                    }}
                  />
                  <Input
                    label="End Time"
                    type="datetime-local"
                    value={formData.endAt}
                    onValueChange={(v) => setFormData({ ...formData, endAt: v })}
                    startContent={<Calendar size={16} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                      label: "font-black uppercase text-[10px] tracking-widest text-slate-400",
                    }}
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-slate-100 dark:border-white/5 p-8">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase text-[10px] tracking-widest text-slate-400"
              >
                Cancel
              </Button>
              <Button
                className={`font-black uppercase text-[10px] tracking-widest px-10 h-12 rounded-xl shadow-lg active:scale-95 transition-all text-white ${mode === "remix" ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-500 hover:bg-amber-600"
                  }`}
                onPress={() => handleConfirm(onClose)}
                isLoading={isLoading}
              >
                {mode === "remix" ? "Confirm Remix" : "Create Virtual Session"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
