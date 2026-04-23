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
  Info
} from "lucide-react";

import { useGetClassMembersQuery, useDeleteStudentClassSemesterMutation } from "@/store/queries/Class";
import { ClassMemberResponse } from "@/types";
import { useModal } from "@/Provider/ModalProvider";
import StudentDetailModal from "./StudentDetailModal";

export default function ClassMembersPage({
  classId,
}: {
  classId: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useModal();
  
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentClassSemesterMutation();

  const handleDelete = async (studentId: string) => {
    try {
      await deleteStudent({ classSemesterId: classId, studentId }).unwrap();
      addToast({ title: "Student removed", color: "success" });
    } catch {
      addToast({ title: "Failed to remove student", color: "danger" });
    }
  };

  const rowsPerPage = 8;

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { data, isLoading } = useGetClassMembersQuery({ id: classId });
  
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
      <div className="min-h-[600px] flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMembers
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((member: ClassMemberResponse) => (
              <Card
                key={member.userId}
                className="group bg-white dark:bg-[#111827] rounded-3xl border border-slate-100 dark:border-white/5 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden"
              >
                <CardBody className="p-4 flex flex-col gap-5">
                  {/* TOP SECTION: AVATAR & INFO */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        src={member.avatarUrl || undefined}
                        name={member.displayName}
                        size="lg"
                        className="w-14 h-14 ring-2 ring-orange-500/20 group-hover:ring-orange-500 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-[#111827] rounded-full shadow-sm" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-[15px] group-hover:text-orange-500 transition-colors">
                        {member.displayName}
                      </p>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Mail size={12} className="shrink-0" />
                        <span className="text-xs truncate font-medium">{member.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM SECTION: BADGES & ACTIONS */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-white/5">
                    <Chip
                      startContent={<User size={12} />}
                      size="sm"
                      variant="flat"
                      color="warning"
                      className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                    >
                      Student
                    </Chip>

                    <div className="flex items-center gap-1">
                      <Tooltip content="View Details" closeDelay={0}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          radius="full"
                          className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          onPress={() => openModal({ content: <StudentDetailModal studentId={member.userId} /> })}
                        >
                          <Info size={18} />
                        </Button>
                      </Tooltip>

                      <Tooltip content="Remove from class" color="danger" closeDelay={0}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          radius="full"
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          onPress={() => handleDelete(member.userId)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </Tooltip>
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
