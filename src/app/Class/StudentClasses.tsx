"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Progress,
  Pagination,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import {
  Search,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  LogOut,
  BookX,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import LeaveClassModal from "./../components/LeaveClassModal";
import JoinClassModal from "./components/JoinClassModal";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrentSemester } from "@/hooks/useCurrentSemester";

import { useGetMyClassesStudentQuery } from "@/store/queries/Class";
import { ClassItem } from "@/types";
import SemesterSelector from "@/components/SemesterSelector";

export default function StudentClasses() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | undefined>("INITIALIZING");
  const { currentSemester, isLoading: isSemestersLoading } = useCurrentSemester();

  useEffect(() => {
    if (selectedSemesterId === "INITIALIZING" && !isSemestersLoading) {
      if (currentSemester) {
        setSelectedSemesterId(currentSemester.semesterId);
      } else {
        setSelectedSemesterId(undefined); // fallback to all if no semester
      }
    }
  }, [currentSemester, isSemestersLoading, selectedSemesterId]);

  const querySemesterId = selectedSemesterId === "INITIALIZING" ? undefined : selectedSemesterId;

  const { data: responseData, isLoading } = useGetMyClassesStudentQuery({ 
    page, 
    pageSize: rowsPerPage, 
    semesterId: querySemesterId 
  }, { skip: selectedSemesterId === "INITIALIZING" });
  const { t } = useTranslation();
  const fetchedClasses = responseData?.data?.items || [];
  const totalCount = responseData?.data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isJoinOpen, onOpen: onJoinOpen, onOpenChange: onJoinOpenChange } = useDisclosure();
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenLeaveModal = (e: React.MouseEvent, cls: ClassItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedClass(cls);
    onOpen();
  };

  const items = useMemo(() => {
    if (!searchQuery) return fetchedClasses;
    return fetchedClasses.filter(c => 
      c.classCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.instances?.[0]?.subjectName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [fetchedClasses, searchQuery]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] p-8 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-[1000] italic tracking-tighter text-[#071739] dark:text-white uppercase leading-none">
            {t("class_management.student_title1") || "MY"} <span className="text-[#FF5C00]">{t("class_management.student_title2") || "CLASSES"}</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">
            {t("class_management.student_subtitle") || "ORGANIZE AND MONITOR YOUR PROGRESS"}
          </p>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35] animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <CardBody className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase italic mb-1 tracking-widest">
                {t("class_management.total_classes") || "Total Classes"}
              </p>
              <p className="text-4xl font-[1000] text-blue-600 dark:text-blue-400 italic leading-none">
                {totalCount}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search class..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Search size={18} className="text-slate-400" />}
            className="max-w-xs font-bold italic"
            classNames={{
              inputWrapper:
                "bg-white dark:bg-[#111c35] rounded-lg h-11 border border-divider shadow-none focus-within:!border-[#FF5C00]",
            }}
          />
          <SemesterSelector 
            selectedSemesterId={querySemesterId} 
            onSemesterChange={setSelectedSemesterId} 
            hideAllOption
          />
          <Button
            isIconOnly
            className="bg-blue-600 text-white h-11 w-11 rounded-lg transition-transform hover:scale-105"
          >
            <RefreshCw size={18} />
          </Button>
          <Button
            color="primary"
            onPress={onJoinOpen}
            className="h-11 font-[1000] italic uppercase bg-[#FF5C00] text-white rounded-lg transition-transform hover:scale-105 ml-auto"
          >
            {t("class_management.join_class") || "Tham Gia Lớp Học"}
          </Button>
        </div>

        {/* GRID LIST */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#FF5C00] mb-4" />
            <p className="text-sm font-bold text-slate-500 italic uppercase">
              {t("class_management.loading") || "Loading classes..."}
            </p>
          </div>
        ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6 mt-4">
          {items.map((cls: ClassItem, index: number) => {
            const instance = cls.instances?.[0];
            const semesterCode = instance?.semesterCode || "UNKNOWN";
            const classNameFull = instance?.subjectName || instance?.subjectCode || "Unassigned Subject";
            const idString = instance ? `${instance.subjectCode}-${cls.classCode}` : cls.classCode;
            const solved = 0;
            const total = 0;
            const progress = total > 0 ? Math.round((solved / total) * 100) : 0;
            
            // animation delay sequence
            const baseDelay = (index % 8) * 100;

            return (
              <div 
                key={cls.classId} 
                className="relative group animate-in fade-in zoom-in slide-in-from-right-8 duration-500 fill-mode-both"
                style={{ animationDelay: `${baseDelay}ms` }}
              >
                <Link href={`/Class/${instance?.classSemesterId || cls.classId}?classCode=${encodeURIComponent(idString)}&semesterCode=${encodeURIComponent(semesterCode)}`} className="block h-full">
                  <Card className="bg-white dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-xl shadow-sm transition-all h-full hover:border-blue-600 dark:hover:border-[#00FF41] hover:-translate-y-1 overflow-hidden">
                    <CardBody className="p-5 flex flex-col justify-between gap-5">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-slate-400 italic uppercase">
                            {semesterCode}
                          </span>
                          <span className="text-[10px] font-black text-[#071739] dark:text-slate-300 italic uppercase">
                            {idString}
                          </span>
                        </div>
                        <h3 className="text-sm font-[1000] text-[#071739] dark:text-white italic uppercase leading-tight line-clamp-2 h-10 group-hover:text-blue-600 dark:group-hover:text-[#00FF41]">
                          {classNameFull}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <CheckCircle2
                                size={13}
                                className="text-blue-600 dark:text-[#00FF41]"
                              />
                              <span className="text-[11px] font-[1000] italic">
                                {solved}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <BookOpen size={13} className="text-[#FF5C00]" />
                              <span className="text-[11px] font-[1000] italic">
                                {total}
                              </span>
                            </div>
                          </div>
                          <Progress
                            size="sm"
                            value={progress}
                            classNames={{
                              indicator:
                                progress === 100
                                  ? "bg-[#00FF41]"
                                  : "bg-[#FF5C00]",
                              track: "bg-slate-100 dark:bg-white/10",
                            }}
                            className="h-1.5"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-divider dark:border-white/5 pt-4 mt-2">
                        <div className="flex gap-2 items-center">
                          {/* NÚT LEAVE CLASS */}
                          <Tooltip
                            content="Leave Class"
                            color="danger"
                            size="sm"
                          >
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="text-slate-300 hover:text-red-500 transition-colors"
                              onClick={(e) => handleOpenLeaveModal(e, cls)}
                            >
                              <LogOut size={14} />
                            </Button>
                          </Tooltip>
                          <span className="text-[10px] font-[1000] uppercase italic text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#00FF41]">
                            Enter Class
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-white/5 group-hover:bg-blue-600 dark:group-hover:bg-[#00FF41] group-hover:text-white transition-all duration-300 shadow-sm">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <BookX size={48} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-[1000] text-[#071739] dark:text-white uppercase italic mb-2">
              {t("class_management.no_classes")}
            </h3>
            <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto">
              {t("class_management.no_classes_student_desc")}
            </p>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 pb-10">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            classNames={{
              cursor:
                "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic",
            }}
          />
        </div>
      </div>
      <JoinClassModal isOpen={isJoinOpen} onOpenChange={onJoinOpenChange} />
    </div>
  );
}
