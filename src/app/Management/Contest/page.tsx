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
import { Edit3, FolderCode, Megaphone, Download, Plus } from "lucide-react";
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
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic">
            Contest Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Manage and organize programming competitions.
          </p>
        </div>
        <Button
          startContent={<Plus size={20} />}
          onClick={() => router.push("/Management/Contest/create")}
          className="bg-[#FFB800] text-[#071739] font-black rounded-xl h-12 px-8 uppercase tracking-widest shadow-lg shadow-[#FFB800]/20 active:scale-95 transition-all"
        >
          Create New Contest
        </Button>
      </div>

      <Table
        aria-label="Contest Table"
        classNames={{
          wrapper:
            "dark:bg-[#282E3A] rounded-[2rem] border-none shadow-2xl p-6",
          th: "bg-transparent text-gray-400 font-black uppercase tracking-widest text-[10px] border-b dark:border-[#474F5D] pb-4",
          td: "py-4 font-bold dark:text-white",
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
            <TableRow key={c.id}>
              <TableCell className="text-gray-400 italic">#{c.id}</TableCell>
              <TableCell className="text-lg">{c.title}</TableCell>
              <TableCell>
                <Chip
                  variant="flat"
                  color={c.rule === "ACM" ? "warning" : "secondary"}
                  className="font-black uppercase text-[10px]"
                >
                  {c.rule}
                </Chip>
              </TableCell>
              <TableCell>{c.type}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  className={
                    c.status === "Running"
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }
                >
                  {c.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Switch defaultSelected={c.visible} color="warning" size="sm" />
              </TableCell>
              <TableCell>
                <div className="flex gap-4">
                  <Tooltip content="Edit Info">
                    <button
                      onClick={() =>
                        router.push(`/Management/Contest/${c.id}/edit`)
                      }
                      className="hover:text-[#FFB800] transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Manage Problems">
                    <button
                      onClick={() =>
                        router.push(`/Management/Contest/${c.id}/problems`)
                      }
                      className="hover:text-[#FFB800] transition-colors"
                    >
                      <FolderCode size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Announcements">
                    <button className="hover:text-[#FFB800] transition-colors">
                      <Megaphone size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Export Data">
                    <button className="hover:text-[#FFB800] transition-colors">
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
