"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Switch,
  Tooltip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Search,
  Filter,
  Download,
  Database,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalProblemListPage() {
  const router = useRouter();

  const allProblems = [
    {
      id: 1,
      title: "A + B Problem",
      difficulty: "Easy",
      submissions: 1250,
      acRate: "85%",
      visible: true,
      contest: "None",
    },
    {
      id: 501,
      title: "Two Sum",
      difficulty: "Medium",
      submissions: 850,
      acRate: "45%",
      visible: true,
      contest: "Spring 2025",
    },
    {
      id: 102,
      title: "Quick Sort Implementation",
      difficulty: "Hard",
      submissions: 320,
      acRate: "12%",
      visible: false,
      contest: "None",
    },
    {
      id: 502,
      title: "Longest Substring",
      difficulty: "Medium",
      submissions: 600,
      acRate: "38%",
      visible: true,
      contest: "Spring 2025",
    },
    {
      id: 105,
      title: "Binary Tree Level Order",
      difficulty: "Medium",
      submissions: 450,
      acRate: "50%",
      visible: true,
      contest: "None",
    },
  ];

  return (
    <div className="p-10 space-y-8 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FFB800]/10 rounded-2xl">
            <Database size={32} className="text-[#FFB800]" />
          </div>
          <div>
            <h3 className="text-3xl font-black dark:text-white uppercase italic leading-none">
              Problem List Repository<span className="text-[#FFB800]">.</span>
            </h3>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-3">
              Total Problems: {allProblems.length}
            </p>
          </div>
        </div>
        <Button
          startContent={<Plus size={18} />}
          onClick={() => router.push("/Management/Problem/create")}
          className="bg-[#FFB800] text-[#071739] font-black rounded-xl uppercase px-6 h-12 shadow-lg shadow-[#FFB800]/20 active:scale-95 transition-all"
        >
          Create New Problem
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white dark:bg-[#282E3A]/50 p-4 rounded-[2rem] border border-gray-100 dark:border-[#474F5D]/30 shadow-sm">
        <Input
          placeholder="Search by title or ID..."
          startContent={<Search size={18} className="text-gray-400" />}
          variant="flat"
          classNames={{
            inputWrapper: "rounded-2xl dark:bg-[#282E3A] border-none h-12",
          }}
          className="md:col-span-2"
        />
        <Select
          placeholder="Difficulty"
          variant="flat"
          classNames={{
            trigger: "rounded-2xl dark:bg-[#282E3A] border-none h-12",
          }}
        >
          <SelectItem key="easy" className="dark:text-white">
            Easy
          </SelectItem>
          <SelectItem key="medium" className="dark:text-white">
            Medium
          </SelectItem>
          <SelectItem key="hard" className="dark:text-white">
            Hard
          </SelectItem>
        </Select>
        <Button
          variant="bordered"
          startContent={<Filter size={18} />}
          className="h-12 rounded-2xl font-bold dark:border-[#474F5D] dark:text-white"
        >
          More Filters
        </Button>
      </div>

      {/* Table Section */}
      <Table
        aria-label="Global Problem Table"
        classNames={{
          wrapper:
            "dark:bg-[#282E3A] rounded-[2.5rem] border-none shadow-2xl p-6",
          th: "dark:text-gray-400 font-black uppercase tracking-widest text-[10px] pb-4 border-b dark:border-[#474F5D]/30",
          td: "dark:text-white font-bold py-5 border-b dark:border-[#474F5D]/10 last:border-none",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>DIFFICULTY</TableColumn>
          <TableColumn>CONTEST SOURCE</TableColumn>
          <TableColumn>ACC. RATE</TableColumn>
          <TableColumn>VISIBLE</TableColumn>
          <TableColumn>OPERATION</TableColumn>
        </TableHeader>
        <TableBody>
          {allProblems.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="dark:text-gray-400 italic">
                #{p.id}
              </TableCell>
              <TableCell className="text-lg tracking-tight">
                {p.title}
              </TableCell>
              <TableCell>
                <span
                  className={`text-[10px] px-3 py-1 rounded-full uppercase font-black ${
                    p.difficulty === "Easy"
                      ? "bg-green-500/10 text-green-500"
                      : p.difficulty === "Medium"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {p.difficulty}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`text-[11px] font-bold ${
                    p.contest === "None"
                      ? "text-gray-500 italic"
                      : "text-[#FFB800] underline decoration-dotted"
                  }`}
                >
                  {p.contest}
                </span>
              </TableCell>
              <TableCell className="text-xs">
                <span className="text-green-500 font-black">{p.acRate}</span>
                <p className="text-[9px] text-gray-500 uppercase">
                  {p.submissions} Subs
                </p>
              </TableCell>
              <TableCell>
                <Switch size="sm" color="warning" defaultSelected={p.visible} />
              </TableCell>
              <TableCell>
                <div className="flex gap-4 text-gray-400">
                  <Tooltip content="Edit" closeDelay={0}>
                    <button
                      onClick={() =>
                        router.push(`/Management/Problem/${p.id}/edit`)
                      }
                      className="hover:text-[#FFB800] transition-all transform hover:scale-110"
                    >
                      <Edit size={18} />
                    </button>
                  </Tooltip>

                  {/* NÚT COPY ĐÃ BỔ SUNG */}
                  <Tooltip content="Clone Problem" closeDelay={0}>
                    <button className="hover:text-[#FFB800] transition-all transform hover:scale-110">
                      <Copy size={18} />
                    </button>
                  </Tooltip>

                  <Tooltip content="Download Data" closeDelay={0}>
                    <button className="hover:text-[#FFB800] transition-all transform hover:scale-110">
                      <Download size={18} />
                    </button>
                  </Tooltip>

                  <Tooltip content="Delete" closeDelay={0}>
                    <button className="hover:text-red-500 transition-all transform hover:scale-110">
                      <Trash2 size={18} />
                    </button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
