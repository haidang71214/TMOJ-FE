"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  Pagination,
  Spinner,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  addToast,
} from "@heroui/react";

import {
  ChevronLeft,
  Pencil,
  ChevronDown,
  Code2,
  Eye,
  EyeOff,
  BadgeCheck,
  Hourglass,
  Plus,
  Download,
  Trash2,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetClassSlotsQuery, usePublishClassSlotMutation } from "@/store/queries/ClassSlot";
import { useDeleteSlotProblemsMutation } from "@/store/queries/Class";
import { ClassSlotResponse } from "@/types";
import { useModal } from "@/Provider/ModalProvider";

import AddStudentModal from "../../Class/[id]/Member/AddStudentToCLass";
import UpdateDueDateModal from "../../Class/[id]/UpdateDuaDateModal";
import ClassMembersPage from "../../Class/[id]/Member/ClassMembersPage";
import CreateSlotForma from "../../Class/CreateSlotForClassSession";
import AddProblemToSlotForm from "../../../../Provider/ImportProblemForm";
import UpdateProblemIntoSlot from "@/Provider/UpdateProblemIntoSlot";

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const classId = resolvedParams.id;

  const searchParams = useSearchParams();
  const classCode = searchParams.get("classCode") || "Unknown";
  const semesterCode = searchParams.get("semesterCode") || "";

  const [publishSlot] = usePublishClassSlotMutation();
  const [deleteProblems] = useDeleteSlotProblemsMutation();

  const [mounted, setMounted] = useState(false);
  const [slotPage, setSlotPage] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const { openModal } = useModal();
  const rowsPerPage = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: slotData, isLoading: slotLoading } = useGetClassSlotsQuery(classId);
  const slots = slotData?.data ?? [];

  const openCreateSlotModal = () => {
    openModal({
      content: <CreateSlotForma classId={classId} />,
    });
  };

  const openAddProblemModal = (slotId: string) => {
    openModal({
      content: <AddProblemToSlotForm slotId={slotId} instanceId={classId} />,
    });
  };

  const handleDeleteProblem = async (slotId: string, problemId: string) => {
    try {
      await deleteProblems({
        instanceId: classId,
        slotId,
        problemIds: [problemId],
      }).unwrap();

      addToast({
        title:"Problem removed successfully",
        color:"success"
      });
    } catch (err) {
      console.error(err);
      addToast({
        title:"Problem removed fail",
        color:"danger"
      });
    }
  };

  const handleExport = async () => {
    try {
      console.log("Export class", classId);
    } catch (error) {
      console.error("Failed to export class", error);
       addToast({
        title:"Export failed",
        color:"danger"
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 text-[#071739] dark:text-white max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="flex flex-col gap-6">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="font-black"
            startContent={<ChevronLeft size={16} />}
          >
            Back
          </Button>

          <div className="space-y-2">
            <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter leading-none">
              {classCode} - {semesterCode}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 items-center" style={{ marginTop: 60 }}>
          <Button
            startContent={<Download size={16} strokeWidth={3} />}
            size="lg"
            color="success"
            variant="flat"
            onPress={handleExport}
            className="font-black h-11 px-6 rounded-xl shadow-sm uppercase text-[10px] tracking-wider transition-all text-emerald-700"
          >
            EXPORT STUDENT LIST
          </Button>
          <Button
            startContent={<Download size={16} strokeWidth={3} />}
            size="lg"
            color="success"
            variant="flat"
            onPress={handleExport}
            className="font-black h-11 px-6 rounded-xl shadow-sm uppercase text-[10px] tracking-wider transition-all text-emerald-700"
          >
            IMPORT STUDENT LIST
          </Button>
          <Button
            startContent={<Plus size={20} strokeWidth={3} />}
            size="lg"
            color="warning"
            onPress={() => openModal({ content: <AddStudentModal classId={classId} /> })}
            className="text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
          >
            ADD STUDENT
          </Button>

          <Button
            startContent={<Plus size={20} strokeWidth={3} />}
            size="lg"
            className="bg-[#FF5C00] hover:bg-orange-600 text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
            onPress={openCreateSlotModal}
          >
            CREATE NEW SLOT
          </Button>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        variant="underlined"
        classNames={{
          cursor: "bg-[#FF5C00]",
          tab: "font-black uppercase italic text-sm h-12 mr-12",
          tabContent: "group-data-[selected=true]:text-[#FF5C00]",
        }}
      >
        <Tab key="slots" title="Class Curriculum">
          <div className="flex flex-col gap-4 mt-8">
            {slotLoading && (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            )}

            {slots
              .slice((slotPage - 1) * rowsPerPage, slotPage * rowsPerPage)
              .map((slot: ClassSlotResponse) => (
                <Card
                  key={slot.id}
                  className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-sm overflow-hidden border border-transparent hover:border-[#FF5C00]/30 transition-all"
                >
                  <CardBody className="p-0">
                    {/* Slot Header */}
                    <div
                      className="p-6 flex items-center justify-between group cursor-pointer"
                      onClick={() =>
                        setExpandedSlot(expandedSlot === slot.id ? null : slot.id)
                      }
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-slate-100 text-slate-400">
                          {slot.isPublished ? (
                            <BadgeCheck size={24} className="text-emerald-500" />
                          ) : (
                            <Hourglass size={24} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-lg uppercase italic group-hover:text-[#FF5C00] transition-colors">
                            Slot no {slot.slotNo}: {slot.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            {slot.openAt ?? "N/A"} — {slot.closeAt ?? "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          color="warning"
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() =>
                            openModal({
                              content: (
                                <UpdateDueDateModal
                                  classId={classId}
                                  slotId={slot.id}
                                  dueAt={slot.dueAt}
                                  closeAt={slot.closeAt}
                                />
                              ),
                            })
                          }
                        >
                          <Pencil size={14} />
                        </Button>

                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() => publishSlot({ classId, slotId: slot.id })}
                        >
                          {slot.isPublished ? (
                            <Eye className="text-emerald-500" size={18} />
                          ) : (
                            <EyeOff className="text-gray-400" size={18} />
                          )}
                        </Button>

                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="secondary"
                          onPress={() => openAddProblemModal(slot.id)}
                        >
                          <Code2 size={18} />
                        </Button>

                        <ChevronDown
                          size={20}
                          className={`text-slate-300 transition-transform ${
                            expandedSlot === slot.id ? "rotate-180 text-[#FF5C00]" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Problems Table */}
                    {expandedSlot === slot.id && (
                      <div className="px-10 pb-10 border-t border-divider dark:border-white/5">
                        <div className="mt-8">
                          <div className="flex justify-between items-center mb-6">
                            <p className="text-[11px] font-[1000] uppercase italic text-blue-600 flex items-center gap-2">
                              <Code2 size={14} /> ASSIGNED PROBLEMS
                            </p>

                            <Button
                              size="sm"
                              variant="flat"
                              className="text-xs font-bold bg-orange-500 text-white hover:bg-orange-600"
                              onPress={() =>
                                openModal({
                                  title: "Update Problems in Slot",
                                  content: (
                                    <UpdateProblemIntoSlot
                                      instanceId={classId}
                                      slotId={slot.id}
                                      problems={
                                        slot.problems?.map((p) => ({
                                          problemId: p.problemId,
                                          ordinal: p.ordinal ?? 0,
                                          points: p.points ?? 0,
                                          isRequired: p.isRequired ?? true,
                                          title: p.problemTitle,
                                        })) ?? []
                                      }
                                    />
                                  ),
                                })
                              }
                            >
                              EDIT ALL PROBLEMS
                            </Button>
                          </div>

                          <Table
                            aria-label={`Problems in slot ${slot.slotNo}`}
                            removeWrapper
                            classNames={{
                              base: "bg-white dark:bg-[#111c35] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-white/5",
                              th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
                              td: "py-5 font-medium text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
                            }}
                          >
                            <TableHeader>
                              <TableColumn>ORDINAL</TableColumn>
                              <TableColumn>PROBLEM TITLE</TableColumn>
                              <TableColumn>POINTS</TableColumn>
                              <TableColumn>REQUIRED</TableColumn>
                              <TableColumn className="text-right">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Chưa có bài tập nào được gán vào slot này">
                              {slot.problems?.map((p, index) => (
                                <TableRow
                                  key={p.problemId}
                                  className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                  onClick={() => router.push(`/Problems/${p.problemId}`)}
                                >
                                  <TableCell>
                                    <Chip
                                      variant="flat"
                                      size="sm"
                                      className="font-bold bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                                    >
                                      #{p.ordinal ?? index + 1}
                                    </Chip>
                                  </TableCell>

                                  <TableCell>
                                    <div className="font-semibold text-base group-hover:text-[#FF5C00] transition-colors">
                                      {p.problemTitle}
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      variant="flat"
                                      size="sm"
                                      className="font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                                    >
                                      {p.points ?? 0} pts
                                    </Chip>
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      variant="flat"
                                      size="sm"
                                      className={`font-black uppercase ${
                                        p.isRequired
                                          ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400"
                                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                      }`}
                                    >
                                      {p.isRequired ? "REQUIRED" : "OPTIONAL"}
                                    </Chip>
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex justify-end">
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        color="danger"
                                        onPress={() => {
                                          handleDeleteProblem(slot.id, p.problemId);
                                        }}
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}

            <Pagination
              total={Math.ceil(slots.length / rowsPerPage)}
              page={slotPage}
              onChange={setSlotPage}
              className="self-center mt-6"
            />
          </div>
        </Tab>

        <Tab key="members" title="Members">
          <ClassMembersPage params={params} />
        </Tab>
      </Tabs>
    </div>
  );
}