"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner
} from "@heroui/react";
import { useGetUserSubmissionInSlotQuery } from "@/store/queries/ClassSlot";

interface Props {
  classId: string;
  slotId: string;
  userId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export default function StudentSubmissionsModal({
  classId,
  slotId,
  userId,
  isOpen,
  onOpenChange,
  studentName
}: Props) {
  const { data, isLoading } = useGetUserSubmissionInSlotQuery(
    { classId, slotId, userId },
    { skip: !isOpen || !userId }
  );

  const submissions = (data as any)?.data || [];

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside" classNames={{
      base: "rounded-[2.5rem] dark:bg-[#1C2737] border border-gray-100 dark:border-[#334155]",
    }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-divider pb-4">
              <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-[#0B1C3D] dark:text-white">
                SUBMISSION HISTORY
              </h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Student: <span className="text-primary">{studentName}</span>
              </p>
            </ModalHeader>
            <ModalBody className="py-6">
              {isLoading ? (
                <div className="flex justify-center p-10"><Spinner size="lg" /></div>
              ) : submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-slate-500 gap-4">
                  <div className="text-4xl text-slate-300">📭</div>
                  <div className="font-bold">Student has no submissions in this slot.</div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {submissions.map((sub: any) => (
                    <div key={sub.submissionId} className="border border-slate-200 dark:border-white/10 rounded-2xl p-6 bg-slate-50/50 dark:bg-white/5">
                      <div className="flex justify-between items-center mb-6">
                        <div className="font-[1000] text-lg uppercase italic tracking-tight text-blue-600 dark:text-blue-400">
                          {sub.problemTitle}
                        </div>
                        <div className="flex gap-3 items-center">
                          <Chip 
                            size="md" 
                            variant="flat" 
                            color={sub.verdictCode?.toLowerCase() === "ac" ? "success" : "danger"}
                            className="font-black uppercase tracking-widest text-[10px]"
                          >
                            {sub.verdictCode?.toUpperCase() || "UNKNOWN"}
                          </Chip>
                          <div className="font-black text-xl text-slate-800 dark:text-white">
                            {sub.finalScore} <span className="text-xs text-slate-400 font-medium">pts</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-[#111c35] rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                        <Table aria-label="Test case results" removeWrapper shadow="none" classNames={{ th: "bg-transparent text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-divider", td: "border-b border-divider last:border-none font-medium" }}>
                          <TableHeader>
                            <TableColumn>TEST CASE</TableColumn>
                            <TableColumn>VERDICT</TableColumn>
                            <TableColumn>RUNTIME</TableColumn>
                            <TableColumn>MEMORY</TableColumn>
                          </TableHeader>
                          <TableBody>
                            {(sub.results || []).map((res: any, idx: number) => (
                              <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                <TableCell className="font-bold text-slate-500">#{idx + 1}</TableCell>
                                <TableCell>
                                  <Chip size="sm" className="bg-transparent px-0 font-bold" color={res.statusCode?.toLowerCase() === "ac" ? "success" : "danger"}>
                                    {res.statusCode?.toUpperCase()}
                                  </Chip>
                                </TableCell>
                                <TableCell>{res.runtimeMs} ms</TableCell>
                                <TableCell>{(res.memoryKb / 1024).toFixed(2)} MB</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t border-divider pt-4">
              <Button color="primary" variant="flat" onPress={onClose} className="font-bold uppercase text-xs tracking-widest px-8">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
