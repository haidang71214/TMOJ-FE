"use client";
import React, { useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Timer, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  // Bổ sung currentEndTime vào interface nếu dữ liệu có sẵn,
  // ở đây tôi tạm lấy thời gian hiện tại làm mốc cũ nếu không có.
  contest: { id: number; title: string; currentEndTime?: string } | null;
}

export default function ExtendTimeModal({
  isOpen,
  onOpenChange,
  contest,
}: Props) {
  const [minutes, setMinutes] = useState("30");
  const [isUpdating, setIsUpdating] = useState(false);

  // Giả lập thời gian cũ (Nếu contest không có currentEndTime thì lấy ngay bây giờ)
  const currentEndTime = useMemo(() => {
    return contest?.currentEndTime
      ? new Date(contest.currentEndTime)
      : new Date();
  }, [contest]);

  // Tính toán thời gian kết thúc mới dựa trên số phút nhập vào
  const newEndTime = useMemo(() => {
    const time = new Date(currentEndTime);
    const offset = parseInt(minutes) || 0;
    time.setMinutes(time.getMinutes() + offset);
    return time;
  }, [currentEndTime, minutes]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleExtend = async (onClose: () => void) => {
    const mins = parseInt(minutes);
    if (isNaN(mins) || mins <= 0) {
      toast.error("Please enter a valid number of minutes.");
      return;
    }

    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Time extended successfully!", {
      description: `Contest #${contest?.id} will now end at ${formatTime(
        newEndTime
      )}`,
      style: { fontWeight: "bold", fontStyle: "italic" },
    });

    setIsUpdating(false);
    onClose();
  };

  const quickOptions = ["15", "30", "60", "120"];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-[2rem]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center text-[#FF5C00] uppercase italic font-[1000] text-xl pt-8 px-8">
              <Timer size={24} strokeWidth={2.5} />
              Extend Contest Time
            </ModalHeader>
            <ModalBody className="px-8 py-4 gap-6">
              {/* Thông tin Contest & Thời gian hiện tại */}
              <div className="space-y-3">
                <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                  <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-1 tracking-widest">
                    Target Contest
                  </p>
                  <p className="text-sm font-bold italic text-[#071739] dark:text-white truncate">
                    #{contest?.id} - {contest?.title}
                  </p>
                </div>

                {/* BẢNG SO SÁNH THỜI GIAN */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                      Old End Time
                    </p>
                    <p className="text-[11px] font-bold dark:text-slate-300">
                      {formatTime(currentEndTime)}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-[#FF5C00]" />
                  <div className="text-center">
                    <p className="text-[9px] font-black text-[#00FF41] uppercase mb-1">
                      New End Time
                    </p>
                    <p className="text-[11px] font-[1000] text-[#00FF41] animate-pulse">
                      {formatTime(newEndTime)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
                    Quick Select (Minutes)
                  </span>
                  <div className="flex gap-2">
                    {quickOptions.map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={minutes === opt ? "solid" : "flat"}
                        onPress={() => setMinutes(opt)}
                        className={
                          minutes === opt
                            ? "bg-[#FF5C00] text-white font-[1000] italic"
                            : "font-bold italic dark:bg-[#071739]"
                        }
                      >
                        +{opt}m
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
                    Custom Minutes
                  </span>
                  <Input
                    type="number"
                    value={minutes}
                    onValueChange={setMinutes}
                    variant="flat"
                    classNames={{
                      inputWrapper:
                        "bg-slate-100 dark:bg-[#071739] rounded-xl border-2 border-transparent focus-within:!border-[#FF5C00] transition-all h-12",
                      input: "font-[1000] italic text-lg dark:text-white",
                    }}
                    startContent={
                      <Clock size={18} className="text-slate-400" />
                    }
                    endContent={
                      <span className="text-[10px] font-black text-slate-400 italic">
                        MINS
                      </span>
                    }
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="gap-3 px-8 pb-8 mt-4">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase italic text-xs text-slate-500"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#00FF41] text-[#071739] font-[1000] uppercase italic text-xs px-10 rounded-xl shadow-lg shadow-green-500/20 hover:brightness-110 active:scale-95 transition-all"
                isLoading={isUpdating}
                onPress={() => handleExtend(onClose)}
              >
                Confirm Extension
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
