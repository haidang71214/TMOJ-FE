"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Divider,
  Spinner,
  Chip,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { useGetTeacherByIdQuery } from "@/store/queries/user";
import { Mail, Briefcase, BookOpen, Clock, Presentation } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId?: string;
}


export default function TeacherDetailModal({ isOpen, onOpenChange, teacherId }: Props) {
  const { data: response, isLoading } = useGetTeacherByIdQuery(
    { id: teacherId! },
    { skip: !teacherId || !isOpen }
  );
  console.log(response);
  
  const { t, language } = useTranslation();

  const teacherData = response?.data?.teacher;
  const subjects = response?.data?.subjects || [];
  const classes = response?.data?.classes || [];
  const totalClasses = response?.data?.totalClasses || 0;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="blur"
      classNames={{
        base: "rounded-[2rem] dark:bg-[#0f172a] shadow-2xl border dark:border-white/10 overflow-hidden",
        header: "border-b border-divider dark:border-white/10",
        body: "p-0 overflow-hidden",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-8 py-6">
              <h2 className="text-2xl font-black uppercase text-[#071739] dark:text-white flex items-center gap-2 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "50ms" }}>
                <Briefcase className="text-[#FF5C00]" />
                {t("teacher_management.instructor_profile") || (language === "vi" ? "Hồ Sơ Giảng Viên" : "Instructor Profile")}
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "100ms" }}>
                {t("teacher_management.detailed_metrics") || (language === "vi" ? "Chỉ số chi tiết và lịch trình" : "Detailed metrics and schedules")}
              </p>
            </ModalHeader>

            <ModalBody className="p-6 relative border-t border-divider dark:border-white/10">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Spinner size="lg" color="warning" />
                </div>
              ) : !teacherData ? (
                <div className="text-center py-10 font-bold text-slate-500 animate-fade-in-up">
                   {t("common.no_data") || (language === "vi" ? "Không có dữ liệu cho giảng viên này." : "No data available for this instructor.")}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* TOP PROFILE HEADER */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "150ms" }}>
                    <Avatar
                      src={teacherData.avatarUrl || ""}
                      name={teacherData.displayName || `${teacherData.firstName} ${teacherData.lastName}`}
                      className="w-28 h-28 text-large ring-4 ring-white dark:ring-[#0f172a] shadow-lg rounded-2xl"
                      radius="lg"
                    />
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
                      <h3 className="text-2xl font-[1000] text-slate-800 dark:text-white leading-tight uppercase">
                        {teacherData.displayName || `${teacherData.firstName} ${teacherData.lastName}`}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 mb-3 text-slate-500 dark:text-slate-400 font-bold text-sm">
                        <Mail size={14} className="text-[#FF5C00]" />
                        {teacherData.email}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Chip size="sm" variant="flat" className="bg-[#FF5C00]/20 text-[#FF5C00] font-bold uppercase tracking-wider">
                          {t("common.role") || (language === "vi" ? "Vai trò" : "Role")}: {teacherData.role}
                        </Chip>
                        {teacherData.emailVerified && (
                          <Chip size="sm" variant="flat" className="bg-green-500/20 text-green-600 font-bold uppercase tracking-wider">
                            {t("common.verified") || (language === "vi" ? "Đã xác thực" : "Verified")}
                          </Chip>
                        )}
                        <Chip size="sm" color="default" variant="flat" className="font-bold uppercase tracking-wider">
                          {t("teacher_management.total_classes") || (language === "vi" ? "Tổng Lớp" : "Total Classes")}: {totalClasses}
                        </Chip>
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY CARDS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FF5C00]/10 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-4 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "200ms" }}>
                      <div className="p-3 bg-[#FF5C00] text-white rounded-xl shadow-md">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                           {t("teacher_management.subjects_taught") || (language === "vi" ? "Môn đang dạy" : "Subjects Taught")}
                        </p>
                        <p className="text-xl font-black text-[#071739] dark:text-white">
                          {subjects.length}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#FF5C00]/10 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-4 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "250ms" }}>
                      <div className="p-3 bg-[#FF5C00] text-white rounded-xl shadow-md">
                        <Presentation size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                           {t("teacher_management.active_classes") || (language === "vi" ? "Lớp đang hoạt động" : "Active Classes")}
                        </p>
                        <p className="text-xl font-black text-[#071739] dark:text-white">
                          {totalClasses}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Divider className="opacity-50 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "300ms" }} />

                  {/* SUBJECTS & CLASSES */}
                  <div className="max-h-[25vh] overflow-y-auto pr-2 custom-scrollbar">
                    <Accordion variant="splitted" className="px-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "350ms" }}>
                      <AccordionItem 
                        key="subjects" 
                        aria-label="Taught Subjects" 
                        title={<span className="font-bold uppercase text-sm">{t("teacher_management.taught_subjects") || (language === "vi" ? "Môn đã dạy" : "Taught Subjects")}</span>}
                        startContent={<BookOpen className="text-[#FF5C00]" size={18} />}
                      >
                        {subjects.length > 0 ? (
                          <div className="flex flex-col gap-3 py-2">
                            {subjects.map((sub: any, index: number) => (
                              <div key={sub.subjectId} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-[#FF5C00]/20 hover:bg-[#FF5C00]/5 transition-colors animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: `${400 + index * 50}ms` }}>
                                <div>
                                  <h4 className="font-black text-[#071739] dark:text-white">{sub.code}</h4>
                                  <p className="text-xs text-slate-500 font-medium">{sub.name}</p>
                                </div>
                                <Chip size="sm" variant="dot" className="border-[#FF5C00] text-[#FF5C00] font-bold">
                                  {sub.classCount} {t("teacher_management.classes") || (language === "vi" ? "lớp" : "classes")}
                                </Chip>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic py-2">
                             {t("teacher_management.no_subjects") || (language === "vi" ? "Chưa có môn học nào." : "No subjects assigned yet.")}
                          </p>
                        )}
                      </AccordionItem>
                      
                      <AccordionItem 
                        key="classes" 
                        aria-label="Assigned Classes" 
                        title={<span className="font-bold uppercase text-sm">{t("teacher_management.assigned_classes") || (language === "vi" ? "Lớp đã phân công" : "Assigned Classes")}</span>}
                        startContent={<Presentation className="text-[#FF5C00]" size={18} />}
                      >
                        {classes.length > 0 ? (
                          <div className="flex flex-col gap-3 py-2">
                          {classes.map((cls: any, index: number) => (
                              <div
                                key={cls.classSemesterId}
                                className="flex flex-col p-4 rounded-xl border border-slate-100 dark:border-[#FF5C00]/20 bg-slate-50/50 dark:bg-white/5 gap-2 hover:border-[#FF5C00]/30 transition-all animate-fade-in-up"
                                style={{ animationFillMode: "both", animationDelay: `${400 + index * 50}ms` }}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-black text-[#071739] dark:text-white text-md">
                                        {cls.classCode}
                                      </h4>
                                      <Chip size="sm" className="bg-[#071739]/10 text-[#071739] dark:bg-white/10 dark:text-white text-[10px] font-black h-5 uppercase">
                                        {cls.subjectCode}
                                      </Chip>
                                      <Chip size="sm" className="bg-[#FF5C00]/20 text-[#FF5C00] text-[10px] font-black h-5 uppercase">
                                        {cls.semesterCode}
                                      </Chip>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{cls.subjectName}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-slate-400">
                                      {t("common.members") || (language === "vi" ? "Thành viên" : "Members")}
                                    </p>
                                    <p className="font-black text-[#071739] dark:text-white">{cls.memberCount}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-slate-500">
                                  <Clock size={12} className="text-[#FF5C00]" />
                                  {cls.startAt && cls.endAt
                                    ? `${new Date(cls.startAt).toLocaleDateString()} - ${new Date(cls.endAt).toLocaleDateString()}`
                                    : "No schedule"}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic py-2">
                             {t("teacher_management.no_classes") || (language === "vi" ? "Chưa có lớp học nào." : "No active classes found.")}
                          </p>
                        )}
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t border-divider dark:border-white/10 px-8 py-4">
              <Button fullWidth className="font-black uppercase tracking-wider" variant="flat" onPress={onClose}>
                {t("common.close") || (language === "vi" ? "Đóng" : "Close")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
