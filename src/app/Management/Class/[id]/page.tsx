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
  Pagination,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
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
  ExternalLink,
  Clock,
  ChevronDown,
  BookOpen,
  Download,
  FileSpreadsheet,
  FileText,
  Rocket,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- IMPORT MODAL PROBLEM BANK ---
import { AddProblemModal } from "../../../components/AddProblemModal";

interface StudentResult {
  name: string;
  id: string;
  email: string;
  s1: number;
  s2: number;
  total: number;
  progress: number;
  [key: string]: string | number;
}

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

  // Hook quản lý Modal - Sửa lỗi gọi biến ở đây
  const createSlotModal = useDisclosure();
  const addProblemModal = useDisclosure();

  const [filterMode, setFilterMode] = useState<string>("all");
  const [slotPage, setSlotPage] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [draftProblems, setDraftProblems] = useState<ProblemItem[]>([]);

  const rowsPerPage = 10;
  const now = new Date();

  const classInfo = useMemo(
    () => ({
      id: resolvedParams.id || "PRF192_SP26",
      name: "Programming Fundamentals",
      semester: "Spring 2026",
      owner: "HOAINTT",
    }),
    [resolvedParams.id]
  );

  const allSlots = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const startDate = new Date();
        const endDate = new Date();
        if (i < 2) {
          startDate.setHours(now.getHours() - 5);
          endDate.setHours(now.getHours() - 3);
        } else if (i === 2) {
          startDate.setHours(now.getHours() - 1);
          endDate.setHours(now.getHours() + 1);
        } else {
          startDate.setDate(now.getDate() + (i - 1));
        }
        const status =
          now > endDate ? "completed" : now >= startDate ? "active" : "locked";
        return {
          id: `s${i + 1}`,
          title: `Slot ${i + 1}: ${
            i === 0 ? "Intro Logic" : i === 1 ? "Data Types" : "Control Flow"
          }`,
          start: startDate.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          }),
          end: endDate.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          }),
          description: `Course content for Slot ${
            i + 1
          }. Review materials carefully.`,
          problems: [
            { name: "Two Sum", difficulty: "Easy" },
            { name: "Valid Parentheses", difficulty: "Easy" },
          ],
          status,
        };
      }),
    []
  );

  const slotPages = Math.ceil(allSlots.length / rowsPerPage);
  const selectItems = [{ id: "all", title: "Overall Summary" }, ...allSlots];
  const currentSlots = allSlots.slice(
    (slotPage - 1) * rowsPerPage,
    slotPage * rowsPerPage
  );

  const results: StudentResult[] = [
    {
      name: "Dang Hai",
      id: "SE180123",
      email: "haidang@fpt.edu.vn",
      s1: 10,
      s2: 8.5,
      total: 9.25,
      progress: 85,
    },
    {
      name: "Minh Thu",
      id: "SE180456",
      email: "thunm@fpt.edu.vn",
      s1: 7.0,
      s2: 5.0,
      total: 6.0,
      progress: 40,
    },
    {
      name: "Hoang Nam",
      id: "SE180789",
      email: "namh@fpt.edu.vn",
      s1: 8.5,
      s2: 9.0,
      total: 8.75,
      progress: 95,
    },
  ];

  const handleConfirmProblems = (selected: ProblemItem[]) => {
    setDraftProblems(selected);
  };

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 text-black dark:text-white">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="flex justify-between items-center">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="font-black text-slate-400 uppercase px-0 hover:text-blue-600 text-[10px]"
            startContent={<ChevronLeft size={16} />}
          >
            Back to Class List
          </Button>
          <div className="bg-[#071739] px-4 py-1.5 rounded-full border border-white/10 shadow-xl text-white">
            <span className="text-[9px] font-bold text-[#FF5C00] uppercase italic">
              Owner:{" "}
            </span>
            <span className="text-[10px] font-black uppercase italic">
              {classInfo.owner}
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                {classInfo.id}
              </h2>
              <Chip
                variant="flat"
                className="font-black bg-blue-50 dark:bg-[#FF5C00] text-blue-600 dark:text-white text-[10px] h-6 px-3 italic uppercase"
              >
                {classInfo.semester}
              </Chip>
            </div>
            <h3 className="text-2xl font-black uppercase italic text-[#071739] dark:text-slate-300">
              {classInfo.name}
            </h3>
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-white dark:bg-[#1C2737] font-black rounded-xl h-12 px-6 border border-slate-200 dark:border-white/5 uppercase text-[10px]"
              startContent={<Send size={16} />}
            >
              Notify
            </Button>
            <Button
              onPress={createSlotModal.onOpen}
              className="bg-[#FF5C00] text-white font-black rounded-xl h-12 px-8 shadow-lg uppercase text-[10px]"
              startContent={<Plus size={16} strokeWidth={3} />}
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
          tabContent:
            "group-data-[selected=true]:text-blue-600 dark:group-data-[selected=true]:text-[#22C55E]",
        }}
      >
        {/* TAB 1: SLOTS */}
        <Tab key="slots" title="Assignment Slots">
          <div className="flex flex-col gap-4 mt-8">
            {currentSlots.map((slot) => (
              <Card
                key={slot.id}
                className={`bg-white dark:bg-[#111827] border-none rounded-3xl shadow-sm transition-all hover:border-blue-600 ${
                  slot.status === "locked" ? "opacity-50" : ""
                }`}
              >
                <CardBody className="p-0">
                  <div
                    className="p-6 flex items-center justify-between cursor-pointer group"
                    onClick={() =>
                      slot.status !== "locked" &&
                      setExpandedSlot(expandedSlot === slot.id ? null : slot.id)
                    }
                  >
                    <div className="flex items-center gap-5 flex-1">
                      <div
                        className={`p-3 rounded-2xl ${
                          slot.status === "completed"
                            ? "bg-emerald-100 text-emerald-600"
                            : slot.status === "active"
                            ? "bg-blue-50 text-blue-600"
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
                        <h4 className="font-black text-lg uppercase italic group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
                          {slot.title}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 italic tracking-widest">
                          {slot.start} — {slot.end}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-slate-300 transition-transform ${
                        expandedSlot === slot.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {expandedSlot === slot.id && (
                    <div className="px-10 pb-10 border-t border-slate-50 dark:border-white/5 animate-in fade-in slide-in-from-top-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                        <div className="space-y-4">
                          <p className="text-[11px] font-black uppercase italic underline underline-offset-8">
                            Description
                          </p>
                          <pre className="font-sans text-xs font-bold text-slate-500 bg-slate-50 dark:bg-black/40 p-6 rounded-3xl italic whitespace-pre-line">
                            {slot.description}
                          </pre>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[11px] font-black uppercase italic underline underline-offset-8">
                            Assignments
                          </p>
                          <div className="bg-white dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
                            <Table removeWrapper aria-label="Problems">
                              <TableHeader>
                                <TableColumn className="bg-transparent font-black uppercase text-[9px]">
                                  Name
                                </TableColumn>
                                <TableColumn className="bg-transparent font-black uppercase text-[9px] text-right">
                                  View
                                </TableColumn>
                              </TableHeader>
                              <TableBody>
                                {slot.problems.map((p, i) => (
                                  <TableRow
                                    key={i}
                                    className="border-b border-slate-50 dark:border-white/5 last:border-none"
                                  >
                                    <TableCell className="font-black italic">
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
              total={slotPages}
              page={slotPage}
              onChange={setSlotPage}
              className="self-center"
              classNames={{
                cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-black",
              }}
            />
          </div>
        </Tab>

        {/* TAB 2: STUDENT LIST */}
        <Tab key="students" title="Student List">
          <Card className="bg-white dark:bg-[#0A0F1C] rounded-[40px] border border-transparent dark:border-white/5 shadow-sm mt-8 overflow-hidden">
            <CardBody className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Search Student..."
                  startContent={<Search size={18} className="text-slate-300" />}
                  className="max-w-xs"
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 dark:bg-black/20 rounded-2xl h-12",
                  }}
                />
                <div className="flex gap-3">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
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
                    className="bg-blue-600 dark:bg-[#22C55E] text-white font-black uppercase text-[10px] h-12 px-8 rounded-2xl shadow-lg"
                    startContent={<UserPlus size={16} strokeWidth={3} />}
                  >
                    Invite Student
                  </Button>
                </div>
              </div>
              <Table removeWrapper aria-label="Student table">
                <TableHeader>
                  <TableColumn className="font-black uppercase text-[10px] text-slate-400">
                    Student Info
                  </TableColumn>
                  <TableColumn className="font-black uppercase text-[10px] text-slate-400 text-center">
                    Progress
                  </TableColumn>
                  <TableColumn className="font-black uppercase text-[10px] text-slate-400 text-right">
                    Email
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {results.map((st) => (
                    <TableRow
                      key={st.id}
                      className="border-b border-slate-50 dark:border-white/5 h-20 group"
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar
                            name={st.name}
                            size="sm"
                            className="bg-[#071739] text-white font-black"
                          />
                          <span className="font-black italic uppercase">
                            {st.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center gap-2">
                          <Progress
                            value={st.progress}
                            size="sm"
                            className="max-w-[120px]"
                            classNames={{
                              indicator: "bg-blue-600 dark:bg-[#22C55E]",
                            }}
                          />
                          <span className="text-[10px] font-black italic">
                            {st.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-400 italic">
                        {st.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        {/* TAB 3: GRADING RESULTS */}
        <Tab key="results" title="Grading Results">
          <div className="space-y-6 mt-8">
            <div className="flex justify-between items-center bg-white dark:bg-[#0A0F1C] border border-transparent dark:border-white/5 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center gap-4">
                <Filter
                  size={20}
                  className="text-blue-600 dark:text-[#22C55E]"
                />
                <Select
                  label="Filter by Slot"
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
              <Button
                variant="flat"
                className="font-black uppercase text-[10px] h-12 px-8 rounded-2xl"
                startContent={<BarChart3 size={18} />}
              >
                Report
              </Button>
            </div>
            <Card className="bg-white dark:bg-[#0A0F1C] border border-transparent dark:border-white/5 rounded-[40px] shadow-sm p-10">
              <Table removeWrapper aria-label="Grading">
                <TableHeader>
                  <TableColumn className="font-black uppercase text-[10px]">
                    Student Name
                  </TableColumn>
                  <TableColumn className="font-black uppercase text-[10px] text-center">
                    Grade
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {results.map((res) => (
                    <React.Fragment key={res.id}>
                      <TableRow className="border-b border-slate-50 dark:border-white/5 h-20">
                        <TableCell>
                          <button
                            onClick={() =>
                              setExpandedStudent(
                                expandedStudent === res.id ? null : res.id
                              )
                            }
                            className="flex items-center gap-3"
                          >
                            <ChevronDown
                              size={18}
                              className={`text-slate-300 transition-transform ${
                                expandedStudent === res.id ? "rotate-180" : ""
                              }`}
                            />
                            <Avatar
                              name={res.name}
                              size="sm"
                              className="bg-[#071739] text-white font-black"
                            />
                            <span className="font-black italic uppercase text-lg">
                              {res.name}
                            </span>
                          </button>
                        </TableCell>
                        <TableCell className="text-center font-black text-3xl text-blue-600 dark:text-[#22C55E] italic">
                          {res.total}
                        </TableCell>
                      </TableRow>
                      {expandedStudent === res.id && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="bg-slate-50/50 dark:bg-white/5 p-8 rounded-3xl"
                          >
                            <div className="space-y-4">
                              <h5 className="text-[11px] font-black uppercase italic underline underline-offset-8">
                                Submission History
                              </h5>
                              <div className="flex justify-between items-center h-12 border-b border-black/5 dark:border-white/5">
                                <div className="flex items-center gap-2">
                                  <BookOpen size={14} />
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

      {/* --- MODAL 1: CREATE NEW SLOT --- */}
      <Modal
        isOpen={createSlotModal.isOpen}
        onOpenChange={createSlotModal.onOpenChange}
        backdrop="blur"
        size="2xl"
        classNames={{
          base: "dark:bg-[#111827] rounded-[2.5rem] border border-white/5 p-4",
          header: "font-black italic uppercase text-2xl tracking-tighter",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Slot</ModalHeader>
              <ModalBody className="gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Slot Title"
                    labelPlacement="outside"
                    variant="bordered"
                    classNames={{
                      label: "font-black uppercase text-[10px] italic",
                      inputWrapper: "h-12 rounded-xl",
                    }}
                  />
                  <Select
                    label="Slot Type"
                    labelPlacement="outside"
                    variant="bordered"
                    classNames={{
                      label: "font-black uppercase text-[10px] italic",
                      trigger: "h-12 rounded-xl",
                    }}
                  >
                    <SelectItem key="assignment">Assignment</SelectItem>
                    <SelectItem key="quiz">Quiz</SelectItem>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="datetime-local"
                    label="Start Time"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder=" "
                    classNames={{
                      label: "font-black uppercase text-[10px] italic",
                      inputWrapper: "h-12 rounded-xl",
                    }}
                  />
                  <Input
                    type="datetime-local"
                    label="End Time"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder=" "
                    classNames={{
                      label: "font-black uppercase text-[10px] italic",
                      inputWrapper: "h-12 rounded-xl",
                    }}
                  />
                </div>
                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  variant="bordered"
                  minRows={3}
                  classNames={{
                    label: "font-black uppercase text-[10px] italic",
                    inputWrapper: "rounded-2xl p-4",
                  }}
                />
                <div className="space-y-3">
                  <p className="font-black text-[10px] uppercase italic text-slate-400">
                    Included Problems
                  </p>
                  {draftProblems.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5">
                      {draftProblems.map((p) => (
                        <Chip
                          key={p.id}
                          onClose={() =>
                            setDraftProblems((prev) =>
                              prev.filter((item) => item.id !== p.id)
                            )
                          }
                          variant="flat"
                          className="font-black uppercase text-[9px] bg-white dark:bg-[#1C2737]"
                        >
                          {p.title}
                        </Chip>
                      ))}
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="rounded-full text-blue-600"
                        onPress={addProblemModal.onOpen}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="p-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center gap-2 group hover:border-blue-600 transition-colors cursor-pointer"
                      onClick={addProblemModal.onOpen}
                    >
                      <Plus size={20} className="text-blue-600" />
                      <p className="font-black text-[10px] uppercase italic text-slate-400">
                        Add Problems from Bank
                      </p>
                    </div>
                  )}
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
                  className="bg-blue-600 text-white font-black rounded-xl h-12 px-8 shadow-lg uppercase text-[10px]"
                  startContent={<Rocket size={16} />}
                >
                  Launch Slot
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* --- MODAL 2: PROBLEM BANK --- */}
      <AddProblemModal
        isOpen={addProblemModal.isOpen}
        onOpenChange={addProblemModal.onOpenChange}
        onConfirm={handleConfirmProblems}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }
        .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
}
