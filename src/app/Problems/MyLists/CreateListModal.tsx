"use client";

import React, { useState } from "react";
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

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function CreateListModal({ isOpen, onOpenChange }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      classNames={{
        // 1. Base: Dùng màu xám Slate nhưng sáng hơn (Light-Dark) để không bị chìm
        base: "dark:bg-[#2C3440] border dark:border-[#424B5A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[24px]",
        header:
          "border-b dark:border-[#424B5A]/50 text-black dark:text-white py-5 px-6",
        body: "py-6 px-6",
        footer:
          "border-t dark:border-[#424B5A]/50 bg-gray-50/50 dark:bg-[#232A33] px-6 py-4",
        closeButton: "hover:dark:bg-[#424B5A] transition-all top-4 right-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-xl font-black">
              Create New List
            </ModalHeader>
            <ModalBody className="gap-7">
              {/* Field: Title */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black text-gray-500 dark:text-[#A0AEC0] uppercase tracking-[2px]">
                  Title
                </span>
                <Input
                  placeholder="Enter a list name"
                  variant="flat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 30))}
                  classNames={{
                    // 2. Input: Dùng màu nền sáng hẳn lên để tách biệt với Modal
                    inputWrapper:
                      "dark:bg-[#3D4755] dark:hover:bg-[#475363] group-data-[focus=true]:!bg-[#3D4755] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[#ff8904] transition-all h-14 rounded-xl px-4",
                    input:
                      "dark:text-white text-base placeholder:dark:text-gray-400 font-medium",
                  }}
                  endContent={
                    <span className="text-[10px] font-bold text-gray-400 px-2">
                      {title.length}/30
                    </span>
                  }
                />
              </div>

              {/* Field: Description */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black text-gray-500 dark:text-[#A0AEC0] uppercase tracking-[2px]">
                  Description
                </span>
                <Textarea
                  placeholder="What is this list for?"
                  variant="flat"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 150))}
                  classNames={{
                    inputWrapper:
                      "dark:bg-[#3D4755] dark:hover:bg-[#475363] group-data-[focus=true]:!bg-[#3D4755] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[#ff8904] transition-all rounded-xl px-4 py-3",
                    input:
                      "dark:text-white text-sm placeholder:dark:text-gray-400 min-h-[100px] leading-relaxed",
                  }}
                  endContent={
                    <span className="text-[10px] font-bold text-gray-400 self-end mb-1">
                      {description.length}/150
                    </span>
                  }
                />
              </div>

              {/* Private Checkbox - Làm thành một khối riêng biệt */}
              <div className="dark:bg-[#1A202C]/40 p-4 rounded-2xl border dark:border-[#424B5A] flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold dark:text-white">
                    Private List
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Only you can see this list
                  </span>
                </div>
                <Checkbox
                  size="lg"
                  radius="sm"
                  classNames={{
                    wrapper: "after:!bg-[#ff8904] dark:before:border-[#424B5A]",
                  }}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="font-bold dark:text-[#A0AEC0] hover:dark:text-white text-sm"
              >
                Cancel
              </Button>
              <Button
                onPress={onClose}
                style={{ backgroundColor: "#ff8904" }}
                className="font-black text-white text-sm px-10 h-11 rounded-xl shadow-[0_10px_20px_rgba(255,137,4,0.3)] hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all"
                isDisabled={!title}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
