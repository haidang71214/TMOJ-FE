"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Chip,
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Database,
} from "lucide-react";

// Type khớp DB
interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  points: number;
  problem_type: "coding" | "theory" | "quiz" | "reading";
  time_limit_ms: number;
  memory_limit_kb: number;
  is_public: boolean;
  submissions_count?: number;     // từ submissions
  accepted_rate?: number;          // tính từ submissions (mock)
  created_at: string;
  created_by_username?: string;
}

const MOCK_PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "easy",
    points: 100,
    problem_type: "coding",
    time_limit_ms: 1000,
    memory_limit_kb: 128000,
    is_public: true,
    submissions_count: 1247,
    accepted_rate: 68.4,
    created_at: "2025-11-15",
    created_by_username: "admin",
  },
  {
    id: "p2",
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "medium",
    points: 200,
    problem_type: "coding",
    time_limit_ms: 2000,
    memory_limit_kb: 256000,
    is_public: true,
    submissions_count: 856,
    accepted_rate: 42.1,
    created_at: "2025-12-05",
    created_by_username: "teacher1",
  },
  {
    id: "p3",
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "hard",
    points: 300,
    problem_type: "coding",
    time_limit_ms: 3000,
    memory_limit_kb: 512000,
    is_public: false,
    submissions_count: 312,
    accepted_rate: 28.7,
    created_at: "2026-01-10",
    created_by_username: "admin",
  },
  {
    id: "p4",
    title: "Computer Networks Quiz #3",
    slug: "cn-quiz-3",
    difficulty: "medium",
    points: 50,
    problem_type: "quiz",
    time_limit_ms: 0,
    memory_limit_kb: 0,
    is_public: true,
    submissions_count: 189,
    accepted_rate: 75.2,
    created_at: "2026-01-20",
    created_by_username: "lecturer2",
  },
];

export default function ProblemManagementPage() {
  const [problems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Problem | null>(null);

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase">
            Problem <span className="text-[#FF5C00]">Management</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Create, edit and monitor programming & theory problems
          </p>
        </div>

        <Button
          className="bg-[#0B1C3D] text-white font-black"
          startContent={<Plus size={16} />}
          onPress={() => setIsCreateOpen(true)}
        >
          Create New Problem
        </Button>
      </div>

      {/* FILTER & STATS */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-3">
          <Input placeholder="Search title or slug..." className="max-w-xs" />
          <Select placeholder="Difficulty" className="w-36">
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="easy">Easy</SelectItem>
            <SelectItem key="medium">Medium</SelectItem>
            <SelectItem key="hard">Hard</SelectItem>
            <SelectItem key="expert">Expert</SelectItem>
          </Select>
          <Button variant="bordered">Filter</Button>
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <div>Total: <span className="text-[#FF5C00] font-black">1,248</span></div>
          <div>Public: <span className="text-emerald-500 font-black">892</span></div>
          <div>Accepted Rate Avg: <span className="text-blue-500 font-black">54.3%</span></div>
        </div>
      </div>

      {/* PROBLEMS TABLE */}
      <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden">
        <Table aria-label="Problems" removeWrapper>
          <TableHeader>
            <TableColumn>TITLE / SLUG</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>DIFFICULTY</TableColumn>
            <TableColumn>POINTS</TableColumn>
            <TableColumn>TIME / MEM</TableColumn>
            <TableColumn>SUBMISSIONS</TableColumn>
            <TableColumn>ACCEPT %</TableColumn>
            <TableColumn>PUBLIC</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {problems.map((prob) => (
              <TableRow key={prob.id}>
                <TableCell>
                  <div className="font-bold">{prob.title}</div>
                  <div className="text-xs text-slate-500">{prob.slug}</div>
                </TableCell>
                <TableCell>
                  <Chip variant="flat" color="secondary" size="sm">
                    {prob.problem_type.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={
                      prob.difficulty === "easy" ? "success" :
                      prob.difficulty === "medium" ? "warning" :
                      prob.difficulty === "hard" ? "danger" : "default"
                    }
                  >
                    {prob.difficulty.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>{prob.points}</TableCell>
                <TableCell>
                  {prob.problem_type === "coding" ? (
                    <div className="text-xs">
                      <Clock size={14} className="inline mr-1" />
                      {(prob.time_limit_ms / 1000).toFixed(1)}s
                      <br />
                      <Database size={14} className="inline mr-1" />
                      {(prob.memory_limit_kb / 1024).toFixed(0)}MB
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell>{prob.submissions_count?.toLocaleString() || "0"}</TableCell>
                <TableCell>
                  <span className={prob.accepted_rate && prob.accepted_rate > 60 ? "text-emerald-500" : "text-amber-500"}>
                    {prob.accepted_rate?.toFixed(1) || "—"}%
                  </span>
                </TableCell>
                <TableCell>
                  <Switch isSelected={prob.is_public} size="sm" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button isIconOnly size="sm" onPress={() => setEditing(prob)}>
                      <Pencil size={16} />
                    </Button>
                    <Button isIconOnly size="sm">
                      <Eye size={16} />
                    </Button>
                    <Button isIconOnly size="sm" color="danger">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL CREATE / EDIT (giả định) */}
      <Modal
        isOpen={isCreateOpen || !!editing}
        onOpenChange={() => {
          setIsCreateOpen(false);
          setEditing(null);
        }}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-black uppercase">
                {editing ? "Edit Problem" : "Create New"} <span className="text-[#FF5C00]">Problem</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Input label="Title" defaultValue={editing?.title} />
                <Input label="Slug" defaultValue={editing?.slug} placeholder="kebab-case-unique" />
                <Select label="Problem Type" defaultSelectedKeys={[editing?.problem_type || "coding"]}>
                  <SelectItem key="coding">Coding</SelectItem>
                  <SelectItem key="theory">Theory</SelectItem>
                  <SelectItem key="quiz">Quiz</SelectItem>
                  <SelectItem key="reading">Reading</SelectItem>
                </Select>
                <Select label="Difficulty" defaultSelectedKeys={[editing?.difficulty || "easy"]}>
                  <SelectItem key="easy">Easy</SelectItem>
                  <SelectItem key="medium">Medium</SelectItem>
                  <SelectItem key="hard">Hard</SelectItem>
                  <SelectItem key="expert">Expert</SelectItem>
                </Select>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Points" type="number" defaultValue={editing?.points?.toString() || "100"} />
                  <Input label="Time Limit (ms)" type="number" defaultValue={editing?.time_limit_ms?.toString() || "2000"} />
                  <Input label="Memory Limit (KB)" type="number" defaultValue={editing?.memory_limit_kb?.toString() || "256000"} />
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black uppercase text-sm tracking-widest">Publicly Visible</span>
                  <Switch defaultSelected={editing?.is_public ?? true} />
                </div>
                <Textarea
                  label="Problem Description (Markdown supported)"
                  minRows={6}
                  defaultValue={editing ? "..." : ""}
                  placeholder="Write problem statement, input/output format, constraints, examples..."
                />
              </ModalBody>
              <ModalFooter className="flex justify-between">
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button
                  className="bg-[#FF5C00] text-white font-black"
                  onPress={onClose}
                >
                  {editing ? "Save Changes" : "Create Problem"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}