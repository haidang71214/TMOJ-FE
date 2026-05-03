"use client";

import React from "react";
import { useParams } from "next/navigation";
import ContestDetailView from "./ContestDetailView";

export default function ClassContestDetailPage() {
  const params = useParams();

  const classSemesterId = params?.id as string;
  const contestId = params?.contestId as string;

  return (
    <ContestDetailView 
      classSemesterId={classSemesterId} 
      contestId={contestId} 
    />
  );
}