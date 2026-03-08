"use client";

import {
  Button,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Download, Users, TrendingUp, Search } from "lucide-react";

// Mock Data
const CLASS_STATS = [
  { id: "c1", name: "SDN302", studentCount: 35, submissionRate: "92%", avgScore: 8.5 },
  { id: "c2", name: "PRF192", studentCount: 28, submissionRate: "75%", avgScore: 7.2 },
  { id: "c3", name: "CSD201", studentCount: 42, submissionRate: "88%", avgScore: 7.9 },
  { id: "c4", name: "DBI202", studentCount: 30, submissionRate: "95%", avgScore: 9.1 },
  { id: "c5", name: "CSD202", studentCount: 18, submissionRate: "65%", avgScore: 6.8 },
  { id: "c6", name: "PRO192", studentCount: 50, submissionRate: "82%", avgScore: 7.4 },
  { id: "c7", name: "SWE201", studentCount: 24, submissionRate: "90%", avgScore: 8.3 },
  { id: "c8", name: "MAS291", studentCount: 36, submissionRate: "70%", avgScore: 6.5 },
];

export function ClassReport() {
  const handleExport = () => {
    // Mock export action
    alert("Downloading Class Mark Report (CSV)...");
  };

  return (
    <Card className="rounded-2xl p-6 bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10 shadow-sm col-span-1 xl:col-span-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-black uppercase tracking-widest text-xs text-indigo-500">
            Class Performance
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View submission rates and export mark reports
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Input 
            placeholder="Search class..." 
            size="sm"
            startContent={<Search size={14} />}
            classNames={{ inputWrapper: "w-40 bg-slate-50 dark:bg-black/20" }} 
          />
          <Select 
            placeholder="Sort by" 
            size="sm"
            classNames={{ trigger: "w-32 bg-slate-50 dark:bg-black/20" }}
          >
            <SelectItem key="rate">Submission Rate</SelectItem>
            <SelectItem key="score">Avg Score</SelectItem>
          </Select>
          <Button
            size="sm"
            className="bg-[#0B1C3D] text-white font-bold"
            startContent={<Download size={14} />}
            onPress={handleExport}
          >
            Export Report
          </Button>
        </div>
      </div>

      <Table aria-label="Class Report Table" removeWrapper>
        <TableHeader>
          <TableColumn>CLASS NAME</TableColumn>
          <TableColumn>STUDENTS</TableColumn>
          <TableColumn>SUBMISSION RATE</TableColumn>
          <TableColumn>AVG SCORE</TableColumn>
        </TableHeader>
        <TableBody>
          {CLASS_STATS.map((cls) => (
            <TableRow key={cls.id}>
              <TableCell className="font-bold text-slate-800 dark:text-white">
                {cls.name}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-slate-500">
                  <Users size={14} /> {cls.studentCount}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-between items-center w-full max-w-[150px]">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {cls.submissionRate}
                  </span>
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: cls.submissionRate }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{cls.avgScore.toFixed(1)}</span>
                  <TrendingUp size={14} className="text-blue-500" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
