"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Chip,
  Divider,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
} from "@heroui/react";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  ChevronDown,
  BookOpen,
  Lock,
  Target,
  Zap,
  Rocket,
  User,
  PlusCircle,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function StudentClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string | undefined;

  const [mounted, setMounted] = useState(false);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const is_teacher = true; // này sau nhét role teacher vào đây để check nhé

  // Modal HeroUI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentSlotId, setCurrentSlotId] = useState<string | null>(null);

  // State cho form trong modal
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rule, setRule] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dueDate, setDueDate] = useState(""); // <-- Thêm trường Due Date
  const [search, setSearch] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);

  type Problem = {
    id: string;
    name: string;
    difficulty: "Easy" | "Medium" | "Hard";
  };

  const allProblems: Problem[] = [
    { id: "p1", name: "Two Sum", difficulty: "Easy" },
    { id: "p2", name: "Valid Parentheses", difficulty: "Easy" },
    { id: "p3", name: "Merge Sort", difficulty: "Medium" },
    { id: "p4", name: "Binary Search Tree", difficulty: "Hard" },
    { id: "p5", name: "LRU Cache", difficulty: "Hard" },
  ];

  const filteredProblems = useMemo(
    () =>
      allProblems.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          !selectedProblems.find((s) => s.id === p.id)
      ),
    [search, selectedProblems]
  );

  const addProblem = (problem: Problem) => {
    setSelectedProblems((prev) => [...prev, problem]);
    setSearch("");
  };

  const removeProblem = (id: string) => {
    setSelectedProblems((prev) => prev.filter((p) => p.id !== id));
  };

  const isFormValid = title.trim() !== "" && selectedProblems.length > 0;

  const handleSubmit = () => {
    if (!isFormValid || !currentSlotId) return;

    const payload = {
      slot_id: currentSlotId,
      title,
      description,
      rule,
      start_time: startTime,
      end_time: endTime,
      due_date: dueDate, // <-- Thêm due_date vào payload
      problems: selectedProblems.map((p) => p.id),
    };

    console.log("SUBMIT ASSIGNMENT FOR SLOT:", currentSlotId, payload);
    // 👉 gọi API create assignment ở đây

    // Reset form
    setTitle("");
    setDescription("");
    setRule("");
    setStartTime("");
    setEndTime("");
    setDueDate("");
    setSearch("");
    setSelectedProblems([]);
    onClose();
  };

  // Pagination for Slots
  const [slotPage, setSlotPage] = useState(1);
  const slotsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  const classInfo = useMemo(
    () => ({
      id: classId || "PRF192_SP26",
      name: "Programming Fundamentals",
      semester: "Spring 2026",
      lecturer: "HOAINTT",
    }),
    [classId]
  );

  const myResult = {
    name: "Dang Hai",
    id: "SE180123",
    totalSolved: 45,
    totalProblems: 60,
    averageGrade: 9.25,
    rank: 12,
    history: [
      { slot: "Slot 1", problem: "Two Sum", score: 10, status: "Passed" },
      {
        slot: "Slot 1",
        problem: "Valid Parentheses",
        score: 8.5,
        status: "Passed",
      },
      { slot: "Slot 2", problem: "Merge Sort", score: 10, status: "Passed" },
    ],
  };

  const allSlots = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const now = new Date();
        const startDate = new Date();
        const endDate = new Date();
        if (i < 2) {
          startDate.setHours(now.getHours() - 48);
          endDate.setHours(now.getHours() - 24);
        } else if (i === 2) {
          startDate.setHours(now.getHours() - 1);
          endDate.setHours(now.getHours() + 2);
        } else {
          startDate.setDate(now.getDate() + i * 2);
        }

        const status =
          now > endDate ? "completed" : now >= startDate ? "active" : "locked";

        return {
          id: `s${i + 1}`,
          title: `Slot ${i + 1}: Lesson Content ${i + 1}`,
          start: startDate.toLocaleString("vi-VN"),
          end: endDate.toLocaleString("vi-VN"),
          description: `Practice and master the concepts of week ${Math.ceil(
            (i + 1) / 2
          )}.`,
          problems: [
            { name: `Problem ${i + 1}.1`, difficulty: "Easy" },
            { name: `Problem ${i + 1}.2`, difficulty: "Medium" },
          ],
          status,
        };
      }),
    []
  );

  const totalSlotPages = Math.ceil(allSlots.length / slotsPerPage);
  const currentSlots = useMemo(() => {
    const start = (slotPage - 1) * slotsPerPage;
    return allSlots.slice(start, start + slotsPerPage);
  }, [slotPage, allSlots]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex flex-col gap-8 pb-20 p-4 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="w-fit font-black text-slate-400 dark:text-slate-500 uppercase px-0 hover:text-blue-600 dark:hover:text-[#FF5C00] text-[10px]"
            startContent={<ChevronLeft size={16} />}
          >
            Back to My Courses
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none text-[#071739] dark:text-white">
                  {classInfo.id}
                </h2>
                <Chip className="font-black bg-[#FF5C00] text-white text-[10px] h-6 italic uppercase border-none shadow-lg shadow-orange-500/20">
                  {classInfo.semester}
                </Chip>
              </div>
              <h3 className="text-2xl font-black uppercase italic text-slate-500 dark:text-slate-400">
                {classInfo.name}
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-[#1C2737] px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase italic leading-none mb-1">
                  Teacher In Charge
                </p>
                <p className="text-sm font-black text-[#071739] dark:text-white uppercase leading-none">
                  {classInfo.lecturer}
                </p>
              </div>
              <Divider
                orientation="vertical"
                className="h-8 mx-2 bg-slate-200 dark:bg-white/10"
              />
              <div className="p-2 bg-slate-100 dark:bg-[#0A0F1C] rounded-xl text-[#071739] dark:text-[#FF5C00]">
                <User size={20} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        <Tabs
          variant="underlined"
          classNames={{
            cursor: "bg-[#FF5C00]",
            tab: "font-black uppercase italic text-sm h-12 mr-12",
            tabContent:
              "group-data-[selected=true]:text-[#FF5C00] text-slate-400",
          }}
        >
          {/* TAB 1: LEARNING PATH */}
          <Tab key="slots" title="Learning Path">
            <div className="flex flex-col gap-4 mt-8">
              {currentSlots.map((slot) => (
                <Card
                  key={slot.id}
                  className={`bg-white dark:bg-[#1C2737] border border-transparent transition-all shadow-sm rounded-[2rem] ${
                    slot.status === "locked"
                      ? "opacity-60 grayscale"
                      : "hover:border-blue-600 dark:hover:border-[#FF5C00] cursor-pointer shadow-xl"
                  }`}
                >
                  <CardBody className="p-0">
                    <div
                      className="p-6 flex items-center justify-between group"
                      onClick={() =>
                        slot.status !== "locked" &&
                        setExpandedSlot(
                          expandedSlot === slot.id ? null : slot.id
                        )
                      }
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`p-4 rounded-2xl ${
                            slot.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : slot.status === "active"
                              ? "bg-blue-500/10 text-blue-600 dark:text-[#FF5C00] animate-pulse"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {slot.status === "locked" ? (
                            <Lock size={22} />
                          ) : slot.status === "active" ? (
                            <Zap size={22} />
                          ) : (
                            <CheckCircle2 size={22} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-lg uppercase italic text-[#071739] dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#FF5C00] transition-colors">
                            {slot.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase italic flex items-center gap-1">
                              <Clock size={12} /> {slot.start} — {slot.end}
                            </span>
                            {slot.status === "active" && (
                              <Chip
                                size="sm"
                                className="bg-blue-600 dark:bg-[#FF5C00] text-white font-black text-[8px] uppercase h-5 border-none"
                              >
                                Open Now
                              </Chip>
                            )}
                          </div>
                        </div>
                      </div>
                      {slot.status !== "locked" && (
                        <ChevronDown
                          size={20}
                          className={`text-slate-300 dark:text-slate-600 transition-transform ${
                            expandedSlot === slot.id
                              ? "rotate-180 text-blue-600 dark:text-[#FF5C00]"
                              : ""
                          }`}
                        />
                      )}
                    </div>

                    {expandedSlot === slot.id && (
                      <div className="px-8 pb-8 border-t border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                          {/* LEFT: DESCRIPTION + CREATE BUTTON */}
                          <div className="lg:col-span-2 space-y-6">
                            {/* DESCRIPTION */}
                            <div className="space-y-4">
                              <p className="text-[11px] font-black uppercase italic text-blue-600 dark:text-[#FF5C00] opacity-80">
                                Assignment Description
                              </p>
                              <div className="p-6 bg-slate-50 dark:bg-[#0A0F1C]/60 rounded-3xl text-sm italic font-medium text-slate-500 dark:text-slate-400 border dark:border-white/5">
                                {slot.description}
                              </div>
                            </div>

                            {/* CREATE BUTTON */}
                            {is_teacher && (
                              <div className="flex justify-start pt-4">
                                <Button
                                  color="primary"
                                  startContent={<PlusCircle size={18} />}
                                  className="font-black italic bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-orange-600 dark:to-amber-600 text-white shadow-lg rounded-xl px-8 py-6 text-base hover:scale-[1.02] transition-all"
                                  onPress={() => {
                                    setCurrentSlotId(slot.id);
                                    onOpen();
                                  }}
                                >
                                  Create Assignment
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* RIGHT: PROBLEM LIST */}
                          <div className="space-y-4">
                            <p className="text-[11px] font-black uppercase italic text-[#FF5C00] opacity-80">
                              Solve Problems
                            </p>

                            <div className="space-y-2">
                              {slot.problems.map((p, i) => (
                                <Button
                                  key={i}
                                  fullWidth
                                  variant="flat"
                                  className="h-14 justify-between bg-slate-50 dark:bg-[#0A0F1C]/40 rounded-2xl border border-transparent hover:border-blue-600 dark:hover:border-[#FF5C00] transition-all"
                                  endContent={
                                    <Rocket
                                      size={16}
                                      className="text-blue-600 dark:text-[#FF5C00]"
                                    />
                                  }
                                >
                                  <div className="text-left">
                                    <p className="text-xs font-black italic uppercase text-[#071739] dark:text-white">
                                      {p.name}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                                      {p.difficulty}
                                    </p>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}

              <div className="flex justify-center mt-6">
                <Pagination
                  total={totalSlotPages}
                  page={slotPage}
                  onChange={setSlotPage}
                  classNames={{
                    cursor:
                      "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic",
                  }}
                />
              </div>
            </div>
          </Tab>

          {/* TAB 2: MY PERFORMANCE */}
          <Tab key="results" title="My Performance">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <Card className="lg:col-span-1 bg-[#071739] dark:bg-[#1C2737] text-white rounded-[2.5rem] p-4 shadow-2xl border-none">
                <CardBody className="space-y-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/10 rounded-2xl text-[#FF5C00]">
                      <Target size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase italic">
                        Overall Grade
                      </p>
                      <p className="text-4xl font-[1000] italic text-[#FF5C00]">
                        {myResult.averageGrade}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase italic text-slate-400">
                        Solved Progress
                      </p>
                      <p className="text-sm font-black italic text-[#00FF41]">
                        {myResult.totalSolved}/{myResult.totalProblems}
                      </p>
                    </div>
                    <Progress
                      aria-label="Student progress"
                      value={
                        (myResult.totalSolved / myResult.totalProblems) * 100
                      }
                      size="md"
                      classNames={{
                        indicator: "bg-[#00FF41]",
                        track: "bg-white/10",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase italic">
                        Class Rank
                      </p>
                      <p className="text-xl font-black italic">
                        #{myResult.rank}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase italic">
                        Accuracy
                      </p>
                      <p className="text-xl font-black italic">94%</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="lg:col-span-2 bg-white dark:bg-[#1C2737] rounded-[2.5rem] p-6 shadow-sm border-none">
                <CardBody className="space-y-6">
                  <h4 className="text-xl font-black italic uppercase text-[#071739] dark:text-white flex items-center gap-3">
                    <BookOpen
                      size={24}
                      className="text-blue-600 dark:text-[#FF5C00]"
                    />
                    Submission History
                  </h4>
                  <Table removeWrapper aria-label="Submission history table">
                    <TableHeader>
                      <TableColumn className="font-black uppercase text-[10px] bg-transparent">
                        Assignment
                      </TableColumn>
                      <TableColumn className="font-black uppercase text-[10px] bg-transparent">
                        Problem
                      </TableColumn>
                      <TableColumn className="font-black uppercase text-[10px] text-center bg-transparent">
                        Score
                      </TableColumn>
                      <TableColumn className="font-black uppercase text-[10px] text-right bg-transparent">
                        Status
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      {myResult.history.map((h, i) => (
                        <TableRow
                          key={i}
                          className="border-b border-slate-50 dark:border-white/5 h-16 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="font-bold italic text-slate-400 dark:text-slate-500 text-xs">
                            {h.slot}
                          </TableCell>
                          <TableCell className="font-black italic uppercase text-sm text-[#071739] dark:text-slate-200">
                            {h.problem}
                          </TableCell>
                          <TableCell className="text-center font-black text-lg text-blue-600 dark:text-[#00FF41]">
                            {h.score}
                          </TableCell>
                          <TableCell className="text-right">
                            <Chip
                              size="sm"
                              variant="flat"
                              className="font-black uppercase italic text-[9px] bg-emerald-500/10 text-emerald-500 border-none"
                            >
                              {h.status}
                            </Chip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* HeroUI Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="5xl"
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 px-10 pt-8">
                <h3 className="text-xl font-black uppercase italic text-[#071739] dark:text-white">
                  Create Assignment
                </h3>
                <p className="text-[11px] text-slate-400 italic">
                  Slot ID: <span className="font-bold">{currentSlotId}</span>
                </p>
              </ModalHeader>

              <ModalBody className="px-10 pb-10">
                <div className="space-y-8">
                  {/* BASIC INFO */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                      label="Assignment Title"
                      placeholder="Enter assignment title"
                      value={title}
                      onValueChange={setTitle}
                    />

                    <Input
                      type="datetime-local"
                      label="Start Time"
                      placeholder="dd/mm/yyyy --:--"
                      value={startTime}
                      onValueChange={setStartTime}
                    />

                    <Input
                      type="datetime-local"
                      label="End Time"
                      placeholder="dd/mm/yyyy --:--"
                      value={endTime}
                      onValueChange={setEndTime}
                    />

                    {/* Thêm trường Set Due Date */}
                    <Input
                      type="datetime-local"
                      label="Due Date (Deadline)"
                      placeholder="dd/mm/yyyy --:--"
                      value={dueDate}
                      onValueChange={setDueDate}
                    />

                    <div className="lg:col-span-2">
                      <Textarea
                        label="Description"
                        placeholder="Describe the assignment..."
                        value={description}
                        onValueChange={setDescription}
                        minRows={4}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Textarea
                        label="Rules"
                        placeholder="Submission rules, constraints, penalties..."
                        value={rule}
                        onValueChange={setRule}
                        minRows={3}
                      />
                    </div>
                  </div>

                  <Divider className="bg-slate-200 dark:bg-white/5" />

                  {/* ADD PROBLEM */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase italic text-[#071739] dark:text-white">
                      Add Problems
                    </h4>

                    <Input
                      placeholder="Search problem..."
                      value={search}
                      onValueChange={setSearch}
                    />

                    {search && filteredProblems.length > 0 && (
                      <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
                        {filteredProblems.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => addProblem(p)}
                            className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-white/5 transition"
                          >
                            <span className="font-bold text-sm text-[#071739] dark:text-white">
                              {p.name}
                            </span>
                            <Chip
                              size="sm"
                              className="text-[9px] font-black uppercase"
                            >
                              {p.difficulty}
                            </Chip>
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedProblems.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedProblems.map((p) => (
                          <Chip
                            key={p.id}
                            className="font-black italic"
                            endContent={
                              <button onClick={() => removeProblem(p.id)}>
                                <X size={12} />
                              </button>
                            }
                          >
                            {p.name}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-4">
                    <Button
                      className="bg-blue-600 dark:bg-[#FF5C00] text-white font-black italic px-10 rounded-xl shadow-lg"
                      onPress={handleSubmit}
                      isDisabled={!isFormValid}
                    >
                      Create Assignment
                    </Button>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
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
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
        }
      `}</style>
    </div>
  );
}