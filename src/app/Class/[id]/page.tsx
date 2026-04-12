"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import StudentClassDetail from "../components/StudentClassDetail";
import TeacherClassDetail from "../components/TeacherClassDetail";

export default function ClassDetailPageWrapper() {
  const params = useParams();
  const classId = params?.id as string;
  const [mounted, setMounted] = useState(false);
  const { data: userProfile, isLoading } = useGetUserInformationQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex items-center justify-center transition-colors duration-300">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const role = userProfile?.role?.toLowerCase();

  // "teacher" or "admin" gets the full management view
  if (role === "teacher" || role === "admin" || role === "manager") {
    return <TeacherClassDetail classId={classId} />;
  }

  // "student" gets the standard learning path
  if (role === "student") {
    return <StudentClassDetail classId={classId} />;
  }

  // Fallback if role is undefined or unrecognized
  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex items-center justify-center">
      <p className="text-slate-500 font-bold uppercase italic">Unauthorized or unknown role</p>
    </div>
  );
}
