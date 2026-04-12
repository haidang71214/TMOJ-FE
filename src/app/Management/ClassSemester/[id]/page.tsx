"use client";

import React from "react";
import TeacherClassDetail from "@/app/Class/components/TeacherClassDetail";
import { useParams } from "next/navigation";

export default function AdminClassSemesterDetailPage() {
  const params = useParams();
  const classId = params?.id as string;

  return <TeacherClassDetail classId={classId} />;
}