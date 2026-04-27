"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
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
  useDisclosure,
  Chip,
  Switch,
  Spinner,
} from "@heroui/react";
import { Megaphone, Plus, Trash2, Pin, Calendar } from "lucide-react";
import {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "@/store/queries/announcement";
import { addToast } from "@heroui/toast";

export default function AnnouncementManagementPage() {
  const { data: announcements, isLoading } = useGetAnnouncementsQuery();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [durationHours, setDurationHours] = useState("24");

  const handleCreate = async () => {
    if (!title || !content) {
      addToast({ title: "Vui lòng nhập đầy đủ tiêu đề và nội dung", color: "warning" });
      return;
    }

    try {
      await createAnnouncement({
        title: title.trim(),
        content: content.trim(),
        pinned,
        durationHours: Number(durationHours),
        scopeType: "system",
        scopeId: null,
      }).unwrap();
      addToast({ title: "Đã đăng thông báo mới!", color: "success" });
      onClose();
      setTitle("");
      setContent("");
      setPinned(false);
      setDurationHours("24");
    } catch (error) {
      addToast({ title: "Lỗi khi đăng thông báo", color: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    try {
      await deleteAnnouncement(id).unwrap();
      addToast({ title: "Đã xóa thông báo", color: "success" });
    } catch (error) {
      addToast({ title: "Lỗi khi xóa thông báo", color: "danger" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Announcements<span className="text-[#ff5c00]">.</span>
          </h1>
          <p className="text-xs text-white/50 uppercase font-bold italic">
            Manage Public News Feed & Header Marquee
          </p>
        </div>
        <Button
          color="warning"
          variant="shadow"
          startContent={<Plus size={18} />}
          onPress={onOpen}
          className="font-black uppercase italic"
        >
          Create Announcement
        </Button>
      </div>

      <Card className="bg-[#121926] border border-white/5 shadow-2xl rounded-3xl overflow-hidden">
        <CardBody className="p-0">
          <Table
            aria-label="Announcement Management Table"
            className="dark"
            classNames={{
              wrapper: "bg-transparent shadow-none p-0",
              th: "bg-[#1A2333] text-white/50 font-black uppercase italic text-[10px] py-4 px-6 border-none",
              td: "py-4 px-6 text-white font-medium text-sm border-b border-white/5",
            }}
          >
            <TableHeader>
              <TableColumn>TITLE & CONTENT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>CREATED AT</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              loadingContent={<Spinner color="warning" />}
              emptyContent={<div className="py-20 text-white/20 font-black uppercase italic">No announcements found</div>}
            >
              {(announcements || []).map((item) => (
                <TableRow key={item.announcementId}>
                  <TableCell>
                    <div className="flex flex-col gap-1 max-w-[400px]">
                      <span className="font-bold text-white uppercase italic text-xs tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-white/40 text-[11px] line-clamp-2">
                        {item.content}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.pinned ? (
                      <Chip
                        startContent={<Pin size={12} />}
                        variant="flat"
                        color="warning"
                        className="font-black uppercase italic text-[10px] h-6"
                      >
                        Pinned
                      </Chip>
                    ) : (
                      <Chip
                        variant="flat"
                        className="font-black uppercase italic text-[10px] h-6 bg-white/5 text-white/30"
                      >
                        Normal
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase italic">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => handleDelete(item.announcementId)}
                        className="rounded-xl bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        classNames={{
          base: "bg-[#121926] border border-white/10 rounded-[2.5rem] shadow-2xl",
          header: "border-b border-white/5 p-8",
          body: "p-8",
          footer: "border-t border-white/5 p-6",
        }}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-white leading-none">
              New Announcement<span className="text-[#ff5c00]">.</span>
            </h2>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">
              Broadcast Message to All Users
            </p>
          </ModalHeader>
          <ModalBody className="gap-6">
            <Input
              label="Title"
              placeholder="e.g. System Maintenance"
              value={title}
              onValueChange={setTitle}
              variant="bordered"
              classNames={{
                label: "font-black uppercase italic text-[10px] text-white/50",
                input: "font-bold italic text-white",
                inputWrapper: "border-white/10 focus-within:!border-[#ff5c00] rounded-2xl h-14",
              }}
            />
            <Textarea
              label="Content"
              placeholder="Enter announcement details..."
              value={content}
              onValueChange={setContent}
              variant="bordered"
              minRows={4}
              classNames={{
                label: "font-black uppercase italic text-[10px] text-white/50",
                input: "font-bold italic text-white leading-relaxed",
                inputWrapper: "border-white/10 focus-within:!border-[#ff5c00] rounded-2xl",
              }}
            />
            <Input
              label="Duration (Hours)"
              placeholder="e.g. 24"
              type="number"
              value={durationHours}
              onValueChange={setDurationHours}
              variant="bordered"
              classNames={{
                label: "font-black uppercase italic text-[10px] text-white/50",
                input: "font-bold italic text-white",
                inputWrapper: "border-white/10 focus-within:!border-[#ff5c00] rounded-2xl h-14",
              }}
              startContent={<Calendar size={18} className="text-white/20" />}
            />
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-xl bg-warning/10 text-warning">
                  <Pin size={20} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase italic text-white">Pinned Announcement</p>
                  <p className="text-[10px] text-white/40 font-bold italic">Always show at the beginning of the news feed</p>
                </div>
              </div>
              <Switch
                color="warning"
                isSelected={pinned}
                onValueChange={setPinned}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={onClose}
              className="font-black uppercase italic text-[10px] h-12 px-8 rounded-2xl dark:text-white"
            >
              Cancel
            </Button>
            <Button
              color="warning"
              variant="shadow"
              onPress={handleCreate}
              className="font-black uppercase italic text-[10px] h-12 px-10 rounded-2xl"
            >
              Publish Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
