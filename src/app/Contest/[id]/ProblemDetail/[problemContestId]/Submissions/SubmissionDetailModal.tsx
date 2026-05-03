"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
  ScrollShadow,
} from "@heroui/react";
import { useGetSubmissionDetailQuery } from "@/store/queries/Submittion";
import { useEffect } from "react";
import { Clock, Code2, Cpu, Database, Info } from "lucide-react";

interface SubmissionDetailModalProps {
  submissionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionDetailModal = ({
  submissionId,
  isOpen,
  onClose,
}: SubmissionDetailModalProps) => {
  const { data: detail, isLoading, error } = useGetSubmissionDetailQuery(
    submissionId || "",
    { skip: !submissionId || !isOpen }
  );

  useEffect(() => {
    if (detail) {
    }
    if (error) {
    }
  }, [detail, error]);

  const getStatusColor = (verdict: string | undefined) => {
    const v = verdict?.toLowerCase();
    if (v === "ac") return "text-green-500";
    if (v === "pending") return "text-blue-500";
    return "text-red-500";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "dark:bg-[#101828] border border-gray-100 dark:border-[#1d2939]",
        header: "border-b border-gray-100 dark:border-[#1d2939]",
        footer: "border-t border-gray-100 dark:border-[#1d2939]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Info className="text-blue-500" size={20} />
                <span className="font-black uppercase tracking-tight">Submission Details</span>
              </div>
              <p className="text-xs text-gray-400 font-bold tracking-widest uppercase italic">
                ID: {submissionId}
              </p>
            </ModalHeader>
            <ModalBody className="py-6">
              {isLoading ? (
                <div className="flex flex-col items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-400 font-black uppercase italic text-sm">Loading Detail...</p>
                </div>
              ) : detail ? (
                <div className="space-y-6">
                  {/* Status & Diagnostic Header */}
                  <div className="bg-gray-50 dark:bg-[#1d2939] p-5 rounded-2xl border border-gray-100 dark:border-[#334155] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-2xl font-black uppercase tracking-tight ${getStatusColor(detail.data.verdictCode)}`}>
                          {(detail as any).data.diagnostic?.title || detail.data.verdictCode?.toUpperCase() || "Pending"}
                        </span>
                        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          {detail.data.language}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-bold italic">
                        {(detail as any).data.diagnostic?.message || "No additional info."}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Score</div>
                      <div className="text-4xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                        {detail.data.finalScore ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-[#1d2939] p-4 rounded-xl border border-gray-100 dark:border-[#334155] flex flex-col items-center text-center">
                      <Clock size={16} className="text-gray-400 mb-2" />
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</div>
                      <p className="text-sm font-black dark:text-gray-200">{detail.data.timeMs || 0} ms</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1d2939] p-4 rounded-xl border border-gray-100 dark:border-[#334155] flex flex-col items-center text-center">
                      <Database size={16} className="text-gray-400 mb-2" />
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Memory</div>
                      <p className="text-sm font-black dark:text-gray-200">
                        {detail.data.memoryKb ? (detail.data.memoryKb / 1024).toFixed(2) : "0.00"} MB
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1d2939] p-4 rounded-xl border border-gray-100 dark:border-[#334155] flex flex-col items-center text-center">
                      <Info size={16} className="text-gray-400 mb-2" />
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Cases</div>
                      <p className="text-sm font-black dark:text-gray-200">{detail.data.results?.length || 0}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1d2939] p-4 rounded-xl border border-gray-100 dark:border-[#334155] flex flex-col items-center text-center">
                      <Clock size={16} className="text-gray-400 mb-2" />
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Judged At</div>
                      <p className="text-[10px] font-bold dark:text-gray-400">
                        {detail.data.judgedAt ? new Date(detail.data.judgedAt).toLocaleTimeString() : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Test Cases Grid */}
                  {detail.data.results && detail.data.results.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                        <Info size={14} /> Test Case Results
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {detail.data.results.map((result: any, idx: number) => (
                          <div
                            key={idx}
                            title={`Testcase ${idx + 1}: ${result.verdictCode?.toUpperCase() || "N/A"}`}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${result.verdictCode?.toLowerCase() === "ac"
                                ? "bg-green-500/10 border-green-500/30 text-green-500"
                                : "bg-red-500/10 border-red-500/30 text-red-500"
                              }`}
                          >
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        <Code2 size={14} /> Submitted Code
                      </h3>
                    </div>
                    <ScrollShadow className="max-h-[300px] bg-[#0d1117] rounded-xl p-4 border border-[#30363d]">
                      <pre className="text-[13px] font-mono text-gray-300 whitespace-pre-wrap">
                        {detail.data.sourceCode}
                      </pre>
                    </ScrollShadow>
                  </div>

                  {/* Compile Info if any */}
                  {(detail.data as any).diagnostic?.compileStdout || detail.data.compileOutput ? (
                    <div>
                      <h3 className="text-xs font-black uppercase text-red-400 tracking-widest mb-2 flex items-center gap-2">
                        <Info size={14} /> Compile Output
                      </h3>
                      <pre className="bg-red-50/10 dark:bg-red-900/10 p-4 rounded-xl border border-red-200/20 text-[12px] font-mono text-red-400 whitespace-pre-wrap">
                        {(detail.data as any).diagnostic?.compileStdout || detail.data.compileOutput}
                      </pre>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 italic">
                  Could not load submission detail.
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase tracking-widest text-[11px] text-gray-500"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
