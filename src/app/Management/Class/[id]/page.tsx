"use client";
import React, { useState, use, useMemo } from "react";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Tooltip,
  Pagination,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
} from "@heroui/react";
import {
  Search,
  Plus,
  BarChart3,
  Send,
  ChevronLeft,
  CheckCircle2,
  Filter,
  UserPlus,
  Clock,
  Pencil,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  Bell,
  Trash2,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- IMPORT COMPONENTS ---
import { AddProblemModal } from "../../../components/AddProblemModal";
import DeleteStudentModal from "../../../components/DeleteModal";
import StudentProfileModal from "../../../components/ProfileModal";
import NotifyStudentModal from "../../../components/NotifyModal";
import { Student } from "../../../../types/index";

interface ProblemItem {
  id: string;
  title: string;
  difficulty: string;
}

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  // Modals hooks
  const deleteModal = useDisclosure();
  const profileModal = useDisclosure();
  const notifyModal = useDisclosure();
  const createSlotModal = useDisclosure();
  const addProblemModal = useDisclosure();

  // States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterMode, setFilterMode] = useState<string>("all");
  const [slotPage, setSlotPage] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [draftProblems, setDraftProblems] = useState<ProblemItem[]>([]);

  const rowsPerPage = 10;

  // --- MOCK DATA ---
  const students: Student[] = useMemo(
    () => [
      {
        id: 1,
        studentId: "SE180123",
        name: "Dang Hai",
        email: "haidang@fpt.edu.vn",
        avatar: "https://i.pravatar.cc/150?u=1",
        joinDate: "2025-10-15",
        progress: 85,
        solved: 45,
        total: 9.25,
      },
      {
        id: 2,
        studentId: "SE180456",
        name: "Minh Thu",
        email: "thunm@fpt.edu.vn",
        avatar: "https://i.pravatar.cc/150?u=2",
        joinDate: "2025-10-16",
        progress: 40,
        solved: 12,
        total: 6.0,
      },
    ],
    []
  );

  const allSlots = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: `s${i + 1}`,
        title: `Slot ${i + 1}: ${
          i === 0 ? "Intro Logic" : i === 1 ? "Data Types" : "Control Flow"
        }`,
        start: "08:00 25/01",
        end: "10:00 25/01",
        description: `Detailed course content for Slot ${
          i + 1
        }. Please review the documentation before starting.`,
        problems: [{ name: "Two Sum" }, { name: "Valid Parentheses" }],
        status: i < 2 ? "completed" : i === 2 ? "active" : "locked",
      })),
    []
  );

  const selectItems = [{ id: "all", title: "Overall Summary" }, ...allSlots];

  const openAction = (student: Student, action: () => void) => {
    setSelectedStudent(student);
    action();
  };

  const handleConfirmProblems = (selected: ProblemItem[]) => {
    setDraftProblems(selected);
  };

  const handleNotifyAll = () => {
    setSelectedStudent(null);
    notifyModal.onOpen();
  };

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 text-black dark:text-white max-w-[1400px] mx-auto">
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
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
              {resolvedParams.id}
            </h2>
            <p className="font-bold italic text-slate-500 uppercase text-sm">
              Programming Fundamentals
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-white dark:bg-[#1C2737] font-black rounded-xl h-12 px-6 border border-slate-200 dark:border-white/5 uppercase text-[10px]"
              startContent={<Send size={16} />}
              onPress={handleNotifyAll}
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
          cursor: "bg-blue-600 dark:bg-[#22C55E]",
          tab: "font-black uppercase italic text-sm h-12 mr-12",
        }}
      >
        {/* TAB 1: ASSIGNMENT SLOTS (ĐÃ KHÔI PHỤC CHI TIẾT) */}
        {/* TAB 1: ASSIGNMENT SLOTS (CÓ NÚT EDIT/DELETE) */}
        <Tab key="slots" title="Assignment Slots">
          <div className="flex flex-col gap-4 mt-8">
            {allSlots
              .slice((slotPage - 1) * rowsPerPage, slotPage * rowsPerPage)
              .map((slot) => (
                <Card
                  key={slot.id}
                  className={`bg-white dark:bg-[#111827] rounded-[2rem] shadow-sm overflow-hidden transition-all ${
                    slot.status === "locked" ? "opacity-50" : ""
                  }`}
                >
                  <CardBody className="p-0">
                    <div className="p-6 flex items-center justify-between">
                      <div
                        className="flex items-center gap-5 flex-1 cursor-pointer"
                        onClick={() =>
                          slot.status !== "locked" &&
                          setExpandedSlot(
                            expandedSlot === slot.id ? null : slot.id
                          )
                        }
                      >
                        <div
                          className={`p-3 rounded-2xl ${
                            slot.status === "active"
                              ? "bg-blue-50 text-blue-600"
                              : slot.status === "completed"
                              ? "bg-emerald-100 text-emerald-600"
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
                          <h4 className="font-black text-lg uppercase italic group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
                            {slot.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            {slot.start} — {slot.end}
                          </p>
                        </div>
                      </div>

                      {/* QUẢN LÝ SLOT: EDIT & DELETE */}
                      <div className="flex items-center gap-2">
                        <Tooltip content="Edit Slot">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          >
                            <Pencil size={14} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete Slot" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="rounded-xl"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </Tooltip>
                        <Divider orientation="vertical" className="h-6 mx-2" />
                        <ChevronDown
                          size={20}
                          className={`text-slate-300 transition-transform ${
                            expandedSlot === slot.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {expandedSlot === slot.id && (
                      <div className="px-10 pb-10 border-t border-divider dark:border-white/5 animate-in fade-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                          <div className="space-y-4">
                            <p className="text-[11px] font-black uppercase italic underline underline-offset-8 text-blue-600">
                              Description
                            </p>
                            <p className="text-xs font-bold text-slate-500 italic bg-slate-50 dark:bg-black/20 p-6 rounded-3xl">
                              {slot.description}
                            </p>
                          </div>
                          <div className="space-y-4">
                            <p className="text-[11px] font-black uppercase italic underline underline-offset-8 text-blue-600">
                              Assignments
                            </p>
                            <div className="bg-white dark:bg-black/20 rounded-3xl border border-divider dark:border-white/5 overflow-hidden">
                              <Table removeWrapper aria-label="Problems table">
                                <TableHeader>
                                  <TableColumn className="bg-transparent font-black uppercase text-[9px]">
                                    NAME
                                  </TableColumn>
                                  <TableColumn className="bg-transparent font-black uppercase text-[9px] text-right">
                                    VIEW
                                  </TableColumn>
                                </TableHeader>
                                <TableBody>
                                  {slot.problems.map((p, i) => (
                                    <TableRow
                                      key={i}
                                      className="border-b dark:border-white/5 last:border-none"
                                    >
                                      <TableCell className="font-black italic text-xs uppercase">
                                        {p.name}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <ExternalLink
                                          size={14}
                                          className="text-slate-300 inline-block"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
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

        {/* TAB 2: STUDENT LIST (ĐÃ KHÔI PHỤC NÚT EXPORT) */}
        <Tab key="students" title="Student List">
          <Card className="bg-white dark:bg-[#0A0F1C] rounded-[40px] mt-8 p-10 shadow-sm border border-transparent dark:border-white/5 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <Input
                placeholder="Search Student..."
                startContent={<Search size={18} className="text-slate-300" />}
                className="max-w-xs"
                classNames={{
                  inputWrapper: "bg-slate-50 dark:bg-black/20 rounded-2xl h-12",
                }}
              />
              <div className="flex gap-3">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      color="success"
                      className="font-black uppercase text-[10px] h-12 px-6 rounded-2xl"
                      startContent={<Download size={16} />}
                    >
                      Export List
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Export">
                    <DropdownItem
                      key="excel"
                      startContent={
                        <FileSpreadsheet
                          size={18}
                          className="text-emerald-500"
                        />
                      }
                    >
                      Excel (.xlsx)
                    </DropdownItem>
                    <DropdownItem
                      key="pdf"
                      startContent={
                        <FileText size={18} className="text-danger" />
                      }
                    >
                      PDF (.pdf)
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Button
                  className="bg-blue-600 dark:bg-blue-600 text-white font-black uppercase text-[10px] h-12 px-8 rounded-2xl shadow-lg"
                  startContent={<UserPlus size={16} />}
                >
                  Invite Student
                </Button>
              </div>
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
                    className="border-b dark:border-white/5 h-20 group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar size="sm" src={st.avatar} />
                        <div className="flex flex-col">
                          <span className="font-black italic uppercase">
                            {st.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">
                            {st.studentId}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-1">
                        <Progress
                          value={st.progress}
                          size="sm"
                          className="max-w-[100px]"
                          classNames={{
                            indicator: "bg-blue-600 dark:bg-[#22C55E]",
                          }}
                        />
                        <span className="text-[9px] font-black italic">
                          {st.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold italic text-slate-400">
                      {st.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip content="Profile">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => openAction(st, profileModal.onOpen)}
                          >
                            <Eye size={18} className="text-blue-500" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Notify">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => openAction(st, notifyModal.onOpen)}
                          >
                            <Bell size={18} className="text-amber-500" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => openAction(st, deleteModal.onOpen)}
                          >
                            <Trash2 size={18} className="text-danger" />
                          </Button>
                        </Tooltip>
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
            <div className="flex justify-between items-center bg-white dark:bg-[#0A0F1C] p-6 rounded-3xl shadow-sm border border-transparent dark:border-white/5">
              <div className="flex items-center gap-4">
                <Filter
                  size={20}
                  className="text-blue-600 dark:text-[#22C55E]"
                />
                <Select
                  label="Filter Slot"
                  className="w-64"
                  size="sm"
                  selectedKeys={[filterMode]}
                  onSelectionChange={(k) =>
                    setFilterMode(String(Array.from(k)[0]))
                  }
                >
                  {selectItems.map((item) => (
                    <SelectItem key={item.id}>{item.title}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-3">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      color="success"
                      className="font-black uppercase text-[10px] h-12 px-6 rounded-2xl"
                      startContent={<Download size={16} />}
                    >
                      Export Grade
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="excel"
                      startContent={
                        <FileSpreadsheet
                          size={18}
                          className="text-emerald-500"
                        />
                      }
                    >
                      Excel (.xlsx)
                    </DropdownItem>
                    <DropdownItem
                      key="pdf"
                      startContent={
                        <FileText size={18} className="text-danger" />
                      }
                    >
                      PDF (.pdf)
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Button
                  variant="flat"
                  className="font-black uppercase text-[10px] h-12 px-8 rounded-2xl"
                  startContent={<BarChart3 size={18} />}
                >
                  Report
                </Button>
              </div>
            </div>
            <Card className="bg-white dark:bg-[#0A0F1C] rounded-[40px] p-10 shadow-sm border border-transparent dark:border-white/5">
              <Table removeWrapper aria-label="Grading table">
                <TableHeader>
                  <TableColumn className="font-black text-[10px] uppercase">
                    STUDENT NAME
                  </TableColumn>
                  <TableColumn className="font-black text-[10px] uppercase text-center">
                    TOTAL GRADE
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {students.map((res) => (
                    <React.Fragment key={res.id}>
                      <TableRow className=" dark:border-white/5 h-20">
                        <TableCell>
                          <button
                            onClick={() =>
                              setExpandedStudent(
                                expandedStudent === res.studentId
                                  ? null
                                  : res.studentId
                              )
                            }
                            className="flex items-center gap-3"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform ${
                                expandedStudent === res.studentId
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                            <Avatar size="sm" src={res.avatar} />
                            <span className="font-black italic uppercase text-lg">
                              {res.name}
                            </span>
                          </button>
                        </TableCell>
                        <TableCell className="text-center font-black text-3xl text-blue-600 dark:text-[#22C55E] italic">
                          {res.total}
                        </TableCell>
                      </TableRow>
                      {expandedStudent === res.studentId && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="bg-slate-50/50 dark:bg-white/5 p-8 rounded-3xl"
                          >
                            <div className="space-y-4">
                              <h5 className="text-[11px] font-black uppercase italic underline underline-offset-8">
                                Submission History
                              </h5>
                              <div className="flex justify-between items-center h-12 border-b dark:border-white/5">
                                <div className="flex items-center gap-2">
                                  <span className="font-black italic">
                                    Two Sum
                                  </span>
                                </div>
                                <span className="font-black text-blue-600">
                                  10/10
                                </span>
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

      {/* --- CÁC MODALS RIÊNG BIỆT --- */}
      <DeleteStudentModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        userName={selectedStudent?.name}
      />
      <StudentProfileModal
        isOpen={profileModal.isOpen}
        onOpenChange={profileModal.onOpenChange}
        student={selectedStudent}
      />
      <NotifyStudentModal
        isOpen={notifyModal.isOpen}
        onOpenChange={notifyModal.onOpenChange}
        studentEmail={selectedStudent?.email}
      />
      <AddProblemModal
        isOpen={addProblemModal.isOpen}
        onOpenChange={addProblemModal.onOpenChange}
        onConfirm={handleConfirmProblems}
      />

      {/* CREATE SLOT MODAL */}
      <Modal
        isOpen={createSlotModal.isOpen}
        onOpenChange={createSlotModal.onOpenChange}
        backdrop="blur"
        size="2xl"
        classNames={{ base: "dark:bg-[#111827] rounded-[2.5rem]" }}
      >
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader className="font-black italic uppercase text-2xl tracking-tighter">
                Create New Slot
              </ModalHeader>
              <ModalBody className="gap-6 py-4">
                <Input
                  label="Slot Title"
                  labelPlacement="outside"
                  variant="bordered"
                  classNames={{
                    label: "font-black uppercase text-[10px] italic",
                  }}
                />
                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  variant="bordered"
                  minRows={3}
                  classNames={{
                    label: "font-black uppercase text-[10px] italic",
                  }}
                />
                <div className="space-y-2">
                  <p className="font-black text-[10px] uppercase italic text-slate-400">
                    Selected Problems
                  </p>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-divider">
                    {draftProblems.length > 0 ? (
                      draftProblems.map((p) => (
                        <Chip
                          key={p.id}
                          size="sm"
                          className="font-black uppercase text-[9px]"
                        >
                          {p.title}
                        </Chip>
                      ))
                    ) : (
                      <p className="text-[10px] font-bold italic text-slate-400">
                        No problems selected.
                      </p>
                    )}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={addProblemModal.onOpen}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="font-black uppercase text-[10px]"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white font-black rounded-xl h-12 px-8 uppercase text-[10px]"
                  startContent={<Rocket size={16} />}
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
