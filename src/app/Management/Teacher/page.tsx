"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Chip,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Avatar,
} from "@heroui/react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  RefreshCw,
  Eye,
  Bell,
  Trash2,
} from "lucide-react";

// --- REUSED MODALS ---
import DeleteTeacherModal from "../../components/DeleteModal";
import ProfileTeacherModal from "../../components/ProfileModal";
import NotifyTeacherModal from "../../components/NotifyModal";
import { Teacher, Student } from "@/types";

const MOCK_TEACHERS: Teacher[] = [
  {
    id: 1,
    teacherId: "HOAINTT",
    name: "Nguyen Thi Thanh Hoai",
    email: "hoaint@fpt.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=hoai",
    dept: "Software Engineering",
    status: "Active",
    joinDate: "2020-05-10",
    progress: 100,
    total: 10,
  },
  {
    id: 2,
    teacherId: "RIMND",
    name: "Nguyen Duy Rim",
    email: "rimnd@fpt.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=rim",
    dept: "Information System",
    status: "Active",
    joinDate: "2021-02-15",
    progress: 85,
    total: 9,
  },
  {
    id: 3,
    teacherId: "TAIHT",
    name: "Huynh Tan Tai",
    email: "taiht@fpt.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=tai",
    dept: "Software Engineering",
    status: "On Leave",
    joinDate: "2019-11-20",
    progress: 0,
    total: 0,
  },
];

export default function TeacherListPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const pages = Math.ceil(MOCK_TEACHERS.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return MOCK_TEACHERS.slice(start, end);
  }, [page]);

  const openAction = (
    teacher: Teacher,
    actionSetter: (val: boolean) => void
  ) => {
    setSelectedTeacher(teacher);
    actionSetter(true);
  };

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            TEACHER <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Management of Instructors & Staff
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            startContent={<Bell size={18} />}
            onPress={() => {
              setSelectedTeacher(null);
              setIsNotifyOpen(true);
            }}
            // Đổi màu nút Notify All ở Darkmode sang trắng/xám sáng để dễ nhìn
            className="bg-white dark:bg-[#F4F4F5] border border-slate-200 dark:border-transparent text-[#071739] dark:text-[#071739] font-black h-11 px-6 rounded-xl uppercase text-[10px] tracking-wider shadow-sm transition-all hover:opacity-90"
          >
            Notify All
          </Button>
          <Button
            startContent={<Plus size={20} strokeWidth={3} />}
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
          >
            ADD NEW TEACHER
          </Button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search instructor..."
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-none border border-slate-200 dark:border-white/5",
          }}
          className="max-w-xs font-bold italic"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-divider font-[1000] text-[10px] uppercase italic text-[#071739] dark:text-white"
              startContent={<Filter size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Department
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Department Filter">
            <DropdownItem key="se">Software Engineering</DropdownItem>
            <DropdownItem key="is">Information System</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md transition-transform hover:scale-105"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE SECTION - Đã đổi nền dark sang #111c35 */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Teacher Table"
          removeWrapper
          classNames={{
            // Màu nền base giống Card của Class Page
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none",
          }}
        >
          <TableHeader>
            <TableColumn>INSTRUCTOR</TableColumn>
            <TableColumn>DEPARTMENT</TableColumn>
            <TableColumn>JOIN DATE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((t) => (
              <TableRow
                key={t.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={t.avatar}
                      className="w-10 h-10 rounded-xl border-2 border-divider shadow-sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-base font-[1000] uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#FF5C00] transition-colors leading-none">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                        ID: {t.teacherId}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 italic">
                    {t.dept}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-black uppercase text-slate-400">
                    {t.joinDate}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="dot"
                    color={t.status === "Active" ? "success" : "warning"}
                    className="font-black uppercase text-[9px] border-none"
                  >
                    {t.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip content="Profile">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => openAction(t, setIsProfileOpen)}
                        className="transition-all rounded-lg h-9 w-9"
                      >
                        <Eye size={18} className="text-blue-500" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Notify">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => openAction(t, setIsNotifyOpen)}
                        className="transition-all rounded-lg h-9 w-9"
                      >
                        <Bell size={18} className="text-amber-500" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => openAction(t, setIsDeleteOpen)}
                        className="transition-all rounded-lg h-9 w-9"
                      >
                        <Trash2 size={18} className="text-danger" />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="flex w-full justify-center py-6">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={(p) => setPage(p)}
            classNames={{
              cursor:
                "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic",
            }}
          />
        </div>
      </div>

      {/* --- MODALS --- */}
      <ProfileTeacherModal
        isOpen={isProfileOpen}
        onOpenChange={() => setIsProfileOpen(false)}
        student={selectedTeacher as unknown as Student}
      />
      <NotifyTeacherModal
        isOpen={isNotifyOpen}
        onOpenChange={() => setIsNotifyOpen(false)}
        studentEmail={selectedTeacher?.email}
      />
      <DeleteTeacherModal
        isOpen={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        userName={selectedTeacher?.name}
      />
    </div>
  );
}
