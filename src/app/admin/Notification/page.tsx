"use client";

import React, { useState } from "react";
import {
  Button,
  Chip,
  Tabs,
  Tab,
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
  Switch,

  Input,
} from "@heroui/react";
import {
  Send,
  Trash2,
    Badge,
  Eye,
  AlertTriangle,
} from "lucide-react";

// Mock data giống hệt bảng bạn paste
const MOCK_SENT_NOTIFICATIONS = [
  {
    id: "n1",
    title: "System Maintenance Scheduled",
    type: "SYSTEM",
    target: "All Users",
    sentAt: "2026-01-27 16:45",
    readCount: 1247,
  },
  {
    id: "n2",
    title: "New Contest Starting Soon",
    type: "CONTEST",
    target: "All Users",
    sentAt: "2026-01-27 14:30",
    readCount: 856,
  },
];

const MOCK_RECEIVED_NOTIFICATIONS = [
  {
    id: "r1",
    title: "Critical: Database Backup Completed",
    message: "Full system backup successful at 04:00 AM today.",
    type: "system",
    from: "System",
    receivedAt: "2026-01-27 04:15",
    isRead: true,
  },
  {
    id: "r2",
    title: "Security Alert: Unusual Login Detected",
    message: "Login from new device in Hanoi. If not you, change password immediately.",
    type: "security",
    from: "System",
    receivedAt: "2026-01-26 22:10",
    isRead: false,
  },
];

export default function NotificationManagementPage() {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  // Form state cho modal send
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [pinAnnouncement, setPinAnnouncement] = useState(false);

  const handleSendNotification = () => {
    if (!title.trim() || !message.trim()) {
      alert("Please enter both title and message");
      return;
    }

    alert(`Broadcast sent:\nTitle: ${title}\nMessage: ${message}`);
    
    // Reset form
    setTitle("");
    setMessage("");
    setSendToAll(true);
    setPinAnnouncement(false);
    setIsSendModalOpen(false);
  };

  // Render body cho tab Sent Notifications (tránh lỗi type Element[])
  const renderSentBody = () => {
    if (MOCK_SENT_NOTIFICATIONS.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-10 text-slate-500">
            No notifications have been sent yet
          </TableCell>
        </TableRow>
      );
    }

    return MOCK_SENT_NOTIFICATIONS.map((n) => (
      <TableRow key={n.id}>
        <TableCell className="font-medium">{n.title}</TableCell>
        <TableCell>
          <Chip
            variant="flat"
            size="sm"
            className={`
              font-black uppercase text-[9px] px-4
              ${n.type === "SYSTEM" ? "bg-purple-500/15 text-purple-400" : "bg-teal-500/15 text-teal-400"}
            `}
          >
            {n.type}
          </Chip>
        </TableCell>
        <TableCell>{n.target}</TableCell>
        <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
          {n.sentAt}
        </TableCell>
        <TableCell>{n.readCount.toLocaleString()}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button isIconOnly size="sm" variant="flat">
              <Eye size={16} />
            </Button>
            <Button isIconOnly size="sm" color="danger" variant="flat">
              <Trash2 size={16} />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  // Render body cho tab Received Alerts
  const renderReceivedBody = () => {
    if (MOCK_RECEIVED_NOTIFICATIONS.length === 0) {
      return (
        <div className="text-center py-10 text-slate-500">
          No system alerts received yet
        </div>
      );
    }

    return MOCK_RECEIVED_NOTIFICATIONS.map((n) => (
      <div
        key={n.id}
        className={`p-5 rounded-xl border transition ${
          n.isRead
            ? "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10"
            : "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {!n.isRead && <Badge color="danger" />}
            <div>
              <div className="font-black text-lg flex items-center gap-2">
                {n.title}
                {n.type === "security" && <AlertTriangle size={18} className="text-red-500" />}
              </div>
              <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{n.message}</p>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                From: <span className="font-medium">{n.from}</span> • {n.receivedAt}
              </div>
            </div>
          </div>
          <Button isIconOnly size="sm" variant="light">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            <span className="text-indigo-700 dark:text-cyan-400">Notification</span>{" "}
            <span className="text-fuchsia-500">Management</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-2 italic text-slate-500 dark:text-indigo-400">
            Send system-wide announcements & view important system alerts
          </p>
        </div>

        <Button
          startContent={<Send size={18} />}
          onPress={() => setIsSendModalOpen(true)}
          className="
            bg-indigo-600 text-white
            dark:bg-gradient-to-r dark:from-cyan-400 dark:to-fuchsia-500
            dark:text-black
            font-black h-11 px-6 rounded-xl shadow-lg
            uppercase text-[10px] tracking-wider
            active:scale-95
          "
        >
          Send Broadcast
        </Button>
      </div>

      {/* TABS - Mở mặc định tab Sent Notifications */}
      <Tabs
        defaultSelectedKey="sent" // <-- Đảm bảo tab Sent mở ngay từ đầu
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-8 border-b border-slate-200 dark:border-white/10 pb-2",
          tab: "text-lg font-black uppercase tracking-wide",
          cursor: "bg-indigo-600 h-1",
        }}
      >
        <Tab title="Sent Notifications">
          <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden">
            <Table removeWrapper aria-label="Sent Notifications">
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>TARGET</TableColumn>
                <TableColumn>SENT AT</TableColumn>
                <TableColumn>READ BY</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>{renderSentBody()}</TableBody>
            </Table>
          </div>
        </Tab>

        <Tab title="Received Alerts">
          <div className="space-y-4">{renderReceivedBody()}</div>
        </Tab>
      </Tabs>

      {/* MODAL SEND BROADCAST */}
      <Modal
        isOpen={isSendModalOpen}
        onOpenChange={setIsSendModalOpen}
        size="lg"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-black uppercase">
                Send System-Wide <span className="text-fuchsia-500">Broadcast</span>
              </ModalHeader>
              <ModalBody className="space-y-6 py-6">
                <Input
                  label="Title"
                  placeholder="e.g. Important: Maintenance Tonight"
                  value={title}
                  onValueChange={setTitle}
                  classNames={{
                    inputWrapper: "rounded-xl h-12 border-2 focus-within:border-indigo-600",
                  }}
                  isRequired
                />

                <Textarea
                  label="Message"
                  placeholder="Detailed announcement or alert content..."
                  minRows={5}
                  value={message}
                  onValueChange={setMessage}
                  classNames={{
                    inputWrapper: "rounded-xl border-2 focus-within:border-indigo-600",
                  }}
                  isRequired
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Send to all users</span>
                    <Switch
                      isSelected={sendToAll}
                      onValueChange={setSendToAll}
                      classNames={{ wrapper: "group-data-[selected=true]:bg-indigo-600" }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Pin as important announcement</span>
                    <Switch
                      isSelected={pinAnnouncement}
                      onValueChange={setPinAnnouncement}
                      classNames={{ wrapper: "group-data-[selected=true]:bg-fuchsia-500" }}
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                  This will appear in every user notification center immediately.
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-slate-200 dark:border-white/10 pt-4">
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 text-white font-black"
                  startContent={<Send size={18} />}
                  onPress={handleSendNotification}
                  isDisabled={!title.trim() || !message.trim()}
                >
                  Send Now
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
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}