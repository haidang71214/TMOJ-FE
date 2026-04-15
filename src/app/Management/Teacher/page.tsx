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
  Spinner,
  addToast,
} from "@heroui/react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";

// --- REUSED MODALS ---
import DeleteTeacherModal from "../../components/DeleteModal";
import TeacherDetailModal from "./TeacherDetailModal";
import NotifyTeacherModal from "../../components/NotifyModal";
import {  Student, Users } from "@/types";
import { useGetUserRoleQuery, useLockUserMutation, useUnlockUserMutation } from "@/store/queries/user";
import { useTranslation } from "@/hooks/useTranslation";

export default function TeacherListPage() {
  const { t, language } = useTranslation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const { data: teacherResponse, isLoading } = useGetUserRoleQuery({ roleName: "teacher" });
  const fetchedTeachers = teacherResponse?.data || [];
  console.log(fetchedTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Users | null>(null);

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return fetchedTeachers;
    const q = searchQuery.toLowerCase();
    return fetchedTeachers.filter((user: Users) => {
      const name = (user.displayName || (user.firstName + " " + user.lastName) || "").toLowerCase();
      const code = ( user.userId || "").toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [fetchedTeachers, searchQuery]);

  const pages = Math.ceil(filteredTeachers.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTeachers.slice(start, end);
  }, [page, filteredTeachers]);

  const openAction = (
    teacher: Users,
    actionSetter: (val: boolean) => void
  ) => {
    setSelectedTeacher(teacher);
    actionSetter(true);
  };

  const [lockUser] = useLockUserMutation();
  const [unlockUser] = useUnlockUserMutation();

  const handleToggleLock = async (u: Users) => {
    try {
      if (u.isLocked) {
        await unlockUser(u.userId).unwrap();
        addToast({ title: t('common.unlocked_success') || "Account unlocked successfully", color: "success" });
      } else {
        await lockUser(u.userId).unwrap();
         addToast({ title: t('common.locked_success') || "Account locked successfully", color: "success" });
      }
    } catch (e) {
      console.error(e);
      addToast({ title: t('common.error') || "Failed to update account status", color: "danger" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-tight">
            {language === 'vi' ? 'QUẢN LÝ ' : `${t('teacher_management.teacher') || 'TEACHER'} `} 
            <span className="text-[#FF5C00]">
              {language === 'vi' ? 'GIẢNG VIÊN' : (t('teacher_management.management') || 'MANAGEMENT')}
            </span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            {t('teacher_management.desc') || (language === 'vi' ? 'Quản lý nhân sự và giảng viên' : 'Management of Instructors & Staff')}
          </p>
        </div>
        <div className="flex gap-3">
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-wrap items-center gap-3 shrink-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "200ms" }}>
        <Input
          placeholder={t('teacher_management.search_placeholder') || (language === 'vi' ? 'Tìm kiếm giảng viên...' : 'Search instructor...')}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-none border border-slate-200 dark:border-white/5",
          }}
          className="max-w-xs font-bold italic"
        />



        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md transition-transform hover:scale-105 active-bump"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "250ms" }}>
        <Table
          aria-label="Teacher Table"
          removeWrapper
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none",
          }}
        >
          <TableHeader>
            <TableColumn>{t('teacher_management.instructor') || (language === 'vi' ? 'GIẢNG VIÊN' : 'INSTRUCTOR')}</TableColumn>
            <TableColumn>{t('common.email') || (language === 'vi' ? 'EMAIL' : 'EMAIL')}</TableColumn>
            <TableColumn>{t('common.status') || (language === 'vi' ? 'TRẠNG THÁI' : 'STATUS')}</TableColumn>
            <TableColumn className="text-right">{t('common.operations') || (language === 'vi' ? 'THAO TÁC' : 'OPERATIONS')}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t('common.no_data') || (language === 'vi' ? 'Không có dữ liệu' : 'No data available')}>
            {items.map((tUser: Users, index: number) => (
              <TableRow
                key={tUser.userId}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors animate-fade-in-right"
                style={{ animationFillMode: "both", animationDelay: `${300 + index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={tUser.avatarUrl || ""}
                      className="w-10 h-10 rounded-xl border-2 border-divider shadow-sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-base font-[1000] uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#FF5C00] transition-colors leading-none">
                        {tUser.displayName || `${tUser.firstName} ${tUser.lastName}`}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                        ID: {tUser.userId ? tUser.userId.substring(0, 8) : "N/A"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400">
                    {tUser.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="dot"
                    color={!tUser.isLocked ? "success" : "warning"}
                    className="font-black uppercase text-[9px] border-none"
                  >
                    {!tUser.isLocked ? (t('common.active') || (language === 'vi' ? 'Hoạt động' : 'Active')) : (t('common.locked') || (language === 'vi' ? 'Đã khóa' : 'Locked'))}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip content={t('common.profile') || (language === 'vi' ? 'Hồ sơ' : 'Profile')} placement="top" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => openAction(tUser, setIsProfileOpen)}
                        className="transition-all rounded-lg h-9 w-9 animate-fade-in-up hover:bg-blue-100 dark:hover:bg-blue-500/20"
                        style={{ animationFillMode: "both", animationDelay: `${300 + index * 50 + 100}ms` }}
                      >
                        <Eye size={18} className="text-blue-500" />
                      </Button>
                    </Tooltip>

                    <Tooltip content={tUser.isLocked ? (t('common.unlock') || (language === 'vi' ? 'Mở khóa' : 'Unlock')) : (t('common.lock') || (language === 'vi' ? 'Khóa' : 'Lock'))} placement="top" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleToggleLock(tUser)}
                        className="transition-all rounded-lg h-9 w-9 animate-fade-in-up hover:bg-rose-100 dark:hover:bg-rose-500/20"
                        style={{ animationFillMode: "both", animationDelay: `${300 + index * 50 + 150}ms` }}
                      >
                         {tUser.isLocked ? <Unlock size={18} className="text-success" /> : <Lock size={18} className="text-danger" />}
                      </Button>
                    </Tooltip>                  </div>
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
      <TeacherDetailModal
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        teacherId={selectedTeacher?.userId}
      />
      <NotifyTeacherModal
        isOpen={isNotifyOpen}
        onOpenChange={() => setIsNotifyOpen(false)}
        studentEmail={selectedTeacher?.email} // Make sure it passes valid prop if needed
      />
      <DeleteTeacherModal
        isOpen={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        userName={selectedTeacher?.displayName || selectedTeacher?.firstName}
      />
    </div>
  );
}
