"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@heroui/react";
import {
  Search,
  Plus,
  RefreshCw,
  ArrowRight,
  Filter,
  ChevronDown,
  SortAsc,
  BookOpen,
  Users,
} from "lucide-react";
import Link from "next/link";

const CLASSES_DATA = [
  {
    id: "SDN302",
    name: "Server-Side development with NodeJS, Express, and MongoDB",
    semester: "FALL 2025",
    students: 35,
    problems: 120,
  },
  {
    id: "WDP301",
    name: "Web Development Project - Dự án phát triển Web",
    semester: "FALL 2025",
    students: 42,
    problems: 85,
  },
  {
    id: "MLN122",
    name: "Political economics of Marxism – Leninism",
    semester: "FALL 2025",
    students: 60,
    problems: 45,
  },
  {
    id: "PRM392",
    name: "Mobile Programming - Lập trình di động",
    semester: "FALL 2025",
    students: 28,
    problems: 150,
  },
  {
    id: "PRF192",
    name: "Programming Fundamentals",
    semester: "SPRING 2026",
    students: 50,
    problems: 200,
  },
  {
    id: "PRO192",
    name: "Object-Oriented Programming",
    semester: "SPRING 2026",
    students: 45,
    problems: 180,
  },
  {
    id: "DBI202",
    name: "Introduction to Databases",
    semester: "SPRING 2026",
    students: 55,
    problems: 110,
  },
  {
    id: "OSG202",
    name: "Operating Systems",
    semester: "SPRING 2026",
    students: 30,
    problems: 95,
  },
  {
    id: "SWE301",
    name: "Software Requirement",
    semester: "SUMMER 2026",
    students: 20,
    problems: 60,
  },
  {
    id: "IOT102",
    name: "Introduction to IoT",
    semester: "SUMMER 2026",
    students: 15,
    problems: 130,
  },
];

const STATS_DATA = [
  { label: "Total Classes", value: "12", color: "text-blue-500" },
  { label: "Total Students", value: "450", color: "text-[#FF5C00]" },
  { label: "Total Problems", value: "1,200", color: "text-emerald-500" },
];

export default function ClassListPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const pages = Math.ceil(CLASSES_DATA.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return CLASSES_DATA.slice(start, end);
  }, [page]);

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            CLASS <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Organize and monitor your courses
          </p>
        </div>
        <Link href="/Management/Class/create">
          <Button
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all"
            startContent={<Plus size={16} />}
          >
            CREATE NEW CLASS
          </Button>
        </Link>
      </div>

      {/* MINIMAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        {STATS_DATA.map((stat, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-[#111827] border-none rounded-2xl shadow-sm"
          >
            <CardBody className="p-4 flex flex-col justify-center">
              <p className="text-[9px] font-black text-[#A4B5C4] uppercase tracking-widest mb-1 italic">
                {stat.label}
              </p>
              <p className={`text-2xl font-black ${stat.color}`}>
                {stat.value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search class..."
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111827] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:border-blue-500/50 transition-colors",
          }}
          className="max-w-xs font-medium"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
              startContent={<Filter size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Semester
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Semester">
            <DropdownItem key="f25">FALL 2025</DropdownItem>
            <DropdownItem key="s26">SPRING 2026</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
              startContent={<SortAsc size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Sort By
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Sort">
            <DropdownItem key="students">Student Count</DropdownItem>
            <DropdownItem key="name">Class Name</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* GRID SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
          {items.map((cls) => (
            <Link
              href={`/Management/Class/${cls.id}`}
              key={cls.id}
              className="h-full"
            >
              <Card className="bg-white dark:bg-[#111827] border-none rounded-2xl transition-all p-3 shadow-sm group h-full border-b-4 border-transparent hover:border-blue-600 dark:hover:border-[#22C55E] hover:-translate-y-1.5">
                <CardBody className="p-2 flex flex-col justify-between h-full gap-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Chip
                        variant="flat"
                        size="sm"
                        className="font-black bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 uppercase italic text-[9px] h-5"
                      >
                        {cls.semester}
                      </Chip>
                      <span className="text-[10px] font-black text-[#071739] dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors uppercase italic">
                        {cls.id}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-[#071739] dark:text-slate-200 leading-snug tracking-tight line-clamp-2 h-10 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
                      {cls.name}
                    </h3>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Users size={12} className="text-blue-500" />
                        <p className="text-[10px] font-bold italic tracking-tight">
                          {cls.students}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <BookOpen size={12} className="text-emerald-500" />
                        <p className="text-[10px] font-bold italic tracking-tight">
                          {cls.problems}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[#071739] dark:text-slate-500 font-bold text-[10px] uppercase tracking-tighter transition-all group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
                    <span>Enter Course</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-[#22C55E] group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex w-full justify-center py-4">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={(p) => setPage(p)}
            classNames={{
              cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-bold",
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
