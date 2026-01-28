"use client";
import React, { useState } from "react";
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
} from "@heroui/react";
import { Bookmark, FolderPlus } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  problem: { id: number; title: string } | null;
}

const MOCK_BOOKMARKS = [
  { id: "fav", title: "Favorite Problems" },
  { id: "dp", title: "Dynamic Programming" },
  { id: "graph", title: "Graph Algorithms" },
  { id: "math", title: "Math Challenges" },
  { id: "interview", title: "Interview Prep 2026" },
  { id: "daily", title: "Daily Training" },
];

export default function ArchiveProblemModal({
  isOpen,
  onOpenChange,
  problem,
}: Props) {
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = async (onClose: () => void) => {
    if (selectedBookmarks.length === 0) {
      toast.error("Please select at least one bookmark.");
      return;
    }

    setIsArchiving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Problem archived!", {
      description: `"${problem?.title}" added to ${selectedBookmarks.length} lists.`,
      style: { fontWeight: "bold", fontStyle: "italic" },
    });

    setIsArchiving(false);
    setSelectedBookmarks([]);
    onClose();
  };

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
              <div className="p-2 bg-[#FF5C00]/10 rounded-xl">
                <FolderPlus
                  size={24}
                  className="text-[#FF5C00]"
                  strokeWidth={2.5}
                />
              </div>
              Archive Problem
            </ModalHeader>
            <ModalBody className="px-8 py-4 overflow-x-hidden">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                  Targeting
                </p>
                <p className="text-sm font-bold italic text-[#FF5C00] truncate">
                  #{problem?.id} - {problem?.title}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
                  Select Bookmarks
                </span>
                <ScrollShadow
                  hideScrollBar
                  className="max-h-[280px] overflow-x-hidden"
                >
                  <CheckboxGroup
                    value={selectedBookmarks}
                    onValueChange={setSelectedBookmarks}
                    classNames={{ wrapper: "gap-2" }}
                  >
                    {MOCK_BOOKMARKS.map((bm) => (
                      <Checkbox
                        key={bm.id}
                        value={bm.id}
                        classNames={{
                          base: "max-w-full w-full bg-slate-50 dark:bg-black/20 m-0 rounded-2xl border-2 border-transparent data-[selected=true]:border-[#FF5C00] transition-all px-4 py-3",
                          label:
                            "font-bold italic text-sm dark:text-slate-200 w-full",
                          wrapper: "after:bg-[#FF5C00]",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Bookmark
                            size={14}
                            className={`${
                              selectedBookmarks.includes(bm.id)
                                ? "text-[#FF5C00]"
                                : "text-slate-400"
                            } transition-colors`}
                          />
                          {bm.title}
                        </div>
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </ScrollShadow>
              </div>
            </ModalBody>
            <ModalFooter className="px-8 pb-8 mt-4 gap-3">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase italic text-xs text-slate-500"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] uppercase italic text-xs px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                isLoading={isArchiving}
                onPress={() => handleArchive(onClose)}
              >
                Save to Bookmarks
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
