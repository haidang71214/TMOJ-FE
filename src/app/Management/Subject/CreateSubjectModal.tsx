"use client";

import React, { useState } from "react";
import { Input, Button, Textarea } from "@heroui/react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useCreateSubjectMutation } from "@/store/queries/Subject";
import { useModal } from "@/Provider/ModalProvider";
import { RequiredStar } from "@/Provider/RequiredStar";

export default function CreateSubjectModal() {
  const { closeModal } = useModal();
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.code || !form.name || !form.description) {
        toast.error("Please fill all required fields.");
        return;
      }
      await createSubject(form).unwrap();
      toast.success("Subject Created!", {
        description: "New subject has been added to the system.",
      });
      closeModal();
    } catch (error) {
      console.error("Failed to create subject:", error);
      toast.error("Failed to create subject.");
    }
  };

  return (
    <div className="w-[480px] rounded-2xl overflow-hidden bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/10 shadow-xl">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#071739]/50">
        <h2 className="text-xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white">
          New <span className="text-[#FF5C00]">Subject</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
          Add academic subject details
        </p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        <Input
          label={
            <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
              Subject Code <RequiredStar rules={["Subject code is required"]} />
            </div>
          }
          placeholder="e.g. CS101"
          value={form.code}
          onChange={(e) => handleChange("code", e.target.value)}
          variant="bordered"
          labelPlacement="outside"
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#071739]/30 border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00]",
            input: "font-bold text-[#071739] dark:text-white",
          }}
        />

        <Input
          label={
            <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
              Subject Name <RequiredStar rules={["Subject name is required"]} />
            </div>
          }
          placeholder="e.g. Introduction to CS"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          variant="bordered"
          labelPlacement="outside"
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#071739]/30 border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00]",
            input: "font-bold text-[#071739] dark:text-white",
          }}
        />

        <Textarea
          label={
            <div className="flex items-center gap-1 font-black text-[10px] uppercase italic text-slate-400">
              Description <RequiredStar rules={["Description is required"]} />
            </div>
          }
          placeholder="Brief description of the subject..."
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          variant="bordered"
          labelPlacement="outside"
          minRows={3}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#071739]/30 border-slate-200 dark:border-white/10 focus-within:!border-[#FF5C00]",
            input: "font-bold text-[#071739] dark:text-white",
          }}
        />
      </div>

      <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50 dark:bg-[#071739]/50 border-t border-slate-100 dark:border-white/5">
        <Button
          variant="light"
          onPress={closeModal}
          isDisabled={isLoading}
          className="font-black text-[10px] uppercase italic text-slate-500"
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          onPress={handleSubmit}
          startContent={!isLoading && <Save size={16} />}
          className="bg-[#FF5C00] text-white font-black text-[10px] uppercase italic shadow-lg"
        >
          Create Subject
        </Button>
      </div>
    </div>
  );
}
