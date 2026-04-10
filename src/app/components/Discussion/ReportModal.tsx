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
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { useCreateReportMutation } from "@/store/queries/reports";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  targetId: string;
  targetType: "Comment" | "Discussion" | string;
}

export const ReportModal = ({
  isOpen,
  onOpenChange,
  targetId,
  targetType,
}: Props) => {
  const [reason, setReason] = useState("");
  const [createReport, { isLoading }] = useCreateReportMutation();

  const handleReport = async (onClose: () => void) => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do báo cáo");
      return;
    }

    try {
      const res = await createReport({ targetId, targetType, reason: reason.trim() }).unwrap();
      toast.success(res?.message || "Đã gửi báo cáo thành công");
      setReason("");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Đã xảy ra lỗi khi gửi báo cáo");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) setReason("");
        onOpenChange(open);
      }}
      backdrop="blur"
      classNames={{
        base: "rounded-[2.5rem] dark:bg-[#1C2737] border border-gray-100 dark:border-[#334155]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center text-danger uppercase italic font-[1000] text-xl tracking-tighter">
              <Flag size={22} strokeWidth={2.5} />
              Báo cáo vi phạm
            </ModalHeader>
            <ModalBody className="py-2">
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
                Hãy cho chúng tôi biết lý do bạn báo cáo {targetType === "Comment" ? "bình luận" : "bài thảo luận"} này:
              </p>
              <Textarea
                placeholder="Nhập lý do chi tiết..."
                value={reason}
                onValueChange={setReason}
                minRows={3}
                maxRows={6}
                classNames={{
                  inputWrapper: "dark:bg-[#111c35] border dark:border-[#334155] group-data-[focus=true]:border-danger",
                }}
              />
            </ModalBody>
            <ModalFooter className="gap-3 py-6">
              <Button
                variant="light"
                onPress={onClose}
                className="font-[1000] uppercase italic text-xs px-6"
                isDisabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                color="danger"
                className="font-[1000] uppercase italic text-xs px-8 shadow-lg shadow-red-500/20"
                isLoading={isLoading}
                onPress={() => handleReport(onClose)}
              >
                Gửi báo cáo
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
