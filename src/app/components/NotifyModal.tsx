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
  Checkbox,
  Chip,
} from "@heroui/react";
import { Bell, Send, Mail, Globe, Users } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  studentEmail?: string; // Nếu không có cái này, mặc định là Notify All
}

export default function NotifyModal({
  isOpen,
  onOpenChange,
  studentEmail,
}: Props) {
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Xác định chế độ: Gửi cá nhân hay Gửi tất cả
  const isNotifyAll = !studentEmail;

  const handleSend = async (onClose: () => void) => {
    setIsSending(true);

    // Giả lập API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(isNotifyAll ? "Broadcast Sent!" : "Notification Sent!", {
      description: isNotifyAll
        ? "Everyone have been notified."
        : `Message sent to ${studentEmail}`,
    });

    setIsSending(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{ base: "rounded-[2rem] dark:bg-[#111827]" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center uppercase italic font-[1000] text-2xl tracking-tighter">
              <Bell
                size={24}
                className={isNotifyAll ? "text-blue-500" : "text-amber-500"}
              />
              {isNotifyAll ? "Class Notify" : "Private Notify"}
            </ModalHeader>
            <ModalBody className="py-6 space-y-4">
              {/* Recipient Info Section */}
              <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-divider">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isNotifyAll ? "bg-blue-500/10" : "bg-amber-500/10"
                    }`}
                  >
                    {isNotifyAll ? (
                      <Users size={16} className="text-blue-500" />
                    ) : (
                      <Mail size={16} className="text-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                      Recipient Group
                    </p>
                    {isNotifyAll ? (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-black italic uppercase text-[9px]"
                      >
                        All Enrolled
                      </Chip>
                    ) : (
                      <p className="text-sm font-bold italic text-[#071739] dark:text-white">
                        {studentEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Textarea
                label="Message Content"
                labelPlacement="outside"
                placeholder={
                  isNotifyAll
                    ? "Announce something to the whole class..."
                    : "Type a private message..."
                }
                variant="bordered"
                minRows={4}
                classNames={{
                  label:
                    "font-black uppercase text-[10px] italic text-slate-400",
                  input: "font-bold italic text-sm py-2",
                }}
              />

              {/* Options */}
              <div className="space-y-3 pt-2">
                <p className="font-black uppercase text-[10px] italic text-slate-400">
                  Sending Options
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-1">
                    <Globe size={14} className="text-blue-500" />
                    <p className="text-[11px] font-bold italic text-slate-500">
                      System Notification
                    </p>
                  </div>
                  <Checkbox
                    isSelected={sendViaEmail}
                    onValueChange={setSendViaEmail}
                    color={isNotifyAll ? "primary" : "warning"}
                    classNames={{
                      label:
                        "text-[11px] font-black uppercase italic text-[#071739] dark:text-white",
                    }}
                  >
                    Send to {isNotifyAll ? "everyone's" : "'s"} personal Email
                  </Checkbox>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t dark:border-white/5 pt-4">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase italic text-xs px-6"
                isDisabled={isSending}
              >
                Cancel
              </Button>
              <Button
                color={isNotifyAll ? "primary" : "warning"}
                className="font-black uppercase italic text-xs px-10 shadow-lg"
                isLoading={isSending}
                startContent={!isSending && <Send size={16} />}
                onPress={() => handleSend(onClose)}
              >
                {isNotifyAll ? "Send All" : "Send Message"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
