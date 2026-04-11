"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Input,
  Chip
} from "@heroui/react";
import { useGetSlotScoresQuery } from "@/store/queries/ClassSlot";
import { Search, History } from "lucide-react";
import StudentSubmissionsModal from "./StudentSubmissionsModal";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  classId: string;
  slot: any;
}

export default function SlotScoresTable({ classId, slot }: Props) {
  const { t, language } = useTranslation();
  const { data, isLoading } = useGetSlotScoresQuery({ classId, slotId: slot.id });
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  const scores = (data as any)?.data || [];

  const filteredScores = useMemo(() => {
    if (!search.trim()) return scores;
    return scores.filter((s: any) => 
      s.displayName?.toLowerCase().includes(search.toLowerCase()) || 
      s.userId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [scores, search]);

  const problemColumns = useMemo(() => {
    return [...(slot.problems || [])].sort((a: any, b: any) => (a.ordinal || 0) - (b.ordinal || 0));
  }, [slot.problems]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full mt-4">
      {/* Filter Header */}
      <div 
        className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-divider animate-fade-in-down" 
        style={{ animationFillMode: "both" }}
      >
        <div className="font-[1000] uppercase text-xs text-slate-500 tracking-[0.2em] pl-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          {scores.length} {t('class_semester.students_participated') || (language === 'vi' ? 'Sinh viên tham gia' : 'Students Participated')}
        </div>
        <Input
          placeholder={t('class_semester.search_students') || (language === 'vi' ? 'Tìm kiếm sinh viên...' : 'Search students...')}
          value={search}
          onValueChange={setSearch}
          startContent={<Search size={16} className="text-slate-400" />}
          className="max-w-[280px]"
          size="sm"
          classNames={{
            inputWrapper: "bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/10"
          }}
        />
      </div>

      {/* Scores Table */}
      <div 
        className="w-full bg-white dark:bg-[#111c35] rounded-[2rem] border border-divider overflow-hidden custom-scrollbar animate-fade-in-up" 
        style={{ animationFillMode: "both", animationDelay: "100ms" }}
      >
        <Table 
          aria-label="Slot Scores" 
          removeWrapper 
          classNames={{
            th: "bg-slate-100 dark:bg-white/5 text-slate-500 font-[1000] uppercase tracking-widest text-[10px] py-4 border-b border-divider",
            td: "py-4 border-b border-divider font-medium text-sm last:border-none",
          }}
        >
          <TableHeader>
            {[
              <TableColumn key="student" className="sticky left-0 z-20 bg-slate-100 dark:bg-[#1A2332]">
                {t('class_semester.student') || (language === 'vi' ? 'Sinh viên' : 'STUDENT')}
              </TableColumn>,
              <TableColumn key="total" className="text-center font-black text-[#FF5C00] bg-orange-50 dark:bg-orange-900/20">
                {t('class_semester.total_score') || (language === 'vi' ? 'Tổng điểm' : 'TOTAL SCORE')}
              </TableColumn>,
              ...problemColumns.map((p: any, idx: number) => (
                <TableColumn key={`col-${p.problemId}`} className="text-center min-w-[140px] max-w-[200px]">
                  <div className="flex flex-col items-center gap-1">
                    <Chip size="sm" variant="flat" className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 text-[10px] font-black h-5 px-2 uppercase">
                      {t('class_semester.prob') || (language === 'vi' ? 'Bài' : 'Prob')} {p.ordinal ?? idx + 1}
                    </Chip>
                    <div className="truncate w-full font-bold" title={p.problemTitle}>
                      {p.problemTitle}
                    </div>
                  </div>
                </TableColumn>
              )),
              <TableColumn key="actions" className="text-right pr-6 mb-2">
                {t('common.actions') || (language === 'vi' ? 'Hành động' : 'ACTIONS')}
              </TableColumn>
            ]}
          </TableHeader>
          <TableBody emptyContent={t('class_semester.no_score_data') || (language === 'vi' ? 'Không có điểm nào cho sinh viên trong slot này.' : "No score data available for any students in this slot.")}>
            {filteredScores.map((student: any, index: number) => (
              <TableRow 
                key={student.userId} 
                className="hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer animate-fade-in-right"
                style={{ animationFillMode: "both", animationDelay: `${index * 50}ms` } as any}
              >
                {[
                  <TableCell key="student-info" className="sticky left-0 z-20 bg-white dark:bg-[#111c35]">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {student.displayName || (t('common.unknown_user') || (language === 'vi' ? 'Người dùng ẩn danh' : "Unknown User"))}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {student.userId?.substring(0, 8)}...
                    </div>
                  </TableCell>,
                  
                  <TableCell key="total-score" className="text-center bg-orange-50/30 dark:bg-orange-900/10">
                    <div className="font-black text-lg text-[#FF5C00] dark:text-orange-400">
                      {student.totalscore ?? student.totalScore ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      {student.solvedCount}/{problemColumns.length} {t('class_semester.solved') || (language === 'vi' ? 'Đã giải' : 'Solved')}
                    </div>
                  </TableCell>,

                  ...problemColumns.map((p: any) => {
                    const problemScore = (student.problemScores || []).find((ps: any) => ps.problemId === p.problemId);
                    
                    if (!problemScore) {
                      return (
                        <TableCell key={`cell-${p.problemId}`} className="text-center">
                          <span className="text-slate-300 dark:text-slate-600 font-bold">—</span>
                        </TableCell>
                      );
                    }

                    const isAC = problemScore.verdictCode?.toLowerCase() === 'ac';
                    
                    return (
                      <TableCell key={`cell-${p.problemId}`} className="text-center">
                        <div className={`font-black text-base ${isAC ? 'text-emerald-500' : 'text-blue-500'}`}>
                          {problemScore.score}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center justify-center gap-1 uppercase">
                          <span className={`w-1.5 h-1.5 rounded-full ${isAC ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {problemScore.attempts} {t('class_semester.attempts') || (language === 'vi' ? 'Lần thử' : 'attempt(s)')}
                        </div>
                      </TableCell>
                    );
                  }),

                  <TableCell key="actions" className="pr-6">
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-bold text-[10px] tracking-widest uppercase"
                        onPress={() => setSelectedUser({ id: student.userId, name: student.displayName || (t('class_semester.student') || (language === 'vi' ? 'Sinh viên' : 'Student')) })}
                        startContent={<History size={14} strokeWidth={2.5} />}
                      >
                        {t('common.history') || (language === 'vi' ? 'Lịch sử' : 'History')}
                      </Button>
                    </div>
                  </TableCell>
                ]}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StudentSubmissionsModal
        classId={classId}
        slotId={slot.id}
        userId={selectedUser?.id || ""}
        studentName={selectedUser?.name || ""}
        isOpen={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
    </div>
  );
}
