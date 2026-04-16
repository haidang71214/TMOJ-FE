"use client";

import React from "react";
import {
  Avatar,
  Button,
  Divider,
  Spinner,
  Chip,
} from "@heroui/react";
import { Mail, User, Calendar, BookOpen, Users as UsersIcon, X } from "lucide-react";
import { useGetStudentByIdQuery } from "@/store/queries/user";
import { useTranslation } from "@/hooks/useTranslation";
import { useModal } from "@/Provider/ModalProvider";
import { motion } from "framer-motion";

interface Props {
  studentId: string;
}

export default function StudentDetailModal({ studentId }: Props) {
  const { closeModal } = useModal();

  const { data, isLoading } = useGetStudentByIdQuery({ id: studentId });

  const { t, language } = useTranslation();

  const studentData: any = data?.data;
  const classes = studentData?.classes || [];
  const student = studentData?.student;

  const handleClose = () => closeModal();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border dark:border-white/10 relative flex flex-col"
        style={{ maxHeight: "92vh" }}                    // Giới hạn chiều cao modal
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Nút đóng */}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="absolute top-5 right-5 z-20"
          onPress={handleClose}
        >
          <X size={24} className="text-slate-500 dark:text-slate-400" />
        </Button>

        {/* Header - luôn cố định */}
        <div className="px-8 pt-8 pb-6 border-b border-divider dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <UsersIcon className="text-[#FF5C00]" size={32} />
            <div>
              <h2 className="text-2xl font-black uppercase text-[#071739] dark:text-white">
                {t?.("student_management.student_profile") || (language === "vi" ? "Hồ Sơ Sinh Viên" : "Student Profile")}
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                {t?.("student_management.detailed_info") || (language === "vi" ? "Thông tin chi tiết và danh sách lớp" : "Detailed information and enrolled classes")}
              </p>
            </div>
          </div>
        </div>

        {/* Body - cho phép scroll */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" color="warning" />
              </div>
            ) : !student ? (
              <div className="text-center py-20 text-slate-500 font-bold">
                {t?.("student_management.student_not_found") || (language === "vi" ? "Không tìm thấy thông tin sinh viên." : "Student details not found.")}
              </div>
            ) : (
              <div className="flex flex-col gap-8 pb-4">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar
                    src={student.avatarUrl || ""}
                    name={student.displayName || `${student.firstName} ${student.lastName}`}
                    className="w-28 h-28 text-2xl ring-4 ring-white dark:ring-[#0f172a] shadow-xl rounded-2xl flex-shrink-0"
                    radius="lg"
                  />

                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">
                      {student.displayName || `${student.firstName} ${student.lastName}`}
                    </h3>

                    {student.rollNumber && (
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        className="mt-3 bg-[#FF5C00]/10 text-[#FF5C00] font-bold text-base px-4"
                      >
                        {student.rollNumber}
                      </Chip>
                    )}

                    <div className="flex items-center gap-2 mt-4 text-slate-600 dark:text-slate-400">
                      <Mail size={18} className="text-[#FF5C00]" />
                      <span className="font-medium">{student.email}</span>
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FF5C00]/10 dark:bg-white/5 p-6 rounded-2xl flex gap-5 items-center">
                    <div className="p-4 bg-[#FF5C00] text-white rounded-2xl">
                      <User size={26} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-black tracking-widest text-slate-500">
                        {t?.("student_management.full_name") || (language === "vi" ? "HỌ VÀ TÊN" : "FULL NAME")}
                      </p>
                      <p className="font-bold text-xl text-[#071739] dark:text-white mt-1">
                        {student.displayName || `${student.firstName} ${student.lastName}`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FF5C00]/10 dark:bg-white/5 p-6 rounded-2xl flex gap-5 items-center">
                    <div className="p-4 bg-[#FF5C00] text-white rounded-2xl">
                      <BookOpen size={26} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-black tracking-widest text-slate-500">
                        {t?.("student_management.enrolled_classes_count") || (language === "vi" ? "SỐ LỚP ĐANG HỌC" : "ENROLLED CLASSES")}
                      </p>
                      <p className="font-black text-3xl text-[#071739] dark:text-white mt-1">{classes.length}</p>
                    </div>
                  </div>
                </div>

                <Divider className="my-2 opacity-70" />

                {/* Danh sách lớp - scroll riêng */}
                <div>
                  <h3 className="font-bold uppercase flex items-center gap-3 text-slate-600 dark:text-slate-400 mb-5 sticky top-0 bg-white dark:bg-[#0f172a] z-10 py-1">
                    <Calendar className="text-[#FF5C00]" size={20} />
                    {t?.("student_management.enrolled_classes_list") || (language === "vi" ? "CÁC LỚP ĐANG THAM GIA" : "ENROLLED CLASSES LIST")}
                  </h3>

                  {classes.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {classes.map((cls: any, index: number) => (
                        <div
                          key={cls.classSemesterId || index}
                          className="p-5 rounded-2xl border border-slate-100 dark:border-[#FF5C00]/20 bg-slate-50 dark:bg-white/5 hover:border-[#FF5C00]/40 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-black text-xl text-[#071739] dark:text-white">
                                {cls.classCode}
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 mt-1">
                                {cls.subjectName}
                              </p>
                            </div>
                            <Chip 
                              size="sm" 
                              className="bg-[#FF5C00]/20 text-[#FF5C00] font-bold uppercase"
                            >
                              {cls.semesterCode}
                            </Chip>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 italic">
                      {t?.("student_management.no_classes") || (language === "vi" ? "Sinh viên chưa tham gia lớp học nào." : "The student has not enrolled in any classes.")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - luôn cố định ở dưới */}
        <div className="px-8 py-6 border-t border-divider dark:border-white/10 bg-slate-50 dark:bg-white/5 flex-shrink-0">
          <Button
            fullWidth
            variant="flat"
            size="lg"
            className="font-black uppercase tracking-wider py-6"
            onPress={handleClose}
          >
            {t?.("common.close") || (language === "vi" ? "ĐÓNG" : "CLOSE")}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}