"use client";

import { useParams } from "next/navigation";

export default function CreateTestCasePage() {
  const params = useParams<{ id: string }>();

  const problemId = params.id;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Create TestSet
      </h1>

      <p className="mt-4 text-gray-500">
        Problem ID: {problemId}
      </p>
    </div>
  );
}