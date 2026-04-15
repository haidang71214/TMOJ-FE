"use client";

import React from "react";
import {
  Avatar,
  Button,
  Divider,
  Spinner,
  Chip
} from "@heroui/react";
import { Mail, Phone, Calendar, User, IdCard, X } from "lucide-react";
import { useModal } from "@/Provider/ModalProvider";
import { useGetStudentByIdQuery } from "@/store/queries/user";
import { Users } from "@/types";

interface Props {
  studentId: string;
  semesterId?: string;
  subjectId?: string;
}

export default function StudentDetailModal({ studentId, semesterId, subjectId }: Props) {
  const { closeModal } = useModal();
  console.log(studentId);
  const { data, isLoading } = useGetStudentByIdQuery({
    id: studentId,
    semesterId,
    subjectId
  });
  console.log(data);
  const student: Users | undefined = data?.data;

  return (
    <div className="w-[500px] bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border dark:border-white/10 flex flex-col relative">
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className="absolute top-4 right-4 z-10 p-2"
        onPress={closeModal}
      >
        <X size={20} className="text-slate-500" />
      </Button>
      <div className="px-8 pb-8 pt-0 flex flex-col items-center mt-[-4rem]">
        {isLoading ? (
          <div className="py-20">
            <Spinner size="lg" />
          </div>
        ) : student ? (
          <>
            {/* AVATAR */}
            <Avatar
              src={student.avatarUrl || ""}
              name={student.displayName || `${student.firstName} ${student.lastName}`}
              className="w-24 h-24 text-large ring-4 ring-white dark:ring-[#0f172a] shadow-lg mb-4"
            />

            {/* NAME */}
            <h2 className="text-2xl font-black text-slate-800 dark:text-white text-center">
              {student.displayName || `${student.firstName} ${student.lastName}`}
            </h2>
            <div className="flex gap-2 items-center mt-2">
              <Chip size="sm" color="primary" variant="flat" className="font-bold">
                Student
              </Chip>
              {student.rollNumber && (
                <Chip size="sm" color="default" variant="flat" className="font-bold">
                  {student.rollNumber}
                </Chip>
              )}
            </div>

            <Divider className="my-6" />

            {/* DETAILS */}
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-primary">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                  <span className="font-medium text-sm">{student.email}</span>
                </div>
              </div>

    

    

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-primary">
                  <User size={20} />
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="py-10 text-center text-slate-500 font-bold">
            Student details not found.
          </div>
        )}
      </div>
    </div>
  );
}
