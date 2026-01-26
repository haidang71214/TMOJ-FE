"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Chip,
} from "@heroui/react";
import {
  ArrowLeft,
  UploadCloud,
  Copy,
  CheckCircle2,
  Users,
  Info,
  Rocket,
  ShieldCheck,
  Search,
  UserPlus,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/* ===== MOCK DATA ===== */
const SUBJECTS = [
  { label: "SDN302", value: "SDN302" },
  { label: "PRN231", value: "PRN231" },
  { label: "EXE201", value: "EXE201" },
  { label: "PRF192", value: "PRF192" },
];

const TEACHERS_DATA = [
  {
    id: "HOAINTT",
    name: "Nguyen Thi Thanh Hoai",
    dept: "Software Engineering",
    avatar: "https://i.pravatar.cc/150?u=hoai",
  },
  {
    id: "RIMND",
    name: "Nguyễn Duy Rim",
    dept: "Information System",
    avatar: "https://i.pravatar.cc/150?u=rim",
  },
  {
    id: "TAIHT",
    name: "Huynh Tan Tai",
    dept: "Software Engineering",
    avatar: "https://i.pravatar.cc/150?u=tai",
  },
];

export default function CreateClassPage() {
  const successModal = useDisclosure();
  const teacherModal = useDisclosure();

  const [isLaunching, setIsLaunching] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [subjectCode, setSubjectCode] = useState("");
  const [groupId, setGroupId] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS_DATA[0]);
  const [teacherSearch, setTeacherSearch] = useState("");

  const inviteCode = useMemo(
    () => "TMOJ-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    []
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("Invite code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTeachers = TEACHERS_DATA.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const handleLaunch = async () => {
    if (!subjectCode || !groupId || !semester) {
      toast.error("Required fields missing: Subject, Group, or Semester");
      return;
    }
    setIsLaunching(true);
    // Simulating API Call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLaunching(false);
    successModal.onOpen();
  };

  return (
    <div className="flex flex-col h-full gap-8 p-2 max-w-5xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/Management/Class">
          <Button
            isIconOnly
            variant="flat"
            className="rounded-xl bg-white dark:bg-[#111827]"
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
          CREATE NEW <span className="text-[#FF5C00]">CLASS</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div className="lg:col-span-2 space-y-6">
          {/* BASIC INFO */}
          <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] p-4 shadow-sm">
            <CardBody className="gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Info size={20} />
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tight text-[#071739] dark:text-white">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Subject Code"
                  placeholder="Select a subject"
                  labelPlacement="outside"
                  variant="bordered"
                  classNames={{
                    trigger: "h-12 rounded-xl",
                    label:
                      "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                  onSelectionChange={(keys) =>
                    setSubjectCode(Array.from(keys)[0] as string)
                  }
                >
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.value}>{s.label}</SelectItem>
                  ))}
                </Select>

                <Input
                  label="Group ID"
                  placeholder="e.g. SE1801"
                  value={groupId}
                  onValueChange={setGroupId}
                  labelPlacement="outside"
                  variant="bordered"
                  classNames={{
                    label:
                      "font-black uppercase text-[10px] italic text-slate-500",
                    inputWrapper: "h-12 rounded-xl",
                  }}
                />

                <Select
                  label="Semester"
                  placeholder="Choose semester"
                  labelPlacement="outside"
                  variant="bordered"
                  className="md:col-span-2"
                  classNames={{
                    trigger: "h-12 rounded-xl",
                    label:
                      "font-black uppercase text-[10px] italic text-slate-500",
                  }}
                  onSelectionChange={(keys) =>
                    setSemester(Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="FA25">FALL 2025</SelectItem>
                  <SelectItem key="SP26">SPRING 2026</SelectItem>
                  <SelectItem key="SU26">SUMMER 2026</SelectItem>
                </Select>

                <div className="md:col-span-2 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-divider flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase italic text-slate-400">
                    Class Identifier:
                  </span>
                  <span className="font-[1000] italic text-xl text-blue-600 dark:text-blue-400 uppercase">
                    {subjectCode || "???"}-{groupId || "???"}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* TEACHER ASSIGNMENT */}
          <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] p-4 shadow-sm">
            <CardBody className="gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <UserPlus size={20} />
                  </div>
                  <h2 className="text-xl font-black italic uppercase text-[#071739] dark:text-white">
                    Academic Instructor
                  </h2>
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="font-black text-[10px] uppercase italic rounded-xl"
                  onPress={teacherModal.onOpen}
                >
                  Assign Teacher
                </Button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-divider">
                <Avatar
                  src={selectedTeacher.avatar}
                  size="lg"
                  className="rounded-xl font-black"
                />
                <div className="flex-1">
                  <p className="text-sm font-[1000] uppercase italic text-[#071739] dark:text-white">
                    {selectedTeacher.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                    {selectedTeacher.dept} • ID: {selectedTeacher.id}
                  </p>
                </div>
                <Chip
                  size="sm"
                  variant="dot"
                  color="success"
                  className="font-black italic uppercase text-[9px]"
                >
                  Main Faculty
                </Chip>
              </div>
            </CardBody>
          </Card>

          {/* STUDENT LIST UPLOAD */}
          <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] p-4 shadow-sm">
            <CardBody className="gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-black italic uppercase text-[#071739] dark:text-white">
                  Student Enrollment
                </h2>
              </div>
              <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 group hover:border-[#FF5C00] transition-colors cursor-pointer bg-slate-50/50 dark:bg-black/20">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1e293b] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-[#FF5C00]" size={32} />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase text-sm italic dark:text-white mb-1">
                    Click or Drag to Upload Roster
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Supports .xlsx, .csv (Max 5MB)
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-[#071739] text-white flex flex-col gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Rocket size={120} />
            </div>
            <h3 className="text-sm font-black uppercase italic tracking-widest text-[#FF5C00]">
              Finalize Classroom
            </h3>
            <p className="text-xs font-medium text-slate-400 italic leading-relaxed">
              Launch {subjectCode || "new class"}-{groupId || "..."} in{" "}
              {semester || "current"} semester with {selectedTeacher.id} as
              primary instructor.
            </p>
            <Button
              onPress={handleLaunch}
              isLoading={isLaunching}
              className="w-full bg-[#FF5C00] text-[#071739] font-[1000] h-16 rounded-2xl shadow-xl uppercase text-sm italic group hover:bg-[#22C55E] transition-all"
            >
              Launch Class
            </Button>
          </div>
        </div>
      </div>

      {/* TEACHER SELECTION MODAL */}
      <Modal
        isOpen={teacherModal.isOpen}
        onOpenChange={teacherModal.onOpenChange}
        size="lg"
        backdrop="blur"
        classNames={{ base: "rounded-[2.5rem] dark:bg-[#111827]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="uppercase font-[1000] italic text-xl">
                Select <span className="text-blue-600">Instructor</span>
              </ModalHeader>
              <ModalBody className="pb-8">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Search by name or faculty ID..."
                    startContent={<Search size={18} />}
                    value={teacherSearch}
                    onValueChange={setTeacherSearch}
                    variant="bordered"
                    className="flex-1"
                  />
                  <Button isIconOnly variant="flat" className="rounded-xl">
                    <Filter size={20} />
                  </Button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {filteredTeachers.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTeacher(t);
                        onClose();
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedTeacher.id === t.id
                          ? "border-blue-600 bg-blue-500/5"
                          : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <Avatar src={t.avatar} className="rounded-xl" />
                      <div className="flex-1">
                        <p className="text-sm font-black italic uppercase">
                          {t.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {t.dept}
                        </p>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 italic">
                        {t.id}
                      </span>
                    </div>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        isOpen={successModal.isOpen}
        onOpenChange={successModal.onOpenChange}
        backdrop="blur"
        size="md"
        classNames={{ base: "rounded-[2.5rem] dark:bg-[#111827] p-4" }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="font-black italic uppercase text-2xl">
                Class <span className="text-[#FF5C00]">Launched!</span>
              </ModalHeader>
              <ModalBody className="py-6 space-y-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                  <ShieldCheck size={40} />
                </div>
                <p className="text-sm font-bold italic text-slate-500">
                  Your classroom{" "}
                  <span className="text-[#071739] dark:text-white font-black uppercase">
                    {subjectCode}-{groupId}
                  </span>{" "}
                  is ready for students.
                </p>

                <div className="p-5 bg-slate-100 dark:bg-black/30 rounded-3xl border border-divider relative group">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-2 italic">
                    Student Invite Code
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-4xl font-[1000] text-[#FF5C00] italic leading-none">
                      {inviteCode}
                    </p>
                    <Tooltip content={copied ? "Copied!" : "Copy Code"}>
                      <Button
                        isIconOnly
                        onPress={handleCopy}
                        size="sm"
                        className="bg-[#FF5C00] text-white rounded-xl shadow-lg"
                      >
                        {copied ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  fullWidth
                  className="bg-[#071739] dark:bg-white text-white dark:text-[#071739] font-black italic uppercase rounded-2xl h-14"
                  onPress={() => (window.location.href = "/Management/Class")}
                >
                  Go to Dashboard
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
