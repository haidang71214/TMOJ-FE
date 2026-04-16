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
  Avatar,
} from "@heroui/react";

import { Edit3, UserPlus, Shield, Lock, Unlock, Download, Upload, Search, User, AtSign, Type, Lock as LockIcon, Sparkles } from "lucide-react";
import { Users as ApiUser } from "@/types";
import { useGetUserListQuery, useDownloadImportUserTemplateMutation, useImportUsersMutation, useLockUserMutation, useUnlockUserMutation, useAssignRoleMutation, useUpdateUserMutation } from "@/store/queries/user";
import { useModal } from "@/Provider/ModalProvider";
import CreateUserModal from "./CreateUserModal";

const ROWS_PER_PAGE = 10;

export default function UserManagerPage() {
  const { openModal } = useModal();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetUserListQuery();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Sync data to local state for better control/stability
  React.useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);

  const ROLE_ORDER: Record<string, number> = {
    admin: 1,
    manager: 2,
    teacher: 3,
    student: 4,
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const pA = ROLE_ORDER[a.role as keyof typeof ROLE_ORDER] || 99;
      const pB = ROLE_ORDER[b.role as keyof typeof ROLE_ORDER] || 99;

      if (pA !== pB) return pA - pB;
      return (a.username ?? "").localeCompare(b.username ?? "");
    });
  }, [users]);

  const filteredItems = useMemo(() => {
    let filtered = [...sortedUsers];

    if (filterValue) {
      filtered = filtered.filter((u) =>
        u.username.toLowerCase().includes(filterValue.toLowerCase()) ||
        (u.displayName && u.displayName.toLowerCase().includes(filterValue.toLowerCase())) ||
        u.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    return filtered;
  }, [sortedUsers, filterValue, roleFilter]);

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [filterValue, roleFilter]);
  const [downloadTemplate, { isLoading: isDownloading }] = useDownloadImportUserTemplateMutation();
  const [importUsers, { isLoading: isImporting }] = useImportUsersMutation();
  const [lockUser] = useLockUserMutation();
  const [unlockUser] = useUnlockUserMutation();
  const [assignRole] = useAssignRoleMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
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
      if (u.status === false) {
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

const items = useMemo(() => {
  const start = (page - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  return filteredItems.slice(start, end);
}, [filteredItems, page]);
  const openEditModal = (user: ApiUser) => {
    setSelectedUser(user);
    setEditDisplayName(user.displayName || "");
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditUsername(user.username || "");
    setEditPassword("");
    setPasswordError("");
    setIsEditModalOpen(true);
  };
  
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Phân trang client-side
  const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);


  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  const handlePasswordChange = (val: string) => {
    setEditPassword(val);
    if (!val) {
      setPasswordError("");
    } else if (!PASSWORD_REGEX.test(val)) {
      setPasswordError("Password must have uppercase, lowercase, number and special character (min 8 chars)");
    } else {
      setPasswordError("");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    if (editPassword && passwordError) {
      addToast({ title: "Please fix password errors before saving", color: "warning" });
      return;
    }
    try {
      await updateUser({
        id: selectedUser.userId,
        data: {
          displayName: editDisplayName || null,
          firstName: editFirstName || null,
          lastName: editLastName || null,
          username: editUsername || null,
          password: editPassword || null,
        },
      }).unwrap();
      addToast({ title: "User updated successfully", color: "success" });
      setIsEditModalOpen(false);
    } catch {
      addToast({ title: "Failed to update user", color: "danger" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center font-bold text-indigo-600 dark:text-cyan-400">
        Loading users...
      </div>
    );
  }

  if (!isLoading && users.length === 0) {
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
      
      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="flex-1 w-full sm:max-w-md">
           <Input
            isClearable
            className="w-full"
            placeholder="Search by username, name or email..."
            startContent={<Search size={18} className="text-slate-400" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
            variant="flat"
            classNames={{
              inputWrapper: "bg-white dark:bg-black/20 border-none shadow-sm h-12 rounded-xl",
            }}
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-white/50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
          {["all", "admin", "manager", "teacher", "student"].map((r) => (
            <Button
              key={r}
              size="sm"
              variant={roleFilter === r ? "solid" : "light"}
              color={roleFilter === r ? "primary" : "default"}
              onClick={() => setRoleFilter(r)}
              className={`
                capitalize font-bold h-9 px-4 rounded-lg
                ${roleFilter === r ? "shadow-md shadow-primary/20" : "text-slate-500"}
              `}
            >
              {r}
            </Button>
          ))}
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
            {items.length > 0 ? (
              items.map((u: ApiUser) => (
                <TableRow key={u.userId}>
                  <TableCell className="text-xs text-slate-400">#{u.userId.slice(0, 8)}...</TableCell>
                  <TableCell className="font-black">{u.username}</TableCell>
                  <TableCell>{u.displayName || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="primary">
                      {u.role}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content={u.role === 'admin' ? "Cannot edit admin account" : "Edit user"}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() => openEditModal(u)}
                          isDisabled={u.role === 'admin'}
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

                      <Tooltip content={u.role === 'admin' ? "Cannot lock admin account" : (u.status === false ? "Unlock account" : "Lock account")}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color={u.status === false ? "danger" : "primary"}
                          onPress={() => handleToggleLock(u)}
                          isDisabled={u.role === 'admin'}
                        >
                          {u.status === false ? <Lock size={16} /> : <Unlock size={16} />}
                        </Button>
                      </Tooltip>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                 <TableCell>{null}</TableCell>
                 <TableCell>{null}</TableCell>
                 <TableCell className="text-center py-20 text-slate-400 italic">No matches found for your search.</TableCell>
                 <TableCell>{null}</TableCell>
                 <TableCell>{null}</TableCell>
              </TableRow>
            )}
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
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        size="lg"
        classNames={{
          backdrop: "bg-black/70 backdrop-blur-md",
          base: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl",
          body: "p-0",
          header: "p-0",
          footer: "p-0",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* PREMIUM HEADER */}
              <ModalHeader>
                <div className="w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-8 pt-8 pb-6 relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
                  <div className="absolute -bottom-10 -left-4 w-24 h-24 rounded-full bg-white/5" />

                  <div className="flex items-center gap-5 relative z-10">
                    <Avatar
                      name={selectedUser?.displayName || selectedUser?.username}
                      size="lg"
                      className="ring-4 ring-white/20 text-white bg-white/10 font-black text-xl flex-shrink-0"
                    />
                    <div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Editing Account</p>
                      <h2 className="text-white text-xl font-black leading-tight">
                        {selectedUser?.displayName || selectedUser?.username}
                      </h2>
                      <p className="text-white/50 text-xs mt-1 font-medium">@{selectedUser?.username}</p>
                    </div>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="px-8 py-6 flex flex-col gap-5 bg-white dark:bg-[#0f172a]">

                  {/* First + Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={editFirstName}
                      onValueChange={setEditFirstName}
                      variant="bordered"
                      radius="lg"
                      startContent={<User size={15} className="text-indigo-400 flex-shrink-0" />}
                      classNames={{
                        label: "text-xs font-black uppercase tracking-wider text-slate-500",
                        inputWrapper: "border-slate-200 dark:border-white/10 hover:border-indigo-400 focus-within:border-indigo-500 transition-colors",
                      }}
                    />
                    <Input
                      label="Last Name"
                      value={editLastName}
                      onValueChange={setEditLastName}
                      variant="bordered"
                      radius="lg"
                      startContent={<User size={15} className="text-indigo-400 flex-shrink-0" />}
                      classNames={{
                        label: "text-xs font-black uppercase tracking-wider text-slate-500",
                        inputWrapper: "border-slate-200 dark:border-white/10 hover:border-indigo-400 focus-within:border-indigo-500 transition-colors",
                      }}
                    />
                  </div>

                  {/* Display Name */}
                  <Input
                    label="Display Name"
                    value={editDisplayName}
                    onValueChange={setEditDisplayName}
                    variant="bordered"
                    radius="lg"
                    startContent={<Sparkles size={15} className="text-purple-400 flex-shrink-0" />}
                    classNames={{
                      label: "text-xs font-black uppercase tracking-wider text-slate-500",
                      inputWrapper: "border-slate-200 dark:border-white/10 hover:border-purple-400 focus-within:border-purple-500 transition-colors",
                    }}
                  />

                  {/* Username */}
                  <Input
                    label="Username"
                    value={editUsername}
                    onValueChange={setEditUsername}
                    variant="bordered"
                    radius="lg"
                    startContent={<AtSign size={15} className="text-indigo-400 flex-shrink-0" />}
                    classNames={{
                      label: "text-xs font-black uppercase tracking-wider text-slate-500",
                      inputWrapper: "border-slate-200 dark:border-white/10 hover:border-indigo-400 focus-within:border-indigo-500 transition-colors",
                    }}
                  />

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security</span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                  </div>

                  {/* Password */}
                  <Input
                    label="New Password"
                    description="Leave blank to keep current password"
                    type="password"
                    value={editPassword}
                    onValueChange={handlePasswordChange}
                    variant="bordered"
                    radius="lg"
                    isInvalid={!!passwordError}
                    errorMessage={passwordError}
                    startContent={<LockIcon size={15} className="text-rose-400 flex-shrink-0" />}
                    classNames={{
                      label: "text-xs font-black uppercase tracking-wider text-slate-500",
                      inputWrapper: `border-slate-200 dark:border-white/10 transition-colors ${
                        passwordError
                          ? "border-rose-500 hover:border-rose-500 focus-within:border-rose-500"
                          : "hover:border-rose-400 focus-within:border-rose-500"
                      }`,
                      description: "text-slate-400 text-[11px]",
                    }}
                  />
                </div>
              </ModalBody>

              {/* FOOTER */}
              <ModalFooter>
                <div className="w-full flex gap-3 px-8 pb-7 pt-2 bg-white dark:bg-[#0f172a]">
                  <Button
                    fullWidth
                    variant="flat"
                    radius="lg"
                    onPress={onClose}
                    className="font-black uppercase tracking-wider h-12 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    radius="lg"
                    onPress={handleSaveEdit}
                    isLoading={isUpdating}
                    className="font-black uppercase tracking-wider h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
                  >
                    Save Changes
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}