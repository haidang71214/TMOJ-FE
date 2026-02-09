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
import { Search, Trophy, X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

// Định nghĩa interface cho dữ liệu Contest
interface ContestBankItem {
  id: string;
  title: string;
  status: string;
  type: string;
}

const CONTEST_BANK_DATA: ContestBankItem[] = [
  {
    id: "101",
    title: "FPTU Coding Master Spring 2026",
    status: "Upcoming",
    type: "Full Contest",
  },
  {
    id: "102",
    title: "Weekly Challenge #42: DP",
    status: "Ended",
    type: "Practice",
  },
  {
    id: "103",
    title: "Algorithm Masters Cup",
    status: "Running",
    type: "Tournament",
  },
  { id: "104", title: "Logic Sprint 2025", status: "Ended", type: "Practice" },
  {
    id: "105",
    title: "Cyber Security Hackathon",
    status: "Upcoming",
    type: "Tournament",
  },
];

interface AddContestModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: (selectedContests: ContestBankItem[]) => void;
}

export const AddContestModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
}: AddContestModalProps) => {
  const router = useRouter();
  const [searchBank, setSearchBank] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredBank = useMemo(() => {
    return CONTEST_BANK_DATA.filter((c) => {
      const matchSearch = c.title
        .toLowerCase()
        .includes(searchBank.toLowerCase());
      const matchType = filterType === "all" || c.type === filterType;
      return matchSearch && matchType;
    });
  }, [searchBank, filterType]);

  const handleSelectContest = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleConfirm = (onClose: () => void) => {
    const selected = CONTEST_BANK_DATA.filter((c) => selectedIds.has(c.id));
    onConfirm(selected);
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
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
              {/* HÀNG 1: TIÊU ĐỀ */}
              <div className="flex items-center gap-3">
                <Trophy size={24} className="text-[#FF5C00]" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white leading-none">
                  CONTEST <span className="text-[#FF5C00]">BANK</span>
                </h2>
              </div>

              {/* HÀNG 2: MÔ TẢ VÀ NÚT BẤM */}
              <div className="flex items-center justify-between w-full pr-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                  Select from existing contests OR
                </p>

                <Button
                  onPress={() => router.push("/Management/Contest/create")}
                  className="bg-blue-600/10 text-blue-600 dark:bg-[#FF5C00]/10 dark:text-[#FF5C00] font-black uppercase italic text-[10px] tracking-widest rounded-xl border border-blue-600/20 dark:border-[#FF5C00]/20 hover:scale-105 transition-all h-9 px-4"
                  endContent={<ExternalLink size={14} />}
                >
                  Create New Contest
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className="p-8">
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search contest title..."
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
                  placeholder="Contest Type"
                  className="w-48 font-bold"
                  selectedKeys={[filterType]}
                  onSelectionChange={(keys) =>
                    setFilterType(Array.from(keys)[0] as string)
                  }
                  classNames={{
                    trigger: "rounded-2xl bg-slate-50 dark:bg-black/20 h-12",
                  }}
                >
                  <SelectItem key="all" className="font-bold">
                    All Types
                  </SelectItem>
                  <SelectItem key="Full Contest" className="font-bold">
                    Full Contest
                  </SelectItem>
                  <SelectItem key="Practice" className="font-bold">
                    Practice
                  </SelectItem>
                  <SelectItem key="Tournament" className="font-bold">
                    Tournament
                  </SelectItem>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredBank.map((contest) => (
                  <div
                    key={contest.id}
                    onClick={() => handleSelectContest(contest.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${
                      selectedIds.has(contest.id)
                        ? "border-blue-600 bg-blue-50/50 dark:border-[#FF5C00] dark:bg-[#FF5C00]/10"
                        : "border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        isSelected={selectedIds.has(contest.id)}
                        color="warning"
                        classNames={{
                          wrapper: "rounded-md after:bg-[#FF5C00]",
                        }}
                        onChange={() => handleSelectContest(contest.id)}
                      />
                      <div>
                        <p
                          className={`font-black uppercase italic transition-colors ${
                            selectedIds.has(contest.id) ? "text-[#FF5C00]" : ""
                          }`}
                        >
                          {contest.title}
                        </p>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase italic">
                            ID: #{contest.id}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-[9px] font-bold text-[#FF5C00] uppercase italic">
                            {contest.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="font-black uppercase text-[9px]"
                    >
                      {contest.type}
                    </Chip>
                  </div>
                ))}
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-slate-100 dark:border-white/5 p-8">
              <div className="mr-auto">
                <span className="text-xs font-black uppercase text-slate-400 italic">
                  Selected: {selectedIds.size} Contests
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
                className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black uppercase text-[10px] tracking-widest px-10 h-12 rounded-xl shadow-lg active:scale-95 transition-all"
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
