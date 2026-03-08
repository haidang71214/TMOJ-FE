"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { useCreateClassMutation } from "@/store/queries/Class";
import { useModal } from "@/Provider/ModalProvider";

export default function CreateClassModal() {

  const { closeModal } = useModal();

  const [create_class, { isLoading }] = useCreateClassMutation();

  const [form, setForm] = useState({
    subjectId: "",
    semesterId: "",
    classCode: "",
    className: "",
    description: "",
    startDate: "",
    endDate: "",
    teacherId: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await create_class(form).unwrap();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-[500px]">
      <CardBody className="flex flex-col gap-4">

        <h2 className="text-xl font-bold">Create Class</h2>

        <Input
          label="Class Code"
          value={form.classCode}
          onChange={(e) => handleChange("classCode", e.target.value)}
        />

        <Input
          label="Class Name"
          value={form.className}
          onChange={(e) => handleChange("className", e.target.value)}
        />

        <Input
          label="Subject Id"
          value={form.subjectId}
          onChange={(e) => handleChange("subjectId", e.target.value)}
        />

        <Input
          label="Semester Id"
          value={form.semesterId}
          onChange={(e) => handleChange("semesterId", e.target.value)}
        />

        <Input
          label="Teacher Id"
          value={form.teacherId}
          onChange={(e) => handleChange("teacherId", e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-2">

          <Button
            variant="light"
            onPress={closeModal}
          >
            Cancel
          </Button>

          <Button
            color="primary"
            isLoading={isLoading}
            onPress={handleSubmit}
          >
            Create
          </Button>

        </div>

      </CardBody>
    </Card>
  );
}