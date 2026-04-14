"use client";

import { useState } from "react";
import {
  Button,
  Divider,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { useModal } from "@/Provider/ModalProvider";
import { useAddClassMembersMutation } from "@/store/queries/Class";
import { useGetUserRoleQuery } from "@/store/queries/user";
import { Users, ErrorForm } from "@/types";

interface Props {
  classId: string;
}

export default function AddStudentModal({ classId }: Props) {
  const { closeModal } = useModal();

  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  console.log("selectedUser", selectedUser);

  const [addMember, { isLoading }] = useAddClassMembersMutation();

  const { data: studentData, isLoading: studentLoading } =
    useGetUserRoleQuery({
      roleName: "student",
    });
  console.log("studentData", studentData);

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error("Please select a student");
      return;
    }
    console.log("selectedUser", selectedUser);
    
    try {
      const res = await addMember({
        id: classId,
        data: {
          memberCode: selectedUser.memberCode ?? null,
          rollNumber: selectedUser.rollNumber ?? null,
        },
      }).unwrap();
      console.log("asdasdasd", res);

      toast.success("Student added successfully");
      closeModal();
    } catch (error) {
      console.log("error", error);
      const err = error as ErrorForm;
      
      if (err?.data?.data?.message) {
        toast.error(err.data.data.message);
      } else {
        toast.error("Failed to add student");
      }
    }
  };

  return (
    <div className="w-[460px] bg-white dark:bg-[#0f172a] p-7 rounded-3xl flex flex-col gap-6 shadow-2xl border dark:border-white/10">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600 text-white">
          <UserPlus size={18} />
        </div>

        <div>
          <h3 className="font-black text-lg text-[#071739] dark:text-white uppercase">
            Add Student
          </h3>
          <p className="text-xs text-slate-500">
            Search student by email
          </p>
        </div>
      </div>

      <Divider />

      {/* AUTOCOMPLETE */}

      <Autocomplete
        label="Student Email"
        placeholder="Type email..."
        isLoading={studentLoading}
        variant="bordered"
        onSelectionChange={(key) => {
          const user = studentData?.data?.find(
            (u: Users) => u.userId === key
          );
          if (user) setSelectedUser(user);
        }}
      >
        {(studentData?.data || []).map((u: Users) => (
          <AutocompleteItem key={u.userId} textValue={u.email}>
            <div className="flex flex-col">
              <span className="font-semibold">{u.displayName}</span>
              <span className="text-xs text-slate-500">{u.email}</span>
            </div>
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Divider />

      {/* BUTTONS */}

      <div className="flex justify-end gap-3">

        <Button variant="flat" radius="lg" onPress={closeModal}>
          Cancel
        </Button>

        <Button
          color="primary"
          radius="lg"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="font-bold px-6"
        >
          Add Student
        </Button>

      </div>
    </div>
  );
}