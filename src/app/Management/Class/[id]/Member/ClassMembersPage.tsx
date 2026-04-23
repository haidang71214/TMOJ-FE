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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filteredMembers
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((member: ClassMemberResponse) => (
              <Card
                key={member.userId}
                className="bg-white dark:bg-[#111827] rounded-[1.5rem] border border-transparent hover:border-[#FF5C00]/40 transition-all shadow-sm"
              >
                <CardBody className="flex flex-row items-center justify-between p-5">

                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                  {member.avatarUrl ? <Avatar
                      src={member?.avatarUrl}
                      name={member.displayName}
                      size="lg"
                      className="ring-2 ring-white dark:ring-black"
                    />: 
                    <Avatar
                      name={member.displayName}
                      size="lg"
                      className="ring-2 ring-white dark:ring-black"
                    />
                  }
                  

                    <div className="flex flex-col">

                      <p className="font-black uppercase italic text-sm">
                        {member.displayName}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Mail size={12} />
                        {member.email}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2">

                 
                      <Chip
                        startContent={<User size={12} />}
                        size="sm"
                        variant="flat"
                        className="font-black uppercase text-[10px]"
                      >
                        Student
                      </Chip>
                      <Tooltip content="View Details" color="primary">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="ml-2"
                          onPress={() => openModal({ content: <StudentDetailModal studentId={member.userId} /> })}
                        >
                          <Info size={16} />
                        </Button>
                      </Tooltip>

                      <Tooltip content="Remove" color="danger">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          className="ml-1"
                          onPress={() => handleDelete(member.userId)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>

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
