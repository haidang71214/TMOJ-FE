"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useCreateTestSetMutation } from "@/store/queries/problem";

export default function CreateTestSetPage() {
  const params = useParams<{ id: string }>();
  const problemId = params.id;

  const [createTestSet, { isLoading }] = useCreateTestSetMutation();

  const [form, setForm] = useState({
    type: "",
    note: "",
  });

  const handleCreate = async () => {
    try {
      const res = await createTestSet({
        id: problemId,
        body: {
          type: form.type,
          note: form.note,
        },
      }).unwrap();

      console.log("Created testset:", res);
      alert("Create TestSet success");
    } catch (err) {
      console.error(err);
      alert("Create TestSet failed");
    }
  };

  return (
    <div className="p-10 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Create TestSet</h1>

      <p className="text-gray-500">
        Problem ID: {problemId}
      </p>

      <input
        className="border p-2 w-full rounded"
        placeholder="Type (example: public)"
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      />

      <textarea
        className="border p-2 w-full rounded"
        placeholder="Note"
        value={form.note}
        onChange={(e) =>
          setForm({ ...form, note: e.target.value })
        }
      />

      <button
        onClick={handleCreate}
        disabled={isLoading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {isLoading ? "Creating..." : "Create TestSet"}
      </button>
    </div>
  );
}