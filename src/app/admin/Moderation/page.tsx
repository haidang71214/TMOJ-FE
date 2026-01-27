"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Chip,
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
  Select,
  SelectItem,
  Avatar,
  Tooltip,
  Card,
  CardBody,
  Textarea,
} from "@heroui/react";
import {
  Flag,
  ShieldAlert,
  Trash2,
  Ban,
  EyeOff,
  AlertTriangle,
  Users,
  Eye,
} from "lucide-react";

// Types dựa trên schema
interface Report {
  id: string;
  content_type: "comment" | "editorial" | "problem";
  content_id: string;
  content_preview: string; // snippet của nội dung bị report
  reporter_username: string;
  violation_type: "spam" | "plagiarism" | "abuse" | "other";
  description?: string;
  status: "pending" | "in_review" | "resolved";
  created_at: string;
  reporter_avatar?: string;
  target_username?: string; // người bị report (tác giả nội dung)
}


const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    content_type: "comment",
    content_id: "cmt-456",
    content_preview: "This problem is trash, admin delete it pls",
    reporter_username: "student123",
    violation_type: "abuse",
    description: "Ngôn từ xúc phạm, thiếu tôn trọng",
    status: "pending",
    created_at: "2026-01-27 15:42",
    target_username: "hainguyen",
  },
  {
    id: "r2",
    content_type: "editorial",
    content_id: "edt-789",
    content_preview: "[code copy từ GeeksforGeeks without credit]",
    reporter_username: "teacher_pro",
    violation_type: "plagiarism",
    status: "in_review",
    created_at: "2026-01-27 14:10",
    target_username: "user_fake",
  },
  {
    id: "r3",
    content_type: "comment",
    content_id: "cmt-101",
    content_preview: "Spam link: http://bit.ly/free-money",
    reporter_username: "admin_mod",
    violation_type: "spam",
    status: "resolved",
    created_at: "2026-01-26 09:30",
    target_username: "spam_bot_01",
  },
];

export default function ModerationManagementPage() {
  const [reports] = useState<Report[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const handleTakeAction = (action: "warn" | "delete" | "block" | "hide") => {
    // Logic gọi API thực tế ở đây
    alert(`Thực hiện hành động: ${action} cho report #${selectedReport?.id}`);
    setActionModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase">
            Moderation & <span className="text-[#FF5C00]">Reports</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Manage reported content, flags, queue & moderation actions
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="bordered" startContent={<Users size={16} />}>
            Banned Users
          </Button>
          <Button className="bg-[#0B1C3D] text-white font-black" startContent={<Flag size={16} />}>
            View Queue
          </Button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-amber-500/10 to-red-500/10">
          <CardBody className="text-center">
            <div className="text-4xl font-black text-amber-600 dark:text-amber-400">47</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
              <AlertTriangle size={14} /> Pending Reports
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-red-600">12</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">In Review</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-emerald-600">189</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">Resolved This Week</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-purple-600">8</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
              <Ban size={14} /> Active Bans
            </div>
          </CardBody>
        </Card>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input placeholder="Search reporter or content..." className="max-w-xs" />
        <Select placeholder="Type" className="w-36">
          <SelectItem key="all">All Types</SelectItem>
          <SelectItem key="comment">Comment</SelectItem>
          <SelectItem key="editorial">Editorial</SelectItem>
          <SelectItem key="problem">Problem</SelectItem>
        </Select>
        <Select placeholder="Status" className="w-36">
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="in_review">In Review</SelectItem>
          <SelectItem key="resolved">Resolved</SelectItem>
        </Select>
        <Select placeholder="Violation" className="w-40">
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="spam">Spam</SelectItem>
          <SelectItem key="plagiarism">Plagiarism</SelectItem>
          <SelectItem key="abuse">Abuse</SelectItem>
          <SelectItem key="other">Other</SelectItem>
        </Select>
      </div>

      {/* REPORTS TABLE */}
      <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden">
        <Table aria-label="Reports" removeWrapper>
          <TableHeader>
            <TableColumn>TYPE / CONTENT</TableColumn>
            <TableColumn>REPORTER</TableColumn>
            <TableColumn>VIOLATION</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>TARGET USER</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Chip variant="flat" color="secondary" size="sm">
                      {r.content_type.toUpperCase()}
                    </Chip>
                    <div className="max-w-xs truncate text-sm text-slate-600 dark:text-slate-300">
                      {r.content_preview}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" name={r.reporter_username} />
                    <span className="font-medium">{r.reporter_username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={
                      r.violation_type === "spam" ? "warning" :
                      r.violation_type === "plagiarism" ? "danger" :
                      r.violation_type === "abuse" ? "danger" : "default"
                    }
                  >
                    {r.violation_type.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={
                      r.status === "pending" ? "warning" :
                      r.status === "in_review" ? "primary" :
                      "success"
                    }
                  >
                    {r.status.toUpperCase().replace("_", " ")}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Tooltip content="View profile">
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {r.target_username}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{r.created_at}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      onPress={() => {
                        setSelectedReport(r);
                        setActionModalOpen(true);
                      }}
                    >
                      <ShieldAlert size={16} />
                    </Button>
                    <Button isIconOnly size="sm">
                      <Eye size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL TAKE ACTION */}
      <Modal isOpen={actionModalOpen} onOpenChange={setActionModalOpen} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-black uppercase">
                Moderate Report <span className="text-[#FF5C00]">#{selectedReport?.id}</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl">
                  <div className="font-medium mb-2">Reported Content:</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {selectedReport?.content_preview}
                  </p>
                </div>

                <div>
                  <div className="font-black uppercase text-sm tracking-widest mb-3">
                    Choose Action
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="flat"
                      startContent={<AlertTriangle size={18} />}
                      className="justify-start text-amber-600 dark:text-amber-400"
                      onPress={() => handleTakeAction("warn")}
                    >
                      Warn User
                    </Button>
                    <Button
                      variant="flat"
                      startContent={<Trash2 size={18} />}
                      className="justify-start text-red-600 dark:text-red-400"
                      onPress={() => handleTakeAction("delete")}
                    >
                      Delete Content
                    </Button>
                    <Button
                      variant="flat"
                      startContent={<Ban size={18} />}
                      className="justify-start text-purple-600 dark:text-purple-400"
                      onPress={() => handleTakeAction("block")}
                    >
                      Block User
                    </Button>
                    <Button
                      variant="flat"
                      startContent={<EyeOff size={18} />}
                      className="justify-start text-slate-600 dark:text-slate-400"
                      onPress={() => handleTakeAction("hide")}
                    >
                      Hide Content
                    </Button>
                  </div>
                </div>

                <Textarea
                  label="Moderator Note (internal)"
                  placeholder="Ghi chú lý do xử lý (chỉ admin thấy)..."
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={onClose}>
                  Confirm Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}