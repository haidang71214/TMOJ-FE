"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  userName?: string; // Đổi từ studentName thành userName
  type?: "student" | "teacher"; // Thêm type để phân biệt đối tượng
}

export default function DeleteModal({
  isOpen,
  onOpenChange,
  userName,
  type = "student",
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (onClose: () => void) => {
    setIsDeleting(true);

    // Giả lập thời gian xử lý API xóa
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Hiển thị thông báo thành công tùy theo đối tượng
    const message =
      type === "teacher"
        ? "Faculty member removed successfully"
        : "Student removed successfully";

    const desc =
      type === "teacher"
        ? `${userName} has been removed from the faculty list.`
        : `${userName} has been kicked out of the class.`;

    toast.error(message, {
      description: desc,
      icon: <Trash2 size={16} />,
    });

    setIsDeleting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        // Cập nhật màu dark mode sang #111c35 đồng bộ với Class Page
        base: "rounded-[2.5rem] dark:bg-[#111c35] border border-divider dark:border-white/5",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center text-danger uppercase italic font-[1000] text-xl tracking-tighter">
              <AlertTriangle size={22} strokeWidth={2.5} />
              Confirm Removal
            </ModalHeader>
            <ModalBody className="py-6">
              <p className="text-sm font-bold italic text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="text-[#071739] dark:text-white font-[1000]">
                  &quot;{userName}&quot;
                </span>{" "}
                {/* {type === "teacher"
                  ? "from the system staff list?"
                  : "from this class?"}{" "} */}
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter className="gap-3">
              <Button
                variant="light"
                onPress={onClose}
                className="font-[1000] uppercase italic text-xs px-6"
                isDisabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                className="font-[1000] uppercase italic text-xs px-8 shadow-lg shadow-red-500/20"
                isLoading={isDeleting}
                onPress={() => handleDelete(onClose)}
              >
                {isDeleting
                  ? "Removing..."
                  : `Remove 
                  `}
                {/* ${type === "teacher" ? "Instructor" : "Student"} */}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
