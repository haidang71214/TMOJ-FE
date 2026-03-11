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
  Spinner,
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
import { useGetClassesQuery } from "@/store/queries/Class";
import CreateSlotForm from "./CreateClassSlotModal";
import { useModal } from "@/Provider/ModalProvider";
import UpdateTeacherModal from "./UpdateTeacherModal";

export default function ClassListPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const { openModal } = useModal();

const openCreateSlotModal = (classId: string) => {
  openModal({
    content: <CreateSlotForm classId={classId} />,
  });
};
const openUpdateTeacherForClass = (
  classId: string,
  currentTeacherId?: string
) => {
  openModal({
    content: (
      <UpdateTeacherModal
        classId={classId}
        currentTeacherId={currentTeacherId}
      />
    ),
  });
};
  const { data, isLoading, refetch } = useGetClassesQuery();
  const classes = data?.data?.items ?? [];

  const pages = Math.ceil(classes.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return classes.slice(start, end);
  }, [page, classes]);

  
  const statsData = [
    { label: "Total Classes", value: classes.length.toString(), color: "text-blue-500" },
    { label: "Total Students", value: classes.reduce((sum, c) => sum + (c.memberCount || 0), 0).toString(), color: "text-[#FF5C00]" },
    { label: "Active Classes", value: classes.filter(c => c.isActive).length.toString(), color: "text-emerald-500" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px]">
        <Spinner size="lg" color="secondary" />
        <p className="text-sm text-slate-500 animate-pulse mt-3 font-semibold tracking-wide">
          Loading classes...
        </p>
      </div>
    );
  }

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
        {statsData.map((stat, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-[#111c35] border-none rounded-2xl shadow-sm"
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
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:border-blue-500/50 transition-colors",
          }}
          className="max-w-xs font-medium"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
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
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
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
          onPress={() => refetch()}
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* GRID SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
          {items.map((cls) => (
            <div
              key={cls.classId}
              className="h-full"
            >
              <Card className="bg-white dark:bg-[#111c35] border-none rounded-2xl transition-all p-3 shadow-sm group h-full border-b-4 border-transparent hover:border-blue-600 dark:hover:border-[#22C55E] ">
                <CardBody className="p-2 flex flex-col justify-between h-full gap-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <Chip
                        variant="flat"
                        size="sm"
                        className="font-black bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 uppercase italic text-[9px] h-5"
                      >
                        {cls.semester?.code || "N/A"}
                      </Chip>
                      <span className="text-[10px] font-black text-[#071739] dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors uppercase italic break-all text-right">
                        {cls.classCode}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-[#071739] dark:text-slate-200 leading-snug tracking-tight line-clamp-2 h-10 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors gap-1">
                      {cls.className}
                      <br/>
                      <span className="text-[10px] text-slate-500 inline-block font-semibold mt-0.5">{cls.subject?.name}</span>
                    </h3>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Users size={12} className="text-blue-500" />
                        <p className="text-[10px] font-bold italic tracking-tight">
                          {cls.memberCount || 0}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <BookOpen size={12} className={cls.isActive ? "text-emerald-500" : "text-red-500"} />
                        <p className="text-[10px] font-bold italic tracking-tight">
                          {cls.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[#071739] dark:text-slate-500 font-bold text-[10px] uppercase tracking-tighter transition-all group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
                 <Button
                  variant="bordered"
                  size="sm"
                  radius="md"
                  color="warning"
                  startContent={<Plus size={16} />}
                  onPress={() => openCreateSlotModal(cls.classId)}
                >
                  Add Slot
                </Button>
                  <Button
                  variant="bordered"
                  size="sm"
                  radius="md"
                  color="danger"
                  startContent={<Plus size={16} />}
                  onPress={() =>
  openUpdateTeacherForClass(
    cls.classId,
    cls.teacher?.userId
  )
}
                >
                  Update Teacher
                </Button>
                    <Link
                  href={`/Management/Class/${cls.classId}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-[#22C55E] group-hover:text-white transition-all duration-300 shadow-sm"
                >
                  <ArrowRight size={14} />
                </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {classes.length === 0 && !isLoading && (
          <div className="p-10 text-center text-slate-500 font-medium">
            No classes found. Create one to get started!
          </div>
        )}

        {/* PAGINATION */}
        {classes.length > 0 && (
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
        )}
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
