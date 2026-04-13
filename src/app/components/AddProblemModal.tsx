"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Chip,
  Spinner,
} from "@heroui/react";
import { Tabs, Tab } from "@heroui/react";
import { Search, Database, X, ExternalLink, Globe, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetProblemListQueryQuery } from "@/store/queries/problem";
import { Problem, AddProblemToContestRequest } from "@/types";

interface AddProblemModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: (payload: AddProblemToContestRequest) => void;
  problemCount: number;
}

export const AddProblemModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  problemCount,
}: AddProblemModalProps) => {
  const router = useRouter();
  const [stage, setStage] = useState<"select" | "configure">("select");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchBank, setSearchBank] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  // Form state for configuration
  const [formData, setFormData] = useState<Partial<AddProblemToContestRequest>>({
    points: 100,
    penaltyPerWrong: 20,
    displayIndex: problemCount + 1,
    ordinal: problemCount + 1,
    scoringCode: "acm",
    maxScore: 100,
    outputLimitKb: 1024,
  });

  // Sync defaults when problemCount changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        displayIndex: problemCount + 1,
        ordinal: problemCount + 1,
      }));
    }
  }, [isOpen, problemCount]);

  // Hook cho Ngân hàng hệ thống (Sử dụng hook theo yêu cầu của User)
  const { data: problemsResponse, isLoading } = useGetProblemListQueryQuery(undefined, { skip: !isOpen || stage !== "select" });

  const currentBank = useMemo(() => {
    return problemsResponse?.data || [];
  }, [problemsResponse]);

  const filteredBank = useMemo(() => {
    return currentBank.filter((p) => {
      const matchSearch = p.title
        .toLowerCase()
        .includes(searchBank.toLowerCase());
      const matchDifficulty =
        filterDifficulty === "all" || p.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
      return matchSearch && matchDifficulty;
    });
  }, [currentBank, searchBank, filterDifficulty]);

  const handleSelectProblem = (prob: Problem) => {
    setSelectedProblem(prob);
    setFormData((prev) => ({
        ...prev,
        problemId: prob.id,
        alias: prob.title,
        timeLimitMs: prob.timeLimitMs || 1000,
        memoryLimitKb: prob.memoryLimitKb || 262144,
        outputLimitKb: 1024,
    }));
    setStage("configure");
  };

  const handleConfirm = () => {
    if (selectedProblem) {
      // Clean payload: remove undefined and empty strings
      const cleanedFormData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key as keyof AddProblemToContestRequest] = value as any;
        }
        return acc;
      }, {} as Partial<AddProblemToContestRequest>) as AddProblemToContestRequest;

      onConfirm(cleanedFormData);
      // Reset
      setStage("select");
      setSelectedProblem(null);
      onOpenChange();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
      closeButton={
        <Button
          isIconOnly
          variant="light"
          className="mt-2 mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <X size={20} className="text-slate-500" />
        </Button>
      }
      classNames={{
        base: "dark:bg-[#0A0F1C] rounded-[2.5rem] border border-transparent dark:border-white/10",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-4 border-b border-slate-100 dark:border-white/5 py-6 px-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database size={24} className="text-[#FF5C00]" />
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white leading-none">
                    PROBLEM <span className="text-[#FF5C00]">BANK</span>
                  </h2>
                </div>

                <Button
                  onPress={() => router.push("/Management/Problem/create")}
                  className="bg-blue-600/10 text-blue-600 dark:bg-[#FF5C00]/10 dark:text-[#FF5C00] font-black uppercase italic text-[10px] tracking-widest rounded-xl border border-blue-600/20 dark:border-[#FF5C00]/20 hover:scale-105 transition-all h-9 px-4"
                  endContent={<ExternalLink size={14} />}
                >
                  Create New Problem
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage === "select" ? "bg-[#FF5C00]" : "bg-slate-200"}`} />
                <div className={`h-0.5 w-8 bg-slate-100`} />
                <div className={`w-3 h-3 rounded-full ${stage === "configure" ? "bg-[#FF5C00]" : "bg-slate-200"}`} />
                <span className="text-[10px] font-black uppercase italic tracking-widest ml-4 text-slate-400">
                  {stage === "select" ? "Step 1: Choose Problem" : "Step 2: Configure Details"}
                </span>
              </div>
            </ModalHeader>

            <ModalBody className="p-8">
              {stage === "select" ? (
                <>
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Search problem title..."
                      startContent={<Search size={18} className="text-slate-400" />}
                      value={searchBank}
                      onValueChange={setSearchBank}
                      classNames={{
                        inputWrapper: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                      }}
                      className="flex-1 font-bold"
                    />
                    <Select
                      placeholder="Difficulty"
                      className="w-48 font-bold"
                      selectedKeys={[filterDifficulty]}
                      onSelectionChange={(keys) =>
                        setFilterDifficulty(Array.from(keys)[0] as string)
                      }
                      classNames={{
                        trigger: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                      }}
                    >
                      <SelectItem key="all" className="font-bold">All Levels</SelectItem>
                      <SelectItem key="Easy" className="font-bold text-success">Easy</SelectItem>
                      <SelectItem key="Medium" className="font-bold text-warning">Medium</SelectItem>
                      <SelectItem key="Hard" className="font-bold text-danger">Hard</SelectItem>
                    </Select>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center p-20">
                      <Spinner size="lg" color="warning" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredBank.map((libProb) => (
                        <div
                          key={libProb.id}
                          onClick={() => handleSelectProblem(libProb)}
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 transition-all cursor-pointer hover:border-blue-600 dark:hover:border-[#22C55E] group"
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-black uppercase italic group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                                {libProb.title}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase italic mt-1">
                                ID: #{libProb.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                          <Chip size="sm" variant="flat" className="font-black uppercase text-[9px]">
                            {libProb.difficulty}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-blue-600/20 dark:border-[#22C55E]/20">
                      <div className="bg-blue-600/10 dark:bg-[#22C55E]/10 p-4 rounded-2xl">
                         <Globe size={24} className="text-blue-600 dark:text-[#22C55E]" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 italic tracking-widest leading-none">Selected Problem</p>
                         <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white mt-1 uppercase">{selectedProblem?.title}</h3>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          label="ALIAS / DISPLAY TITLE"
                          labelPlacement="outside"
                          placeholder="e.g. Problem A"
                          value={formData.alias}
                          onValueChange={(val) => setFormData({...formData, alias: val})}
                          classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="number"
                            label="POINTS"
                            labelPlacement="outside"
                            value={String(formData.points)}
                            onValueChange={(val) => setFormData({...formData, points: Number(val)})}
                            classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                          />
                          <Input
                            type="number"
                            label="PENALTY"
                            labelPlacement="outside"
                            value={String(formData.penaltyPerWrong)}
                            onValueChange={(val) => setFormData({...formData, penaltyPerWrong: Number(val)})}
                            classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <Input
                             type="number"
                             label="DISPLAY INDEX / ORDER"
                             labelPlacement="outside"
                             value={String(formData.displayIndex)}
                             onValueChange={(val) => setFormData({...formData, displayIndex: Number(val)})}
                             classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                           />
                           <Input
                             type="number"
                             label="ORDINAL"
                             labelPlacement="outside"
                             value={String(formData.ordinal)}
                             onValueChange={(val) => setFormData({...formData, ordinal: Number(val)})}
                             classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <Input
                             type="number"
                             label="TIME LIMIT (MS)"
                             labelPlacement="outside"
                             placeholder={String(selectedProblem?.timeLimitMs || 1000)}
                             onValueChange={(val) => setFormData({...formData, timeLimitMs: Number(val)})}
                             classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                           />
                           <Input
                             type="number"
                             label="MEMORY LIMIT (KB)"
                             labelPlacement="outside"
                             placeholder={String(selectedProblem?.memoryLimitKb || 262144)}
                             onValueChange={(val) => setFormData({...formData, memoryLimitKb: Number(val)})}
                             classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <Input
                             type="number"
                             label="MAX SCORE"
                             labelPlacement="outside"
                             value={String(formData.maxScore)}
                             onValueChange={(val) => setFormData({...formData, maxScore: Number(val)})}
                             classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                           />
                           <Select
                             label="SCORING CODE"
                             labelPlacement="outside"
                             selectedKeys={[formData.scoringCode || "acm"]}
                             onSelectionChange={(keys) => setFormData({...formData, scoringCode: Array.from(keys)[0] as string})}
                             classNames={{ trigger: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                           >
                             <SelectItem key="acm">ACM</SelectItem>
                             <SelectItem key="oi">OI</SelectItem>
                           </Select>
                        </div>
                        <Input
                          type="number"
                          label="OUTPUT LIMIT (KB)"
                          labelPlacement="outside"
                          value={String(formData.outputLimitKb)}
                          onValueChange={(val) => setFormData({...formData, outputLimitKb: Number(val)})}
                          classNames={{ inputWrapper: "rounded-xl h-12 bg-slate-50 dark:bg-black/20" }}
                        />
                      </div>
                   </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="border-t border-slate-100 dark:border-white/5 p-8">
              {stage === "configure" ? (
                <>
                  <Button
                    variant="light"
                    onPress={() => setStage("select")}
                    className="font-black uppercase text-[10px] tracking-widest text-slate-400 mr-auto"
                    startContent={<ChevronLeft size={16} />}
                  >
                    Back to List
                  </Button>
                  <Button
                    className="bg-blue-600 dark:bg-[#22C55E] text-white font-black uppercase text-[10px] tracking-widest px-10 h-12 rounded-xl shadow-lg active:scale-95 transition-all"
                    onPress={handleConfirm}
                    endContent={<ChevronRight size={16} />}
                  >
                    Add to Contest
                  </Button>
                </>
              ) : (
                <Button
                  variant="light"
                  onPress={onClose}
                  className="font-black uppercase text-[10px] tracking-widest text-slate-400"
                >
                  Cancel
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
