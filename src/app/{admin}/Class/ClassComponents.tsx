"use client";

import React, { useState } from "react";
import { useGetClassesQuery } from "@/store/queries/Class";

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
  School,
  Plus,
  UserPlus,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import CreateClassModal from "./CreateClassModal";
import CreateTeacherModal from "./CreateTeacherModal";
import SlotManagement from "./ClassSemesterManager";
import { useModal } from "@/Provider/ModalProvider";
import { ADMIN_H1, ADMIN_SUBTITLE } from "../adminTable";

// ── Interfaces ──
interface Teacher {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
}

interface ClassInstance {
  classSemesterId: string;
  semesterCode: string;
  subjectCode: string;
  subjectName: string;
  subjectDescription: string;
  startAt: string;
  endAt: string;
  inviteCode: string | null;
  inviteCodeExpiresAt: string | null;
  teacher: Teacher;
  memberCount: number;
}

interface ClassItem {
  classId: string;
  classCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  instances: ClassInstance[];
  totalMemberCount: number;
}

export default function ClassComponents() {
  const { openModal } = useModal();
  const { data, isLoading } = useGetClassesQuery({});

  const classes: ClassItem[] = data?.data?.items ?? [];

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (selectedClassId) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <SlotManagement
          classId={selectedClassId}
          className={selectedClassName}
          onBack={() => {
            setSelectedClassId(null);
            setSelectedClassName("");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h1 className={ADMIN_H1}>
            Class <span style={{ color: "#3B5BFF" }}>Management</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>Manage all classes, teachers, and student groups</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="font-black uppercase text-[10px] tracking-widest px-6 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
            startContent={<UserPlus size={16} />}
            onPress={() => openModal({ content: <CreateTeacherModal /> })}
          >
            Create Teacher
          </Button>

          <Button
            className="font-black uppercase text-[10px] tracking-widest px-8 h-11 rounded-xl text-white shadow-xl active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 15px rgba(59, 91, 255, 0.3)" }}
            startContent={<Plus size={18} strokeWidth={3} />}
            onPress={() => openModal({ content: <CreateClassModal /> })}
          >
            Create Class
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Classes", value: classes.length, icon: School, color: "#3B5BFF", bg: "rgba(59,91,255,0.08)" },
          { label: "Active Groups", value: classes.filter(c => c.isActive).length, icon: CheckCircle2, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
          { label: "Inactive", value: classes.filter(c => !c.isActive).length, icon: XCircle, color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
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
          aria-label="Class Management Table"
          removeWrapper
          classNames={{
            th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-widest border-b border-white/[0.08] py-5 px-6",
            td: "py-5 px-6 text-sm border-b border-white/[0.05] text-white/80",
            tr: "hover:bg-white/[0.03] transition-colors group/row",
          }}
        >
          <TableHeader>
            <TableColumn>CLASS CODE</TableColumn>
            <TableColumn>SUBJECT & SYLLABUS</TableColumn>
            <TableColumn>SEMESTER</TableColumn>
            <TableColumn>INSTRUCTOR</TableColumn>
            <TableColumn align="center">CAPACITY</TableColumn>
            <TableColumn align="center">STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>

          <TableBody
            items={classes}
            emptyContent={
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <School size={48} className="text-white/10" />
                <p className="text-white/30 font-bold uppercase tracking-widest text-xs italic">No classes found in registry</p>
              </div>
            }
          >
            {(classItem: ClassItem) => {
              const instance = classItem.instances[0];
              return (
                <TableRow
                  key={classItem.classId}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedClassId(classItem.classId);
                    setSelectedClassName(classItem.classCode);
                  }}
                >
                  <TableCell>
                    <span className="font-mono font-black text-[#7B9FFF] bg-[#3B5BFF]/10 border border-[#3B5BFF]/20 px-3 py-1.5 rounded-xl text-xs tracking-wider group-hover/row:bg-[#3B5BFF]/20 transition-all">
                      {classItem.classCode}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-white group-hover/row:text-[#3B5BFF] transition-colors">{instance?.subjectName || "—"}</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white/30">{instance?.subjectCode || "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-white/20" />
                      <span className="font-black italic text-[11px] uppercase text-white/60">{instance?.semesterCode || "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg"
                        style={{ background: "linear-gradient(135deg, #3B5BFF, #6B3BFF)" }}
                      >
                        {instance?.teacher?.displayName?.charAt(0) ?? "?"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white/90">{instance?.teacher?.displayName ?? "—"}</span>
                        <span className="text-[10px] text-white/30">{instance?.teacher?.email ?? ""}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center items-center gap-1.5">
                      <span className="text-xl font-black italic text-white">{classItem.totalMemberCount}</span>
                      <span className="text-[10px] font-black uppercase text-white/20 mt-1">Users</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      {classItem.isActive ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase text-emerald-500">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span className="text-[10px] font-black uppercase text-red-500">Archived</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-2">
                      <Tooltip content="Manage Slots" placement="top">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-white/5 hover:bg-[#3B5BFF]/20 text-white/30 hover:text-[#7B9FFF] rounded-xl h-9 w-9 transition-all"
                          onPress={() => {
                            setSelectedClassId(classItem.classId);
                            setSelectedClassName(classItem.classCode);
                          }}
                        >
                          <ChevronRight size={18} strokeWidth={3} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit Details" placement="top">
                        <Button isIconOnly size="sm" variant="flat" className="bg-white/5 hover:bg-white/10 text-white/30 hover:text-white rounded-xl h-9 w-9">
                          <Pencil size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete Class" placement="top" color="danger">
                        <Button isIconOnly size="sm" variant="flat" className="bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-500 rounded-xl h-9 w-9">
                          <Trash2 size={16} />
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