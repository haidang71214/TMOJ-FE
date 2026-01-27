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
  Textarea,
  Checkbox,
} from "@heroui/react";
import { toast } from "sonner"; // Đảm bảo đã cài đặt sonner

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  editData?: {
    id: string;
    title: string;
    isPrivate: boolean;
    description?: string;
  } | null;
  isEdit: boolean;
}

export default function CreateListModal({
  isOpen,
  onOpenChange,
  editData,
  isEdit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (isEdit && editData) {
      setTitle(editData.title);
      setDescription(editData.description || "");
      setIsPrivate(editData.isPrivate);
    } else {
      setTitle("");
      setDescription("");
      setIsPrivate(false);
    }
  }, [isEdit, editData, isOpen]);

  // Hàm xử lý khi nhấn Lưu hoặc Tạo
  const handleAction = (onClose: () => void) => {
    // Giả lập xử lý lưu dữ liệu ở đây

    if (isEdit) {
      toast.success("Bookmark updated!", {
        description: `Collection "${title}" has been updated successfully.`,
        style: { fontWeight: "bold", fontStyle: "italic" },
      });
    } else {
      toast.success("New collection created!", {
        description: `"${title}" is ready for your problems.`,
        style: { fontWeight: "bold", fontStyle: "italic" },
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      backdrop="blur"
      classNames={{
        base: "dark:bg-[#111c35] border-2 border-divider dark:border-white/5 shadow-2xl rounded-[2rem]",
        header:
          "border-b dark:border-white/5 text-[#071739] dark:text-white py-6 px-8",
        body: "py-8 px-8",
        footer:
          "border-t dark:border-white/5 bg-gray-50/30 dark:bg-black/20 px-8 py-6",
        closeButton: "hover:dark:bg-white/10 transition-all top-6 right-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl font-[1000] italic uppercase tracking-tighter">
              {isEdit ? "Update" : "Create New"}{" "}
              <span className="text-[#ff8904]">Bookmark</span>
            </ModalHeader>
            <ModalBody className="gap-8">
              {/* Field: Title */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-[2px] italic">
                  Bookmark Title
                </span>
                <Input
                  placeholder="Enter a list name"
                  variant="flat"
                  value={title}
                  onValueChange={setTitle}
                  maxLength={30}
                  classNames={{
                    // SỬA MÀU: Nền trắng ở Light mode, xanh đậm ở Dark mode. Focus sẽ đổi màu border.
                    inputWrapper: [
                      "bg-slate-100 dark:bg-[#071739]",
                      "hover:bg-slate-200 dark:hover:bg-[#071739]/80",
                      "group-data-[focus=true]:!bg-white dark:group-data-[focus=true]:!bg-[#071739]",
                      "border-2 border-transparent",
                      "group-data-[focus=true]:border-[#ff8904]",
                      "transition-all h-14 rounded-2xl px-5 shadow-none",
                    ].join(" "),
                    input:
                      "text-[#071739] dark:text-white text-base font-bold italic placeholder:text-slate-400 dark:placeholder:text-slate-500",
                  }}
                  endContent={
                    <span className="text-[10px] font-black text-slate-500 px-2 italic">
                      {title.length}/30
                    </span>
                  }
                />
              </div>

              {/* Field: Description */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-[2px] italic">
                  Description (Optional)
                </span>
                <Textarea
                  placeholder="What is this collection for?"
                  variant="flat"
                  value={description}
                  onValueChange={setDescription}
                  maxLength={150}
                  classNames={{
                    inputWrapper: [
                      "bg-slate-100 dark:bg-[#071739]",
                      "hover:bg-slate-200 dark:hover:bg-[#071739]/80",
                      "group-data-[focus=true]:!bg-white dark:group-data-[focus=true]:!bg-[#071739]",
                      "border-2 border-transparent",
                      "group-data-[focus=true]:border-[#ff8904]",
                      "transition-all rounded-2xl px-5 py-4 shadow-none",
                    ].join(" "),
                    input:
                      "text-[#071739] dark:text-white text-sm font-bold italic placeholder:text-slate-400 dark:placeholder:text-slate-500 min-h-[100px]",
                  }}
                  endContent={
                    <span className="text-[10px] font-black text-slate-500 self-end mb-1 italic">
                      {description.length}/150
                    </span>
                  }
                />
              </div>

              {/* Private Checkbox Container */}
              <div className="bg-slate-50 dark:bg-[#071739]/50 p-5 rounded-[1.5rem] border-2 border-divider dark:border-white/5 flex items-center justify-between group hover:border-[#ff8904]/30 transition-all">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white">
                    Private Collection
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 italic uppercase">
                    Only you can view these problems
                  </span>
                </div>
                <Checkbox
                  size="lg"
                  isSelected={isPrivate}
                  onValueChange={setIsPrivate}
                  classNames={{
                    wrapper:
                      "after:!bg-[#ff8904] before:!border-slate-400 dark:before:!border-white/20",
                  }}
                />
              </div>
            </ModalBody>

            <ModalFooter className="gap-4">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black text-slate-500 dark:text-slate-400 hover:text-[#071739] hover:dark:text-white uppercase italic text-xs tracking-wider"
              >
                Discard
              </Button>
              <Button
                onPress={() => handleAction(onClose)}
                className="font-[1000] text-white italic uppercase text-xs px-10 h-12 rounded-2xl bg-[#ff8904] shadow-[0_10px_30px_rgba(255,137,4,0.3)] hover:brightness-110 active:scale-95 transition-all"
                isDisabled={!title}
              >
                {isEdit ? "Save Changes" : "Create Now"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
