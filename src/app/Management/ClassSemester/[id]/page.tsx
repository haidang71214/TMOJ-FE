"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import TeacherClassDetail from "@/app/Class/components/TeacherClassDetail";
import { useParams } from "next/navigation";

export default function AdminClassSemesterDetailPage() {
  const params = useParams();
  const semesterId = params?.id as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !semesterId) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex items-center justify-center transition-colors duration-300">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return <TeacherClassDetail semesterId={semesterId} />;
}