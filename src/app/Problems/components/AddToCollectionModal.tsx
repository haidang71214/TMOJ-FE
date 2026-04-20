"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Listbox,
  ListboxItem,
  useDisclosure,
} from "@heroui/react";
import { Bookmark, Plus, Notebook, Lock, Globe, Heart } from "lucide-react";
import { toast } from "sonner";
import {
  useGetCollectionsQuery,
  useAddProblemToCollectionMutation,
  useAddContestToCollectionMutation
} from "@/store/queries/collections";
import CreateListModal from "../MyLists/CreateListModal";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  problemId?: string;
  contestId?: string;
}

export default function AddToCollectionModal({
  isOpen,
  onOpenChange,
  problemId,
  contestId,
}: Props) {
  const { data: collectionsResponse, isLoading } = useGetCollectionsQuery();
  const [addProblemToCollection, { isLoading: isAddingProblem }] = useAddProblemToCollectionMutation();
  const [addContestToCollection, { isLoading: isAddingContest }] = useAddContestToCollectionMutation();

  const {
    isOpen: isCreateOpen,
    onOpen: onOpenCreate,
    onOpenChange: onOpenChangeCreate
  } = useDisclosure();

  const rawCollections: any = collectionsResponse?.data;
  const collections = Array.isArray(rawCollections)
    ? rawCollections
    : rawCollections?.data || rawCollections?.items || [];

  const handleAdd = async (collectionId: string, collectionName: string) => {
    try {
      if (problemId) {
        await addProblemToCollection({ id: collectionId, problemId }).unwrap();
      } else if (contestId) {
        await addContestToCollection({ id: collectionId, contestId }).unwrap();
      } else {
        return;
      }

      toast.success(`Added ${problemId ? "problem" : "contest"} to "${collectionName}"`);
      onOpenChange(); // Close modal on success
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to add to "${collectionName}"`);
    }
  };

  const typeLabel = problemId ? "problem" : "contest";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "dark:bg-[#111c35] border-2 border-divider dark:border-white/5 shadow-2xl rounded-[2.5rem]",
          header: "border-b dark:border-white/5 text-[#071739] dark:text-white py-6 px-8",
          body: "py-6 px-4 no-scrollbar",
          footer: "border-t dark:border-white/5 bg-gray-50/30 dark:bg-black/20 px-8 py-6",
          closeButton: "hover:dark:bg-white/10 transition-all top-6 right-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                    <Bookmark size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-[1000] italic uppercase tracking-tighter leading-none">
                      Add to <span className="text-[#FF5C00]">Collection</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                      Choose a list to bookmark this {typeLabel}
                    </p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                    <div className="w-8 h-8 border-4 border-blue-100 dark:border-white/5 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Loading lists...</p>
                  </div>
                ) : collections.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-4 text-center px-10">
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-full text-slate-300 dark:text-slate-600">
                      <Notebook size={40} strokeWidth={1} />
                    </div>
                    <p className="text-sm font-bold text-slate-500">You don't have any collections yet.</p>
                    <Button
                      onPress={onOpenCreate}
                      className="bg-[#FF5C00] text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-10 px-6 mt-2"
                    >
                      Create First Collection
                    </Button>
                  </div>
                ) : (
                  <Listbox
                    aria-label="Collections"
                    className="p-2 gap-2"
                    onAction={(key) => {
                      const col = collections.find((c: any) => c.id === String(key));
                      if (col) handleAdd(col.id, col.name);
                    }}
                  >
                    {collections.map((col: any) => (
                      <ListboxItem
                        key={col.id}
                        textValue={col.name}
                        className="h-20 px-5 rounded-3xl bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 hover:border-[#FF5C00] dark:hover:border-[#FF5C00] hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all group mb-2 shadow-sm hover:shadow-orange-500/10"
                        startContent={
                          <div className="p-3 bg-slate-50 dark:bg-[#071739] rounded-2xl shadow-inner text-blue-500 dark:text-blue-400 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-[#FF5C00]/20 group-hover:text-[#FF5C00] transition-all duration-300">
                            {col.type?.toLowerCase() === 'heart' || col.type?.toLowerCase() === 'problem_favorite' ? <Heart size={20} fill={col.type?.toLowerCase() === 'heart' ? "currentColor" : "none"} /> : <Bookmark size={20} />}
                          </div>
                        }
                        endContent={
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
                              {!col.isVisibility ? (
                                <Lock size={14} className="text-slate-400" />
                              ) : (
                                <Globe size={14} className="text-slate-400" />
                              )}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#FF5C00] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all shadow-lg shadow-orange-500/40">
                              <Plus size={18} strokeWidth={3} />
                            </div>
                          </div>
                        }
                      >
                        <div className="flex flex-col gap-0.5 ml-2">
                          <span className="text-sm font-[1000] text-[#071739] dark:text-white uppercase italic tracking-tight truncate group-hover:text-[#FF5C00] transition-colors">
                            {col.name}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                            {col.items?.length || 0} Items
                          </span>
                        </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                )}
              </ModalBody>

              <ModalFooter>
                <div className="w-full flex items-center justify-between">
                  <Button
                    variant="light"
                    onPress={onClose}
                    className="font-black text-slate-400 hover:text-slate-600 dark:hover:text-white text-[10px] uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={onOpenCreate}
                    variant="flat"
                    className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] uppercase tracking-widest px-6 h-11 rounded-2xl border border-blue-100 dark:border-blue-500/20 shadow-sm shadow-blue-500/10 active-bump"
                    startContent={<Plus size={16} strokeWidth={3} />}
                  >
                    Create New List
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <CreateListModal
        isOpen={isCreateOpen}
        onOpenChange={onOpenChangeCreate}
        isEdit={false}
        editData={null}
      />
    </>
  );
}
