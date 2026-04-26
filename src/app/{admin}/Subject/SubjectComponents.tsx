"use client";

import React, { useRef } from "react";
import {
  useGetAllSubjectQueryQuery,
  useGetImportTemplateMutation,
  useImportClassMutation,
} from "@/store/queries/Subject";

import { Download, Upload, Plus, BookOpen, GraduationCap, Archive, Pencil, Trash2, Search, RotateCcw } from "lucide-react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Spinner,
  Tooltip,
} from "@heroui/react";
import CreateSubjectModal from "./CreateSubjectModal";
import EditSubjectModal from "./EditSubjectModal";
import { useModal } from "@/Provider/ModalProvider";
import { ADMIN_H1, ADMIN_SUBTITLE } from "../adminTable";

export default function SubjectComponents() {
  const { openModal } = useModal();
  const { data, isLoading, refetch } = useGetAllSubjectQueryQuery();
  const [getImportTemplate] = useGetImportTemplateMutation();
  const [importClass] = useImportClassMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const subjects = data?.data?.items ?? [];

  const handleDownloadTemplate = async () => {
    try {
      const blob = await getImportTemplate().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Subject_Import_Template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download template", error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await importClass(formData).unwrap();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      refetch();
    } catch (error) {
      console.error("Failed to import class", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h1 className={ADMIN_H1}>
            Subject <span style={{ color: "#3B5BFF" }}>Registry</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>Define and manage academic courses and subjects</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleImport}
          />
          <Button
            variant="flat"
            className="font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
            startContent={<Download size={16} />}
            onPress={handleDownloadTemplate}
          >
            Template
          </Button>
          <Button
            variant="flat"
            className="font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
            startContent={<Upload size={16} />}
            onPress={() => fileInputRef.current?.click()}
          >
            Import
          </Button>
          <Button
            className="font-black uppercase text-[10px] tracking-widest px-8 h-11 rounded-xl text-white shadow-xl active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 15px rgba(59, 91, 255, 0.3)" }}
            startContent={<Plus size={18} strokeWidth={3} />}
            onPress={() => openModal({ content: <CreateSubjectModal /> })}
          >
            Create Subject
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Subjects", value: subjects.length, icon: BookOpen, color: "#3B5BFF", bg: "rgba(59,91,255,0.08)" },
          { label: "Active Courses", value: subjects.filter(s => s.isActive).length, icon: GraduationCap, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
          { label: "Archived", value: subjects.filter(s => !s.isActive).length, icon: Archive, color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
        ].map((stat, i) => (
          <div 
            key={i}
            className="p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
            style={{ background: "#162035" }}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{stat.label}</p>
              <p className="text-4xl font-black italic tracking-tighter text-white group-hover:scale-110 transition-transform origin-left">{stat.value}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: stat.bg }}>
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="rounded-[2.5rem] overflow-hidden border border-white/5" style={{ background: "#162035", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        <Table
          aria-label="Subject Management Table"
          removeWrapper
          classNames={{
            th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-widest border-b border-white/[0.08] py-5 px-6",
            td: "py-5 px-6 text-sm border-b border-white/[0.05] text-white/80",
            tr: "hover:bg-white/[0.03] transition-colors group/row",
          }}
        >
          <TableHeader>
            <TableColumn>CODE</TableColumn>
            <TableColumn className="w-[30%]">SUBJECT NAME</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn align="center">STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>

          <TableBody
            items={subjects}
            emptyContent={
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <BookOpen size={48} className="text-white/10" />
                <p className="text-white/30 font-bold uppercase tracking-widest text-xs italic">No subjects found in system</p>
              </div>
            }
          >
            {(s) => (
              <TableRow key={s.subjectId}>
                <TableCell>
                  <span className="font-mono font-black text-[#7B9FFF] bg-[#3B5BFF]/10 border border-[#3B5BFF]/20 px-3 py-1.5 rounded-xl text-xs tracking-wider group-hover/row:bg-[#3B5BFF]/20 transition-all">
                    {s.code}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="font-bold text-white group-hover/row:text-[#3B5BFF] transition-colors text-base tracking-tight">
                    {s.name}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-white/40 text-xs line-clamp-1 italic">
                    {s.description || "No description provided."}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    {s.isActive ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-emerald-500">Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[10px] font-black uppercase text-red-500">Disabled</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Tooltip content="Edit Subject" placement="top">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-white/5 hover:bg-[#3B5BFF]/20 text-white/30 hover:text-[#7B9FFF] rounded-xl h-9 w-9 transition-all"
                        onPress={() => openModal({ content: <EditSubjectModal subject={s} /> })}
                      >
                        <Pencil size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete" placement="top" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-500 rounded-xl h-9 w-9 transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
