"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  Pagination,
  Spinner,
  Chip,
} from "@heroui/react";

import {
  Pencil,
  ChevronDown,
  Code2,
  Eye,
  EyeOff,
  BadgeCheck,
  Hourglass,
  Plus,
  Download,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useGetClassDetailQuery } from "@/store/queries/Class";
import { useGetClassSlotsQuery, usePublishClassSlotMutation } from "@/store/queries/ClassSlot";
import { ClassSlotResponse } from "@/types";
import { useModal } from "@/Provider/ModalProvider";
import CreateSlotForm from "@/app/Management/Class/CreateClassSlotModal";
import AddStudentModal from "@/app/Management/Class/[id]/Member/AddStudentToCLass";
import UpdateDueDateModal from "@/app/Management/Class/[id]/UpdateDuaDateModal";
type Props = {
  id: string;
 onBack?: () => void;
};

export default function ClassSemesterDetail({ id,onBack }: Props) {
  const router = useRouter();
  const classId = id;

  const [publishSlot] = usePublishClassSlotMutation();
  // const [exportClass] = useExportClassMutation();

  const [mounted, setMounted] = useState(false);
  const [slotPage, setSlotPage] = useState(1);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const { openModal } = useModal();
  const rowsPerPage = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: classData } = useGetClassDetailQuery({ id: classId });
  const { data: slotData, isLoading: slotLoading } = useGetClassSlotsQuery(classId);

  const classDetail = classData?.data;
  const slots = slotData?.data ?? [];

  // === Mở Modal Create Slot ===
  const openCreateSlotModal = () => {
    openModal({
      content: <CreateSlotForm classId={classId} />,
    });
  };

  const handleExport = async () => {
    try {
      // const blob = await exportClass(...).unwrap();   // uncomment khi API sẵn
      // ... xử lý download
      console.log("Export class", classId);
    } catch (error) {
      console.error("Failed to export class", error);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 text-[#071739] dark:text-white max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-8">
        {/* LEFT */}
        <div className="flex flex-col gap-6">
            {onBack && (
                    <Button isIconOnly size="sm" variant="flat" onPress={onBack}>
                                  ←
                                </Button>
                    )}

          <div className="space-y-2">
            <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter leading-none">
              {classDetail?.classCode || classId}
            </h2>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-3 items-center" style={{ marginTop: 60 }}>
          <Button
            startContent={<Download size={16} strokeWidth={3} />}
            size="lg"
            color="success"
            variant="flat"
            onPress={handleExport}
            className="font-black h-11 px-6 rounded-xl shadow-sm uppercase text-[10px] tracking-wider transition-all text-emerald-700"
          >
            EXPORT
          </Button>

          <Button
            startContent={<Plus size={20} strokeWidth={3} />}
            size="lg"
            color="warning"
            onPress={() =>
              openModal({
                content: <AddStudentModal classId={classId} />,
              })
            }
            className="text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
          >
            ADD STUDENT
          </Button>

          {/* NÚT TẠO SLOT MỚI - Màu cam nổi bật */}
          <Button
            startContent={<Plus size={20} strokeWidth={3} />}
            size="lg"
            className="bg-[#FF5C00] hover:bg-orange-600 text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
            onPress={openCreateSlotModal}
          >
            CREATE NEW SLOT
          </Button>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        variant="underlined"
        classNames={{
          cursor: "bg-[#FF5C00]",
          tab: "font-black uppercase italic text-sm h-12 mr-12",
          tabContent: "group-data-[selected=true]:text-[#FF5C00]",
        }}
      >
        <Tab key="slots" title="Class Curriculum">
          <div className="flex flex-col gap-4 mt-8">
            {slotLoading && (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            )}

            {slots
              .slice((slotPage - 1) * rowsPerPage, slotPage * rowsPerPage)
              .map((slot: ClassSlotResponse) => (
                <Card
                  key={slot.id}
                  className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-sm overflow-hidden border border-transparent hover:border-[#FF5C00]/30 transition-all"
                >
                  <CardBody className="p-0">
                    <div
                      className="p-6 flex items-center justify-between group cursor-pointer"
                      onClick={() =>
                        setExpandedSlot(expandedSlot === slot.id ? null : slot.id)
                      }
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 rounded-2xl bg-slate-100 text-slate-400">
                          {slot.isPublished ? (
                            <BadgeCheck size={24} className="text-emerald-500" />
                          ) : (
                            <Hourglass size={24} className="text-slate-400" />
                          )}
                        </div>

                        <div>
                          <h4 className="font-black text-lg uppercase italic group-hover:text-[#FF5C00] transition-colors">
                            Slot no {slot.slotNo}: {slot.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            {slot.openAt ?? "N/A"} — {slot.closeAt ?? "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          color="warning"
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() =>
                            openModal({
                              content: (
                                <UpdateDueDateModal
                                  classId={classId}
                                  slotId={slot.id}
                                  dueAt={slot.dueAt}
                                  closeAt={slot.closeAt}
                                />
                              ),
                            })
                          }
                        >
                          <Pencil size={14} />
                        </Button>

                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() =>
                            publishSlot({
                              classId,
                              slotId: slot.id,
                            })
                          }
                        >
                          {slot.isPublished ? (
                            <Eye className="text-emerald-500" size={18} />
                          ) : (
                            <EyeOff className="text-gray-400" size={18} />
                          )}
                        </Button>

                        <ChevronDown
                          size={20}
                          className={`text-slate-300 transition-transform ${
                            expandedSlot === slot.id ? "rotate-180 text-[#FF5C00]" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {expandedSlot === slot.id && (
                      <div className="px-10 pb-10 border-t border-divider dark:border-white/5">
                        <div className="space-y-4 mt-8">
                          <p className="text-[11px] font-[1000] uppercase italic text-blue-600 flex items-center gap-2">
                            <Code2 size={14} /> Assigned Problems
                          </p>

                          {slot.problems?.map((p) => (
                            <div
                              key={p.problemId}
                              onClick={() => router.push(`/Problems/${p.problemSlug}`)}
                              className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border dark:border-white/5 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                              <p className="font-black text-xs uppercase italic">
                                {p.problemTitle}
                              </p>
                              <Chip size="sm" variant="flat" className="font-black uppercase text-[8px]">
                                {p.points ?? 0} pts
                              </Chip>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}

            <Pagination
              total={Math.ceil(slots.length / rowsPerPage)}
              page={slotPage}
              onChange={setSlotPage}
              className="self-center mt-6"
            />
          </div>
        </Tab>
{/* 
        <Tab key="members" title="Members">
          <ClassMembersPage params={params} />
        </Tab> */}
      </Tabs>
    </div>
  );
}