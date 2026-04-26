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
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Send,
  Trash2,
  Eye,
  AlertTriangle,
  BookOpen,
  Settings2,
  Lock,
} from "lucide-react";
import { useCreateNotificationMutation, useGetAllNotificationsQuery, useDeleteNotificationMutation } from "@/store/queries/notification";
import { addToast } from "@heroui/toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function NotificationManagementPage() {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const { data: notificationsData, isLoading } = useGetAllNotificationsQuery();
  const [createNotification] = useCreateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData || [];

  const admin = useSelector((state: RootState) => state.auth.user);

  // Form state cho modal send
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"system" | "comment" | "report">("system");
  const [sendToAll, setSendToAll] = useState(true);
  const [targetUserId, setTargetUserId] = useState("");

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      addToast({ title: "Vui lòng nhập đầy đủ tiêu đề và nội dung", color: "warning" });
      return;
    }

    if (!sendToAll && !targetUserId.trim()) {
      addToast({ title: "Vui lòng nhập User ID mục tiêu", color: "warning" });
      return;
    }

    try {
      await createNotification({
        userId: sendToAll ? "00000000-0000-0000-0000-000000000000" : targetUserId.trim(),
        title: title.trim(),
        message: message.trim(),
        type: type,
        scopeType: "discussion",
        scopeId: "00000000-0000-0000-0000-000000000000",
        createdBy: admin?.userId || "00000000-0000-0000-0000-000000000000",
      }).unwrap();

      addToast({ title: "Đã gửi thông báo thành công!", color: "success" });
      setIsSendModalOpen(false);
      setTitle("");
      setMessage("");
      setTargetUserId("");
    } catch (error) {
      addToast({ title: "Lỗi khi gửi thông báo", color: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    try {
      await deleteNotification(id).unwrap();
      addToast({ title: "Đã xóa thông báo", color: "success" });
    } catch (error) {
      addToast({ title: "Lỗi khi xóa thông báo", color: "danger" });
    }
  };

  const renderReceivedBody = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Spinner color="primary" />
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="text-center py-10 text-slate-500 font-bold uppercase italic opacity-50">
          No system alerts received yet
        </div>
      );
    }

    return notifications.map((n) => (
      <div
        key={n.notificationId}
        className={`p-5 rounded-xl border transition ${n.isRead
          ? "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10"
          : "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 shadow-sm"
          }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-black text-lg flex items-center gap-2 text-black dark:text-white">
                {n.title}
                {n.type === "report" && <AlertTriangle size={18} className="text-red-500" />}
              </div>
              <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 italic">{n.message}</p>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase italic">
                Type: <span className="text-indigo-500">{n.type}</span> • {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(n.notificationId)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-black dark:text-white">
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
            dark:bg-linear-to-r dark:from-cyan-400 dark:to-fuchsia-500
            dark:text-black
            font-black h-11 px-6 rounded-xl shadow-lg
            uppercase text-[10px] tracking-wider
            active:scale-95
          "
        >
          Send Broadcast
        </Button>
      </div>

      {/* TABS */}
      <Tabs
        defaultSelectedKey="received"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-8 pb-2",
          tab: "text-sm font-bold uppercase tracking-wider text-slate-400 data-[selected=true]:text-indigo-600 dark:data-[selected=true]:text-white",
          cursor: "h-0.5 rounded-full bg-indigo-600 dark:bg-cyan-400",
        }}
      >
        <Tab title="System Alerts" key="received">
          <div className="space-y-3">{renderReceivedBody()}</div>
        </Tab>

        <Tab title="Configuration" key="config">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4 text-black dark:text-white">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="text-indigo-600" />
                <h3 className="font-black text-lg uppercase italic">Global Settings</h3>
              </div>
              <p className="text-xs text-slate-500 italic">Toggle global system notification behavior</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border border-slate-100 dark:border-white/5 rounded-xl">
                  <span className="font-bold text-sm uppercase">Email Notifications</span>
                  <Switch defaultSelected />
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-100 dark:border-white/5 rounded-xl">
                  <span className="font-bold text-sm uppercase">Push Notifications</span>
                  <Switch defaultSelected />
                </div>
              </div>
            </div>
          </div>
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

                <Select
                  label="Notification Type"
                  placeholder="Select type"
                  defaultSelectedKeys={["system"]}
                  selectedKeys={[type]}
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0] as "system" | "comment" | "report";
                    if (selectedValue) setType(selectedValue);
                  }}
                  classNames={{
                    trigger: "rounded-xl border-2 focus-within:border-indigo-600",
                  }}
                >
                  <SelectItem key="system" textValue="system">System Announcement</SelectItem>
                  <SelectItem key="comment" textValue="comment">Comment Notification</SelectItem>
                  <SelectItem key="report" textValue="report">Report Alert</SelectItem>
                </Select>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm uppercase">Send to all users</span>
                    <Switch
                      isSelected={sendToAll}
                      onValueChange={setSendToAll}
                      classNames={{ wrapper: "group-data-[selected=true]:bg-indigo-600" }}
                    />
                  </div>

                  {!sendToAll && (
                    <Input
                      label="Target User ID"
                      placeholder="GUID of the user"
                      value={targetUserId}
                      onValueChange={setTargetUserId}
                      classNames={{
                        inputWrapper: "rounded-xl border-2 focus-within:border-indigo-600",
                      }}
                    />
                  )}
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
                  isDisabled={!title.trim() || !message.trim() || (!sendToAll && !targetUserId.trim())}
                >
                  Send Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
