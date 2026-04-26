import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Copy, Plus, Ticket, ArrowRight, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useJoinClassMutation } from "@/store/queries/Class";
import { ErrorForm } from "@/types";

interface JoinClassModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function JoinClassModal({ isOpen, onOpenChange }: JoinClassModalProps) {
  const { t } = useTranslation();
  const [inviteCode, setInviteCode] = useState("");
  const [joinClass, { isLoading }] = useJoinClassMutation();

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;

    try {
      await joinClass({ inviteCode: inviteCode.trim() }).unwrap();
      toast.success(t("class_management.join_class_success"));
      setInviteCode("");
      onOpenChange(false);
    } catch (error) {
      const apiError = error as ErrorForm;
      toast.error(apiError?.data?.data?.message || t("class_management.join_class_fail"));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#111c35] border border-divider dark:border-white/10 shadow-2xl overflow-hidden",
        header: "border-b border-divider dark:border-white/10",
        footer: "border-t border-divider dark:border-white/10",
        closeButton: "hover:bg-default-100 active:bg-default-200",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-[1000] uppercase italic text-[#071739] dark:text-white flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both">
                <Ticket className="text-[#FF5C00]" size={24} />
                {t("class_management.join_class") || "Join Class"}
              </h2>
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="flex flex-col gap-4">
                <div 
                  className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both"
                >
                  <label className="text-xs font-bold text-slate-500 uppercase italic">
                    {t("class_management.invite_code_label") || "Invite Code"}
                  </label>
                  <Input
                    placeholder={t("class_management.invite_code_placeholder") || "Enter invite code..."}
                    value={inviteCode}
                    onValueChange={setInviteCode}
                    startContent={<Ticket size={18} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-black/30 border border-transparent dark:hover:border-white/10 transition-all font-bold italic",
                      input: "text-base font-black text-[#071739] dark:text-white"
                    }}
                    size="lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleJoin();
                      }
                    }}
                  />
                  <p className="text-[10px] text-slate-400 font-medium">
                    * {t("class_management.invite_code_desc") || "Ask your teacher for the class invite code."}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="font-bold italic animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both active:scale-95 transition-transform"
              >
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button
                color="primary"
                onPress={handleJoin}
                isLoading={isLoading}
                isDisabled={!inviteCode.trim() || isLoading}
                className="bg-blue-600 text-white font-bold italic group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both active:scale-95 transition-transform"
                endContent={!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              >
                {t("class_management.join_button") || "Join"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
