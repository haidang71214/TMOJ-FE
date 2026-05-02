"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Pagination,
} from "@heroui/react";
import { Activity, Award,ChevronDown, Clock, Inbox,  } from "lucide-react";
import { useState, useMemo } from "react";
import { useGetSubmissionListByProblemQuery } from "@/store/queries/Submittion";

interface SubmissionsTabProps {
  problemId: string;
}

interface SubmissionData {
  id: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  notes: string;
  timestamp: string;
}

export const SubmissionsTab = ({ problemId }: SubmissionsTabProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const { data: apiResponse, isLoading } = useGetSubmissionListByProblemQuery(problemId, { skip: !problemId });
  console.log(apiResponse);
  const [statusFilter, setStatusFilter] = useState("Status");
  const [langFilter, setLangFilter] = useState("Language");

  const handleRowClick = (submissionId: string) => {
    console.log("Clicked submission:", submissionId);
  };

  const rawSubmissions = apiResponse?.data || [];
  const totalItems = apiResponse?.pagination?.totalCount || rawSubmissions.length;
  const totalPages = apiResponse?.pagination?.totalPages || Math.ceil(totalItems / rowsPerPage) || 1;

  const allSubmissions: SubmissionData[] = useMemo(() => {
    return rawSubmissions.map((s: any) => ({
      id: s.id,
      status: getStatusLabel(s.verdictCode, s.statusCode),
      language: s.language || "Unknown",
      runtime: s.timeMs != null ? `${s.timeMs} ms` : "N/A",
      memory: s.memoryKb != null ? `${(s.memoryKb / 1024).toFixed(1)} MB` : "N/A",
      notes: s.finalScore != null ? s.finalScore.toString() : "0",
      timestamp: new Date(s.createdAt).toLocaleString(),
    }));
  }, [rawSubmissions]);

  const filteredSubmissions = useMemo(() => {
    let filtered = [...allSubmissions];
    if (statusFilter !== "Status") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }
    if (langFilter !== "Language") {
      filtered = filtered.filter((s) => s.language === langFilter);
    }
    return filtered;
  }, [allSubmissions, statusFilter, langFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredSubmissions.slice(start, end);
  }, [page, filteredSubmissions]);

  function getStatusLabel(verdictCode: string | null, statusCode: string) {
    if (statusCode === "PD") return "Pending";
    if (statusCode === "JD") return "Judging";
    if (statusCode === "CE") return "Compile Error";
    if (statusCode === "QU") return "In Queue";
    
    switch (verdictCode?.toLowerCase()) {
      case "ac": return "Accepted";
      case "wa": return "Wrong Answer";
      case "tle": return "Time Limit Exceeded";
      case "mle": return "Memory Limit Exceeded";
      case "rte": return "Runtime Error";
      case "re": return "Runtime Error";
      default: return verdictCode ? verdictCode.toUpperCase() : statusCode;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="bg-white dark:bg-[#101828] p-4 rounded-xl flex-1 border border-gray-100 dark:border-[#1d2939] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Submissions</span>
          </div>
          <p className="text-2xl font-black dark:text-white tracking-tight">{totalItems}</p>
        </div>
        <div className="bg-white dark:bg-[#101828] p-4 rounded-xl flex-1 border border-gray-100 dark:border-[#1d2939] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Award size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Pass Rate</span>
          </div>
          <p className="text-2xl font-black dark:text-white tracking-tight">
            {totalItems > 0 
              ? `${Math.round((allSubmissions.filter(s => s.status === "Accepted").length / totalItems) * 100)}%` 
              : "0%"}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm dark:bg-[#101828]">
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase italic">Loading Submissions...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-20 text-center">
              <Inbox size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase italic">No submissions found</p>
            </div>
          ) : (
            <Table 
              aria-label="Submissions table"
              shadow="none"
              className="dark:bg-transparent"
              classNames={{
                wrapper: "p-0",
                th: "bg-gray-50 dark:bg-[#1d2939] text-gray-500 dark:text-[#94A3B8] font-black uppercase text-[11px] tracking-widest h-12",
                td: "py-4 border-b border-gray-50 dark:border-[#1d2939] group-hover:bg-gray-50/50 dark:group-hover:bg-white/5",
              }}
            >
              <TableHeader>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>LANGUAGE</TableColumn>
                <TableColumn>RUNTIME</TableColumn>
                <TableColumn>MEMORY</TableColumn>
                <TableColumn>SCORE</TableColumn>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow 
                    key={item.id}
                    className="cursor-pointer group transition-colors"
                    onClick={() => handleRowClick(item.id)}
                  >
                    <TableCell>
                      <span className={`font-black text-[14px] flex items-center gap-2 ${
                          item.status === "Accepted" 
                            ? "text-[#00c853]" 
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
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 mb-6">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                color="primary"
                variant="flat"
                classNames={{
                  cursor: "bg-blue-600 text-white font-bold",
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SubmissionsTab;
