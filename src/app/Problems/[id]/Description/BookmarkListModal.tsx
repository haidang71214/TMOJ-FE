"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  ScrollShadow,
} from "@heroui/react";
import { Plus, Lock, Globe } from "lucide-react";

interface BookmarkFolder {
  id: string;
  title: string;
  isPrivate: boolean;
  count: number;
  isContained: boolean; // Trạng thái bài tập hiện tại đã có trong folder này chưa
}

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onCreateNew: () => void; // Hàm để mở CreateListModal
}

export default function BookmarkListModal({
  isOpen,
  onOpenChange,
  onCreateNew,
}: Props) {
  // Giả lập dữ liệu danh sách Bookmark của Rim
  const [folders, setFolders] = useState<BookmarkFolder[]>([
    {
      id: "1",
      title: "Favorite Problems",
      isPrivate: true,
      count: 12,
      isContained: true,
    },
    {
      id: "2",
      title: "Daily Practice",
      isPrivate: false,
      count: 5,
      isContained: false,
    },
    {
      id: "3",
      title: "Hard Interview Prep",
      isPrivate: true,
      count: 8,
      isContained: false,
    },
  ]);

  const handleToggleFolder = (id: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isContained: !f.isContained } : f))
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
      backdrop="blur"
      classNames={{
        base: "dark:bg-[#111c35] border-2 border-divider dark:border-white/5 shadow-2xl rounded-[2rem]",
        header:
          "border-b dark:border-white/5 text-[#071739] dark:text-white py-5 px-8",
        body: "p-0", // Để ScrollShadow tràn viền đẹp hơn
        footer: "border-t dark:border-white/5 px-8 py-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-xl font-[1000] italic uppercase tracking-tighter">
              Save to <span className="text-[#ff8904]">Bookmarks</span>
            </ModalHeader>
            <ModalBody>
              <ScrollShadow className="max-h-[350px] p-6 pt-2">
                <div className="flex flex-col gap-2">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => handleToggleFolder(folder.id)}
                      className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-white/5 group"
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          isSelected={folder.isContained}
                          onValueChange={() => handleToggleFolder(folder.id)}
                          classNames={{
                            wrapper:
                              "after:!bg-[#ff8904] before:!border-slate-400 dark:before:!border-white/20",
                          }}
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#071739] dark:text-white italic">
                              {folder.title}
                            </span>
                            {folder.isPrivate ? (
                              <Lock size={12} className="text-slate-400" />
                            ) : (
                              <Globe size={12} className="text-slate-400" />
                            )}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase">
                            {folder.count} Problems
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter className="flex flex-col gap-3">
              <Button
                fullWidth
                onPress={() => {
                  onCreateNew(); // Mở modal tạo mới
                }}
                variant="flat"
                startContent={<Plus size={18} strokeWidth={3} />}
                className="bg-slate-100 dark:bg-white/5 font-black italic uppercase text-xs h-12 rounded-xl text-[#ff8904]"
              >
                Create New Collection
              </Button>
              <Button
                fullWidth
                onPress={onClose}
                className="bg-[#ff8904] text-white font-[1000] italic uppercase h-12 rounded-xl shadow-lg shadow-[#ff8904]/20"
              >
                Done
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
