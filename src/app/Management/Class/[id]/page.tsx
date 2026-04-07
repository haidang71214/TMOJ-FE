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
} from "@heroui/react";
import { ChevronLeft, Calendar, Edit, Copy, Download, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetClassDetailQuery } from "@/store/queries/Class";
import CreateClassSemester from "../../../../Provider/CreateClassSemester";


// thực ra cái này giống với classSemesterPage hơn
export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const classId = resolvedParams.id;

  const { data: classData, isLoading, refetch } = useGetClassDetailQuery({ id: classId });
  const classDetail = classData?.data;
  const instances = classDetail?.instances || [];
  console.log(instances);
  
  // State cho Modal Create Class Semester
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Lấy thông tin subject và semester từ instance đầu tiên (hoặc bạn có thể cho chọn)
  const firstInstance = instances[0];

  const openCreateClassSemesterModal = () => {
    if (!firstInstance) {
      alert("Không có thông tin semester/subject để tạo!");
      return;
    }

    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    refetch(); // Refresh lại chi tiết class sau khi tạo thành công
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500">Đang tải thông tin lớp học...</p>
      </div>
    );
  }

  if (!classDetail || instances.length === 0) {
    return (
      <div className="text-center py-20 text-red-500">
        Không tìm thấy thông tin instances cho lớp này.
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
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            CLASS <span className="text-[#FF5C00]">{classDetail.classCode || "DETAIL"}</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Instances Management
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Nút tạo Class Semester mới */}
          <Button
            color="primary"
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider"
            startContent={<Plus size={18} />}
            onPress={openCreateClassSemesterModal}
          >
            ADD NEW SEMESTER FOR CLASS
          </Button>

          <Button
            variant="light"
            startContent={<ChevronLeft size={20} />}
            onPress={() => router.back()}
          >
            Quay lại
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
            <TableColumn>ID</TableColumn>
            <TableColumn>SEMESTER CODE</TableColumn>
            <TableColumn>SUBJECT CODE</TableColumn>
            <TableColumn>SUBJECT NAME</TableColumn>
            <TableColumn>START DATE</TableColumn>
            <TableColumn>END DATE</TableColumn>
            <TableColumn>TEACHER</TableColumn>
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>

          <TableBody emptyContent="Không có instance nào">
            {instances.map((instance: any, index: number) => (
             <TableRow
  key={instance.classSemesterId}
  className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
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
                        {instance.teacher?.displayName || "Chưa có giáo viên"}
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
                    <Button isIconOnly size="sm" variant="flat" className="h-9 w-9">
                      <Edit size={16} className="text-slate-500" />
                    </Button>
                    <Button isIconOnly size="sm" variant="flat" className="h-9 w-9">
                      <Copy size={16} className="text-slate-500" />
                    </Button>
                    <Button isIconOnly size="sm" variant="flat" className="h-9 w-9">
                      <Download size={16} className="text-slate-500" />
                    </Button>
                    <Button isIconOnly size="sm" variant="flat" className="h-9 w-9 text-rose-500">
                      <Trash2 size={16} />
                    </Button>
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