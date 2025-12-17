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
import { ChevronDown, Settings, Clock } from "lucide-react";
import { SubmissionData } from "./types";

// Dữ liệu mẫu (Ban đầu để mảng rỗng để hiện "No data" như hình image_a0a601.png)
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
    status: "Wrong Answer",
    language: "python3",
    runtime: "N/A",
    memory: "N/A",
    notes: "Check edge cases",
    timestamp: "Dec 16, 2025",
  },
];

export const SubmissionsTab = () => {
  const [submissions] = useState<SubmissionData[]>(MOCK_SUBMISSIONS);
  const [statusFilter, setStatusFilter] = useState("Status");
  const [langFilter, setLangFilter] = useState("Language");

  // Nếu không có dữ liệu, hiển thị giao diện trống như hình image_a0a601.png
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white">
        <div className="relative w-40 h-40 opacity-20 mb-4">
          {/* Giả lập icon No Data trong hình */}
          <div className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-lg transform rotate-12"></div>
          <div className="absolute inset-0 border-2 border-gray-400 rounded-lg flex items-center justify-center font-bold text-2xl">
            VIEW
          </div>
        </div>
        <p className="text-sm">No data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      <Table
        aria-label="Submissions table"
        removeWrapper
        classNames={{
          th: "bg-white text-gray-400 font-medium text-[13px] border-b border-gray-100 py-3 first:pl-6",
          td: "py-4 first:pl-6 border-b border-gray-50 text-[13px]",
        }}
      >
        <TableHeader>
          <TableColumn>
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors">
                  {statusFilter} <ChevronDown size={14} />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Status Filter"
                onAction={(key) => setStatusFilter(key as string)}
                className="text-gray-600"
              >
                <DropdownItem key="Accepted">Accepted</DropdownItem>
                <DropdownItem key="Wrong Answer">Wrong Answer</DropdownItem>
                <DropdownItem key="Memory Limit Exceeded">
                  Memory Limit Exceeded
                </DropdownItem>
                <DropdownItem key="Time Limit Exceeded">
                  Time Limit Exceeded
                </DropdownItem>
                <DropdownItem key="Runtime Error">Runtime Error</DropdownItem>
                <DropdownItem key="Compile Error">Compile Error</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TableColumn>

          <TableColumn>
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors">
                  {langFilter} <ChevronDown size={14} />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Language Filter"
                onAction={(key) => setLangFilter(key as string)}
              >
                <DropdownItem key="C++">C++</DropdownItem>
                <DropdownItem key="Java">Java</DropdownItem>
                <DropdownItem key="Python3">Python3</DropdownItem>
                <DropdownItem key="JavaScript">JavaScript</DropdownItem>
                <DropdownItem key="TypeScript">TypeScript</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TableColumn>

          <TableColumn>Runtime</TableColumn>
          <TableColumn>Memory</TableColumn>
          <TableColumn>Notes</TableColumn>
          <TableColumn align="end" className="pr-6">
            <Settings
              size={16}
              className="cursor-pointer hover:text-black transition-colors"
            />
          </TableColumn>
        </TableHeader>

        <TableBody>
          {submissions.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50 cursor-pointer group"
            >
              <TableCell>
                <span
                  className={`font-bold ${
                    item.status === "Accepted"
                      ? "text-[#2cbb5d]"
                      : "text-[#ef4743]"
                  }`}
                >
                  {item.status}
                </span>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={10} /> {item.timestamp}
                </div>
              </TableCell>
              <TableCell>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 text-[11px] font-medium">
                  {item.language}
                </span>
              </TableCell>
              <TableCell className="font-medium">{item.runtime}</TableCell>
              <TableCell className="font-medium">{item.memory}</TableCell>
              <TableCell className="text-gray-400 italic">
                {item.notes || "No notes"}
              </TableCell>
              <TableCell className="text-right pr-6">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="invisible group-hover:visible"
                >
                  <Settings size={14} className="text-gray-400" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
