"use client";

import { Card, CardBody, Button, Input } from "@heroui/react";
import { Mail, Lock, ShieldAlert, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useUpdateMeMutation, useUpdateAvatarMutation, useDeleteAvatarMutation } from "@/store/queries/usersProfile";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selected_file, set_selected_file] = useState<File | null>(null);
  const [avatar_preview, set_avatar_preview] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateMe, { isLoading: isUpdatingMe }] = useUpdateMeMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [deleteAvatar, { isLoading: isDeletingAvatar }] = useDeleteAvatarMutation();

  const handle_select_avatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set_selected_file(file);
    set_avatar_preview(URL.createObjectURL(file));
  };

  const handle_update_avatar = async () => {
    if (!selected_file) return;
    const form_data = new FormData();
    form_data.append("file", selected_file);
    try {
      await updateAvatar(form_data).unwrap();
      toast.success("Avatar updated successfully!");
      set_selected_file(null);
      set_avatar_preview(null); // Clear local preview to show fresh URL from store
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update avatar.");
    }
  };

  const handle_delete_avatar = async () => {
    try {
      await deleteAvatar().unwrap();
      toast.success("Avatar removed.");
      set_avatar_preview(null);
    } catch (error: any) {
      toast.error("Failed to remove avatar.");
    }
  };

  const handle_update_password = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await updateMe({
        password: newPassword
      }).unwrap();
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="space-y-10">
      {/* ===== ACCOUNT INFO ===== */}
      <section>
        <h2 className="text-2xl font-[900] italic uppercase tracking-tight mb-4">
          Account <span className="text-[#FF5C00]">Information</span>
        </h2>

        <Card className="bg-white dark:bg-[#071739] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/5">
          <CardBody className="p-6 md:p-8 space-y-6">
            <Input
              startContent={<Mail size={18} />}
              label="Email address"
              value={currentUser?.email || ""}
              variant="bordered"
              isDisabled
            />


            <Input
              label="Username"
              value={currentUser?.username || ""}
              variant="bordered"
              isDisabled
              description="Username cannot be changed"
            />

            <div className="flex justify-end">
              <Button
                isDisabled
                className="bg-slate-200 dark:bg-white/5 text-slate-400 font-bold rounded-xl px-6"
              >
                No changes to save
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* ===== PASSWORD ===== */}
      <section>
        <h2 className="text-2xl font-[900] italic uppercase tracking-tight mb-4">
          Password <span className="text-[#FF5C00]">Security</span>
        </h2>

        <Card className="bg-white dark:bg-[#071739] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/5">
          <CardBody className="p-6 md:p-8 space-y-6">
            <Input
              startContent={<Lock size={18} />}
              label="Current password"
              type="password"
              variant="bordered"
              value={currentPassword}
              onValueChange={setCurrentPassword}
            />

            <Input
              label="New password"
              type="password"
              variant="bordered"
              value={newPassword}
              onValueChange={setNewPassword}
            />

            <Input
              label="Confirm new password"
              type="password"
              variant="bordered"
              value={confirmPassword}
              onValueChange={setConfirmPassword}
            />

            <div className="flex justify-end">
              <Button
                className="bg-[#00FF41] text-[#071739] font-[900] rounded-xl px-6"
                onPress={handle_update_password}
                isLoading={isUpdatingMe}
              >
                Update password
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
      {/* ===== AVATAR ===== */}
      <section>
        <h2 className="text-2xl font-[900] italic uppercase tracking-tight mb-4">
          Profile <span className="text-[#FF5C00]">Avatar</span>
        </h2>

        <Card className="bg-white dark:bg-[#071739] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/5">
          <CardBody className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-6">
              {/* Avatar preview */}
              <div className="relative">
                <img
                  src={avatar_preview || (currentUser?.avatarUrl ? `${currentUser.avatarUrl}?t=${new Date().getTime()}` : "/default-avatar.png")}
                  alt="avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#FF5C00]/30 shadow-lg"
                />
              </div>

              {/* Upload control */}
              <div className="flex flex-col gap-3">
                <label className="font-bold">Upload new avatar</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handle_select_avatar}
                  className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-bold
              file:bg-[#FF5C00]/10 file:text-[#FF5C00]
              hover:file:bg-[#FF5C00]/20"
                />

                <div className="flex gap-2">
                  <Button
                    className="bg-[#FF5C00] text-white font-bold rounded-xl px-6 w-fit"
                    onPress={handle_update_avatar}
                    isDisabled={!selected_file}
                    isLoading={isUpdatingAvatar}
                  >
                    Update avatar
                  </Button>
                  {currentUser?.avatarUrl && (
                    <Button
                      variant="flat"
                      color="danger"
                      className="font-bold rounded-xl px-6"
                      onPress={handle_delete_avatar}
                      isLoading={isDeletingAvatar}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>


      {/* ===== SECURITY ===== */}
      <section>
        <h2 className="text-2xl font-[900] italic uppercase tracking-tight mb-4">
          Security <span className="text-[#FF5C00]">Settings</span>
        </h2>

        <Card className="bg-white dark:bg-[#071739] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/5">
          <CardBody className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-[#00FF41]" />
                <div>
                  <p className="font-bold">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-400">
                    Increase account security with 2FA
                  </p>
                </div>
              </div>

              <Button
                variant="bordered"
                className="border-[#00FF41] text-[#00FF41] font-bold rounded-xl"
              >
                Enable
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* ===== DANGER ZONE ===== */}
      <section>
        <h2 className="text-2xl font-[900] italic uppercase tracking-tight mb-4 text-red-500">
          Danger Zone
        </h2>

        <Card className="bg-red-500/5 dark:bg-red-500/10 rounded-[2.5rem] shadow-xl border border-red-500/20">
          <CardBody className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-500" />
                <div>
                  <p className="font-bold text-red-500">
                    Delete account
                  </p>
                  <p className="text-sm text-red-400">
                    This action is permanent and cannot be undone
                  </p>
                </div>
              </div>

              <Button
                className="bg-red-500 text-white font-bold rounded-xl"
              >
                Delete
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
