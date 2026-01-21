"use client";
import React, { useState, useMemo } from "react";
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
} from "@heroui/react";
import { Search, Database, X } from "lucide-react";

// Định nghĩa interface cho dữ liệu tĩnh
interface ProblemBankItem {
  id: string;
  title: string;
  difficulty: string;
}

const PROBLEM_BANK_DATA: ProblemBankItem[] = [
  { id: "601", title: "Reverse Integer", difficulty: "Easy" },
  { id: "602", title: "String to Integer", difficulty: "Medium" },
  { id: "603", title: "Container With Most Water", difficulty: "Hard" },
  { id: "604", title: "Integer to Roman", difficulty: "Medium" },
  { id: "605", title: "Roman to Integer", difficulty: "Easy" },
  { id: "606", title: "3Sum Closest", difficulty: "Medium" },
];

interface AddProblemModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: (selectedProblems: ProblemBankItem[]) => void;
}

export const AddProblemModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
}: AddProblemModalProps) => {
  const [searchBank, setSearchBank] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredBank = useMemo(() => {
    return PROBLEM_BANK_DATA.filter((p) => {
      const matchSearch = p.title
        .toLowerCase()
        .includes(searchBank.toLowerCase());
      const matchDifficulty =
        filterDifficulty === "all" || p.difficulty === filterDifficulty;
      return matchSearch && matchDifficulty;
    });
  }, [searchBank, filterDifficulty]);

  const handleSelectProblem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleConfirm = (onClose: () => void) => {
    // Lọc ra danh sách các đối tượng đã chọn thay vì dùng any
    const selected = PROBLEM_BANK_DATA.filter((p) => selectedIds.has(p.id));
    onConfirm(selected);
    setSelectedIds(new Set());
    onClose();
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
            <ModalHeader className="flex flex-col gap-1 border-b border-slate-100 dark:border-white/5 py-6 px-10">
              <div className="flex items-center gap-3">
                <Database size={24} className="text-[#FF5C00]" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white leading-none">
                  PROBLEM <span className="text-[#FF5C00]">BANK</span>
                </h2>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">
                Select from your existing problems
              </p>
            </ModalHeader>

            <ModalBody className="p-8">
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search problem title..."
                  startContent={<Search size={18} className="text-slate-400" />}
                  value={searchBank}
                  onValueChange={setSearchBank}
                  classNames={{
                    inputWrapper:
                      "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
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
                  <SelectItem key="all" className="font-bold">
                    All Levels
                  </SelectItem>
                  <SelectItem key="Easy" className="font-bold text-success">
                    Easy
                  </SelectItem>
                  <SelectItem key="Medium" className="font-bold text-warning">
                    Medium
                  </SelectItem>
                  <SelectItem key="Hard" className="font-bold text-danger">
                    Hard
                  </SelectItem>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredBank.map((libProb) => (
                  <div
                    key={libProb.id}
                    onClick={() => handleSelectProblem(libProb.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                      selectedIds.has(libProb.id)
                        ? "border-blue-600 bg-blue-50/50 dark:border-[#22C55E] dark:bg-[#22C55E]/10"
                        : "border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        isSelected={selectedIds.has(libProb.id)}
                        color="primary"
                        classNames={{
                          wrapper:
                            "rounded-md after:bg-blue-600 dark:after:bg-[#22C55E]",
                        }}
                        onChange={() => handleSelectProblem(libProb.id)}
                      />
                      <div>
                        <p
                          className={`font-black uppercase italic transition-colors ${
                            selectedIds.has(libProb.id)
                              ? "text-blue-600 dark:text-[#22C55E]"
                              : ""
                          }`}
                        >
                          {libProb.title}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                          ID: #{libProb.id}
                        </p>
                      </div>
                    </div>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="font-black uppercase text-[9px]"
                    >
                      {libProb.difficulty}
                    </Chip>
                  </div>
                ))}
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-slate-100 dark:border-white/5 p-8">
              <div className="mr-auto">
                <span className="text-xs font-black uppercase text-slate-400 italic">
                  Selected: {selectedIds.size} Problems
                </span>
              </div>
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase text-[10px] tracking-widest text-slate-400"
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 dark:bg-[#22C55E] text-white font-black uppercase text-[10px] tracking-widest px-10 h-12 rounded-xl shadow-lg active:scale-95 transition-all"
                onPress={() => handleConfirm(onClose)}
                isDisabled={selectedIds.size === 0}
              >
                Confirm & Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
