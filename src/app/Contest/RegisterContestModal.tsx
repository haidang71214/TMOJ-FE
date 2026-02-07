"use client";

import { useState } from "react";
import { useModal } from "@/Provider/ModalProvider";

type Props = {
  contestId: number;
};

export default function RegisterContestModal({ contestId }: Props) {
  const { closeModal } = useModal();

  const [studentId, setStudentId] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const handleAddMember = () => {
    if (!studentId.trim()) return;
    setMembers((prev) => [...prev, studentId]);
    setStudentId("");
  };

  const handleRegister = () => {
    console.log("Contest ID:", contestId);
    console.log("Members:", members);

    // TODO: call register contest API
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <h2 className="mb-4 text-xl font-black uppercase">
          Register Contest
        </h2>

        {/* Contest info */}
        <div className="mb-6 rounded-lg border bg-gray-50 p-4">
          <p className="font-semibold">📘 Contest Information</p>
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            <li>• Total problems: <b>5</b></li>
            <li>• Difficulty: <b>Easy → Medium</b></li>
            <li>• Duration: <b>120 minutes</b></li>
            <li>• Description: Practice algorithm & data structure basics.</li>
          </ul>
        </div>

        {/* Add member */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-semibold">
            Add member (Student ID)
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 20210001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddMember}
              className="rounded-lg bg-gray-200 px-4 text-sm hover:bg-gray-300"
            >
              Add
            </button>
          </div>

          {members.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700">
              {members.map((id, index) => (
                <li key={index}>• {id}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={closeModal}
            className="rounded-lg px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleRegister}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
