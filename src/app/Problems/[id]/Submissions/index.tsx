"use client";
import { SubmissionData } from "@/types";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Activity, Award, Ban, Bell, ChevronDown, Clock, Download, Flag, Inbox, Lock, RefreshCw, Settings, ShieldAlert } from "lucide-react";
import { useState } from "react";

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

  // Calculate percentage of accepted code
  const acceptedCount = submissions.filter(s => s.status === "Accepted").length;
  const acPercentage = submissions.length > 0 ? Math.round((acceptedCount / submissions.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#121A27] font-sans p-4 gap-4 transition-colors duration-500">
      
      {/* Admin Controls & Stats */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-[#1C2737] p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl">
            <Award size={18} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-wider">Accepted Code</span>
              <span className="text-lg font-[1000] leading-none">{acPercentage}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl">
            <Activity size={18} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-wider">Total Submissions</span>
              <span className="text-lg font-[1000] leading-none">{submissions.length}</span>
            </div>
          </div>
        </div>

        {/* Mock Admin Controls Workspace */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Times of Sub." 
              size="sm"
              classNames={{ inputWrapper: "w-32 bg-slate-100 dark:bg-[#0A0F1C]" }} 
            />
          </div>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Submission Limit" 
              size="sm"
              classNames={{ inputWrapper: "w-36 bg-slate-100 dark:bg-[#0A0F1C]" }} 
            />
          </div>
          <Button size="sm" color="primary" className="font-bold font-italic rounded-lg uppercase text-[10px]">
            Apply Limits
          </Button>
        </div>
      </div>

      <Card className="flex-1 bg-white dark:bg-[#1C2737] border-none shadow-sm rounded-2xl overflow-hidden">
        <CardBody className="p-0">
          <Table
        aria-label="Submissions table"
        removeWrapper
        // Sử dụng onRowAction để bắt sự kiện click chuẩn của HeroUI
        onRowAction={(key) => {
          const item = submissions.find((s) => s.id === key);
          if (item) onRowClick(item);
        }}
        classNames={{
          th: "bg-[#F8FAFC] dark:bg-[#162130] text-gray-500 dark:text-[#94A3B8] font-black text-[11px] uppercase tracking-wider border-b border-gray-100 dark:border-[#334155] py-4 first:pl-6",
          td: "py-4 first:pl-6 border-b border-slate-50 dark:border-[#1C2737] text-[13px] dark:text-[#CDD5DB] transition-colors",
          tr: "hover:bg-slate-50 dark:hover:bg-[#101828] cursor-pointer group outline-none h-[72px]",
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
                <Dropdown placement="bottom-end" className="dark:bg-[#101828] dark:border-[#334155]">
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-slate-400 hover:text-black dark:text-[#667085] hover:dark:text-white"
                    >
                      <Settings size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Submission Actions" className="dark:text-[#F9FAFB] min-w-[200px]">
                    <DropdownItem key="rejudge" startContent={<RefreshCw size={14} className="text-blue-500" />}>
                      Rejudge Submission
                    </DropdownItem>
                    <DropdownItem key="remove" className="text-danger" color="danger" startContent={<Ban size={14} />}>
                      Remove Submission
                    </DropdownItem>
                    <DropdownItem key="lock" startContent={<Lock size={14} className="text-amber-500" />}>
                      Lock Submission Result
                    </DropdownItem>
                    <DropdownItem key="flag" startContent={<Flag size={14} className="text-rose-500" />}>
                      Flag Submission
                    </DropdownItem>
                    <DropdownItem key="download" startContent={<Download size={14} className="text-emerald-500" />}>
                      Download Submission
                    </DropdownItem>
                    <DropdownItem key="result" startContent={<ShieldAlert size={14} className="text-purple-500" />}>
                      Receive Code Result
                    </DropdownItem>
                    <DropdownItem key="notification" startContent={<Bell size={14} className="text-orange-500" />}>
                      Receive Judge Notification
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </CardBody>
      </Card>
    </div>
  );
};
