"use client";
import React, { useState, use, useMemo, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Button,
  Avatar,
  Input,
  Select,
  SelectItem,
  Chip,
  useDisclosure,
  Pagination,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  Search,
  Plus,
  ChevronLeft,
  CheckCircle2,
  Filter,
  UserPlus,
  Clock,
  Pencil,
  ChevronDown,
  Download,
  Eye,
  Bell,
  Trash2,
  Rocket,
  Trophy,
  Code2,
  Send,
  Activity,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Thêm sonner

// --- INTERFACES ---
import { Student } from "../../../../types/index";

interface ProblemItem {
  id: string;
  title: string;
  difficulty: string;
}
interface ContestItem {
  id: string;
  title: string;
  type: string;
}
interface SlotGrade {
  slotId: string;
  slotName: string;
  score: number;
  status: "Passed" | "Failed" | "Pending";
}

import { AddProblemModal } from "../../../components/AddProblemModal";
import { AddContestModal } from "../../../components/AddContestModal";
import DeleteStudentModal from "../../../components/DeleteModal";
import StudentProfileModal from "../../../components/ProfileModal";
import NotifyStudentModal from "../../../components/NotifyModal";

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const deleteModal = useDisclosure();
  const profileModal = useDisclosure();
  const notifyModal = useDisclosure();
  const createSlotModal = useDisclosure();
  const addProblemModal = useDisclosure();
  const addContestModal = useDisclosure();

  const [slotTitle, setSlotTitle] = useState("");
  const [slotStartDate, setSlotStartDate] = useState("");
  const [slotDescription, setSlotDescription] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [slotPage, setSlotPage] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [draftProblems, setDraftProblems] = useState<ProblemItem[]>([]);
  const [draftContests, setContests] = useState<ContestItem[]>([]);

  const rowsPerPage = 10;

  // Validation Logic: Nút Launch chỉ sáng khi nhập đủ thông tin
  const isFormValid = useMemo(() => {
    return (
      slotTitle.trim() !== "" &&
      slotStartDate !== "" &&
      (draftProblems.length > 0 || draftContests.length > 0)
    );
  }, [slotTitle, slotStartDate, draftProblems, draftContests]);

  const handleConfirmProblems = (selected: ProblemItem[]) => {
    setDraftProblems(selected);
  };

  const handleConfirmContests = (selected: ContestItem[]) => {
    setContests(selected);
  };

  const handleLaunchSlot = (onClose: () => void) => {
    toast.success("Launch Success!", {
      description: `Slot "${slotTitle}" is now live.`,
      icon: <Rocket size={16} />,
    });
    // Reset Form
    setSlotTitle("");
    setSlotStartDate("");
    setSlotDescription("");
    setDraftProblems([]);
    setContests([]);
    onClose();
  };
  // --- MOCK DATA ---
  const students: (Student & { grades: SlotGrade[] })[] = useMemo(
    () => [
      {
        id: 1,
        studentId: "SE180123",
        name: "Đặng Hải",
        email: "haidang@fpt.edu.vn",
        avatar: "https://i.pravatar.cc/150?u=1",
        progress: 85,
        solved: 45,
        total: 9.25,
        joinDate: "2025-01-01",
        grades: [
          {
            slotId: "s1",
            slotName: "Slot 1: Intro",
            score: 10,
            status: "Passed",
          },
          {
            slotId: "s2",
            slotName: "Slot 2: Data Types",
            score: 8.5,
            status: "Passed",
          },
        ],
      },
      {
        id: 2,
        studentId: "SE180456",
        name: "Nguyễn Minh Thu",
        email: "thunm@fpt.edu.vn",
        avatar: "https://i.pravatar.cc/150?u=2",
        progress: 40,
        solved: 12,
        total: 6.0,
        joinDate: "2025-01-02",
        grades: [
          {
            slotId: "s1",
            slotName: "Slot 1: Intro",
            score: 7.0,
            status: "Passed",
          },
          {
            slotId: "s2",
            slotName: "Slot 2: Data Types",
            score: 5.0,
            status: "Passed",
          },
        ],
      },
      {
        id: 3,
        studentId: "SE180789",
        name: "Trần Hoàng Long",
        email: "longth@fpt.edu.vn",
        avatar: "https://i.pravatar.cc/150?u=3",
        progress: 95,
        solved: 60,
        total: 9.8,
        joinDate: "2025-01-03",
        grades: [
          {
            slotId: "s1",
            slotName: "Slot 1: Intro",
            score: 10,
            status: "Passed",
          },
        ],
      },
      {
        id: 4,
        studentId: "SE180111",
        name: "Lê Thị Lan",
        email: "lanlt@fpt.edu.vn",
        avatar: "https://i.pravatar.cc/150?u=4",
        progress: 20,
        solved: 5,
        total: 4.2,
        joinDate: "2025-01-04",
        grades: [],
      },
      {
        id: 5,
        studentId: "SE180222",
        name: "Phạm Quốc Anh",
        email: "anhpq@fpt.edu.vn",
        avatar: "https://i.pravatar.cc/150?u=5",
        progress: 70,
        solved: 30,
        total: 7.5,
        joinDate: "2025-01-05",
        grades: [],
      },
    ],
    []
  );

  const allSlots = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: `s${i + 1}`,
        title: `Slot ${i + 1}: Lesson Content ${i + 1}`,
        start: "08:00 25/01",
        end: "10:00 25/01",
        description: `Hướng dẫn cho Slot ${i + 1}.`,
        contests: [
          { id: `c${i}`, title: `Contest Slot ${i + 1}`, type: "Exam" },
        ],
        problems: [
          { id: `p${i}`, name: `Problem ${i + 1}.1`, difficulty: "Easy" },
        ],
        status: i < 2 ? "completed" : i === 2 ? "active" : "locked",
      })),
    []
  );

  const openAction = (student: Student, action: () => void) => {
    setSelectedStudent(student);
    action();
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 text-[#071739] dark:text-white max-w-[1400px] mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="flex justify-between items-center">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="font-black text-slate-400 uppercase px-0 text-[10px]"
            startContent={<ChevronLeft size={16} />}
          >
            Back
          </Button>
          <div className="bg-[#071739] px-4 py-1.5 rounded-full text-white text-[10px] font-black italic border border-white/10 shadow-xl uppercase">
            <span className="text-[#FF5C00]">Owner: </span>HOAINTT
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter leading-none">
              {resolvedParams.id}
            </h2>
            <p className="font-bold italic text-slate-500 uppercase text-sm">
              Programming Fundamentals
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="flat"
              className="h-12 px-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 font-black uppercase text-[10px] tracking-wider hover:bg-[#FF5C00] hover:text-white transition-all shadow-sm"
              startContent={<Trophy size={16} />}
              onPress={() => router.push(`/Ranking`)}
            >
              VIEW RANKING
            </Button>
            <Button
              className="bg-white dark:bg-[#1C2737] font-black rounded-xl h-12 px-6 border border-slate-200 dark:border-white/5 uppercase text-[10px]"
              startContent={<Send size={16} />}
              onPress={() => notifyModal.onOpen()}
            >
              Notify All
            </Button>
            <Button
              onPress={createSlotModal.onOpen}
              className="bg-[#FF5C00] text-white font-black rounded-xl h-12 px-8 shadow-lg uppercase text-[10px]"
              startContent={<Plus size={16} />}
            >
              New Slot
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        variant="underlined"
        classNames={{
          cursor: "bg-[#FF5C00]",
          tab: "font-black uppercase italic text-sm h-12 mr-12",
          tabContent: "group-data-[selected=true]:text-[#FF5C00]",
        }}
      >
        {/* TAB 1: CURRICULUM */}
        <Tab key="slots" title="Class Curriculum">
          <div className="flex flex-col gap-4 mt-8">
            {allSlots
              .slice((slotPage - 1) * rowsPerPage, slotPage * rowsPerPage)
              .map((slot) => (
                <Card
                  key={slot.id}
                  className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-sm overflow-hidden border border-transparent hover:border-[#FF5C00]/30 transition-all"
                >
                  <CardBody className="p-0">
                    <div
                      className="p-6 flex items-center justify-between group cursor-pointer"
                      onClick={() =>
                        setExpandedSlot(
                          expandedSlot === slot.id ? null : slot.id
                        )
                      }
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`p-3 rounded-2xl ${
                            slot.status === "active"
                              ? "bg-blue-50 text-[#FF5C00] animate-pulse"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {slot.status === "completed" ? (
                            <CheckCircle2 size={24} />
                          ) : (
                            <Clock size={24} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-lg uppercase italic group-hover:text-[#FF5C00] transition-colors">
                            {slot.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            {slot.start} — {slot.end}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="rounded-xl"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          className="rounded-xl"
                        >
                          <Trash2 size={14} />
                        </Button>
                        <ChevronDown
                          size={20}
                          className={`text-slate-300 transition-transform ${
                            expandedSlot === slot.id
                              ? "rotate-180 text-[#FF5C00]"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                    {expandedSlot === slot.id && (
                      <div className="px-10 pb-10 border-t border-divider dark:border-white/5 animate-in fade-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                          <div className="space-y-4">
                            <p className="text-[11px] font-[1000] uppercase italic text-[#FF5C00] flex items-center gap-2">
                              <Trophy size={14} /> Assigned Contests
                            </p>
                            {slot.contests.map((c) => (
                              <div
                                key={c.id}
                                className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border dark:border-white/5 hover:border-[#FF5C00]/50 transition-all"
                              >
                                <div>
                                  <p className="font-black text-xs uppercase italic">
                                    {c.title}
                                  </p>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                                    {c.type}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="flat"
                                  className="font-black uppercase text-[9px] h-8 rounded-lg"
                                  onPress={() =>
                                    router.push(`/Contest/${c.id}`)
                                  }
                                >
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-4">
                            <p className="text-[11px] font-[1000] uppercase italic text-blue-600 flex items-center gap-2">
                              <Code2 size={14} /> Assigned Problems
                            </p>
                            {slot.problems.map((p) => (
                              <div
                                key={p.id}
                                onClick={() => router.push(`/Problems/${p.id}`)}
                                className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border dark:border-white/5 hover:border-blue-500/50 transition-all"
                              >
                                <p className="font-black text-xs uppercase italic">
                                  {p.name}
                                </p>
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  className="font-black uppercase text-[8px]"
                                >
                                  {p.difficulty}
                                </Chip>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            <Pagination
              total={Math.ceil(allSlots.length / rowsPerPage)}
              page={slotPage}
              onChange={setSlotPage}
              className="self-center mt-6"
            />
          </div>
        </Tab>

        {/* TAB 2: STUDENT LIST */}
        <Tab key="students" title="Student List">
          <Card className="bg-white dark:bg-[#0A0F1C] rounded-[40px] mt-8 p-10 shadow-sm border dark:border-white/5">
            <div className="flex justify-between items-center mb-8">
              <Input
                placeholder="Search Student..."
                startContent={<Search size={18} className="text-slate-300" />}
                className="max-w-xs"
                classNames={{
                  inputWrapper: "bg-slate-50 dark:bg-black/20 rounded-2xl h-12",
                }}
              />
              <Button
                className="bg-blue-600 text-white font-black uppercase text-[10px] h-12 px-8 rounded-2xl shadow-lg"
                startContent={<UserPlus size={16} />}
              >
                Invite Student
              </Button>
            </div>
            <Table removeWrapper aria-label="Student table">
              <TableHeader>
                <TableColumn className="font-black text-[10px] uppercase">
                  STUDENT
                </TableColumn>
                <TableColumn className="font-black text-[10px] uppercase text-center">
                  PROGRESS
                </TableColumn>
                <TableColumn className="font-black text-[10px] uppercase text-right">
                  EMAIL
                </TableColumn>
                <TableColumn className="font-black text-[10px] uppercase text-right">
                  OPERATIONS
                </TableColumn>
              </TableHeader>
              <TableBody>
                {students.map((st) => (
                  <TableRow
                    key={st.id}
                    className="border-b dark:border-white/5 h-20 group hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell>
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/Management/Class/${resolvedParams.id}/Student/${st.studentId}`
                          )
                        }
                      >
                        <Avatar size="sm" src={st.avatar} />
                        <div className="flex flex-col">
                          <span className="font-black italic uppercase group-hover:text-[#FF5C00]">
                            {st.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">
                            {st.studentId}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Progress
                        value={st.progress}
                        size="sm"
                        className="max-w-[100px] mx-auto"
                        classNames={{ indicator: "bg-[#FF5C00]" }}
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold italic text-slate-400">
                      {st.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => openAction(st, profileModal.onOpen)}
                        >
                          <Eye size={18} className="text-blue-500" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => openAction(st, notifyModal.onOpen)}
                        >
                          <Bell size={18} className="text-amber-500" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => openAction(st, deleteModal.onOpen)}
                        >
                          <Trash2 size={18} className="text-danger" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Tab>

        {/* TAB 3: GRADING RESULTS */}
        <Tab key="results" title="Grading Results">
          <div className="space-y-6 mt-8">
            <div className="flex justify-between items-center bg-white dark:bg-[#0A0F1C] p-6 rounded-3xl border dark:border-white/5">
              <div className="flex items-center gap-4">
                <Filter size={20} className="text-[#FF5C00]" />
                <Select
                  label="Filter Slot"
                  className="w-64"
                  size="sm"
                  selectedKeys={[filterMode]}
                  onSelectionChange={(k) =>
                    setFilterMode(String(Array.from(k)[0]))
                  }
                >
                  <SelectItem key="all">Overall Summary</SelectItem>
                </Select>
              </div>
              <Button
                variant="flat"
                color="success"
                className="font-black uppercase text-[10px] h-12 px-6 rounded-2xl"
                startContent={<Download size={16} />}
              >
                Export Grade
              </Button>
            </div>
            <Card className="bg-white dark:bg-[#0A0F1C] rounded-[40px] p-10 border dark:border-white/5">
              <Table removeWrapper aria-label="Grading table">
                <TableHeader>
                  <TableColumn className="font-black text-[10px] uppercase">
                    STUDENT NAME
                  </TableColumn>
                  <TableColumn className="font-black text-[10px] uppercase text-center">
                    AVG GRADE
                  </TableColumn>
                  <TableColumn className="font-black text-[10px] uppercase text-right">
                    STATUS
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {students.map((res) => (
                    <React.Fragment key={res.id}>
                      <TableRow
                        className="h-20 border-b dark:border-white/5 cursor-pointer hover:bg-slate-50/50"
                        onClick={() =>
                          setExpandedStudent(
                            expandedStudent === res.studentId
                              ? null
                              : res.studentId
                          )
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-300 ${
                                expandedStudent === res.studentId
                                  ? "rotate-180 text-[#FF5C00]"
                                  : "text-slate-300"
                              }`}
                            />
                            <Avatar size="sm" src={res.avatar} />
                            <span className="font-black italic uppercase text-lg">
                              {res.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`text-3xl font-[1000] italic ${
                              res.total >= 5 ? "text-[#FF5C00]" : "text-danger"
                            }`}
                          >
                            {res.total}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Chip
                            color={res.total >= 5 ? "success" : "danger"}
                            variant="flat"
                            className="font-black uppercase text-[9px] italic"
                            startContent={<Activity size={12} />}
                          >
                            {res.total >= 5 ? "COMPLETED" : "WARNING"}
                          </Chip>
                        </TableCell>
                      </TableRow>
                      {expandedStudent === res.studentId && (
                        <TableRow>
                          <TableCell colSpan={3} className="p-0 border-none">
                            <div className="bg-slate-50/50 dark:bg-white/5 p-8 rounded-[2rem] m-2 animate-in slide-in-from-top-2">
                              <div className="flex items-center justify-between mb-6">
                                <p className="text-[11px] font-black uppercase italic text-[#FF5C00]">
                                  Slot Detailed Breakdown
                                </p>
                                <Button
                                  size="sm"
                                  variant="light"
                                  className="text-[10px] font-black uppercase italic"
                                  onPress={() =>
                                    router.push(
                                      `/Management/Class/${resolvedParams.id}/Student/${res.studentId}`
                                    )
                                  }
                                >
                                  View Full Performance{" "}
                                  <ExternalLink size={12} />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {res.grades.map((grade) => (
                                  <div
                                    key={grade.slotId}
                                    className="flex justify-between items-center p-5 bg-white dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm"
                                  >
                                    <div>
                                      <p className="font-black italic text-[11px] uppercase text-slate-500">
                                        {grade.slotName}
                                      </p>
                                      <p
                                        className={`text-[9px] font-bold uppercase ${
                                          grade.status === "Passed"
                                            ? "text-green-500"
                                            : "text-danger"
                                        }`}
                                      >
                                        {grade.status}
                                      </p>
                                    </div>
                                    <div className="text-2xl font-[1000] italic text-[#071739] dark:text-white">
                                      {grade.score}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </Tab>
      </Tabs>

      {/* --- MODALS --- */}
      <AddProblemModal
        isOpen={addProblemModal.isOpen}
        onOpenChange={addProblemModal.onOpenChange}
        onConfirm={handleConfirmProblems}
      />
      <AddContestModal
        isOpen={addContestModal.isOpen}
        onOpenChange={addContestModal.onOpenChange}
        onConfirm={handleConfirmContests}
      />
      <DeleteStudentModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        userName={selectedStudent?.name}
      />
      <NotifyStudentModal
        isOpen={notifyModal.isOpen}
        onOpenChange={notifyModal.onOpenChange}
        studentEmail={selectedStudent?.email}
      />
      <StudentProfileModal
        isOpen={profileModal.isOpen}
        onOpenChange={profileModal.onOpenChange}
        student={selectedStudent}
      />

      {/* CREATE SLOT MODAL - WITH VALIDATION */}
      <Modal
        isOpen={createSlotModal.isOpen}
        onOpenChange={createSlotModal.onOpenChange}
        size="4xl"
        classNames={{ base: "dark:bg-[#111827] rounded-[2.5rem]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-black italic uppercase text-2xl">
                Create New Slot
              </ModalHeader>
              <ModalBody className="gap-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Slot Title"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Enter title..."
                    value={slotTitle}
                    onValueChange={setSlotTitle}
                  />
                  <Input
                    type="datetime-local"
                    label="Start Date"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder=" "
                    value={slotStartDate}
                    onValueChange={setSlotStartDate}
                  />
                </div>
                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  variant="bordered"
                  minRows={3}
                  value={slotDescription}
                  onValueChange={setSlotDescription}
                />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-[#FF5C00]">
                      Contests ({draftContests.length})
                    </p>
                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border dark:border-white/5 min-h-[80px] flex flex-wrap gap-2">
                      {draftContests.map((c) => (
                        <Chip
                          key={c.id}
                          size="sm"
                          color="warning"
                          variant="flat"
                          onClose={() =>
                            setContests((prev) =>
                              prev.filter((x) => x.id !== c.id)
                            )
                          }
                        >
                          {c.title}
                        </Chip>
                      ))}
                      <Button
                        isIconOnly
                        size="sm"
                        className="rounded-full bg-[#FF5C00] text-white"
                        onPress={addContestModal.onOpen}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-blue-500">
                      Problems ({draftProblems.length})
                    </p>
                    <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border dark:border-white/5 min-h-[80px] flex flex-wrap gap-2">
                      {draftProblems.map((p) => (
                        <Chip
                          key={p.id}
                          size="sm"
                          color="primary"
                          variant="flat"
                          onClose={() =>
                            setDraftProblems((prev) =>
                              prev.filter((x) => x.id !== p.id)
                            )
                          }
                        >
                          {p.title}
                        </Chip>
                      ))}
                      <Button
                        isIconOnly
                        size="sm"
                        className="rounded-full bg-blue-600 text-white"
                        onPress={addProblemModal.onOpen}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#FF5C00] text-white font-black rounded-xl h-12 px-10 uppercase text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                  startContent={<Rocket size={16} />}
                  onPress={() => handleLaunchSlot(onClose)}
                  isDisabled={!isFormValid}
                >
                  Launch Slot
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
