"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Upload,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { 
  useGetClassDetailQuery,
  useDeleteSlotProblemsMutation,
  useExportStudentsImportTemplateMutation,
  useImportStudentsMutation,
  useExportStudentsClassSemesterMutation 
} from "@/store/queries/Class";
import { useGetClassSlotsQuery, usePublishClassSlotMutation } from "@/store/queries/ClassSlot";
import { ClassSlotResponse } from "@/types";
import { useModal } from "@/Provider/ModalProvider";

import CreateSlotForm from "@/app/Management/Class/CreateClassSlotModal";
import AddStudentModal from "@/app/Management/Class/[id]/Member/AddStudentToCLass";
import UpdateDueDateModal from "@/app/Management/Class/[id]/UpdateDuaDateModal";
import UpdateProblemIntoSlot from "@/Provider/UpdateProblemIntoSlot";
import AddProblemToSlotForm from "@/Provider/ImportProblemForm";
import ClassMembersPage from "@/app/Management/Class/[id]/Member/ClassMembersPage";
import SlotScoresTable from "@/app/Management/ClassSemester/[id]/SlotScoresTable";

type Props = {
  id: string;
  nameClass:string|undefined;
  semesterCode:string|undefined;
  onBack?: () => void;
};

export default function ClassSemesterDetail({ id, onBack,nameClass,semesterCode }: Props) {
  const router = useRouter();
  const classId = id;

  const [publishSlot] = usePublishClassSlotMutation();
  const [deleteProblems] = useDeleteSlotProblemsMutation();

  const [exportTemplate, { isLoading: isExportingTemplate }] = useExportStudentsImportTemplateMutation();
  const [importStudents, { isLoading: isImportingStudents }] = useImportStudentsMutation();
  const [exportStudents, { isLoading: isExportingStudents }] = useExportStudentsClassSemesterMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [slotPage, setSlotPage] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const { openModal } = useModal();
  const rowsPerPage = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: classData } = useGetClassDetailQuery({ id: classId });
  const { data: slotData, isLoading: slotLoading } = useGetClassSlotsQuery(classId);

  const slots = slotData?.data ?? [];
  console.log(classData);
  const openCreateSlotModal = () => {
    openModal({
      content: <CreateSlotForm classId={classId} />,
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
        title: "Problem removed successfully",
        color: "success",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Problem removed failed",
        color: "danger",
      });
    }
  };

  const handleExportTemplate = async () => {
    try {
      const blob = await exportTemplate({ classSemesterId: classId }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Template_${nameClass}_${semesterCode}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast({ title: "Template exported", color: "success" });
    } catch {
      addToast({ title: "Export failed", color: "danger" });
    }
  };

  const handleExportList = async () => {
    try {
      const blob = await exportStudents({ classSemesterId: classId }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Students_${nameClass}_${semesterCode}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast({ title: "Exported successfully", color: "success" });
    } catch {
      addToast({ title: "Export failed", color: "danger" });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await importStudents({ classSemesterId: classId, data: formData }).unwrap();
      addToast({
        title: "Import Success",
        description: `Processed: ${res?.totalProcessed || 0}, Success: ${res?.successCount || 0}, Failed: ${res?.failedCount || 0}`,
        color: "success"
      });
    } catch {
      addToast({ title: "Import Failed", color: "danger" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 text-[#071739] dark:text-white max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="flex flex-col gap-6">
          {onBack && (
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={onBack}
            >
              ←
            </Button>
          )}

          <div className="space-y-2">
            <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter leading-none">
              {nameClass}-{semesterCode}
            </h2>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap" style={{ marginTop: 60 }}>
          <Button
            startContent={<Download size={14} strokeWidth={2.5} />}
            size="md"
            color="success"
            variant="flat"
            onPress={handleExportTemplate}
            isLoading={isExportingTemplate}
            className="font-bold h-9 px-4 rounded-lg shadow-sm text-[11px] uppercase tracking-wide transition-all text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100"
          >
            TEMPLATE
          </Button>
          <Button
            startContent={<Download size={14} strokeWidth={2.5} />}
            size="md"
            color="success"
            variant="flat"
            isLoading={isExportingStudents}
            onPress={handleExportList}
            className="font-bold h-9 px-4 rounded-lg shadow-sm text-[11px] uppercase tracking-wide transition-all text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100"
          >
            EXPORT LIST
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .xls, .csv" 
            hidden 
          />
          <Button
            startContent={<Upload size={14} strokeWidth={2.5} />}
            size="md"
            color="success"
            variant="flat"
            isLoading={isImportingStudents}
            onPress={() => fileInputRef.current?.click()}
            className="font-bold h-9 px-4 rounded-lg shadow-sm text-[11px] uppercase tracking-wide transition-all text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100"
          >
            IMPORT LIST
          </Button>
          
          <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 mx-2"></div>

          <Button
            startContent={<Plus size={16} strokeWidth={2.5} />}
            size="md"
            color="warning"
            onPress={() => openModal({ content: <AddStudentModal classId={classId} /> })}
            className="text-white font-bold h-9 px-4 rounded-lg shadow-sm uppercase text-[11px] tracking-wide transition-all active:scale-95"
          >
            ADD STUDENT
          </Button>

          <Button
            startContent={<Plus size={16} strokeWidth={2.5} />}
            size="md"
            className="bg-[#FF5C00] hover:bg-orange-600 text-white font-bold h-9 px-4 rounded-lg shadow-sm uppercase text-[11px] tracking-wide transition-all active:scale-95"
            onPress={openCreateSlotModal}
          >
            NEW SLOT
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
                        <Tabs 
                          variant="underlined" 
                          classNames={{ 
                            tabList: "mt-4 gap-6",
                            tab: "font-bold uppercase tracking-widest text-[11px]",
                            cursor: "bg-blue-600 dark:bg-blue-400"
                          }}
                        >
                          <Tab key="problems" title="Assigned Problems">
                            <div className="mt-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-[11px] font-[1000] uppercase italic text-blue-600">
                              <Code2 size={14} />
                              ASSIGNED PROBLEMS
                            </div>

                            <div className="flex items-center gap-2">
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
                                EDIT ALL
                              </Button>

                              <Button
                                size="sm"
                                variant="flat"
                                className="text-xs font-bold bg-orange-500 text-white hover:bg-orange-600"
                                onPress={() => openAddProblemModal(slot.id)}
                              >
                                ADD MORE PROBLEM
                              </Button>
                            </div>
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
                            <TableBody emptyContent="No problems exist in this slot">
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
                                        onPress={() => handleDeleteProblem(slot.id, p.problemId)}
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
                          </Tab>
                          <Tab key="scores" title="Student Scores & Results">
                            <SlotScoresTable classId={classId} slot={slot} />
                          </Tab>
                        </Tabs>
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
          <ClassMembersPage classId={classId} />
        </Tab>
      </Tabs>
    </div>
  );
}