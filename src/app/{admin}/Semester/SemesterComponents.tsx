"use client";

import React, { useRef } from "react";
import {
  useGetALLSemestersQuery,
  useUpdateSemesterMutation,
  useGetSemesterImportTemplateMutation,
  useImportSemestersMutation,
} from "@/store/queries/Semester";

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
import { 
  Calendar, 
  Plus, 
  Download, 
  Upload, 
  CalendarDays, 
  History, 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useModal } from "@/Provider/ModalProvider";
import CreateUpdateSemesterModal from "./CreateUpdateSemesterModal";
import { UpdateSemesterRequest } from "@/types";
import { ADMIN_H1, ADMIN_SUBTITLE } from "../adminTable";

export default function SemesterComponents() {
  const { openModal } = useModal();
  const { data, isLoading, refetch } = useGetALLSemestersQuery();
  const [updateSemester] = useUpdateSemesterMutation();
  const [getTemplate, { isLoading: isDownloading }] = useGetSemesterImportTemplateMutation();
  const [importSemesters, { isLoading: isImporting }] = useImportSemestersMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const semesters = data?.data?.items ?? [];

  const handleDownloadTemplate = async () => {
    try {
      const blob = await getTemplate().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Semester_Template.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download template:", error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await importSemesters(formData).unwrap();
        refetch();
      } catch (error) {
        console.error("Import failed:", error);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleToggleActive = async (s: UpdateSemesterRequest, id: string) => {
    try {
      await updateSemester({
        id: id,
        data: {
          code: s.code,
          name: s.name,
          startAt: s.startAt,
          endAt: s.endAt,
          isActive: !s.isActive,
        },
      }).unwrap();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h1 className={ADMIN_H1}>
            Semester <span style={{ color: "#3B5BFF" }}>Cycles</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>Manage academic terms, registration periods and visibility</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="flat"
            className="font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
            isLoading={isDownloading}
            onPress={handleDownloadTemplate}
            startContent={<Download size={16} />}
          >
            Template
          </Button>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx,.xls,.csv" 
            onChange={handleFileChange} 
          />
          <Button
            variant="flat"
            className="font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
            isLoading={isImporting}
            onPress={() => fileInputRef.current?.click()}
            startContent={<Upload size={16} />}
          >
            Import
          </Button>

          <Button
            className="font-black uppercase text-[10px] tracking-widest px-8 h-11 rounded-xl text-white shadow-xl active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 15px rgba(59, 91, 255, 0.3)" }}
            startContent={<Plus size={18} strokeWidth={3} />}
            onPress={() => openModal({ content: <CreateUpdateSemesterModal /> })}
          >
            Create Semester
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Semesters", value: semesters.length, icon: Calendar, color: "#3B5BFF", bg: "rgba(59,91,255,0.08)" },
          { label: "Active Terms", value: semesters.filter(s => new Date(s.startAt) <= now && new Date(s.endAt) >= now).length, icon: CheckCircle2, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
          { label: "History", value: semesters.filter(s => new Date(s.endAt) < now).length, icon: History, color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
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
          aria-label="Semester Management Table"
          removeWrapper
          classNames={{
            th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-widest border-b border-white/[0.08] py-5 px-6",
            td: "py-5 px-6 text-sm border-b border-white/[0.05] text-white/80",
            tr: "hover:bg-white/[0.03] transition-colors group/row",
          }}
        >
          <TableHeader>
            <TableColumn>CODE</TableColumn>
            <TableColumn className="w-[30%]">SEMESTER NAME</TableColumn>
            <TableColumn>TIMELINE</TableColumn>
            <TableColumn align="center">PHASE</TableColumn>
            <TableColumn align="center">VISIBILITY</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>

          <TableBody
            items={semesters}
            emptyContent={
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Calendar size={48} className="text-white/10" />
                <p className="text-white/30 font-bold uppercase tracking-widest text-xs italic">No semesters in registry</p>
              </div>
            }
          >
            {(s) => {
              const sDate = new Date(s.startAt);
              const eDate = new Date(s.endAt);
              const isEnded = eDate < now;
              const isUpcoming = sDate > now;
              const isActive = !isEnded && !isUpcoming;

              return (
                <TableRow key={s.semesterId}>
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
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-white/20" />
                          <span className="text-[11px] font-bold text-white/60">{new Date(s.startAt).toLocaleDateString()}</span>
                          <span className="text-white/20">→</span>
                          <span className="text-[11px] font-bold text-white/60">{new Date(s.endAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      {isEnded ? (
                        <Chip size="sm" variant="flat" className="bg-white/5 text-white/30 font-black uppercase text-[9px] border-none italic">Ended</Chip>
                      ) : isUpcoming ? (
                        <Chip size="sm" variant="flat" className="bg-amber-500/10 text-amber-500 font-black uppercase text-[9px] border-none italic">Upcoming</Chip>
                      ) : (
                        <Chip size="sm" variant="flat" className="bg-emerald-500/10 text-emerald-500 font-black uppercase text-[9px] border-none italic animate-pulse">In Progress</Chip>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      {s.isActive ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          <Eye size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase text-emerald-500">Public</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                          <EyeOff size={12} className="text-red-500" />
                          <span className="text-[10px] font-black uppercase text-red-500">Hidden</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Tooltip content="Edit Cycle" placement="top">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-white/5 hover:bg-[#3B5BFF]/20 text-white/30 hover:text-[#7B9FFF] rounded-xl h-9 w-9 transition-all"
                          onPress={() => openModal({ content: <CreateUpdateSemesterModal semester={s} /> })}
                        >
                          <Pencil size={16} />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip content={s.isActive ? "Hide from Users" : "Make Public"} placement="top">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className={`rounded-xl h-9 w-9 transition-all ${
                            s.isActive 
                              ? "bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-500" 
                              : "bg-white/5 hover:bg-emerald-500/20 text-white/30 hover:text-emerald-500"
                          }`}
                          onPress={() => handleToggleActive(s, s.semesterId)}
                        >
                          {s.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
