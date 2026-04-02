"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Chip,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";

import { Edit3, UserPlus, Shield, Lock, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { Users as ApiUser } from "@/types";
import { useGetUserListQuery } from "@/store/queries/user";

const ROWS_PER_PAGE = 10;

export default function UserManagerPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
 const { data, isLoading } = useGetUserListQuery();

const apiUsers = data?.data ?? [];
console.log("aaaaaaaaaaa", apiUsers);

const items = useMemo(() => {
  const start = (page - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  return apiUsers.slice(start, end);
}, [apiUsers, page]);
  const openEditModal = (user: ApiUser) => {
    setSelectedUser(user);
    setEditFullName(`${user.firstName} " " ${user.lastName}` || "");
    setEditEmail(user.email || ""); // giả sử type có email
    setIsEditModalOpen(true);
  };
  
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Phân trang client-side
  const pages = Math.ceil(apiUsers?.length / ROWS_PER_PAGE);


  const handleSaveEdit = () => {
    // TODO: Gọi API update user ở đây
    console.log("Save user:", selectedUser?.userId, { fullName: editFullName, email: editEmail });
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center font-bold text-indigo-600 dark:text-cyan-400">
        Đang tải danh sách người dùng...
      </div>
    );
  }

  if (apiUsers.length === 0) {
    return (
      <div className="p-10 text-center text-slate-500 dark:text-slate-400">
        Chưa có người dùng nào.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            <span className="text-indigo-700 dark:text-cyan-400">User</span>{" "}
            <span className="text-fuchsia-500">Management</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-2 italic text-slate-500 dark:text-indigo-400">
            Quản lý người dùng, vai trò, quyền hạn & bảo mật
          </p>
        </div>

        <Button
          startContent={<UserPlus size={18} />}
          onClick={() => router.push("/Management/Admin/create")}
          className="bg-indigo-600 text-white dark:bg-gradient-to-r dark:from-cyan-400 dark:to-fuchsia-500 dark:text-black font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider active:scale-95"
        >
          Tạo người dùng mới
        </Button>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <Table
          removeWrapper
          classNames={{
            base: `
              rounded-2xl p-4
              bg-white border border-slate-200 shadow-sm
              dark:bg-black/40 dark:border-white/10 dark:backdrop-blur-xl
            `,
            th: `
              text-slate-400 dark:text-indigo-400
              font-black uppercase tracking-widest text-[10px]
              border-b border-slate-100 dark:border-white/5
              pb-4
            `,
            td: `
              py-6 font-bold
              text-slate-700 dark:text-slate-200
              border-b border-slate-50 dark:border-white/5
              last:border-none
            `,
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>FULL NAME</TableColumn>
            <TableColumn>ROLE</TableColumn>
            {/* <TableColumn>STATUS</TableColumn> */}
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>

          <TableBody>
            {items.map((u: ApiUser) => (
              <TableRow key={u.userId}>
                <TableCell className="text-xs text-slate-400">#{u.userId}</TableCell>
                <TableCell className="font-black">{u.username}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="primary">
                    {u.role}
                  </Chip>
                </TableCell>
                {/* <TableCell>
                  <Chip
                    size="sm"
                    color={u.status === "Active" ? "success" : "danger"}
                  >
                    {u.status}
                  </Chip>
                </TableCell> */}
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content="Chỉnh sửa thông tin">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => openEditModal(u)}
                      >
                        <Edit3 size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Thay đổi vai trò">
                      <Button isIconOnly size="sm" variant="flat">
                        <Shield size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Khóa / Mở tài khoản">
                      <Button isIconOnly size="sm" variant="flat">
                        <Lock size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Reset mật khẩu">
                      <Button isIconOnly size="sm" variant="flat">
                        <KeyRound size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {pages > 1 && (
          <div className="flex justify-center py-6">
            <Pagination
              isCompact
              showControls
              page={page}
              total={pages}
              onChange={setPage}
              color="primary"
            />
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold">
                Chỉnh sửa người dùng {selectedUser?.username}
              </ModalHeader>
              <ModalBody className="gap-6 py-6">
                <Input
                  label="Họ và tên"
                  value={editFullName}
                  onValueChange={setEditFullName}
                  variant="bordered"
                />
                <Input
                  label="Email"
                  value={editEmail}
                  onValueChange={setEditEmail}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Hủy
                </Button>
                <Button
                  className="bg-indigo-600 text-white font-bold"
                  onPress={handleSaveEdit}
                >
                  Lưu thay đổi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}