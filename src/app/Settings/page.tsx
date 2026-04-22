"use client";
import React from "react";
import { Card, CardBody, Button, Switch } from "@heroui/react";
import { Edit3, User, Briefcase, Code2, Bell, Check, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import { useUpdateMeMutation } from "@/store/queries/usersProfile";
import { toast } from "sonner";

export default function SettingsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const basicInfo = [
    { key: "displayName", label: "Display Name", value: currentUser?.displayName || "Not set" },
    { key: "firstName", label: "First Name", value: currentUser?.firstName || "Not set" },
    { key: "lastName", label: "Last Name", value: currentUser?.lastName || "Not set" },
    { key: "email", label: "Email", value: currentUser?.email || "Not set", readOnly: true },
    { key: "github", label: "Github", value: "Your Github username or url" }, // Giả định trường này chưa có trong user type
  ];

  const handleEdit = (key: string, value: string) => {
    setEditingField(key);
    setTempValue(value === "Not set" ? "" : value);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSave = async (key: string) => {
    try {
      await updateMe({
        [key]: tempValue
      }).unwrap();
      toast.success(`${key} updated successfully!`);
      setEditingField(null);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to update ${key}`);
    }
  };


  return (
    <div className="flex flex-col gap-8 pb-10 p-2">
      {/* HEADER PAGE */}
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
          PROFILE <span className="text-[#FF5C00]">SETTINGS</span>
        </h1>
        <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] italic">
          Manage your profile and public information
        </p>
      </div>

      {/* BASIC INFO SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <User size={20} className="text-[#FF5C00]" />
          <h2 className="text-xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white">
            Basic Info
          </h2>
        </div>
        <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] shadow-sm overflow-hidden">
          <CardBody className="p-0 divide-y divide-slate-100 dark:divide-white/5">
            {basicInfo.map((info) => (
              <div
                key={info.key}
                className="flex items-center justify-between py-5 px-8 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-[10px] font-[1000] uppercase italic text-slate-400 tracking-widest w-40">
                  {info.label}
                </span>

                <div className="flex-1 flex items-center gap-4">
                  {editingField === info.key ? (
                    <input
                      autoFocus
                      className="bg-transparent border-b-2 border-[#FF5C00] text-sm font-bold text-[#071739] dark:text-slate-300 italic outline-none w-full max-w-md"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave(info.key);
                        if (e.key === "Escape") handleCancel();
                      }}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#071739] dark:text-slate-300 italic group-hover:text-[#FF5C00] transition-colors">
                      {info.value}
                    </span>
                  )}
                </div>

                {!info.readOnly && (
                  <div className="flex items-center gap-2">
                    {editingField === info.key ? (
                      <>
                        <Button
                          size="sm"
                          isIconOnly
                          variant="flat"
                          onPress={() => handleSave(info.key)}
                          isLoading={isUpdating}
                          className="bg-[#00FF41]/10 text-[#00FF41] rounded-xl hover:bg-[#00FF41] hover:text-[#071739]"
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          size="sm"
                          isIconOnly
                          variant="flat"
                          onPress={handleCancel}
                          className="bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"
                        >
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Edit3 size={14} />}
                        onPress={() => handleEdit(info.key, info.value)}
                        className="font-black uppercase text-[9px] tracking-widest bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#00FF41] hover:text-[#071739] transition-all"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      {/* NOTIFICATION PREFERENCES SECTION */}
      <section className="space-y-4 pb-10">
        <div className="flex items-center gap-3 px-2">
          <Bell size={20} className="text-[#FF5C00]" />
          <h2 className="text-xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white">
            Notifications
          </h2>
        </div>
        <Card className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] shadow-sm overflow-hidden">
          <CardBody className="p-0 divide-y divide-slate-100 dark:divide-white/5">
            <div className="flex items-center justify-between py-6 px-8 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-[10px] font-[1000] uppercase italic text-slate-400 tracking-widest w-40">
                Email Alerts
              </span>
              <span className="text-sm font-bold flex-1 text-slate-400 italic">
                Receive important updates via email
              </span>
              <Switch defaultSelected color="primary" />
            </div>
            <div className="flex items-center justify-between py-6 px-8 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-[10px] font-[1000] uppercase italic text-slate-400 tracking-widest w-40">
                Push Notifications
              </span>
              <span className="text-sm font-bold flex-1 text-slate-400 italic">
                In-app notifications for activities
              </span>
              <Switch defaultSelected color="primary" />
            </div>
            <div className="flex items-center justify-between py-6 px-8 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-[10px] font-[1000] uppercase italic text-slate-400 tracking-widest w-40">
                Marketing
              </span>
              <span className="text-sm font-bold flex-1 text-slate-400 italic">
                Special offers and event invites
              </span>
              <Switch color="primary" />
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
