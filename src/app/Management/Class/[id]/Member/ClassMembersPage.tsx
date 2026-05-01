"use client";

import React, { useState, useEffect, use } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Chip,
  Spinner,
  Pagination,
  Button,
  addToast,
  Tooltip,
  Input,
} from "@heroui/react";

import {
  Users,
  Mail,
  User,
  Trash2,
  Search,
  Info,
  ChevronRight
} from "lucide-react";

import { useGetClassMembersQuery, useDeleteStudentClassSemesterMutation } from "@/store/queries/Class";
import { ClassMemberResponse } from "@/types";
import { useModal } from "@/Provider/ModalProvider";
import StudentDetailModal from "./StudentDetailModal";

export default function ClassMembersPage({
  classSemesterId,
}: {
  classSemesterId: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useModal();

  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentClassSemesterMutation();

  const handleDelete = async (studentId: string) => {
    try {
      await deleteStudent({ classSemesterId, studentId }).unwrap();
      addToast({ title: "Student removed", color: "success" });
    } catch {
      addToast({ title: "Failed to remove student", color: "danger" });
    }
  };

  const rowsPerPage = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useGetClassMembersQuery({ classSemesterId });
  
  const members = data?.data ?? [];

  const filteredMembers = members.filter((m: ClassMemberResponse) => 
    m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6 mt-8">

      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 flex-shrink-0 min-h-[56px]">
        {/* Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5">
            <Users size={22} className="text-slate-400" />
          </div>

          <div>
            <h3 className="text-xl font-black uppercase italic">
              Class Members
            </h3>

            <p className="text-[11px] text-slate-400 uppercase font-bold">
              {filteredMembers.length} participants
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72 flex-shrink-0">
          <Input
            placeholder="Search by name or email..."
            startContent={<Search size={16} className="text-gray-400" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            variant="faded"
            radius="lg"
            classNames={{
              input: "text-[13px] font-bold",
              base: "h-[40px]",
            }}
          />
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {/* MEMBER LIST + PAGINATION — min-h để tránh layout shift */}
      <div className="min-h-[520px] flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
          {filteredMembers
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((member: ClassMemberResponse) => (
              <Card
                key={member.userId}
                className="group relative bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 transform hover:-translate-y-1 w-full text-left overflow-hidden cursor-pointer"
                onClick={() => openModal({ content: <StudentDetailModal studentId={member.userId} /> })}
              >
                {/* Dải sáng màu cam ở viền trái khi hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-[#FF5C00] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardBody className="flex flex-row items-center justify-between py-6 px-5 bg-transparent overflow-hidden z-10">

                  {/* LEFT */}
                  <div className="flex items-center gap-5">
                    <div className="relative shrink-0">
                      {/* Vùng sáng mờ (Glow) phía sau avatar khi hover */}
                      <div className="absolute inset-0 bg-[#FF5C00] blur-md rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-110"></div>
                      
                      {member.avatarUrl ? (
                        <Avatar
                          src={member.avatarUrl}
                          name={member.displayName}
                          size="lg"
                          className="relative w-12 h-12 ring-2 ring-white dark:ring-[#111827] shadow-sm transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <Avatar
                          name={member.displayName}
                          size="lg"
                          className="relative w-12 h-12 bg-gradient-to-br from-orange-400 to-[#FF5C00] text-white font-bold ring-2 ring-white dark:ring-[#111827] shadow-sm transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      )}
                      {/* Lục giác báo trạng thái online giả lập cho sinh động */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#111827] rounded-full z-20"></div>
                    </div>

                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <p className="font-[900] uppercase italic text-[15px] text-slate-800 dark:text-white group-hover:text-[#FF5C00] transition-colors duration-300 truncate tracking-tight">
                        {member.displayName}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <Mail size={11} className="opacity-70 shrink-0 group-hover:text-orange-400 transition-colors duration-300" />
                        <span className="truncate group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors duration-300">{member.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-4 shrink-0">
                    <Chip
                      startContent={<User size={10} className="mr-1" />}
                      size="sm"
                      variant="flat"
                      className="font-black uppercase text-[9px] tracking-widest bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-400 dark:group-hover:border-orange-500/20 transition-all duration-300"
                    >
                      Student
                    </Chip>

                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-400 ease-out sm:translate-x-4 sm:group-hover:translate-x-0">
                      <Tooltip content="Remove" color="danger" placement="top">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          className="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white dark:bg-rose-500/10 dark:hover:bg-rose-500 rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDelete(member.userId);
                          }}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </Tooltip>
                    </div>

                    {/* Mũi tên chỉ hướng */}
                    <div className="hidden sm:flex text-slate-300 dark:text-slate-600 group-hover:text-[#FF5C00] group-hover:translate-x-1 transition-all duration-300">
                      <ChevronRight size={18} strokeWidth={3} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>

        {/* NO RESULTS OR PAGINATION */}
        {!isLoading && filteredMembers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 font-bold italic py-10">
            No members found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          <Pagination
            total={Math.ceil(filteredMembers.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            className="self-center mt-6"
          />
        )}
      </div>
    </div>
  );
}
