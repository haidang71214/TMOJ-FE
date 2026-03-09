"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
  Divider,
} from "@heroui/react";

import { CalendarDays } from "lucide-react";

import {
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
} from "@/store/queries/Semester";
import { RequiredStar } from "@/Provider/RequiredStar";


export default function CreateUpdateSemester({
  open,
  setOpen,
  semester,
}: any) {
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

      if (form.startAt < today) {
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
          data: form,
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

      setOpen(false);
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err?.data?.data?.message || "Semester action failed",
        color: "danger",
      });
    }
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      size="2xl"
      backdrop="blur"
      classNames={{
        base: "rounded-2xl",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-primary" size={22} />
            <h2 className="text-xl font-semibold">
              {semester ? "Update Semester" : "Create Semester"}
            </h2>
          </div>

          <p className="text-sm text-default-500">
            Manage semester information for the system
          </p>
        </ModalHeader>

        <Divider />

        <ModalBody className="grid grid-cols-2 gap-5 py-6">

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
            variant="bordered"
            description="Required • Max 10 characters"
            onChange={(e) => handleChange("code", e.target.value)}
          />

          <Input
            label={
              <div className="flex items-center gap-1">
                Semester Name
                <RequiredStar rules={["Semester name is required", "Max 10 characters"]} />
              </div>
            }
            placeholder="Ex: Spring"
            value={form.name}
            maxLength={10}
            variant="bordered"
            description="Required • Max 10 characters"
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <Input
            type="date"
            label={
              <div className="flex items-center gap-1">
                Start Date
                <RequiredStar rules={["Start date is required", "Cannot be before today"]} />
              </div>
            }
            variant="bordered"
            description="Cannot be before today"
            value={form.startAt}
            onChange={(e) => handleChange("startAt", e.target.value)}
          />

          <Input
            type="date"
            label={
              <div className="flex items-center gap-1">
                End Date
                <RequiredStar rules={["End date is required", "Must be after start date"]} />
              </div>
            }
            variant="bordered"
            description="Must be after start date"
            value={form.endAt}
            onChange={(e) => handleChange("endAt", e.target.value)}
          />

        </ModalBody>

        <Divider />

        <ModalFooter className="flex justify-between">

          <Button
            variant="flat"
            color="default"
            onPress={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            color="primary"
            radius="lg"
            className="px-6 font-medium"
            onPress={handleSubmit}
            isLoading={creating || updating}
          >
            {semester ? "Update Semester" : "Create Semester"}
          </Button>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}