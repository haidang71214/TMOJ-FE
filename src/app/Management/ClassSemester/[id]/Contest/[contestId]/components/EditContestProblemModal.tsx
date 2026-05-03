"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import { Settings, Save, X, Target, Clock, Database, Hash } from "lucide-react";
import { toast } from "sonner";
import { useUpdateClassContestProblemMutation } from "@/store/queries/Contest";
import { useTranslation } from "@/hooks/useTranslation";

interface EditContestProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  classSemesterId: string;
  contestId: string;
  problem: {
    contestProblemId: string;
    problemTitle: string;
    alias: string;
    points: number;
    ordinal: number;
    maxScore?: number;
    timeLimitMs?: number;
    memoryLimitKb?: number;
  } | null;
}

export default function EditContestProblemModal({
  isOpen,
  onClose,
  classSemesterId,
  contestId,
  problem,
}: EditContestProblemModalProps) {
  const { t } = useTranslation();
  const [updateProblem, { isLoading }] = useUpdateClassContestProblemMutation();

  const [alias, setAlias] = useState("");
  const [points, setPoints] = useState(100);
  const [ordinal, setOrdinal] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [timeLimitMs, setTimeLimitMs] = useState(1000);
  const [memoryLimitKb, setMemoryLimitKb] = useState(256 * 1024);

  useEffect(() => {
    if (problem) {
      setAlias(problem.alias || "");
      setPoints(problem.points || 0);
      setOrdinal(problem.ordinal || 0);
      setMaxScore(problem.maxScore || problem.points || 100);
      setTimeLimitMs(problem.timeLimitMs || 1000);
      setMemoryLimitKb(problem.memoryLimitKb || 256 * 1024);
    }
  }, [problem, isOpen]);

  const handleSave = async () => {
    if (!problem) return;

    try {
    const res =   await updateProblem({
        classSemesterId,
        contestId,
        contestProblemId: problem.contestProblemId,
        body: {
          alias: alias.trim() || undefined,
          ordinal,
          points,
          maxScore,
          timeLimitMs,
          memoryLimitKb,
        },
      }).unwrap();
      
      toast.success(t("contest.updateProblemSuccess") || "Cập nhật bài tập thành công!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || t("contest.updateProblemFailed") || "Cập nhật thất bại");
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl",
        header: "border-b border-slate-100 dark:border-white/5 p-8",
        body: "p-8",
        footer: "border-t border-slate-100 dark:border-white/5 p-8",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-[#071739] dark:text-white">
                Configure Problem
              </h3>
              <p className="text-sm font-medium text-slate-400">
                {problem?.problemTitle}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Display Alias"
              placeholder="e.g., Problem A"
              value={alias}
              onValueChange={setAlias}
              variant="faded"
              startContent={<Hash size={18} className="text-slate-400" />}
              classNames={{ label: "font-black uppercase text-[10px] tracking-widest" }}
            />
            <Input
              label="Ordinal"
              type="number"
              value={ordinal.toString()}
              onValueChange={(v) => setOrdinal(Number(v))}
              variant="faded"
              classNames={{ label: "font-black uppercase text-[10px] tracking-widest" }}
            />
            <Input
              label="Points"
              type="number"
              value={points.toString()}
              onValueChange={(v) => setPoints(Number(v))}
              variant="faded"
              startContent={<Target size={18} className="text-blue-500" />}
              classNames={{ label: "font-black uppercase text-[10px] tracking-widest" }}
            />
            <Input
              label="Max Score"
              type="number"
              value={maxScore.toString()}
              onValueChange={(v) => setMaxScore(Number(v))}
              variant="faded"
              classNames={{ label: "font-black uppercase text-[10px] tracking-widest" }}
            />
            <Input
              label="Time Limit (ms)"
              type="number"
              value={timeLimitMs.toString()}
              onValueChange={(v) => setTimeLimitMs(Number(v))}
              variant="faded"
              startContent={<Clock size={18} className="text-amber-500" />}
              classNames={{ label: "font-black uppercase text-[10px] tracking-widest" }}
            />
            <Input
              label="Memory Limit (KB)"
              type="number"
              value={memoryLimitKb.toString()}
              onValueChange={(v) => setMemoryLimitKb(Number(v))}
              variant="faded"
              startContent={<Database size={18} className="text-emerald-500" />}
              classNames={{ label: "font-black uppercase text-[10px] tracking-widest" }}
            />
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
            onPress={handleSave}
            isLoading={isLoading}
            startContent={!isLoading && <Save size={16} />}
            className="px-10 font-black uppercase tracking-widest text-[11px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl"
          >
            Save Configuration
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
