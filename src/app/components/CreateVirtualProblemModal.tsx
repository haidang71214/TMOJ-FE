"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { Copy, Globe, Lock, ShieldCheck } from "lucide-react";
import { useCreateVirtualProblemMutation } from "@/store/queries/problem";
import { useTranslation } from "@/hooks/useTranslation";

interface CreateVirtualProblemModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  problem: {
    id: string;
    title: string;
  } | null;
}

export default function CreateVirtualProblemModal({
  isOpen,
  onOpenChange,
  problem,
}: CreateVirtualProblemModalProps) {
  const { t } = useTranslation();
  const [createVirtual, { isLoading }] = useCreateVirtualProblemMutation();
  const [visibility, setVisibility] = useState("private");

  const handleCreate = async () => {
    console.log("🚀 handleCreate triggered");
    console.log("Target Problem:", problem);
    console.log("Selected Visibility:", visibility);
    
    if (!problem) {
      console.warn("⚠️ No problem selected for cloning");
      return;
    }

    try {
      console.log("🔄 Calling createVirtual mutation...");
      const res = await createVirtual({
        originProblemId: problem.id,
        title: `${problem.title} (Virtual)`,
        visibilityCode: visibility,
      }).unwrap();
      
      console.log("✅ Mutation Success:", res);
      
      addToast({
        title: t('common.success') || "Success",
        description: "Virtual problem created successfully",
        color: "success"
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error("❌ Mutation Error:", error);
      addToast({
        title: "Error",
        description: error?.data?.message || "Failed to create virtual problem",
        color: "danger"
      });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-[2.5rem]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3 items-center text-[#071739] dark:text-white uppercase italic font-[1000] text-xl pt-8 px-8">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Copy
                  size={24}
                  className="text-purple-500"
                  strokeWidth={2.5}
                />
              </div>
              Create Virtual
            </ModalHeader>
            <ModalBody className="px-8 py-4">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                  Origin Problem
                </p>
                <p className="text-sm font-bold italic text-purple-500 truncate">
                   {problem?.title}
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
                   Select Visibility
                </span>
                
                <Select
                  selectedKeys={[visibility]}
                  onSelectionChange={(keys) => setVisibility(Array.from(keys)[0] as string)}
                  variant="flat"
                  disallowEmptySelection
                  classNames={{
                    trigger: "bg-slate-50 dark:bg-black/20 rounded-2xl h-14 border-2 border-transparent data-[focus=true]:border-purple-500 transition-all",
                    value: "font-bold italic text-sm",
                  }}
                  startContent={
                    visibility === "published" ? <Globe size={18} className="text-emerald-500" /> :
                    visibility === "private" ? <Lock size={18} className="text-amber-500" /> :
                    <ShieldCheck size={18} className="text-blue-500" />
                  }
                >
                  <SelectItem key="public" textValue="Published">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase italic">Public</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Visible to all students</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="in-bank" textValue="In Bank">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase italic">In Bank</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Shared in global repository</span>
                    </div>
                  </SelectItem>
                </Select>

                <div className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-purple-400/80 uppercase tracking-[0.1em] leading-relaxed italic">
                        Tip: Virtual problems inherit all testcases from the origin. You can customize them later without affecting the original banked problem.
                    </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-8 pb-8 mt-4 gap-3">
              <Button 
                variant="light" 
                onPress={onClose} 
                className="font-black uppercase italic text-xs text-slate-500"
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#071739] dark:bg-purple-600 text-white font-[1000] uppercase italic text-xs px-8 rounded-xl shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
                onClick={() => {
                  console.log("🖱️ Confirm button clicked");
                  handleCreate();
                }}
                isLoading={isLoading}
              >
                Confirm Clone
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
