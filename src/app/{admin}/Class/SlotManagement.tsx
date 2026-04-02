"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Spinner,
  Tooltip,
  Input,
} from "@heroui/react";
import { toast } from "sonner";
import { useModal } from "@/Provider/ModalProvider";
import {
  useGetClassSlotsQuery,
  useUpdateClassSlotMutation,
  usePublishClassSlotMutation,
  useSetSlotDueDateMutation,
} from "@/store/queries/ClassSlot";
import { ClassSlotResponse, ErrorForm } from "@/types";
import CreateSlotForm from "@/app/Management/Class/CreateClassSlotModal";

// ── Edit Slot Modal ──
function EditSlotModal({
  classId,
  slot,
  onSuccess,
}: {
  classId: string;
  slot: ClassSlotResponse;
  onSuccess: () => void;
}) {
  const { closeModal } = useModal();
  const [updateSlot, { isLoading }] = useUpdateClassSlotMutation();

  const [title, setTitle] = useState(slot.title);
  const [description, setDescription] = useState(slot.description ?? "");

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      await updateSlot({
        classId,
        slotId: slot.id,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      }).unwrap();
      toast.success("Slot updated!");
      onSuccess();
      closeModal();
    } catch (err) {
      const apiError = err as ErrorForm;
      toast.error(apiError?.data?.data?.message || "Failed to update slot");
    }
  };

  return (
    <div className="w-[460px] bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-200 dark:border-indigo-500/20 shadow-2xl dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-600/10 dark:to-purple-600/5 border-b border-indigo-100 dark:border-indigo-500/15">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Slot #{slot.slotNo}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Update slot title and description
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onValueChange={setTitle}
          variant="bordered"
          placeholder="Slot title"
          classNames={{
            inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
          }}
        />
        <Input
          label="Description (optional)"
          value={description}
          onValueChange={setDescription}
          variant="bordered"
          placeholder="Brief description..."
          classNames={{
            inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50 focus-within:!border-indigo-500 transition-colors",
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex justify-end gap-3 bg-gray-50 dark:bg-[#0b1120] border-t border-gray-200 dark:border-indigo-500/10">
        <Button
          variant="flat"
          onPress={closeModal}
          className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600 font-medium"
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          onPress={handleSave}
          className="font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ── Set Due Date Modal ──
function SetDueDateModal({
  classId,
  slot,
  onSuccess,
}: {
  classId: string;
  slot: ClassSlotResponse;
  onSuccess: () => void;
}) {
  const { closeModal } = useModal();
  const [setDueDate, { isLoading }] = useSetSlotDueDateMutation();

  const [dueDateValue, setDueDateValue] = useState(
    slot.dueAt ? new Date(slot.dueAt).toISOString().slice(0, 16) : ""
  );
  const [closeDateValue, setCloseDateValue] = useState(
    slot.closeAt ? new Date(slot.closeAt).toISOString().slice(0, 16) : ""
  );

  const handleSave = async () => {
    if (!dueDateValue) {
      toast.error("Due date is required");
      return;
    }
    try {
      await setDueDate({
        classId,
        slotId: slot.id,
        data: {
          dueAt: new Date(dueDateValue).toISOString(),
          closeAt: closeDateValue
            ? new Date(closeDateValue).toISOString()
            : undefined,
        },
      }).unwrap();
      toast.success("Due date updated!");
      onSuccess();
      closeModal();
    } catch (err) {
      const apiError = err as ErrorForm;
      toast.error(apiError?.data?.data?.message || "Failed to set due date");
    }
  };

  return (
    <div className="w-[460px] bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-200 dark:border-indigo-500/20 shadow-2xl dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-600/10 dark:to-indigo-600/5 border-b border-blue-100 dark:border-blue-500/15">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 4px 15px rgba(59,130,246,0.35)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Set Due Date — Slot #{slot.slotNo}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Configure deadline and close time
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Due At <span className="text-red-500">*</span>
          </label>
          <Input
            type="datetime-local"
            value={dueDateValue}
            onValueChange={setDueDateValue}
            variant="bordered"
            classNames={{
              inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400/50 focus-within:!border-blue-500 transition-colors",
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Close At <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <Input
            type="datetime-local"
            value={closeDateValue}
            onValueChange={setCloseDateValue}
            variant="bordered"
            classNames={{
              inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400/50 focus-within:!border-blue-500 transition-colors",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex justify-end gap-3 bg-gray-50 dark:bg-[#0b1120] border-t border-gray-200 dark:border-indigo-500/10">
        <Button
          variant="flat"
          onPress={closeModal}
          className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600 font-medium"
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          onPress={handleSave}
          className="font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
          }}
        >
          Save Due Date
        </Button>
      </div>
    </div>
  );
}

// ── Main SlotManagement Component ──
interface SlotManagementProps {
  classId: string;
  className?: string;
  onBack?: () => void;
}

export default function SlotManagement({
  classId,
  className,
  onBack,
}: SlotManagementProps) {
  const { openModal } = useModal();

  const { data, isLoading, refetch } = useGetClassSlotsQuery(classId);
  const slots: ClassSlotResponse[] = data?.data ?? [];

  const [publishSlot, { isLoading: isPublishing }] =
    usePublishClassSlotMutation();
  const [updateSlot] = useUpdateClassSlotMutation();

  const handlePublishToggle = async (slot: ClassSlotResponse) => {
    try {
      if (!slot.isPublished) {
        await publishSlot({ classId, slotId: slot.id }).unwrap();
        toast.success(`Slot #${slot.slotNo} published!`);
      } else {
        await updateSlot({
          classId,
          slotId: slot.id,
          data: { isPublished: false },
        }).unwrap();
        toast.success(`Slot #${slot.slotNo} unpublished`);
      }
      refetch();
    } catch (err) {
      const apiError = err as ErrorForm;
      toast.error(
        apiError?.data?.data?.message || "Failed to toggle publish status"
      );
    }
  };

  const openEditSlotModal = (slot: ClassSlotResponse) => {
    openModal({
      content: (
        <EditSlotModal classId={classId} slot={slot} onSuccess={refetch} />
      ),
    });
  };

  const openDueDateModal = (slot: ClassSlotResponse) => {
    openModal({
      content: (
        <SetDueDateModal classId={classId} slot={slot} onSuccess={refetch} />
      ),
    });
  };

  const openCreateSlot = () => {
    openModal({
      content: <CreateSlotForm classId={classId} />,
    });
  };

  const formatDate = (d?: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-slate-400 min-w-8 w-8 h-8 transition-colors"
              onPress={onBack}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Slot Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {className
                ? `Manage slots for "${className}"`
                : "Manage class slots, schedule and problems"}
            </p>
          </div>
        </div>

        <Button
          className="font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow:
              "0 4px 15px rgba(99, 102, 241, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
          startContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          }
          onPress={openCreateSlot}
        >
          Add Slot
        </Button>
      </div>

      {/* ── Body ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Spinner size="lg" color="secondary" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading slots...
          </p>
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-3xl">
            📭
          </div>
          <p className="text-gray-400 dark:text-slate-500 text-sm font-medium">
            No slots found for this class yet.
          </p>
          <Button
            size="sm"
            className="font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            }}
            onPress={openCreateSlot}
          >
            Create First Slot
          </Button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div
              className="rounded-xl px-5 py-4 border border-indigo-200 dark:border-indigo-500/15"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04))",
              }}
            >
              <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                Total Slots
              </p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                {slots.length}
              </p>
            </div>
            <div
              className="rounded-xl px-5 py-4 border border-emerald-200 dark:border-emerald-500/15"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.04))",
              }}
            >
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Published
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {slots.filter((s) => s.isPublished).length}
              </p>
            </div>
            <div
              className="rounded-xl px-5 py-4 border border-amber-200 dark:border-amber-500/15"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(251, 191, 36, 0.04))",
              }}
            >
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Drafts
              </p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {slots.filter((s) => !s.isPublished).length}
              </p>
            </div>
          </div>

          {/* Slots table */}
          <div
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <Table
              aria-label="Slots table"
              removeWrapper
              classNames={{
                th: "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-white/5 py-3",
                td: "py-3 text-sm border-b border-gray-100 dark:border-white/[0.03]",
                tr: "hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors",
              }}
            >
              <TableHeader>
                <TableColumn>No</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Mode</TableColumn>
                <TableColumn align="center">Problems</TableColumn>
                <TableColumn align="center">Status</TableColumn>
                <TableColumn>Due At</TableColumn>
                <TableColumn align="center">Actions</TableColumn>
              </TableHeader>

              <TableBody items={slots}>
                {(slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>
                      <span
                        className="font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md text-xs"
                        style={{
                          background: "rgba(99, 102, 241, 0.1)",
                          border: "1px solid rgba(99, 102, 241, 0.2)",
                        }}
                      >
                        #{slot.slotNo}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {slot.title}
                        </span>
                        {slot.description && (
                          <span className="text-[11px] text-gray-400 dark:text-slate-500 line-clamp-1">
                            {slot.description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        classNames={{
                          base:
                            slot.mode === "contest"
                              ? "bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20"
                              : "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20",
                          content:
                            slot.mode === "contest"
                              ? "text-purple-600 dark:text-purple-400 text-xs font-semibold"
                              : "text-blue-600 dark:text-blue-400 text-xs font-semibold",
                        }}
                      >
                        {slot.mode === "contest" ? "Contest" : "Problem Set"}
                      </Chip>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
                          {slot.problems?.length ?? 0}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        {slot.isPublished ? (
                          <Chip
                            size="sm"
                            variant="flat"
                            classNames={{
                              base: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20",
                              content:
                                "text-emerald-600 dark:text-emerald-400 text-xs font-bold",
                            }}
                            startContent={
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1 animate-pulse" />
                            }
                          >
                            Published
                          </Chip>
                        ) : (
                          <Chip
                            size="sm"
                            variant="flat"
                            classNames={{
                              base: "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20",
                              content:
                                "text-amber-600 dark:text-amber-400 text-xs font-bold",
                            }}
                          >
                            Draft
                          </Chip>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-gray-600 dark:text-slate-400">
                        {formatDate(slot.dueAt)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center gap-1">
                        {/* Edit */}
                        <Tooltip content="Edit Slot" placement="top">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-gray-100 dark:bg-white/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 min-w-7 w-7 h-7 transition-colors"
                            onPress={() => openEditSlotModal(slot)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Button>
                        </Tooltip>

                        {/* Set Due Date */}
                        <Tooltip content="Set Due Date" placement="top">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-gray-100 dark:bg-white/5 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 min-w-7 w-7 h-7 transition-colors"
                            onPress={() => openDueDateModal(slot)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                          </Button>
                        </Tooltip>

                        {/* Publish/Unpublish */}
                        <Tooltip
                          content={slot.isPublished ? "Unpublish" : "Publish"}
                          placement="top"
                        >
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            isLoading={isPublishing}
                            className={
                              slot.isPublished
                                ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 min-w-7 w-7 h-7 transition-colors"
                                : "bg-gray-100 dark:bg-white/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 min-w-7 w-7 h-7 transition-colors"
                            }
                            onPress={() => handlePublishToggle(slot)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
