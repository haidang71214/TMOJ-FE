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
  Pagination,
  Spinner,
} from "@heroui/react";
import { Activity, Award, Ban, Bell, ChevronDown, Clock, Download, Flag, Inbox, Lock, RefreshCw, Settings, ShieldAlert } from "lucide-react";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetSubmissionListByProblemQuery } from "@/store/queries/Submittion";

interface SubmissionsTabProps {
  problemId: string;
  onRowClick: (item: SubmissionData) => void;
}

const getStatusLabel = (verdict: string | null, status: string | null) => {
  if (verdict === "ac") return "Accepted";
  if (verdict === "wa") return "Wrong Answer";
  if (verdict === "ce") return "Compile Error";
  if (verdict === "tle") return "Time Limit";
  if (verdict === "mle") return "Memory Limit";
  if (verdict === "rte") return "Runtime Error";
  if (!verdict && status) return status.charAt(0).toUpperCase() + status.slice(1);
  return "Pending";
};

export const SubmissionsTab = ({ problemId, onRowClick }: SubmissionsTabProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const { data: apiResponse, isLoading, isError } = useGetSubmissionListByProblemQuery(problemId, { skip: !problemId });
  console.log(apiResponse);
  const [statusFilter, setStatusFilter] = useState("Status");
  const [langFilter, setLangFilter] = useState("Language");

  const rawSubmissions = apiResponse?.data || [];
  const totalItems = rawSubmissions.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  const allSubmissions: SubmissionData[] = useMemo(() => {
    return rawSubmissions.map((s) => ({
      id: s.id,
      status: getStatusLabel(s.verdictCode, s.statusCode) as any,
      language: "Unknown", // Currently API hasn't mapped this
      runtime: s.timeMs != null ? `${s.timeMs} ms` : "N/A",
      memory: s.memoryKb != null ? `${(s.memoryKb / 1024).toFixed(1)} MB` : "N/A",
      notes: s.finalScore != null ? s.finalScore.toString() : "0",
      timestamp: new Date(s.createdAt).toLocaleString(),
    }));
  }, [rawSubmissions]);

  const submissions = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return allSubmissions.slice(start, start + rowsPerPage);
  }, [allSubmissions, page, rowsPerPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Calculate percentage of accepted code
  const acceptedCount = allSubmissions.filter(s => s.status === "Accepted").length;
  const acPercentage = totalItems > 0 ? Math.round((acceptedCount / totalItems) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#121A27] font-sans p-3 gap-3 transition-colors duration-500">
      
      {/* Admin Controls & Stats */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white dark:bg-[#1C2737] p-3 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl">
            <Award size={16} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-wider">Accepted Code</span>
              <span className="text-base font-[1000] leading-none">{acPercentage}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl">
            <Activity size={16} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-wider">Total Submissions</span>
              <span className="text-base font-[1000] leading-none">{totalItems}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="flex-1 bg-white dark:bg-[#1C2737] border-none shadow-sm rounded-2xl overflow-hidden">
        <CardBody className="p-0 flex flex-col h-full">
          {allSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-400 dark:text-[#475569] bg-white dark:bg-[#1C2737] transition-colors duration-500 min-h-[300px]">
              <div className="relative w-32 h-32 opacity-20 mb-6 flex items-center justify-center">
                <Inbox size={80} strokeWidth={1} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">
                No data available
              </p>
            </div>
          ) : (
            <Table
              aria-label="Submissions table"
              removeWrapper
              bottomContent={
                totalPages >= 1 ? (
                  <div className="flex w-full justify-center p-2 border-t border-slate-100 dark:border-white/5">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={totalPages}
                      onChange={setPage}
                      classNames={{ cursor: "bg-[#071739] dark:bg-[#FF5C00]" }}
                    />
                  </div>
                ) : null
              }
              onRowAction={(key) => {
                const item = submissions.find((s) => s.id === key);
                if (item) onRowClick(item);
              }}
              classNames={{
                base: "flex flex-col min-h-0 overflow-hidden",
                table: "min-h-0 overflow-hidden",
                wrapper: "flex-1 w-full flex flex-col overflow-hidden",
                th: "bg-[#F8FAFC] dark:bg-[#162130] text-gray-500 dark:text-[#94A3B8] font-black text-[11px] uppercase tracking-wider border-b border-gray-100 dark:border-[#334155] py-2.5 first:pl-3",
                td: "py-2.5 first:pl-3 border-b border-slate-50 dark:border-[#1C2737] text-[13px] dark:text-[#CDD5DB] transition-colors",
                tr: "hover:bg-slate-50 dark:hover:bg-[#101828] cursor-pointer group outline-none",
              }}
            >
              <TableHeader>
                <TableColumn className="w-[40px] text-center">#</TableColumn>
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
                <TableColumn>Score</TableColumn>
              </TableHeader>

              <TableBody>
                {submissions.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-black text-slate-400 dark:text-[#475569] text-[12px]">
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-black text-[14px] ${
                          item.status === "Accepted"
                            ? "text-[#2cbb5d]"
                            : item.status === "Pending" 
                            ? "text-blue-500" 
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
                    <TableCell className="font-black text-[14px] text-gray-600 dark:text-gray-300">
                      {item.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
