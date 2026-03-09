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
} from "@heroui/react";

import {
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
} from "@/store/queries/Semester";

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
          timeout: 4000,
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
    timeout: 4000,
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
      const data =  await createSemester(form).unwrap();
      console.log(data);
      
      addToast({
        title: "Success",
        description: "Semester created successfully",
        color: "success",
      });
    }

    // chỉ đóng khi success
    setOpen(false);
  } catch (err: any) {
    addToast({
      title: "Error",
      description: err?.data?.data?.message || "Semester action failed",
      color: "danger",
      timeout: 5000,
    });
  }
};

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader>
          {semester ? "Update Semester" : "Create Semester"}
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <Input
  label="Code"
  value={form.code}
  maxLength={10}
  onChange={(e) => handleChange("code", e.target.value)}
  isRequired
/>

<Input
  label="Name"
  value={form.name}
  maxLength={10}
  onChange={(e) => handleChange("name", e.target.value)}
  isRequired
/>
          <Input
            type="date"
            label="Start Date"
            value={form.startAt}
            onChange={(e) => handleChange("startAt", e.target.value)}
            isRequired
          />

          <Input
            type="date"
            label="End Date"
            value={form.endAt}
            onChange={(e) => handleChange("endAt", e.target.value)}
            isRequired
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={creating || updating}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}