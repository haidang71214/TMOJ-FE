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
  Pagination,
} from "@heroui/react";
import { Search, Plus, Trash2, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { useAddProblemToCollectionMutation, useDeleteCollectionItemMutation } from "@/store/queries/collections";
import { useGetProblemListPublicQuery } from "@/store/queries/ProblemPublic";
import { useTranslation } from "@/hooks/useTranslation";
import { ErrorForm } from "@/types";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  collectionId: string;
  existingItems: any[];
}

export default function AddQuestionsToCollectionModal({
  isOpen,
  onOpenChange,
  collectionId,
  existingItems = [],
}: Props) {
  const { language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data: problemResponse, isLoading } = useGetProblemListPublicQuery({
    page,
    pageSize,
    search: searchQuery.trim() !== "" ? searchQuery.trim() : undefined,
  });

  const [addProblem] = useAddProblemToCollectionMutation();
  const [deleteItem] = useDeleteCollectionItemMutation();
  const [actionId, setActionId] = useState<string | null>(null);

  const problems = problemResponse?.data || [];
  const totalPages = problemResponse?.pagination?.totalPages || 1;

  // Map existing items for quick lookup by problemId
  const existingAddedProblemIds = existingItems.map((it) => it.problemId);

  const handleAdd = async (problemId: string, title: string) => {
    setActionId(problemId);
    try {
      await addProblem({ id: collectionId, problemId }).unwrap();
      toast.success(`"${title}" ${language === 'vi' ? 'đã được thêm vào danh sách!' : 'added to list!'}`);
    } catch (err) {
      const apiError = err as ErrorForm;
      toast.error(apiError?.data?.data?.message || `Failed to add "${title}"`);
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (problemId: string, title: string) => {
    setActionId(problemId);
    try {
      // THE FIX: Find the internal bookmark ID (id) of the item that has this problemId
      const targetItem = existingItems.find(it => it.problemId === problemId);
      if (!targetItem?.id) {
        throw new Error("Could not find bookmark ID for this problem");
      }

      await deleteItem({ id: collectionId, itemId: targetItem.id }).unwrap();
      toast.success(`"${title}" ${language === 'vi' ? 'đã được xóa khỏi danh sách!' : 'removed from list!'}`);
    } catch (err) {
      const apiError = err as ErrorForm;
      toast.error(apiError?.data?.data?.message || (err as Error).message || `Failed to remove "${title}"`);
    } finally {
      setActionId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "dark:bg-[#111c35] border-2 border-divider dark:border-white/5 shadow-2xl rounded-[2.5rem]",
        header: "border-b dark:border-white/5 text-[#071739] dark:text-white py-6 px-8",
        body: "py-6 px-8 no-scrollbar min-h-[400px]",
        footer: "border-t dark:border-white/5 bg-gray-50/30 dark:bg-black/20 px-8 py-6",
        closeButton: "hover:dark:bg-white/10 transition-all top-6 right-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-2xl text-[#FF5C00]">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-xl font-[1000] italic uppercase tracking-tighter leading-none">
                    Add <span className="text-[#FF5C00]">Questions</span>
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    Select public problems to add to this collection
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="gap-6 mt-2">
              {/* Search Bar */}
              <Input
                placeholder="SEARCH FOR PROBLEMS..."
                value={searchQuery}
                onValueChange={(v) => {
                  setSearchQuery(v);
                  setPage(1);
                }}
                startContent={<Search size={18} className="text-slate-400" strokeWidth={2.5} />}
                classNames={{
                  inputWrapper: "bg-slate-100 dark:bg-[#071739] h-12 rounded-2xl border-2 border-transparent focus-within:border-[#FF5C00] transition-all",
                  input: "text-sm font-bold placeholder:text-slate-400 italic",
                }}
              />

              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
                  <div className="w-10 h-10 border-4 border-orange-500/10 border-t-[#FF5C00] rounded-full animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Scanning Library...</p>
                </div>
              ) : problems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center opacity-70 mt-10">
                  <AlertCircle size={48} className="text-slate-300" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-black uppercase italic">No Problems Found</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Try a different search term</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {problems.map((p: any) => {
                    const isAdded = existingAddedProblemIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#071739]/50 rounded-[1.5rem] border-2 border-transparent hover:border-[#FF5C00]/30 transition-all group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex flex-col min-w-0 ml-2">
                            <h4 className="text-sm font-black text-[#071739] dark:text-white truncate uppercase italic">
                              {p.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${p.difficulty?.toLowerCase() === 'easy' ? 'bg-teal-500/10 text-teal-500' :
                                p.difficulty?.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                  'bg-rose-500/10 text-rose-500'
                                }`}>
                                {p.difficulty || "Medium"}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">
                                {p.acceptanceRate || "0.0"}% Acc.
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          isLoading={actionId === p.id}
                          onPress={isAdded ? () => handleRemove(p.id, p.title) : () => handleAdd(p.id, p.title)}
                          className={`font-black text-[10px] uppercase tracking-widest rounded-xl transition-all h-9 px-6 ${isAdded
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-sm'
                            : 'bg-white dark:bg-[#FF5C00] text-[#071739] shadow-sm shadow-orange-500/20'
                            }`}
                          startContent={actionId !== p.id && (isAdded ? <Trash2 size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />)}
                        >
                          {actionId === p.id ? (isAdded ? (language === 'vi' ? 'Đang xóa...' : 'Removing...') : (language === 'vi' ? 'Đang thêm...' : 'Adding...')) : (isAdded ? (language === 'vi' ? 'Xóa' : 'Delete') : (language === 'vi' ? 'Thêm' : 'Add'))}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex-col gap-4">
              {totalPages > 1 && (
                <div className="flex justify-center w-full">
                  <Pagination
                    total={totalPages}
                    page={page}
                    onChange={setPage}
                    size="sm"
                    classNames={{
                      cursor: "bg-[#FF5C00] text-white font-black",
                    }}
                  />
                </div>
              )}
              <div className="w-full flex justify-end">
                <Button
                  onPress={onClose}
                  className="bg-[#071739] dark:bg-white text-white dark:text-[#071739] font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl h-12 px-10 shadow-lg active-bump"
                >
                  Done Adding
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
