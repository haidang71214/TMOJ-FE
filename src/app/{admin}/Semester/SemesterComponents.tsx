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
import { useModal } from "@/Provider/ModalProvider";
import CreateUpdateSemesterModal from "./CreateUpdateSemesterModal";
import { UpdateSemesterRequest } from "@/types";

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
      a.download = "SemesterTemplate.xlsx";
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

  const handleToggleActive = async (s: UpdateSemesterRequest,id:string) => {
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
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" color="secondary" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading semesters...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Semester Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Manage all semesters in the system
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
            isLoading={isDownloading}
            onPress={handleDownloadTemplate}
          >
            Get Template
          </Button>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx,.xls,.csv" 
            onChange={handleFileChange} 
          />
          <Button
            className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold"
            isLoading={isImporting}
            onPress={() => fileInputRef.current?.click()}
          >
            Import
          </Button>

          <Button
            className="font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow:
                "0 4px 15px rgba(99, 102, 241, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
            }}
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            }
            onPress={() =>
              openModal({
                content: <CreateUpdateSemesterModal />,
              })
            }
          >
            Create Semester
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-xl px-5 py-4 border border-indigo-200 dark:border-indigo-500/15"
          style={{
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04))",
          }}
        >
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
            Total Semesters
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            {semesters.length}
          </p>
        </div>
        <div
          className="rounded-xl px-5 py-4 border border-emerald-200 dark:border-emerald-500/15"
          style={{
            background:
              "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.04))",
          }}
        >
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Active
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {semesters.filter((s) => s.isActive).length}
          </p>
        </div>
        <div
          className="rounded-xl px-5 py-4 border border-red-200 dark:border-red-500/15"
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(244, 63, 94, 0.04))",
          }}
        >
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">
            Inactive
          </p>
          <p className="text-3xl font-extrabold text-red-500 dark:text-red-400 mt-1">
            {semesters.filter((s) => !s.isActive).length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
        style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}
      >
        <Table
          aria-label="Semester table"
          removeWrapper
          classNames={{
            th: "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-white/5 py-3",
            td: "py-3 text-sm border-b border-gray-100 dark:border-white/[0.03]",
            tr: "hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors",
          }}
        >
          <TableHeader>
            <TableColumn>Code</TableColumn>
            <TableColumn>Semester Name</TableColumn>
            <TableColumn>Period</TableColumn>
            <TableColumn align="center">Status</TableColumn>
            <TableColumn align="center">Action</TableColumn>
          </TableHeader>

          <TableBody
            items={semesters}
            emptyContent={
              <div className="py-10 text-center">
                <p className="text-gray-400 text-sm">
                  No semesters found. Create one to get started.
                </p>
              </div>
            }
          >
            {(s) => (
              <TableRow key={s.semesterId}>
                <TableCell>
                  <span
                    className="font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md text-xs"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    {s.code}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {s.name}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-gray-600 dark:text-slate-400">
                    {s.startAt} → {s.endAt}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center flex-col items-center gap-2">
                    {new Date(s.endAt) < new Date() ? (
                      <Chip size="sm" variant="flat" classNames={{ base: "bg-gray-500/10", content: "text-gray-500 text-xs font-bold" }}>
                        Ended
                      </Chip>
                    ) : new Date(s.startAt) > new Date() ? (
                      <Chip size="sm" variant="flat" classNames={{ base: "bg-amber-500/10", content: "text-amber-500 text-xs font-bold" }}>
                        Upcoming
                      </Chip>
                    ) : (
                      <Chip size="sm" variant="flat" classNames={{ base: "bg-emerald-500/10", content: "text-emerald-500 text-xs font-bold" }}>
                        Active Period
                      </Chip>
                    )}
                    {s.isActive ? (
                      <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                          base: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20",
                          content:
                            "text-emerald-600 dark:text-emerald-400 text-xs font-bold",
                        }}
                        startContent={
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1 animate-pulse" />
                        }
                      >
                        Visible
                      </Chip>
                    ) : (
                      <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                          base: "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20",
                          content:
                            "text-red-600 dark:text-red-400 text-xs font-bold",
                        }}
                      >
                        Hidden
                      </Chip>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Tooltip content="Edit" placement="top">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-gray-100 dark:bg-white/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 min-w-7 w-7 h-7 transition-colors"
                        onPress={() =>
                          openModal({
                            content: <CreateUpdateSemesterModal semester={s} />,
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Button>
                    </Tooltip>
                    
                    <Tooltip content={s.isActive ? "Hide" : "Show"} placement="top">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className={`min-w-7 w-7 h-7 transition-colors ${
                          s.isActive 
                            ? "bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400" 
                            : "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400"
                        }`}
                        onPress={() => handleToggleActive(s,s.semesterId)}
                      >
                        {s.isActive ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
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
