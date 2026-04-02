"use client";

import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Spinner,
  Avatar,
} from "@heroui/react";
import { toast } from "sonner";
import { UserCog } from "lucide-react";

import { useModal } from "@/Provider/ModalProvider";
import { useUpdateClassTeacherMutation } from "@/store/queries/Class";
import { useGetUserRoleQuery } from "@/store/queries/user";
import { Users } from "@/types";

interface Props {
  classId: string;
  currentTeacherId?: string;
}

export default function UpdateTeacherModal({
  classId,
  currentTeacherId,
}: Props) {
  const { closeModal } = useModal();

  const [updateTeacher, { isLoading }] = useUpdateClassTeacherMutation();

  const { data: teacherData, isLoading: teacherLoading } =
    useGetUserRoleQuery({
      roleName: "teacher",
    });

  const teachers = teacherData?.data ?? [];

  const [teacherId, setTeacherId] = useState<string>(
    currentTeacherId ?? ""
  );

  const handleSubmit = async () => {
    if (!teacherId) {
      toast.error("Please select a teacher");
      return;
    }

    try {
      await updateTeacher({
        id: classId,
        data: {
          teacherId,
        },
      }).unwrap();

      toast.success("Teacher updated successfully");
      closeModal();
    } catch {
      toast.error("Failed to update teacher");
    }
  };

  return (
    <div className="w-[460px] bg-white dark:bg-[#0f172a] p-7 rounded-3xl flex flex-col gap-6 shadow-2xl border dark:border-white/10">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600 text-white">
          <UserCog size={18} />
        </div>

        <div>
          <h3 className="font-black text-lg text-[#071739] dark:text-white uppercase tracking-wide">
            Update Teacher
          </h3>
          <p className="text-xs text-slate-500">
            Assign a teacher to this class
          </p>
        </div>
      </div>

      {/* SELECT */}
      {teacherLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <Select
          label="Select Teacher"
          variant="bordered"
          selectedKeys={teacherId ? [teacherId] : []}
          onSelectionChange={(keys) =>
            setTeacherId(Array.from(keys)[0] as string)
          }
          classNames={{
            trigger:
              "h-14 rounded-xl border-slate-300 dark:border-white/10",
            label: "text-xs font-bold uppercase tracking-wider",
          }}
        >
          {teachers.map((t: Users) => (
            <SelectItem
              key={t.userId}
              textValue={t.displayName}
            >
              <div className="flex items-center gap-3 py-1">

                <Avatar
                  size="sm"
                  src={t.avatarUrl ?? ""}
                  name={t.displayName}
                />

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#071739] dark:text-white">
                    {t.displayName}
                  </span>

                  <span className="text-xs text-slate-500">
                    {t.email}
                  </span>
                </div>

              </div>
            </SelectItem>
          ))}
        </Select>
      )}

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 pt-2">

        <Button
          variant="flat"
          radius="lg"
          onPress={closeModal}
          className="font-semibold"
        >
          Cancel
        </Button>

        <Button
          color="primary"
          radius="lg"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="font-bold px-6"
        >
          Update Teacher
        </Button>

      </div>
    </div>
  );
}