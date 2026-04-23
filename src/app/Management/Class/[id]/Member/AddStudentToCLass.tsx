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
import { useGetStudentsNotYetQuery } from "@/store/queries/Class";
import { Users, ErrorForm } from "@/types";

interface Props {
  semesterId: string;
}

export default function AddStudentModal({ semesterId }: Props) {
  const { closeModal } = useModal();

  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<any>(null);

  const [addMember, { isLoading }] = useAddClassMembersMutation();

  const { data: studentResponse, isLoading: studentLoading } = useGetStudentsNotYetQuery(
    {
      classSemesterId: semesterId,
      search: search.trim() || undefined,
    },
    {
      skip: !!selectedKey, // Bỏ qua viêc fetch lại API khi đã chọn xong user
    }
  );

  const students = studentResponse?.data?.items || [];
    console.log("students", students);
  // Đảm bảo selectedUser luôn có trong danh sách để tránh lỗi văng app của HeroUI 
  // (khi selectedKey không có trong ds render)
  const studentsList: any[] = [...students];
  if (selectedUser && !studentsList.find((s: any) => s.userId === selectedUser.userId)) {
    studentsList.push(selectedUser);
  }

  const handleInputChange = (value: string) => {
    setSearch(value);
    
    // Nếu gõ hoặc xoá khác với đoạn text của user đã chọn, reset về trạng thái chưa chọn
    if (selectedUser) {
      const userText = selectedUser.email || selectedUser.displayName || `${selectedUser.firstName} ${selectedUser.lastName}`;
      if (value !== userText) {
        setSelectedUser(null);
        setSelectedKey(null);
      }
    } else if (!value) {
      setSelectedUser(null);
      setSelectedKey(null);
    }
  };

  const handleSelectionChange = (key: any) => {
    if (!key) {
      setSelectedUser(null);
      setSelectedKey(null);
      return;
    }

    const user = studentsList.find((u: Users) => String(u.userId) === String(key));
    
    if (user) {
      setSelectedUser(user);
      setSelectedKey(key);
      setSearch(user.email || user.displayName || `${user.firstName} ${user.lastName}`); // Hiển thị tên/email vào ô input
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error("Please select a student");
      return;
    }

    try {
      await addMember({
        classSemesterId: semesterId,
        data: {
          memberCode: selectedUser.memberCode ?? null,
          rollNumber: selectedUser.rollNumber ?? null,
        },
      }).unwrap();

      toast.success("Student added successfully");
      closeModal();
    } catch (error) {
      console.error("error", error);
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
            Search student by email or name
          </p>
        </div>
      </div>

      <Divider />

      {/* AUTOCOMPLETE - ĐÃ SỬA */}
      <Autocomplete
        label="Student"
        placeholder="Type email or name..."
        isLoading={studentLoading}
        variant="bordered"
        inputValue={search}
        onInputChange={handleInputChange}            // ← Dùng onChange mới
        selectedKey={selectedKey}                    // ← Quan trọng
        onSelectionChange={handleSelectionChange}    // ← Dùng hàm riêng
        allowsCustomValue={false}
      >
        {studentsList.map((u: Users) => (
          <AutocompleteItem 
            key={u.userId!} 
            textValue={u.email || ""}
          >
            <div className="flex flex-col">
              <span className="font-semibold">
                {u.displayName || `${u.firstName} ${u.lastName}`}
              </span>
              <span className="text-xs text-slate-500">{u.email}</span>
              {u.rollNumber && (
                <span className="text-xs text-slate-400">MS: {u.rollNumber}</span>
              )}
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