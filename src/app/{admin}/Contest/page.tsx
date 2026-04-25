"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
import {
  ADMIN_TABLE_WRAPPER, ADMIN_TH, ADMIN_TH_RIGHT, ADMIN_TD, ADMIN_TD_MUTED,
  ADMIN_TR_HOVER, ADMIN_THEAD_BG, ADMIN_H1, ADMIN_SUBTITLE, ADMIN_PAGE_WRAPPER,
} from "../adminTable";
import { iconBtnGhost, iconBtnDanger, iconBtnSuccess } from "../adminTheme";

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
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={ADMIN_H1}>
            Contest <span style={{ color: "#3B5BFF" }}>Management</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>Organize and monitor programming competitions</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 16px rgba(59,91,255,0.3)" }}
          onClick={() => setIsOpen(true)}
        >
          <Plus size={15} /> Create New Contest
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 items-center">
        <input
          placeholder="Search contest title or ID..."
          className="rounded-xl px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-[#3B5BFF] transition-all"
          style={{ background: "#1E2B42", border: "1px solid rgba(255,255,255,0.10)", width: 260 }}
        />
        <button className="px-3 py-2 rounded-xl text-xs font-semibold text-white/50 transition-all hover:text-white/80" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>Rule Type</button>
        <button className="px-3 py-2 rounded-xl text-xs font-semibold text-white/50 transition-all hover:text-white/80" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>Sort By</button>
      </div>

      {/* TABLE */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "#162035" }}
      >
        <Table
          aria-label="Contest Management Table"
          removeWrapper
          classNames={{
            th: "text-white/40 text-[11px] font-black uppercase tracking-wider border-b border-white/[0.08] py-4",
            td: "text-white/75 border-b border-white/[0.05] py-4",
            tr: "hover:bg-white/[0.03] transition-colors",
            thead: "[&>tr]:bg-[#1E2B42]",
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn className="w-[35%]">Contest Title</TableColumn>
            <TableColumn>Rule</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Visible</TableColumn>
            <TableColumn align="center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {contests.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <span className="text-[10px] font-bold text-white/30 font-mono">
                    #{c.id.slice(0, 8)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-white tracking-tight leading-tight">{c.title}</div>
                  <div className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-tight">Public Contest</div>
                </TableCell>
                <TableCell>
                  <div
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase italic"
                    style={c.rule === "ACM"
                      ? { color: "#7B9FFF", background: "rgba(59,91,255,0.12)", borderColor: "rgba(59,91,255,0.25)" }
                      : { color: "#C084FC", background: "rgba(155,59,255,0.12)", borderColor: "rgba(155,59,255,0.25)" }
                    }
                  >
                    {c.rule}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-white/60 uppercase">{c.type}</span>
                </TableCell>
                <TableCell>
                  <div
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase"
                    style={c.status === "RUNNING"
                      ? { color: "#10B981", background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.25)" }
                      : c.status === "UPCOMING"
                      ? { color: "#F59E0B", background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.25)" }
                      : { color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }
                    }
                  >
                    {c.status}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    isSelected={c.visible}
                    onValueChange={(v) => setContests((prev) => prev.map((x) => (x.id === c.id ? { ...x, visible: v } : x)))}
                    size="sm"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <button className={iconBtnGhost} title="Edit"><Pencil size={15} /></button>
                    <button className={iconBtnGhost} title="View"><Eye size={15} /></button>
                    <button className={iconBtnGhost} title="Download"><Download size={15} /></button>
                    <button
                      className={iconBtnDanger}
                      onClick={() => setContests((prev) => prev.filter((x) => x.id !== c.id))}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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