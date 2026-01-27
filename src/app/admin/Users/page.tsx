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
    <div className="flex flex-col h-full gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            <span className="text-indigo-700 dark:text-cyan-400">User</span>{" "}
            <span className="text-fuchsia-500">Management</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-2 italic text-slate-500 dark:text-indigo-400">
            Manage users, roles, permissions & security
          </p>
        </div>

        <Button
          startContent={<UserPlus size={18} />}
          onClick={() => router.push("/Management/Admin/create")}
          className="
            bg-indigo-600 text-white
            dark:bg-gradient-to-r dark:from-cyan-400 dark:to-fuchsia-500
            dark:text-black
            font-black h-11 px-6 rounded-xl shadow-lg
            uppercase text-[10px] tracking-wider
            active:scale-95
          "
        >
          Create new user
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search username, email or name..."
          startContent={
            <Search size={18} className="text-slate-400 dark:text-indigo-400" />
          }
          classNames={{
            inputWrapper: `
              bg-white border border-slate-200 rounded-xl h-12 shadow-sm
              dark:bg-black/40 dark:border-white/10 dark:backdrop-blur
              focus-within:!border-indigo-600
              dark:focus-within:!border-cyan-400
            `,
          }}
          className="max-w-xs font-medium"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="
                h-12 rounded-xl
                bg-white border border-slate-200
                dark:bg-black/40 dark:border-white/10
                font-bold text-[11px] uppercase tracking-wider
              "
              startContent={<Filter size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Role
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="superadmin">SuperAdmin</DropdownItem>
            <DropdownItem key="contestadmin">ContestAdmin</DropdownItem>
            <DropdownItem key="problemsetter">ProblemSetter</DropdownItem>
            <DropdownItem key="user">User</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="
                h-12 rounded-xl
                bg-white border border-slate-200
                dark:bg-black/40 dark:border-white/10
                font-bold text-[11px] uppercase tracking-wider
              "
              startContent={<SortAsc size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Sort
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="lastLogin">Last login</DropdownItem>
            <DropdownItem key="role">Role</DropdownItem>
            <DropdownItem key="id">ID</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          className="
            h-12 w-12 rounded-xl
            bg-indigo-600 text-white
            dark:bg-white/10 dark:text-cyan-400
            hover:opacity-90
          "
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <Table
          removeWrapper
          classNames={{
            base: `
              rounded-2xl p-4
              bg-white border border-slate-200 shadow-sm
              dark:bg-black/40 dark:border-white/10 dark:backdrop-blur-xl
            `,
            th: `
              text-slate-400 dark:text-indigo-400
              font-black uppercase tracking-widest text-[10px]
              border-b border-slate-100 dark:border-white/5
              pb-4
            `,
            td: `
              py-6 font-bold
              text-slate-700 dark:text-slate-200
              border-b border-slate-50 dark:border-white/5
              last:border-none
            `,
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
                className="hover:bg-slate-50 dark:hover:bg-white/5 transition"
              >
                <TableCell className="text-slate-400 italic text-xs">
                  #{u.id}
                </TableCell>

                <TableCell className="uppercase italic font-black tracking-tight text-black dark:text-white">
                  {u.username}
                </TableCell>

                <TableCell className="text-sm font-medium">
                  {u.fullName}
                </TableCell>

                <TableCell>
                  <Chip
                    size="sm"
                    className={`
                      font-black uppercase text-[9px] px-3
                      ${
                        u.role === "SuperAdmin"
                          ? "bg-red-500/10 text-red-500"
                          : u.role === "ContestAdmin"
                          ? "bg-indigo-500/10 text-indigo-500"
                          : u.role === "ProblemSetter"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-slate-500/10 text-slate-500"
                      }
                    `}
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
                    className="font-black uppercase text-[9px]"
                  >
                    {u.status}
                  </Chip>
                </TableCell>

                <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                  {u.lastLogin}
                </TableCell>

                <TableCell className="font-black">
                  {u.contestCreated}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip content="Edit">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 hover:text-indigo-600 dark:hover:text-cyan-400"
                      >
                        <Edit3 size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Permissions">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 hover:text-fuchsia-500"
                      >
                        <Shield size={16} />
                      </Button>
                    </Tooltip>

                    {u.status === "Active" ? (
                      <Tooltip content="Suspend">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-slate-100 dark:bg-white/5 hover:text-orange-500"
                        >
                          <Lock size={16} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip content="Activate">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-slate-100 dark:bg-white/5 hover:text-green-500"
                        >
                          <Unlock size={16} />
                        </Button>
                      </Tooltip>
                    )}

                    <Tooltip content="Reset password">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 hover:text-purple-500"
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
        <div className="flex justify-center py-6">
          <Pagination
            isCompact
            showControls
            page={page}
            total={pages}
            onChange={(p) => setPage(p)}
            classNames={{
              cursor:
                "bg-indigo-600 text-white dark:bg-cyan-400 dark:text-black font-bold",
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
