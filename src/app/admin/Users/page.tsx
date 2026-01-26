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
} from "@heroui/react";
import {
  Edit3,
  UserPlus,
  Shield,
  Lock,
  Unlock,
  KeyRound,
  Search,
  Filter,
  ChevronDown,
  SortAsc,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

const USERS_DATA = [
  {
    id: 1001,
    username: "admin_tmoj",
    fullName: "Nguyễn Văn Admin",
    email: "admin@tmoj.vn",
    role: "SuperAdmin",
    status: "Active",
    lastLogin: "2026-01-25 14:30",
    contestCreated: 42,
  },
  {
    id: 1002,
    username: "mod_hai",
    fullName: "Hải Moderator",
    email: "hai.mod@tmoj.vn",
    role: "ContestAdmin",
    status: "Active",
    lastLogin: "2026-01-26 06:15",
    contestCreated: 8,
  },
  {
    id: 1003,
    username: "judge_khoa",
    fullName: "Trần Khoa Judge",
    email: "judge.khoa@tmoj.vn",
    role: "ProblemSetter",
    status: "Suspended",
    lastLogin: "2025-12-10 09:45",
    contestCreated: 1,
  },
  {
    id: 1004,
    username: "user_test",
    fullName: "Test Account",
    email: "test@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2026-01-20 22:10",
    contestCreated: 0,
  },
  {
    id: 1005,
    username: "banned_spam",
    fullName: "Nguyễn Spam",
    email: "spam@trash.com",
    role: "User",
    status: "Banned",
    lastLogin: "2025-11-05 03:22",
    contestCreated: 0,
  },
];

export default function AdminListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(USERS_DATA.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return USERS_DATA.slice(start, end);
  }, [page]);

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            USER <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Manage users, roles, permissions & security
          </p>
        </div>
        <Button
          startContent={<UserPlus size={20} strokeWidth={3} />}
          onClick={() => router.push("/Management/Admin/create")}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          CREATE NEW ADMIN / USER
        </Button>
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search username, email or name..."
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111827] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] transition-colors",
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
              Role
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Role Filter">
            <DropdownItem key="superadmin">SuperAdmin</DropdownItem>
            <DropdownItem key="contestadmin">ContestAdmin</DropdownItem>
            <DropdownItem key="problemsetter">ProblemSetter</DropdownItem>
            <DropdownItem key="moderator">Moderator</DropdownItem>
            <DropdownItem key="user">User</DropdownItem>
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
            <DropdownItem key="lastLogin">Last Login</DropdownItem>
            <DropdownItem key="role">Role</DropdownItem>
            <DropdownItem key="id">ID</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Admin & User Management Table"
          removeWrapper
          classNames={{
            base: "bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none",
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>FULL NAME</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>LAST LOGIN</TableColumn>
            <TableColumn>CONTESTS</TableColumn>
            <TableColumn className="text-right">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((u) => (
              <TableRow
                key={u.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <span className="text-slate-400 font-black italic text-xs">
                    #{u.id}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                    {u.username}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {u.fullName}
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-black uppercase text-[9px] px-3 ${
                      u.role === "SuperAdmin"
                        ? "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                        : u.role === "ContestAdmin"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                        : u.role === "ProblemSetter"
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"
                        : "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
                    }`}
                  >
                    {u.role}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="dot"
                    color={
                      u.status === "Active"
                        ? "success"
                        : u.status === "Suspended"
                        ? "warning"
                        : "danger"
                    }
                    className="font-black uppercase text-[9px] border-none"
                  >
                    {u.status}
                  </Chip>
                </TableCell>
                <TableCell className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {u.lastLogin}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300">
                    {u.contestCreated}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip content="Edit Role" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() => router.push(`/Management/Admin/${u.id}/edit`)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Edit3 size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Manage Permissions" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-lg h-9 w-9"
                      >
                        <Shield size={16} />
                      </Button>
                    </Tooltip>

                    {u.status === "Active" ? (
                      <Tooltip content="Suspend / Ban" className="font-bold text-[10px]">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all rounded-lg h-9 w-9"
                        >
                          <Lock size={16} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip content="Unban / Activate" className="font-bold text-[10px]">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all rounded-lg h-9 w-9"
                        >
                          <Unlock size={16} />
                        </Button>
                      </Tooltip>
                    )}

                    <Tooltip content="Reset Password" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all rounded-lg h-9 w-9"
                      >
                        <KeyRound size={16} />
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
            color="primary"
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