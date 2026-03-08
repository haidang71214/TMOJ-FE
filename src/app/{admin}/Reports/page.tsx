"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Progress,
} from "@heroui/react";
import { Download, FileText, Activity, Settings, Filter } from "lucide-react";

const MOCK_SUBJECT_REPORT = [
  { id: 1, code: "PRJ301", name: "Java Web Development", students: 450, passRate: 85, avgScore: 7.2 },
  { id: 2, code: "SWT301", name: "Software Testing", students: 320, passRate: 92, avgScore: 8.1 },
  { id: 3, code: "CSD201", name: "Data Structures and Algorithms", students: 512, passRate: 68, avgScore: 6.5 },
  { id: 4, code: "DBI202", name: "Database Systems", students: 480, passRate: 88, avgScore: 7.8 },
  { id: 5, code: "MAS291", name: "Mathematics for Computer Science", students: 390, passRate: 75, avgScore: 6.9 },
  { id: 6, code: "IOT102", name: "Internet of Things", students: 210, passRate: 95, avgScore: 8.5 },
  { id: 7, code: "OSG202", name: "Operating Systems", students: 340, passRate: 72, avgScore: 6.8 },
  { id: 8, code: "NWC203", name: "Computer Networking", students: 420, passRate: 79, avgScore: 7.1 },
  { id: 9, code: "WED201", name: "Web Design", students: 560, passRate: 90, avgScore: 8.3 },
  { id: 10, code: "PRO192", name: "Object-Oriented Programming (Java)", students: 600, passRate: 82, avgScore: 7.4 },
];

export default function ReportsPage() {
  const [reportFormat, setReportFormat] = useState("pdf");

  const handleExport = () => {
    alert(`Exporting System Report as ${reportFormat.toUpperCase()}...`);
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#071739] dark:text-white">
            System <span className="text-[#FF5C00]">Reports</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 mt-1">
            Analytics and data exports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select 
            size="sm" 
            className="w-32" 
            classNames={{ trigger: "bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10" }}
            defaultSelectedKeys={["pdf"]}
            onChange={(e) => setReportFormat(e.target.value)}
          >
            <SelectItem key="pdf">PDF Format</SelectItem>
            <SelectItem key="csv">CSV Format</SelectItem>
            <SelectItem key="excel">Excel Format</SelectItem>
          </Select>
          <Button
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black shadow-lg"
            startContent={<Download size={16} />}
            onPress={handleExport}
          >
            Export Global Report
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-3xl shadow-sm">
        <Tabs 
          aria-label="Report Options" 
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider px-8 pt-6",
            cursor: "w-full bg-[#FF5C00]",
            tab: "max-w-fit px-0 h-12 uppercase italic font-black text-[11px] tracking-widest",
            tabContent: "group-data-[selected=true]:text-[#FF5C00]"
          }}
        >
          {/* SUBJECT REPORT TAB */}
          <Tab 
            key="subject" 
            title={
              <div className="flex items-center gap-2">
                <FileText size={16}/>
                <span>Subject Report</span>
              </div>
            }
          >
            <CardBody className="p-8 space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase text-[#071739] dark:text-white">Subject Performance</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Spring 2026 Semester</p>
                </div>
                <div className="flex gap-3">
                  <Input 
                    size="sm" 
                    placeholder="Search Subject..." 
                    startContent={<Filter size={14} className="text-slate-400" />}
                    className="w-64"
                  />
                  <Button size="sm" variant="flat" className="font-bold">
                    Filter Semester
                  </Button>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                <Table aria-label="Subject Report Table" removeWrapper className="w-full">
                  <TableHeader>
                    <TableColumn className="bg-slate-50 dark:bg-white/5 font-black uppercase text-[10px] tracking-wider py-4">Subject Code</TableColumn>
                    <TableColumn className="bg-slate-50 dark:bg-white/5 font-black uppercase text-[10px] tracking-wider py-4">Subject Name</TableColumn>
                    <TableColumn className="bg-slate-50 dark:bg-white/5 font-black uppercase text-[10px] tracking-wider py-4">Total Students</TableColumn>
                    <TableColumn className="bg-slate-50 dark:bg-white/5 font-black uppercase text-[10px] tracking-wider py-4">Pass Rate</TableColumn>
                    <TableColumn className="bg-slate-50 dark:bg-white/5 font-black uppercase text-[10px] tracking-wider py-4">Avg Score</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {MOCK_SUBJECT_REPORT.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-100 dark:border-white/5 last:border-none">
                        <TableCell className="font-bold">{row.code}</TableCell>
                        <TableCell className="font-medium text-slate-600 dark:text-slate-300">{row.name}</TableCell>
                        <TableCell>{row.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-32">
                            <span className="text-sm font-bold w-10">{row.passRate}%</span>
                            <Progress 
                              value={row.passRate} 
                              size="sm" 
                              color={row.passRate > 80 ? "success" : row.passRate < 70 ? "danger" : "warning"} 
                              className="flex-1"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-[#FF5C00]">{row.avgScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardBody>
          </Tab>

          {/* SYSTEM REPORT TAB */}
          <Tab 
            key="system" 
            title={
              <div className="flex items-center gap-2">
                <Activity size={16}/>
                <span>System Report</span>
              </div>
            }
          >
            <CardBody className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Health Metrics */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-[#071739] dark:text-white">System Health</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Real-time infrastructure status</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Judge Engine Uptime</p>
                      <p className="text-2xl font-black text-emerald-500">99.98%</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Activity size={24} />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Avg Grading Delay</p>
                      <p className="text-2xl font-black text-blue-500">1.2s</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Settings size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Activity Metrics */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-[#071739] dark:text-white">Usage Analytics</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Platform engagement</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Daily Submissions</p>
                    <p className="text-xl font-black text-[#071739] dark:text-white mt-1">12,450</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active Contests</p>
                    <p className="text-xl font-black text-[#071739] dark:text-white mt-1">14</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Peak Concurrent Users</p>
                    <p className="text-xl font-black text-[#071739] dark:text-white mt-1">3,205</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Storage Used</p>
                    <p className="text-xl font-black text-[#071739] dark:text-white mt-1">452 GB</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Tab>

          {/* EXPORT CONFIGURATION TAB */}
          <Tab 
            key="config" 
            title={
              <div className="flex items-center gap-2">
                <Settings size={16}/>
                <span>Parameters</span>
              </div>
            }
          >
             <CardBody className="p-8">
               <div className="max-w-md space-y-6">
                 <div>
                    <h3 className="text-lg font-black uppercase text-[#071739] dark:text-white">Configure Report Data</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Set parameters before exporting global reports</p>
                 </div>
                 
                 <div className="space-y-4">
                   <Input 
                     label="Start Date" 
                     type="date" 
                     labelPlacement="outside"
                     placeholder="Select start date"
                   />
                   <Input 
                     label="End Date" 
                     type="date" 
                     labelPlacement="outside"
                     placeholder="Select end date"
                   />
                   <Select 
                     label="Include Modules" 
                     labelPlacement="outside"
                     placeholder="Select modules to include"
                     selectionMode="multiple"
                     defaultSelectedKeys={["subjects", "users", "submissions"]}
                   >
                     <SelectItem key="subjects">Subjects Performance</SelectItem>
                     <SelectItem key="users">User Growth</SelectItem>
                     <SelectItem key="submissions">Submissions</SelectItem>
                     <SelectItem key="payments">Payments</SelectItem>
                   </Select>
                 </div>
               </div>
             </CardBody>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
}
