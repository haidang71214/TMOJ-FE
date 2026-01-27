"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Chip,
  Switch,
  RadioGroup,
  Radio,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Download,
  X,
  Trophy,
  Lock,
  CalendarDays,
  Heading1,
  Bold,
  Italic,
  List,
  Link2,
} from "lucide-react";

export interface Contest {
  id: string;
  title: string;
  rule: "ACM" | "OI";
  type: "PUBLIC" | "PRIVATE" | "PASSWORD";
  status: "RUNNING" | "UPCOMING" | "ENDED";
  visible: boolean;
}

const MOCK_CONTESTS: Contest[] = [
  {
    id: "#1024",
    title: "TMOJ SPRING CONTEST 2025",
    rule: "ACM",
    type: "PUBLIC",
    status: "RUNNING",
    visible: true,
  },
  {
    id: "#1025",
    title: "BEGINNER FREE CONTEST #01",
    rule: "OI",
    type: "PASSWORD",
    status: "ENDED",
    visible: false,
  },
  {
    id: "#1026",
    title: "ICPC REGIONAL QUALIFIERS",
    rule: "ACM",
    type: "PUBLIC",
    status: "UPCOMING",
    visible: true,
  },
  {
    id: "#1027",
    title: "MONTHLY CHALLENGE #12",
    rule: "OI",
    type: "PUBLIC",
    status: "ENDED",
    visible: true,
  },
];

export default function ContestManagementPage() {
  const [contests, setContests] = useState<Contest[]>(MOCK_CONTESTS);
  const [isOpen, setIsOpen] = useState(false);

  const EditorToolbar = () => (
    <div className="bg-slate-50 dark:bg-black/20 p-2 border-b border-slate-200 dark:border-white/10 flex gap-1">
      {[Heading1, Bold, Italic, List, Link2].map((Icon, i) => (
        <Button key={i} isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E]">
          <Icon size={16} />
        </Button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase">
            Contest <span className="text-[#FF5C00]">Management</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Organize and monitor programming competitions
          </p>
        </div>

        <Button
          className="bg-[#0B1C3D] text-white font-black"
          startContent={<Plus size={16} />}
          onPress={() => setIsOpen(true)}
        >
          Create New Contest
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 items-center">
        <Input placeholder="Search contest title or ID..." className="max-w-xs" />
        <Button variant="bordered">Rule Type</Button>
        <Button variant="bordered">Sort By</Button>
        <Button isIconOnly color="primary">
          ↻
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-slate-400 uppercase text-xs">
            <tr className="border-b">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Contest Title</th>
              <th className="p-4">Rule</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Visible</th>
              <th className="p-4 text-right">Operations</th>
            </tr>
          </thead>

          <tbody>
            {contests.map((c) => (
              <tr key={c.id} className="border-b last:border-none">
                <td className="p-4 text-slate-400">{c.id}</td>
                <td className="p-4 font-bold">{c.title}</td>
                <td className="p-4 text-center">
                  <Chip size="sm" color={c.rule === "ACM" ? "primary" : "secondary"}>
                    {c.rule}
                  </Chip>
                </td>
                <td className="p-4 text-center font-semibold">{c.type}</td>
                <td className="p-4 text-center">
                  <Chip
                    size="sm"
                    color={
                      c.status === "RUNNING"
                        ? "success"
                        : c.status === "UPCOMING"
                        ? "warning"
                        : "default"
                    }
                  >
                    {c.status}
                  </Chip>
                </td>
                <td className="p-4 text-center">
                  <Switch
                    isSelected={c.visible}
                    onValueChange={(v) =>
                      setContests((prev) =>
                        prev.map((x) => (x.id === c.id ? { ...x, visible: v } : x))
                      )
                    }
                  />
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button isIconOnly size="sm"><Pencil size={16} /></Button>
                    <Button isIconOnly size="sm"><Eye size={16} /></Button>
                    <Button isIconOnly size="sm"><Download size={16} /></Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      onPress={() =>
                        setContests((prev) => prev.filter((x) => x.id !== c.id))
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREATE CONTEST */}
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="4xl"
        scrollBehavior="inside"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4 pb-8">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
                    CREATE NEW <span className="text-[#FF5C00]">CONTEST</span>
                  </h1>
                  <Chip variant="dot" color="warning" className="font-black uppercase text-[10px] border-none italic">
                    Draft Mode
                  </Chip>
                </div>
              </ModalHeader>

              <ModalBody className="space-y-10">
                {/* TITLE */}
                <Input
                  label="Contest Title"
                  placeholder="e.g. TMOJ Spring Contest 2025"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper: "rounded-2xl dark:bg-black/20 h-14 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] transition-all",
                    label: "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                    input: "font-bold italic uppercase tracking-tight text-lg",
                  }}
                />

                {/* DESCRIPTION */}
                <div className="space-y-3">
                  <label className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest ml-1">
                    Contest Description & Rules
                  </label>
                  <div className="rounded-2xl border-2 border-slate-100 dark:border-white/10 overflow-hidden focus-within:border-blue-600 dark:focus-within:border-[#22C55E] bg-slate-50/30 dark:bg-black/10">
                    <EditorToolbar />
                    <Textarea
                      placeholder="Explain the rules, prizes, and details..."
                      variant="flat"
                      minRows={5}
                      classNames={{
                        inputWrapper: "bg-transparent shadow-none p-4",
                        input: "font-medium text-slate-600 dark:text-slate-300",
                      }}
                    />
                  </div>
                </div>

                {/* SETTINGS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Input
                    label="Start Time"
                    type="datetime-local"
                    labelPlacement="outside"
                    startContent={<CalendarDays size={18} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
                      label: "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                    }}
                  />
                  <Input
                    label="End Time"
                    type="datetime-local"
                    labelPlacement="outside"
                    startContent={<CalendarDays size={18} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
                      label: "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                    }}
                  />
                  <Input
                    label="Security Password"
                    type="password"
                    placeholder="Keep empty for public"
                    labelPlacement="outside"
                    startContent={<Lock size={18} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl dark:bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
                      label: "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                    }}
                  />
                </div>

                {/* CONFIGURATION BOX */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5">
                  <RadioGroup
                    label="Rule System"
                    orientation="horizontal"
                    defaultValue="acm"
                    classNames={{
                      label: "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-4",
                    }}
                  >
                    <div className="flex gap-8">
                      <Radio value="acm" classNames={{ label: "text-xs font-black uppercase italic" }}>
                        ACM
                      </Radio>
                      <Radio value="oi" classNames={{ label: "text-xs font-black uppercase italic" }}>
                        OI
                      </Radio>
                    </div>
                  </RadioGroup>

                  <div className="flex flex-col gap-4">
                    <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none">
                      Real-time Ranking
                    </span>
                    <Switch
                      defaultSelected
                      size="sm"
                      classNames={{
                        wrapper: "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-black dark:text-white font-black uppercase text-[10px] tracking-widest leading-none">
                      Publicly Visible
                    </span>
                    <Switch
                      defaultSelected
                      size="sm"
                      classNames={{
                        wrapper: "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                      }}
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                <Button
                  variant="flat"
                  startContent={<X size={18} />}
                  className="rounded-xl font-black uppercase text-[10px] tracking-widest px-10 h-12 bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                  onPress={onClose}
                >
                  Discard Draft
                </Button>
                <Button
                  startContent={<Trophy size={20} strokeWidth={3} />}
                  className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black rounded-2xl h-14 px-16 uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                >
                  Launch Contest
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx global>{`
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