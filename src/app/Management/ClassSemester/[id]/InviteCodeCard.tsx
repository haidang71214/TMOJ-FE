"use client";

import React, { useState } from "react";
import { Button, Spinner, Input, addToast } from "@heroui/react";
import { Rocket, Trash2, Key } from "lucide-react";
import { 
  useGetInviteCodeQuery, 
  useCreateInviteCodeMutation, 
  useDeleteInviteCodeMutation 
} from "@/store/queries/InviteCode";

interface InviteCodeCardProps {
  classSemesterId: string;
  classCode: string;
  semesterCode: string;
}

export default function InviteCodeCard({ classSemesterId, classCode, semesterCode }: InviteCodeCardProps) {
  const { data: inviteCodeData, isLoading: codeLoading } = useGetInviteCodeQuery(classSemesterId);
  const [createCode, { isLoading: isCreating }] = useCreateInviteCodeMutation();
  const [deleteCode, { isLoading: isDeleting }] = useDeleteInviteCodeMutation();
  console.log(inviteCodeData);
  
  const [minutesValid, setMinutesValid] = useState("1440"); // default 7 days in minutes

  const codeString = typeof inviteCodeData === 'string' 
    ? inviteCodeData 
    : (inviteCodeData as any)?.data?.inviteCode 
      || (inviteCodeData as any)?.inviteCode 
      || null;

  const handleCreate = async () => {
    try {
      await createCode({ classSemesterId, data: { minutesValid: Number(minutesValid) || 1440 } }).unwrap();
      addToast({ title: "Invite code created successfully", color: "success" });
    } catch (err: any) {
      addToast({ title: "Failed to create invite code", description: err?.data?.message || "", color: "danger" });
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCode(classSemesterId).unwrap();
      addToast({ title: "Invite code deleted", color: "success" });
    } catch (err: any) {
      addToast({ title: "Failed to delete invite code", description: err?.data?.message || "", color: "danger" });
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[280px] p-5 rounded-[1.5rem] bg-[#071739] text-white flex flex-col gap-4 relative overflow-hidden shadow-2xl h-full min-h-[150px]">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Rocket size={80} />
      </div>

      <h3 className="text-[11px] font-black uppercase italic tracking-widest text-[#FF5C00] relative z-10">
        Class Enrollment
      </h3>

      {codeLoading ? (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <Spinner color="warning" size="sm" />
        </div>
      ) : codeString ? (
        <div className="flex-1 flex flex-col relative z-10">
          <p className="text-[10px] text-slate-400 italic mb-3 leading-tight">
            This class is currently open for enrollment.
          </p>
          <div className="flex-1 flex flex-col items-center justify-center p-3 bg-black/30 rounded-xl border border-white/10">
            <span className="font-[1000] text-xl tracking-widest text-emerald-400 break-all text-center">
              {codeString}
            </span>
          </div>
          <Button
            className="w-full mt-4 bg-rose-500 text-white font-[1000] h-10 rounded-xl shadow-xl uppercase text-[11px] italic"
            isLoading={isDeleting}
            onPress={handleDelete}
            startContent={<Trash2 size={14} />}
          >
            Revoke Access
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative z-10">
          <p className="text-[10px] text-slate-400 italic mb-3 leading-tight">
            Generate a new invite code for students to join {classCode} - {semesterCode}.
          </p>
          <div className="mt-auto space-y-3">
            <Input 
              label={<span className="text-slate-400 text-[10px] italic">Valid Duration (minutes)</span>} 
              size="sm" 
              variant="bordered"
              value={minutesValid}
              onValueChange={setMinutesValid}
              classNames={{
                input: "text-white font-bold text-xs",
                inputWrapper: "border-white/20 hover:border-white/40 focus-within:border-[#FF5C00] h-9 min-h-9",
              }}
            />
            <Button
              className="w-full bg-[#FF5C00] text-[#071739] font-[1000] h-10 rounded-xl shadow-xl uppercase text-[11px] italic"
              isLoading={isCreating}
              onPress={handleCreate}
            >
              Create Invite Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
