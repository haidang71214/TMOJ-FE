"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import { FolderArchive, Info, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function TestcaseGuideModal({ isOpen, onOpenChange }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#1C2737] border border-divider dark:border-white/5 rounded-[2.5rem]",
        header: "border-b border-divider dark:border-white/5 pb-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3 items-center text-[#FFB800] uppercase italic font-black text-xl tracking-tighter pt-8 px-10">
              <div className="p-2 bg-[#FFB800]/10 rounded-xl">
                <Info size={24} strokeWidth={3} />
              </div>
              Testcase Upload Guide
            </ModalHeader>
            <ModalBody className="px-10 py-6 space-y-6">
              <section className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Required Structure
                </h4>
                <div className="bg-slate-100 dark:bg-black/40 p-6 rounded-3xl font-mono text-sm border border-slate-200 dark:border-white/5 shadow-inner">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2 font-bold">
                    <FolderArchive size={16} /> problem_testcases.zip
                  </div>
                  <div className="pl-6 space-y-1 text-slate-700 dark:text-slate-300">
                    {" "}
                    <p>├── 1.in</p>
                    <p>├── 1.out</p>
                    <p>├── 2.in</p>
                    <p>├── 2.out</p>
                    <p className="text-slate-500 italic">... (more cases)</p>
                  </div>
                </div>
              </section>

              <Divider className="dark:bg-white/5" />

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    File Naming
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Names must match (1.in -> 1.out)",
                      "Use .in and .out extensions",
                      "Keep filenames simple (numbers)",
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-xs font-bold italic text-slate-500"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500 shrink-0"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Notes
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Maximum size: 50MB",
                      "Ensure no extra subfolders inside ZIP",
                      "Standard encoding (UTF-8)",
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-xs font-bold italic text-slate-500"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-[#FF5C00] shrink-0"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </ModalBody>
            <ModalFooter className="px-10 pb-10">
              <Button
                onPress={onClose}
                className="bg-[#FFB800] text-[#071739] font-black uppercase italic text-[10px] px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#FFB800]/20"
              >
                I Understand
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
