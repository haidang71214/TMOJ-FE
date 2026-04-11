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
  Avatar,
  Spinner,
  Tooltip,
} from "@heroui/react";
import { ChevronLeft, Calendar, Edit, Copy, Download, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetClassDetailQuery } from "@/store/queries/Class";
import CreateClassSemester from "../../../../Provider/CreateClassSemester";
import UpdateClassSemester, { UpdateClassSemesterInitialData } from "../../../../Provider/UpdateClassSemester";
import { useTranslation } from "@/hooks/useTranslation";

// thực ra cái này giống với classSemesterPage hơn
export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t, language } = useTranslation();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const classId = resolvedParams.id;

  const { data: classData, isLoading, refetch } = useGetClassDetailQuery({ id: classId });
  const classDetail = classData?.data;
  const instances = classDetail?.instances || [];
  console.log(instances);
  
  // State cho Modal Create Class Semester
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateInitialData, setUpdateInitialData] = useState<UpdateClassSemesterInitialData | null>(null);

  // Lấy thông tin subject và semester từ instance đầu tiên (hoặc bạn có thể cho chọn)
  const firstInstance = instances[0];

  const openUpdateModal = (instance: any) => {
    setUpdateInitialData({
      classId: classId,
      classSemesterId: instance.classSemesterId,
      subjectId: instance.subjectId,
      semesterId: instance.semesterId,
      teacherId: instance.teacher?.userId,
      classCode: classDetail?.classCode || "",
    });
    setIsUpdateModalOpen(true);
  };

  const openCreateClassSemesterModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    refetch(); // Refresh lại chi tiết class sau khi tạo thành công
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500">{t('class_detail_page.loading') || "Loading class details..."}</p>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="text-center py-20 text-red-500 font-bold uppercase">
        {t('common.error') || "Class not found."}
      </div>
    );
  }
  const handleViewSemester =(id:string,semesterCode:string) =>{
    router.push(
    `/Management/ClassSemester/${id}?classCode=${classDetail.classCode}&semesterCode=${semesterCode}`
  );
  }
  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8 overflow-hidden">
        <div className="animate-fade-in-right flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            className="active-bump h-12 w-12 rounded-2xl"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} className="text-slate-500" />
          </Button>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
              {t('class_detail_page.title1') || "CLASS"} <span className="text-[#FF5C00]">{classDetail?.classCode || "DETAIL"}</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
              {t('class_detail_page.subtitle') || "Instances Management"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Nút tạo Class Semester mới */}
          <Button
            color="primary"
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider animate-fade-in-up active-bump"
            style={{ animationFillMode: "both", animationDelay: "100ms" }}
            startContent={<Plus size={18} />}
            onPress={openCreateClassSemesterModal}
          >
            {t('class_detail_page.add_semester') || "ADD NEW SEMESTER FOR CLASS"}
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Class Instances Table"
          removeWrapper
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
          }}
        >
          <TableHeader>
            <TableColumn>{t('class_detail_page.table_id') || "ID"}</TableColumn>
            <TableColumn>{t('class_detail_page.table_semester_code') || "SEMESTER CODE"}</TableColumn>
            <TableColumn>{t('class_detail_page.table_subject_code') || "SUBJECT CODE"}</TableColumn>
            <TableColumn>{t('class_detail_page.table_subject_name') || "SUBJECT NAME"}</TableColumn>
            <TableColumn>{t('class_detail_page.table_start_date') || "START DATE"}</TableColumn>
            <TableColumn>{t('class_detail_page.table_end_date') || "END DATE"}</TableColumn>
            <TableColumn>{t('class_detail_page.table_teacher') || "TEACHER"}</TableColumn>
            <TableColumn className="text-right">{t('class_detail_page.table_operations') || "OPERATIONS"}</TableColumn>
          </TableHeader>

          <TableBody
            emptyContent={
              <div className="flex flex-col items-center justify-center p-8 opacity-60">
                <p className="text-sm font-black italic tracking-widest uppercase">
                  {t('class_detail.no_semester') || "Haven't got any semester yet -> Create one"}
                </p>
              </div>
            }
          >
            {instances.map((instance: any, index: number) => (
             <TableRow
  key={instance.classSemesterId}
  className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer animate-fade-in-right"
  style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50}ms` }}
  onClick={() => handleViewSemester(
    instance.classSemesterId, 
     instance?.semesterCode
  )}
>
                {/* ID */}
                <TableCell>
                  <span className="font-mono text-xs text-slate-400 break-all">
                    {index}
                  </span>
                </TableCell>

                {/* Semester Code */}
                <TableCell>
                  <span className="font-black uppercase tracking-wide text-base">
                    {instance.semesterCode || "—"}
                  </span>
                </TableCell>

                {/* Subject Code */}
                <TableCell>
                  <span className="font-black uppercase tracking-wide text-base">
                    {instance.subjectCode || "—"}
                  </span>
                </TableCell>

                {/* Subject Name */}
                <TableCell>
                  <span className="font-medium">
                    {instance.subjectName || "—"}
                  </span>
                </TableCell>

                {/* Start Date */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-slate-400" />
                    {instance.startAt || "—"}
                  </div>
                </TableCell>

                {/* End Date */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-slate-400" />
                    {instance.endAt || "—"}
                  </div>
                </TableCell>

                {/* Teacher */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={instance.teacher?.avatarUrl}
                      alt={instance.teacher?.displayName || ""}
                      className="w-9 h-9"
                      fallback={
                        instance.teacher?.displayName
                          ? instance.teacher.displayName.slice(0, 2).toUpperCase()
                          : "??"
                      }
                    />
                    <div>
                      <p className="font-medium text-sm leading-tight">
                        {instance.teacher?.displayName || t('common.no_teacher') || "Chưa có giáo viên"}
                      </p>
                      {instance.teacher?.email && (
                        <p className="text-[10px] text-slate-500">{instance.teacher.email}</p>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Operations */}
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Tooltip content={t('common.edit') || (language === 'vi' ? 'Chỉnh sửa' : 'Edit')} placement="top" className="font-bold text-[10px]">
                      <Button 
                        isIconOnly size="sm" variant="flat" 
                        className="h-9 w-9 animate-fade-in-up hover:bg-slate-200 dark:hover:bg-white/10" 
                        style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50 + 100}ms` }}
                        onPress={() => openUpdateModal(instance)}
                      >
                        <Edit size={16} className="text-slate-500" />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip content={t('common.duplicate') || (language === 'vi' ? 'Nhân bản' : 'Duplicate')} placement="top" className="font-bold text-[10px]">
                      <Button 
                        isIconOnly size="sm" variant="flat" 
                        className="h-9 w-9 animate-fade-in-up hover:bg-slate-200 dark:hover:bg-white/10" 
                        style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50 + 150}ms` }}
                      >
                        <Copy size={16} className="text-slate-500" />
                      </Button>
                    </Tooltip>

                    <Tooltip content={t('common.download') || (language === 'vi' ? 'Tải xuống' : 'Download')} placement="top" className="font-bold text-[10px]">
                      <Button 
                        isIconOnly size="sm" variant="flat" 
                        className="h-9 w-9 animate-fade-in-up hover:bg-slate-200 dark:hover:bg-white/10"
                        style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50 + 200}ms` }}
                      >
                        <Download size={16} className="text-slate-500" />
                      </Button>
                    </Tooltip>

                    <Tooltip content={t('common.delete') || (language === 'vi' ? 'Xóa' : 'Delete')} placement="top" color="danger" className="font-bold text-[10px]">
                      <Button 
                        isIconOnly size="sm" variant="flat" 
                        className="h-9 w-9 animate-fade-in-up hover:bg-red-100 dark:hover:bg-red-500/20 text-rose-500"
                        style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50 + 250}ms` }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ==================== CREATE CLASS SEMESTER MODAL ==================== */}
      <CreateClassSemester
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  classCode={classDetail?.classCode} 
  onSuccess={handleCreateSuccess}
/>

      <UpdateClassSemester
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        initialData={updateInitialData}
        onSuccess={handleCreateSuccess}
      />
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