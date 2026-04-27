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
  Tooltip,
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
  Upload,
  Trash2,
  Trophy,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetClassSlotsQuery, usePublishClassSlotMutation } from "@/store/queries/ClassSlot";
import { useDeleteSlotProblemsMutation, useExportStudentsImportTemplateMutation, useImportStudentsMutation, useExportStudentsClassSemesterMutation } from "@/store/queries/Class";
import { ClassSlotResponse } from "@/types";
import { useModal } from "@/Provider/ModalProvider";
import { useTranslation } from "@/hooks/useTranslation";
import CreateSlotForma from "@/app/Management/Class/CreateSlotForClassSession";
import AddProblemToSlotForm from "@/Provider/ImportProblemForm";
import UpdateProblemIntoSlot from "@/Provider/UpdateProblemIntoSlot";
import SlotScoresTable from "@/app/Management/ClassSemester/[id]/SlotScoresTable";
import InviteCodeCard from "@/app/Management/ClassSemester/[id]/InviteCodeCard";
import AddStudentModal from "@/app/Management/Class/[id]/Member/AddStudentToCLass";
import UpdateDueDateModal from "@/app/Management/Class/[id]/UpdateDuaDateModal";
import ClassMembersPage from "@/app/Management/Class/[id]/Member/ClassMembersPage";
import CreateClassContestModal from "@/app/Management/Class/components/CreateClassContestModal";
import { useGetClassContestsQuery } from "@/store/queries/ClassContest";

export default function TeacherClassDetail({ semesterId }: { semesterId: string }) {
  const { t, language } = useTranslation();
  const router = useRouter();

  const searchParams = useSearchParams();
  const classCode = searchParams.get("classCode") || "Unknown";
  const semesterCode = searchParams.get("semesterCode") || "";

  const [publishSlot] = usePublishClassSlotMutation();
  const [deleteProblems] = useDeleteSlotProblemsMutation();
  const [exportTemplate, { isLoading: isExportingTemplate }] = useExportStudentsImportTemplateMutation();
  const [importStudents, { isLoading: isImportingStudents }] = useImportStudentsMutation();
  const [exportStudents, { isLoading: isExportingStudents }] = useExportStudentsClassSemesterMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [slotPage, setSlotPage] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const { data: contestsData, isLoading: isLoadingContests } = useGetClassContestsQuery({ classSemesterId: semesterId });
  console.log("[Contests]", contestsData);

  const { openModal, closeModal } = useModal();
  const rowsPerPage = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: slotData, isLoading: slotLoading, refetch: refetchSlots } = useGetClassSlotsQuery(semesterId, {
    skip: !mounted || !semesterId,
  });
  const slots = slotData?.data ?? [];

  const openCreateSlotModal = () => {
    openModal({
      content: <CreateSlotForma semesterId={semesterId} />,
    });
  };
// ở đây
  const openCreateContestModal = () => {
    openModal({
      size: "full",
      content: <CreateClassContestModal classSemesterId={semesterId} onCreated={() => refetchSlots()} />,
    });
  };


  const openAddProblemModal = (slotId: string) => {
    openModal({
      content: <AddProblemToSlotForm slotId={slotId} semesterId={semesterId} />,
    });
  };

  const handleDeleteProblem = async (slotId: string, problemId: string) => {
    try {
      await deleteProblems({
        semesterId: semesterId,
        slotId,
        problemIds: [problemId],
      }).unwrap();

      addToast({
        title:(t('class_semester.problem_removed_success') || "Problem removed successfully"),
        color:"success"
      });
    } catch (err) {
      console.error(err);
      addToast({
        title:(t('class_semester.problem_removed_fail') || "Problem removed fail"),
        color:"danger"
      });
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportStudents({ classSemesterId: semesterId }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Students_${classCode}_${semesterCode}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      addToast({
        title: (t('class_semester.exported_success') || "Exported successfully"),
        color: "success"
      });
    } catch (error) {
      console.error("Failed to export class", error);
       addToast({
        title:(t('class_semester.export_fail') || "Export failed"),
        color:"danger"
      });
    }
  };

  const handleExportTemplate = async () => {
    try {
      const blob = await exportTemplate({ classSemesterId: semesterId }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Student_Import_Template_${classCode}_${semesterCode}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      addToast({
        title: (t('class_semester.template_exported_success') || "Template exported successfully"),
        color: "success"
      });
    } catch (error) {
      console.error("Failed to export template:", error);
      addToast({
        title: (t('class_semester.export_template_fail') || "Failed to export template"),
        color: "danger"
      });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await importStudents({ classSemesterId: semesterId, data: formData }).unwrap();
      
      addToast({
        title: (t('class_semester.import_success') || "Import Success"),
        description: `${t('class_semester.processed') || "Processed"}: ${res?.totalProcessed || 0}, ${t('class_semester.success') || "Success"}: ${res?.successCount || 0}, ${t('class_semester.failed') || "Failed"}: ${res?.failedCount || 0}`,
        color: "success"
      });
    } catch (error) {
      console.error("Failed to import students", error);
      addToast({
        title: (t('class_semester.import_failed') || "Import Failed"),
        color: "danger"
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePublishToggle = async (slotId: string, isCurrentlyPublished: boolean) => {
    try {
      await publishSlot({ semesterId, slotId }).unwrap();
      addToast({
        title: isCurrentlyPublished 
          ? (t('class_semester.slot_hidden') || (language === 'vi' ? 'Đã ẩn bài kiểm tra' : 'Exam hidden successfully'))
          : (t('class_semester.slot_published') || (language === 'vi' ? 'Đã công bố bài kiểm tra' : 'Exam published successfully')),
        color: "success"
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: t('common.error') || (language === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred'),
        color: "danger"
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 text-[#071739] dark:text-white max-w-[1400px] mx-auto min-h-screen">
      {/* HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-b border-slate-200 dark:border-white/10 pb-8 mt-5">
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center gap-4 animate-fade-in-right">
            <Button
              isIconOnly
              variant="light"
              className="active-bump h-12 w-12 rounded-2xl shrink-0 mt-1"
              onPress={() => router.back()}
            >
              <ChevronLeft size={28} className="text-slate-600 dark:text-slate-400" />
            </Button>
            <div className="space-y-2">
              <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter leading-none shrink-0">
                {classCode} - {semesterCode}
              </h2>
            </div>
          </div>

          <div className="flex gap-2 items-center flex-wrap mt-10">
            <Button
              startContent={<Download size={14} strokeWidth={2.5} />}
              size="md"
              color="success"
              variant="flat"
              onPress={handleExportTemplate}
              isLoading={isExportingTemplate}
              className="font-bold h-9 px-4 rounded-lg shadow-sm text-[11px] uppercase tracking-wide transition-all text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 animate-fade-in-up active-bump"
              style={{ animationFillMode: 'both', animationDelay: '100ms' }}
            >
              {t('class_management.export_button') || "TEMPLATE"}
            </Button>
            <Button
              startContent={<Download size={14} strokeWidth={2.5} />}
              size="md"
              color="success"
              variant="flat"
              isLoading={isExportingStudents}
              onPress={handleExport}
              className="font-bold h-9 px-4 rounded-lg shadow-sm text-[11px] uppercase tracking-wide transition-all text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 animate-fade-in-up active-bump"
              style={{ animationFillMode: 'both', animationDelay: '150ms' }}
            >
              {t('class_semester.export_list') || "EXPORT LIST"}
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
              className="font-bold h-9 px-4 rounded-lg shadow-sm text-[11px] uppercase tracking-wide transition-all text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 animate-fade-in-up active-bump"
              style={{ animationFillMode: 'both', animationDelay: '200ms' }}
            >
              {t('class_semester.import_list') || "IMPORT LIST"}
            </Button>
            
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 mx-2 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '250ms' }}></div>
    
            <Button
              startContent={<Plus size={16} strokeWidth={2.5} />}
              size="md"
              color="warning"
              onPress={() => openModal({ content: <AddStudentModal semesterId={semesterId} /> })}
              className="text-white font-bold h-9 px-4 rounded-lg shadow-sm uppercase text-[11px] tracking-wide transition-all active-bump animate-fade-in-up"
              style={{ animationFillMode: 'both', animationDelay: '300ms' }}
            >
              {t('class_semester.add_student') || "ADD STUDENT"}
            </Button>

            <Button
              startContent={<Plus size={16} strokeWidth={2.5} />}
              size="md"
              className="bg-[#FF5C00] hover:bg-orange-600 text-white font-bold h-9 px-4 rounded-lg shadow-sm uppercase text-[11px] tracking-wide transition-all active-bump animate-fade-in-up"
              onPress={openCreateSlotModal}
              style={{ animationFillMode: 'both', animationDelay: '350ms' }}
            >
              {t('class_semester.new_slot') || "NEW EXAM"}
            </Button>

            <Button
              startContent={<Trophy size={16} strokeWidth={2.5} />}
              size="md"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-lg shadow-sm uppercase text-[11px] tracking-wide transition-all active-bump animate-fade-in-up"
              onPress={openCreateContestModal}
              style={{ animationFillMode: 'both', animationDelay: '400ms' }}
            >
              {t('class_semester.new_contest') || "NEW CONTEST"}
            </Button>
          </div>
        </div>

        {/* RIGHT: INVITE CODE CARD */}
        <div className="flex lg:justify-end animate-fade-in-right" style={{ animationFillMode: "both", animationDelay: "150ms" }}>
          <InviteCodeCard 
            classSemesterId={semesterId} 
            classCode={classCode} 
            semesterCode={semesterCode} 
          />
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
        <Tab key="slots" title={t('class_semester.class_curriculum') || "Class Curriculum"}>
          <div className="flex flex-col gap-4 mt-8">
            {slotLoading && (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            )}

            {slots
              .slice((slotPage - 1) * rowsPerPage, slotPage * rowsPerPage)
              .map((slot: ClassSlotResponse, idx: number) => (
                <Card
                  key={slot.id}
                  className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-sm overflow-hidden border border-transparent hover:border-[#FF5C00]/30 transition-all animate-fade-in-up"
                  style={{ animationFillMode: "both", animationDelay: `${idx * 50}ms` }}
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
                             {t('class_semester.slot_no') || "Exam no"} {slot.slotNo}: {slot.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            {slot.openAt ?? "N/A"} — {slot.closeAt ?? "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Tooltip content={t('class_semester.edit_due_date') || (language === 'vi' ? 'Sửa thời hạn (Due date)' : 'Edit Due Date')} className="text-[10px] font-bold" placement="top">
                          <Button
                            color="warning"
                            isIconOnly
                            size="sm"
                            variant="flat"
                            isDisabled={slot.isPublished}
                            onPress={() =>
                              openModal({
                                content: (
                                  <UpdateDueDateModal
                                    semesterId={semesterId}
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
                        </Tooltip>

                        <Tooltip content={slot.isPublished ? (t('class_semester.slot_published') || (language === 'vi' ? 'Đã công bố' : 'Published')) : (t('class_semester.publish_slot') || (language === 'vi' ? 'Công bố bài kiểm tra' : 'Publish Exam'))} className="text-[10px] font-bold" placement="top">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            isDisabled={slot.isPublished}
                            onPress={() => {
                              openModal({
                                content: (
                                  <div className="w-[400px] max-w-full bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-orange-200 dark:border-orange-500/20">
                                    <div className="px-6 py-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-600/10 dark:to-amber-600/10 border-b border-orange-200 dark:border-orange-500/20 flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg" style={{ background: "linear-gradient(135deg, #FF5C00, #f97316)", color: "white" }}>
                                        ⚠️
                                      </div>
                                      <h2 className="text-xl font-[900] text-gray-900 dark:text-white">
                                        {language === 'vi' ? 'Xác nhận công bố' : 'Confirm Publish'}
                                      </h2>
                                    </div>
                                    <div className="p-6 space-y-6">
                                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                        {language === 'vi' 
                                          ? 'Bạn có chắc chắn muốn công bố bài kiểm tra này? Một khi đã công bố, bạn sẽ KHÔNG THỂ thay đổi, thêm hay xóa bài tập được nữa.'
                                          : 'Are you sure you want to publish this exam? Once published, you CANNOT edit, add, or remove problems anymore.'}
                                      </p>
                                      <div className="flex justify-end gap-3 pt-2">
                                        <Button variant="flat" onPress={() => closeModal()}>
                                          {t('common.cancel') || (language === 'vi' ? 'Hủy' : 'Cancel')}
                                        </Button>
                                        <Button color="primary" className="bg-[#FF5C00] text-white font-bold shadow-md" onPress={() => {
                                          closeModal();
                                          handlePublishToggle(slot.id, false);
                                        }}>
                                          {t('class_semester.publish_slot') || (language === 'vi' ? 'Công bố' : 'Publish')}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              });
                            }}
                          >
                            {slot.isPublished ? (
                              <Eye className="text-emerald-500" size={18} />
                            ) : (
                              <EyeOff className="text-gray-400" size={18} />
                            )}
                          </Button>
                        </Tooltip>

                        

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
                          <Tab key="problems" title={t('class_semester.assigned_problems') || "Assigned Problems"}>
                            <div className="mt-6">
                          <div className="flex items-center justify-between mb-6">

  {/* LEFT TITLE */}
  <div className="flex items-center gap-2 text-[11px] font-[1000] uppercase italic text-blue-600">
    <Code2 size={14} />
    {t('class_semester.assigned_problems') || "ASSIGNED PROBLEMS"}
  </div>

  {/* RIGHT ACTIONS */}
  <div className="flex items-center gap-2">

    <Button
      size="sm"
      variant="flat"
      isDisabled={slot.isPublished}
      className="text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
      onPress={() =>
        openModal({
          title: t('class_semester.update_problems_slot') || "Update Problems in Exam",
          content: (
            <UpdateProblemIntoSlot
              semesterId={semesterId}
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
      {t('class_semester.edit_all') || "EDIT / ALLOCATE POINTS"}
    </Button>

    <Button
       size="sm"
      variant="flat"
      isDisabled={slot.isPublished}
      className="text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
    
      onPress={() => openAddProblemModal(slot.id)}
    >
    {t('class_semester.add_more_problem') || "ADD MORE PROBLEM"}
    </Button>

  </div>
</div>

                          <Table
                            aria-label={`Problems in exam ${slot.slotNo}`}
                            removeWrapper
                            classNames={{
                              base: "bg-white dark:bg-[#111c35] rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-white/5",
                              th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
                              td: "py-5 font-medium text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
                            }}
                          >
                            <TableHeader>
                              <TableColumn>{t('class_semester.header_ordinal') || "ORDINAL"}</TableColumn>
                              <TableColumn>{t('class_semester.header_problem_title') || "PROBLEM TITLE"}</TableColumn>
                              <TableColumn>{t('class_semester.header_points') || "POINTS"}</TableColumn>
                              <TableColumn>{t('class_semester.header_required') || "REQUIRED"}</TableColumn>
                              <TableColumn className="text-right">{t('class_semester.header_actions') || "ACTIONS"}</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={t('class_semester.empty_problems') || "No problems exist in this exam"}>
                              {slot.problems?.map((p, index) => (
                                <TableRow
                                  key={p.problemId}
                                  className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer animate-fade-in-right"
                                  style={{ animationFillMode: "both", animationDelay: `${200 + index * 40}ms` }}
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
                                      {p.isRequired ? (t('class_semester.required') || "REQUIRED") : (t('class_semester.optional') || "OPTIONAL")}
                                    </Chip>
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        color="danger"
                                        className={`animate-fade-in-up active-bump ${slot.isPublished ? "opacity-50" : ""}`}
                                        style={{ animationFillMode: "both", animationDelay: `${200 + index * 40 + 100}ms` }}
                                        onPress={() => {
                                          if (slot.isPublished) {
                                            addToast({
                                              title: language === 'vi' ? 'Không thể xóa bài tập khi bài kiểm tra đã được công bố!' : 'Cannot delete problem from published exam!',
                                              color: "danger"
                                            });
                                            return;
                                          }
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
                          </Tab>
                          <Tab key="scores" title={t('class_semester.student_scores') || "Student Scores & Results"}>
                            <SlotScoresTable semesterId={semesterId} slot={slot} />
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

        <Tab key="members" title={t('class_semester.members') || "Members"}>
          <ClassMembersPage classSemesterId={semesterId} />
        </Tab>

        <Tab key="contests" title="Contests">
          <div className="py-6">
            {isLoadingContests ? (
              <div className="flex justify-center py-10"><Spinner color="primary" /></div>
            ) : (
              <pre className="text-xs bg-slate-50 dark:bg-white/5 rounded-2xl p-6 overflow-auto max-h-[500px] whitespace-pre-wrap">
                {JSON.stringify(contestsData, null, 2)}
              </pre>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
