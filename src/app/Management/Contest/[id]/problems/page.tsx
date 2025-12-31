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
} from "@heroui/react";
import { Plus, Edit, Copy, Trash2, ArrowLeft, Download } from "lucide-react"; // Đã thêm lại Download
import { useRouter, useParams } from "next/navigation";

export default function ContestProblemsPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params.id;

  const problems = [
    {
      id: 501,
      displayId: "A",
      title: "Two Sum",
      author: "Admin",
      visible: true,
    },
    {
      id: 502,
      displayId: "B",
      title: "Longest Substring",
      author: "Admin",
      visible: true,
    },
    {
      id: 503,
      displayId: "C",
      title: "Median of Two Arrays",
      author: "Staff_01",
      visible: false,
    },
    {
      id: 504,
      displayId: "D",
      title: "Regular Expression Matching",
      author: "Admin",
      visible: true,
    },
  ];

  const goToEdit = (problemId: string | number) => {
    router.push(`/Management/Contest/${contestId}/problems/${problemId}/edit`);
  };

  const goToCreate = () => {
    router.push(`/Management/Contest/${contestId}/problems/create`);
  };

  return (
    <div className="p-10 space-y-8 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onClick={() => router.push(`/Management/Contest`)}
            className="rounded-full hover:bg-gray-200 dark:hover:bg-[#333A45]"
          >
            <ArrowLeft size={24} className="dark:text-white" />
          </Button>
          <div>
            <h3 className="text-3xl font-black dark:text-white uppercase italic leading-none">
              Contest Problems
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-2 ml-1">
              Problem Management List
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            startContent={<Plus size={18} />}
            onClick={goToCreate}
            className="bg-[#FFB800] text-[#071739] font-black rounded-xl uppercase px-6 h-12 shadow-lg shadow-[#FFB800]/20"
          >
            Create Problem
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <Table
        aria-label="Contest Problem List"
        classNames={{
          wrapper:
            "dark:bg-[#282E3A] rounded-[2.5rem] border-none shadow-2xl p-6",
          th: "dark:text-gray-400 font-black uppercase tracking-widest text-[10px] pb-4 border-b dark:border-[#474F5D]/30",
          td: "dark:text-white font-bold py-5 border-b dark:border-[#474F5D]/10 last:border-none",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>DISPLAY ID</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>VISIBLE</TableColumn>
          <TableColumn>OPERATION</TableColumn>
        </TableHeader>
        <TableBody>
          {problems.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="dark:text-gray-400 italic">
                #{p.id}
              </TableCell>
              <TableCell className="dark:text-[#FFB800] font-black text-lg">
                {p.displayId}
              </TableCell>
              <TableCell className="text-lg tracking-tight">
                {p.title}
              </TableCell>
              <TableCell>
                <Switch size="sm" color="warning" defaultSelected={p.visible} />
              </TableCell>
              <TableCell>
                <div className="flex gap-4 text-gray-400">
                  <Tooltip content="Edit Detail" closeDelay={0}>
                    <button
                      onClick={() => goToEdit(p.id)}
                      className="hover:text-[#FFB800] transition-all transform hover:scale-110"
                    >
                      <Edit size={18} />
                    </button>
                  </Tooltip>

                  <Tooltip content="Copy Problem" closeDelay={0}>
                    <button className="hover:text-[#FFB800] transition-all transform hover:scale-110">
                      <Copy size={18} />
                    </button>
                  </Tooltip>

                  {/* NÚT DOWNLOAD MỚI BỔ SUNG */}
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
