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
} from "lucide-react";
import Link from "next/link";
import LeaveClassModal from "./../components/LeaveClassModal";

import { useGetMyClassesTeacherQuery } from "@/store/queries/Class";
import { ClassItem } from "@/types";
import SemesterSelector from "@/components/SemesterSelector";

export default function TeacherClasses() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | undefined>(undefined);

  const { data: responseData, isLoading } = useGetMyClassesTeacherQuery({ 
    page, 
    pageSize: rowsPerPage, 
    semesterId: selectedSemesterId 
  });
  const fetchedClasses = responseData?.data?.items || [];
  const totalCount = responseData?.data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;
console.log(responseData);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
            TEACHING <span className="text-[#FF5C00]">CLASSES</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">
            MANAGE YOUR TEACHING CLASSES
          </p>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35]">
            <CardBody className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase italic mb-1 tracking-widest">
                Total Classes
              </p>
              <p className="text-4xl font-[1000] text-blue-600 dark:text-blue-400 italic leading-none">
                {totalCount}
              </p>
            </CardBody>
          </Card>
          <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35]">
            <CardBody className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase italic mb-1 tracking-widest">
                Total Solved
              </p>
              <p className="text-4xl font-[1000] text-[#FF5C00] italic leading-none">
                403
              </p>
            </CardBody>
          </Card>
          <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35]">
            <CardBody className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase italic mb-1 tracking-widest">
                Total Problems
              </p>
              <p className="text-4xl font-[1000] text-[#00FF41] italic leading-none">
                985
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
            selectedSemesterId={selectedSemesterId} 
            onSemesterChange={setSelectedSemesterId} 
          />
          <Button
            isIconOnly
            className="bg-blue-600 text-white h-11 w-11 rounded-lg transition-transform hover:scale-105"
          >
            <RefreshCw size={18} />
          </Button>
        </div>

        {/* GRID LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
          {items.map((cls: ClassItem) => {
            const instance = cls.instances?.[0];
            const semesterCode = instance?.semesterCode || "UNKNOWN";
            const classNameFull = instance?.subjectName || instance?.subjectCode || "Unassigned Subject";
            const idString = instance ? `${instance.subjectCode}-${cls.classCode}` : cls.classCode;
            const solved = 0;
            const total = 0;
            const progress = total > 0 ? Math.round((solved / total) * 100) : 0;
            
            return (
              <div key={cls.classId} className="relative group">
                <Link href={`/Class/${instance?.classSemesterId || cls.classId}`} className="block h-full">
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
    </div>
  );
}
