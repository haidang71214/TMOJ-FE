"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Switch,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Plus, Edit, Trash2, ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { AddProblemModal } from "../../../../components/AddProblemModal";

interface ProblemItem {
  id: number | string;
  displayId: string;
  title: string;
  difficulty: string;
  visible: boolean;
}

interface SelectedFromBank {
  id: string;
  title: string;
  difficulty: string;
}

export default function ContestProblemsPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params.id;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // State danh sách bài tập hiện tại trong Contest
  const [problems, setProblems] = useState<ProblemItem[]>([
    {
      id: 501,
      displayId: "A",
      title: "Two Sum",
      difficulty: "Easy",
      visible: true,
    },
    {
      id: 502,
      displayId: "B",
      title: "Longest Substring",
      difficulty: "Medium",
      visible: true,
    },
  ]);

  // Hàm điều hướng sang trang chỉnh sửa bài tập
  const goToEdit = (problemId: string | number) => {
    // Nếu là bài tập add từ Bank (có đuôi random), tách lấy ID gốc trước dấu "-"
    const originalId =
      typeof problemId === "string" ? problemId.split("-")[0] : problemId;
    router.push(`/Management/Contest/${contestId}/problems/${originalId}/edit`);
  };

  // Hàm xử lý nhận dữ liệu từ Modal
  const handleAddFromBank = (selectedFromBank: SelectedFromBank[]) => {
    const formattedNewProblems: ProblemItem[] = selectedFromBank.map(
      (p, index) => ({
        id: `${p.id}-${Math.random().toFixed(4)}`, // Đảm bảo key duy nhất cho list hiện tại
        displayId: String.fromCharCode(65 + problems.length + index),
        title: p.title,
        difficulty: p.difficulty,
        visible: true,
      })
    );

    setProblems([...problems, ...formattedNewProblems]);
  };

  return (
    <div className="flex flex-col gap-8 pb-20 p-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <Button
          variant="light"
          onPress={() => router.push(`/Management/Contest`)}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 transition-colors h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          Back to Contest List
        </Button>

        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
              CONTEST <span className="text-[#FF5C00]">PROBLEMS</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              Contest ID: #{contestId}
            </p>
          </div>

          <Button
            startContent={<Plus size={20} strokeWidth={3} />}
            onPress={onOpen}
            className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black rounded-xl h-12 px-8 uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Add from Problem Bank
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <Table
        aria-label="Contest Problem List"
        removeWrapper
        classNames={{
          base: "bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
          th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4",
          td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>DISPLAY</TableColumn>
          <TableColumn>PROBLEM TITLE</TableColumn>
          <TableColumn>VISIBLE</TableColumn>
          <TableColumn className="text-right">OPERATIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {problems.map((p) => (
            <TableRow
              key={p.id}
              className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <TableCell>
                <span className="text-slate-400 font-black italic text-xs">
                  #{typeof p.id === "string" ? p.id.split("-")[0] : p.id}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xl font-black text-blue-600 dark:text-[#FF5C00] italic">
                  {p.displayId}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                  {p.title}
                </span>
              </TableCell>
              <TableCell>
                <Switch
                  size="sm"
                  defaultSelected={p.visible}
                  classNames={{
                    wrapper:
                      "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Tooltip
                    content="Edit Details"
                    className="font-bold text-[10px]"
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => goToEdit(p.id)}
                      className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                    >
                      <Edit size={16} />
                    </Button>
                  </Tooltip>

                  <Tooltip
                    content="Remove from Contest"
                    className="font-bold text-[10px]"
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() =>
                        setProblems(problems.filter((item) => item.id !== p.id))
                      }
                      className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all rounded-lg h-9 w-9"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* RENDER MODAL*/}
      <AddProblemModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleAddFromBank}
      />

      {/* FOOTER DECOR */}
      <div className="flex justify-center opacity-20 italic font-black uppercase text-[10px] tracking-[1em] text-slate-400 pt-10">
        TMOJ &bull; PROBLEMS &bull; SYSTEM
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
