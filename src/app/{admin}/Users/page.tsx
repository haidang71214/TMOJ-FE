"use client";

import React, { useMemo, useState, useRef } from "react";
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
  addToast,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { Edit3, UserPlus, Shield, Lock, Unlock, KeyRound, Download, Upload } from "lucide-react";
import { Users as ApiUser } from "@/types";
import { useGetUserListQuery, useDownloadImportUserTemplateMutation, useImportUsersMutation, useLockUserMutation, useUnlockUserMutation, useAssignRoleMutation } from "@/store/queries/user";
import { useModal } from "@/Provider/ModalProvider";
import CreateUserModal from "./CreateUserModal";

const ROWS_PER_PAGE = 10;

export default function UserManagerPage() {
  const { openModal } = useModal();
  const [page, setPage] = useState(1);
 const { data, isLoading } = useGetUserListQuery();
  const [downloadTemplate, { isLoading: isDownloading }] = useDownloadImportUserTemplateMutation();
  const [importUsers, { isLoading: isImporting }] = useImportUsersMutation();
  const [lockUser] = useLockUserMutation();
  const [unlockUser] = useUnlockUserMutation();
  const [assignRole] = useAssignRoleMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAssignRole = async (user: ApiUser, key: string | number) => {
    try {
      await assignRole({ id: user.userId, data: { roleCode: key.toString() } }).unwrap();
      addToast({ title: `Role changed to ${key} successfully`, color: "success" });
    } catch (error) {
      addToast({ title: "Failed to change role", color: "danger" });
    }
  };
  
  const handleToggleLock = async (u: ApiUser) => {
    try {
      if (u.isLocked) {
        await unlockUser(u.userId).unwrap();
        addToast({ title: "Account unlocked successfully", color: "success" });
      } else {
        await lockUser(u.userId).unwrap();
        addToast({ title: "Account locked successfully", color: "success" });
      }
    } catch (e) {
      console.error("Lock/Unlock error:", e);
      addToast({ title: "Failed to update account status", color: "danger" });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadTemplate().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "user_import_template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Template download error:", error);
      addToast({ title: "Failed to download template", color: "danger" });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await importUsers(formData).unwrap();
      addToast({ title: `Import successful: ${res.data.successCount} succeeded, ${res.data.failedCount} failed`, color: "success" });
    } catch (error) {
      console.log(error);
      
      addToast({ title: "Failed to import users", color: "danger" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
        Loading users...
      </div>
    );
  }

  if (apiUsers.length === 0) {
    return (
      <div className="p-10 text-center text-slate-500 dark:text-slate-400">
        No users found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            <span className="text-indigo-600 dark:text-indigo-400">User</span>{" "}
            <span className="text-purple-500">Management</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-2 italic text-slate-500 dark:text-slate-400">
            Manage users, roles, permissions & security
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            startContent={<Download size={18} />}
            onClick={handleDownloadTemplate}
            isLoading={isDownloading}
            className="bg-emerald-500 text-white dark:bg-emerald-600 font-black h-11 px-6 rounded-xl shadow-lg shadow-emerald-500/20 uppercase text-[10px] tracking-wider transition-transform hover:scale-105 active:scale-95"
          >
            Template
          </Button>

          <div>
            <input
              type="file"
              accept=".xlsx"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImport}
            />
            <Button
              startContent={<Upload size={18} />}
              onClick={() => fileInputRef.current?.click()}
              isLoading={isImporting}
              className="bg-sky-500 text-white dark:bg-sky-600 font-black h-11 px-6 rounded-xl shadow-lg shadow-sky-500/20 uppercase text-[10px] tracking-wider transition-transform hover:scale-105 active:scale-95"
            >
              Import
            </Button>
          </div>

          <Button
            startContent={<UserPlus size={18} />}
            onClick={() => openModal({ content: <CreateUserModal /> })}
            className="bg-indigo-500 text-white dark:bg-indigo-600 font-black h-11 px-6 rounded-xl shadow-lg shadow-indigo-500/20 uppercase text-[10px] tracking-wider transition-transform hover:scale-105 active:scale-95"
          >
            New User
          </Button>
        </div>
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
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>

          <TableBody>
            {items.map((u: ApiUser) => (
              <TableRow key={u.userId}>
                <TableCell className="text-xs text-slate-400">#{u.userId}</TableCell>
                <TableCell className="font-black">{u.username}</TableCell>
                <TableCell>{`${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username}</TableCell>
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
                    <Tooltip content="Edit user">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => openEditModal(u)}
                      >
                        <Edit3 size={16} />
                      </Button>
                    </Tooltip>

                    {u.role !== 'admin' ? (
                      <Dropdown>
                        <DropdownTrigger>
                           <Button isIconOnly size="sm" variant="flat" aria-label="Change role">
                             <Shield size={16} />
                           </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Assign Role" onAction={(key) => handleAssignRole(u, key)}>
                          {['manager', 'teacher', 'student']
                            .filter(role => role !== u.role)
                            .map(role => (
                              <DropdownItem key={role} className="capitalize">
                                Set as {role}
                              </DropdownItem>
                            ))}
                        </DropdownMenu>
                      </Dropdown>
                    ) : (
                      <Tooltip content="Cannot change admin role">
                        <Button isIconOnly size="sm" variant="flat" isDisabled>
                          <Shield size={16} className="text-slate-400" />
                        </Button>
                      </Tooltip>
                    )}

                    <Tooltip content={u.isLocked ? "Unlock account" : "Lock account"}>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color={u.isLocked ? "danger" : "primary"}
                        onPress={() => handleToggleLock(u)}
                      >
                        {u.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                      </Button>
                    </Tooltip>

                    <Tooltip content="Reset password">
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
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} classNames={{ backdrop: "bg-black/50 backdrop-blur-md" }}>
        <ModalContent className="m-4">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold">
                Edit user {selectedUser?.username}
              </ModalHeader>
              <ModalBody className="gap-6 py-6">
                <Input
                  label="Full Name"
                  value={editFullName}
                  onValueChange={setEditFullName}
                  variant="bordered"
                />
                <Input
                  label="Email Address"
                  value={editEmail}
                  onValueChange={setEditEmail}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 text-white font-bold"
                  onPress={handleSaveEdit}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}