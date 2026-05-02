"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
  Spinner,
  Chip,
  Pagination,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { 
  Plus, 
  Search, 
  Database, 
  Globe, 
  Clock, 
  Target, 
  Hash, 
  ChevronRight,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { useGetProblemListPublicQuery } from "@/store/queries/ProblemPublic";
import { useGetProblemBankListQuery } from "@/store/queries/problem";
import { useAddClassContestProblemMutation } from "@/store/queries/Contest";
import { useTranslation } from "@/hooks/useTranslation";
import { ErrorForm } from "@/types";

interface AddProblemToClassContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  classSemesterId: string;
  contestId: string;
  nextOrdinal: number;
}

export default function AddProblemToClassContestModal({
  isOpen,
  onClose,
  classSemesterId,
  contestId,
  nextOrdinal,
}: AddProblemToClassContestModalProps) {
  const { t } = useTranslation();
  const [addProblem, { isLoading: isAdding }] = useAddClassContestProblemMutation();

  // Search & Filter State
  const [activeSource, setActiveSource] = useState<"public" | "bank">("public");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  
  // Selected Problem Configuration
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [alias, setAlias] = useState("");
  const [points, setPoints] = useState(100);
  const [ordinal, setOrdinal] = useState(nextOrdinal);
  const [maxScore, setMaxScore] = useState(100);
  const [timeLimitMs, setTimeLimitMs] = useState(1000);
  const [memoryLimitKb, setMemoryLimitKb] = useState(256 * 1024);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setOrdinal(nextOrdinal);
  }, [nextOrdinal, isOpen]);

  // Queries
  const { data: publicProblems, isLoading: isLoadingPublic } = useGetProblemListPublicQuery({ 
    page: 1, 
    pageSize: 1000,
    search: debouncedSearch || undefined,
  }, { skip: activeSource !== "public" || !isOpen });

  const { data: bankProblems, isLoading: isLoadingBank } = useGetProblemBankListQuery({ 
    page: 1, 
    pageSize: 1000,
    search: debouncedSearch || undefined,
  }, { skip: activeSource !== "bank" || !isOpen });

  const currentProblems = useMemo(() => {
    return activeSource === "public" ? publicProblems?.data || [] : bankProblems?.data || [];
  }, [activeSource, publicProblems, bankProblems]);

  const handleSelectProblem = (prob: any) => {
    setSelectedProblem(prob);
    setAlias("");
    setPoints(100);
    setMaxScore(100);
    // You could also set default limits based on problem data if available
  };

  const handleAdd = async () => {
    if (!selectedProblem) {
      toast.error("Please select a problem first");
      return;
    }

    try {
      await addProblem({
        classSemesterId,
        contestId,
        body: {
          problemId: selectedProblem.id,
          alias: alias.trim() || undefined,
          ordinal,
          points,
          maxScore,
          timeLimitMs,
          memoryLimitKb,
        }
      }).unwrap();

      toast.success("Problem added to contest successfully!");
      setSelectedProblem(null);
      onClose();
    } catch (err: any) {
      const errorData = err as ErrorForm;
      const errorMessage = errorData?.data?.data?.message || err?.data?.message || "Failed to add problem";
      toast.error(errorMessage);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="5xl"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl h-[85vh]",
        header: "border-b border-slate-100 dark:border-white/5 p-8",
        body: "p-0 overflow-hidden",
        footer: "border-t border-slate-100 dark:border-white/5 p-8",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5C00]/10 text-[#FF5C00] flex items-center justify-center">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-[#071739] dark:text-white">
                Add Problem to Contest
              </h3>
              <p className="text-sm font-medium text-slate-400">
                Browse library and configure contest problem
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex h-full">
            {/* Left: Problem Picker */}
            <div className="w-3/5 border-r border-slate-100 dark:border-white/5 flex flex-col p-6 gap-6 bg-slate-50/30 dark:bg-slate-900/10">
              <div className="flex flex-col gap-4">
                <Tabs 
                  selectedKey={activeSource}
                  onSelectionChange={(k) => {
                    setActiveSource(k as any);
                    setPage(1); // Reset về trang 1 khi đổi tab
                  }}
                  variant="underlined"
                  color="primary"
                  classNames={{
                    tabList: "gap-6",
                    tabContent: "font-black uppercase tracking-widest text-[11px]"
                  }}
                >
                  <Tab key="public" title={<div className="flex items-center gap-2"><Globe size={16} /> Public Library</div>} />
                  <Tab key="bank" title={<div className="flex items-center gap-2"><Database size={16} /> Problem Bank</div>} />
                </Tabs>

                <Input
                  placeholder="Search problems..."
                  value={search}
                  onValueChange={setSearch}
                  startContent={<Search size={18} className="text-slate-400" />}
                  variant="faded"
                  isClearable
                />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoadingPublic || isLoadingBank ? (
                  <div className="h-full flex items-center justify-center"><Spinner /></div>
                ) : (
                  <Listbox
                    selectionMode="single"
                    onAction={(key) => {
                      const prob = currentProblems.find((p: any) => p.id === key);
                      if (prob) handleSelectProblem(prob);
                    }}
                    className="gap-2"
                  >
                    {currentProblems.map((prob: any) => (
                      <ListboxItem 
                        key={prob.id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          selectedProblem?.id === prob.id 
                            ? "border-[#FF5C00] bg-[#FF5C00]/5" 
                            : "border-transparent hover:border-slate-200 dark:hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-[#071739] dark:text-white">{prob.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Chip size="sm" variant="flat" className="text-[10px] font-black uppercase">
                                {prob.difficulty}
                              </Chip>
                              <span className="text-[10px] text-slate-400 font-mono">#{prob.slug}</span>
                            </div>
                          </div>
                          <ChevronRight size={18} className={selectedProblem?.id === prob.id ? "text-[#FF5C00]" : "text-slate-300"} />
                        </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                )}
              </div>
            </div>

            {/* Right: Configuration */}
            <div className="w-2/5 p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f172a]">
              {selectedProblem ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                    <h4 className="text-xs font-black text-blue-500 uppercase tracking-[2px] mb-2">Selected Problem</h4>
                    <p className="text-xl font-black text-[#071739] dark:text-white tracking-tight">{selectedProblem.title}</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
                      <BookOpen size={14} /> Configuration
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-5">
                      <Input
                        label="Display Alias"
                        placeholder="e.g., Problem A"
                        value={alias}
                        onValueChange={setAlias}
                        variant="faded"
                        startContent={<Hash size={16} className="text-slate-400" />}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Ordinal"
                          type="number"
                          value={ordinal.toString()}
                          onValueChange={(v) => setOrdinal(Number(v))}
                          variant="faded"
                        />
                        <Input
                          label="Points"
                          type="number"
                          value={points.toString()}
                          onValueChange={(v) => setPoints(Number(v))}
                          variant="faded"
                          startContent={<Target size={16} className="text-[#FF5C00]" />}
                        />
                      </div>
                      <Input
                        label="Max Score"
                        type="number"
                        value={maxScore.toString()}
                        onValueChange={(v) => setMaxScore(Number(v))}
                        variant="faded"
                      />
                      <Input
                        label="Time Limit (ms)"
                        type="number"
                        value={timeLimitMs.toString()}
                        onValueChange={(v) => setTimeLimitMs(Number(v))}
                        variant="faded"
                        startContent={<Clock size={16} className="text-amber-500" />}
                      />
                      <Input
                        label="Memory Limit (KB)"
                        type="number"
                        value={memoryLimitKb.toString()}
                        onValueChange={(v) => setMemoryLimitKb(Number(v))}
                        variant="faded"
                        startContent={<Database size={16} className="text-emerald-500" />}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6">
                    <Plus size={32} className="text-slate-300" />
                  </div>
                  <p className="font-black uppercase text-xs text-slate-400 tracking-widest">No problem selected</p>
                  <p className="text-[10px] text-slate-400 mt-2">Select a problem from the library to configure and add it to the contest.</p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="flat" 
            onPress={onClose}
            className="px-6 font-bold uppercase tracking-widest text-[11px]"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleAdd}
            isLoading={isAdding}
            disabled={!selectedProblem}
            startContent={!isAdding && <Plus size={16} />}
            className="px-10 font-black uppercase tracking-widest text-[11px] bg-[#FF5C00] text-white shadow-xl shadow-[#FF5C00]/20"
          >
            Add to Contest
          </Button>
        </ModalFooter>
      </ModalContent>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          display: block !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </Modal>
  );
}
