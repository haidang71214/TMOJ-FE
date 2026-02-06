"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ChevronDown, Settings, Clock, Inbox } from "lucide-react";
import { SubmissionData } from "./types";

// 1. Sửa lỗi 'any': Định nghĩa kiểu dữ liệu rõ ràng cho Props
interface SubmissionsTabProps {
  onRowClick: (item: SubmissionData) => void;
}

const MOCK_SUBMISSIONS: SubmissionData[] = [
  {
    id: "1",
    status: "Accepted",
    language: "cpp",
    runtime: "3 ms",
    memory: "10.5 MB",
    notes: "",
    timestamp: "Dec 17, 2025",
  },
  {
    id: "2",
    status: "Compile Error",
    language: "python3",
    runtime: "N/A",
    memory: "N/A",
    notes: "Check edge cases",
    timestamp: "Dec 16, 2025",
  },
];

export const SubmissionsTab = ({ onRowClick }: SubmissionsTabProps) => {
  const [submissions] = useState<SubmissionData[]>(MOCK_SUBMISSIONS);
  const [statusFilter, setStatusFilter] = useState("Status");
  const [langFilter, setLangFilter] = useState("Language");

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-[#475569] bg-white dark:bg-[#1C2737] transition-colors duration-500">
        <div className="relative w-32 h-32 opacity-20 mb-6 flex items-center justify-center">
          <Inbox size={80} strokeWidth={1} />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C2737] font-sans transition-colors duration-500">
      <Table
        aria-label="Submissions table"
        removeWrapper
        // Sử dụng onRowAction để bắt sự kiện click chuẩn của HeroUI
        onRowAction={(key) => {
          const item = submissions.find((s) => s.id === key);
          if (item) onRowClick(item);
        }}
        classNames={{
          th: "bg-white dark:bg-[#162130] text-gray-400 dark:text-[#94A3B8] font-black text-[11px] uppercase tracking-wider border-b border-gray-100 dark:border-[#334155] py-4 first:pl-6",
          td: "py-5 first:pl-6 border-b border-gray-50 dark:border-[#1C2737] text-[13px] dark:text-[#CDD5DB] transition-colors",
          tr: "hover:bg-gray-50 dark:hover:bg-[#101828] cursor-pointer group outline-none",
        }}
      >
        <TableHeader>
          <TableColumn>
            <Dropdown className="dark:bg-[#101828] dark:border-[#334155]">
              <DropdownTrigger>
                <div className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-[#E3C39D] transition-colors">
                  {statusFilter} <ChevronDown size={14} />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Status Filter"
                onAction={(key) => setStatusFilter(key as string)}
                className="dark:text-[#F9FAFB]"
              >
                <DropdownItem key="Accepted">Accepted</DropdownItem>
                <DropdownItem key="Compile Error">Compile Error</DropdownItem>
                <DropdownItem key="Runtime Error">Runtime Error</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TableColumn>

          <TableColumn>
            <Dropdown className="dark:bg-[#101828] dark:border-[#334155]">
              <DropdownTrigger>
                <div className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-[#E3C39D] transition-colors">
                  {langFilter} <ChevronDown size={14} />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Language Filter"
                // 2. Sửa lỗi 'setLangFilter' unused: Gắn hàm vào onAction
                onAction={(key) => setLangFilter(key as string)}
              >
                <DropdownItem key="C++">C++</DropdownItem>
                <DropdownItem key="Java">Java</DropdownItem>
                <DropdownItem key="Python3">Python3</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TableColumn>

          <TableColumn>Runtime</TableColumn>
          <TableColumn>Memory</TableColumn>
          <TableColumn>Notes</TableColumn>
          <TableColumn align="end" className="pr-6">
            <Settings
              size={16}
              className="cursor-pointer text-gray-300 dark:text-[#475569] hover:text-black dark:hover:text-white transition-colors ml-auto"
            />
          </TableColumn>
        </TableHeader>

        <TableBody>
          {submissions.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span
                  className={`font-black text-[14px] ${
                    item.status === "Accepted"
                      ? "text-[#2cbb5d]"
                      : "text-[#ef4743] dark:text-[#fb4444]"
                  }`}
                >
                  {item.status}
                </span>
                <div className="text-[11px] text-gray-400 dark:text-[#667085] mt-1.5 flex items-center gap-1.5 font-bold">
                  <Clock size={12} /> {item.timestamp}
                </div>
              </TableCell>
              <TableCell>
                <span className="bg-gray-100 dark:bg-[#101828] px-2.5 py-1 rounded-lg text-gray-600 dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-tight border dark:border-[#334155]">
                  {item.language}
                </span>
              </TableCell>
              <TableCell className="font-bold dark:text-[#F9FAFB]">
                {item.runtime}
              </TableCell>
              <TableCell className="font-bold dark:text-[#F9FAFB]">
                {item.memory}
              </TableCell>
              <TableCell className="text-gray-400 dark:text-[#475569] italic text-[12px]">
                {item.notes || "No notes"}
              </TableCell>
              <TableCell className="text-right pr-6">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="invisible group-hover:visible dark:text-[#667085] hover:dark:text-white"
                >
                  <Settings size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
