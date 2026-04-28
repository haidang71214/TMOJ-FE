"use client";

import React from "react";
import { useParams } from "next/navigation";
import ContestDetailView from "@/app/Management/ClassSemester/[id]/Contest/[contestId]/ContestDetailView";


// khả năng dùng cho teacher và student luôn
export default function ContestClassPageDetailPage() {
  const params = useParams();
  const classSemesterId = params?.classSemesterId as string;
  const contestId = params?.id as string;

  return (  
    <ContestDetailView
      classSemesterId={classSemesterId}
      contestId={contestId}
    />
  );
}