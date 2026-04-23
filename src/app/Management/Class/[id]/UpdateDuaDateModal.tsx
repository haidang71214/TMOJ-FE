"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Divider,
} from "@heroui/react";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";

import { useModal } from "@/Provider/ModalProvider";
import { useSetSlotDueDateMutation } from "@/store/queries/ClassSlot";

interface Props {
  semesterId: string;
  slotId: string;
  dueAt?: string | null;
  closeAt?: string | null;
}

export default function UpdateDueDateModal({
  semesterId,
  slotId,
  dueAt,
  closeAt,
}: Props) {
  const { closeModal } = useModal();

  const [updateDueDate, { isLoading }] = useSetSlotDueDateMutation();

  const [dueDate, setDueDate] = useState(dueAt ?? "");
  const [closeDate, setCloseDate] = useState(closeAt ?? "");

  const handleSubmit = async () => {
    try {
      const res = await updateDueDate({
        semesterId,
        slotId,
        data: {
          dueAt: dueDate,
          closeAt: closeDate || undefined,
        },
      }).unwrap();
      console.log(res);
      
      toast.success("Due date updated");
      closeModal();
    } catch {
      toast.error("Failed to update due date");
    }
  };

  return (
    <div className="w-[460px] bg-white dark:bg-[#0f172a] p-7 rounded-3xl flex flex-col gap-6 shadow-2xl border dark:border-white/10">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600 text-white">
          <CalendarClock size={18} />
        </div>

        <div>
          <h3 className="font-black text-lg text-[#071739] dark:text-white uppercase tracking-wide">
            Update Deadline
          </h3>
          <p className="text-xs text-slate-500">
            Configure submission and closing time
          </p>
        </div>
      </div>

      <Divider />

      {/* INPUTS */}


<div className="flex flex-col gap-3">

  <Input
    label="Submission Deadline"
    placeholder="YYYY-MM-DD"
              type="datetime-local"
    value={dueDate}
    onValueChange={setDueDate}
    variant="bordered"
      description="Students must submit before this time"
        
             classNames={{
                inputWrapper:
                  "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
                label: "text-gray-500 dark:text-slate-400",
                input: "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
              }}
  />

  <Input
    label="Close Time (Optional)"
placeholder="YYYY-MM-DD"
              type="datetime-local"
    value={closeDate}
    onValueChange={setCloseDate}
    variant="bordered"
      description="Submissions are locked after this time"
        
    classNames={{
                inputWrapper:
                  "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
                label: "text-gray-500 dark:text-slate-400",
                input: "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500",
              }}
  />

</div>

      <Divider />

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">

        <Button
          variant="flat"
          radius="lg"
          onPress={closeModal}
          className="font-semibold"
        >
          Cancel
        </Button>

        <Button
          color="primary"
          radius="lg"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="font-bold px-6"
        >
          Update Deadline
        </Button>

      </div>
    </div>
  );
}