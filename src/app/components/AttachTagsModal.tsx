"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  CheckboxGroup,
  Checkbox,
  ScrollShadow,
  Spinner,
  addToast,
} from "@heroui/react";
import { Tags } from "lucide-react";
import { toast } from "sonner";
import { useGetTagsQuery, useUpdateProblemTagsMutation } from "@/store/queries/Tags";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  problem: { id: string; title: string; tags: string[] } | null;
}

export default function AttachTagsModal({
  isOpen,
  onOpenChange,
  problem,
}: Props) {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { data: allTags, isLoading: isTagsLoading } = useGetTagsQuery(undefined, {
    skip: !isOpen
  });
  
  const [updateProblemTags, { isLoading: isUpdating }] = useUpdateProblemTagsMutation();

  useEffect(() => {
    if (isOpen && problem && allTags) {
      // Map existing tags to their IDs based on the tag name
      const existingTagIds = allTags
        .filter((tag) => problem.tags.includes(tag.name || ""))
        .map((tag) => tag.id);
      setSelectedTags(existingTagIds);
    }
  }, [isOpen, problem, allTags]);

  const handleUpdateTags = async (onClose: () => void) => {
  if (!problem) return;
  console.log(JSON.stringify({ tagIds: selectedTags }, null, 2));
  console.log("=== SENDING TAGS ===");
  console.log("problemId:", problem.id);
  console.log("tagIds gửi đi:", selectedTags);
  console.log("Payload:", { tagIds: selectedTags });

  try {
    const result = await updateProblemTags({
      problemId: problem.id,
      tagIds: selectedTags,
    }).unwrap();

    console.log("✅ Success:", result);
    onClose();
    addToast({title:"success",color:"success"})
  } catch (err: any) {
    console.error("❌ Full error:", err);
    console.error("Error data:", err?.data);
    console.error("Error status:", err?.status);
  }
};

  if (!problem) return null;

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
              <div className="p-2 bg-[#22C55E]/10 rounded-xl">
                <Tags
                  size={24}
                  className="text-[#22C55E]"
                  strokeWidth={2.5}
                />
              </div>
              {t('problem_management.attach_tags') || "Attach Tags"}
            </ModalHeader>
            <ModalBody className="px-8 py-4 overflow-x-hidden">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                  {t('problem_management.targeting') || "Targeting"}
                </p>
                <p className="text-sm font-bold italic text-[#22C55E] truncate">
              {problem.title}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
                  {t('problem_management.select_tags') || "Select Tags"}
                </span>
                
                {isTagsLoading ? (
                  <div className="flex justify-center p-4">
                    <Spinner size="md" color="success" />
                  </div>
                ) : (
                  <ScrollShadow
                    hideScrollBar
                    className="max-h-[280px] overflow-x-hidden"
                  >
                    {allTags && allTags.length > 0 ? (
                      <CheckboxGroup
                        value={selectedTags}
                        onValueChange={setSelectedTags}
                        classNames={{ wrapper: "gap-2" }}
                      >
                        {allTags.map((tag) => (
                          <Checkbox
                            key={tag.id}
                            value={tag.id}
                            classNames={{
                              base: "max-w-full w-full bg-slate-50 dark:bg-black/20 m-0 rounded-2xl border-2 border-transparent data-[selected=true]:border-[#22C55E] transition-all px-4 py-3",
                              label:
                                "font-bold italic text-sm dark:text-slate-200 w-full",
                              wrapper: "after:bg-[#22C55E]",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Tags
                                size={14}
                                className={`${
                                  selectedTags.includes(tag.id)
                                    ? "text-[#22C55E]"
                                    : "text-slate-400"
                                } transition-colors`}
                              />
                              {tag.name}
                            </div>
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    ) : (
                      <div className="flex justify-center p-4 text-slate-500 italic text-sm font-bold">
                        {t('problem_management.no_tags_found') || "No tags available."}
                      </div>
                    )}
                  </ScrollShadow>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="px-8 pb-8 mt-4 gap-3">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase italic text-xs text-slate-500"
              >
                {t('common.cancel') || "Cancel"}
              </Button>
              <Button
                className="bg-[#071739] dark:bg-[#22C55E] text-white font-[1000] uppercase italic text-xs px-8 rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
                isLoading={isUpdating}
                onPress={() => handleUpdateTags(onClose)}
              >
                {t('common.save') || "Save changes"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
