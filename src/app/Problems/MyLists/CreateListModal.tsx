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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" radius="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-bold">
              Create New List
            </ModalHeader>
            <ModalBody className="gap-6 py-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-gray-700">Title</span>
                <Input
                  placeholder="Enter a list name"
                  variant="bordered"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 30))}
                  endContent={
                    <span className="text-[10px] text-gray-400">
                      {title.length}/30
                    </span>
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-gray-700">
                  Description
                </span>
                <Textarea
                  placeholder="Describe your list"
                  variant="bordered"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 150))}
                  endContent={
                    <span className="text-[10px] text-gray-400 self-end mb-1">
                      {description.length}/150
                    </span>
                  }
                />
              </div>

              <Checkbox
                size="sm"
                classNames={{ label: "text-sm font-bold text-gray-700" }}
              >
                Private
              </Checkbox>
            </ModalBody>
            <ModalFooter className="border-t border-gray-100">
              <Button
                variant="flat"
                onPress={onClose}
                className="font-bold bg-gray-100 text-gray-600"
              >
                Cancel
              </Button>
              <Button
                color="default"
                onPress={onClose}
                className="font-bold bg-gray-800 text-white"
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
