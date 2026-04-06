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
  Spinner,
  Avatar,
} from "@heroui/react";
import CreateClassSemester from "@/app/Management/Class/create/CreateClassSemester";
import { useGetClassDetailQuery } from "@/store/queries/Class";
import { Calendar, Copy, Download, Edit, Trash2 } from "lucide-react";



// ── MAIN COMPONENT ──
interface ClassSemesterManagementProps {
  classId: string;
  className?: string;
  onBack?: () => void;
}

export default function ClassSemesterManagement({
  classId,
  className,
  onBack,
}: ClassSemesterManagementProps) {
    const { data: classData, isLoading, refetch } = useGetClassDetailQuery({ id: classId });
    const classDetail = classData?.data;
   const instances = classDetail?.instances || [];
   
  // State cho Create Modal (controlled)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCreateSuccess = () => {
    refetch();           // Refresh danh sách sau khi tạo thành công
    setIsCreateModalOpen(false); // Đóng modal
  };


  const openCreateClassSemesterModal = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button isIconOnly size="sm" variant="flat" onPress={onBack}>
              ←
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#071739] dark:text-white">
              Class Semester Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {className ? `Manage semesters for "${className}"` : "Manage class semesters, schedule and problems"}
            </p>
          </div>
        </div>

        <Button
          className="bg-[#FF5C00] hover:bg-orange-600 text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase tracking-wider"
          startContent={<span className="text-lg">+</span>}
          onPress={openCreateClassSemesterModal}
        >
          CREATE NEW CLASS SEMESTER
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading class semesters...</p>
        </div>
      ) : instances.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">No class semesters found for this class yet.</p>
          <Button
            className="bg-[#FF5C00] text-white font-semibold"
            onPress={openCreateClassSemesterModal}
          >
            Create First Class Semester
          </Button>
        </div>
      ) : (
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
                style={{cursor:'pointer'}}
                // onClick={()=>{Move(instance.classSemesterId)}} tạm thời block nút move này 
                key={instance.classSemesterId || index}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                {/* ID */}
                <TableCell>
                  <span className="font-mono text-xs text-slate-400 break-all">
                    {instance.classSemesterId}
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
      )}

      {/* Create Class Semester Modal - Controlled */}
      <CreateClassSemester
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        classCode={className} 
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}