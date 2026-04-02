"use client";

import React, { useState, useEffect, use } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Chip,
  Spinner,
  Pagination,
} from "@heroui/react";

import {
  Users,
  Mail,
  User,
} from "lucide-react";

import { useGetClassMembersQuery } from "@/store/queries/Class";
import { ClassMemberResponse } from "@/types";

export default function ClassMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;

  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);

  const rowsPerPage = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useGetClassMembersQuery({ id: classId });

  const members = data?.data ?? [];

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6 mt-8">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5">
          <Users size={22} className="text-slate-400" />
        </div>

        <div>
          <h3 className="text-xl font-black uppercase italic">
            Class Members
          </h3>

          <p className="text-[11px] text-slate-400 uppercase font-bold">
            {members.length} participants
          </p>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {/* MEMBER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members
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

                </div>
              </CardBody>
            </Card>
          ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        total={Math.ceil(members.length / rowsPerPage)}
        page={page}
        onChange={setPage}
        className="self-center mt-6"
      />
    </div>
  );
}