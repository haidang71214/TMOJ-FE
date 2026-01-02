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
  Tooltip,
  Switch,
  Chip,
} from "@heroui/react";
import {
  Edit3,
  FolderCode,
  Megaphone,
  Download,
  Plus,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContestListPage() {
  const router = useRouter();

  const contests = [
    {
      id: 1024,
      title: "TMOJ Spring Contest 2025",
      rule: "ACM",
      type: "Public",
      status: "Running",
      visible: true,
    },
    {
      id: 1025,
      title: "Beginner Free Contest #01",
      rule: "OI",
      type: "Password",
      status: "Ended",
      visible: false,
    },
  ];

  return (
    <div className="p-10 space-y-8 min-h-screen bg-[#CDD5DB] dark:bg-[#101828] transition-colors duration-500">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-[#1C2737] rounded-2xl text-[#071739] dark:text-[#FFB800] shadow-sm">
            <Trophy size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic leading-none">
              Contest Management<span className="text-[#FFB800]">.</span>
            </h2>
            <p className="text-gray-600 dark:text-[#98A2B3] font-medium mt-2">
              Manage and organize programming competitions.
            </p>
          </div>
        </div>
        <Button
          startContent={<Plus size={20} />}
          onClick={() => router.push("/Management/Contest/create")}
          className="bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#101828] font-black rounded-xl h-12 px-8 uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          Create New Contest
        </Button>
      </div>

      <Table
        aria-label="Contest Table"
        classNames={{
          wrapper:
            "bg-white dark:bg-[#1C2737] rounded-[2rem] border-none shadow-2xl p-6 transition-colors duration-500",
          th: "bg-transparent text-[#4B6382] dark:text-[#667085] font-black uppercase tracking-widest text-[10px] border-b border-gray-100 dark:border-[#344054] pb-4",
          td: "py-5 font-bold text-[#071739] dark:text-[#F9FAFB] border-b border-gray-50 dark:border-[#344054]/50 last:border-none",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>RULE TYPE</TableColumn>
          <TableColumn>CONTEST TYPE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>VISIBLE</TableColumn>
          <TableColumn>OPERATION</TableColumn>
        </TableHeader>
        <TableBody>
          {contests.map((c) => (
            <TableRow
              key={c.id}
              className="hover:bg-gray-50 dark:hover:bg-[#101828]/50 transition-colors"
            >
              <TableCell className="text-gray-400 dark:text-[#667085] italic font-medium">
                #{c.id}
              </TableCell>
              <TableCell className="text-lg tracking-tight font-black">
                {c.title}
              </TableCell>
              <TableCell>
                <Chip
                  variant="flat"
                  color={c.rule === "ACM" ? "warning" : "secondary"}
                  className="font-black uppercase text-[10px] rounded-lg"
                >
                  {c.rule}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm font-bold opacity-80 dark:text-[#98A2B3]">
                  {c.type}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="dot"
                  color={c.status === "Running" ? "success" : "default"}
                  className="font-black uppercase text-[10px] border-none dark:text-white"
                >
                  {c.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Switch defaultSelected={c.visible} color="warning" size="sm" />
              </TableCell>
              <TableCell>
                <div className="flex gap-4 text-[#4B6382] dark:text-[#98A2B3]">
                  <Tooltip content="Edit Info" closeDelay={0}>
                    <button
                      onClick={() =>
                        router.push(`/Management/Contest/${c.id}/edit`)
                      }
                      className="hover:text-[#071739] dark:hover:text-[#FFB800] transition-all transform hover:scale-110"
                    >
                      <Edit3 size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Manage Problems" closeDelay={0}>
                    <button
                      onClick={() =>
                        router.push(`/Management/Contest/${c.id}/problems`)
                      }
                      className="hover:text-[#071739] dark:hover:text-[#FFB800] transition-all transform hover:scale-110"
                    >
                      <FolderCode size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Announcements" closeDelay={0}>
                    <button className="hover:text-[#071739] dark:hover:text-[#FFB800] transition-all transform hover:scale-110">
                      <Megaphone size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Export Data" closeDelay={0}>
                    <button className="hover:text-[#071739] dark:hover:text-[#FFB800] transition-all transform hover:scale-110">
                      <Download size={18} />
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
