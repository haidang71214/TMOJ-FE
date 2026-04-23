"use client";
import React from "react";
import RemixProblemForm from "@/app/Problems/components/RemixProblemForm";
import { useParams } from "next/navigation";

export default function RemixProblemPage() {
  const { id } = useParams<{ id: string }>();
  return <RemixProblemForm originId={id} />;
}
