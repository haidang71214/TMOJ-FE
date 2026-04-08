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
import CreateClassModal from "./CreateClassModal";
import SlotManagement from "./ClassSemesterManager";
import { useModal } from "@/Provider/ModalProvider";

// ── Interfaces (đặt ở đây hoặc import từ file types) ──
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

  // State để quản lý việc xem SlotManagement
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  console.log(selectedClassId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" color="secondary" />
          <p className="text-sm text-gray-500 animate-pulse">Loading classes...</p>
        </div>
      </div>
    );
  }

  // Nếu đang xem slot của một class
  if (selectedClassId) {
    return (
      <div className="p-6">
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
    <div className="p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Class Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Manage all classes, teachers, and schedules
          </p>
        </div>

        <Button
          className="font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
          startContent={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          }
          onPress={() => openModal({ content: <CreateClassModal /> })}
        >
          Create Class
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl px-5 py-4 border border-indigo-200 dark:border-indigo-500/15"
          style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04))" }}>
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">Total Classes</p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{classes.length}</p>
        </div>
        <div className="rounded-xl px-5 py-4 border border-emerald-200 dark:border-emerald-500/15"
          style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.04))" }}>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {classes.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="rounded-xl px-5 py-4 border border-red-200 dark:border-red-500/15"
          style={{ background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(244, 63, 94, 0.04))" }}>
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">Inactive</p>
          <p className="text-3xl font-extrabold text-red-500 dark:text-red-400 mt-1">
            {classes.filter((c) => !c.isActive).length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
        style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}>
        <Table
          aria-label="Class table"
          removeWrapper
          classNames={{
            th: "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-white/5 py-3",
            td: "py-3 text-sm border-b border-gray-100 dark:border-white/[0.03]",
            tr: "hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors",
          }}
        >
          <TableHeader>
            <TableColumn>Code</TableColumn>
            <TableColumn>Subject</TableColumn>
            <TableColumn>Semester</TableColumn>
            <TableColumn>Teacher</TableColumn>
            <TableColumn align="center">Members</TableColumn>
            <TableColumn align="center">Status</TableColumn>
            <TableColumn align="center">Action</TableColumn>
          </TableHeader>

          <TableBody
            items={classes}
            emptyContent={
              <div className="py-10 text-center">
                <p className="text-gray-400 text-sm">No classes found. Create one to get started.</p>
              </div>
            }
          >
            {(classItem: ClassItem) => {
              // Nếu class có nhiều instances, hiển thị instance đầu tiên (phổ biến nhất)
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
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md text-xs"
                      style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                      {classItem.classCode}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-slate-300 font-medium">
                        {instance?.subjectName || "—"}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-slate-500">
                        {instance?.subjectCode || "—"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      classNames={{
                        base: "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10",
                        content: "text-gray-700 dark:text-slate-300 text-xs font-semibold",
                      }}
                    >
                      {instance?.semesterCode || "—"}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                      >
                        {instance?.teacher?.displayName?.charAt(0) ?? "?"}
                      </div>
                      <span className="text-gray-800 dark:text-slate-300 font-medium">
                        {instance?.teacher?.displayName ?? "—"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                        {classItem.totalMemberCount}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      {classItem.isActive ? (
                        <Chip
                          size="sm"
                          variant="flat"
                          classNames={{
                            base: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20",
                            content: "text-emerald-600 dark:text-emerald-400 text-xs font-bold",
                          }}
                          startContent={<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1 animate-pulse" />}
                        >
                          Active
                        </Chip>
                      ) : (
                        <Chip
                          size="sm"
                          variant="flat"
                          classNames={{
                            base: "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20",
                            content: "text-red-600 dark:text-red-400 text-xs font-bold",
                          }}
                        >
                          Inactive
                        </Chip>
                      )}
                    </div>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-1">
                      <Tooltip content="Manage Semester In Class" placement="top">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-gray-100 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-gray-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 min-w-7 w-7 h-7 transition-colors"
                          onPress={() => {
                            setSelectedClassId(classItem.classId);
                            setSelectedClassName(classItem.classCode); // Dùng classCode làm tên tạm thời
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="10" y1="14" x2="14" y2="14" />
                            <line x1="12" y1="12" x2="12" y2="16" />
                          </svg>
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit" placement="top">
                        <Button isIconOnly size="sm" variant="flat" className="...">✏️</Button>
                      </Tooltip>
                      <Tooltip content="Delete" placement="top" color="danger">
                        <Button isIconOnly size="sm" variant="flat" className="...">🗑️</Button>
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