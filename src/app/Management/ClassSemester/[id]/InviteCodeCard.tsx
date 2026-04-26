"use client";

import React, { useState, useEffect } from "react";
import { Button, Spinner, Input, addToast } from "@heroui/react";
import { Rocket, Trash2, Clock } from "lucide-react";
import { 
  useGetInviteCodeQuery, 
  useCreateInviteCodeMutation, 
  useDeleteInviteCodeMutation 
} from "@/store/queries/InviteCode";
import { useTranslation } from "@/hooks/useTranslation";
import { ErrorForm } from "@/types";

interface InviteCodeCardProps {
  classSemesterId: string;
  classCode: string;
  semesterCode: string;
}

export default function InviteCodeCard({ classSemesterId, classCode, semesterCode }: InviteCodeCardProps) {
  const { t, language } = useTranslation();
  const { data: inviteCodeData, isLoading: codeLoading } = useGetInviteCodeQuery(classSemesterId);
  const [createCode, { isLoading: isCreating }] = useCreateInviteCodeMutation();
  const [deleteCode, { isLoading: isDeleting }] = useDeleteInviteCodeMutation();
  
  const [minutesValid, setMinutesValid] = useState("1440"); // default 7 days in minutes
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const inviteDataObj = (inviteCodeData as any)?.data || inviteCodeData;
  const codeString = inviteDataObj?.inviteCode || null;
  const expiresAt = inviteDataObj?.expiresAt;
  const isActive = inviteDataObj?.isActive;

  useEffect(() => {
    if (!isActive || !expiresAt) {
      setTimeLeft(null);
      return;
    }
    
    const updateTimer = () => {
      const end = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const diff = (end - now) / 1000;
      if (diff > 0) {
        setTimeLeft(diff);
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isActive, expiresAt]);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (d > 0) {
      return `${d}d ${h}h ${m}m`;
    }
    if (h > 0) {
      return `${h}h ${m}m ${s}s`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCreate = async () => {
    try {
      await createCode({ classSemesterId, data: { minutesValid: Number(minutesValid) || 1440 } }).unwrap();
      addToast({ title: t('class_semester.invite_code_created') || (language === 'vi' ? 'Tạo mã mời thành công' : 'Invite code created successfully'), color: "success" });
    } catch (err) {
      const apiError = err as ErrorForm;
      addToast({ title: t('class_semester.invite_code_failed') || (language === 'vi' ? 'Tạo mã mời thất bại' : 'Failed to create invite code'), description: apiError?.data?.data?.message || "", color: "danger" });
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCode(classSemesterId).unwrap();
      addToast({ title: t('class_semester.invite_code_deleted') || (language === 'vi' ? 'Đã xóa mã mời' : 'Invite code deleted'), color: "success" });
    } catch (err) {
      const apiError = err as ErrorForm;
      addToast({ title: t('class_semester.invite_code_delete_failed') || (language === 'vi' ? 'Xóa mã mời thất bại' : 'Failed to delete invite code'), description: apiError?.data?.data?.message || "", color: "danger" });
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[280px] p-5 rounded-[1.5rem] bg-[#071739] text-white flex flex-col gap-4 relative overflow-hidden shadow-2xl h-full min-h-[150px]">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Rocket size={80} />
      </div>

      <h3 className="text-[11px] font-black uppercase italic tracking-widest text-[#FF5C00] relative z-10">
        {t('class_semester.class_enrollment') || (language === 'vi' ? 'THAM GIA LỚP' : 'CLASS ENROLLMENT')}
      </h3>

      {codeLoading ? (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <Spinner color="warning" size="sm" />
        </div>
      ) : codeString && isActive ? (
        <div className="flex-1 flex flex-col relative z-10">
          <p className="text-[10px] text-slate-400 italic mb-3 leading-tight animate-fade-in-down">
            {t('class_semester.enrollment_open_msg') || (language === 'vi' ? 'Lớp này hiện đang mở để học viên tham gia.' : 'This class is currently open for enrollment.')}
          </p>
          <div className="flex-1 flex flex-col items-center justify-center p-3 bg-black/30 rounded-xl border border-white/10 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "100ms" }}>
            <span className="font-[1000] text-xl tracking-widest text-emerald-400 break-all text-center">
              {codeString}
            </span>
            {timeLeft !== null && (
              <div className="flex items-center justify-center gap-1 mt-2 text-rose-400 text-[10px] font-bold">
                <Clock size={12} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          <Button
            className="w-full mt-4 bg-rose-500 text-white font-[1000] h-10 rounded-xl shadow-xl uppercase text-[11px] italic animate-fade-in-up"
            style={{ animationFillMode: "both", animationDelay: "200ms" }}
            isLoading={isDeleting}
            onPress={handleDelete}
            startContent={<Trash2 size={14} />}
          >
            {t('class_semester.revoke_access') || (language === 'vi' ? 'Thu hồi mã mời' : 'Revoke Access')}
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative z-10">
          <p className="text-[10px] text-slate-400 italic mb-3 leading-tight animate-fade-in-down">
            {language === 'vi' 
              ? `Tạo một mã mời mới để học viên tham gia lớp ${classCode} - ${semesterCode}.` 
              : `Generate a new invite code for students to join ${classCode} - ${semesterCode}.`}
          </p>
          <div className="mt-auto space-y-3">
            <div className="animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "100ms" }}>
              <Input 
                label={<span className="text-slate-400 text-[10px] italic">{t('class_semester.valid_duration') || (language === 'vi' ? 'Thời gian hiệu lực (phút)' : 'Valid Duration (minutes)')}</span>} 
                size="sm" 
                variant="bordered"
                value={minutesValid}
                onValueChange={setMinutesValid}
                classNames={{
                  input: "text-white font-bold text-xs",
                  inputWrapper: "border-white/20 hover:border-white/40 focus-within:border-[#FF5C00] h-9 min-h-9",
                }}
              />
            </div>
            <Button
              className="w-full bg-[#FF5C00] text-[#071739] font-[1000] h-10 rounded-xl shadow-xl uppercase text-[11px] italic animate-fade-in-up"
              style={{ animationFillMode: "both", animationDelay: "200ms" }}
              isLoading={isCreating}
              onPress={handleCreate}
            >
              {t('class_semester.create_invite_code') || (language === 'vi' ? 'Tạo mã mời' : 'Create Invite Code')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
