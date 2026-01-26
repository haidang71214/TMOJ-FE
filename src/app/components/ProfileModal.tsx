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
  Progress,
  Divider,
  Chip,
} from "@heroui/react";
import { Student, Teacher } from "../../types/index";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  student: Student | Teacher | null;
}

export default function ProfileModal({ isOpen, onOpenChange, student }: Props) {
  // 1. Kiểm tra xem user có phải giáo viên không (dựa trên sự tồn tại của trường dept)
  const isTeacher = !!student && "dept" in student;

  // 2. Logic lấy ID hiển thị thông minh
  const displayId = student
    ? "studentId" in student
      ? student.studentId
      : (student as Teacher).teacherId
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      backdrop="blur"
      classNames={{
        base: "rounded-[2.5rem] dark:bg-[#111c35] border border-divider dark:border-white/5",
        header: "border-b border-divider dark:border-white/5",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="uppercase italic font-[1000] text-xl tracking-tighter">
              {isTeacher ? "FACULTY" : "USER"}{" "}
              <span className="text-[#FF5C00]">PROFILE</span>
            </ModalHeader>

            <ModalBody className="py-8 space-y-8">
              {/* TOP SECTION */}
              <div className="flex items-center gap-6">
                <Avatar
                  src={student?.avatar}
                  className="w-32 h-32 rounded-[2rem] border-2 border-divider shadow-xl"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase text-blue-600 italic tracking-widest">
                      {isTeacher ? "Academic Instructor" : "Official Student"}
                    </p>
                    {isTeacher && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        className="h-5 font-black text-[8px] uppercase italic"
                      >
                        {(student as Teacher).status}
                      </Chip>
                    )}
                  </div>
                  <h3 className="text-4xl font-[1000] uppercase italic text-[#071739] dark:text-white leading-tight">
                    {student?.name}
                  </h3>
                  <p className="text-sm font-bold italic text-slate-400 uppercase">
                    ID: {displayId}
                  </p>
                </div>
              </div>

              <Divider className="opacity-50" />

              {/* INFORMATION GRID */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase italic text-slate-400 underline underline-offset-8 decoration-2">
                    Personal Details
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-500 italic">
                        Email Address
                      </p>
                      <p className="text-sm font-bold italic dark:text-slate-200">
                        {student?.email}
                      </p>
                    </div>
                    {isTeacher ? (
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 italic">
                          Department
                        </p>
                        <p className="text-sm font-bold italic text-blue-600 uppercase">
                          {(student as Teacher).dept}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 italic">
                          Home Town
                        </p>
                        <p className="text-sm font-bold italic dark:text-slate-200">
                          {student?.address || "Da Nang, VN"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance or Instructor Info */}
                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase italic text-slate-400 underline underline-offset-8 decoration-2">
                    {isTeacher ? "Instructor Stats" : "Performance"}
                  </p>
                  <div className="space-y-3">
                    {isTeacher ? (
                      <>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 italic">
                            Faculty Joined
                          </p>
                          <p className="text-sm font-bold italic dark:text-slate-200">
                            {student?.joinDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 italic">
                            Total Classes
                          </p>
                          <p className="text-2xl font-[1000] italic text-[#FF5C00]">
                            {(student as Teacher).total || 0}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 italic">
                            Current Grade
                          </p>
                          <p className="text-2xl font-[1000] italic text-[#FF5C00]">
                            {student?.total || 0}
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[9px] font-black uppercase text-slate-500 italic">
                              Progress
                            </p>
                            <span className="text-[10px] font-black italic">
                              {student?.progress || 0}%
                            </span>
                          </div>
                          <Progress
                            value={student?.progress || 0}
                            size="sm"
                            classNames={{
                              indicator: "bg-[#071739] dark:bg-white",
                              track: "bg-slate-100 dark:bg-white/10",
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!isTeacher && (
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border-l-4 border-blue-600">
                  <p className="text-[9px] font-black uppercase text-slate-500 italic">
                    Enrollment Date
                  </p>
                  <p className="text-sm font-bold italic dark:text-slate-200">
                    Enrolled on {student?.joinDate}
                  </p>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="border-t border-divider dark:border-white/5">
              <Button
                fullWidth
                variant="light"
                onPress={onClose}
                className="font-black uppercase italic text-xs h-12 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                Close Profile
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
