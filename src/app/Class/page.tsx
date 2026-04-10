"use client";

import React, { useEffect, useState } from "react";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import StudentClasses from "./StudentClasses";
import TeacherClasses from "./TeacherClasses";
import { Spinner } from "@heroui/react";

export default function ClassPage() {
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
  console.log(role);
  if (role === "teacher") {
    return <TeacherClasses />;
  }
  else if   (role === "student") {
    return <StudentClasses />;
  }
  else {
    return null;
  }
}
