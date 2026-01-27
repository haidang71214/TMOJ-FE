"use client";

import React, { useState, useMemo } from "react";
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
  Input,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Edit3,
  UserPlus,
  Shield,
  Lock,
  Unlock,
  KeyRound,
  User,
  AlertTriangle,
  Users,
  BookOpen,
  Code,
} from "lucide-react";
import { useRouter } from "next/navigation";

const USERS_DATA = [
  {
    id: 1001,
    username: "admin_tmoj",
    fullName: "Nguyễn Văn Admin",
    email: "admin@tmoj.vn",
    role: "SuperAdmin",
    status: "Active",
    lastLogin: "2026-01-25 14:30",
    contestCreated: 42,
  },
  {
    id: 1002,
    username: "mod_hai",
    fullName: "Hải Moderator",
    email: "hai.mod@tmoj.vn",
    role: "Teacher",
    status: "Active",
    lastLogin: "2026-01-26 06:15",
    contestCreated: 8,
  },
  {
    id: 1003,
    username: "judge_khoa",
    fullName: "Trần Khoa Judge",
    email: "judge.khoa@tmoj.vn",
    role: "Manager",
    status: "Suspended",
    lastLogin: "2025-12-10 09:45",
    contestCreated: 1,
  },
  {
    id: 1004,
    username: "user_test",
    fullName: "Test Account",
    email: "test@example.com",
    role: "Student",
    status: "Active",
    lastLogin: "2026-01-20 22:10",
    contestCreated: 0,
  },
  {
    id: 1005,
    username: "banned_spam",
    fullName: "Nguyễn Spam",
    email: "spam@trash.com",
    role: "User",
    status: "Banned",
    lastLogin: "2025-11-05 03:22",
    contestCreated: 0,
  },
];

export default function AdminListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // State for managing users (mock updates)
  const [users, setUsers] = useState(USERS_DATA);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<(typeof USERS_DATA)[0] | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form data
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);

  // Handlers
  const openRoleModal = (user: (typeof USERS_DATA)[0]) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  const openPasswordModal = (user: (typeof USERS_DATA)[0]) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordModalOpen(true);
  };

  const openStatusModal = (user: (typeof USERS_DATA)[0]) => {
    setSelectedUser(user);
    setIsStatusModalOpen(true);
  };

  const openEditModal = (user: (typeof USERS_DATA)[0]) => {
    setSelectedUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setIsEditModalOpen(true);
  };

  const saveRole = () => {
    if (!selectedUser || !newRole) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
    );
    setIsRoleModalOpen(false);
  };

  const resetPassword = () => {
    if (!selectedUser) return;
    if (newPassword !== confirmPassword) return alert("Passwords do not match!");
    if (newPassword.length < 8) return alert("Password must be at least 8 characters!");
    alert(`Password reset successfully for ${selectedUser.username}`);
    setIsPasswordModalOpen(false);
  };

  const toggleStatus = () => {
    if (!selectedUser) return;
    const newStatus =
      selectedUser.status === "Active"
        ? "Suspended"
        : selectedUser.status === "Suspended"
        ? "Active"
        : selectedUser.status === "Banned"
        ? "Active"
        : "Suspended";

    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u))
    );
    setIsStatusModalOpen(false);
  };

  const saveEdit = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, fullName: editFullName, email: editEmail } : u
      )
    );
    setIsEditModalOpen(false);
  };

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
            Manage users, roles, permissions & security
          </p>
        </div>

        <Button
          startContent={<UserPlus size={18} />}
          onClick={() => router.push("/Management/Admin/create")}
          className="
            bg-indigo-600 text-white
            dark:bg-gradient-to-r dark:from-cyan-400 dark:to-fuchsia-500
            dark:text-black
            font-black h-11 px-6 rounded-xl shadow-lg
            uppercase text-[10px] tracking-wider
            active:scale-95
          "
        >
          Create New User
        </Button>
      </div>

      {/* FILTERS - you can keep your original filter section here */}

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
            <TableColumn>STATUS</TableColumn>
            <TableColumn>LAST LOGIN</TableColumn>
            <TableColumn>CONTESTS CREATED</TableColumn>
            <TableColumn className="text-right">ACTIONS</TableColumn>
          </TableHeader>

          <TableBody>
            {items.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                <TableCell className="text-slate-400 italic text-xs">#{u.id}</TableCell>
                <TableCell className="uppercase italic font-black tracking-tight text-black dark:text-white">
                  {u.username}
                </TableCell>
                <TableCell className="text-sm font-medium">{u.fullName}</TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    className={`
                      font-black uppercase text-[9px] px-3
                      ${
                        u.role === "SuperAdmin"
                          ? "bg-red-500/10 text-red-500"
                          : u.role === "Manager"
                          ? "bg-orange-500/10 text-orange-500"
                          : u.role === "Teacher"
                          ? "bg-purple-500/10 text-purple-500"
                          : u.role === "Student"
                          ? "bg-indigo-500/10 text-indigo-500"
                          : "bg-slate-500/10 text-slate-500"
                      }
                    `}
                  >
                    {u.role}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="dot"
                    color={
                      u.status === "Active"
                        ? "success"
                        : u.status === "Suspended"
                        ? "warning"
                        : "danger"
                    }
                    className="font-black uppercase text-[9px]"
                  >
                    {u.status}
                  </Chip>
                </TableCell>
                <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                  {u.lastLogin}
                </TableCell>
                <TableCell className="font-black">{u.contestCreated}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <Tooltip content="Edit Info">
                      <Button isIconOnly size="sm" variant="flat" onPress={() => openEditModal(u)}>
                        <Edit3 size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Change Role">
                      <Button isIconOnly size="sm" variant="flat" onPress={() => openRoleModal(u)}>
                        <Shield size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content={u.status === "Active" ? "Suspend" : "Activate"}>
                      <Button isIconOnly size="sm" variant="flat" onPress={() => openStatusModal(u)}>
                        {u.status === "Active" ? <Lock size={16} /> : <Unlock size={16} />}
                      </Button>
                    </Tooltip>

                    <Tooltip content="Reset Password">
                      <Button isIconOnly size="sm" variant="flat" onPress={() => openPasswordModal(u)}>
                        <KeyRound size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center py-6">
          <Pagination
            isCompact
            showControls
            page={page}
            total={pages}
            onChange={(p) => setPage(p)}
            classNames={{
              cursor: "bg-indigo-600 text-white dark:bg-cyan-400 dark:text-black font-bold",
            }}
          />
        </div>
      </div>

      {/* MODAL - EDIT BASIC INFO */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-black uppercase">
                Edit User <span className="text-fuchsia-500">{selectedUser?.username}</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Input
                  label="Full Name"
                  value={editFullName}
                  onValueChange={setEditFullName}
                />
                <Input
                  label="Email"
                  type="email"
                  value={editEmail}
                  onValueChange={setEditEmail}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button
                  className="bg-indigo-600 text-white font-black"
                  onPress={() => {
                    saveEdit();
                    onClose();
                  }}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL - CHANGE ROLE */}
      <Modal isOpen={isRoleModalOpen} onOpenChange={setIsRoleModalOpen} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase">
                Change Role - <span className="text-indigo-600">{selectedUser?.username}</span>
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Select
                  label="Select New Role"
                  defaultSelectedKeys={[newRole]}
                  onChange={(e) => setNewRole(e.target.value)}
                  classNames={{
                    trigger: "rounded-xl h-12 border-2 border-transparent focus-within:border-indigo-600",
                  }}
                >
                  <SelectItem
                    key="SuperAdmin"
                    startContent={<Shield size={16} className="text-red-500" />}
                  >
                    SuperAdmin (Full system access)
                  </SelectItem>
                  <SelectItem
                    key="Manager"
                    startContent={<Users size={16} className="text-orange-500" />}
                  >
                    Manager (Manage contests, basic user oversight)
                  </SelectItem>
                  <SelectItem
                    key="Teacher"
                    startContent={<BookOpen size={16} className="text-purple-500" />}
                  >
                    Teacher (Create problems, contests, grade submissions)
                  </SelectItem>
                  <SelectItem
                    key="Student"
                    startContent={<Code size={16} className="text-indigo-500" />}
                  >
                    Student (Participate in learning, contests, practice)
                  </SelectItem>
                  <SelectItem
                    key="User"
                    startContent={<User size={16} className="text-slate-500" />}
                  >
                    User (Basic account)
                  </SelectItem>
                </Select>

                <div className="text-xs text-slate-500 mt-2">
                  Current role: <span className="font-bold text-indigo-600">{selectedUser?.role}</span>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button
                  className="bg-indigo-600 text-white font-black"
                  onPress={() => {
                    saveRole();
                    onClose();
                  }}
                >
                  Update Role
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL - RESET PASSWORD */}
      <Modal isOpen={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase">
                Reset Password - <span className="text-red-600">{selectedUser?.username}</span>
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onValueChange={setNewPassword}
                  placeholder="Minimum 8 characters"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onValueChange={setConfirmPassword}
                  placeholder="Confirm new password"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button
                  className="bg-red-600 text-white font-black"
                  isDisabled={newPassword.length < 8 || newPassword !== confirmPassword}
                  onPress={() => {
                    resetPassword();
                    onClose();
                  }}
                >
                  Reset Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL - CONFIRM SUSPEND / ACTIVATE */}
      <Modal isOpen={isStatusModalOpen} onOpenChange={setIsStatusModalOpen} size="xs">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase flex items-center gap-3">
                <AlertTriangle className="text-orange-500" size={24} />
                {selectedUser?.status === "Active" ? "Suspend" : "Activate"} User
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  Are you sure you want to{" "}
                  <span className="font-bold">
                    {selectedUser?.status === "Active" ? "SUSPEND" : "ACTIVATE"}
                  </span>{" "}
                  the account <span className="font-black">{selectedUser?.username}</span>?
                </p>
                {selectedUser?.status === "Active" && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    The user will not be able to log in until reactivated.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button
                  color={selectedUser?.status === "Active" ? "danger" : "success"}
                  onPress={() => {
                    toggleStatus();
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}