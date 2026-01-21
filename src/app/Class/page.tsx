"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Progress,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Search,
  RefreshCw,
  ArrowRight,
  Filter,
  ChevronDown,
  SortAsc,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const STUDENT_CLASSES_DATA = [
  {
    id: "SDN302",
    name: "Server-Side development with NodeJS, Express, and MongoDB",
    semester: "FALL 2025",
    solved: 45,
    total: 120,
  },
  {
    id: "WDP301",
    name: "Web Development Project - Dự án phát triển Web",
    semester: "FALL 2025",
    solved: 85,
    total: 85,
  },
  {
    id: "MLN122",
    name: "Political economics of Marxism – Leninism",
    semester: "FALL 2025",
    solved: 10,
    total: 45,
  },
  {
    id: "PRM392",
    name: "Mobile Programming - Lập trình di động",
    semester: "FALL 2025",
    solved: 28,
    total: 150,
  },
  {
    id: "PRF192",
    name: "Programming Fundamentals",
    semester: "SPRING 2026",
    solved: 120,
    total: 200,
  },
  {
    id: "PRO192",
    name: "Object-Oriented Programming",
    semester: "SPRING 2026",
    solved: 30,
    total: 180,
  },
  {
    id: "DBI202",
    name: "Introduction to Databases",
    semester: "SPRING 2026",
    solved: 55,
    total: 110,
  },
  {
    id: "OSG202",
    name: "Operating Systems",
    semester: "SPRING 2026",
    solved: 30,
    total: 95,
  },
];

export default function StudentClassListPage() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPages = Math.ceil(STUDENT_CLASSES_DATA.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return STUDENT_CLASSES_DATA.slice(start, start + rowsPerPage);
  }, [page]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] p-8 transition-colors duration-300 custom-scrollbar">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-[1000] italic tracking-tighter text-[#071739] dark:text-white uppercase leading-none">
            MY <span className="text-[#FF5C00]">CLASSES</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic leading-none">
            ORGANIZE AND MONITOR YOUR PROGRESS
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
                8
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

        {/* TOOLBAR SECTION */}
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Search class..."
            startContent={<Search size={18} className="text-slate-400" />}
            className="max-w-xs font-bold italic"
            classNames={{
              inputWrapper:
                "bg-white dark:bg-[#111c35] rounded-lg h-11 border border-divider shadow-none",
            }}
          />

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white dark:bg-[#111c35] border border-divider h-11 rounded-lg font-[1000] text-[10px] uppercase italic text-[#071739] dark:text-white"
                startContent={<Filter size={16} />}
                endContent={<ChevronDown size={14} />}
              >
                Semester
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Semester Filter">
              <DropdownItem key="f25">FALL 2025</DropdownItem>
              <DropdownItem key="s26">SPRING 2026</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white dark:bg-[#111c35] border border-divider h-11 rounded-lg font-[1000] text-[10px] uppercase italic text-[#071739] dark:text-white"
                startContent={<SortAsc size={16} />}
                endContent={<ChevronDown size={14} />}
              >
                Sort By
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Sort options">
              <DropdownItem key="name">Name</DropdownItem>
              <DropdownItem key="solved">Progress</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button
            isIconOnly
            className="bg-blue-600 dark:bg-blue-600 text-white h-11 w-11 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <RefreshCw size={18} />
          </Button>
        </div>

        {/* GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
          {items.map((cls) => {
            const progress = Math.round((cls.solved / cls.total) * 100);
            return (
              <Link href={`/Class/${cls.id}`} key={cls.id} className="group">
                <Card
                  className="bg-white dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-xl shadow-sm transition-all h-full
                                hover:border-blue-600 dark:hover:border-[#00FF41] 
                                hover:-translate-y-1 overflow-hidden"
                >
                  <CardBody className="p-5 flex flex-col justify-between gap-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 italic uppercase leading-none">
                          {cls.semester}
                        </span>
                        <span className="text-[10px] font-black text-[#071739] dark:text-slate-300 italic uppercase leading-none group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                          {cls.id}
                        </span>
                      </div>
                      <h3
                        className="text-sm font-[1000] text-[#071739] dark:text-white italic uppercase leading-tight line-clamp-2 h-10 
                                     group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors"
                      >
                        {cls.name}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <CheckCircle2
                              size={13}
                              className="text-blue-600 dark:text-[#00FF41] transition-colors"
                            />
                            <span className="text-[11px] font-[1000] italic">
                              {cls.solved}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <BookOpen size={13} className="text-[#FF5C00]" />
                            <span className="text-[11px] font-[1000] italic">
                              {cls.total}
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
                      <span className="text-[10px] font-[1000] uppercase italic text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                        Enter Class
                      </span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-white/5 
                                      group-hover:bg-blue-600 dark:group-hover:bg-[#00FF41] group-hover:text-white transition-all duration-300 shadow-sm"
                      >
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
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
