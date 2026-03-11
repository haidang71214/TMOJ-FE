"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  addToast,
} from "@heroui/react";

import {
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
} from "@/store/queries/Semester";
import { RequiredStar } from "@/Provider/RequiredStar";
import { ErrorForm } from "@/types";
import { useModal } from "@/Provider/ModalProvider";

export default function CreateUpdateSemesterModal({
  semester,
}: {
  semester?: any;
}) {
  const { closeModal } = useModal();
  const [createSemester, { isLoading: creating }] = useCreateSemesterMutation();
  const [updateSemester, { isLoading: updating }] = useUpdateSemesterMutation();

  const [form, setForm] = useState({
    code: "",
    name: "",
    startAt: "",
    endAt: "",
  });

  useEffect(() => {
    if (semester) {
      setForm({
        code: semester.code,
        name: semester.name,
        startAt: semester.startAt,
        endAt: semester.endAt,
      });
    } else {
      setForm({
        code: "",
        name: "",
        startAt: "",
        endAt: "",
      });
    }
  }, [semester]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!semester) {
        if (!form.code || !form.name || !form.startAt || !form.endAt) {
          addToast({
            title: "Missing fields",
            description: "Please fill all required fields",
            color: "warning",
          });
          return;
        }
      }

      const today = new Date().toISOString().split("T")[0];

      if (!semester && form.startAt < today) {
        addToast({
          title: "Invalid date",
          description: "Start date cannot be before today",
          color: "warning",
        });
        return;
      }

      if (semester) {
        await updateSemester({
          id: semester.semesterId,
          data: {
            ...form,
            isActive: semester.isActive,
          },
        }).unwrap();

        addToast({
          title: "Success",
          description: "Semester updated successfully",
          color: "success",
        });
      } else {
        await createSemester(form).unwrap();

        addToast({
          title: "Success",
          description: "Semester created successfully",
          color: "success",
        });
      }

      closeModal();
    } catch (err) {
      const error = err as ErrorForm;
      addToast({
        title: "Error",
        description: error?.data?.data?.message || "Semester action failed",
        color: "danger",
      });
    }
  };

  return (
     <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {semester ? "Update Semester" : "Create Semester"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Manage semester information
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Input
          label={
            <div className="flex items-center gap-1">
              Semester Code
              <RequiredStar rules={["Semester code is required", "Max 10 characters"]} />
            </div>
          }
          placeholder="Ex: SEM01"
          value={form.code}
          maxLength={10}
          variant="faded"
          onChange={(e) => handleChange("code", e.target.value)}
          classNames={{
            label: "text-sm font-semibold text-gray-700 dark:text-slate-300",
            inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200",
          }}
        />

        <Input
          label={
            <div className="flex items-center gap-1">
              Semester Name
              <RequiredStar rules={["Semester name is required", "Max 10 characters"]} />
            </div>
          }
          placeholder="Ex: Spring 2024"
          value={form.name}
          maxLength={10}
          variant="faded"
          onChange={(e) => handleChange("name", e.target.value)}
          classNames={{
            label: "text-sm font-semibold text-gray-700 dark:text-slate-300",
            inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200",
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label={
              <div className="flex items-center gap-1">
                Start Date
                <RequiredStar rules={["Start date is required", "Cannot be before today"]} />
              </div>
            }
            variant="faded"
            value={form.startAt}
            onChange={(e) => handleChange("startAt", e.target.value)}
            classNames={{
              label: "text-sm font-semibold text-gray-700 dark:text-slate-300",
              inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200",
            }}
          />

          <Input
            type="date"
            label={
              <div className="flex items-center gap-1">
                End Date
                <RequiredStar rules={["End date is required", "Must be after start date"]} />
              </div>
            }
            variant="faded"
            value={form.endAt}
            onChange={(e) => handleChange("endAt", e.target.value)}
            classNames={{
              label: "text-sm font-semibold text-gray-700 dark:text-slate-300",
              inputWrapper: "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200",
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="light"
          onPress={closeModal}
          className="font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10"
        >
          Cancel
        </Button>

        <Button
          color="primary"
          onPress={handleSubmit}
          isLoading={creating || updating}
          className="font-semibold"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          {semester ? "Update Semester" : "Create Semester"}
        </Button>
      </div>
    </div>
  );
}
