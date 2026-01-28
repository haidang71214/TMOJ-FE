"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Định nghĩa Interface để dọn sạch lỗi 'any'
interface StudentClass {
  id: string;
  name: string;
  semester: string;
}

interface LeaveClassModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedClass: StudentClass | null;
}

export default function LeaveClassModal({
  isOpen,
  onOpenChange,
  selectedClass,
}: LeaveClassModalProps) {
  const [leaveReason, setLeaveReason] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeaveClass = async (onClose: () => void) => {
    if (!leaveReason.trim()) {
      toast.error("Please enter a reason for leaving.", {
        style: { fontWeight: "bold", fontStyle: "italic" },
      });
      return;
    }

    setIsLeaving(true);
    // Giả lập xử lý API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(`Request sent!`, {
      description: `Your request to leave "${selectedClass?.id}" is pending approval.`,
      icon: <Trash2 size={16} />,
      style: { fontStyle: "italic", fontWeight: "bold" },
    });

    setIsLeaving(false);
    setLeaveReason("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-[2rem]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-danger font-[1000] italic uppercase tracking-tighter text-2xl pt-8 px-8">
              <div className="flex items-center gap-2">
                <AlertTriangle size={24} />
                Leave Class
              </div>
            </ModalHeader>
            <ModalBody className="px-8 py-4">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic mb-4">
                Are you sure you want to leave{" "}
                <span className="text-[#FF5C00] font-black">
                  {selectedClass?.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
                  Reason for leaving
                </span>
                <Textarea
                  placeholder="Tell us why you are leaving this class..."
                  value={leaveReason}
                  onValueChange={setLeaveReason}
                  variant="flat"
                  classNames={{
                    inputWrapper:
                      "bg-slate-100 dark:bg-[#071739] rounded-2xl border-2 border-transparent focus-within:!border-[#FF5C00] transition-all",
                    input:
                      "font-bold italic text-sm dark:text-white placeholder:text-slate-500",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter className="px-8 pb-8 gap-3">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase italic text-xs text-slate-500"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isLeaving}
                onPress={() => handleLeaveClass(onClose)}
                className="font-[1000] uppercase italic text-xs px-8 rounded-xl shadow-lg shadow-red-500/20"
              >
                {isLeaving ? "Processing..." : "Leave Now"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
