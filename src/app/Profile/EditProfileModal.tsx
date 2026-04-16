"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  Divider,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import { User, Sparkles, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateMeMutation } from "@/store/queries/usersProfile";
import { Users } from "@/types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Users | null;
}

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function EditProfileModal({ isOpen, onClose, profile }: EditProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [updateMe, { isLoading }] = useUpdateMeMutation();

  // Pre-fill khi mở modal
  useEffect(() => {
    if (isOpen && profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setDisplayName(profile.displayName ?? "");
      setPassword("");
      setPasswordError("");
    }
  }, [isOpen, profile]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (!val) {
      setPasswordError("");
    } else if (!PASSWORD_REGEX.test(val)) {
      setPasswordError("Must have uppercase, lowercase, number & special char (min 8)");
    } else {
      setPasswordError("");
    }
  };

  const handleSave = async () => {
    if (password && passwordError) {
      addToast({ title: "Fix password errors first", color: "warning" });
      return;
    }
    try {
      await updateMe({
        firstName: firstName || null,
        lastName: lastName || null,
        displayName: displayName || null,
        password: password || null,
      }).unwrap();
      addToast({ title: "Profile updated successfully!", color: "success" });
      onClose();
    } catch {
      addToast({ title: "Failed to update profile", color: "danger" });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
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
        {(onCloseInner) => (
          <>
            {/* HEADER */}
            <ModalHeader>
              <div className="w-full bg-gradient-to-br from-[#FF5C00] via-orange-600 to-rose-700 px-8 pt-8 pb-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 -left-4 w-24 h-24 rounded-full bg-white/5" />
                <div className="flex items-center gap-5 relative z-10">
                  <Avatar
                    name={profile?.displayName || profile?.username}
                    src={profile?.avatarUrl ?? undefined}
                    size="lg"
                    className="ring-4 ring-white/20 text-white bg-white/10 font-black text-xl flex-shrink-0"
                  />
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                      Editing Profile
                    </p>
                    <h2 className="text-white text-xl font-black leading-tight">
                      {profile?.displayName || profile?.username}
                    </h2>
                    <p className="text-white/50 text-xs mt-1 font-medium">
                      @{profile?.username}
                    </p>
                  </div>
                </div>
              </div>
            </ModalHeader>

            {/* BODY */}
            <ModalBody>
              <div className="px-8 py-6 flex flex-col gap-5 bg-white dark:bg-[#0f172a]">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onValueChange={setFirstName}
                    variant="bordered"
                    radius="lg"
                    startContent={<User size={15} className="text-[#FF5C00] flex-shrink-0" />}
                    classNames={{
                      label: "text-xs font-black uppercase tracking-wider text-slate-500",
                      inputWrapper:
                        "border-slate-200 dark:border-white/10 hover:border-[#FF5C00] focus-within:border-[#FF5C00] transition-colors",
                    }}
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onValueChange={setLastName}
                    variant="bordered"
                    radius="lg"
                    startContent={<User size={15} className="text-[#FF5C00] flex-shrink-0" />}
                    classNames={{
                      label: "text-xs font-black uppercase tracking-wider text-slate-500",
                      inputWrapper:
                        "border-slate-200 dark:border-white/10 hover:border-[#FF5C00] focus-within:border-[#FF5C00] transition-colors",
                    }}
                  />
                </div>

                <Input
                  label="Display Name"
                  value={displayName}
                  onValueChange={setDisplayName}
                  variant="bordered"
                  radius="lg"
                  startContent={<Sparkles size={15} className="text-orange-400 flex-shrink-0" />}
                  classNames={{
                    label: "text-xs font-black uppercase tracking-wider text-slate-500",
                    inputWrapper:
                      "border-slate-200 dark:border-white/10 hover:border-orange-400 focus-within:border-orange-500 transition-colors",
                  }}
                />

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security</span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                </div>

                <Input
                  label="New Password"
                  description="Leave blank to keep current password"
                  type="password"
                  value={password}
                  onValueChange={handlePasswordChange}
                  variant="bordered"
                  radius="lg"
                  isInvalid={!!passwordError}
                  errorMessage={passwordError}
                  startContent={<Lock size={15} className="text-rose-400 flex-shrink-0" />}
                  classNames={{
                    label: "text-xs font-black uppercase tracking-wider text-slate-500",
                    inputWrapper: `border-slate-200 dark:border-white/10 transition-colors ${
                      passwordError
                        ? "border-rose-500 hover:border-rose-500"
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
                  onPress={onCloseInner}
                  className="font-black uppercase tracking-wider h-12 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  radius="lg"
                  onPress={handleSave}
                  isLoading={isLoading}
                  className="font-black uppercase tracking-wider h-12 bg-gradient-to-r from-[#FF5C00] to-rose-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
                >
                  Save Changes
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
