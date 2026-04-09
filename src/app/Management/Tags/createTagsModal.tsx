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
} from "@heroui/react";
import { toast } from "sonner";
import { useCreateTagMutation } from "@/store/queries/Tags";
import { ErrorForm } from "@/types";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTagsModal({ isOpen, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  
  const [createTag, { isLoading }] = useCreateTagMutation();

  const handleCreate = async (onClose: () => void) => {
    try {
      if (!name.trim()) {
        toast.error("Tag name is required");
        return;
      }
      
      const payload = {
        name: name.trim(),
        slug: slug.trim() || null,
      };

      await createTag(payload).unwrap();
      toast.success("Tag created successfully");
      setName("");
      setSlug("");
      onClose();
    } catch (error) {
      toast.error((error as ErrorForm)?.data?.data?.message || "Failed to create tag");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent className="bg-white dark:bg-[#111c35]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-6 px-6">
              <h2 className="text-2xl font-black text-[#071739] dark:text-white uppercase italic tracking-tighter">
                CREATE NEW <span className="text-[#FF5C00]">TAG</span>
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                Add a new problem tag to the system
              </p>
            </ModalHeader>
            <ModalBody className="px-6 py-4">
              <div className="space-y-4">
                <Input
                  label="Tag Name"
                  placeholder="e.g. Dynamic Programming"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-sm",
                    label: "font-bold text-sm",
                  }}
                  autoFocus
                />
                <Input
                  label="Slug (Optional)"
                  placeholder="e.g. dynamic-programming"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-sm",
                    label: "font-bold text-sm",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter className="px-6 pb-6">
              <Button color="danger" variant="light" onPress={onClose} className="font-bold">
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => handleCreate(onClose)}
                isLoading={isLoading}
                className="bg-[#071739] dark:bg-[#FF5C00] font-bold text-white shadow-lg"
              >
                Create Tag
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
